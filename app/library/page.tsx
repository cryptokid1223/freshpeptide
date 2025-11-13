'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { TypeWriter } from '@/components/ui/TypeWriter';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

// Categories
const CATEGORIES = [
  { id: 'all', name: 'All Peptides' },
  { id: 'weight-loss', name: 'Weight Loss' },
  { id: 'muscle-growth', name: 'Muscle Growth' },
  { id: 'healing', name: 'Healing & Recovery' },
  { id: 'cognitive', name: 'Brain & Focus' },
  { id: 'anti-aging', name: 'Anti-Aging' },
  { id: 'immune', name: 'Immune Support' },
  { id: 'sexual-health', name: 'Sexual Health' },
  { id: 'sleep', name: 'Sleep & Recovery' },
  { id: 'skin-hair', name: 'Skin & Hair' },
];

// Comprehensive peptide database
const PEPTIDES = [
  // Weight Loss
  { id: '1', name: 'Semaglutide', category: 'weight-loss', summary: 'FDA-approved for weight loss and diabetes', details: 'Semaglutide is an FDA-approved GLP-1 medication for weight management. Clinical trials show 15-17% weight loss. Works by reducing appetite and slowing digestion.', dosage: '0.25-2.4 mg once weekly (start low, increase slowly)', sideEffects: 'Nausea, diarrhea, constipation. Usually improves over time.' },
  { id: '2', name: 'Tirzepatide', category: 'weight-loss', summary: 'FDA-approved, highly effective for weight loss', details: 'Tirzepatide is FDA-approved for weight management. Clinical trials show up to 22% weight loss. Works on multiple pathways (GLP-1 and GIP receptors).', dosage: '2.5-15 mg once weekly (start low, titrate up)', sideEffects: 'Nausea, vomiting, diarrhea. Start low to minimize side effects.' },
  { id: '3', name: 'Tesamorelin', category: 'weight-loss', summary: 'Reduces belly fat, especially visceral fat', details: 'Tesamorelin is FDA-approved for reducing abdominal fat in certain conditions. Studies show significant reduction in visceral (belly) fat.', dosage: '2 mg once daily', sideEffects: 'Injection site reactions, muscle pain, joint stiffness.' },
  { id: '4', name: 'AOD-9604', category: 'weight-loss', summary: 'Supports fat loss without affecting blood sugar', details: 'AOD-9604 is a modified growth hormone fragment studied for fat loss. Research suggests fat-burning effects without blood sugar impacts.', dosage: '250-500 mcg once daily', sideEffects: 'Minimal; injection site reactions possible.' },
  { id: '5', name: 'Liraglutide', category: 'weight-loss', summary: 'FDA-approved GLP-1 for weight management', details: 'Liraglutide is FDA-approved for chronic weight management. Clinical studies show 8-10% weight loss when combined with diet and exercise.', dosage: '0.6-3.0 mg once daily (titrate up slowly)', sideEffects: 'Nausea, diarrhea, headache, decreased appetite.' },
  { id: '6', name: 'Retatrutide', category: 'weight-loss', summary: 'Triple agonist, next-generation weight loss', details: 'Retatrutide is in Phase 3 clinical trials for weight loss. Works on three pathways (GLP-1/GIP/Glucagon). Shows 24%+ weight loss in trials.', dosage: 'Research protocols: 1-12 mg once weekly', sideEffects: 'Similar to Tirzepatide; nausea, GI effects.' },
  { id: '7', name: '5-Amino-1MQ', category: 'weight-loss', summary: 'NNMT inhibitor for fat loss and metabolism', details: '5-Amino-1MQ is researched for blocking NNMT enzyme to promote fat loss. May improve metabolism and fat burning.', dosage: '50-100 mg once daily (oral or subcutaneous)', sideEffects: 'Minimal reported; research stage.' },
  { id: '8', name: 'HGH Fragment 176-191', category: 'weight-loss', summary: 'Fat loss fragment without blood sugar effects', details: 'HGH Fragment 176-191 is studied for fat loss. May promote fat burning without affecting blood sugar or insulin.', dosage: '250-500 mcg once daily', sideEffects: 'Minimal; well-tolerated.' },
  
  // Muscle Growth
  { id: '9', name: 'CJC-1295', category: 'muscle-growth', summary: 'Increases growth hormone for muscle and recovery', details: 'CJC-1295 stimulates natural growth hormone production. May help with muscle growth, fat loss, and recovery. Often combined with Ipamorelin.', dosage: '1-2 mg once per week', sideEffects: 'Water retention, tingling, injection site reactions.' },
  { id: '10', name: 'Ipamorelin', category: 'muscle-growth', summary: 'Boosts growth hormone without raising cortisol', details: 'Ipamorelin is a selective growth hormone booster. Research shows it can help with muscle growth and fat loss without affecting stress hormones.', dosage: '200-300 mcg 2-3 times daily', sideEffects: 'Increased hunger, mild water retention, injection site reactions.' },
  { id: '11', name: 'GHRP-6', category: 'muscle-growth', summary: 'Growth hormone release and increased appetite', details: 'GHRP-6 stimulates growth hormone release and significantly increases appetite. May help with muscle building and weight gain.', dosage: '100-200 mcg 2-3 times daily', sideEffects: 'Significant hunger increase, water retention, tingling.' },
  { id: '12', name: 'Hexarelin', category: 'muscle-growth', summary: 'Potent growth hormone booster', details: 'Hexarelin is a strong growth hormone secretagogue. Research shows powerful effects on muscle growth and fat loss.', dosage: '100-200 mcg 2-3 times daily', sideEffects: 'Cortisol increase (use with caution), hunger, water retention.' },
  { id: '13', name: 'IGF-1 LR3', category: 'muscle-growth', summary: 'Long-acting growth factor for muscle growth', details: 'IGF-1 LR3 is a modified insulin-like growth factor. Research shows potential for muscle growth and fat loss (research only).', dosage: '20-60 mcg once daily (research protocols)', sideEffects: 'Hypoglycemia risk, jaw soreness, headaches.' },
  { id: '14', name: 'Follistatin-344', category: 'muscle-growth', summary: 'Myostatin inhibitor for muscle building', details: 'Follistatin blocks myostatin, potentially allowing greater muscle growth beyond natural limits (very limited human data).', dosage: '100 mcg once daily (research protocols)', sideEffects: 'Unknown; very limited human research.' },
  { id: '15', name: 'Sermorelin', category: 'muscle-growth', summary: 'Growth hormone releasing hormone', details: 'Sermorelin stimulates natural growth hormone production. May support muscle growth, fat loss, and recovery.', dosage: '200-500 mcg once daily before bed', sideEffects: 'Injection site reactions, headache, flushing.' },
  { id: '16', name: 'GHRP-2', category: 'muscle-growth', summary: 'Growth hormone peptide for muscle and fat loss', details: 'GHRP-2 is a growth hormone releasing peptide. Research shows effects on muscle growth and body composition.', dosage: '100-300 mcg 2-3 times daily', sideEffects: 'Hunger, water retention, cortisol increase.' },
  { id: '17', name: 'MK-677', category: 'muscle-growth', summary: 'Oral growth hormone booster', details: 'MK-677 (Ibutamoren) is an oral growth hormone secretagogue. Studies show increases in GH and IGF-1 levels.', dosage: '10-25 mg once daily (oral)', sideEffects: 'Increased appetite, water retention, tingling.' },
  
  // Healing & Recovery
  { id: '18', name: 'BPC-157', category: 'healing', summary: 'Helps with healing injuries and reducing inflammation', details: 'BPC-157 is studied for tissue repair and gut health. Research shows it may help heal tendons, ligaments, and reduce inflammation.', dosage: '250-500 mcg once daily', sideEffects: 'Generally well-tolerated. Possible injection site redness.' },
  { id: '19', name: 'TB-500', category: 'healing', summary: 'Supports tissue healing and reduces inflammation', details: 'TB-500 is researched for wound healing and tissue regeneration. Studies show potential for healing injuries and improving flexibility.', dosage: '2-2.5 mg twice per week', sideEffects: 'Mild injection site reactions, temporary fatigue.' },
  { id: '20', name: 'KPV', category: 'healing', summary: 'Anti-inflammatory peptide for gut and inflammation', details: 'KPV is an anti-inflammatory tripeptide researched for reducing inflammation, especially in the gut. May help with inflammatory conditions.', dosage: '500-1000 mcg once daily', sideEffects: 'Minimal; well-tolerated in studies.' },
  
  // Cognitive
  { id: '21', name: 'Semax', category: 'cognitive', summary: 'Improves focus, memory, and reduces stress', details: 'Semax is studied for cognitive enhancement and neuroprotection. Research shows improvements in memory, focus, and stress resilience.', dosage: '300-600 mcg intranasal 1-2 times daily', sideEffects: 'Rare: mild restlessness or headache.' },
  { id: '22', name: 'Selank', category: 'cognitive', summary: 'Reduces anxiety and improves mental clarity', details: 'Selank is researched for anxiety reduction and cognitive enhancement. Studies show it may help reduce stress and improve mood without sedation.', dosage: '250-500 mcg intranasal 1-2 times daily', sideEffects: 'Rare: mild irritability or sleep changes.' },
  { id: '23', name: 'Dihexa', category: 'cognitive', summary: 'Cognitive enhancement and brain health', details: 'Dihexa is researched as a potent cognitive enhancer. Studies suggest it may improve memory and brain function (research only).', dosage: '5-10 mg oral daily (research only)', sideEffects: 'Unknown long-term effects; research stage.' },
  { id: '24', name: 'P21', category: 'cognitive', summary: 'BDNF mimetic for brain health and neurogenesis', details: 'P21 is derived from Cerebrolysin and studied for promoting brain health. May support neurogenesis and cognitive function.', dosage: '10-30 mg subcutaneous daily (research only)', sideEffects: 'Minimal; limited human data.' },
  { id: '25', name: 'NSI-189', category: 'cognitive', summary: 'Neurogenesis and depression research', details: 'NSI-189 is studied for stimulating neurogenesis and treating depression. Clinical trials show potential cognitive benefits.', dosage: '40 mg oral 3 times daily (clinical trial protocols)', sideEffects: 'Headache, insomnia (mild in trials).' },
  { id: '26', name: 'Cerebrolysin', category: 'cognitive', summary: 'Neurotrophic peptide complex for brain health', details: 'Cerebrolysin is a neurotrophic peptide mixture. Research shows neuroprotective effects and cognitive improvements.', dosage: '5-30 mL intramuscular 2-3 times weekly', sideEffects: 'Headache, dizziness, injection site pain.' },
  { id: '27', name: 'Noopept', category: 'cognitive', summary: 'Cognitive enhancement and neuroprotection', details: 'Noopept is studied for memory enhancement and neuroprotection. May improve learning and cognitive function.', dosage: '10-30 mg oral 2-3 times daily', sideEffects: 'Headache, irritability, insomnia (rare).' },
  { id: '28', name: 'NA-Semax-Amidate', category: 'cognitive', summary: 'Enhanced Semax variant for cognition', details: 'NA-Semax-Amidate is a modified version of Semax with longer-lasting effects. May provide stronger cognitive enhancement.', dosage: '300-600 mcg intranasal once daily', sideEffects: 'Similar to Semax; rare restlessness.' },
  { id: '29', name: 'Pinealon', category: 'cognitive', summary: 'Pineal gland peptide for brain health', details: 'Pinealon is a bioregulator peptide for the pineal gland. Research suggests benefits for cognitive function and circadian rhythm.', dosage: '10-20 mg daily for 10 days per cycle', sideEffects: 'Minimal reported.' },
  
  // Anti-Aging
  { id: '30', name: 'Epithalon', category: 'anti-aging', summary: 'Anti-aging peptide, may support longevity', details: 'Epithalon is researched for anti-aging and telomerase activation. Studies suggest it may support healthy aging and sleep quality.', dosage: '5-10 mg daily for 10-20 days, 1-2 cycles per year', sideEffects: 'Rare: mild fatigue or drowsiness.' },
  { id: '31', name: 'GHK-Cu', category: 'anti-aging', summary: 'Copper peptide for skin, hair, and healing', details: 'GHK-Cu is a copper peptide studied for skin regeneration and anti-aging. Research shows it may improve collagen production and skin appearance.', dosage: '1-3 mg subcutaneous daily or apply topically', sideEffects: 'Mild skin irritation when applied topically.' },
  { id: '32', name: 'MOTS-c', category: 'anti-aging', summary: 'Mitochondrial peptide for energy and longevity', details: 'MOTS-c is a mitochondrial peptide researched for metabolic health and longevity. May improve energy production and insulin sensitivity.', dosage: '5-10 mg 2-3 times per week', sideEffects: 'Minimal; injection site reactions.' },
  { id: '33', name: 'Humanin', category: 'anti-aging', summary: 'Mitochondrial peptide for cellular health', details: 'Humanin is a mitochondrial-derived peptide studied for neuroprotection and metabolic health. May support healthy aging.', dosage: '1-5 mg subcutaneous daily (research protocols)', sideEffects: 'Limited human data available.' },
  { id: '34', name: 'SS-31', category: 'anti-aging', summary: 'Mitochondrial health and cellular energy', details: 'SS-31 (Elamipretide) is studied for mitochondrial health. May protect cells and improve energy production.', dosage: 'Research protocols only (IV or subcutaneous)', sideEffects: 'Mild; generally well-tolerated in trials.' },
  
  // Immune Support
  { id: '35', name: 'Thymosin Alpha-1', category: 'immune', summary: 'Immune system modulator, FDA-approved', details: 'Thymosin Alpha-1 is FDA-approved for certain immune conditions. Research shows it may enhance immune function and response.', dosage: '1.6 mg 2-3 times per week', sideEffects: 'Injection site reactions, rare allergic responses.' },
  { id: '36', name: 'LL-37', category: 'immune', summary: 'Antimicrobial peptide for immune support', details: 'LL-37 is an antimicrobial peptide researched for fighting infections and supporting immune health.', dosage: '5-10 mg daily (research protocols)', sideEffects: 'Minimal; injection site reactions possible.' },
  { id: '37', name: 'Thymalin', category: 'immune', summary: 'Thymus extract for immune regulation', details: 'Thymalin is a thymus peptide extract studied for immune system support and regulation.', dosage: '10-20 mg intramuscular 1-2 times weekly', sideEffects: 'Minimal; injection site reactions.' },
  
  // Sexual Health
  { id: '38', name: 'PT-141', category: 'sexual-health', summary: 'FDA-approved for sexual health and libido', details: 'PT-141 (Bremelanotide) is FDA-approved for low sexual desire in women. Works through the brain to enhance arousal.', dosage: '1.75 mg as needed, max once per 24 hours', sideEffects: 'Nausea, flushing, headache (usually mild).' },
  { id: '39', name: 'Kisspeptin-10', category: 'sexual-health', summary: 'Reproductive hormone regulation', details: 'Kisspeptin-10 is researched for reproductive health and hormone regulation. May support healthy sexual function.', dosage: 'Research protocols only (limited human data)', sideEffects: 'Unknown; research stage.' },
  { id: '40', name: 'Oxytocin', category: 'sexual-health', summary: 'Social bonding and sexual function', details: 'Oxytocin is a natural hormone studied for social bonding, trust, and sexual function. May enhance intimacy and mood.', dosage: '10-40 IU intranasal as needed', sideEffects: 'Rare: uterine contractions, water retention.' },
  
  // Sleep
  { id: '41', name: 'DSIP', category: 'sleep', summary: 'Delta sleep-inducing peptide for better sleep', details: 'DSIP is researched for sleep regulation and stress reduction. May help improve sleep quality and duration.', dosage: '100-300 mcg before bedtime', sideEffects: 'Drowsiness, vivid dreams.' },
  
  // Skin & Hair
  { id: '42', name: 'GHK-Cu (Topical)', category: 'skin-hair', summary: 'Skin rejuvenation and anti-aging', details: 'GHK-Cu applied topically is studied for skin health. May improve collagen, reduce wrinkles, and support hair growth.', dosage: 'Topical application 1-2 times daily', sideEffects: 'Minimal; rare skin sensitivity.' },
  { id: '43', name: 'Melanotan II', category: 'skin-hair', summary: 'Tanning and libido effects', details: 'Melanotan II is researched for skin tanning and sexual enhancement. May darken skin tone and enhance libido.', dosage: '250-500 mcg 2-3 times per week', sideEffects: 'Nausea, flushing, darkening of moles, increased libido.' },
  { id: '44', name: 'Matrixyl', category: 'skin-hair', summary: 'Anti-aging skincare peptide', details: 'Matrixyl (Palmitoyl Pentapeptide) is a cosmetic peptide for reducing wrinkles. May stimulate collagen production.', dosage: 'Topical application 1-2 times daily', sideEffects: 'Minimal; rare skin irritation.' },
  { id: '45', name: 'Argireline', category: 'skin-hair', summary: 'Reduces wrinkles like botox alternative', details: 'Argireline (Acetyl Hexapeptide-8) is a cosmetic peptide that may reduce expression wrinkles similar to botox.', dosage: 'Topical application 2 times daily', sideEffects: 'Minimal; skin sensitivity possible.' },
];

// Peptide of the Day
function getPeptideOfTheDay() {
  const today = new Date();
  const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000);
  const index = dayOfYear % PEPTIDES.length;
  return PEPTIDES[index];
}

export default function LibraryPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPeptide, setSelectedPeptide] = useState<any>(null);
  const [addedToStack, setAddedToStack] = useState<string[]>([]);
  const [showSuccess, setShowSuccess] = useState(false);

  const peptideOfTheDay = getPeptideOfTheDay();

  const filteredPeptides = PEPTIDES.filter(p => {
    const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
    const matchesSearch = searchQuery.trim() === '' || 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.details.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleAddToStack = async (peptide: any) => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      if (confirm('Please sign in to add peptides to your stack. Go to sign in page?')) {
        window.location.href = '/auth';
      }
      return;
    }

    const { data: existing } = await supabase
      .from('user_peptide_stack')
      .select('peptides')
      .eq('user_id', session.user.id)
      .maybeSingle();

    const currentStack = existing?.peptides || [];
    
    // Check if already in stack
    if (currentStack.some((p: any) => p.name === peptide.name)) {
      alert('This peptide is already in your stack!');
      return;
    }

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
    setTimeout(() => setShowSuccess(false), 2500);
  };

  return (
    <div className="min-h-screen bg-[#FDFCFA]">
      {/* Top Navigation */}
      <nav className="fixed top-0 left-0 right-0 bg-white/90 backdrop-blur-md border-b border-[#D4C4B0] z-50">
        <div className="container mx-auto px-6 py-4 max-w-7xl flex items-center justify-between">
          <Link href="/" className="hover:opacity-80 transition-opacity">
            <img 
              src="/logo.png" 
              alt="FreshPeptide" 
              className="h-14 w-auto object-contain"
            />
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/dashboard">
              <Button 
                variant="ghost"
                className="text-[#5C4A3A] hover:text-[#3E3028] hover:bg-[#F5EFE7] font-medium"
              >
                Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-6 pt-28 pb-24 max-w-5xl">
        {/* Header with Library Logo */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <img 
              src="/library.png" 
              alt="Peptide Library" 
              className="w-64 h-64 object-contain"
            />
          </div>
          <div className="text-3xl md:text-4xl font-light text-[#5C4A3A] min-h-[48px]">
            <TypeWriter 
              text="Explore and learn about peptides" 
              speed={60}
              className="text-[#5C4A3A]"
            />
          </div>
        </div>

        {/* Peptide of the Day - Clean & Warm */}
        <div className="bg-gradient-to-br from-[#F5EFE7] to-white border-2 border-[#D4C4B0] rounded-2xl p-8 mb-10 shadow-sm">
          <div className="flex items-start gap-6">
            <div className="flex-shrink-0">
              <img 
                src="/daypeptide.png" 
                alt="Peptide of the Day" 
                className="w-28 h-28 object-contain"
              />
            </div>
            <div className="flex-1">
              <span className="bg-[#8B6F47] text-white text-xs font-semibold px-3 py-1.5 rounded-full inline-block mb-2">
                Peptide of the Day
              </span>
              <p className="text-[#8B6F47] text-sm font-medium mb-4">
                {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </p>
              <h3 className="text-3xl font-bold text-[#3E3028] mb-3">
                {peptideOfTheDay.name}
              </h3>
              <p className="text-[#5C4A3A] text-lg leading-relaxed mb-5">
                {peptideOfTheDay.summary}
              </p>
              <Button
                onClick={() => setSelectedPeptide(peptideOfTheDay)}
                className="bg-[#8B6F47] text-white hover:bg-[#6F5839] font-semibold px-8 py-3 rounded-xl text-base"
              >
                Learn More →
              </Button>
            </div>
          </div>
          </div>

        {/* Search Bar - Clean & Simple */}
        <div className="mb-8">
          <input
              type="text"
            placeholder="Search peptides... (e.g., weight loss, muscle growth, healing)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-[#D4C4B0] text-[#3E3028] py-4 px-6 rounded-2xl text-base placeholder:text-[#A89882] focus:outline-none focus:border-[#8B6F47] focus:ring-1 focus:ring-[#8B6F47] transition-all"
            />
          </div>

        {/* Categories */}
        <div className="mb-10">
          <div className="flex flex-wrap gap-2.5 justify-center">
            {CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-[#8B6F47] text-white shadow-md'
                    : 'bg-white border-2 border-[#E8DCC8] text-[#5C4A3A] hover:border-[#8B6F47] hover:bg-[#F5EFE7]'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Results Count */}
        {(searchQuery || selectedCategory !== 'all') && (
          <div className="text-center mb-6">
            <p className="text-[#5C4A3A]">
              Showing {filteredPeptides.length} peptide{filteredPeptides.length !== 1 ? 's' : ''}
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                }}
                className="ml-2 text-[#8B6F47] hover:text-[#6F5839] font-semibold underline"
              >
                Clear filters
              </button>
            </p>
          </div>
        )}

        {/* Success Toast */}
        {showSuccess && (
          <div className="fixed top-24 left-1/2 -translate-x-1/2 bg-[#8B6F47] text-white px-8 py-4 rounded-2xl shadow-2xl z-50 animate-bounce-in">
            <span className="text-base font-semibold">✓ Added to your stack!</span>
          </div>
        )}

        {/* Peptide Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {filteredPeptides.map((peptide) => (
            <div
                  key={peptide.id}
              className="bg-white border-2 border-[#E8DCC8] rounded-2xl p-6 hover:border-[#8B6F47] hover:shadow-lg transition-all cursor-pointer group"
                  onClick={() => setSelectedPeptide(peptide)}
            >
              <div className="flex items-start justify-between gap-4 mb-3">
                <h3 className="text-xl font-bold text-[#3E3028] group-hover:text-[#8B6F47] transition-colors">
                  {peptide.name}
                </h3>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAddToStack(peptide);
                  }}
                  disabled={addedToStack.includes(peptide.id)}
                  className={`text-xs font-bold px-4 py-2 rounded-xl whitespace-nowrap transition-all ${
                    addedToStack.includes(peptide.id)
                      ? 'bg-green-600 text-white'
                      : 'bg-[#8B6F47] text-white hover:bg-[#6F5839] active:scale-95'
                  }`}
                >
                  {addedToStack.includes(peptide.id) ? '✓ Added' : '+ Add'}
                </button>
              </div>
              <p className="text-[#5C4A3A] leading-relaxed">
                {peptide.summary}
              </p>
            </div>
              ))}

              {filteredPeptides.length === 0 && (
            <div className="col-span-full text-center py-20">
              <p className="text-[#5C4A3A] text-xl mb-4">
                No peptides found
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                }}
                className="text-[#8B6F47] hover:text-[#6F5839] font-bold underline text-lg"
              >
                Show all peptides
              </button>
            </div>
          )}
        </div>
      </main>

      {/* Modal for Details */}
      {selectedPeptide && (
        <>
          <div 
            className="fixed inset-0 bg-[#3E3028]/60 backdrop-blur-sm z-40"
            onClick={() => setSelectedPeptide(null)}
          />
          
          <div className="fixed inset-x-4 top-20 bottom-20 md:inset-x-auto md:left-1/2 md:-translate-x-1/2 md:w-full md:max-w-2xl z-50 overflow-hidden">
            <div className="h-full bg-white rounded-3xl shadow-2xl overflow-y-auto border-4 border-[#D4C4B0]">
              {/* Header */}
              <div className="sticky top-0 bg-gradient-to-r from-[#8B6F47] to-[#6F5839] px-8 py-6 flex items-center justify-between">
                <h2 className="text-3xl font-bold text-white">
                    {selectedPeptide.name}
                  </h2>
                <button
                  onClick={() => setSelectedPeptide(null)}
                  className="w-12 h-12 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
                >
                  <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Content */}
              <div className="p-8 space-y-8">
                <div>
                  <h3 className="text-2xl font-bold text-[#3E3028] mb-4 flex items-center gap-3">
                    <span className="text-3xl">💡</span>
                    What it does
                  </h3>
                  <p className="text-[#5C4A3A] leading-relaxed text-lg">
                    {selectedPeptide.details}
                  </p>
                    </div>

                <div className="bg-gradient-to-br from-[#F5EFE7] to-white border-2 border-[#D4C4B0] rounded-2xl p-6">
                  <h3 className="text-2xl font-bold text-[#3E3028] mb-4 flex items-center gap-3">
                    <span className="text-3xl">💊</span>
                    How to use it
                  </h3>
                  <p className="text-[#3E3028] leading-relaxed text-lg font-semibold mb-4">
                    {selectedPeptide.dosage}
                  </p>
                  <div className="flex items-start gap-3 bg-orange-100 border border-orange-300 rounded-xl p-4">
                    <svg className="w-6 h-6 text-orange-700 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                      <path d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 4.995z"/>
                    </svg>
                    <span className="text-sm text-orange-900 font-medium">If you're new, always start with the lower dose and increase slowly</span>
                    </div>
                    </div>

                    <div>
                  <h3 className="text-2xl font-bold text-[#3E3028] mb-4 flex items-center gap-3">
                    <span className="text-3xl">⚠️</span>
                    Possible side effects
                      </h3>
                  <p className="text-[#5C4A3A] leading-relaxed text-lg">
                    {selectedPeptide.sideEffects}
                      </p>
                    </div>

                {/* Buttons */}
                <div className="pt-6 space-y-3">
                  <Button
                    onClick={() => handleAddToStack(selectedPeptide)}
                    disabled={addedToStack.includes(selectedPeptide.id)}
                    className={`w-full font-bold py-5 rounded-2xl text-lg shadow-md ${
                      addedToStack.includes(selectedPeptide.id)
                        ? 'bg-green-600 hover:bg-green-600 text-white'
                        : 'bg-[#8B6F47] hover:bg-[#6F5839] text-white active:scale-98'
                    }`}
                  >
                    {addedToStack.includes(selectedPeptide.id) ? '✓ Added to Your Stack' : '+ Add to My Stack'}
                  </Button>
                  <Button
                    onClick={() => setSelectedPeptide(null)}
                    className="w-full bg-white border-2 border-[#D4C4B0] text-[#5C4A3A] hover:bg-[#F5EFE7] font-semibold py-5 rounded-2xl text-lg"
                  >
                    Close
                  </Button>
                    </div>

                {/* Disclaimer */}
                <div className="bg-orange-50 border-2 border-orange-200 rounded-2xl p-6">
                  <p className="text-sm text-[#5C4A3A] leading-relaxed">
                    <strong className="text-orange-900">Important:</strong> This information is for 
                    educational purposes only. Always consult with a qualified doctor before using any peptides.
                  </p>
                    </div>
                  </div>
            </div>
          </div>
        </>
      )}

      {/* Research Banner */}
      <div className="fixed bottom-0 left-0 right-0 bg-orange-600 text-white py-1.5 px-4 text-center z-30">
        <p className="text-xs font-medium tracking-wide">
          RESEARCH PURPOSES ONLY — NOT MEDICAL ADVICE
        </p>
      </div>
    </div>
  );
}
