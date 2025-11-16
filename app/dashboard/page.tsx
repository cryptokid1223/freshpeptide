'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import type { BriefOutput } from '@/lib/supabase';

export default function DashboardPage() {
  const router = useRouter();
  const [userName, setUserName] = useState<string>('');
  const [brief, setBrief] = useState<BriefOutput | null>(null);
  const [logs, setLogs] = useState<any[]>([]);
  const [recentJournal, setRecentJournal] = useState<any>(null);
  const [hasIntake, setHasIntake] = useState(false);

  useEffect(() => {
    const loadDashboard = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        router.push('/auth');
        return;
      }
      
      // Get user's name from profiles
      const { data: profile } = await supabase
        .from('profiles')
        .select('first_name, last_name')
        .eq('id', session.user.id)
        .single();

      if (profile?.first_name && profile?.last_name) {
        setUserName(`${profile.first_name} ${profile.last_name}`);
      } else {
        setUserName(session.user.email?.split('@')[0] || 'there');
      }

      // Load intake
      const { data: intakeRecord } = await supabase
        .from('intake')
        .select('intake_data')
        .eq('user_id', session.user.id)
        .maybeSingle();

      setHasIntake(!!intakeRecord?.intake_data);

      // Load brief
      const { data: briefRecords } = await supabase
        .from('briefs')
        .select('brief_output')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false })
        .limit(1);

      if (briefRecords && briefRecords.length > 0) {
        setBrief(briefRecords[0].brief_output as BriefOutput);
      }

      // Load recent logs (last 5)
      const { data: logsData } = await supabase
        .from('peptide_logs')
        .select('*')
        .eq('user_id', session.user.id)
        .order('logged_at', { ascending: false })
        .limit(5);

      if (logsData) {
        setLogs(logsData);
      }

      // Load most recent journal
      const { data: journalData } = await supabase
        .from('daily_journal')
        .select('*')
        .eq('user_id', session.user.id)
        .order('journal_date', { ascending: false })
        .limit(1);

      if (journalData && journalData.length > 0) {
        setRecentJournal(journalData[0]);
      }
    };

    loadDashboard();
  }, [router]);

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
              src="/updatedlogo.png" 
              alt="FreshPeptide" 
              className="h-16 w-auto object-contain"
            />
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/library">
              <Button 
                variant="ghost"
                className="text-[#5C4A3A] hover:text-[#3E3028] hover:bg-[#F5EFE7] font-medium"
              >
                Library
              </Button>
            </Link>
            <Link href="/account">
              <Button 
                variant="ghost"
                className="text-[#5C4A3A] hover:text-[#3E3028] hover:bg-[#F5EFE7] font-medium"
              >
                Account
              </Button>
            </Link>
            <Button 
              onClick={handleSignOut}
              className="bg-[#8B6F47] text-white hover:bg-[#6F5839] font-medium px-6 rounded-lg"
            >
              Sign Out
            </Button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-6 pt-24 pb-24 max-w-6xl">
        {/* Welcome Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-[#3E3028] mb-2">
            Welcome back, {userName}!
          </h1>
        </div>

        {/* Quick Actions - Large Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
          <Link href="/generate">
            <div className="bg-gradient-to-br from-[#8B6F47] to-[#6F5839] text-white rounded-2xl p-8 hover:shadow-lg transition-all cursor-pointer">
              <div className="text-4xl mb-3">🧬</div>
              <h3 className="text-2xl font-bold mb-2">Generate Stack</h3>
              <p className="text-white/80">Get personalized peptide recommendations</p>
            </div>
          </Link>

          <Link href="/tracking">
            <div className="bg-white border-2 border-[#D4C4B0] rounded-2xl p-8 hover:border-[#8B6F47] hover:shadow-lg transition-all cursor-pointer">
              <div className="text-4xl mb-3">📊</div>
              <h3 className="text-2xl font-bold text-[#3E3028] mb-2">Track Usage</h3>
              <p className="text-[#5C4A3A]">Log your peptide doses</p>
            </div>
          </Link>

          <Link href="/journal">
            <div className="bg-white border-2 border-[#D4C4B0] rounded-2xl p-8 hover:border-[#8B6F47] hover:shadow-lg transition-all cursor-pointer">
              <div className="text-4xl mb-3">📝</div>
              <h3 className="text-2xl font-bold text-[#3E3028] mb-2">Daily Journal</h3>
              <p className="text-[#5C4A3A]">Record your progress</p>
            </div>
          </Link>
        </div>

        {/* Status Cards */}
        {!hasIntake && (
          <div className="bg-orange-50 border-2 border-orange-200 rounded-2xl p-6 mb-8">
            <div className="flex items-start gap-4">
              <div className="text-3xl">⚠️</div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-orange-900 mb-2">
                  Complete Your Health Intake
                </h3>
                <p className="text-orange-800 mb-4">
                  Answer a few questions to get personalized peptide recommendations
                </p>
                <Link href="/consent">
                  <Button className="bg-orange-600 text-white hover:bg-orange-700 font-semibold px-6 rounded-lg">
                    Start Questionnaire →
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}

        {!brief && hasIntake && (
          <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-6 mb-8">
            <div className="flex items-start gap-4">
              <div className="text-3xl">💡</div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-blue-900 mb-2">
                  Ready to Generate Your Stack
                </h3>
                <p className="text-blue-800 mb-4">
                  You've completed your intake. Generate your personalized peptide recommendations now!
                </p>
                <Link href="/generate">
                  <Button className="bg-[#8B6F47] text-white hover:bg-[#6F5839] font-semibold px-6 rounded-lg">
                    Generate My Stack →
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Your Current Stack */}
        {brief && (
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-[#3E3028] mb-6">Your Peptide Stack</h2>
            <div className="space-y-4">
              {brief.candidatePeptides?.map((peptide: any, index: number) => (
                <div
                  key={index}
                  className="bg-white border-2 border-[#D4C4B0] rounded-2xl p-6 hover:border-[#8B6F47] hover:shadow-md transition-all"
                >
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <h3 className="text-2xl font-bold text-[#3E3028]">
                      {peptide.name}
                    </h3>
                    <Link href="/tracking">
                      <Button className="bg-[#8B6F47] text-white hover:bg-[#6F5839] font-medium px-4 py-2 rounded-lg text-sm whitespace-nowrap">
                        Log Dose
                      </Button>
                    </Link>
                  </div>
                  <p className="text-[#5C4A3A] mb-3 leading-relaxed">{peptide.why}</p>
                  <div className="bg-[#F5EFE7] border border-[#D4C4B0] rounded-xl p-4">
                    <p className="text-sm font-semibold text-[#3E3028] mb-1">Dosage:</p>
                    <p className="text-[#5C4A3A]">{peptide.recommendedDosage}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 text-center">
              <Link href="/generate">
                <Button variant="outline" className="border-2 border-[#D4C4B0] text-[#5C4A3A] hover:bg-[#F5EFE7] font-medium px-8 rounded-lg">
                  View Full Details →
                </Button>
              </Link>
            </div>
          </div>
        )}

        {/* Recent Activity */}
        {logs.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold text-[#3E3028]">Recent Activity</h2>
              <Link href="/tracking">
                <Button variant="ghost" className="text-[#8B6F47] hover:text-[#6F5839] font-semibold">
                  View All →
                </Button>
              </Link>
            </div>
            <div className="space-y-3">
              {logs.slice(0, 5).map((log) => {
                const logDate = new Date(log.logged_at);
                return (
                  <div
                    key={log.id}
                    className="bg-white border border-[#E8DCC8] rounded-xl p-4 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-2 h-2 rounded-full bg-[#8B6F47]"></div>
                      <div>
                        <p className="font-semibold text-[#3E3028]">{log.peptide_name}</p>
                        <p className="text-sm text-[#5C4A3A]">{log.amount || 'Logged'}</p>
                      </div>
                    </div>
                    <p className="text-sm text-[#8B6F47]">
                      {logDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Today's Journal Preview */}
        {recentJournal && (
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold text-[#3E3028]">Today's Journal</h2>
              <Link href="/journal">
                <Button variant="ghost" className="text-[#8B6F47] hover:text-[#6F5839] font-semibold">
                  View All →
                </Button>
              </Link>
            </div>
            <div className="bg-white border-2 border-[#D4C4B0] rounded-2xl p-6">
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div>
                  <p className="text-sm text-[#5C4A3A] mb-1">Mood</p>
                  <p className="text-2xl font-bold text-[#3E3028]">{recentJournal.mood_rating || '-'}/10</p>
                </div>
                <div>
                  <p className="text-sm text-[#5C4A3A] mb-1">Energy</p>
                  <p className="text-2xl font-bold text-[#3E3028]">{recentJournal.energy_rating || '-'}/10</p>
                </div>
                <div>
                  <p className="text-sm text-[#5C4A3A] mb-1">Sleep</p>
                  <p className="text-2xl font-bold text-[#3E3028]">{recentJournal.sleep_rating || '-'}/10</p>
                </div>
              </div>
              {recentJournal.journal_text && (
                <div className="bg-[#F5EFE7] rounded-xl p-4">
                  <p className="text-[#5C4A3A] line-clamp-3">{recentJournal.journal_text}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Empty State - No Brief */}
        {!brief && hasIntake && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🧬</div>
            <h3 className="text-2xl font-bold text-[#3E3028] mb-3">
              Ready to Get Started?
            </h3>
            <p className="text-[#5C4A3A] mb-6 max-w-md mx-auto">
              Generate your personalized peptide stack based on your health profile
            </p>
            <Link href="/generate">
              <Button className="bg-[#8B6F47] text-white hover:bg-[#6F5839] font-semibold px-8 py-4 rounded-xl text-lg">
                Generate My Stack →
              </Button>
            </Link>
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
