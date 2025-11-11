'use client';

import React, { useState, useEffect } from 'react';
import { MainLayout } from '@/components/MainLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export default function AccountPage() {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState<string>('');
  const [userId, setUserId] = useState<string>('');
  const [intakeCompleted, setIntakeCompleted] = useState(false);
  const [briefGenerated, setBriefGenerated] = useState(false);

  useEffect(() => {
    const email = localStorage.getItem('user_email');
    const id = localStorage.getItem('user_id');
    
    if (!email) {
      router.push('/auth');
      return;
    }

    setUserEmail(email);
    setUserId(id || '');
    setIntakeCompleted(!!localStorage.getItem('intake_completed'));
    setBriefGenerated(!!localStorage.getItem('generated_brief'));
  }, [router]);

  const handleSignOut = () => {
    if (confirm('Are you sure you want to sign out?')) {
      localStorage.clear();
      router.push('/');
    }
  };

  const handleClearData = () => {
    if (confirm('Are you sure you want to clear all your data? This action cannot be undone.')) {
      localStorage.removeItem('intake_data');
      localStorage.removeItem('intake_completed');
      localStorage.removeItem('generated_brief');
      setIntakeCompleted(false);
      setBriefGenerated(false);
      alert('Data cleared successfully!');
    }
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold text-cyan-400 mb-8">Account Settings</h1>

          {/* Profile Card */}
          <Card className="bg-slate-800/50 border-slate-700 p-6 mb-6">
            <h2 className="text-2xl font-semibold text-cyan-400 mb-4">Profile Information</h2>
            
            <div className="space-y-3">
              <div>
                <label className="text-sm text-slate-400">Email Address</label>
                <p className="text-slate-200">{userEmail}</p>
              </div>
              
              <div>
                <label className="text-sm text-slate-400">User ID</label>
                <p className="text-slate-200 font-mono text-sm">{userId}</p>
              </div>
              
              <div>
                <label className="text-sm text-slate-400">Account Status</label>
                <p className="text-green-400">Active (Demo)</p>
              </div>
            </div>
          </Card>

          {/* Data Status Card */}
          <Card className="bg-slate-800/50 border-slate-700 p-6 mb-6">
            <h2 className="text-2xl font-semibold text-cyan-400 mb-4">Data Status</h2>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between py-2 border-b border-slate-700">
                <div>
                  <p className="text-slate-200">Health Intake</p>
                  <p className="text-sm text-slate-400">Demographic and medical information</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm ${
                  intakeCompleted 
                    ? 'bg-green-900/30 text-green-400 border border-green-700' 
                    : 'bg-slate-700 text-slate-400'
                }`}>
                  {intakeCompleted ? 'Complete' : 'Incomplete'}
                </span>
              </div>
              
              <div className="flex items-center justify-between py-2 border-b border-slate-700">
                <div>
                  <p className="text-slate-200">Educational Brief</p>
                  <p className="text-sm text-slate-400">AI-generated peptide recommendations</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm ${
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
          <Card className="bg-slate-800/50 border-slate-700 p-6 mb-6">
            <h2 className="text-2xl font-semibold text-cyan-400 mb-4">Account Actions</h2>
            
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

          {/* Demo Information */}
          <Card className="bg-blue-900/20 border-blue-700 p-6">
            <h3 className="text-lg font-semibold text-blue-400 mb-2">Demo Mode Information</h3>
            <p className="text-slate-300 text-sm mb-3">
              This is a demonstration version of FreshPeptide. In a production environment:
            </p>
            <ul className="space-y-2 text-sm text-slate-300">
              <li className="flex items-start gap-2">
                <span className="text-blue-400">•</span>
                <span>Data would be securely stored in Supabase with proper encryption</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400">•</span>
                <span>Authentication would use Supabase Auth with email verification</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400">•</span>
                <span>Row-level security policies would protect user data</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400">•</span>
                <span>AI calls would be rate-limited and logged for audit purposes</span>
              </li>
            </ul>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}

