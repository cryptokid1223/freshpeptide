'use client';

import React, { useState, useEffect } from 'react';
import { MainLayout } from '@/components/MainLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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
    // Check authentication with Supabase
    const loadDashboardData = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        router.push('/auth');
        return;
      }
      
      setUserEmail(session.user.email || '');

      // Load intake data from localStorage
      const savedIntake = localStorage.getItem('intake_data');
      if (savedIntake) {
        setIntakeData(JSON.parse(savedIntake));
      }

      // Load brief from localStorage
      const savedBrief = localStorage.getItem('generated_brief');
      if (savedBrief) {
        setBrief(JSON.parse(savedBrief));
      }
    };

    loadDashboardData();
  }, [router]);

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-cyan-400 mb-2">Dashboard</h1>
            <p className="text-slate-400">Welcome back, {userEmail}</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* Intake Status Card */}
            <Card className="bg-slate-800/50 border-slate-700 p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="text-4xl">📋</div>
                <div>
                  <h2 className="text-xl font-semibold text-cyan-400">Health Intake</h2>
                  <p className="text-sm text-slate-400">
                    {intakeData ? 'Completed' : 'Not started'}
                  </p>
                </div>
              </div>
              {intakeData ? (
                <>
                  <p className="text-slate-300 mb-4">
                    Your comprehensive health intake is complete. You can view or update your 
                    information at any time.
                  </p>
                  <Link href="/intake">
                    <Button variant="outline" className="w-full border-slate-600">
                      View/Edit Intake
                    </Button>
                  </Link>
                </>
              ) : (
                <>
                  <p className="text-slate-300 mb-4">
                    Complete your health intake to get personalized peptide recommendations.
                  </p>
                  <Link href="/intake">
                    <Button className="w-full bg-cyan-600 hover:bg-cyan-700">
                      Start Intake
                    </Button>
                  </Link>
                </>
              )}
            </Card>

            {/* Brief Status Card */}
            <Card className="bg-slate-800/50 border-slate-700 p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="text-4xl">🤖</div>
                <div>
                  <h2 className="text-xl font-semibold text-cyan-400">Educational Brief</h2>
                  <p className="text-sm text-slate-400">
                    {brief ? 'Generated' : 'Not generated'}
                  </p>
                </div>
              </div>
              {brief ? (
                <>
                  <p className="text-slate-300 mb-4">
                    Your personalized educational brief is ready. Review peptide recommendations 
                    and research citations.
                  </p>
                  <Link href="/generate">
                    <Button variant="outline" className="w-full border-slate-600">
                      View Brief
                    </Button>
                  </Link>
                </>
              ) : (
                <>
                  <p className="text-slate-300 mb-4">
                    Generate an AI-powered educational brief based on your intake data.
                  </p>
                  <Link href="/generate">
                    <Button 
                      className="w-full bg-cyan-600 hover:bg-cyan-700"
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
            <Card className="bg-slate-800/50 border-slate-700 p-6 mb-6">
              <h2 className="text-2xl font-semibold text-cyan-400 mb-4">Intake Summary</h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                {intakeData.demographics && (
                  <div>
                    <h3 className="text-lg font-semibold text-slate-200 mb-2">Demographics</h3>
                    <div className="space-y-1 text-slate-300">
                      <p>Age: {intakeData.demographics.age}</p>
                      <p>Sex: {intakeData.demographics.sex}</p>
                      <p>Height: {intakeData.demographics.height}</p>
                      <p>Weight: {intakeData.demographics.weight}</p>
                    </div>
                  </div>
                )}

                {intakeData.goals && (
                  <div>
                    <h3 className="text-lg font-semibold text-slate-200 mb-2">Goals</h3>
                    <ul className="space-y-1 text-slate-300">
                      {intakeData.goals.selectedGoals?.map((goal: string, index: number) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-cyan-400">•</span>
                          <span>{goal}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </Card>
          )}

          {/* Brief Summary */}
          {brief && (
            <Card className="bg-slate-800/50 border-slate-700 p-6 mb-6">
              <h2 className="text-2xl font-semibold text-cyan-400 mb-4">Your Peptide Recommendations</h2>
              
              <div className="space-y-4">
                {brief.candidatePeptides.map((peptide, index) => (
                  <div key={index} className="bg-slate-900/50 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-slate-200 mb-2">
                      {peptide.name}
                    </h3>
                    <p className="text-slate-300 text-sm">{peptide.why}</p>
                  </div>
                ))}
              </div>

              <Link href="/generate">
                <Button className="w-full mt-4 bg-cyan-600 hover:bg-cyan-700">
                  View Full Brief
                </Button>
              </Link>
            </Card>
          )}

          {/* Quick Actions */}
          <div className="grid md:grid-cols-3 gap-4">
            <Link href="/library">
              <Card className="bg-slate-800/50 border-slate-700 p-6 hover:bg-slate-800/70 transition-all cursor-pointer">
                <div className="text-3xl mb-2">📚</div>
                <h3 className="text-lg font-semibold text-cyan-400 mb-1">Browse Library</h3>
                <p className="text-sm text-slate-400">Explore peptide database</p>
              </Card>
            </Link>

            <Link href="/account">
              <Card className="bg-slate-800/50 border-slate-700 p-6 hover:bg-slate-800/70 transition-all cursor-pointer">
                <div className="text-3xl mb-2">👤</div>
                <h3 className="text-lg font-semibold text-cyan-400 mb-1">Account</h3>
                <p className="text-sm text-slate-400">Manage your profile</p>
              </Card>
            </Link>

          </div>
        </div>
      </div>
    </MainLayout>
  );
}

