'use client';

import React, { useState } from 'react';
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
  const [mode, setMode] = useState<AuthMode>('signup');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

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
        // Check if user has completed intake
        const { data: intakeData } = await supabase
          .from('intake')
          .select('intake_data')
          .eq('user_id', data.user.id)
          .single();

        if (intakeData?.intake_data && Object.keys(intakeData.intake_data).length > 0) {
          // User has completed intake, go to dashboard
          router.push('/dashboard');
        } else {
          // User hasn't completed intake, go to consent
          router.push('/consent');
        }
      }
    } catch (error: any) {
      console.error('Sign in error:', error);
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
        setMessage('Account created! Check your email to verify your account.');
      }
    } catch (error: any) {
      console.error('Sign up error:', error);
      setError(error.message || 'Failed to create account');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto">
          <Card className="bg-slate-800/50 border-slate-700 p-8">
            {/* Tab Buttons */}
            <div className="flex gap-2 mb-8">
              <Button
                type="button"
                onClick={() => {
                  setMode('signin');
                  setError('');
                  setMessage('');
                  setEmail('');
                  setPassword('');
                }}
                className={`flex-1 py-6 text-lg ${
                  mode === 'signin'
                    ? 'bg-cyan-600 hover:bg-cyan-700 text-white'
                    : 'bg-slate-700 hover:bg-slate-600 text-slate-300'
                }`}
              >
                ✅ Sign In
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
                className={`flex-1 py-6 text-lg ${
                  mode === 'signup'
                    ? 'bg-cyan-600 hover:bg-cyan-700 text-white'
                    : 'bg-slate-700 hover:bg-slate-600 text-slate-300'
                }`}
              >
                ✨ Sign Up
              </Button>
            </div>

            <h1 className="text-3xl font-bold text-cyan-400 mb-3 text-center">
              {mode === 'signin' ? 'Welcome Back!' : 'Create Your Account'}
            </h1>
            <p className="text-slate-400 text-center mb-8">
              {mode === 'signin' 
                ? 'Sign in to access your dashboard and peptide stack' 
                : 'Sign up to get personalized AI-powered peptide recommendations'}
            </p>

            {message && (
              <div className="mb-4 p-4 bg-green-900/20 border border-green-700 rounded-lg">
                <p className="text-green-400 text-center">{message}</p>
              </div>
            )}

            {error && (
              <div className="mb-4 p-4 bg-red-900/20 border border-red-700 rounded-lg">
                <p className="text-red-400 text-center">{error}</p>
              </div>
            )}

            {mode === 'signin' ? (
              <form onSubmit={handleSignIn} className="space-y-4">
                <div>
                  <Label htmlFor="email" className="text-slate-300">
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your.email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="bg-slate-900 border-slate-600 text-slate-100 mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="password" className="text-slate-300">
                    Password
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="bg-slate-900 border-slate-600 text-slate-100 mt-2"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-cyan-600 hover:bg-cyan-700 text-white"
                >
                  {isLoading ? 'Signing in...' : 'Sign In'}
                </Button>
              </form>
            ) : (
              <form onSubmit={handleSignUp} className="space-y-4">
                <div>
                  <Label htmlFor="signup-email" className="text-slate-300">
                    Email Address
                  </Label>
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="your.email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="bg-slate-900 border-slate-600 text-slate-100 mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="signup-password" className="text-slate-300">
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
                    className="bg-slate-900 border-slate-600 text-slate-100 mt-2"
                  />
                  <p className="text-xs text-slate-400 mt-1">Must be at least 6 characters</p>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-cyan-600 hover:bg-cyan-700 text-white"
                >
                  {isLoading ? 'Creating account...' : 'Create Account'}
                </Button>
              </form>
            )}

            <div className="mt-6 space-y-3">
              {mode === 'signup' && (
                <div className="p-4 bg-green-900/20 border border-green-700 rounded-lg">
                  <p className="text-sm text-slate-300">
                    <strong className="text-green-400">✨ New here?</strong> After creating your account, you'll verify your email and answer a quick questionnaire to get personalized AI recommendations.
                  </p>
                </div>
              )}
              
              {mode === 'signin' && (
                <div className="p-4 bg-blue-900/20 border border-blue-700 rounded-lg">
                  <p className="text-sm text-slate-300">
                    <strong className="text-blue-400">👋 Welcome back!</strong> Sign in to access your dashboard and view your personalized peptide stack.
                  </p>
                </div>
              )}

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
                  className="text-cyan-400 hover:text-cyan-300 text-sm underline"
                >
                  {mode === 'signin' 
                    ? "Don't have an account? Sign Up" 
                    : 'Already have an account? Sign In'}
                </button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}

