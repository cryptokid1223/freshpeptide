'use client';

import React, { useState, useEffect } from 'react';
import { MainLayout } from '@/components/MainLayout';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

// Mock peptide data (in production, this would come from Supabase)
const PEPTIDES = [
  {
    id: '1',
    slug: 'bpc-157',
    name: 'BPC-157',
    regulatory_status: 'Research-only / Compounded',
    summary: 'Body Protection Compound-157 is a peptide studied for tissue repair and anti-inflammatory properties.',
    mechanism: 'Promotes angiogenesis, modulates growth factors, and enhances cellular repair mechanisms',
    evidence: [
      {
        title: 'Gastric Pentadecapeptide BPC 157',
        year: 2012,
        source: 'Current Pharmaceutical Design',
        summary: 'Review of BPC 157 mechanisms in tissue protection',
      },
    ],
    common_adverse_effects: 'Mild injection site reactions, rare allergic responses',
    contraindications: 'Pregnancy, active cancer, uncontrolled bleeding disorders',
    recommended_dosage: '250-500 mcg daily, subcutaneous or intramuscular',
  },
  {
    id: '2',
    slug: 'tb-500',
    name: 'TB-500 (Thymosin Beta-4)',
    regulatory_status: 'Research-only',
    summary: 'A peptide fragment studied for wound healing and tissue regeneration properties.',
    mechanism: 'Regulates actin polymerization, promotes cell migration, and enhances tissue repair',
    evidence: [
      {
        title: 'Thymosin Beta4: A Multi-Functional Regenerative Peptide',
        year: 2015,
        source: 'Annals of NY Academy of Sciences',
        summary: 'Comprehensive review of TB-500 regenerative mechanisms',
      },
    ],
    common_adverse_effects: 'Mild injection site reactions, temporary fatigue',
    contraindications: 'Active malignancy, pregnancy',
    recommended_dosage: '2-2.5 mg twice weekly for 4-6 weeks, then maintenance',
  },
  {
    id: '3',
    slug: 'cjc-1295',
    name: 'CJC-1295',
    regulatory_status: 'Research-only',
    summary: 'A growth hormone-releasing hormone analog studied for its potential to increase GH levels.',
    mechanism: 'Extends half-life of growth hormone-releasing hormone, stimulating natural GH production',
    evidence: [
      {
        title: 'Modified GRF (1-29) Analog in Aging',
        year: 2010,
        source: 'Journal of Clinical Endocrinology',
        summary: 'Study on GH-releasing effects',
      },
    ],
    common_adverse_effects: 'Injection site reactions, water retention, tingling sensations',
    contraindications: 'Active cancer, diabetic retinopathy, pregnancy',
    recommended_dosage: '1-2 mg per week, subcutaneous injection',
  },
  {
    id: '4',
    slug: 'ipamorelin',
    name: 'Ipamorelin',
    regulatory_status: 'Research-only',
    summary: 'A selective growth hormone secretagogue studied for muscle growth and fat loss.',
    mechanism: 'Selective ghrelin receptor agonist promoting pulsatile GH release without affecting cortisol',
    evidence: [
      {
        title: 'Ipamorelin - Novel GH Secretagogue',
        year: 2001,
        source: 'European Journal of Endocrinology',
        summary: 'Characterization of ipamorelin mechanism',
      },
    ],
    common_adverse_effects: 'Mild injection site reactions, increased hunger, water retention',
    contraindications: 'Pregnancy, active malignancy',
    recommended_dosage: '200-300 mcg 2-3 times daily, subcutaneous',
  },
  {
    id: '5',
    slug: 'selank',
    name: 'Selank',
    regulatory_status: 'Prescription (Russia) / Research-only (US)',
    summary: 'A peptide studied for anxiolytic and cognitive enhancement properties.',
    mechanism: 'Modulates BDNF and IL-6 expression, affects monoamine neurotransmitters',
    evidence: [
      {
        title: 'Selank: Anxiolytic Peptide',
        year: 2009,
        source: 'Neuroscience and Behavioral Physiology',
        summary: 'Review of anxiolytic mechanisms',
      },
    ],
    common_adverse_effects: 'Rare: mild irritability, sleep disturbances',
    contraindications: 'Pregnancy, severe psychiatric disorders',
    recommended_dosage: '250-500 mcg intranasal or subcutaneous, 1-3 times daily',
  },
  {
    id: '6',
    slug: 'semax',
    name: 'Semax',
    regulatory_status: 'Prescription (Russia) / Research-only (US)',
    summary: 'A peptide studied for neuroprotective and cognitive enhancement effects.',
    mechanism: 'Increases BDNF, modulates neurotransmitter systems, enhances neuroplasticity',
    evidence: [
      {
        title: 'Semax in Treatment of Cognitive Disorders',
        year: 2013,
        source: 'Medical News of North Caucasus',
        summary: 'Clinical applications review',
      },
    ],
    common_adverse_effects: 'Rare: restlessness, mild anxiety',
    contraindications: 'Pregnancy, acute psychosis',
    recommended_dosage: '300-600 mcg intranasal, 1-2 times daily',
  },
  {
    id: '7',
    slug: 'ghk-cu',
    name: 'GHK-Cu (Copper Peptide)',
    regulatory_status: 'Research-only / Cosmetic use',
    summary: 'A copper-binding peptide studied for skin regeneration and anti-aging properties.',
    mechanism: 'Stimulates collagen and glycosaminoglycan synthesis, promotes wound healing and angiogenesis',
    evidence: [
      {
        title: 'Regenerative and Protective Effects of GHK-Cu',
        year: 2018,
        source: 'Biomedicine & Pharmacotherapy',
        summary: 'Comprehensive review of regenerative mechanisms',
      },
    ],
    common_adverse_effects: 'Mild skin irritation when applied topically',
    contraindications: "Wilson's disease, copper sensitivity",
    recommended_dosage: '1-3 mg subcutaneous or topical application',
  },
  {
    id: '8',
    slug: 'melanotan-ii',
    name: 'Melanotan II',
    regulatory_status: 'Research-only',
    summary: 'A synthetic peptide analog studied for pigmentation and other metabolic effects.',
    mechanism: 'Melanocortin receptor agonist affecting pigmentation, appetite, and sexual function',
    evidence: [
      {
        title: 'Melanocortin Receptor Agonists',
        year: 2014,
        source: 'Journal of Clinical Investigation',
        summary: 'Mechanisms of melanocortin signaling',
      },
    ],
    common_adverse_effects: 'Nausea, facial flushing, increased libido, darkening of moles',
    contraindications: 'Melanoma history, uncontrolled hypertension, pregnancy',
    recommended_dosage: '250-500 mcg 2-3 times weekly, subcutaneous',
  },
  {
    id: '9',
    slug: 'epithalon',
    name: 'Epithalon (Epitalon)',
    regulatory_status: 'Research-only',
    summary: 'A peptide studied for its potential anti-aging and telomerase-activating properties.',
    mechanism: 'Potential telomerase activation, melatonin regulation, antioxidant effects',
    evidence: [
      {
        title: 'Peptide Regulation of Aging',
        year: 2003,
        source: 'Biogerontology',
        summary: 'Studies on peptide bioregulation',
      },
    ],
    common_adverse_effects: 'Rare: mild fatigue, drowsiness',
    contraindications: 'Pregnancy, active malignancy',
    recommended_dosage: '5-10 mg for 10-20 days, 1-2 cycles per year',
  },
  {
    id: '10',
    slug: 'pt-141',
    name: 'PT-141 (Bremelanotide)',
    regulatory_status: 'FDA-approved for female sexual dysfunction',
    summary: 'A melanocortin receptor agonist approved for hypoactive sexual desire disorder.',
    mechanism: 'Activates melanocortin receptors in CNS affecting sexual arousal pathways',
    evidence: [
      {
        title: 'Bremelanotide for Hypoactive Sexual Desire Disorder',
        year: 2019,
        source: 'NEJM',
        summary: 'Phase 3 clinical trial results',
      },
    ],
    common_adverse_effects: 'Nausea, flushing, headache, vomiting',
    contraindications: 'Uncontrolled hypertension, cardiovascular disease, pregnancy',
    recommended_dosage: '1.75 mg subcutaneous as needed, max once per 24 hours',
  },
];

export default function LibraryPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPeptide, setSelectedPeptide] = useState<any>(null);
  const [filteredPeptides, setFilteredPeptides] = useState(PEPTIDES);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredPeptides(PEPTIDES);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = PEPTIDES.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.summary.toLowerCase().includes(query) ||
          p.mechanism?.toLowerCase().includes(query)
      );
      setFilteredPeptides(filtered);
    }
  }, [searchQuery]);

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-cyan-400 mb-2">Peptide Library</h1>
            <p className="text-slate-400">
              Explore our curated database of research peptides with detailed information
            </p>
          </div>

          {/* Search */}
          <div className="mb-6">
            <Input
              type="text"
              placeholder="Search peptides by name, mechanism, or summary..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-slate-800 border-slate-600 text-slate-100 text-lg py-6"
            />
          </div>

          {/* Results */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* List */}
            <div className="space-y-4">
              {filteredPeptides.map((peptide) => (
                <Card
                  key={peptide.id}
                  className={`bg-slate-800/50 border-slate-700 p-6 cursor-pointer transition-all hover:bg-slate-800/70 
                    ${selectedPeptide?.id === peptide.id ? 'border-cyan-500 bg-slate-800/70' : ''}`}
                  onClick={() => setSelectedPeptide(peptide)}
                >
                  <h3 className="text-xl font-semibold text-cyan-400 mb-2">{peptide.name}</h3>
                  <p className="text-sm text-amber-400 mb-2">{peptide.regulatory_status}</p>
                  <p className="text-slate-300 text-sm">{peptide.summary}</p>
                </Card>
              ))}

              {filteredPeptides.length === 0 && (
                <Card className="bg-slate-800/50 border-slate-700 p-6 text-center">
                  <p className="text-slate-400">No peptides found matching your search.</p>
                </Card>
              )}
            </div>

            {/* Detail Panel */}
            <div className="sticky top-4">
              {selectedPeptide ? (
                <Card className="bg-slate-800/50 border-slate-700 p-6">
                  <h2 className="text-2xl font-bold text-cyan-400 mb-2">
                    {selectedPeptide.name}
                  </h2>
                  <p className="text-amber-400 text-sm mb-4">
                    {selectedPeptide.regulatory_status}
                  </p>

                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-200 mb-2">Summary</h3>
                      <p className="text-slate-300 text-sm">{selectedPeptide.summary}</p>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-slate-200 mb-2">Mechanism</h3>
                      <p className="text-slate-300 text-sm">{selectedPeptide.mechanism}</p>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-slate-200 mb-2">
                        Recommended Dosage (Research)
                      </h3>
                      <p className="text-slate-300 text-sm">{selectedPeptide.recommended_dosage}</p>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-red-400 mb-2">
                        Common Adverse Effects
                      </h3>
                      <p className="text-slate-300 text-sm">
                        {selectedPeptide.common_adverse_effects}
                      </p>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-red-400 mb-2">
                        Contraindications
                      </h3>
                      <p className="text-slate-300 text-sm">{selectedPeptide.contraindications}</p>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-slate-200 mb-2">Evidence</h3>
                      {selectedPeptide.evidence.map((ev: any, index: number) => (
                        <div key={index} className="bg-slate-900/50 rounded-lg p-3 mb-2">
                          <p className="font-semibold text-slate-200 text-sm">
                            {ev.title} ({ev.year})
                          </p>
                          <p className="text-cyan-400 text-xs mb-1">{ev.source}</p>
                          <p className="text-slate-300 text-xs">{ev.summary}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-6 p-4 bg-amber-900/20 border border-amber-700 rounded-lg">
                    <p className="text-xs text-slate-300">
                      <strong className="text-amber-400">Disclaimer:</strong> This information is for 
                      educational purposes only. Consult healthcare professionals before using any peptides.
                    </p>
                  </div>
                </Card>
              ) : (
                <Card className="bg-slate-800/50 border-slate-700 p-6 text-center">
                  <p className="text-slate-400">Select a peptide to view details</p>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

