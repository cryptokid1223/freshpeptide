'use client';

import React, { useState, useEffect } from 'react';
import { TopRibbon } from './ui/TopRibbon';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Button } from './ui/button';

export function MainLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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
    <div className="min-h-screen" style={{ background: 'var(--bg)' }}>
      {pathname !== '/' && (
        <nav className="bg-[var(--surface-1)]/80 backdrop-blur-sm border-b border-[var(--border)]">
          <div className="container mx-auto px-4 py-3.5 max-w-[1180px]">
            <div className="flex items-center justify-between">
              <Link 
                href="/" 
                className="text-lg sm:text-xl font-bold bg-gradient-to-b from-[var(--accent-2)] to-[var(--accent)] bg-clip-text text-transparent hover:opacity-80 transition-opacity"
              >
                FreshPeptide
              </Link>
              
              {/* Desktop Navigation */}
              <div className="hidden lg:flex items-center gap-6">
                {isAuthenticated && (
                  <>
                    <Link 
                      href="/dashboard" 
                      className={`text-sm font-medium transition-all hover:text-[var(--accent)] relative ${
                        pathname === '/dashboard' ? 'text-[var(--accent)]' : 'text-[var(--text-dim)]'
                      }`}
                    >
                      Dashboard
                      {pathname === '/dashboard' && (
                        <span className="absolute -bottom-3.5 left-0 right-0 h-0.5 bg-[var(--accent)]"></span>
                      )}
                    </Link>
                    <Link 
                      href="/library" 
                      className={`text-sm font-medium transition-all hover:text-[var(--accent)] relative ${
                        pathname === '/library' ? 'text-[var(--accent)]' : 'text-[var(--text-dim)]'
                      }`}
                    >
                      Library
                      {pathname === '/library' && (
                        <span className="absolute -bottom-3.5 left-0 right-0 h-0.5 bg-[var(--accent)]"></span>
                      )}
                    </Link>
                    <Link 
                      href="/tracking" 
                      className={`text-sm font-medium transition-all hover:text-[var(--accent)] relative ${
                        pathname === '/tracking' ? 'text-[var(--accent)]' : 'text-[var(--text-dim)]'
                      }`}
                    >
                      Tracking
                      {pathname === '/tracking' && (
                        <span className="absolute -bottom-3.5 left-0 right-0 h-0.5 bg-[var(--accent)]"></span>
                      )}
                    </Link>
                    <Link 
                      href="/journal" 
                      className={`text-sm font-medium transition-all hover:text-[var(--accent)] relative ${
                        pathname === '/journal' ? 'text-[var(--accent)]' : 'text-[var(--text-dim)]'
                      }`}
                    >
                      Journal
                      {pathname === '/journal' && (
                        <span className="absolute -bottom-3.5 left-0 right-0 h-0.5 bg-[var(--accent)]"></span>
                      )}
                    </Link>
                    <Link 
                      href="/account" 
                      className={`text-sm font-medium transition-all hover:text-[var(--accent)] relative ${
                        pathname === '/account' ? 'text-[var(--accent)]' : 'text-[var(--text-dim)]'
                      }`}
                    >
                      Account
                      {pathname === '/account' && (
                        <span className="absolute -bottom-3.5 left-0 right-0 h-0.5 bg-[var(--accent)]"></span>
                      )}
                    </Link>
                    
                    <Button
                      onClick={handleSignOut}
                      size="sm"
                      className="bg-transparent border border-[var(--danger)] text-[var(--danger)] hover:bg-[var(--danger)]/10 rounded-full px-4 text-xs font-semibold transition-all"
                    >
                      Sign Out
                    </Button>
                  </>
                )}
                
                {!isAuthenticated && (
                  <Link href="/library" className="text-sm font-medium text-[var(--text-dim)] hover:text-[var(--accent)] transition-colors">
                    Library
                  </Link>
                )}
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 text-[var(--text)] hover:text-[var(--accent)] transition-colors"
              >
                {isMobileMenuOpen ? (
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && isAuthenticated && (
              <div className="lg:hidden mt-4 pb-4 space-y-2">
                <Link 
                  href="/dashboard"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    pathname === '/dashboard' ? 'bg-[var(--accent)]/10 text-[var(--accent)]' : 'text-[var(--text-dim)] hover:bg-[var(--surface-2)]'
                  }`}
                >
                  Dashboard
                </Link>
                <Link 
                  href="/library"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    pathname === '/library' ? 'bg-[var(--accent)]/10 text-[var(--accent)]' : 'text-[var(--text-dim)] hover:bg-[var(--surface-2)]'
                  }`}
                >
                  Library
                </Link>
                <Link 
                  href="/tracking"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    pathname === '/tracking' ? 'bg-[var(--accent)]/10 text-[var(--accent)]' : 'text-[var(--text-dim)] hover:bg-[var(--surface-2)]'
                  }`}
                >
                  Tracking
                </Link>
                <Link 
                  href="/journal"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    pathname === '/journal' ? 'bg-[var(--accent)]/10 text-[var(--accent)]' : 'text-[var(--text-dim)] hover:bg-[var(--surface-2)]'
                  }`}
                >
                  Journal
                </Link>
                <Link 
                  href="/account"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    pathname === '/account' ? 'bg-[var(--accent)]/10 text-[var(--accent)]' : 'text-[var(--text-dim)] hover:bg-[var(--surface-2)]'
                  }`}
                >
                  Account
                </Link>
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    handleSignOut();
                  }}
                  className="block w-full text-left px-4 py-2 rounded-lg text-sm font-medium text-[var(--danger)] hover:bg-[var(--danger)]/10 transition-all"
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </nav>
      )}
      
      <main>{children}</main>
      
      <footer className="border-t border-[var(--border)] py-8 mt-16" style={{ background: 'var(--surface-1)' }}>
        <div className="container mx-auto px-4 text-center max-w-[1180px]">
          <p className="mb-2 text-sm font-semibold" style={{ color: 'var(--text-dim)' }}>
            FreshPeptide - Research & Educational Platform
          </p>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
            This platform is for research and demonstration purposes only. 
            All information provided is for educational use and does not constitute medical advice.
          </p>
        </div>
      </footer>
      
      <TopRibbon />
    </div>
  );
}

