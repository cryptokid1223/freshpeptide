'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import type { BriefOutput } from '@/lib/supabase';

export default function GeneratePage() {
  const router = useRouter();
  const [isGenerating, setIsGenerating] = useState(false);
  const [brief, setBrief] = useState<BriefOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string>('');

  useEffect(() => {
    const loadBrief = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        router.push('/auth');
        return;
      }

      // Check if intake is completed - retry a few times in case data is still being saved
      let intakeRecord = null;
      for (let i = 0; i < 5; i++) {
        const { data: record } = await supabase
          .from('intake')
          .select('intake_data')
          .eq('user_id', session.user.id)
          .maybeSingle();

        if (record?.intake_data) {
          intakeRecord = record;
          break;
        }
        
        // Wait before retry (longer wait for first few attempts)
        await new Promise(resolve => setTimeout(resolve, i < 2 ? 1000 : 500));
      }

      if (!intakeRecord?.intake_data) {
        // Check if user just completed intake (has it in localStorage)
        const intakeCompleted = localStorage.getItem('intake_completed');
        const intakeData = localStorage.getItem('intake_data');
        
        if (intakeCompleted === 'true' && intakeData) {
          // User just completed intake, data might still be syncing
          // Don't redirect, let them try to generate
          console.log('Intake completed but data not yet in Supabase, allowing generation attempt');
          return;
        }
        
        // No intake data found, redirect to consent
        router.push('/consent');
        return;
      }

      // Load existing brief
      const { data: briefRecords } = await supabase
        .from('briefs')
        .select('brief_output')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false })
        .limit(1);

      if (briefRecords && briefRecords.length > 0) {
        setBrief(briefRecords[0].brief_output as BriefOutput);
      }
    };

    loadBrief();
  }, [router]);

  const handleGenerate = async () => {
    setIsGenerating(true);
    setError(null);
    setStatusMessage('Analyzing your health profile...');

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      // Get intake data - try multiple times if needed
      let intakeRecord = null;
      for (let i = 0; i < 3; i++) {
        const { data: record } = await supabase
          .from('intake')
          .select('intake_data')
          .eq('user_id', session.user.id)
          .maybeSingle();

        if (record?.intake_data) {
          intakeRecord = record;
          break;
        }
        
        // Wait before retry
        await new Promise(resolve => setTimeout(resolve, 500));
      }

      // If still not found, try localStorage as fallback
      if (!intakeRecord?.intake_data) {
        const localData = localStorage.getItem('intake_data');
        if (localData) {
          try {
            intakeRecord = { intake_data: JSON.parse(localData) };
            console.log('Using intake data from localStorage as fallback');
          } catch (e) {
            console.error('Failed to parse localStorage data:', e);
          }
        }
      }

      if (!intakeRecord?.intake_data) {
        throw new Error('Please complete your health intake first. Redirecting...');
      }

      setStatusMessage('Generating personalized recommendations...');

      console.log('📡 Calling generate-brief API...');
      console.log('Request data:', {
        userId: session.user.id,
        hasIntakeData: !!intakeRecord.intake_data,
        intakeDataKeys: intakeRecord.intake_data ? Object.keys(intakeRecord.intake_data) : [],
      });

      // Call API to generate brief
      const response = await fetch('/api/generate-brief', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: session.user.id,
          intakeData: intakeRecord.intake_data,
        }),
      });

      console.log('API Response status:', response.status, response.statusText);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error response:', errorText);
        throw new Error(`Failed to generate brief: ${response.statusText}`);
      }

      const result = await response.json();
      console.log('✅ API Response received:', {
        success: result.success,
        hasBrief: !!result.brief,
        model: result.model,
        peptideCount: result.brief?.candidatePeptides?.length || 0,
      });
      
      setStatusMessage('Saving your stack...');

      // CRITICAL: Ensure user profile exists before saving brief
      console.log('🔍 Checking if profile exists for user:', session.user.id);
      const { data: existingProfile, error: profileCheckError } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', session.user.id)
        .maybeSingle();

      if (profileCheckError) {
        console.warn('Error checking profile:', profileCheckError);
      }

      if (!existingProfile) {
        console.log('⚠️ Profile not found, creating profile...');
        // Create profile if it doesn't exist
        const { error: profileCreateError } = await supabase
          .from('profiles')
          .insert({
            id: session.user.id,
            email: session.user.email || '',
            created_at: new Date().toISOString(),
          });

        if (profileCreateError) {
          console.error('❌ Failed to create profile:', profileCreateError);
          
          // Check if error is due to email conflict (profile exists with different ID)
          if (profileCreateError.code === '23505' && profileCreateError.message?.includes('email')) {
            console.log('⚠️ Profile with this email exists but different ID. Checking...');
            
            // Check if there's a profile with this email
            const { data: emailProfile } = await supabase
              .from('profiles')
              .select('id, email')
              .eq('email', session.user.email)
              .maybeSingle();
            
            if (emailProfile && emailProfile.id !== session.user.id) {
              // Profile exists with different ID - this is a data integrity issue
              throw new Error(`Profile mismatch detected. Please run the SQL fix script in Supabase to resolve this. Error: ${profileCreateError.message}`);
            }
          }
          
          // If we can't create profile, we can't save the brief
          throw new Error(`Failed to create user profile: ${profileCreateError.message || 'Database error'}. Please contact support or run the SQL fix script.`);
        }
        console.log('✅ Profile created successfully');
      } else {
        console.log('✅ Profile exists');
      }

      // Check if brief already exists
      const { data: existingBriefs, error: checkError } = await supabase
        .from('briefs')
        .select('id')
        .eq('user_id', session.user.id);

      if (checkError) {
        console.warn('Error checking existing briefs:', checkError);
      }

      let saveError = null;

      if (existingBriefs && existingBriefs.length > 0) {
        // Try to update existing brief
        console.log('Updating existing brief...');
        const { error: updateError } = await supabase
          .from('briefs')
          .update({
            brief_output: result.brief,
            model_name: result.model,
            created_at: new Date().toISOString(),
          })
          .eq('user_id', session.user.id);

        saveError = updateError;
        
        if (updateError) {
          console.warn('Update failed, trying insert instead:', updateError.message);
          // If update fails (no UPDATE policy), try insert
          const { error: insertError } = await supabase
            .from('briefs')
            .insert({
              user_id: session.user.id,
              brief_output: result.brief,
              model_name: result.model,
            });
          saveError = insertError;
          console.log('Inserted new brief (after update failed):', insertError ? 'ERROR' : 'SUCCESS');
        } else {
          console.log('✅ Updated existing brief successfully');
        }
      } else {
        // Insert new brief
        console.log('Inserting new brief...');
        const { error: insertError } = await supabase
          .from('briefs')
          .insert({
            user_id: session.user.id,
            brief_output: result.brief,
            model_name: result.model,
          });

        saveError = insertError;
        console.log('Inserted new brief:', insertError ? 'ERROR' : 'SUCCESS');
      }

      if (saveError) {
        console.error('❌ Error saving brief:', saveError);
        console.error('Error details:', JSON.stringify(saveError, null, 2));
        console.error('Error code:', saveError.code);
        console.error('Error hint:', saveError.hint);
        
        // Provide helpful error message
        let errorMessage = 'Failed to save your stack. ';
        if (saveError.code === '42501') {
          errorMessage += 'Database permission error. Please contact support.';
        } else if (saveError.message) {
          errorMessage += saveError.message;
        } else {
          errorMessage += 'Please try again.';
        }
        
        throw new Error(errorMessage);
      }
      
      console.log('✅ Brief saved successfully to database');

      setBrief(result.brief);
      setStatusMessage('Complete!');
      
      // Refresh the page data after a short delay to ensure it's saved
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (err: any) {
      const errorMessage = err.message || 'Something went wrong';
      setError(errorMessage);
      
      // If error is about missing intake, redirect after a moment
      if (errorMessage.includes('complete your health intake')) {
        setTimeout(() => {
          router.push('/consent');
        }, 2000);
      }
    } finally {
      setTimeout(() => {
      setIsGenerating(false);
        setStatusMessage('');
      }, 1000);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-[#FDFCFA]">
      {/* Top Navigation */}
      <nav className="fixed top-0 left-0 right-0 bg-white/90 backdrop-blur-md border-b border-[#D4C4B0] z-50">
        <div className="container mx-auto px-6 py-3 max-w-7xl flex items-center justify-between">
          <Link href="/" className="hover:opacity-80 transition-opacity">
            <img 
              src="/logo.png" 
              alt="FreshPeptide" 
              className="h-16 w-auto object-contain"
            />
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/dashboard">
              <Button variant="ghost" className="text-[#5C4A3A] hover:text-[#3E3028] hover:bg-[#F5EFE7] font-medium">
                Dashboard
              </Button>
            </Link>
            <Link href="/library">
              <Button variant="ghost" className="text-[#5C4A3A] hover:text-[#3E3028] hover:bg-[#F5EFE7] font-medium">
                Library
              </Button>
            </Link>
            <Button onClick={handleSignOut} className="bg-[#8B6F47] text-white hover:bg-[#6F5839] font-medium px-6 rounded-lg">
              Sign Out
            </Button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-6 pt-28 pb-24 max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-[#3E3028] mb-3">
            Your Personalized Stack
              </h1>
          <p className="text-[#5C4A3A] text-lg">
            AI-generated peptide recommendations based on your health profile
                </p>
              </div>

        {/* Generate Button */}
        {!brief && (
          <div className="text-center mb-12">
            <Button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="bg-[#8B6F47] text-white hover:bg-[#6F5839] font-bold px-12 py-6 rounded-2xl text-xl shadow-lg disabled:opacity-50"
            >
              {isGenerating ? '🧬 Generating...' : '🧬 Generate My Stack'}
            </Button>
            {statusMessage && (
              <p className="text-[#8B6F47] mt-4 font-medium">{statusMessage}</p>
            )}
              {error && (
              <p className="text-red-600 mt-4">{error}</p>
            )}
                </div>
              )}

        {/* Regenerate Button */}
        {brief && (
          <div className="text-center mb-8">
              <Button
                onClick={handleGenerate}
                disabled={isGenerating}
              variant="outline"
              className="border-2 border-[#8B6F47] text-[#8B6F47] hover:bg-[#F5EFE7] font-semibold px-8 py-3 rounded-xl"
              >
              {isGenerating ? 'Regenerating...' : '🔄 Regenerate Stack'}
                  </Button>
                </div>
        )}

        {/* Brief Display */}
        {brief && (
          <div className="space-y-8">
            {/* Goal Alignment */}
            <div className="bg-gradient-to-br from-[#F5EFE7] to-white border-2 border-[#D4C4B0] rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-[#3E3028] mb-4">Why These Peptides?</h2>
              <p className="text-[#5C4A3A] leading-relaxed text-lg">{brief.goalAlignment}</p>
            </div>

            {/* Recommended Peptides */}
            <div>
              <h2 className="text-3xl font-bold text-[#3E3028] mb-6">Your Peptides</h2>
              <div className="space-y-6">
                {brief.candidatePeptides?.map((peptide: any, index: number) => (
                  <div key={index} className="bg-white border-2 border-[#D4C4B0] rounded-2xl p-8 hover:border-[#8B6F47] transition-all">
                    <h3 className="text-3xl font-bold text-[#3E3028] mb-4">{peptide.name}</h3>
                    
                    <div className="space-y-6">
                      <div>
                        <p className="text-sm font-semibold text-[#8B6F47] mb-2">Why this peptide?</p>
                        <p className="text-[#5C4A3A] leading-relaxed text-lg">{peptide.why}</p>
                      </div>

                      <div className="bg-[#F5EFE7] border border-[#D4C4B0] rounded-xl p-6">
                        <p className="text-sm font-semibold text-[#8B6F47] mb-2">💊 Dosage</p>
                        <p className="text-[#3E3028] font-bold text-xl mb-2">{peptide.recommendedDosage}</p>
                        {peptide.timing && (
                          <div className="text-sm text-[#5C4A3A] space-y-1 mt-3">
                            <p><strong>How often:</strong> {peptide.timing.frequency}</p>
                            <p><strong>When:</strong> {peptide.timing.timeOfDay}</p>
                            {peptide.timing.withFood && <p><strong>With food:</strong> {peptide.timing.withFood}</p>}
                          </div>
                        )}
                      </div>

                      <div>
                        <p className="text-sm font-semibold text-[#8B6F47] mb-2">✅ Potential Benefits</p>
                        <ul className="space-y-2">
                          {peptide.potentialBenefits?.map((benefit: string, i: number) => (
                            <li key={i} className="flex items-start gap-2 text-[#5C4A3A]">
                              <span className="text-[#8B6F47]">•</span>
                              <span>{benefit}</span>
                            </li>
                          ))}
                        </ul>
                </div>

                      <div>
                        <p className="text-sm font-semibold text-red-700 mb-2">⚠️ Possible Side Effects</p>
                        <ul className="space-y-2">
                          {peptide.sideEffects?.map((effect: string, i: number) => (
                            <li key={i} className="flex items-start gap-2 text-[#5C4A3A]">
                              <span className="text-red-600">•</span>
                              <span>{effect}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Research Evidence */}
            {brief.evidenceList && brief.evidenceList.length > 0 && (
              <div>
                <h2 className="text-3xl font-bold text-[#3E3028] mb-6">Research Evidence</h2>
                <div className="space-y-4">
                  {brief.evidenceList.map((evidence: any, index: number) => (
                    <div key={index} className="bg-white border border-[#E8DCC8] rounded-xl p-6">
                      <h4 className="font-bold text-[#3E3028] mb-2">{evidence.title} ({evidence.year})</h4>
                      <p className="text-sm text-[#8B6F47] mb-2">{evidence.source}</p>
                      <p className="text-[#5C4A3A] mb-3 leading-relaxed">{evidence.summary}</p>
                      {evidence.url && (
                        <a 
                          href={evidence.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-[#8B6F47] hover:text-[#6F5839] font-semibold text-sm"
                        >
                          View on PubMed →
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Important Warnings */}
            {brief.keyRisks && brief.keyRisks.length > 0 && (
              <div className="bg-orange-50 border-2 border-orange-200 rounded-2xl p-6">
                <h3 className="text-xl font-bold text-orange-900 mb-4 flex items-center gap-2">
                  <span className="text-2xl">⚠️</span>
                  Important Safety Information
                </h3>
                <ul className="space-y-2">
                  {brief.keyRisks.map((risk: string, i: number) => (
                    <li key={i} className="flex items-start gap-2 text-orange-900">
                      <span>•</span>
                      <span>{risk}</span>
                    </li>
                  ))}
                </ul>
                    </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-4 justify-center">
              <Link href="/tracking">
                <Button className="bg-[#8B6F47] text-white hover:bg-[#6F5839] font-semibold px-8 py-4 rounded-xl text-lg">
                  Start Tracking →
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button variant="outline" className="border-2 border-[#D4C4B0] text-[#5C4A3A] hover:bg-[#F5EFE7] font-semibold px-8 py-4 rounded-xl text-lg">
                  Back to Dashboard
                </Button>
              </Link>
              </div>
            </div>
          )}
      </main>

      {/* Research Disclaimer - Small Bottom Right */}
      <div className="absolute bottom-4 right-4">
        <p className="text-xs text-gray-400">
          Research purposes only
        </p>
      </div>
    </div>
  );
}
