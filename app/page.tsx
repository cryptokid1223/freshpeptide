'use client';

import React, { useState, useEffect } from 'react';
import { TypeWriter } from '@/components/ui/TypeWriter';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showFeatures, setShowFeatures] = useState(false);
  const [showHowItWorks, setShowHowItWorks] = useState(false);

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

    // Trigger animations after mount
    setTimeout(() => setShowFeatures(true), 200);
    setTimeout(() => setShowHowItWorks(true), 400);

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Top Navigation */}
      <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md border-b border-gray-200 z-50">
        <div className="container mx-auto px-6 py-4 max-w-7xl flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold text-gray-900 hover:text-blue-600 transition-colors">
            FreshPeptide
          </Link>

          {/* Right Side Buttons */}
          <div className="flex items-center gap-3">
            {!isLoading && (
              <>
                {isAuthenticated ? (
                  <>
                    <Link href="/dashboard">
                      <Button 
                        variant="ghost"
                        className="text-gray-700 hover:text-gray-900 hover:bg-gray-100 font-medium"
                      >
                        Dashboard
                      </Button>
                    </Link>
                    <Link href="/generate">
                      <Button 
                        variant="ghost"
                        className="text-gray-700 hover:text-gray-900 hover:bg-gray-100 font-medium"
                      >
                        Generate Stack
                      </Button>
                    </Link>
                    <Link href="/library">
                      <Button 
                        variant="ghost"
                        className="text-gray-700 hover:text-gray-900 hover:bg-gray-100 font-medium"
                      >
                        Library
                      </Button>
                    </Link>
                    <Button 
                      onClick={handleSignOut}
                      className="bg-gray-900 text-white hover:bg-gray-800 font-medium px-6 rounded-full"
                    >
                      Sign Out
                    </Button>
                  </>
                ) : (
                  <>
                    <Link href="/library">
                      <Button 
                        variant="ghost"
                        className="text-gray-700 hover:text-gray-900 hover:bg-gray-100 font-medium"
                      >
                        Library
                      </Button>
                    </Link>
                    <Link href="/auth">
                      <Button 
                        variant="ghost"
                        className="text-gray-700 hover:text-gray-900 hover:bg-gray-100 font-medium"
                        onClick={() => localStorage.setItem('authMode', 'signin')}
                      >
                        Sign In
                      </Button>
                    </Link>
                    <Link href="/auth">
                      <Button 
                        className="bg-blue-600 text-white hover:bg-blue-700 font-medium px-6 rounded-full"
                        onClick={() => localStorage.setItem('authMode', 'signup')}
                      >
                        Sign Up
                      </Button>
                    </Link>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-6 pt-32 pb-20 max-w-5xl">
        {/* Hero Section */}
        <div className="text-center mb-24">
          <h1 className="text-6xl md:text-7xl font-bold text-gray-900 mb-8 tracking-tight">
            FreshPeptide
          </h1>
          <div className="text-3xl md:text-4xl font-light text-gray-600 min-h-[48px]">
            <TypeWriter 
              text="look better, feel better, be better" 
              speed={80}
              className="text-gray-700"
            />
          </div>
        </div>

        {/* Features List - Minimal */}
        <div 
          className={`mb-20 transition-all duration-1000 ${
            showFeatures ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="space-y-6">
            <div className="flex items-start gap-4 group">
              <div className="w-2 h-2 rounded-full bg-blue-600 mt-2.5 flex-shrink-0 group-hover:scale-150 transition-transform"></div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-1">
                  Comprehensive Intake
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Multi-step health questionnaire covering demographics, medical history, lifestyle, and goals
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 group">
              <div className="w-2 h-2 rounded-full bg-blue-600 mt-2.5 flex-shrink-0 group-hover:scale-150 transition-transform"></div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-1">
                  Medical Intelligence Analysis
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Advanced analytical system generates educational briefs mapping goals to research-backed peptide classes with evidence citations
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 group">
              <div className="w-2 h-2 rounded-full bg-blue-600 mt-2.5 flex-shrink-0 group-hover:scale-150 transition-transform"></div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-1">
                  Searchable Library
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Explore a curated database of peptides with mechanisms, regulatory status, evidence, and safety information
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* How It Works - Minimal List */}
        <div 
          className={`mb-20 transition-all duration-1000 ${
            showHowItWorks ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-8">How It Works</h2>
          <div className="space-y-4">
            <div className="flex items-center gap-6 group">
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold flex-shrink-0 group-hover:scale-110 transition-transform">
                1
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Sign In</h3>
                <p className="text-gray-600">Simple email authentication to get started</p>
              </div>
            </div>

            <div className="flex items-center gap-6 group">
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold flex-shrink-0 group-hover:scale-110 transition-transform">
                2
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Review Consent</h3>
                <p className="text-gray-600">Acknowledge research and educational purposes</p>
              </div>
            </div>

            <div className="flex items-center gap-6 group">
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold flex-shrink-0 group-hover:scale-110 transition-transform">
                3
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Complete Intake</h3>
                <p className="text-gray-600">8-step comprehensive questionnaire with auto-save</p>
              </div>
            </div>

            <div className="flex items-center gap-6 group">
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold flex-shrink-0 group-hover:scale-110 transition-transform">
                4
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Generate Brief</h3>
                <p className="text-gray-600">Medical Intelligence analyzes your inputs and creates educational content</p>
              </div>
            </div>

            <div className="flex items-center gap-6 group">
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold flex-shrink-0 group-hover:scale-110 transition-transform">
                5
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Review Results</h3>
                <p className="text-gray-600">Access your personalized brief and explore the peptide library</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Disclaimers - Small Text */}
        <div className="border-t border-gray-200 pt-8 mt-16">
          <p className="text-xs text-gray-500 leading-relaxed mb-2">
            <strong className="text-gray-700">Important Information:</strong> This is a research and demonstration platform only. 
            No medical advice is provided or implied. All system outputs are educational and should not guide medical decisions. 
            Consult qualified healthcare professionals for any health-related decisions.
          </p>
        </div>
      </main>

      {/* Research Purposes Banner - Bottom Sticky Small */}
      <div className="fixed bottom-0 left-0 right-0 bg-orange-600 text-white py-1.5 px-4 text-center z-40">
        <p className="text-xs font-medium tracking-wide">
          RESEARCH PURPOSES ONLY — NOT MEDICAL ADVICE
        </p>
      </div>
    </div>
  );
}
