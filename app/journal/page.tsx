'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function JournalPage() {
  const router = useRouter();
  const [entries, setEntries] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  
  // Form state
  const [mood, setMood] = useState(5);
  const [energy, setEnergy] = useState(5);
  const [sleep, setSleep] = useState(5);
  const [journalText, setJournalText] = useState('');
  const [journalDate, setJournalDate] = useState(new Date().toISOString().slice(0, 10));

  useEffect(() => {
    const loadJournals = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/auth');
        return;
      }

      const { data } = await supabase
        .from('daily_journal')
        .select('*')
        .eq('user_id', session.user.id)
        .order('journal_date', { ascending: false });

      if (data) {
        setEntries(data);
      }
    };

    loadJournals();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    await supabase.from('daily_journal').upsert({
      user_id: session.user.id,
      journal_date: journalDate,
      mood_rating: mood,
      energy_rating: energy,
      sleep_rating: sleep,
      journal_text: journalText,
    }, {
      onConflict: 'user_id,journal_date'
    });

    // Reload
    const { data } = await supabase
      .from('daily_journal')
      .select('*')
      .eq('user_id', session.user.id)
      .order('journal_date', { ascending: false });

    if (data) {
      setEntries(data);
    }

    setShowForm(false);
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
      <main className="container mx-auto px-6 pt-28 pb-24 max-w-4xl">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold text-[#3E3028]">Daily Journal</h1>
          <Button
            onClick={() => setShowForm(!showForm)}
            className="bg-[#8B6F47] text-white hover:bg-[#6F5839] font-semibold px-6 py-3 rounded-xl"
          >
            {showForm ? 'Cancel' : '+ New Entry'}
          </Button>
        </div>

        {/* Journal Form */}
        {showForm && (
          <div className="bg-white border-2 border-[#D4C4B0] rounded-2xl p-8 mb-8">
            <h3 className="text-2xl font-bold text-[#3E3028] mb-6">How are you feeling today?</h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-[#3E3028] mb-2">Date</label>
                <input
                  type="date"
                  value={journalDate}
                  onChange={(e) => setJournalDate(e.target.value)}
                  required
                  className="w-full bg-[#F5EFE7] border border-[#D4C4B0] text-[#3E3028] py-3 px-4 rounded-xl focus:outline-none focus:border-[#8B6F47]"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#3E3028] mb-2">
                  Mood: {mood}/10
                </label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={mood}
                  onChange={(e) => setMood(Number(e.target.value))}
                  className="w-full h-3 bg-[#E8DCC8] rounded-full appearance-none cursor-pointer accent-[#8B6F47]"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#3E3028] mb-2">
                  Energy: {energy}/10
                </label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={energy}
                  onChange={(e) => setEnergy(Number(e.target.value))}
                  className="w-full h-3 bg-[#E8DCC8] rounded-full appearance-none cursor-pointer accent-[#8B6F47]"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#3E3028] mb-2">
                  Sleep Quality: {sleep}/10
                </label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={sleep}
                  onChange={(e) => setSleep(Number(e.target.value))}
                  className="w-full h-3 bg-[#E8DCC8] rounded-full appearance-none cursor-pointer accent-[#8B6F47]"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#3E3028] mb-2">
                  Notes
                </label>
                <textarea
                  value={journalText}
                  onChange={(e) => setJournalText(e.target.value)}
                  placeholder="How are you feeling? Any changes or observations?"
                  rows={5}
                  className="w-full bg-[#F5EFE7] border border-[#D4C4B0] text-[#3E3028] py-3 px-4 rounded-xl focus:outline-none focus:border-[#8B6F47] focus:ring-1 focus:ring-[#8B6F47]"
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-[#8B6F47] text-white hover:bg-[#6F5839] font-bold py-4 rounded-xl text-lg"
              >
                Save Entry
              </Button>
            </form>
          </div>
        )}

        {/* Entries List */}
        <div>
          <h2 className="text-2xl font-bold text-[#3E3028] mb-6">Past Entries</h2>
          {entries.length === 0 ? (
            <div className="text-center py-16 bg-white border-2 border-[#E8DCC8] rounded-2xl">
              <div className="text-6xl mb-4">📝</div>
              <p className="text-[#5C4A3A] text-xl mb-4">No journal entries yet</p>
              <Button
                onClick={() => setShowForm(true)}
                className="bg-[#8B6F47] text-white hover:bg-[#6F5839] font-semibold px-8 py-3 rounded-xl"
              >
                Create Your First Entry
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {entries.map((entry) => (
                <div key={entry.id} className="bg-white border-2 border-[#D4C4B0] rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-xl font-bold text-[#3E3028]">
                      {new Date(entry.journal_date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                    </h4>
                  </div>
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="bg-[#F5EFE7] rounded-xl p-3 text-center">
                      <p className="text-sm text-[#5C4A3A] mb-1">Mood</p>
                      <p className="text-2xl font-bold text-[#3E3028]">{entry.mood_rating || '-'}/10</p>
                    </div>
                    <div className="bg-[#F5EFE7] rounded-xl p-3 text-center">
                      <p className="text-sm text-[#5C4A3A] mb-1">Energy</p>
                      <p className="text-2xl font-bold text-[#3E3028]">{entry.energy_rating || '-'}/10</p>
                    </div>
                    <div className="bg-[#F5EFE7] rounded-xl p-3 text-center">
                      <p className="text-sm text-[#5C4A3A] mb-1">Sleep</p>
                      <p className="text-2xl font-bold text-[#3E3028]">{entry.sleep_rating || '-'}/10</p>
                    </div>
                  </div>
                  {entry.journal_text && (
                    <div className="bg-[#F5EFE7] border border-[#D4C4B0] rounded-xl p-4">
                      <p className="text-[#5C4A3A] leading-relaxed">{entry.journal_text}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
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
