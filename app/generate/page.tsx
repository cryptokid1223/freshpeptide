'use client';

import React, { useState, useEffect } from 'react';
import { MainLayout } from '@/components/MainLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { StatusPill } from '@/components/ui/StatusPill';
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
    const checkAuthAndIntake = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        router.push('/auth');
        return;
      }

      const { data: intakeRecord } = await supabase
        .from('intake')
        .select('intake_data')
        .eq('user_id', session.user.id)
        .maybeSingle();

      const intake = intakeRecord?.intake_data;
      const hasCompletedIntake = intake && 
        intake.demographics && 
        intake.medical && 
        intake.lifestyle && 
        intake.dietary &&
        intake.stress &&
        intake.recovery &&
        intake.goals &&
        Object.keys(intake.demographics).length > 0 &&
        Object.keys(intake.medical).length > 0 &&
        Object.keys(intake.lifestyle).length > 0 &&
        Object.keys(intake.dietary).length > 0 &&
        Object.keys(intake.stress).length > 0 &&
        Object.keys(intake.recovery).length > 0 &&
        Object.keys(intake.goals).length > 0;

      if (!hasCompletedIntake) {
        setStatusMessage('⚠️ Please complete all intake sections first');
        setError('Intake questionnaire not completed. Please go to the intake page and complete all sections.');
        return;
      }

      localStorage.setItem('consent_given', 'true');
      localStorage.setItem('intake_completed', 'true');
      setStatusMessage('✅ Ready to generate');

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

    checkAuthAndIntake();
  }, [router]);

  const handleGenerate = async () => {
    setIsGenerating(true);
    setError(null);
    setStatusMessage('🔄 Starting generation...');

    try {
      setStatusMessage('🔐 Checking authentication...');
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) {
        throw new Error('Not authenticated. Please sign in again.');
      }

      const user = session.user;

      setStatusMessage('📋 Loading your questionnaire data...');
      const { data: intakeRecord } = await supabase
        .from('intake')
        .select('intake_data')
        .eq('user_id', user.id)
        .maybeSingle();
      
      if (!intakeRecord?.intake_data || Object.keys(intakeRecord.intake_data).length === 0) {
        throw new Error('No intake data found. Please complete the questionnaire first.');
      }

      setStatusMessage('🔬 Medical Intelligence analyzing your profile...');
      
      const response = await fetch('/api/generate-brief', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          intakeData: intakeRecord.intake_data,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        try {
          const errorData = JSON.parse(errorText);
          throw new Error(errorData.error || 'Failed to generate brief');
        } catch {
          throw new Error('Failed to generate brief: ' + response.status);
        }
      }

      setStatusMessage('💾 Saving your personalized stack...');
      const data = await response.json();
      setBrief(data.brief);
      
      localStorage.setItem('generated_brief', JSON.stringify(data.brief));
      
      await supabase.from('briefs').insert({
        user_id: user.id,
        brief_output: data.brief,
        model_name: data.model,
      });

      setStatusMessage('✅ Complete! Your stack is ready.');
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMsg);
      setStatusMessage('❌ Generation failed');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-16 max-w-[1180px]">
        {!brief ? (
          <div className="max-w-3xl mx-auto">
            <Card className="rounded-2xl border border-[var(--border)] bg-[var(--surface-1)] p-8" style={{ boxShadow: 'var(--shadow)' }}>
              <h1 className="text-4xl font-extrabold tracking-[-0.01em] text-transparent bg-clip-text bg-gradient-to-b from-[#6EE7F5] to-[#12B3FF] mb-4">
                Generate Your Peptide Educational Brief
              </h1>
              <p className="text-[var(--text-dim)] mb-8 leading-relaxed">
                Based on your intake responses, our Medical Intelligence system will generate an educational brief that maps 
                your goals to peptide classes found in research literature, explains mechanisms, 
                highlights risks, and provides evidence citations.
              </p>

              {statusMessage && (
                <div className={`mb-6 p-4 rounded-xl ${
                  statusMessage.includes('✅') ? 'bg-[var(--ok)]/10 border-[var(--ok)]/30' :
                  statusMessage.includes('⚠️') ? 'bg-[var(--warn)]/10 border-[var(--warn)]/30' :
                  'bg-[var(--accent)]/10 border-[var(--accent)]/30'
                } border`}>
                  <p className={`text-center font-medium ${
                    statusMessage.includes('✅') ? 'text-[var(--ok)]' :
                    statusMessage.includes('⚠️') ? 'text-[var(--warn)]' :
                    'text-[var(--accent)]'
                  }`}>{statusMessage}</p>
                </div>
              )}

              {error && (
                <div className="mb-6 p-4 rounded-xl bg-[var(--danger)]/10 border border-[var(--danger)]/30">
                  <p className="text-[var(--danger)] mb-3">{error}</p>
                  <Button 
                    onClick={() => router.push('/intake')} 
                    className="w-full bg-gradient-to-b from-[#22C8FF] to-[#08A7E6] hover:opacity-90 text-[#001018] rounded-full font-semibold"
                  >
                    Go to Intake Page
                  </Button>
                </div>
              )}

              <div className="bg-[var(--warn)]/5 border border-[var(--warn)]/30 rounded-xl p-4 mb-8">
                <p className="text-[var(--text-dim)] text-sm leading-relaxed">
                  <strong className="text-[var(--warn)]">Remember:</strong> This is educational content 
                  only and not medical advice. Always consult healthcare professionals.
                </p>
              </div>

              <Button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="w-full bg-gradient-to-b from-[#22C8FF] to-[#08A7E6] hover:opacity-90 text-[#001018] py-8 text-lg font-semibold rounded-full"
              >
                {isGenerating ? 'Medical Intelligence Analyzing...' : 'Generate Peptide Stack'}
              </Button>
            </Card>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Header */}
            <Card className="rounded-2xl border border-[var(--border)] bg-[var(--surface-1)] p-8" style={{ boxShadow: 'var(--shadow)' }}>
              <div className="flex items-start justify-between mb-4">
                <h1 className="text-4xl font-extrabold tracking-[-0.01em] text-transparent bg-clip-text bg-gradient-to-b from-[#6EE7F5] to-[#12B3FF]">
                  Your Educational Brief
                </h1>
                <Button
                  onClick={() => router.push('/dashboard')}
                  className="bg-[var(--surface-2)] border border-[var(--border)] text-[var(--text)] hover:border-[var(--accent)]/50 rounded-full px-6 font-semibold"
                >
                  Dashboard
                </Button>
              </div>

              <div className="bg-[var(--warn)]/5 border border-[var(--warn)]/30 rounded-xl p-4">
                <p className="text-[var(--warn)] font-semibold text-center text-sm">
                  ⚠️ EDUCATIONAL CONTENT ONLY — NOT MEDICAL ADVICE
                </p>
              </div>
            </Card>

            {/* Goal Alignment */}
            <Card className="rounded-2xl border border-[var(--border)] bg-[var(--surface-1)] p-8" style={{ boxShadow: 'var(--shadow)' }}>
              <SectionTitle>Your Personalized Analysis</SectionTitle>
              <p className="text-[var(--text-dim)] whitespace-pre-line leading-relaxed">{brief.goalAlignment}</p>
            </Card>

            {/* Recommended Stack */}
            {brief.recommendedStack && (
              <Card className="rounded-2xl border border-[var(--accent)]/30 bg-gradient-to-br from-[var(--accent)]/10 to-[var(--accent-2)]/5 p-8" style={{ boxShadow: 'var(--shadow)' }}>
                <h2 className="text-2xl font-bold text-[var(--accent)] mb-4 tracking-[-0.01em]">
                  🎯 {brief.recommendedStack.name}
                </h2>
                <p className="text-[var(--text-dim)] mb-4 leading-relaxed">
                  <strong className="text-[var(--text)]">Description:</strong> {brief.recommendedStack.description}
                </p>
                <p className="text-[var(--text-dim)] leading-relaxed">
                  <strong className="text-[var(--text)]">Synergies:</strong> {brief.recommendedStack.synergies}
                </p>
              </Card>
            )}

            {/* Peptides */}
            <Card className="rounded-2xl border border-[var(--border)] bg-[var(--surface-1)] p-8" style={{ boxShadow: 'var(--shadow)' }}>
              <SectionTitle>Your Peptide Stack - Detailed Breakdown</SectionTitle>
              <div className="space-y-6">
                {brief.candidatePeptides.map((peptide, index) => (
                  <div key={index} className="rounded-2xl border border-[var(--border)] bg-[var(--surface-2)] p-6">
                    <div className="flex items-start justify-between mb-4">
                      <h3 className="text-xl font-bold text-[var(--accent)] tracking-[-0.01em]">
                        {index + 1}. {peptide.name}
                      </h3>
                      {peptide.status && <StatusPill status={peptide.status} />}
                    </div>
                    
                    <div className="space-y-4">
                      <p className="text-sm text-[var(--text-dim)] leading-relaxed">
                        <strong className="text-[var(--text)]">Why Recommended:</strong> {peptide.why}
                      </p>

                      {peptide.detailedInfo && (
                        <div className="rounded-xl bg-[var(--surface-1)] p-4 border border-[var(--border)]">
                          <h4 className="text-sm font-semibold text-[var(--accent)] mb-2">📋 About This Peptide</h4>
                          <p className="text-[var(--text-dim)] text-sm leading-relaxed">{peptide.detailedInfo}</p>
                        </div>
                      )}

                      <p className="text-sm text-[var(--text-dim)] leading-relaxed">
                        <strong className="text-[var(--text)]">Mechanism of Action:</strong> {peptide.mechanism}
                      </p>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="rounded-xl bg-[var(--accent)]/5 border border-[var(--accent)]/20 p-4">
                          <h4 className="text-sm font-semibold text-[var(--accent)] mb-2">💊 Dosage</h4>
                          <p className="text-[var(--text-dim)] text-sm leading-relaxed">{peptide.recommendedDosage}</p>
                        </div>
                        {peptide.timing && (
                          <div className="rounded-xl bg-[var(--accent)]/5 border border-[var(--accent)]/20 p-4">
                            <h4 className="text-sm font-semibold text-[var(--accent)] mb-2">⏰ Timing</h4>
                            <div className="text-[var(--text-dim)] text-sm space-y-1">
                              <p><strong>Frequency:</strong> {peptide.timing.frequency}</p>
                              <p><strong>Time:</strong> {peptide.timing.timeOfDay}</p>
                              <p><strong>With Food:</strong> {peptide.timing.withFood}</p>
                              {peptide.timing.cycleDuration && <p><strong>Cycle:</strong> {peptide.timing.cycleDuration}</p>}
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        {peptide.potentialBenefits && peptide.potentialBenefits.length > 0 && (
                          <div>
                            <h4 className="text-sm font-semibold text-[var(--ok)] mb-2">✅ Potential Benefits</h4>
                            <ul className="space-y-1">
                              {peptide.potentialBenefits.map((benefit, i) => (
                                <li key={i} className="text-[var(--text-dim)] text-sm flex gap-2">
                                  <span className="text-[var(--ok)]">•</span>
                                  <span>{benefit}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {peptide.sideEffects && peptide.sideEffects.length > 0 && (
                          <div>
                            <h4 className="text-sm font-semibold text-[var(--warn)] mb-2">⚠️ Possible Side Effects</h4>
                            <ul className="space-y-1">
                              {peptide.sideEffects.map((effect, i) => (
                                <li key={i} className="text-[var(--text-dim)] text-sm flex gap-2">
                                  <span className="text-[var(--warn)]">•</span>
                                  <span>{effect}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Key Risks */}
            <Card className="rounded-2xl border border-[var(--danger)]/30 bg-[var(--danger)]/5 p-8" style={{ boxShadow: 'var(--shadow)' }}>
              <h2 className="text-xl font-semibold text-[var(--danger)] mb-4 flex items-center gap-2">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                  <path d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 4.995z"/>
                </svg>
                Key Risks & Contraindications
              </h2>
              <ul className="space-y-2">
                {brief.keyRisks.map((risk, index) => (
                  <li key={index} className="flex gap-2 text-[var(--text-dim)] text-sm">
                    <span className="text-[var(--danger)]">•</span>
                    <span>{risk}</span>
                  </li>
                ))}
              </ul>
            </Card>

            {/* Medical Considerations */}
            {brief.medicalConsiderations && (
              <Card className="rounded-2xl border border-[var(--border)] bg-[var(--surface-1)] p-8" style={{ boxShadow: 'var(--shadow)' }}>
                <SectionTitle>Medical Considerations for Your Profile</SectionTitle>
                <div className="space-y-6">
                  {brief.medicalConsiderations.drugInteractions && brief.medicalConsiderations.drugInteractions.length > 0 && (
                    <div>
                      <h3 className="font-semibold text-[var(--text)] mb-2">Drug Interactions</h3>
                      <ul className="space-y-1">
                        {brief.medicalConsiderations.drugInteractions.map((interaction, index) => (
                          <li key={index} className="flex gap-2 text-[var(--text-dim)] text-sm">
                            <span className="text-[var(--warn)]">•</span>
                            <span>{interaction}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {brief.medicalConsiderations.contraindications && brief.medicalConsiderations.contraindications.length > 0 && (
                    <div>
                      <h3 className="font-semibold text-[var(--text)] mb-2">Contraindications</h3>
                      <ul className="space-y-1">
                        {brief.medicalConsiderations.contraindications.map((contra, index) => (
                          <li key={index} className="flex gap-2 text-[var(--text-dim)] text-sm">
                            <span className="text-[var(--warn)]">•</span>
                            <span>{contra}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {brief.medicalConsiderations.monitoringRecommendations && brief.medicalConsiderations.monitoringRecommendations.length > 0 && (
                    <div>
                      <h3 className="font-semibold text-[var(--text)] mb-2">Monitoring Recommendations</h3>
                      <ul className="space-y-1">
                        {brief.medicalConsiderations.monitoringRecommendations.map((monitor, index) => (
                          <li key={index} className="flex gap-2 text-[var(--text-dim)] text-sm">
                            <span className="text-[var(--accent)]">•</span>
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
            <Card className="rounded-2xl border border-[var(--border)] bg-[var(--surface-1)] p-8" style={{ boxShadow: 'var(--shadow)' }}>
              <SectionTitle subtitle="Peer-reviewed research articles supporting the peptides in your stack">
                Scientific Evidence & Research
              </SectionTitle>
              <div className="space-y-4">
                {brief.evidenceList.map((evidence, index) => (
                  <div key={index} className="rounded-xl bg-[var(--surface-2)] border border-[var(--border)] p-4">
                    <h4 className="font-semibold text-[var(--text)] mb-1">
                      {evidence.title} ({evidence.year})
                    </h4>
                    <p className="text-sm text-[var(--accent)] mb-2">{evidence.source}</p>
                    <p className="text-[var(--text-dim)] text-sm mb-2">{evidence.summary}</p>
                    {evidence.url && (
                      <a
                        href={evidence.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[var(--accent)] hover:text-[var(--accent-2)] text-sm font-medium"
                      >
                        View on PubMed →
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </Card>

            {/* Disclaimer */}
            <Card className="rounded-2xl border border-[var(--danger)]/30 bg-[var(--danger)]/5 p-6" style={{ boxShadow: 'var(--shadow)' }}>
              <h3 className="text-lg font-semibold text-[var(--danger)] mb-3">
                ⚠️ Important Disclaimer
              </h3>
              <p className="text-[var(--text-dim)] text-sm leading-relaxed">
                This brief is generated for educational and research purposes only. It does not 
                constitute medical advice, diagnosis, or treatment recommendations. Many peptides 
                discussed are research-only substances without FDA approval for human use. Always 
                consult qualified healthcare professionals before making any health-related decisions. 
                Do not use this information to self-prescribe or obtain controlled substances.
              </p>
            </Card>

            {/* Actions */}
            <div className="flex gap-4">
              <Button
                onClick={() => {
                  setBrief(null);
                  localStorage.removeItem('generated_brief');
                }}
                className="bg-[var(--surface-2)] border border-[var(--border)] text-[var(--text)] hover:border-[var(--accent)]/50 rounded-full px-8 font-semibold"
              >
                Regenerate
              </Button>
              <Button
                onClick={() => router.push('/dashboard')}
                className="flex-1 bg-gradient-to-b from-[#22C8FF] to-[#08A7E6] hover:opacity-90 text-[#001018] rounded-full font-semibold"
              >
                Go to Dashboard
              </Button>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
