'use client';

import React from 'react';
import { ResearchBanner } from '@/components/ResearchBanner';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <ResearchBanner />
      
      <main className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16 pt-8">
          <h1 className="text-6xl font-bold text-cyan-400 mb-4 tracking-tight">
            FreshPeptide
          </h1>
          <p className="text-2xl text-slate-300 mb-8">
            Research & Educational Peptide Platform
          </p>
          <p className="text-lg text-slate-400 max-w-3xl mx-auto mb-12">
            This demo showcases a comprehensive peptide research platform that collects user health data,
            goals, and preferences, then leverages AI to generate educational briefs about peptides that 
            may align with research literature related to those goals.
          </p>
          
          <div className="flex gap-4 justify-center">
            <Link href="/auth">
              <Button 
                size="lg" 
                className="bg-cyan-600 hover:bg-cyan-700 text-white px-8 py-6 text-lg transition-all transform hover:scale-105"
              >
                Start Questions
              </Button>
            </Link>
            <Link href="/library">
              <Button 
                size="lg" 
                variant="outline"
                className="border-cyan-400 text-cyan-400 hover:bg-cyan-400/10 px-8 py-6 text-lg transition-all"
              >
                Browse Library
              </Button>
            </Link>
          </div>
        </div>

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
