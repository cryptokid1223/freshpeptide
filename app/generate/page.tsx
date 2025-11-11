'use client';

import React, { useState, useEffect } from 'react';
import { MainLayout } from '@/components/MainLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import type { BriefOutput } from '@/lib/supabase';

export default function GeneratePage() {
  const router = useRouter();
  const [isGenerating, setIsGenerating] = useState(false);
  const [brief, setBrief] = useState<BriefOutput | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if intake is completed
    const intakeCompleted = localStorage.getItem('intake_completed');
    if (!intakeCompleted) {
      router.push('/intake');
    }

    // Check if brief already exists
    const savedBrief = localStorage.getItem('generated_brief');
    if (savedBrief) {
      setBrief(JSON.parse(savedBrief));
    }
  }, [router]);

  const handleGenerate = async () => {
    setIsGenerating(true);
    setError(null);

    try {
      const intakeData = localStorage.getItem('intake_data');
      
      if (!intakeData) {
        throw new Error('No intake data found. Please complete the questionnaire first.');
      }

      // Get the current session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error('Session error:', sessionError);
        throw new Error('Authentication error. Please sign in again.');
      }

      if (!session?.user) {
        console.error('No session found');
        throw new Error('Not authenticated. Please sign in again.');
      }

      const user = session.user;
      console.log('Generating brief for user:', user.id);

      const response = await fetch('/api/generate-brief', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          intakeData: JSON.parse(intakeData),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate brief');
      }

      const data = await response.json();
      console.log('Brief generated successfully:', data.model);
      setBrief(data.brief);
      
      // Save to localStorage for quick access
      localStorage.setItem('generated_brief', JSON.stringify(data.brief));
      
      // Save to Supabase
      await supabase
        .from('briefs')
        .insert({
          user_id: user.id,
          brief_output: data.brief,
          model_name: data.model,
        });
    } catch (err) {
      console.error('Generate error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {!brief ? (
            <Card className="bg-slate-800/50 border-slate-700 p-8">
              <h1 className="text-3xl font-bold text-cyan-400 mb-4">
                Generate Your Peptide Educational Brief
              </h1>
              <p className="text-slate-300 mb-6">
                Based on your intake responses, our AI will generate an educational brief that maps 
                your goals to peptide classes found in research literature, explains mechanisms, 
                highlights risks, and provides evidence citations.
              </p>

              <div className="bg-amber-900/20 border border-amber-700 rounded-lg p-4 mb-6">
                <p className="text-slate-300 text-sm">
                  <strong className="text-amber-400">Remember:</strong> This is educational content 
                  only and not medical advice. Always consult healthcare professionals.
                </p>
              </div>

              {error && (
                <div className="bg-red-900/20 border border-red-700 rounded-lg p-4 mb-6">
                  <p className="text-red-400">{error}</p>
                </div>
              )}

              <Button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="w-full bg-cyan-600 hover:bg-cyan-700 text-white py-6 text-lg"
              >
                {isGenerating ? 'Generating Brief...' : 'Generate Peptide Stack'}
              </Button>
            </Card>
          ) : (
            <div className="space-y-6">
              <Card className="bg-slate-800/50 border-slate-700 p-8">
                <div className="flex items-center justify-between mb-6">
                  <h1 className="text-3xl font-bold text-cyan-400">
                    Your Educational Brief
                  </h1>
                  <Button
                    onClick={() => router.push('/dashboard')}
                    className="bg-cyan-600 hover:bg-cyan-700"
                  >
                    View Dashboard
                  </Button>
                </div>

                <div className="bg-amber-900/20 border border-amber-700 rounded-lg p-4 mb-6">
                  <p className="text-amber-400 font-semibold text-center">
                    ⚠️ EDUCATIONAL CONTENT ONLY — NOT MEDICAL ADVICE
                  </p>
                </div>
              </Card>

              {/* Goal Alignment */}
              <Card className="bg-slate-800/50 border-slate-700 p-6">
                <h2 className="text-xl font-semibold text-cyan-400 mb-3">
                  Your Personalized Analysis
                </h2>
                <p className="text-slate-300 whitespace-pre-line">{brief.goalAlignment}</p>
              </Card>

              {/* Recommended Stack */}
              {brief.recommendedStack && (
                <Card className="bg-gradient-to-br from-cyan-900/30 to-slate-800/50 border-cyan-700 p-6">
                  <h2 className="text-2xl font-bold text-cyan-400 mb-3">
                    🎯 {brief.recommendedStack.name}
                  </h2>
                  <p className="text-slate-300 mb-3">
                    <strong className="text-cyan-400">Description:</strong> {brief.recommendedStack.description}
                  </p>
                  <p className="text-slate-300">
                    <strong className="text-cyan-400">Synergies:</strong> {brief.recommendedStack.synergies}
                  </p>
                </Card>
              )}

              {/* Candidate Peptides */}
              <Card className="bg-slate-800/50 border-slate-700 p-6">
                <h2 className="text-xl font-semibold text-cyan-400 mb-4">
                  Your Peptide Stack - Detailed Breakdown
                </h2>
                <div className="space-y-6">
                  {brief.candidatePeptides.map((peptide, index) => (
                    <div key={index} className="bg-slate-900/50 rounded-lg p-6 border border-slate-700">
                      <h3 className="text-xl font-bold text-cyan-400 mb-4">
                        {index + 1}. {peptide.name}
                      </h3>
                      
                      {/* Why this peptide */}
                      <div className="mb-4">
                        <p className="text-slate-300">
                          <strong className="text-cyan-400">Why Recommended:</strong> {peptide.why}
                        </p>
                      </div>

                      {/* Detailed Info */}
                      {peptide.detailedInfo && (
                        <div className="mb-4 bg-slate-800/50 p-4 rounded-lg">
                          <h4 className="text-sm font-semibold text-cyan-400 mb-2">📋 About This Peptide</h4>
                          <p className="text-slate-300 text-sm">{peptide.detailedInfo}</p>
                        </div>
                      )}

                      {/* Mechanism */}
                      <div className="mb-4">
                        <p className="text-slate-300">
                          <strong className="text-cyan-400">Mechanism of Action:</strong> {peptide.mechanism}
                        </p>
                      </div>

                      {/* Dosage & Timing */}
                      <div className="grid md:grid-cols-2 gap-4 mb-4">
                        <div className="bg-cyan-900/20 p-4 rounded-lg">
                          <h4 className="text-sm font-semibold text-cyan-400 mb-2">💊 Dosage</h4>
                          <p className="text-slate-300 text-sm">{peptide.recommendedDosage}</p>
                        </div>
                        {peptide.timing && (
                          <div className="bg-cyan-900/20 p-4 rounded-lg">
                            <h4 className="text-sm font-semibold text-cyan-400 mb-2">⏰ Timing</h4>
                            <ul className="text-slate-300 text-sm space-y-1">
                              <li><strong>Frequency:</strong> {peptide.timing.frequency}</li>
                              <li><strong>Time of Day:</strong> {peptide.timing.timeOfDay}</li>
                              <li><strong>With Food:</strong> {peptide.timing.withFood}</li>
                              {peptide.timing.cycleDuration && (
                                <li><strong>Cycle:</strong> {peptide.timing.cycleDuration}</li>
                              )}
                            </ul>
                          </div>
                        )}
                      </div>

                      {/* Benefits & Side Effects */}
                      <div className="grid md:grid-cols-2 gap-4">
                        {peptide.potentialBenefits && peptide.potentialBenefits.length > 0 && (
                          <div>
                            <h4 className="text-sm font-semibold text-green-400 mb-2">✅ Potential Benefits</h4>
                            <ul className="space-y-1">
                              {peptide.potentialBenefits.map((benefit, i) => (
                                <li key={i} className="text-slate-300 text-sm flex items-start gap-2">
                                  <span className="text-green-400">•</span>
                                  <span>{benefit}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {peptide.sideEffects && peptide.sideEffects.length > 0 && (
                          <div>
                            <h4 className="text-sm font-semibold text-amber-400 mb-2">⚠️ Possible Side Effects</h4>
                            <ul className="space-y-1">
                              {peptide.sideEffects.map((effect, i) => (
                                <li key={i} className="text-slate-300 text-sm flex items-start gap-2">
                                  <span className="text-amber-400">•</span>
                                  <span>{effect}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Key Risks */}
              <Card className="bg-slate-800/50 border-slate-700 p-6">
                <h2 className="text-xl font-semibold text-red-400 mb-3">
                  Key Risks & Contraindications
                </h2>
                <ul className="space-y-2">
                  {brief.keyRisks.map((risk, index) => (
                    <li key={index} className="flex items-start gap-2 text-slate-300">
                      <span className="text-red-400">•</span>
                      <span>{risk}</span>
                    </li>
                  ))}
                </ul>
              </Card>

              {/* Medical Considerations */}
              {brief.medicalConsiderations && (
                <Card className="bg-slate-800/50 border-slate-700 p-6">
                  <h2 className="text-xl font-semibold text-amber-400 mb-4">
                    🏥 Medical Considerations for Your Profile
                  </h2>
                  <div className="space-y-4">
                    {brief.medicalConsiderations.drugInteractions && brief.medicalConsiderations.drugInteractions.length > 0 && (
                      <div>
                        <h3 className="font-semibold text-slate-200 mb-2">Drug Interactions</h3>
                        <ul className="space-y-1">
                          {brief.medicalConsiderations.drugInteractions.map((interaction, index) => (
                            <li key={index} className="flex items-start gap-2 text-slate-300 text-sm">
                              <span className="text-amber-400">•</span>
                              <span>{interaction}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {brief.medicalConsiderations.contraindications && brief.medicalConsiderations.contraindications.length > 0 && (
                      <div>
                        <h3 className="font-semibold text-slate-200 mb-2">Contraindications</h3>
                        <ul className="space-y-1">
                          {brief.medicalConsiderations.contraindications.map((contra, index) => (
                            <li key={index} className="flex items-start gap-2 text-slate-300 text-sm">
                              <span className="text-amber-400">•</span>
                              <span>{contra}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {brief.medicalConsiderations.monitoringRecommendations && brief.medicalConsiderations.monitoringRecommendations.length > 0 && (
                      <div>
                        <h3 className="font-semibold text-slate-200 mb-2">Monitoring Recommendations</h3>
                        <ul className="space-y-1">
                          {brief.medicalConsiderations.monitoringRecommendations.map((monitor, index) => (
                            <li key={index} className="flex items-start gap-2 text-slate-300 text-sm">
                              <span className="text-cyan-400">•</span>
                              <span>{monitor}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </Card>
              )}

              {/* Evidence */}
              <Card className="bg-slate-800/50 border-slate-700 p-6">
                <h2 className="text-xl font-semibold text-cyan-400 mb-4">
                  📚 Scientific Evidence & Research
                </h2>
                <p className="text-slate-400 text-sm mb-4">
                  Below are peer-reviewed research articles supporting the peptides in your stack:
                </p>
                <div className="space-y-3">
                  {brief.evidenceList.map((evidence, index) => (
                    <div key={index} className="bg-slate-900/50 rounded-lg p-4 border border-slate-700">
                      <h4 className="font-semibold text-slate-200 mb-1">
                        {evidence.title} ({evidence.year})
                      </h4>
                      <p className="text-sm text-cyan-400 mb-2">{evidence.source}</p>
                      <p className="text-slate-300 text-sm mb-2">{evidence.summary}</p>
                      {evidence.url && (
                        <a
                          href={evidence.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-cyan-400 hover:text-cyan-300 text-sm underline"
                        >
                          View on PubMed →
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </Card>

              {/* Global Disclaimer */}
              <Card className="bg-red-900/20 border-red-700 p-6">
                <h3 className="text-lg font-semibold text-red-400 mb-3">
                  ⚠️ Important Disclaimer
                </h3>
                <p className="text-slate-300 text-sm">
                  This brief is generated for educational and research purposes only. It does not 
                  constitute medical advice, diagnosis, or treatment recommendations. Many peptides 
                  discussed are research-only substances without FDA approval for human use. Always 
                  consult qualified healthcare professionals before making any health-related decisions. 
                  Do not use this information to self-prescribe or obtain controlled substances.
                </p>
              </Card>

              <div className="flex gap-4">
                <Button
                  onClick={() => {
                    setBrief(null);
                    localStorage.removeItem('generated_brief');
                  }}
                  variant="outline"
                  className="border-slate-600"
                >
                  Regenerate
                </Button>
                <Button
                  onClick={() => router.push('/dashboard')}
                  className="flex-1 bg-cyan-600 hover:bg-cyan-700"
                >
                  Go to Dashboard
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}

