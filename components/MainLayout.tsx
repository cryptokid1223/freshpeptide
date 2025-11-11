'use client';

import React, { useState, useEffect } from 'react';
import { ResearchBanner } from './ResearchBanner';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Button } from './ui/button';

export function MainLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    // Check authentication status
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
      setUserEmail(session?.user?.email || null);
    };

    checkAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
      setUserEmail(session?.user?.email || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    localStorage.clear(); // Clear all local data
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-slate-100">
      <ResearchBanner />
      
      {pathname !== '/' && (
        <nav className="bg-slate-800/50 backdrop-blur-sm border-b border-slate-700">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <Link href="/" className="text-2xl font-bold text-cyan-400 hover:text-cyan-300 transition-colors">
                FreshPeptide
              </Link>
              
              <div className="flex items-center gap-6">
                {isAuthenticated && (
                  <>
                    <Link 
                      href="/dashboard" 
                      className={`hover:text-cyan-400 transition-colors ${pathname === '/dashboard' ? 'text-cyan-400' : ''}`}
                    >
                      Dashboard
                    </Link>
                    <Link 
                      href="/library" 
                      className={`hover:text-cyan-400 transition-colors ${pathname === '/library' ? 'text-cyan-400' : ''}`}
                    >
                      Library
                    </Link>
                    <Link 
                      href="/account" 
                      className={`hover:text-cyan-400 transition-colors ${pathname === '/account' ? 'text-cyan-400' : ''}`}
                    >
                      Account
                    </Link>
                    
                    <div className="flex items-center gap-4 ml-4 pl-4 border-l border-slate-700">
                      {userEmail && (
                        <span className="text-sm text-slate-400">{userEmail}</span>
                      )}
                      <Button
                        onClick={handleSignOut}
                        variant="outline"
                        size="sm"
                        className="border-red-500 text-red-400 hover:bg-red-500/10"
                      >
                        Sign Out
                      </Button>
                    </div>
                  </>
                )}
                
                {!isAuthenticated && (
                  <Link href="/library" className="hover:text-cyan-400 transition-colors">
                    Library
                  </Link>
                )}
              </div>
            </div>
          </div>
        </nav>
      )}
      
      <main>{children}</main>
      
      <footer className="bg-slate-900/50 border-t border-slate-700 py-8 mt-16">
        <div className="container mx-auto px-4 text-center text-slate-400">
          <p className="mb-2">FreshPeptide - Research & Educational Platform</p>
          <p className="text-sm">
            This platform is for research and demonstration purposes only. 
            All information provided is for educational use and does not constitute medical advice.
          </p>
        </div>
      </footer>
    </div>
  );
}

