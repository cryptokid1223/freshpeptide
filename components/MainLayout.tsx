'use client';

import React from 'react';
import { ResearchBanner } from './ResearchBanner';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function MainLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

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
              
              <div className="flex gap-6">
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

