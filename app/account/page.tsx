'use client';

import React, { useState, useEffect } from 'react';
import { MainLayout } from '@/components/MainLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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
        intake.goals;
      
      setIntakeCompleted(!!hasIntake);

      // Check brief status from Supabase
      const { data: briefRecords } = await supabase
        .from('briefs')
        .select('id')
        .eq('user_id', session.user.id)
        .limit(1);

      setBriefGenerated(briefRecords && briefRecords.length > 0);
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
        // Delete from Supabase
        await supabase.from('intake').delete().eq('user_id', session.user.id);
        await supabase.from('briefs').delete().eq('user_id', session.user.id);
      }
      
      // Clear localStorage
      localStorage.removeItem('intake_data');
      localStorage.removeItem('intake_completed');
      localStorage.removeItem('generated_brief');
      
      setIntakeCompleted(false);
      setBriefGenerated(false);
      alert('All data cleared successfully!');
    }
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8 sm:py-16">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl sm:text-4xl font-bold text-cyan-400 mb-6 sm:mb-8">Account Settings</h1>

          {/* Profile Card */}
          <Card className="bg-slate-800/50 border-slate-700 p-4 sm:p-6 mb-4 sm:mb-6">
            <h2 className="text-xl sm:text-2xl font-semibold text-cyan-400 mb-3 sm:mb-4">Profile Information</h2>
            
            <div className="space-y-3">
              <div>
                <label className="text-xs sm:text-sm text-slate-400">Email Address</label>
                <p className="text-sm sm:text-base text-slate-200 break-words">{userEmail}</p>
              </div>
              
              <div>
                <label className="text-xs sm:text-sm text-slate-400">User ID</label>
                <p className="text-xs sm:text-sm text-slate-200 font-mono break-all">{userId}</p>
              </div>
              
              <div>
                <label className="text-xs sm:text-sm text-slate-400">Account Status</label>
                <p className="text-sm sm:text-base text-green-400">Active</p>
              </div>
            </div>
          </Card>

          {/* Data Status Card */}
          <Card className="bg-slate-800/50 border-slate-700 p-4 sm:p-6 mb-4 sm:mb-6">
            <h2 className="text-xl sm:text-2xl font-semibold text-cyan-400 mb-3 sm:mb-4">Data Status</h2>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between py-2 border-b border-slate-700 gap-3">
                <div className="flex-1">
                  <p className="text-sm sm:text-base text-slate-200">Health Intake</p>
                  <p className="text-xs sm:text-sm text-slate-400">Demographic and medical information</p>
                </div>
                <span className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm flex-shrink-0 ${
                  intakeCompleted 
                    ? 'bg-green-900/30 text-green-400 border border-green-700' 
                    : 'bg-slate-700 text-slate-400'
                }`}>
                  {intakeCompleted ? 'Complete' : 'Incomplete'}
                </span>
              </div>
              
              <div className="flex items-center justify-between py-2 border-b border-slate-700 gap-3">
                <div className="flex-1">
                  <p className="text-sm sm:text-base text-slate-200">Educational Brief</p>
                  <p className="text-xs sm:text-sm text-slate-400">AI-generated peptide recommendations</p>
                </div>
                <span className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm flex-shrink-0 ${
                  briefGenerated 
                    ? 'bg-green-900/30 text-green-400 border border-green-700' 
                    : 'bg-slate-700 text-slate-400'
                }`}>
                  {briefGenerated ? 'Generated' : 'Not Generated'}
                </span>
              </div>
            </div>
          </Card>

          {/* Actions Card */}
          <Card className="bg-slate-800/50 border-slate-700 p-4 sm:p-6 mb-4 sm:mb-6">
            <h2 className="text-xl sm:text-2xl font-semibold text-cyan-400 mb-3 sm:mb-4">Account Actions</h2>
            
            <div className="space-y-3">
              <Button
                onClick={() => router.push('/dashboard')}
                className="w-full bg-cyan-600 hover:bg-cyan-700"
              >
                Go to Dashboard
              </Button>
              
              <Button
                onClick={handleClearData}
                variant="outline"
                className="w-full border-slate-600 text-slate-300 hover:bg-slate-700"
              >
                Clear All Data
              </Button>
              
              <Button
                onClick={handleSignOut}
                variant="outline"
                className="w-full border-red-600 text-red-400 hover:bg-red-900/20"
              >
                Sign Out
              </Button>
            </div>
          </Card>

          {/* Security Information */}
          <Card className="bg-blue-900/20 border-blue-700 p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-semibold text-blue-400 mb-2">Security & Privacy</h3>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-300">
              <li className="flex items-start gap-2">
                <span className="text-blue-400 flex-shrink-0">•</span>
                <span>Your data is securely stored in Supabase with encryption</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400 flex-shrink-0">•</span>
                <span>Row-level security policies protect your information</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400 flex-shrink-0">•</span>
                <span>Only you can access your intake data and briefs</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400 flex-shrink-0">•</span>
                <span>Use "Clear All Data" to permanently delete your information</span>
              </li>
            </ul>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}

