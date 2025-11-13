'use client';

import React, { useState, useEffect } from 'react';
import { MainLayout } from '@/components/MainLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { StackSummary } from '@/components/ui/StackSummary';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import type { BriefOutput } from '@/lib/supabase';

export default function DashboardPage() {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState<string>('');
  const [intakeData, setIntakeData] = useState<any>(null);
  const [brief, setBrief] = useState<BriefOutput | null>(null);

  useEffect(() => {
    // Check authentication with Supabase and load data from database
    const loadDashboardData = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        router.push('/auth');
        return;
      }
      
      setUserEmail(session.user.email || '');

      // Load intake data from Supabase database
      const { data: intakeRecord } = await supabase
        .from('intake')
        .select('intake_data')
        .eq('user_id', session.user.id)
        .maybeSingle();

      if (intakeRecord?.intake_data) {
        setIntakeData(intakeRecord.intake_data);
      }

      // Load most recent brief from Supabase database
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

    loadDashboardData();
  }, [router]);

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-16 max-w-[1180px]">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-extrabold tracking-[-0.01em] text-transparent bg-clip-text bg-gradient-to-b from-[#6EE7F5] to-[#12B3FF] mb-2">
            Dashboard
          </h1>
          <p className="text-[var(--text-dim)] truncate">Welcome back, {userEmail}</p>
        </div>

        {/* Hero Cards - Intake & Brief Status */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {/* Intake Status Card */}
          <Card className="rounded-2xl border border-[var(--border)] bg-[var(--surface-1)] p-6" style={{ boxShadow: 'var(--shadow)' }}>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-b from-[var(--accent-2)] to-[var(--accent)] flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-[#001018]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-[var(--accent)]">Health Intake</h2>
                <div className="flex items-center gap-2 mt-1">
                  {intakeData ? (
                    <>
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-[var(--ok)]/10 text-[var(--ok)] border border-[var(--ok)]/20">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        Completed
                      </span>
                    </>
                  ) : (
                    <span className="text-sm text-[var(--text-dim)]">Not started</span>
                  )}
                </div>
              </div>
            </div>
            {intakeData ? (
              <>
                <p className="text-sm text-[var(--text-dim)] mb-4">
                  Your comprehensive health intake is complete. You can view or update your 
                  information at any time.
                </p>
                <Link href="/intake">
                  <Button 
                    className="w-full bg-[var(--surface-2)] border border-[var(--border)] text-[var(--text)] hover:bg-[var(--surface-2)]/80 hover:border-[var(--accent)]/50 rounded-full font-semibold"
                  >
                    View/Edit Intake
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <p className="text-sm text-[var(--text-dim)] mb-4">
                  Complete your health intake to get personalized peptide recommendations.
                </p>
                <Link href="/intake">
                  <Button className="w-full bg-gradient-to-b from-[#22C8FF] to-[#08A7E6] hover:opacity-90 text-[#001018] rounded-full font-semibold">
                    Start Intake
                  </Button>
                </Link>
              </>
            )}
          </Card>

          {/* Brief Status Card */}
          <Card className="rounded-2xl border border-[var(--border)] bg-[var(--surface-1)] p-6" style={{ boxShadow: 'var(--shadow)' }}>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-b from-[var(--accent-2)] to-[var(--accent)] flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-[#001018]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-[var(--accent)]">Educational Brief</h2>
                <div className="flex items-center gap-2 mt-1">
                  {brief ? (
                    <>
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-[var(--ok)]/10 text-[var(--ok)] border border-[var(--ok)]/20">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        Generated
                      </span>
                    </>
                  ) : (
                    <span className="text-sm text-[var(--text-dim)]">Not generated</span>
                  )}
                </div>
              </div>
            </div>
            {brief ? (
              <>
                <p className="text-sm text-[var(--text-dim)] mb-4">
                  Your personalized educational brief is ready. Review peptide recommendations 
                  and research citations.
                </p>
                <Link href="/generate">
                  <Button 
                    className="w-full bg-[var(--surface-2)] border border-[var(--border)] text-[var(--text)] hover:bg-[var(--surface-2)]/80 hover:border-[var(--accent)]/50 rounded-full font-semibold"
                  >
                    View Brief
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <p className="text-sm text-[var(--text-dim)] mb-4">
                  Generate a Medical Intelligence-powered educational brief based on your intake data.
                </p>
                <Link href="/generate">
                  <Button 
                    className="w-full bg-gradient-to-b from-[#22C8FF] to-[#08A7E6] hover:opacity-90 text-[#001018] rounded-full font-semibold"
                    disabled={!intakeData}
                  >
                    {intakeData ? 'Generate Brief' : 'Complete Intake First'}
                  </Button>
                </Link>
              </>
            )}
          </Card>
        </div>

        {/* Intake Summary */}
        {intakeData && (
          <Card className="rounded-2xl border border-[var(--border)] bg-[var(--surface-1)] p-6 mb-12" style={{ boxShadow: 'var(--shadow)' }}>
            <SectionTitle>Intake Summary</SectionTitle>
            
            <div className="grid md:grid-cols-2 gap-8">
              {intakeData.demographics && (
                <div>
                  <h3 className="text-lg font-semibold text-[var(--text)] mb-3 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]"></span>
                    Demographics
                  </h3>
                  <div className="space-y-2 text-[var(--text-dim)] text-sm">
                    <p><span className="text-[var(--text)]">Age:</span> {intakeData.demographics.age}</p>
                    <p><span className="text-[var(--text)]">Sex:</span> {intakeData.demographics.sex}</p>
                    <p><span className="text-[var(--text)]">Height:</span> {intakeData.demographics.height}</p>
                    <p><span className="text-[var(--text)]">Weight:</span> {intakeData.demographics.weight}</p>
                  </div>
                </div>
              )}

              {intakeData.goals && (
                <div>
                  <h3 className="text-lg font-semibold text-[var(--text)] mb-3 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]"></span>
                    Goals
                  </h3>
                  <ul className="space-y-2 text-[var(--text-dim)] text-sm">
                    {intakeData.goals.selectedGoals?.map((goal: string, index: number) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-[var(--accent)]">•</span>
                        <span>{goal}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </Card>
        )}

        {/* Your Peptide Recommendations */}
        {brief && (
          <Card className="rounded-2xl border border-[var(--border)] bg-[var(--surface-1)] p-6 mb-12" style={{ boxShadow: 'var(--shadow)' }}>
            <SectionTitle subtitle="Your personalized educational stack based on your health profile">
              Your Peptide Recommendations
            </SectionTitle>
            
            <StackSummary 
              items={brief.candidatePeptides.map(p => ({
                ...p,
                status: p.status || 'Research Only',
                family: p.family || 'Peptide',
                tags: p.tags || []
              }))}
              onViewFull={() => router.push('/generate')}
            />

            <div className="flex gap-4 mt-6">
              <Link href="/generate" className="flex-1">
                <Button className="w-full bg-gradient-to-b from-[#22C8FF] to-[#08A7E6] hover:opacity-90 text-[#001018] rounded-full font-semibold">
                  View Full Brief
                </Button>
              </Link>
              <Link href="/library" className="flex-1">
                <Button className="w-full bg-[var(--surface-2)] border border-[var(--border)] text-[var(--text)] hover:bg-[var(--surface-2)]/80 hover:border-[var(--accent)]/50 rounded-full font-semibold">
                  Browse Library
                </Button>
              </Link>
            </div>
          </Card>
        )}

        {/* Quick Actions - Only show if no brief yet */}
        {!brief && (
          <div className="grid md:grid-cols-2 gap-6">
            <Link href="/library">
              <Card className="rounded-2xl border border-[var(--border)] bg-[var(--surface-1)] p-6 hover:border-[var(--accent)]/50 transition-all cursor-pointer" style={{ boxShadow: 'var(--shadow)' }}>
                <div className="w-12 h-12 rounded-full bg-gradient-to-b from-[var(--accent-2)] to-[var(--accent)] flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-[#001018]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-[var(--accent)] mb-1">Browse Library</h3>
                <p className="text-sm text-[var(--text-dim)]">Explore peptide database</p>
              </Card>
            </Link>

            <Link href="/account">
              <Card className="rounded-2xl border border-[var(--border)] bg-[var(--surface-1)] p-6 hover:border-[var(--accent)]/50 transition-all cursor-pointer" style={{ boxShadow: 'var(--shadow)' }}>
                <div className="w-12 h-12 rounded-full bg-gradient-to-b from-[var(--accent-2)] to-[var(--accent)] flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-[#001018]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-[var(--accent)] mb-1">Account</h3>
                <p className="text-sm text-[var(--text-dim)]">Manage your profile</p>
              </Card>
            </Link>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
