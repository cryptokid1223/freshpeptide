'use client';

import React, { useState, useEffect } from 'react';
import { TopRibbon } from '@/components/ui/TopRibbon';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { NumberedStep } from '@/components/ui/NumberedStep';
import { TypeWriter } from '@/components/ui/TypeWriter';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is authenticated
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
      setIsLoading(false);
    };

    checkAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <div className="min-h-screen relative" style={{ background: 'var(--bg)' }}>
      {/* Radial gradient vignette */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(1200px 600px at 50% -10%, rgba(18,179,255,0.08), transparent 60%)',
          backgroundRepeat: 'no-repeat'
        }}
      />
      
      <main className="container mx-auto px-4 py-16 max-w-[1180px] relative z-10">
        {/* Hero Section */}
        <div className="text-center mb-16 pt-12">
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-[-0.01em] mb-4">
            <TypeWriter 
              text="FreshPeptide" 
              speed={120}
              className="text-transparent bg-clip-text bg-gradient-to-b from-[#6EE7F5] to-[#12B3FF]"
            />
          </h1>
          <p className="text-xl text-[var(--text)] font-medium mb-3">
            Medical Intelligence Peptide Research Platform
          </p>
          <p className="text-base text-[var(--text-dim)] max-w-2xl mx-auto">
            Get personalized peptide recommendations based on your health profile and goals
          </p>
        </div>

        {!isLoading && (
          <>
            {isAuthenticated ? (
              /* Logged In View */
              <div className="max-w-4xl mx-auto mb-16">
                <Card className="rounded-2xl border border-[var(--border)] bg-[var(--surface-1)] p-8" style={{ boxShadow: 'var(--shadow)' }}>
                  <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-[#6EE7F5] to-[#12B3FF] mb-6 text-center tracking-[-0.01em]">
                    Welcome Back!
                  </h2>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link href="/dashboard" className="flex-1">
                      <Button 
                        size="lg" 
                        className="w-full bg-gradient-to-b from-[#22C8FF] to-[#08A7E6] hover:opacity-90 text-[#001018] py-6 text-lg font-semibold rounded-full transition-all"
                      >
                        View Dashboard
                      </Button>
                    </Link>
                    <Link href="/generate" className="flex-1">
                      <Button 
                        size="lg" 
                        className="w-full bg-gradient-to-b from-[var(--accent-2)] to-[var(--accent)] hover:opacity-90 text-[#001018] py-6 text-lg font-semibold rounded-full transition-all"
                      >
                        Generate Stack
                      </Button>
                    </Link>
                    <Link href="/library" className="flex-1">
                      <Button 
                        size="lg" 
                        className="w-full bg-[var(--surface-2)] border border-[var(--accent)] text-[var(--accent)] hover:bg-[var(--accent)]/10 py-6 text-lg font-semibold rounded-full transition-all"
                      >
                        Browse Library
                      </Button>
                    </Link>
                  </div>
                </Card>
              </div>
            ) : (
              /* Not Logged In View */
              <div className="max-w-2xl mx-auto mb-16">
                <Card className="rounded-2xl border border-[var(--border)] bg-[var(--surface-1)] p-8" style={{ boxShadow: 'var(--shadow)' }}>
                  <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-[#6EE7F5] to-[#12B3FF] mb-2 text-center tracking-[-0.01em]">
                    Get Started
                  </h2>
                  <p className="text-sm text-[var(--text-dim)] text-center mb-8">
                    Create an account or sign in to get your personalized peptide recommendations
                  </p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                    <div 
                      onClick={() => {
                        localStorage.setItem('authMode', 'signup');
                        window.location.href = '/auth';
                      }}
                      className="bg-gradient-to-b from-[#22C8FF] to-[#08A7E6] hover:opacity-90 p-6 rounded-2xl text-center transition-all transform hover:scale-105 cursor-pointer active:scale-95"
                    >
                      <div className="w-12 h-12 rounded-full bg-[#001018]/20 mx-auto mb-3 flex items-center justify-center">
                        <svg className="w-6 h-6 text-[#001018]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                        </svg>
                      </div>
                      <h3 className="text-xl font-bold text-[#001018] mb-2">New User?</h3>
                      <p className="text-[#001018]/80 text-sm mb-4">Create a free account</p>
                      <div className="bg-[#001018] text-[var(--accent)] font-semibold py-2 px-4 rounded-full text-sm">
                        Sign Up
                      </div>
                    </div>

                    <div 
                      onClick={() => {
                        localStorage.setItem('authMode', 'signin');
                        window.location.href = '/auth';
                      }}
                      className="bg-[var(--surface-2)] hover:bg-[var(--surface-2)]/80 border border-[var(--border)] p-6 rounded-2xl text-center transition-all transform hover:scale-105 cursor-pointer active:scale-95"
                    >
                      <div className="w-12 h-12 rounded-full bg-[var(--accent)]/10 mx-auto mb-3 flex items-center justify-center">
                        <svg className="w-6 h-6 text-[var(--accent)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                        </svg>
                      </div>
                      <h3 className="text-xl font-bold text-[var(--text)] mb-2">Have an Account?</h3>
                      <p className="text-[var(--text-dim)] text-sm mb-4">Sign in to continue</p>
                      <div className="border-2 border-[var(--accent)] text-[var(--accent)] font-semibold py-2 px-4 rounded-full text-sm">
                        Sign In
                      </div>
                    </div>
                  </div>

                  <div className="text-center">
                    <Link href="/library">
                      <Button 
                        variant="ghost"
                        className="text-[var(--accent)] hover:text-[var(--accent-2)]"
                      >
                        or browse the peptide library →
                      </Button>
                    </Link>
                  </div>
                </Card>
              </div>
            )}
          </>
        )}

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <Card className="rounded-2xl border border-[var(--border)] bg-[var(--surface-1)] p-6 hover:border-[var(--accent)]/50 transition-all" style={{ boxShadow: 'var(--shadow)' }}>
            <div className="w-12 h-12 rounded-full bg-gradient-to-b from-[var(--accent-2)] to-[var(--accent)] flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-[#001018]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-[var(--accent)] mb-2 tracking-[-0.01em]">
              Comprehensive Intake
            </h3>
            <p className="text-sm text-[var(--text-dim)] leading-relaxed">
              Multi-step health questionnaire covering demographics, medical history, 
              lifestyle, and goals.
            </p>
          </Card>

          <Card className="rounded-2xl border border-[var(--border)] bg-[var(--surface-1)] p-6 hover:border-[var(--accent)]/50 transition-all" style={{ boxShadow: 'var(--shadow)' }}>
            <div className="w-12 h-12 rounded-full bg-gradient-to-b from-[var(--accent-2)] to-[var(--accent)] flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-[#001018]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-[var(--accent)] mb-2 tracking-[-0.01em]">
              Medical Intelligence Analysis
            </h3>
            <p className="text-sm text-[var(--text-dim)] leading-relaxed">
              Advanced analytical system generates educational briefs mapping goals to research-backed 
              peptide classes with evidence citations.
            </p>
          </Card>

          <Card className="rounded-2xl border border-[var(--border)] bg-[var(--surface-1)] p-6 hover:border-[var(--accent)]/50 transition-all" style={{ boxShadow: 'var(--shadow)' }}>
            <div className="w-12 h-12 rounded-full bg-gradient-to-b from-[var(--accent-2)] to-[var(--accent)] flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-[#001018]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-[var(--accent)] mb-2 tracking-[-0.01em]">
              Searchable Library
            </h3>
            <p className="text-sm text-[var(--text-dim)] leading-relaxed">
              Explore a curated database of peptides with mechanisms, regulatory status, 
              evidence, and safety information.
            </p>
          </Card>
        </div>

        {/* How It Works */}
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-1)] p-8 mb-16" style={{ boxShadow: 'var(--shadow)' }}>
          <SectionTitle>How It Works</SectionTitle>
          <div className="space-y-6 max-w-2xl mx-auto">
            <NumberedStep 
              number={1} 
              title="Sign In" 
              description="Simple email authentication to get started"
            />
            <NumberedStep 
              number={2} 
              title="Review Consent" 
              description="Acknowledge research and educational purposes"
            />
            <NumberedStep 
              number={3} 
              title="Complete Intake" 
              description="7-step comprehensive questionnaire with auto-save"
            />
            <NumberedStep 
              number={4} 
              title="Generate Brief" 
              description="Medical Intelligence analyzes your inputs and creates educational content"
            />
            <NumberedStep 
              number={5} 
              title="Review Results" 
              description="Access your personalized brief and explore the peptide library"
            />
          </div>
        </div>

        {/* Important Disclaimers */}
        <div className="rounded-2xl border border-[var(--warn)]/30 bg-[var(--warn)]/5 p-6">
          <h3 className="text-xl font-semibold text-[var(--warn)] mb-3 flex items-center gap-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 16 16">
              <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
              <path d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 4.995z"/>
            </svg>
            Important Information
          </h3>
          <ul className="space-y-2 text-[var(--text-dim)] text-sm">
            <li className="flex items-start gap-2">
              <span className="text-[var(--warn)] flex-shrink-0">•</span>
              <span>This is a research and demonstration platform only</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[var(--warn)] flex-shrink-0">•</span>
              <span>No medical advice is provided or implied</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[var(--warn)] flex-shrink-0">•</span>
              <span>All system outputs are educational and should not guide medical decisions</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[var(--warn)] flex-shrink-0">•</span>
              <span>Consult qualified healthcare professionals for any health-related decisions</span>
            </li>
          </ul>
        </div>
      </main>
      
      <TopRibbon />
    </div>
  );
}
