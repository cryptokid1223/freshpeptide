'use client';

import React, { useState, useEffect } from 'react';
import { MainLayout } from '@/components/MainLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function ConsentPage() {
  const router = useRouter();
  const [consent1, setConsent1] = useState(false);
  const [consent2, setConsent2] = useState(false);
  const [consent3, setConsent3] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuthAndIntake = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/auth');
        return;
      }
      
      setIsAuthenticated(true);

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

      if (hasCompletedIntake) {
        localStorage.setItem('consent_given', 'true');
        localStorage.setItem('intake_completed', 'true');
        router.push('/dashboard');
      }
    };
    
    checkAuthAndIntake();
  }, [router]);

  const handleContinue = () => {
    if (consent1 && consent2 && consent3) {
      localStorage.setItem('consent_given', 'true');
      router.push('/intake');
    }
  };

  const allConsented = consent1 && consent2 && consent3;

  if (!isAuthenticated) {
    return null;
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-16 max-w-[720px]">
        <Card className="rounded-2xl border border-[var(--border)] bg-[var(--surface-1)] p-8" style={{ boxShadow: 'var(--shadow)' }}>
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-[#6EE7F5] to-[#12B3FF] mb-3 tracking-[-0.01em]">
            Research Consent & Acknowledgment
          </h1>
          <p className="text-[var(--text-dim)] mb-8">
            Please read and acknowledge the following before proceeding
          </p>

          <div className="space-y-6 mb-8">
            <div className="p-6 rounded-xl bg-[var(--warn)]/5 border border-[var(--warn)]/30">
              <h2 className="text-xl font-semibold text-[var(--warn)] mb-3 flex items-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                  <path d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 4.995z"/>
                </svg>
                RESEARCH / DEMO PURPOSES ONLY — NOT MEDICAL ADVICE
              </h2>
              <p className="text-[var(--text-dim)] text-sm leading-relaxed">
                This platform is designed exclusively for research, educational, and demonstration 
                purposes. It does not provide medical advice, diagnosis, or treatment recommendations.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3 p-5 rounded-xl bg-[var(--surface-2)] border border-[var(--border)]">
                <Checkbox
                  id="consent1"
                  checked={consent1}
                  onCheckedChange={(checked) => setConsent1(checked as boolean)}
                  className="mt-0.5"
                />
                <Label htmlFor="consent1" className="text-[var(--text-dim)] cursor-pointer flex-1 text-sm leading-relaxed">
                  <strong className="text-[var(--accent)]">I understand</strong> that this platform is 
                  for research and demonstration purposes only, and does not provide medical advice 
                  or treatment recommendations.
                </Label>
              </div>

              <div className="flex items-start gap-3 p-5 rounded-xl bg-[var(--surface-2)] border border-[var(--border)]">
                <Checkbox
                  id="consent2"
                  checked={consent2}
                  onCheckedChange={(checked) => setConsent2(checked as boolean)}
                  className="mt-0.5"
                />
                <Label htmlFor="consent2" className="text-[var(--text-dim)] cursor-pointer flex-1 text-sm leading-relaxed">
                  <strong className="text-[var(--accent)]">I acknowledge</strong> that any information 
                  or suggestions generated by this platform should not be used to make medical 
                  decisions, and I will consult qualified healthcare professionals for any 
                  health-related concerns.
                </Label>
              </div>

              <div className="flex items-start gap-3 p-5 rounded-xl bg-[var(--surface-2)] border border-[var(--border)]">
                <Checkbox
                  id="consent3"
                  checked={consent3}
                  onCheckedChange={(checked) => setConsent3(checked as boolean)}
                  className="mt-0.5"
                />
                <Label htmlFor="consent3" className="text-[var(--text-dim)] cursor-pointer flex-1 text-sm leading-relaxed">
                  <strong className="text-[var(--accent)]">I agree</strong> to use this platform for 
                  educational purposes only and understand that the peptides discussed may be 
                  research-only substances with varying regulatory statuses and potential risks.
                </Label>
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <Button
              onClick={() => router.push('/auth')}
              className="bg-[var(--surface-2)] border border-[var(--border)] text-[var(--text)] hover:border-[var(--accent)]/50 rounded-full px-8 font-semibold"
            >
              Go Back
            </Button>
            <Button
              onClick={handleContinue}
              disabled={!allConsented}
              className="flex-1 bg-gradient-to-b from-[#22C8FF] to-[#08A7E6] hover:opacity-90 text-[#001018] rounded-full font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              I Understand & Continue
            </Button>
          </div>
        </Card>
      </div>
    </MainLayout>
  );
}
