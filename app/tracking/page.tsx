'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function TrackingPage() {
  const router = useRouter();
  const [peptides, setPeptides] = useState<string[]>([]);
  const [logs, setLogs] = useState<any[]>([]);
  const [showLogForm, setShowLogForm] = useState(false);
  
  // Form state
  const [selectedPeptide, setSelectedPeptide] = useState('');
  const [customPeptide, setCustomPeptide] = useState('');
  const [amount, setAmount] = useState('');
  const [loggedAt, setLoggedAt] = useState(new Date().toISOString().slice(0, 16));
  const [notes, setNotes] = useState('');

  useEffect(() => {
    const loadData = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/auth');
        return;
      }

      // Get peptides from brief - try multiple times if needed
      let briefRecords = null;
      for (let i = 0; i < 3; i++) {
        const { data: records } = await supabase
          .from('briefs')
          .select('brief_output')
          .eq('user_id', session.user.id)
          .order('created_at', { ascending: false })
          .limit(1);

        if (records && records.length > 0) {
          briefRecords = records;
          break;
        }
        
        // Wait before retry
        await new Promise(resolve => setTimeout(resolve, 500));
      }

      if (briefRecords && briefRecords.length > 0) {
        const brief = briefRecords[0].brief_output as any;
        const peptideNames = brief.candidatePeptides?.map((p: any) => p.name) || [];
        console.log('Loaded peptides from brief:', peptideNames);
        setPeptides(peptideNames);
      } else {
        console.log('No brief found, peptides list will be empty');
        setPeptides([]);
      }

      // Load logs
      const { data: logsData } = await supabase
        .from('peptide_logs')
        .select('*')
        .eq('user_id', session.user.id)
        .order('logged_at', { ascending: false });

      if (logsData) {
        setLogs(logsData);
      }
    };

    loadData();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const peptideName = selectedPeptide === 'custom' ? customPeptide : selectedPeptide;

    await supabase.from('peptide_logs').insert({
      user_id: session.user.id,
      peptide_name: peptideName,
      amount,
      logged_at: new Date(loggedAt).toISOString(),
      notes,
    });

    // Reload logs
    const { data: logsData } = await supabase
      .from('peptide_logs')
      .select('*')
      .eq('user_id', session.user.id)
      .order('logged_at', { ascending: false });

    if (logsData) {
      setLogs(logsData);
    }

    // Reset form
    setSelectedPeptide('');
    setCustomPeptide('');
    setAmount('');
    setLoggedAt(new Date().toISOString().slice(0, 16));
    setNotes('');
    setShowLogForm(false);
  };

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
            <img src="/updatedlogo.png" alt="FreshPeptide" className="h-16 w-auto object-contain" />
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
      <main className="container mx-auto px-6 pt-28 pb-24 max-w-4xl">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold text-[#3E3028]">Track Usage</h1>
          <Button
            onClick={() => setShowLogForm(!showLogForm)}
            className="bg-[#8B6F47] text-white hover:bg-[#6F5839] font-semibold px-6 py-3 rounded-xl"
          >
            {showLogForm ? 'Cancel' : '+ Log Dose'}
          </Button>
        </div>

        {/* Log Form */}
        {showLogForm && (
          <div className="bg-white border-2 border-[#D4C4B0] rounded-2xl p-8 mb-8">
            <h3 className="text-2xl font-bold text-[#3E3028] mb-6">Log a Dose</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-[#3E3028] mb-2">Peptide</label>
                <select
                  value={selectedPeptide}
                  onChange={(e) => setSelectedPeptide(e.target.value)}
                  required
                  className="w-full bg-[#F5EFE7] border border-[#D4C4B0] text-[#3E3028] py-3 px-4 rounded-xl focus:outline-none focus:border-[#8B6F47] focus:ring-1 focus:ring-[#8B6F47]"
                >
                  <option value="">Select a peptide...</option>
                  {peptides.map(p => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                  <option value="custom">Other (custom)</option>
                </select>
              </div>

              {selectedPeptide === 'custom' && (
                <div>
                  <label className="block text-sm font-semibold text-[#3E3028] mb-2">Peptide Name</label>
                  <input
                    type="text"
                    value={customPeptide}
                    onChange={(e) => setCustomPeptide(e.target.value)}
                    required
                    placeholder="Enter peptide name"
                    className="w-full bg-[#F5EFE7] border border-[#D4C4B0] text-[#3E3028] py-3 px-4 rounded-xl focus:outline-none focus:border-[#8B6F47] focus:ring-1 focus:ring-[#8B6F47]"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold text-[#3E3028] mb-2">Amount (e.g., "250 mcg" or "20 units")</label>
                <input
                  type="text"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="e.g., 250 mcg or 20 units"
                  className="w-full bg-[#F5EFE7] border border-[#D4C4B0] text-[#3E3028] py-3 px-4 rounded-xl focus:outline-none focus:border-[#8B6F47] focus:ring-1 focus:ring-[#8B6F47]"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#3E3028] mb-2">Date & Time</label>
                <input
                  type="datetime-local"
                  value={loggedAt}
                  onChange={(e) => setLoggedAt(e.target.value)}
                  required
                  className="w-full bg-[#F5EFE7] border border-[#D4C4B0] text-[#3E3028] py-3 px-4 rounded-xl focus:outline-none focus:border-[#8B6F47] focus:ring-1 focus:ring-[#8B6F47]"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#3E3028] mb-2">Notes (Optional)</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="How are you feeling? Any effects noticed?"
                  rows={3}
                  className="w-full bg-[#F5EFE7] border border-[#D4C4B0] text-[#3E3028] py-3 px-4 rounded-xl focus:outline-none focus:border-[#8B6F47] focus:ring-1 focus:ring-[#8B6F47]"
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-[#8B6F47] text-white hover:bg-[#6F5839] font-bold py-4 rounded-xl text-lg"
              >
                Save Log
              </Button>
            </form>
          </div>
        )}

        {/* Logs List */}
        <div>
          <h2 className="text-2xl font-bold text-[#3E3028] mb-6">Your Logs</h2>
          {logs.length === 0 ? (
            <div className="text-center py-16 bg-white border-2 border-[#E8DCC8] rounded-2xl">
              <div className="text-6xl mb-4">📊</div>
              <p className="text-[#5C4A3A] text-xl mb-4">No logs yet</p>
              <Button
                onClick={() => setShowLogForm(true)}
                className="bg-[#8B6F47] text-white hover:bg-[#6F5839] font-semibold px-8 py-3 rounded-xl"
              >
                Log Your First Dose
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {logs.map((log) => {
                const logDate = new Date(log.logged_at);
                return (
                  <div key={log.id} className="bg-white border border-[#E8DCC8] rounded-xl p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h4 className="text-xl font-bold text-[#3E3028] mb-1">{log.peptide_name}</h4>
                        {log.amount && <p className="text-[#8B6F47] font-semibold mb-2">{log.amount}</p>}
                        {log.notes && <p className="text-[#5C4A3A] text-sm">{log.notes}</p>}
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-sm font-semibold text-[#3E3028]">
                          {logDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </p>
                        <p className="text-xs text-[#8B6F47]">
                          {logDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
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
