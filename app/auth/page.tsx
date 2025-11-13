'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

type AuthMode = 'signin' | 'signup';

export default function AuthPage() {
  const router = useRouter();
  const [mode, setMode] = useState<AuthMode>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Check localStorage for auth mode preference from homepage
  useEffect(() => {
    const storedMode = localStorage.getItem('authMode') as AuthMode | null;
    if (storedMode === 'signup' || storedMode === 'signin') {
      setMode(storedMode);
      localStorage.removeItem('authMode');
    }
  }, []);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');
    setError('');

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) throw authError;

      if (data.user) {
        const { data: intakeData } = await supabase
          .from('intake')
          .select('intake_data')
          .eq('user_id', data.user.id)
          .maybeSingle();

        const intake = intakeData?.intake_data;
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
          setMessage('Welcome back! Loading your dashboard...');
          setTimeout(() => router.push('/dashboard'), 500);
        } else {
          setMessage('Please complete the intake questionnaire to continue.');
          setTimeout(() => router.push('/consent'), 1000);
        }
      }
    } catch (error: any) {
      setError(error.message || 'Failed to sign in. Check your email and password.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');
    setError('');

    try {
      if (password.length < 6) {
        throw new Error('Password must be at least 6 characters');
      }

      const { data, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (authError) throw authError;

      // Success! Profile will be created automatically by database trigger
      setMessage('Account created! You can now sign in.');
      
      // Auto-switch to sign in after 2 seconds
      setTimeout(() => {
        setMode('signin');
        setMessage('');
      }, 2000);
    } catch (error: any) {
      setError(error.message || 'Failed to create account');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Top Navigation */}
      <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md border-b border-gray-200 z-50">
        <div className="container mx-auto px-6 py-4 max-w-7xl flex items-center justify-between">
          <Link href="/" className="hover:opacity-80 transition-opacity">
            <img 
              src="/logo.png" 
              alt="FreshPeptide" 
              className="h-10 w-auto object-contain"
            />
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/library">
              <Button 
                variant="ghost"
                className="text-gray-700 hover:text-gray-900 hover:bg-gray-100 font-medium"
              >
                Library
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-6 pt-32 pb-20 max-w-md">
        {/* Auth Card */}
        <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
          {/* Tabs */}
          <div className="flex gap-2 mb-8 bg-gray-100 p-1 rounded-xl">
            <button
              onClick={() => {
                setMode('signin');
                setError('');
                setMessage('');
              }}
              className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all ${
                mode === 'signin'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => {
                setMode('signup');
                setError('');
                setMessage('');
              }}
              className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all ${
                mode === 'signup'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Title */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {mode === 'signin' ? 'Welcome Back' : 'Create Your Account'}
            </h1>
            <p className="text-sm text-gray-600">
              {mode === 'signin' 
                ? 'Sign in to access your personalized peptide stack' 
                : 'Sign up to get personalized peptide recommendations'}
            </p>
          </div>

          {/* Messages */}
          {message && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-800">
              {message}
            </div>
          )}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-800">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={mode === 'signin' ? handleSignIn : handleSignUp} className="space-y-4">
            <div>
              <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@example.com"
                required
                className="mt-1.5 bg-gray-50 border-gray-300 text-gray-900 focus:border-blue-600 focus:ring-blue-600"
              />
            </div>

            <div>
              <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={mode === 'signin' ? 'Enter your password' : 'Create a password (min 6 characters)'}
                required
                className="mt-1.5 bg-gray-50 border-gray-300 text-gray-900 focus:border-blue-600 focus:ring-blue-600"
              />
              {mode === 'signup' && (
                <p className="text-xs text-gray-500 mt-1.5">Must be at least 6 characters</p>
              )}
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 text-white hover:bg-blue-700 font-semibold py-2.5 rounded-lg mt-6"
            >
              {isLoading 
                ? (mode === 'signin' ? 'Signing in...' : 'Creating account...') 
                : (mode === 'signin' ? 'Sign In' : 'Create Account')
              }
            </Button>
          </form>

          {/* Footer Text */}
          {mode === 'signup' && (
            <div className="mt-6 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-xs text-gray-700 leading-relaxed">
                <strong className="text-blue-700">Next steps:</strong> After creating your account, 
                you'll complete a quick questionnaire to get personalized peptide recommendations tailored to your goals.
              </p>
            </div>
          )}
        </div>

        {/* Bottom Link */}
        <div className="text-center mt-6">
          <Link href="/" className="text-sm text-gray-600 hover:text-gray-900">
            ← Back to home
          </Link>
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
