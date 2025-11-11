'use client';

import React, { useState } from 'react';
import { MainLayout } from '@/components/MainLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function AuthPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');
    setError('');

    try {
      const { error: authError } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/consent`,
        },
      });

      if (authError) throw authError;

      // Also create profile if doesn't exist
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase
          .from('profiles')
          .upsert({ id: user.id, email }, { onConflict: 'id' });
      }
      
      setMessage('Check your email for the magic link!');
      localStorage.setItem('user_email', email);
    } catch (error: any) {
      console.error('Auth error:', error);
      setError(error.message || 'Failed to sign in');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto">
          <Card className="bg-slate-800/50 border-slate-700 p-8">
            <h1 className="text-3xl font-bold text-cyan-400 mb-2 text-center">
              Welcome to FreshPeptide
            </h1>
            <p className="text-slate-400 text-center mb-8">
              Sign in with your email to get started
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

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-cyan-600 hover:bg-cyan-700 text-white"
              >
                {isLoading ? 'Sending magic link...' : 'Sign In with Email'}
              </Button>
            </form>

            <div className="mt-6 p-4 bg-blue-900/20 border border-blue-700 rounded-lg">
              <p className="text-sm text-slate-300">
                <strong className="text-blue-400">🔐 Secure Authentication:</strong> We'll send you a magic link to sign in. No password needed!
              </p>
            </div>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}

