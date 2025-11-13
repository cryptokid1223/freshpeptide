'use client';

import React, { useState, useEffect } from 'react';
import { MainLayout } from '@/components/MainLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { StatusPill } from '@/components/ui/StatusPill';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import type { BriefOutput } from '@/lib/supabase';

interface PeptideLog {
  id: string;
  peptide_name: string;
  peptide_class: string | null;
  amount: string | null;
  route: string | null;
  logged_at: string;
  notes: string | null;
  effects: string | null;
  side_effects: string | null;
  created_at: string;
}

export default function TrackingPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [brief, setBrief] = useState<BriefOutput | null>(null);
  const [logs, setLogs] = useState<PeptideLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Form state
  const [selectedPeptide, setSelectedPeptide] = useState('');
  const [amount, setAmount] = useState('');
  const [route, setRoute] = useState('');
  const [loggedAt, setLoggedAt] = useState(new Date().toISOString().slice(0, 16));
  const [notes, setNotes] = useState('');
  const [effects, setEffects] = useState('');
  const [sideEffects, setSideEffects] = useState('');

  useEffect(() => {
    const loadData = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        router.push('/auth');
        return;
      }
      
      setIsAuthenticated(true);

      // Load user's peptide stack from brief
      const { data: briefRecords } = await supabase
        .from('briefs')
        .select('brief_output')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false })
        .limit(1);

      if (briefRecords && briefRecords.length > 0) {
        setBrief(briefRecords[0].brief_output as BriefOutput);
      }

      // Load existing logs
      await loadLogs(session.user.id);
      setIsLoading(false);
    };

    loadData();
  }, [router]);

  const loadLogs = async (userId: string) => {
    const { data, error } = await supabase
      .from('peptide_logs')
      .select('*')
      .eq('user_id', userId)
      .order('logged_at', { ascending: false })
      .limit(50);

    if (data) {
      setLogs(data);
    }
    if (error) {
      console.error('Error loading logs:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        alert('Please sign in to log peptides');
        return;
      }

      const { error } = await supabase.from('peptide_logs').insert({
        user_id: session.user.id,
        peptide_name: selectedPeptide,
        amount: amount || null,
        route: route || null,
        logged_at: loggedAt,
        notes: notes || null,
        effects: effects || null,
        side_effects: sideEffects || null,
      });

      if (error) throw error;

      // Reset form
      setSelectedPeptide('');
      setAmount('');
      setRoute('');
      setLoggedAt(new Date().toISOString().slice(0, 16));
      setNotes('');
      setEffects('');
      setSideEffects('');

      // Reload logs
      await loadLogs(session.user.id);
      alert('Log saved successfully!');
    } catch (error) {
      console.error('Error saving log:', error);
      alert('Failed to save log. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-16 max-w-[1180px]">
          <p className="text-[var(--text-dim)] text-center">Loading...</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-16 max-w-[1180px]">
        <div className="mb-12">
          <h1 className="text-4xl font-extrabold tracking-[-0.01em] text-transparent bg-clip-text bg-gradient-to-b from-[#6EE7F5] to-[#12B3FF] mb-2">
            Peptide Tracking
          </h1>
          <p className="text-[var(--text-dim)]">
            Log your peptide usage and monitor your progress
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Log Entry Form */}
          <div>
            <Card className="rounded-2xl border border-[var(--border)] bg-[var(--surface-1)] p-6" style={{ boxShadow: 'var(--shadow)' }}>
              <SectionTitle>Log New Entry</SectionTitle>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Peptide Selection */}
                <div>
                  <Label htmlFor="peptide" className="text-[var(--text)] font-medium">
                    Peptide *
                  </Label>
                  {brief && brief.candidatePeptides.length > 0 ? (
                    <Select onValueChange={setSelectedPeptide} value={selectedPeptide} required>
                      <SelectTrigger className="mt-2 bg-[var(--surface-2)] border-[var(--border)] text-[var(--text)]">
                        <SelectValue placeholder="Select peptide from your stack" />
                      </SelectTrigger>
                      <SelectContent>
                        {brief.candidatePeptides.map((peptide, idx) => (
                          <SelectItem key={idx} value={peptide.name}>
                            {peptide.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <Input
                      id="peptide"
                      value={selectedPeptide}
                      onChange={(e) => setSelectedPeptide(e.target.value)}
                      placeholder="Enter peptide name"
                      required
                      className="mt-2 bg-[var(--surface-2)] border-[var(--border)] text-[var(--text)]"
                    />
                  )}
                </div>

                {/* Amount */}
                <div>
                  <Label htmlFor="amount" className="text-[var(--text)] font-medium">
                    Amount/Dosage
                  </Label>
                  <Input
                    id="amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="e.g., 250 mcg"
                    className="mt-2 bg-[var(--surface-2)] border-[var(--border)] text-[var(--text)]"
                  />
                </div>

                {/* Route */}
                <div>
                  <Label htmlFor="route" className="text-[var(--text)] font-medium">
                    Route of Administration
                  </Label>
                  <Select onValueChange={setRoute} value={route}>
                    <SelectTrigger className="mt-2 bg-[var(--surface-2)] border-[var(--border)] text-[var(--text)]">
                      <SelectValue placeholder="Select route" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="subcutaneous">Subcutaneous (SC)</SelectItem>
                      <SelectItem value="intramuscular">Intramuscular (IM)</SelectItem>
                      <SelectItem value="oral">Oral</SelectItem>
                      <SelectItem value="nasal">Nasal</SelectItem>
                      <SelectItem value="topical">Topical</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Date/Time */}
                <div>
                  <Label htmlFor="loggedAt" className="text-[var(--text)] font-medium">
                    Date & Time *
                  </Label>
                  <Input
                    id="loggedAt"
                    type="datetime-local"
                    value={loggedAt}
                    onChange={(e) => setLoggedAt(e.target.value)}
                    required
                    className="mt-2 bg-[var(--surface-2)] border-[var(--border)] text-[var(--text)]"
                  />
                </div>

                {/* Effects */}
                <div>
                  <Label htmlFor="effects" className="text-[var(--text)] font-medium">
                    Positive Effects/Observations
                  </Label>
                  <Textarea
                    id="effects"
                    value={effects}
                    onChange={(e) => setEffects(e.target.value)}
                    placeholder="How did you feel? Any positive changes?"
                    rows={2}
                    className="mt-2 bg-[var(--surface-2)] border-[var(--border)] text-[var(--text)]"
                  />
                </div>

                {/* Side Effects */}
                <div>
                  <Label htmlFor="sideEffects" className="text-[var(--text)] font-medium">
                    Side Effects
                  </Label>
                  <Textarea
                    id="sideEffects"
                    value={sideEffects}
                    onChange={(e) => setSideEffects(e.target.value)}
                    placeholder="Any adverse reactions or side effects?"
                    rows={2}
                    className="mt-2 bg-[var(--surface-2)] border-[var(--border)] text-[var(--text)]"
                  />
                </div>

                {/* Notes */}
                <div>
                  <Label htmlFor="notes" className="text-[var(--text)] font-medium">
                    Additional Notes
                  </Label>
                  <Textarea
                    id="notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Any other observations or context?"
                    rows={3}
                    className="mt-2 bg-[var(--surface-2)] border-[var(--border)] text-[var(--text)]"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isSaving || !selectedPeptide}
                  className="w-full bg-gradient-to-b from-[#22C8FF] to-[#08A7E6] hover:opacity-90 text-[#001018] rounded-full font-semibold py-6"
                >
                  {isSaving ? 'Saving...' : 'Save Log Entry'}
                </Button>
              </form>
            </Card>
          </div>

          {/* Log History */}
          <div>
            <Card className="rounded-2xl border border-[var(--border)] bg-[var(--surface-1)] p-6" style={{ boxShadow: 'var(--shadow)' }}>
              <SectionTitle>Recent Logs</SectionTitle>
              
              {logs.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-[var(--text-dim)] mb-2">No logs yet</p>
                  <p className="text-sm text-[var(--text-muted)]">Start tracking your peptide usage</p>
                </div>
              ) : (
                <div className="space-y-4 max-h-[600px] overflow-y-auto">
                  {logs.map((log) => (
                    <div
                      key={log.id}
                      className="rounded-xl border border-[var(--border)] bg-[var(--surface-2)] p-4"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-[var(--accent)]">{log.peptide_name}</h3>
                        <span className="text-xs text-[var(--text-muted)]">
                          {new Date(log.logged_at).toLocaleDateString()} {new Date(log.logged_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      
                      {log.amount && (
                        <p className="text-sm text-[var(--text-dim)] mb-1">
                          <strong>Amount:</strong> {log.amount}
                        </p>
                      )}
                      
                      {log.route && (
                        <p className="text-sm text-[var(--text-dim)] mb-1">
                          <strong>Route:</strong> {log.route.charAt(0).toUpperCase() + log.route.slice(1)}
                        </p>
                      )}
                      
                      {log.effects && (
                        <p className="text-sm text-[var(--text-dim)] mb-1">
                          <strong className="text-[var(--ok)]">Effects:</strong> {log.effects}
                        </p>
                      )}
                      
                      {log.side_effects && (
                        <p className="text-sm text-[var(--text-dim)] mb-1">
                          <strong className="text-[var(--warn)]">Side Effects:</strong> {log.side_effects}
                        </p>
                      )}
                      
                      {log.notes && (
                        <p className="text-sm text-[var(--text-dim)]">
                          <strong>Notes:</strong> {log.notes}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

