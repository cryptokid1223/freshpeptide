'use client';

import React, { useState, useEffect } from 'react';
import { MainLayout } from '@/components/MainLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
          Object.keys(intake.demographics).length > 0 &&
          Object.keys(intake.medical).length > 0 &&
          Object.keys(intake.lifestyle).length > 0 &&
          Object.keys(intake.dietary).length > 0 &&
          Object.keys(intake.stress).length > 0 &&
          Object.keys(intake.recovery).length > 0 &&
          Object.keys(intake.goals).length > 0;

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

      if (data.user) {
        // Try to create or update profile (upsert handles both new and existing users)
        const { error: profileError } = await supabase
          .from('profiles')
          .upsert({
            id: data.user.id,
            email: data.user.email,
            updated_at: new Date().toISOString(),
          }, {
            onConflict: 'id'
          });

        if (profileError) {
          console.error('Profile creation error:', profileError);
          // Don't throw - the auth account was created successfully
          setMessage('Account created! Profile setup had an issue but you can still sign in.');
        } else {
          setMessage('Account created! Check your email to verify your account (or sign in if email confirmation is disabled).');
        }
      }
    } catch (error: any) {
      setError(error.message || 'Failed to create account');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-16 max-w-[520px]">
        <Card className="rounded-2xl border border-[var(--border)] bg-[var(--surface-1)] p-8" style={{ boxShadow: 'var(--shadow)' }}>
          {/* Tab Buttons */}
          <div className="flex gap-3 mb-8">
            <Button
              type="button"
              onClick={() => {
                setMode('signin');
                setError('');
                setMessage('');
                setEmail('');
                setPassword('');
              }}
              className={`flex-1 py-6 text-base font-semibold rounded-full transition-all ${
                mode === 'signin'
                  ? 'bg-gradient-to-b from-[#22C8FF] to-[#08A7E6] text-[#001018]'
                  : 'bg-[var(--surface-2)] border border-[var(--border)] text-[var(--text-dim)] hover:text-[var(--text)] hover:border-[var(--accent)]/50'
              }`}
            >
              Sign In
            </Button>
            <Button
              type="button"
              onClick={() => {
                setMode('signup');
                setError('');
                setMessage('');
                setEmail('');
                setPassword('');
              }}
              className={`flex-1 py-6 text-base font-semibold rounded-full transition-all ${
                mode === 'signup'
                  ? 'bg-gradient-to-b from-[#22C8FF] to-[#08A7E6] text-[#001018]'
                  : 'bg-[var(--surface-2)] border border-[var(--border)] text-[var(--text-dim)] hover:text-[var(--text)] hover:border-[var(--accent)]/50'
              }`}
            >
              Sign Up
            </Button>
          </div>

          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-[#6EE7F5] to-[#12B3FF] mb-3 text-center tracking-[-0.01em]">
            {mode === 'signin' ? 'Welcome Back!' : 'Create Your Account'}
          </h1>
          <p className="text-sm text-[var(--text-dim)] text-center mb-8">
            {mode === 'signin' 
              ? 'Sign in to access your dashboard and peptide stack' 
              : 'Sign up to get personalized Medical Intelligence peptide recommendations'}
          </p>

          {message && (
            <div className="mb-6 p-4 rounded-xl bg-[var(--ok)]/10 border border-[var(--ok)]/30">
              <p className="text-[var(--ok)] text-center text-sm font-medium">{message}</p>
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-[var(--danger)]/10 border border-[var(--danger)]/30">
              <p className="text-[var(--danger)] text-center text-sm font-medium">{error}</p>
            </div>
          )}

          {mode === 'signin' ? (
            <form onSubmit={handleSignIn} className="space-y-5">
              <div>
                <Label htmlFor="email" className="text-[var(--text)] font-medium">
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="mt-2 bg-[var(--surface-2)] border-[var(--border)] text-[var(--text)] py-6 rounded-xl focus:ring-2 focus:ring-[var(--ring)] focus:border-[var(--accent)]"
                />
              </div>

              <div>
                <Label htmlFor="password" className="text-[var(--text)] font-medium">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="mt-2 bg-[var(--surface-2)] border-[var(--border)] text-[var(--text)] py-6 rounded-xl focus:ring-2 focus:ring-[var(--ring)] focus:border-[var(--accent)]"
                />
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-b from-[#22C8FF] to-[#08A7E6] hover:opacity-90 text-[#001018] py-6 text-base font-semibold rounded-full mt-6"
              >
                {isLoading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleSignUp} className="space-y-5">
              <div>
                <Label htmlFor="signup-email" className="text-[var(--text)] font-medium">
                  Email Address
                </Label>
                <Input
                  id="signup-email"
                  type="email"
                  placeholder="your.email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="mt-2 bg-[var(--surface-2)] border-[var(--border)] text-[var(--text)] py-6 rounded-xl focus:ring-2 focus:ring-[var(--ring)] focus:border-[var(--accent)]"
                />
              </div>

              <div>
                <Label htmlFor="signup-password" className="text-[var(--text)] font-medium">
                  Password
                </Label>
                <Input
                  id="signup-password"
                  type="password"
                  placeholder="Create a password (min 6 characters)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="mt-2 bg-[var(--surface-2)] border-[var(--border)] text-[var(--text)] py-6 rounded-xl focus:ring-2 focus:ring-[var(--ring)] focus:border-[var(--accent)]"
                />
                <p className="text-xs text-[var(--text-muted)] mt-2">Must be at least 6 characters</p>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-b from-[#22C8FF] to-[#08A7E6] hover:opacity-90 text-[#001018] py-6 text-base font-semibold rounded-full mt-6"
              >
                {isLoading ? 'Creating account...' : 'Create Account'}
              </Button>
            </form>
          )}

          <div className="mt-8 space-y-4">
            {mode === 'signup' && (
              <div className="p-4 rounded-xl bg-[var(--accent)]/5 border border-[var(--accent)]/20">
                <p className="text-sm text-[var(--text-dim)] leading-relaxed">
                  <strong className="text-[var(--accent)]">✨ New here?</strong> After creating your account, you'll verify your email and answer a quick questionnaire to get personalized Medical Intelligence recommendations.
                </p>
              </div>
            )}
            
            {mode === 'signin' && (
              <div className="p-4 rounded-xl bg-[var(--accent-2)]/5 border border-[var(--accent-2)]/20">
                <p className="text-sm text-[var(--text-dim)] leading-relaxed">
                  <strong className="text-[var(--accent-2)]">👋 Welcome back!</strong> Sign in to access your dashboard and view your personalized peptide stack.
                </p>
              </div>
            )}

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
                className="text-[var(--accent)] hover:text-[var(--accent-2)] text-sm font-medium transition-colors"
              >
                {mode === 'signin' 
                  ? "Don't have an account? Sign Up →" 
                  : 'Already have an account? Sign In →'}
              </button>
            </div>
          </div>
        </Card>
      </div>
    </MainLayout>
  );
}
