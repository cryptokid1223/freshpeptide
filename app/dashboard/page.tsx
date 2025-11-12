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
  const [userId, setUserId] = useState<string>('');
  const [intakeData, setIntakeData] = useState<any>(null);
  const [brief, setBrief] = useState<BriefOutput | null>(null);
  const [dataStatus, setDataStatus] = useState<string>('Loading...');
  const [showDebug, setShowDebug] = useState(false);
  const [debugInfo, setDebugInfo] = useState<any>(null);

  useEffect(() => {
    // Check authentication with Supabase and load data from database
    const loadDashboardData = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        router.push('/auth');
        return;
      }
      
      setUserEmail(session.user.email || '');
      setUserId(session.user.id);
      console.log('📊 Dashboard loading for user:', session.user.email, session.user.id);

      // Load intake data from Supabase database
      const { data: intakeRecord, error: intakeError } = await supabase
        .from('intake')
        .select('intake_data')
        .eq('user_id', session.user.id)
        .maybeSingle();

      console.log('Intake query result:', { intakeRecord, intakeError });

      if (intakeRecord?.intake_data) {
        console.log('✅ Found intake data in database');
        setIntakeData(intakeRecord.intake_data);
        setDataStatus('Loaded from database ✅');
      } else {
        console.log('❌ No intake data found in database');
        setDataStatus('No intake data found in database');
      }

      // Load most recent brief from Supabase database
      const { data: briefRecords, error: briefError } = await supabase
        .from('briefs')
        .select('brief_output')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false })
        .limit(1);

      console.log('Brief query result:', { briefRecords, briefError });

      if (briefRecords && briefRecords.length > 0) {
        console.log('✅ Found brief in database');
        setBrief(briefRecords[0].brief_output as BriefOutput);
      } else {
        console.log('❌ No brief found in database');
      }
    };

    loadDashboardData();
  }, [router]);

  const testDatabaseConnection = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setDebugInfo({ error: 'Not authenticated' });
        return;
      }

      // Try to read from intake table
      const { data: intakeRecord, error: intakeError } = await supabase
        .from('intake')
        .select('*')
        .eq('user_id', session.user.id)
        .maybeSingle();

      // Try to read from briefs table
      const { data: briefRecords, error: briefError } = await supabase
        .from('briefs')
        .select('*')
        .eq('user_id', session.user.id);

      setDebugInfo({
        userId: session.user.id,
        userEmail: session.user.email,
        intakeRecord: intakeRecord,
        intakeError: intakeError?.message,
        briefRecords: briefRecords,
        briefError: briefError?.message,
        timestamp: new Date().toISOString()
      });
    } catch (error: any) {
      setDebugInfo({ error: error.message });
    }
  };

  const testWriteToDatabase = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        alert('Not authenticated');
        return;
      }

      // Try to write test data
      const testData = {
        demographics: { test: true, timestamp: new Date().toISOString() },
        medical: { test: true },
        lifestyle: { test: true },
        goals: { test: true }
      };

      const { data: result, error } = await supabase
        .from('intake')
        .upsert({
          user_id: session.user.id,
          intake_data: testData,
          updated_at: new Date().toISOString(),
        }, { onConflict: 'user_id' });

      if (error) {
        alert('Write FAILED: ' + error.message);
        setDebugInfo({ writeError: error.message, writeResult: result });
      } else {
        alert('Write SUCCESS! Data saved to database.');
        testDatabaseConnection(); // Refresh debug info
      }
    } catch (error: any) {
      alert('Exception: ' + error.message);
    }
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8 sm:py-16">
        <div className="max-w-6xl mx-auto">
          <div className="mb-6 sm:mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-cyan-400 mb-2">Dashboard</h1>
            <p className="text-sm sm:text-base text-slate-400 truncate">Welcome back, {userEmail}</p>
            
            {/* Diagnostic Info */}
            <div className="mt-4 p-3 bg-blue-900/20 border border-blue-700 rounded-lg">
              <p className="text-xs sm:text-sm text-blue-300">
                <strong>Data Status:</strong> {dataStatus}
              </p>
              <p className="text-xs text-slate-400 mt-1">User ID: {userId.substring(0, 8)}...</p>
              <div className="flex gap-2 mt-2">
                <Button
                  onClick={() => {
                    setShowDebug(!showDebug);
                    if (!showDebug) testDatabaseConnection();
                  }}
                  size="sm"
                  variant="outline"
                  className="text-xs border-blue-500 text-blue-300"
                >
                  {showDebug ? 'Hide' : 'Show'} Raw Data
                </Button>
                <Button
                  onClick={testWriteToDatabase}
                  size="sm"
                  variant="outline"
                  className="text-xs border-green-500 text-green-300"
                >
                  Test Write
                </Button>
              </div>
              
              {showDebug && debugInfo && (
                <div className="mt-3 p-3 bg-slate-900 rounded text-xs font-mono overflow-auto max-h-96">
                  <pre className="text-green-400 whitespace-pre-wrap break-words">
                    {JSON.stringify(debugInfo, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
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

