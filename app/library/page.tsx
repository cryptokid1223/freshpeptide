'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

// Simplified peptide data - top 20 most common peptides
const PEPTIDES = [
  {
    id: '1',
    name: 'BPC-157',
    summary: 'Helps with healing injuries and reducing inflammation',
    details: 'BPC-157 is studied for tissue repair and gut health. Research shows it may help heal tendons, ligaments, and reduce inflammation.',
    dosage: '250-500 mcg once daily',
    sideEffects: 'Generally well-tolerated. Possible injection site redness.',
  },
  {
    id: '2',
    name: 'TB-500',
    summary: 'Supports tissue healing and reduces inflammation',
    details: 'TB-500 is researched for wound healing and tissue regeneration. Studies show potential for healing injuries and improving flexibility.',
    dosage: '2-2.5 mg twice per week',
    sideEffects: 'Mild injection site reactions, temporary fatigue.',
  },
  {
    id: '3',
    name: 'Semaglutide',
    summary: 'FDA-approved for weight loss and diabetes',
    details: 'Semaglutide is an FDA-approved GLP-1 medication for weight management and type 2 diabetes. Clinically proven to help with weight loss.',
    dosage: '0.25-2.4 mg once weekly (start low, increase slowly)',
    sideEffects: 'Nausea, diarrhea, constipation. Usually improves over time.',
  },
  {
    id: '4',
    name: 'Tirzepatide',
    summary: 'FDA-approved for weight loss, very effective',
    details: 'Tirzepatide is FDA-approved for weight management. Clinical trials show up to 22% weight loss. Works on multiple pathways.',
    dosage: '2.5-15 mg once weekly (start low, titrate up)',
    sideEffects: 'Nausea, vomiting, diarrhea. Start low to minimize side effects.',
  },
  {
    id: '5',
    name: 'CJC-1295',
    summary: 'Increases growth hormone for muscle and recovery',
    details: 'CJC-1295 stimulates natural growth hormone production. May help with muscle growth, fat loss, and recovery.',
    dosage: '1-2 mg once per week',
    sideEffects: 'Water retention, tingling, injection site reactions.',
  },
  {
    id: '6',
    name: 'Ipamorelin',
    summary: 'Boosts growth hormone without raising cortisol',
    details: 'Ipamorelin is a selective growth hormone booster. Research shows it can help with muscle growth and fat loss without affecting stress hormones.',
    dosage: '200-300 mcg 2-3 times daily',
    sideEffects: 'Increased hunger, mild water retention, injection site reactions.',
  },
  {
    id: '7',
    name: 'Semax',
    summary: 'Improves focus, memory, and reduces stress',
    details: 'Semax is studied for cognitive enhancement and neuroprotection. Research shows improvements in memory, focus, and stress resilience.',
    dosage: '300-600 mcg intranasal 1-2 times daily',
    sideEffects: 'Rare: mild restlessness or headache.',
  },
  {
    id: '8',
    name: 'Selank',
    summary: 'Reduces anxiety and improves mental clarity',
    details: 'Selank is researched for anxiety reduction and cognitive enhancement. Studies show it may help reduce stress and improve mood without sedation.',
    dosage: '250-500 mcg intranasal 1-2 times daily',
    sideEffects: 'Rare: mild irritability or sleep changes.',
  },
  {
    id: '9',
    name: 'GHK-Cu',
    summary: 'Improves skin, hair, and wound healing',
    details: 'GHK-Cu is a copper peptide studied for skin regeneration and anti-aging. Research shows it may improve collagen production and skin appearance.',
    dosage: '1-3 mg subcutaneous daily or apply topically',
    sideEffects: 'Mild skin irritation when applied topically.',
  },
  {
    id: '10',
    name: 'Epithalon',
    summary: 'Anti-aging peptide, may support longevity',
    details: 'Epithalon is researched for anti-aging and telomerase activation. Studies suggest it may support healthy aging and sleep quality.',
    dosage: '5-10 mg daily for 10-20 days, 1-2 cycles per year',
    sideEffects: 'Rare: mild fatigue or drowsiness.',
  },
  {
    id: '11',
    name: 'PT-141',
    summary: 'FDA-approved for sexual health and libido',
    details: 'PT-141 (Bremelanotide) is FDA-approved for low sexual desire in women. Works through the brain to enhance arousal.',
    dosage: '1.75 mg as needed, max once per 24 hours',
    sideEffects: 'Nausea, flushing, headache (usually mild).',
  },
  {
    id: '12',
    name: 'Tesamorelin',
    summary: 'Reduces belly fat, especially visceral fat',
    details: 'Tesamorelin is FDA-approved for reducing abdominal fat. Studies show significant reduction in visceral (belly) fat.',
    dosage: '2 mg once daily',
    sideEffects: 'Injection site reactions, muscle pain, joint stiffness.',
  },
  {
    id: '13',
    name: 'GHRP-6',
    summary: 'Increases growth hormone and appetite',
    details: 'GHRP-6 stimulates growth hormone release and increases appetite. May help with muscle growth and recovery.',
    dosage: '100-200 mcg 2-3 times daily',
    sideEffects: 'Increased hunger, water retention, tingling.',
  },
  {
    id: '14',
    name: 'AOD-9604',
    summary: 'Supports fat loss without affecting blood sugar',
    details: 'AOD-9604 is a modified growth hormone fragment studied for fat loss. Research suggests fat-burning effects without blood sugar impacts.',
    dosage: '250-500 mcg once daily',
    sideEffects: 'Minimal; injection site reactions possible.',
  },
  {
    id: '15',
    name: 'Melanotan II',
    summary: 'Tanning and libido effects',
    details: 'Melanotan II is researched for skin tanning and sexual enhancement. May darken skin tone and enhance libido.',
    dosage: '250-500 mcg 2-3 times per week',
    sideEffects: 'Nausea, flushing, darkening of moles, increased libido.',
  },
  {
    id: '16',
    name: 'Thymosin Alpha-1',
    summary: 'Supports immune system function',
    details: 'Thymosin Alpha-1 is studied for immune system support. May help with infections and immune health.',
    dosage: '1.6 mg 2-3 times per week',
    sideEffects: 'Injection site reactions, rare allergic responses.',
  },
  {
    id: '17',
    name: 'DSIP',
    summary: 'May improve sleep quality',
    details: 'Delta Sleep-Inducing Peptide is researched for sleep regulation and stress reduction. May help improve sleep quality.',
    dosage: '100-300 mcg before bedtime',
    sideEffects: 'Drowsiness, vivid dreams.',
  },
  {
    id: '18',
    name: 'MOTS-c',
    summary: 'Supports metabolism and energy production',
    details: 'MOTS-c is a mitochondrial peptide researched for metabolic health and longevity. May improve energy and insulin sensitivity.',
    dosage: '5-10 mg 2-3 times per week',
    sideEffects: 'Minimal; injection site reactions.',
  },
  {
    id: '19',
    name: 'Dihexa',
    summary: 'Cognitive enhancement and brain health',
    details: 'Dihexa is researched as a potent cognitive enhancer. Studies suggest it may improve memory and brain function.',
    dosage: '5-10 mg oral daily (research only)',
    sideEffects: 'Unknown long-term effects; research stage.',
  },
  {
    id: '20',
    name: 'KPV',
    summary: 'Anti-inflammatory peptide',
    details: 'KPV is an anti-inflammatory tripeptide researched for reducing inflammation and supporting gut health.',
    dosage: '500-1000 mcg once daily',
    sideEffects: 'Minimal; well-tolerated in studies.',
  },
];

export default function LibraryPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPeptide, setSelectedPeptide] = useState<any>(null);
  const [addedToStack, setAddedToStack] = useState<string[]>([]);
  const [showSuccess, setShowSuccess] = useState(false);

  const filteredPeptides = PEPTIDES.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.summary.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddToStack = async (peptide: any) => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      alert('Please sign in to add peptides to your stack');
      window.location.href = '/auth';
      return;
    }

    // Add to "My Stack" (save to user preferences)
    const { data: existing } = await supabase
      .from('user_peptide_stack')
      .select('peptides')
      .eq('user_id', session.user.id)
      .maybeSingle();

    const currentStack = existing?.peptides || [];
    const updatedStack = [...currentStack, {
      name: peptide.name,
      dosage: peptide.dosage,
      added_at: new Date().toISOString(),
    }];

    await supabase
      .from('user_peptide_stack')
      .upsert({
        user_id: session.user.id,
        peptides: updatedStack,
      }, {
        onConflict: 'user_id'
      });

    setAddedToStack([...addedToStack, peptide.id]);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Top Navigation */}
      <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md border-b border-gray-200 z-50">
        <div className="container mx-auto px-6 py-4 max-w-7xl flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-gray-900 hover:text-blue-600 transition-colors">
            FreshPeptide
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/dashboard">
              <Button 
                variant="ghost"
                className="text-gray-700 hover:text-gray-900 hover:bg-gray-100 font-medium"
              >
                Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-6 pt-32 pb-20 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3 tracking-tight">
            Peptide Library
          </h1>
          <p className="text-lg text-gray-600">
            Explore {PEPTIDES.length} research peptides — Click to learn more
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-12">
          <Input
            type="text"
            placeholder="Search peptides... (e.g., weight loss, muscle growth, healing)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-gray-50 border-gray-300 text-gray-900 py-4 px-6 rounded-full text-lg focus:border-blue-600 focus:ring-blue-600"
          />
          {searchQuery && (
            <p className="text-sm text-gray-600 mt-3">
              Found {filteredPeptides.length} peptide{filteredPeptides.length !== 1 ? 's' : ''}
              {filteredPeptides.length > 0 && searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="ml-2 text-blue-600 hover:text-blue-700 font-medium"
                >
                  Clear search
                </button>
              )}
            </p>
          )}
        </div>

        {/* Success Message */}
        {showSuccess && (
          <div className="fixed top-24 left-1/2 -translate-x-1/2 bg-green-600 text-white px-6 py-3 rounded-full shadow-lg z-50 animate-fade-in">
            ✓ Added to your stack!
          </div>
        )}

        {/* Peptide List - Simple Cards */}
        <div className="space-y-4">
          {filteredPeptides.map((peptide) => (
            <div
              key={peptide.id}
              className="bg-white border border-gray-200 rounded-xl p-6 hover:border-blue-400 hover:shadow-md transition-all cursor-pointer"
              onClick={() => setSelectedPeptide(peptide)}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {peptide.name}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {peptide.summary}
                  </p>
                </div>
                <div className="flex-shrink-0">
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddToStack(peptide);
                    }}
                    className="bg-blue-600 text-white hover:bg-blue-700 font-medium px-4 py-2 rounded-lg text-sm whitespace-nowrap"
                  >
                    + Add to Stack
                  </Button>
                </div>
              </div>
            </div>
          ))}

          {filteredPeptides.length === 0 && (
            <div className="text-center py-16">
              <p className="text-gray-600 text-lg mb-4">
                No peptides found matching "{searchQuery}"
              </p>
              <button
                onClick={() => setSearchQuery('')}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Clear search
              </button>
            </div>
          )}
        </div>
      </main>

      {/* Modal for Peptide Details */}
      {selectedPeptide && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
            onClick={() => setSelectedPeptide(null)}
          />
          
          {/* Modal */}
          <div className="fixed inset-x-4 top-24 bottom-24 md:inset-x-auto md:left-1/2 md:-translate-x-1/2 md:w-full md:max-w-2xl z-50 overflow-hidden">
            <div className="h-full bg-white rounded-2xl shadow-2xl overflow-y-auto">
              {/* Header */}
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">
                  {selectedPeptide.name}
                </h2>
                <button
                  onClick={() => setSelectedPeptide(null)}
                  className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                >
                  <svg className="w-5 h-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    What it does
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    {selectedPeptide.details}
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Typical dosage
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    {selectedPeptide.dosage}
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    ⚠️ Always start at the lower end if you're new to peptides
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Side effects
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    {selectedPeptide.sideEffects}
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="pt-4 border-t border-gray-200 space-y-3">
                  <Button
                    onClick={() => {
                      handleAddToStack(selectedPeptide);
                      setSelectedPeptide(null);
                    }}
                    className="w-full bg-blue-600 text-white hover:bg-blue-700 font-semibold py-3 rounded-lg text-base"
                  >
                    + Add to My Stack
                  </Button>
                  <Button
                    onClick={() => setSelectedPeptide(null)}
                    variant="outline"
                    className="w-full border-gray-300 text-gray-700 hover:bg-gray-50 font-medium py-3 rounded-lg"
                  >
                    Close
                  </Button>
                </div>

                {/* Disclaimer */}
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                  <p className="text-xs text-gray-700 leading-relaxed">
                    <strong className="text-orange-900">Important:</strong> This information is for 
                    educational purposes only. Always consult with a doctor before using any peptides.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Research Purposes Banner - Bottom Sticky Small */}
      <div className="fixed bottom-0 left-0 right-0 bg-orange-600 text-white py-1.5 px-4 text-center z-40">
        <p className="text-xs font-medium tracking-wide">
          RESEARCH PURPOSES ONLY — NOT MEDICAL ADVICE
        </p>
      </div>
    </div>
  );
}
