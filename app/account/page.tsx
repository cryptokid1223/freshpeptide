'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function AccountPage() {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState('');
  const [hasData, setHasData] = useState(false);

  useEffect(() => {
    const loadAccount = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        router.push('/auth');
        return;
      }
      
      setUserEmail(session.user.email || '');

      // Check if user has any data
      const { data: briefRecords } = await supabase
        .from('briefs')
        .select('id')
        .eq('user_id', session.user.id)
        .limit(1);

      setHasData(!!(briefRecords && briefRecords.length > 0));
    };

    loadAccount();
  }, [router]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  const handleClearData = async () => {
    if (!confirm('Are you sure? This will delete all your data including intake, briefs, logs, and journal entries.')) {
      return;
    }

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    // Delete all user data
    await Promise.all([
      supabase.from('intake').delete().eq('user_id', session.user.id),
      supabase.from('briefs').delete().eq('user_id', session.user.id),
      supabase.from('peptide_logs').delete().eq('user_id', session.user.id),
      supabase.from('daily_journal').delete().eq('user_id', session.user.id),
      supabase.from('user_peptide_stack').delete().eq('user_id', session.user.id),
    ]);

    localStorage.clear();
    alert('All data cleared successfully!');
    router.push('/consent');
  };

  return (
    <div className="min-h-screen bg-[#FDFCFA]">
      {/* Top Navigation */}
      <nav className="fixed top-0 left-0 right-0 bg-white/90 backdrop-blur-md border-b border-[#D4C4B0] z-50">
        <div className="container mx-auto px-6 py-3 max-w-7xl flex items-center justify-between">
          <Link href="/" className="hover:opacity-80 transition-opacity">
            <img src="/logo.png" alt="FreshPeptide" className="h-12 w-auto object-contain" />
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/dashboard">
              <Button variant="ghost" className="text-[#5C4A3A] hover:text-[#3E3028] hover:bg-[#F5EFE7] font-medium">
                Dashboard
              </Button>
            </Link>
            <Button onClick={handleSignOut} className="bg-[#8B6F47] text-white hover:bg-[#6F5839] font-medium px-6 rounded-lg">
              Sign Out
            </Button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-6 pt-28 pb-24 max-w-3xl">
        <h1 className="text-4xl font-bold text-[#3E3028] mb-8">Account Settings</h1>

        {/* Account Info */}
        <div className="bg-white border-2 border-[#D4C4B0] rounded-2xl p-8 mb-6">
          <h2 className="text-2xl font-bold text-[#3E3028] mb-4">Account Information</h2>
          <div className="space-y-3">
            <div>
              <p className="text-sm font-semibold text-[#8B6F47]">Email</p>
              <p className="text-lg text-[#3E3028]">{userEmail}</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-[#8B6F47]">Status</p>
              <p className="text-lg text-[#3E3028]">{hasData ? 'Active (Data saved)' : 'New Account'}</p>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="bg-white border-2 border-[#D4C4B0] rounded-2xl p-8 mb-6">
          <h2 className="text-2xl font-bold text-[#3E3028] mb-6">Quick Links</h2>
          <div className="grid grid-cols-2 gap-3">
            <Link href="/dashboard">
              <div className="bg-[#F5EFE7] border border-[#D4C4B0] hover:border-[#8B6F47] hover:bg-white rounded-xl p-4 text-center transition-all cursor-pointer">
                <div className="text-2xl mb-2">📊</div>
                <p className="font-semibold text-[#3E3028]">Dashboard</p>
              </div>
            </Link>
            <Link href="/generate">
              <div className="bg-[#F5EFE7] border border-[#D4C4B0] hover:border-[#8B6F47] hover:bg-white rounded-xl p-4 text-center transition-all cursor-pointer">
                <div className="text-2xl mb-2">🧬</div>
                <p className="font-semibold text-[#3E3028]">Generate Stack</p>
              </div>
            </Link>
            <Link href="/tracking">
              <div className="bg-[#F5EFE7] border border-[#D4C4B0] hover:border-[#8B6F47] hover:bg-white rounded-xl p-4 text-center transition-all cursor-pointer">
                <div className="text-2xl mb-2">✅</div>
                <p className="font-semibold text-[#3E3028]">Track Usage</p>
              </div>
            </Link>
            <Link href="/journal">
              <div className="bg-[#F5EFE7] border border-[#D4C4B0] hover:border-[#8B6F47] hover:bg-white rounded-xl p-4 text-center transition-all cursor-pointer">
                <div className="text-2xl mb-2">📝</div>
                <p className="font-semibold text-[#3E3028]">Daily Journal</p>
              </div>
            </Link>
            <Link href="/library" className="col-span-2">
              <div className="bg-[#F5EFE7] border border-[#D4C4B0] hover:border-[#8B6F47] hover:bg-white rounded-xl p-4 text-center transition-all cursor-pointer">
                <div className="text-2xl mb-2">📚</div>
                <p className="font-semibold text-[#3E3028]">Peptide Library</p>
              </div>
            </Link>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-red-900 mb-4 flex items-center gap-2">
            <span className="text-3xl">⚠️</span>
            Danger Zone
          </h2>
          <p className="text-red-800 mb-4 leading-relaxed">
            This will permanently delete all your data including your health intake, peptide stack, logs, and journal entries. 
            This action cannot be undone.
          </p>
          <Button
            onClick={handleClearData}
            className="bg-red-600 text-white hover:bg-red-700 font-semibold px-6 py-3 rounded-xl"
          >
            Clear All Data
          </Button>
        </div>

        {/* Info Box */}
        <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-6 mt-6">
          <h3 className="font-semibold text-blue-900 mb-2">Privacy & Security</h3>
          <ul className="space-y-2 text-sm text-blue-800">
            <li>• Your data is encrypted and stored securely in Supabase</li>
            <li>• We never share your personal health information</li>
            <li>• You can delete all your data at any time</li>
            <li>• This platform is for research and educational purposes only</li>
          </ul>
        </div>
      </main>

      {/* Research Disclaimer - Small Bottom Right */}
      <div className="fixed bottom-4 right-4 z-30">
        <p className="text-xs text-gray-400">
          Research purposes only
        </p>
      </div>
    </div>
  );
}
