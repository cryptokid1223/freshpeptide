'use client';

import React, { useState, useEffect } from 'react';
import { MainLayout } from '@/components/MainLayout';
import { Card } from '@/components/ui/card';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { DailyJournal } from '@/components/ui/DailyJournal';
import { PeptideNotes } from '@/components/ui/PeptideNotes';
import { WeeklySummary } from '@/components/ui/WeeklySummary';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import type { BriefOutput } from '@/lib/supabase';

export default function JournalPage() {
  const router = useRouter();
  const [brief, setBrief] = useState<BriefOutput | null>(null);
  const [todayJournal, setTodayJournal] = useState<any>(null);
  const [selectedPeptide, setSelectedPeptide] = useState('');
  const [peptideNotes, setPeptideNotes] = useState<any[]>([]);
  const [weeklySummary, setWeeklySummary] = useState<any>(null);
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userId, setUserId] = useState('');

  useEffect(() => {
    const loadData = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        router.push('/auth');
        return;
      }

      setUserId(session.user.id);

      // Load user's peptide stack
      const { data: briefRecords } = await supabase
        .from('briefs')
        .select('brief_output')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false })
        .limit(1);

      if (briefRecords && briefRecords.length > 0) {
        setBrief(briefRecords[0].brief_output as BriefOutput);
        // Auto-select first peptide
        if (briefRecords[0].brief_output.candidatePeptides.length > 0) {
          const firstPeptide = briefRecords[0].brief_output.candidatePeptides[0].name;
          setSelectedPeptide(firstPeptide);
        }
      }

      // Load today's journal entry
      const today = new Date().toISOString().split('T')[0];
      const { data: journalData } = await supabase
        .from('daily_journal')
        .select('*')
        .eq('user_id', session.user.id)
        .eq('journal_date', today)
        .maybeSingle();

      setTodayJournal(journalData);

      // Load this week's summary
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      const weekAgoStr = weekAgo.toISOString().split('T')[0];

      const { data: summaryData } = await supabase
        .from('weekly_summaries')
        .select('*')
        .eq('user_id', session.user.id)
        .gte('week_start_date', weekAgoStr)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      setWeeklySummary(summaryData);
      setIsLoading(false);
    };

    loadData();
  }, [router]);

  useEffect(() => {
    if (selectedPeptide && userId) {
      loadPeptideNotes();
    }
  }, [selectedPeptide, userId]);

  const loadPeptideNotes = async () => {
    const { data } = await supabase
      .from('peptide_notes')
      .select('*')
      .eq('user_id', userId)
      .eq('peptide_name', selectedPeptide)
      .order('created_at', { ascending: false });

    setPeptideNotes(data || []);
  };

  const handleSaveJournal = async (journalData: any) => {
    const today = new Date().toISOString().split('T')[0];
    
    const { error } = await supabase
      .from('daily_journal')
      .upsert({
        user_id: userId,
        journal_date: today,
        ...journalData
      });

    if (error) throw error;
  };

  const handleAddNote = async (noteData: any) => {
    const { error } = await supabase
      .from('peptide_notes')
      .insert({
        user_id: userId,
        peptide_name: selectedPeptide,
        ...noteData
      });

    if (error) throw error;
    await loadPeptideNotes();
  };

  const handleDeleteNote = async (noteId: string) => {
    if (!confirm('Delete this note?')) return;
    
    const { error } = await supabase
      .from('peptide_notes')
      .delete()
      .eq('id', noteId);

    if (error) {
      alert('Failed to delete note');
    } else {
      await loadPeptideNotes();
    }
  };

  const handleGenerateSummary = async () => {
    setIsGeneratingSummary(true);
    try {
      const response = await fetch('/api/generate-summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId })
      });

      if (!response.ok) throw new Error('Failed to generate summary');

      const data = await response.json();
      setWeeklySummary(data.summary);
    } catch (error) {
      alert('Failed to generate weekly summary');
    } finally {
      setIsGeneratingSummary(false);
    }
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-16">
          <p className="text-[var(--text-dim)] text-center">Loading...</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8 sm:py-16 max-w-[1180px]">
        <div className="mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-[-0.01em] text-transparent bg-clip-text bg-gradient-to-b from-[#6EE7F5] to-[#12B3FF] mb-2">
            Journal & Notes
          </h1>
          <p className="text-sm sm:text-base text-[var(--text-dim)]">
            Track your daily well-being and observations about your peptide stack
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          {/* Daily Journal */}
          <div>
            <Card className="rounded-2xl border border-[var(--border)] bg-[var(--surface-1)] p-4 sm:p-6 mb-4 sm:mb-6" style={{ boxShadow: 'var(--shadow)' }}>
              <SectionTitle subtitle={new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}>
                Daily Check-In
              </SectionTitle>
              <DailyJournal
                initialMood={todayJournal?.mood_rating}
                initialEnergy={todayJournal?.energy_rating}
                initialSleep={todayJournal?.sleep_quality}
                initialText={todayJournal?.journal_text}
                onSave={handleSaveJournal}
              />
            </Card>
          </div>

          {/* Peptide-Specific Notes */}
          <div>
            <Card className="rounded-2xl border border-[var(--border)] bg-[var(--surface-1)] p-4 sm:p-6" style={{ boxShadow: 'var(--shadow)' }}>
              <SectionTitle>Peptide-Specific Notes</SectionTitle>
              
              {brief && brief.candidatePeptides.length > 0 ? (
                <>
                  <div className="mb-6">
                    <Select onValueChange={setSelectedPeptide} value={selectedPeptide}>
                      <SelectTrigger className="bg-[var(--surface-2)] border-[var(--border)] text-[var(--text)]">
                        <SelectValue placeholder="Select peptide" />
                      </SelectTrigger>
                      <SelectContent>
                        {brief.candidatePeptides.map((peptide, idx) => (
                          <SelectItem key={idx} value={peptide.name}>
                            {peptide.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {selectedPeptide && (
                    <div className="max-h-[400px] sm:max-h-[500px] overflow-y-auto">
                      <PeptideNotes
                        peptideName={selectedPeptide}
                        notes={peptideNotes}
                        onAddNote={handleAddNote}
                        onDeleteNote={handleDeleteNote}
                      />
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-8 sm:py-12">
                  <p className="text-sm sm:text-base text-[var(--text-dim)] mb-3">No peptide stack generated yet</p>
                  <p className="text-xs sm:text-sm text-[var(--text-muted)]">Generate your stack to start taking notes</p>
                </div>
              )}
            </Card>
          </div>
        </div>

        {/* Weekly AI Summary */}
        <div className="mt-6 sm:mt-8">
          <WeeklySummary
            summary={weeklySummary}
            isGenerating={isGeneratingSummary}
            onGenerate={handleGenerateSummary}
          />
        </div>
      </div>
    </MainLayout>
  );
}

