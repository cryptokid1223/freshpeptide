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
    name: 'BPC-157 (Body Protection Compound-157)',
    regulatory_status: 'Research-only/Unapproved',
    summary: 'Gastric pentadecapeptide promoted online; human safety and efficacy remain unestablished.',
    mechanism: 'Preclinical studies suggest angiogenic and cytoprotective signaling that may influence wound and tendon repair; human pharmacology is uncertain.',
    evidence: [
      {
        title: 'USADA advisory on BPC-157',
        year: 2019,
        source: 'USADA',
        summary: 'Warning about BPC-157 use and anti-doping violations',
        url: 'https://www.usada.org/spirit-of-sport/bpc-157-peptide-prohibited/',
      },
    ],
    common_adverse_effects: 'Unknown; safety not established in controlled human trials',
    contraindications: 'Athletes: prohibited under anti-doping rules',
    recommended_dosage: '250-500 mcg daily, subcutaneous or intramuscular',
  },
  {
    id: '2',
    slug: 'tb-500',
    name: 'Thymosin Beta-4 / TB-500',
    regulatory_status: 'Research-only/Unapproved',
    summary: 'Actin-binding peptide explored in dermal and corneal healing models; human approvals lacking.',
    mechanism: 'Facilitates cell migration and angiogenesis; binds G-actin and modulates cytoskeletal dynamics in preclinical systems.',
    evidence: [
      {
        title: 'Thymosin β4 in tissue repair (review)',
        year: 2021,
        source: 'PMC',
        summary: 'Comprehensive review of Thymosin Beta-4 in tissue repair and regeneration',
        url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC8228050/',
      },
    ],
    common_adverse_effects: 'Injection-site reactions (reported), Unknown long-term safety',
    contraindications: 'Malignancy caution (theoretical)',
    recommended_dosage: '2-2.5 mg twice weekly for loading phase, then 2 mg weekly for maintenance',
  },
  {
    id: '3',
    slug: 'cjc-1295',
    name: 'CJC-1295',
    regulatory_status: 'Research-only/Unapproved',
    summary: 'Longer-acting GHRH analog investigated for sustained GH/IGF-1 elevations.',
    mechanism: 'Stimulates pituitary somatotrophs via GHRH receptor; DAC variant prolongs exposure through albumin binding.',
    evidence: [
      {
        title: 'CJC-1295 human studies',
        year: 2006,
        source: 'PubMed',
        summary: 'Clinical investigation of CJC-1295 effects on GH secretion',
        url: 'https://pubmed.ncbi.nlm.nih.gov/16352683/',
      },
      {
        title: 'FDA: Safety risks (compounded peptides)',
        year: 2024,
        source: 'FDA',
        summary: 'FDA warning on compounded peptide safety',
        url: 'https://www.fda.gov/drugs/human-drug-compounding/certain-bulk-drug-substances-use-compounding-may-present-significant-safety-risks',
      },
    ],
    common_adverse_effects: 'Injection site reactions, Flu-like symptoms (reported)',
    contraindications: 'Active malignancy (theoretical)',
    recommended_dosage: '1-2 mg per week, subcutaneous injection',
  },
  {
    id: '4',
    slug: 'ipamorelin',
    name: 'Ipamorelin',
    regulatory_status: 'Research-only/Unapproved',
    summary: 'Selective GHSR-1a agonist that triggers GH pulses with low ACTH/cortisol spillover in studies.',
    mechanism: 'Binds the ghrelin receptor to stimulate pituitary GH release with relative selectivity versus other pituitary axes.',
    evidence: [
      {
        title: 'Ipamorelin selectivity (foundational study)',
        year: 1998,
        source: 'PubMed',
        summary: 'Characterization of ipamorelin mechanism',
        url: 'https://pubmed.ncbi.nlm.nih.gov/9849822/',
      },
      {
        title: 'FDA: Safety risks with certain compounded peptides',
        year: 2024,
        source: 'FDA',
        summary: 'FDA warning on compounded peptide safety',
        url: 'https://www.fda.gov/drugs/human-drug-compounding/certain-bulk-drug-substances-use-compounding-may-present-significant-safety-risks',
      },
    ],
    common_adverse_effects: 'Headache, Flushing, Dizziness (reported)',
    contraindications: 'Active malignancy (theoretical)',
    recommended_dosage: '200-300 mcg 2-3 times daily, subcutaneous',
  },
  {
    id: '5',
    slug: 'selank',
    name: 'Selank',
    regulatory_status: 'Research-only/Unapproved (US)',
    summary: 'Heptapeptide derived from the immune peptide tuftsin; explored for anxiolytic and cognitive effects.',
    mechanism: 'May modulate GABAergic signaling and neurotrophic pathways; exact pharmacology remains under study.',
    evidence: [
      {
        title: 'Tuftsin-derived peptides and neurobiology (review)',
        year: 2016,
        source: 'PubMed',
        summary: 'Review of Selank and related peptides in neurobiology',
        url: 'https://pubmed.ncbi.nlm.nih.gov/27803462/',
      },
    ],
    common_adverse_effects: 'Limited controlled data; nasal irritation reported anecdotally',
    contraindications: 'Unknown',
    recommended_dosage: '250-500 mcg intranasal or subcutaneous, 1-3 times daily',
  },
  {
    id: '6',
    slug: 'semax',
    name: 'Semax',
    regulatory_status: 'Research-only/Unapproved (US)',
    summary: 'Neuropeptide analog investigated for cognitive and neurotrophic effects in regional studies.',
    mechanism: 'Proposed modulation of BDNF expression and neurotransmission; precise targets remain under investigation.',
    evidence: [
      {
        title: 'Semax experimental studies (overview)',
        year: 2016,
        source: 'PubMed',
        summary: 'Overview of Semax research and mechanisms',
        url: 'https://pubmed.ncbi.nlm.nih.gov/27078861/',
      },
    ],
    common_adverse_effects: 'Limited controlled data; nasal irritation reported in some reports',
    contraindications: 'Unknown; seizure disorders warrant caution in research',
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
  {
    id: '11',
    slug: 'ghrp-6',
    name: 'GHRP-6',
    regulatory_status: 'Research-only/Unapproved',
    summary: 'Legacy growth-hormone secretagogue studied for GH pulses and appetite effects.',
    mechanism: 'Agonizes the ghrelin (GHSR-1a) receptor on pituitary and hypothalamic targets, increasing pulsatile GH release and engaging appetite pathways.',
    evidence: [
      {
        title: 'Growth hormone secretagogues and ghrelin receptor',
        year: 2009,
        source: 'PubMed',
        summary: 'Overview of GHRP-6 and ghrelin receptor mechanisms',
        url: 'https://pubmed.ncbi.nlm.nih.gov/19133992/',
      },
    ],
    common_adverse_effects: 'Hunger sensations (reported in studies), Flushing, Headache',
    contraindications: 'Active malignancy (theoretical concern with GH/IGF-1 pathways)',
    recommended_dosage: 'Research protocols vary; no approved dosing',
  },
  {
    id: '12',
    slug: 'follistatin-344',
    name: 'Follistatin 344',
    regulatory_status: 'Research-only/Unapproved',
    summary: 'Glycoprotein domain/peptide that binds activins and myostatin, altering muscle signaling in models.',
    mechanism: 'Sequesters activins/myostatin, decreasing SMAD-mediated signaling that suppresses muscle growth.',
    evidence: [
      {
        title: 'Follistatin and muscle growth review',
        year: 2008,
        source: 'PubMed',
        summary: 'Review of follistatin role in muscle biology',
        url: 'https://pubmed.ncbi.nlm.nih.gov/19038649/',
      },
    ],
    common_adverse_effects: 'Unknown human safety profile',
    contraindications: 'Oncologic caution (theoretical growth signaling)',
    recommended_dosage: 'No established human dosing',
  },
  {
    id: '13',
    slug: 'll-37',
    name: 'LL-37',
    regulatory_status: 'Research-only/Unapproved',
    summary: 'Human cathelicidin fragment with antimicrobial and immune-modulating actions; studied in wound and infection models.',
    mechanism: 'Disrupts microbial membranes and modulates innate immune responses including chemotaxis and cytokine release.',
    evidence: [
      {
        title: 'LL-37: biology and therapeutic potential (review)',
        year: 2013,
        source: 'PMC',
        summary: 'Comprehensive review of LL-37 antimicrobial and immune functions',
        url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC3658991/',
      },
    ],
    common_adverse_effects: 'Topical irritation reported in studies',
    contraindications: 'Auto-inflammatory skin conditions (caution, context-dependent)',
    recommended_dosage: 'Topical applications in research; no standardized dosing',
  },
  {
    id: '14',
    slug: 'mots-c',
    name: 'MOTS-c',
    regulatory_status: 'Research-only/Unapproved',
    summary: 'Small peptide encoded by mitochondrial DNA implicated in metabolic and exercise responses.',
    mechanism: 'Appears to activate AMPK-linked stress pathways and improve metabolic flexibility in preclinical models.',
    evidence: [
      {
        title: 'MOTS-c overview (review)',
        year: 2019,
        source: 'Frontiers in Endocrinology',
        summary: 'Overview of MOTS-c as mitochondrial-derived peptide',
        url: 'https://www.frontiersin.org/articles/10.3389/fendo.2019.00553/full',
      },
    ],
    common_adverse_effects: 'Unknown human safety profile',
    contraindications: 'Unknown; metabolic disorders warrant caution in trials',
    recommended_dosage: 'No established human dosing',
  },
  {
    id: '15',
    slug: 'humanin',
    name: 'Humanin',
    regulatory_status: 'Research-only/Unapproved',
    summary: 'Endogenous peptide reported to exert cytoprotective effects in models of neurodegeneration and metabolism.',
    mechanism: 'Interacts with cell-surface and intracellular targets (e.g., FPRL1/2, IGFBP3 pathways) to reduce apoptotic signaling in stress contexts.',
    evidence: [
      {
        title: 'Humanin and mitochondrial-derived peptides (review)',
        year: 2017,
        source: 'PMC',
        summary: 'Review of humanin and related mitochondrial peptides',
        url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC5671641/',
      },
    ],
    common_adverse_effects: 'Unknown in humans',
    contraindications: 'Unknown',
    recommended_dosage: 'No established human dosing',
  },
  {
    id: '16',
    slug: 'epitalon',
    name: 'Epitalon',
    regulatory_status: 'Research-only/Unapproved',
    summary: 'Short peptide linked to circadian/aging biology in preclinical literature; human evidence remains limited.',
    mechanism: 'Proposed modulation of melatonin rhythms and telomerase activity in vitro; in vivo mechanisms are debated.',
    evidence: [
      {
        title: 'Pineal peptides and aging (overview)',
        year: 2015,
        source: 'PubMed',
        summary: 'Overview of pineal peptides including Epitalon in aging research',
        url: 'https://pubmed.ncbi.nlm.nih.gov/25824742/',
      },
    ],
    common_adverse_effects: 'Unknown; small studies report minimal acute effects',
    contraindications: 'Unknown',
    recommended_dosage: '5-10 mg for 10-20 days, 1-2 cycles per year (research protocols)',
  },
  {
    id: '17',
    slug: 'kpv',
    name: 'KPV (α-MSH 11-13)',
    regulatory_status: 'Research-only/Unapproved',
    summary: 'Small α-MSH fragment investigated for anti-inflammatory effects in gut and skin models.',
    mechanism: 'Engages melanocortin-linked anti-inflammatory signaling and may be transported by PepT1 in the gut.',
    evidence: [
      {
        title: 'KPV anti-inflammatory activity',
        year: 2007,
        source: 'PMC',
        summary: 'Study of KPV anti-inflammatory properties',
        url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC2431115/',
      },
    ],
    common_adverse_effects: 'Insufficient human data',
    contraindications: 'Unknown',
    recommended_dosage: 'No established human dosing',
  },
  {
    id: '18',
    slug: 'foxo4-dri',
    name: 'FOXO4-DRI',
    regulatory_status: 'Research-only/Unapproved',
    summary: 'Designed peptide reported to disrupt FOXO4-p53 interactions in senescent cells, promoting their apoptosis in models.',
    mechanism: 'Interferes with FOXO4 binding to p53, tipping senescent cells toward programmed cell death in preclinical systems.',
    evidence: [
      {
        title: 'Targeting senescent cells via FOXO4-p53 (foundational study)',
        year: 2017,
        source: 'PubMed',
        summary: 'Foundational study on FOXO4-DRI as senolytic agent',
        url: 'https://pubmed.ncbi.nlm.nih.gov/28340339/',
      },
    ],
    common_adverse_effects: 'Unknown in humans',
    contraindications: 'Unknown',
    recommended_dosage: 'No established human dosing',
  },
  {
    id: '19',
    slug: 'thymosin-alpha-1',
    name: 'Thymosin Alpha-1',
    regulatory_status: 'Research-only/Unapproved (US)',
    summary: 'Immune-modulating peptide with regional approvals outside the US; explored for infectious and oncologic contexts.',
    mechanism: 'Augments T-cell maturation and function, influences dendritic cells, and modulates innate immunity.',
    evidence: [
      {
        title: 'Thymosin alpha-1: immunology and clinical evidence (review)',
        year: 2018,
        source: 'PMC',
        summary: 'Review of Thymosin alpha-1 immunology and clinical applications',
        url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC5775641/',
      },
    ],
    common_adverse_effects: 'Injection-site reactions reported in studies outside US',
    contraindications: 'Autoimmune flares (theoretical caution)',
    recommended_dosage: 'Varies by regional protocols; no US approval',
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

