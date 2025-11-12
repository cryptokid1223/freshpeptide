'use client';

import React, { useState, useEffect } from 'react';
import { ResearchBanner } from '@/components/ResearchBanner';
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <ResearchBanner />
      
      <main className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-12 pt-8">
          <h1 className="text-6xl font-bold text-cyan-400 mb-4 tracking-tight">
            FreshPeptide
          </h1>
          <p className="text-2xl text-slate-300 mb-4">
            AI-Powered Peptide Research Platform
          </p>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto mb-8">
            Get personalized peptide recommendations based on your health profile and goals
          </p>
        </div>

        {!isLoading && (
          <>
            {isAuthenticated ? (
              /* Logged In View */
              <div className="max-w-4xl mx-auto mb-16">
                <Card className="bg-slate-800/50 border-slate-700 p-8">
                  <h2 className="text-3xl font-bold text-cyan-400 mb-6 text-center">
                    Welcome Back! 👋
                  </h2>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link href="/dashboard" className="flex-1">
                      <Button 
                        size="lg" 
                        className="w-full bg-cyan-600 hover:bg-cyan-700 text-white py-6 text-lg"
                      >
                        📊 View Dashboard
                      </Button>
                    </Link>
                    <Link href="/generate" className="flex-1">
                      <Button 
                        size="lg" 
                        className="w-full bg-purple-600 hover:bg-purple-700 text-white py-6 text-lg"
                      >
                        🧬 Generate Stack
                      </Button>
                    </Link>
                    <Link href="/library" className="flex-1">
                      <Button 
                        size="lg" 
                        variant="outline"
                        className="w-full border-cyan-400 text-cyan-400 hover:bg-cyan-400/10 py-6 text-lg"
                      >
                        📚 Browse Library
                      </Button>
                    </Link>
                  </div>
                </Card>
              </div>
            ) : (
              /* Not Logged In View - Simple Auth Section */
              <div className="max-w-2xl mx-auto mb-16">
                <Card className="bg-slate-800/50 border-slate-700 p-8">
                  <h2 className="text-3xl font-bold text-cyan-400 mb-2 text-center">
                    Get Started
                  </h2>
                  <p className="text-slate-400 text-center mb-8">
                    Create an account or sign in to get your personalized peptide recommendations
                  </p>
                  
                  <div className="grid sm:grid-cols-2 gap-4 mb-6">
                    <div 
                      onClick={() => {
                        localStorage.setItem('authMode', 'signup');
                        window.location.href = '/auth';
                      }}
                      className="bg-gradient-to-br from-cyan-600 to-cyan-700 hover:from-cyan-500 hover:to-cyan-600 p-6 rounded-lg text-center transition-all transform hover:scale-105 cursor-pointer"
                    >
                      <div className="text-4xl mb-3">✨</div>
                      <h3 className="text-xl font-bold text-white mb-2">New User?</h3>
                      <p className="text-cyan-100 text-sm mb-4">Create a free account</p>
                      <div className="bg-white text-cyan-700 font-semibold py-2 px-4 rounded">
                        Sign Up
                      </div>
                    </div>

                    <div 
                      onClick={() => {
                        localStorage.setItem('authMode', 'signin');
                        window.location.href = '/auth';
                      }}
                      className="bg-slate-700 hover:bg-slate-600 p-6 rounded-lg text-center transition-all transform hover:scale-105 cursor-pointer border border-slate-600"
                    >
                      <div className="text-4xl mb-3">👤</div>
                      <h3 className="text-xl font-bold text-white mb-2">Have an Account?</h3>
                      <p className="text-slate-300 text-sm mb-4">Sign in to continue</p>
                      <div className="bg-transparent border-2 border-white text-white font-semibold py-2 px-4 rounded">
                        Sign In
                      </div>
                    </div>
                  </div>

                  <div className="text-center">
                    <Link href="/library">
                      <Button 
                        variant="ghost"
                        className="text-cyan-400 hover:text-cyan-300"
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
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          <Card className="bg-slate-800/50 border-slate-700 p-6 hover:bg-slate-800/70 transition-all">
            <div className="text-4xl mb-4">📋</div>
            <h3 className="text-xl font-semibold text-cyan-400 mb-2">
              Comprehensive Intake
            </h3>
            <p className="text-slate-300">
              Multi-step health questionnaire covering demographics, medical history, 
              lifestyle, and goals.
            </p>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700 p-6 hover:bg-slate-800/70 transition-all">
            <div className="text-4xl mb-4">🤖</div>
            <h3 className="text-xl font-semibold text-cyan-400 mb-2">
              AI-Powered Analysis
            </h3>
            <p className="text-slate-300">
              Server-side AI generates educational briefs mapping goals to research-backed 
              peptide classes with evidence citations.
            </p>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700 p-6 hover:bg-slate-800/70 transition-all">
            <div className="text-4xl mb-4">📚</div>
            <h3 className="text-xl font-semibold text-cyan-400 mb-2">
              Searchable Library
            </h3>
            <p className="text-slate-300">
              Explore a curated database of peptides with mechanisms, regulatory status, 
              evidence, and safety information.
            </p>
          </Card>
        </div>

        {/* Demo Flow Section */}
        <div className="bg-slate-800/30 border border-slate-700 rounded-lg p-8 mb-16">
          <h2 className="text-3xl font-bold text-cyan-400 mb-6 text-center">
            How It Works
          </h2>
          <div className="space-y-4 max-w-2xl mx-auto">
            <div className="flex items-start gap-4">
              <div className="bg-cyan-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">
                1
              </div>
              <div>
                <h4 className="font-semibold text-slate-200 mb-1">Sign In</h4>
                <p className="text-slate-400">Simple email authentication to get started</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="bg-cyan-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">
                2
              </div>
              <div>
                <h4 className="font-semibold text-slate-200 mb-1">Review Consent</h4>
                <p className="text-slate-400">Acknowledge research and educational purposes</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="bg-cyan-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">
                3
              </div>
              <div>
                <h4 className="font-semibold text-slate-200 mb-1">Complete Intake</h4>
                <p className="text-slate-400">4-step questionnaire with auto-save functionality</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="bg-cyan-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">
                4
              </div>
              <div>
                <h4 className="font-semibold text-slate-200 mb-1">Generate Brief</h4>
                <p className="text-slate-400">AI analyzes your inputs and creates educational content</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="bg-cyan-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">
                5
              </div>
              <div>
                <h4 className="font-semibold text-slate-200 mb-1">Review Results</h4>
                <p className="text-slate-400">Access your personalized brief and explore the peptide library</p>
              </div>
            </div>
          </div>
        </div>

        {/* Important Disclaimers */}
        <div className="bg-amber-900/20 border border-amber-700 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-amber-400 mb-3">
            ⚠️ Important Information
          </h3>
          <ul className="space-y-2 text-slate-300">
            <li className="flex items-start gap-2">
              <span className="text-amber-400">•</span>
              <span>This is a research and demonstration platform only</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-400">•</span>
              <span>No medical advice is provided or implied</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-400">•</span>
              <span>All AI outputs are educational and should not guide medical decisions</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-400">•</span>
              <span>Consult qualified healthcare professionals for any health-related decisions</span>
            </li>
          </ul>
        </div>
      </main>
    </div>
  );
}
