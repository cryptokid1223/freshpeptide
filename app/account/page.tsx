'use client';

import React, { useState, useEffect } from 'react';
import { MainLayout } from '@/components/MainLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function AccountPage() {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState<string>('');
  const [userId, setUserId] = useState<string>('');
  const [intakeCompleted, setIntakeCompleted] = useState(false);
  const [briefGenerated, setBriefGenerated] = useState(false);

  useEffect(() => {
    const loadAccountData = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        router.push('/auth');
        return;
      }

      setUserEmail(session.user.email || '');
      setUserId(session.user.id);

      // Check intake status from Supabase
      const { data: intakeRecord } = await supabase
        .from('intake')
        .select('intake_data')
        .eq('user_id', session.user.id)
        .maybeSingle();

      const intake = intakeRecord?.intake_data;
      const hasIntake = intake && 
        intake.demographics && 
        intake.medical && 
        intake.lifestyle && 
        intake.dietary &&
        intake.stress &&
        intake.recovery &&
        intake.goals;
      
      setIntakeCompleted(!!hasIntake);

      // Check brief status from Supabase
      const { data: briefRecords } = await supabase
        .from('briefs')
        .select('id')
        .eq('user_id', session.user.id)
        .limit(1);

      setBriefGenerated(!!(briefRecords && briefRecords.length > 0));
    };

    loadAccountData();
  }, [router]);

  const handleSignOut = async () => {
    if (confirm('Are you sure you want to sign out?')) {
      await supabase.auth.signOut();
      localStorage.clear();
      router.push('/');
    }
  };

  const handleClearData = async () => {
    if (confirm('Are you sure you want to clear all your data? This action cannot be undone.')) {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        await supabase.from('intake').delete().eq('user_id', session.user.id);
        await supabase.from('briefs').delete().eq('user_id', session.user.id);
      }
      
      localStorage.removeItem('intake_data');
      setIntakeCompleted(false);
      setBriefGenerated(false);
      alert('All data has been cleared successfully.');
      router.push('/dashboard');
    }
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-16 max-w-[1180px]">
        <div className="max-w-3xl mx-auto">
          <div className="mb-12">
            <h1 className="text-4xl font-extrabold tracking-[-0.01em] text-transparent bg-clip-text bg-gradient-to-b from-[#6EE7F5] to-[#12B3FF] mb-2">
              Account
            </h1>
            <p className="text-[var(--text-dim)]">Manage your profile and account settings</p>
          </div>

          {/* Profile Information */}
          <Card className="rounded-2xl border border-[var(--border)] bg-[var(--surface-1)] p-6 mb-6" style={{ boxShadow: 'var(--shadow)' }}>
            <SectionTitle>Profile Information</SectionTitle>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-[var(--text-muted)] block mb-1">Email Address</label>
                <p className="text-base text-[var(--text)] font-medium">{userEmail}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-[var(--text-muted)] block mb-1">User ID</label>
                <p className="text-xs text-[var(--text-dim)] font-mono bg-[var(--surface-2)] px-3 py-2 rounded-lg border border-[var(--border)] break-all">
                  {userId}
                </p>
              </div>
            </div>
          </Card>

          {/* Data Status */}
          <Card className="rounded-2xl border border-[var(--border)] bg-[var(--surface-1)] p-6 mb-6" style={{ boxShadow: 'var(--shadow)' }}>
            <SectionTitle>Data Status</SectionTitle>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-xl bg-[var(--surface-2)] border border-[var(--border)]">
                <div>
                  <p className="font-medium text-[var(--text)]">Health Intake</p>
                  <p className="text-sm text-[var(--text-dim)]">7-step questionnaire data</p>
                </div>
                {intakeCompleted ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-[var(--ok)]/10 text-[var(--ok)] border border-[var(--ok)]/20">
                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Completed
                  </span>
                ) : (
                  <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-[var(--text-muted)]/10 text-[var(--text-muted)] border border-[var(--text-muted)]/20">
                    Not Started
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl bg-[var(--surface-2)] border border-[var(--border)]">
                <div>
                  <p className="font-medium text-[var(--text)]">Medical Intelligence peptide recommendations</p>
                  <p className="text-sm text-[var(--text-dim)]">Generated educational brief</p>
                </div>
                {briefGenerated ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-[var(--ok)]/10 text-[var(--ok)] border border-[var(--ok)]/20">
                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Generated
                  </span>
                ) : (
                  <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-[var(--text-muted)]/10 text-[var(--text-muted)] border border-[var(--text-muted)]/20">
                    Not Generated
                  </span>
                )}
              </div>
            </div>
          </Card>

          {/* Account Actions */}
          <Card className="rounded-2xl border border-[var(--border)] bg-[var(--surface-1)] p-6 mb-6" style={{ boxShadow: 'var(--shadow)' }}>
            <SectionTitle>Account Actions</SectionTitle>
            
            <div className="space-y-3">
              <Button
                onClick={handleSignOut}
                className="w-full bg-[var(--surface-2)] border border-[var(--border)] text-[var(--text)] hover:bg-[var(--surface-2)]/80 hover:border-[var(--accent)]/50 rounded-full font-semibold"
              >
                Sign Out
              </Button>
              
              <Button
                onClick={handleClearData}
                className="w-full bg-transparent border border-[var(--danger)] text-[var(--danger)] hover:bg-[var(--danger)]/10 rounded-full font-semibold"
              >
                Clear All Data
              </Button>
            </div>
          </Card>

          {/* Security & Privacy */}
          <Card className="rounded-2xl border border-[var(--border)]/50 bg-[var(--surface-1)] p-6" style={{ boxShadow: 'var(--shadow)' }}>
            <h3 className="text-lg font-semibold text-[var(--text)] mb-3 flex items-center gap-2">
              <svg className="w-5 h-5 text-[var(--accent)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              Security & Privacy
            </h3>
            <ul className="space-y-2 text-sm text-[var(--text-dim)]">
              <li className="flex items-start gap-2">
                <span className="text-[var(--accent)] flex-shrink-0">•</span>
                <span>All data is stored securely in our encrypted database</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[var(--accent)] flex-shrink-0">•</span>
                <span>Your information is never shared with third parties</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[var(--accent)] flex-shrink-0">•</span>
                <span>You can delete your data at any time</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[var(--accent)] flex-shrink-0">•</span>
                <span>This is a research platform - not for medical use</span>
              </li>
            </ul>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}
