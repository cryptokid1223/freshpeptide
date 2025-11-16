'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function ConsentPage() {
  const router = useRouter();
  const [consent1, setConsent1] = useState(false);
  const [consent2, setConsent2] = useState(false);
  const [consent3, setConsent3] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuthAndIntake = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
      router.push('/auth');
        return;
      }
      
      setIsAuthenticated(true);

      const { data: intakeRecord } = await supabase
        .from('intake')
        .select('intake_data')
        .eq('user_id', session.user.id)
        .maybeSingle();

      const intake = intakeRecord?.intake_data;
      const hasCompletedIntake = intake && 
        intake.demographics && 
        intake.medical && 
        intake.lifestyle && 
        intake.dietary &&
        intake.stress &&
        intake.recovery &&
        intake.goals &&
        intake.experience &&
        Object.keys(intake.demographics).length > 0 &&
        Object.keys(intake.medical).length > 0 &&
        Object.keys(intake.lifestyle).length > 0 &&
        Object.keys(intake.dietary).length > 0 &&
        Object.keys(intake.stress).length > 0 &&
        Object.keys(intake.recovery).length > 0 &&
        Object.keys(intake.goals).length > 0 &&
        Object.keys(intake.experience).length > 0;

      if (hasCompletedIntake) {
        localStorage.setItem('consent_given', 'true');
        localStorage.setItem('intake_completed', 'true');
        router.push('/dashboard');
      }
    };
    
    checkAuthAndIntake();
  }, [router]);

  const handleContinue = () => {
    if (consent1 && consent2 && consent3) {
      localStorage.setItem('consent_given', 'true');
      router.push('/intake');
    }
  };

  const allConsented = consent1 && consent2 && consent3;

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Top Navigation */}
      <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md border-b border-gray-200 z-50">
        <div className="container mx-auto px-6 py-3 max-w-7xl flex items-center justify-between">
          <Link href="/" className="hover:opacity-80 transition-opacity">
            <img 
              src="/updatedlogo.png" 
              alt="FreshPeptide" 
              className="h-16 w-auto object-contain"
            />
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-6 pt-32 pb-20 max-w-3xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-3 tracking-tight">
            Research Consent
            </h1>
          <p className="text-gray-600">
              Please read and acknowledge the following before proceeding
            </p>
        </div>

        {/* Warning Box */}
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-6 mb-8">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 16 16">
              <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
              <path d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 4.995z"/>
            </svg>
            <div>
              <h2 className="text-lg font-semibold text-orange-900 mb-2">
                Research & Educational Purposes Only
                </h2>
              <p className="text-sm text-gray-700 leading-relaxed">
                  This platform is designed exclusively for research, educational, and demonstration 
                  purposes. It does not provide medical advice, diagnosis, or treatment recommendations.
                </p>
            </div>
          </div>
              </div>

        {/* Consent Checkboxes */}
        <div className="space-y-5 mb-10">
          <label className="flex items-start gap-4 p-6 bg-gray-50 border-2 border-gray-200 rounded-2xl hover:border-[#8B6F47] transition-colors cursor-pointer">
            <input
              type="checkbox"
                    checked={consent1}
              onChange={(e) => setConsent1(e.target.checked)}
              className="mt-1 w-5 h-5 rounded border-gray-400 text-[#8B6F47] focus:ring-[#8B6F47] cursor-pointer flex-shrink-0"
                  />
            <span className="text-gray-700 flex-1 leading-relaxed">
              <strong className="text-gray-900">I understand</strong> that this platform is 
                    for research and demonstration purposes only, and does not provide medical advice 
                    or treatment recommendations.
            </span>
          </label>

          <label className="flex items-start gap-4 p-6 bg-gray-50 border-2 border-gray-200 rounded-2xl hover:border-[#8B6F47] transition-colors cursor-pointer">
            <input
              type="checkbox"
                    checked={consent2}
              onChange={(e) => setConsent2(e.target.checked)}
              className="mt-1 w-5 h-5 rounded border-gray-400 text-[#8B6F47] focus:ring-[#8B6F47] cursor-pointer flex-shrink-0"
                  />
            <span className="text-gray-700 flex-1 leading-relaxed">
              <strong className="text-gray-900">I acknowledge</strong> that any information 
                    or suggestions generated by this platform should not be used to make medical 
                    decisions, and I will consult qualified healthcare professionals for any 
                    health-related concerns.
            </span>
          </label>

          <label className="flex items-start gap-4 p-6 bg-gray-50 border-2 border-gray-200 rounded-2xl hover:border-[#8B6F47] transition-colors cursor-pointer">
            <input
              type="checkbox"
                    checked={consent3}
              onChange={(e) => setConsent3(e.target.checked)}
              className="mt-1 w-5 h-5 rounded border-gray-400 text-[#8B6F47] focus:ring-[#8B6F47] cursor-pointer flex-shrink-0"
                  />
            <span className="text-gray-700 flex-1 leading-relaxed">
              <strong className="text-gray-900">I agree</strong> to use this platform for 
                    educational purposes only and understand that the peptides discussed may be 
                    research-only substances with varying regulatory statuses and potential risks.
            </span>
          </label>
            </div>

        {/* Action Buttons */}
            <div className="flex gap-4">
              <Button
                onClick={() => router.push('/auth')}
                variant="outline"
            className="border-gray-300 text-gray-700 hover:bg-gray-50 font-medium px-8 rounded-lg"
              >
                Go Back
              </Button>
              <Button
                onClick={handleContinue}
                disabled={!allConsented}
            className="flex-1 bg-blue-600 text-white hover:bg-blue-700 font-semibold rounded-lg disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-blue-600"
              >
            I Understand & Continue →
              </Button>
        </div>

        {/* Help Text */}
        {!allConsented && (
          <p className="text-center text-sm text-gray-500 mt-6">
            Please check all boxes to continue
          </p>
        )}
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
