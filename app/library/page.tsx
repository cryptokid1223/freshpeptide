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
  {
    id: '20',
    slug: 'hexarelin',
    name: 'Hexarelin',
    regulatory_status: 'Research-only/Unapproved',
    summary: 'Potent synthetic GH secretagogue used to probe GH pulse dynamics.',
    mechanism: 'Activates GHSR-1a on pituitary/hypothalamus to increase pulsatile GH release; may desensitize with chronic exposure in models.',
    evidence: [
      {
        title: 'GHSR agonists and GH secretion (review)',
        year: 2009,
        source: 'PubMed',
        summary: 'Review of ghrelin receptor agonists and GH secretion',
        url: 'https://pubmed.ncbi.nlm.nih.gov/19133992/',
      },
    ],
    common_adverse_effects: 'Flushing, Headache, Transient fatigue (reported)',
    contraindications: 'Active malignancy (theoretical GH/IGF-1 concerns)',
    recommended_dosage: 'Research protocols vary; no approved dosing',
  },
  {
    id: '21',
    slug: 'ghrp-2',
    name: 'GHRP-2 (Pralmorelin)',
    regulatory_status: 'Research-only/Unapproved',
    summary: 'Early ghrelin mimetic used in diagnostic and physiology studies.',
    mechanism: 'Agonizes GHSR-1a to acutely increase GH; may influence hunger pathways via hypothalamus.',
    evidence: [
      {
        title: 'Diagnostic GH stimulation with GHRP-2',
        year: 2002,
        source: 'PubMed',
        summary: 'Study on GHRP-2 use in diagnostic GH stimulation',
        url: 'https://pubmed.ncbi.nlm.nih.gov/12050250/',
      },
    ],
    common_adverse_effects: 'Flushing, Headache, Hunger sensations (reported)',
    contraindications: 'Active malignancy (theoretical)',
    recommended_dosage: 'Research protocols vary; no approved dosing',
  },
  {
    id: '22',
    slug: 'mod-grf-1-29',
    name: 'Mod GRF (1-29)',
    regulatory_status: 'Research-only/Unapproved',
    summary: 'Short-acting GHRH analog engineered for improved stability over native GHRH(1-29).',
    mechanism: 'Stimulates GHRH receptors on somatotrophs to enhance physiologic GH pulsatility; shorter exposure vs DAC-modified forms.',
    evidence: [
      {
        title: 'GHRH analogs and pulsatile GH secretion',
        year: 2006,
        source: 'PubMed',
        summary: 'Study of GHRH analogs and their effects on GH secretion patterns',
        url: 'https://pubmed.ncbi.nlm.nih.gov/17018654/',
      },
    ],
    common_adverse_effects: 'Injection site reactions (reported)',
    contraindications: 'Active malignancy (theoretical)',
    recommended_dosage: 'Research protocols vary; no approved dosing',
  },
  {
    id: '23',
    slug: 'kisspeptin-10',
    name: 'Kisspeptin-10',
    regulatory_status: 'Research-only/Unapproved',
    summary: 'Fragment of kisspeptin used to study GnRH/LH axis activation.',
    mechanism: 'Stimulates hypothalamic GnRH neurons, increasing pituitary LH/FSH secretion in physiological studies.',
    evidence: [
      {
        title: 'Kisspeptin and human reproductive axis',
        year: 2005,
        source: 'PubMed',
        summary: 'Study of kisspeptin role in reproductive endocrinology',
        url: 'https://pubmed.ncbi.nlm.nih.gov/15774510/',
      },
    ],
    common_adverse_effects: 'Flushing, Nausea (occasionally reported)',
    contraindications: 'Hormone-sensitive conditions (research caution)',
    recommended_dosage: 'Research protocols vary; no approved dosing',
  },
  {
    id: '24',
    slug: 'peptide-yy-3-36',
    name: 'Peptide YY (3-36)',
    regulatory_status: 'Research-only/Unapproved',
    summary: 'Anorexigenic gut peptide fragment studied for appetite and energy balance.',
    mechanism: 'Preferential Y2 receptor agonist that suppresses appetite signals via hypothalamic pathways.',
    evidence: [
      {
        title: 'PYY(3-36) reduces appetite in humans',
        year: 2003,
        source: 'PubMed',
        summary: 'Study showing appetite-suppressing effects of PYY(3-36)',
        url: 'https://pubmed.ncbi.nlm.nih.gov/12915404/',
      },
    ],
    common_adverse_effects: 'Nausea (common in infusion studies)',
    contraindications: 'GI motility disorders (research caution)',
    recommended_dosage: 'Research infusion protocols; no approved dosing',
  },
  {
    id: '25',
    slug: 'angiotensin-1-7',
    name: 'Angiotensin (1-7)',
    regulatory_status: 'Research-only/Unapproved',
    summary: 'Counter-regulatory RAS peptide with vasodilatory, anti-fibrotic signals in models.',
    mechanism: 'Activates Mas receptor to oppose Ang II–mediated vasoconstriction and fibrosis; explored in cardio-renal-pulmonary research.',
    evidence: [
      {
        title: 'Angiotensin-(1-7) and the Mas receptor (review)',
        year: 2008,
        source: 'PubMed',
        summary: 'Review of Angiotensin-(1-7) protective effects',
        url: 'https://pubmed.ncbi.nlm.nih.gov/18391159/',
      },
    ],
    common_adverse_effects: 'Insufficient human safety data',
    contraindications: 'Unknown',
    recommended_dosage: 'Research protocols vary; no approved dosing',
  },
  {
    id: '26',
    slug: 'vip',
    name: 'VIP (Vasoactive Intestinal Peptide)',
    regulatory_status: 'Research-only/Unapproved',
    summary: 'Endogenous peptide with vasodilatory and anti-inflammatory actions; investigated in lung and immune research.',
    mechanism: 'Activates VPAC1/VPAC2 G-protein receptors, raising cAMP and relaxing smooth muscle while modulating cytokines.',
    evidence: [
      {
        title: 'VIP biology and therapeutic prospects (review)',
        year: 2011,
        source: 'PubMed',
        summary: 'Review of VIP biological functions and therapeutic potential',
        url: 'https://pubmed.ncbi.nlm.nih.gov/21947958/',
      },
    ],
    common_adverse_effects: 'Flushing, Headache (reported in physiology studies)',
    contraindications: 'Unknown',
    recommended_dosage: 'Research protocols vary; no approved dosing',
  },
  {
    id: '27',
    slug: 'pacap-38',
    name: 'PACAP-38',
    regulatory_status: 'Research-only/Unapproved',
    summary: 'Neuropeptide implicated in migraine provocation and neuroprotection research.',
    mechanism: 'Binds PAC1 and VPAC receptors to increase cAMP; induces vasodilation and CGRP-linked pathways relevant to headache biology.',
    evidence: [
      {
        title: 'PACAP and migraine induction in humans',
        year: 2017,
        source: 'PubMed',
        summary: 'Study on PACAP role in migraine induction',
        url: 'https://pubmed.ncbi.nlm.nih.gov/28153889/',
      },
    ],
    common_adverse_effects: 'Headache in provocation studies',
    contraindications: 'Migraine disorders (research caution)',
    recommended_dosage: 'Research protocols; not for therapeutic use',
  },
  {
    id: '28',
    slug: 'oxytocin',
    name: 'Oxytocin (research use)',
    regulatory_status: 'Compounded (not FDA-approved for behavioral indications)',
    summary: 'Endogenous peptide explored intranasally for social, stress, and feeding behaviors; obstetric use is distinct.',
    mechanism: 'Acts on oxytocin receptors in smooth muscle and CNS circuits that modulate social salience, bonding, and anxiety.',
    evidence: [
      {
        title: 'Intranasal oxytocin in human social cognition (review)',
        year: 2019,
        source: 'PubMed',
        summary: 'Review of intranasal oxytocin effects on social cognition',
        url: 'https://pubmed.ncbi.nlm.nih.gov/31279672/',
      },
    ],
    common_adverse_effects: 'Nasal irritation, Headache (reported)',
    contraindications: 'Pregnancy/lactation (context-dependent clinical cautions)',
    recommended_dosage: 'Research protocols vary; no approval for behavioral use',
  },
  {
    id: '29',
    slug: 'arginine-vasopressin',
    name: 'Arginine Vasopressin (AVP)',
    regulatory_status: 'Research-only/Unapproved',
    summary: 'Antidiuretic peptide used in physiology studies of water balance and vascular tone.',
    mechanism: 'Activates V2 receptors in kidney collecting ducts to increase water reabsorption; V1 receptors mediate vasoconstriction.',
    evidence: [
      {
        title: 'Vasopressin receptors and physiology (review)',
        year: 2001,
        source: 'PubMed',
        summary: 'Review of vasopressin receptor biology and physiology',
        url: 'https://pubmed.ncbi.nlm.nih.gov/11359618/',
      },
    ],
    common_adverse_effects: 'Headache, Nausea in research exposures',
    contraindications: 'Unknown',
    recommended_dosage: 'Research protocols only; controlled administration',
  },
  {
    id: '30',
    slug: 'afamelanotide',
    name: 'Afamelanotide (SCENESSE)',
    regulatory_status: 'FDA-approved',
    summary: 'Synthetic α-MSH analog approved in the US for erythropoietic protoporphyria (EPP) to increase pain-free light exposure.',
    mechanism: 'Agonizes MC1R to increase eumelanin, enhancing photoprotection and reducing phototoxic reactions in EPP.',
    evidence: [
      {
        title: 'FDA Approval Summary: Afamelanotide for EPP',
        year: 2020,
        source: 'PubMed',
        summary: 'FDA approval summary for afamelanotide in EPP treatment',
        url: 'https://pubmed.ncbi.nlm.nih.gov/32458570/',
      },
    ],
    common_adverse_effects: 'Nausea, Headache, Hyperpigmentation at implant site (reported)',
    contraindications: 'History of melanoma/atypical nevi (clinical caution)',
    recommended_dosage: 'Subcutaneous implant per FDA-approved protocol',
  },
  {
    id: '31',
    slug: 'thymopentin',
    name: 'Thymopentin (TP-5)',
    regulatory_status: 'Research-only/Unapproved',
    summary: 'Short peptide from thymopoietin studied for T-cell modulation and immune maturation.',
    mechanism: 'Mimics a thymopoietin domain to influence T-cell differentiation and function.',
    evidence: [
      {
        title: 'Thymopentin and immune modulation (review)',
        year: 2011,
        source: 'PubMed',
        summary: 'Review of thymopentin immunomodulatory properties',
        url: 'https://pubmed.ncbi.nlm.nih.gov/21910519/',
      },
    ],
    common_adverse_effects: 'Injection-site reactions reported in historical studies',
    contraindications: 'Unknown',
    recommended_dosage: 'Research protocols vary; no US approval',
  },
  {
    id: '32',
    slug: 'bradykinin',
    name: 'Bradykinin',
    regulatory_status: 'Research-only/Unapproved',
    summary: 'Inflammatory/vasodilatory peptide used to probe vascular permeability and pain pathways.',
    mechanism: 'Activates B2 (and B1 under inflammation) receptors causing vasodilation, increased permeability, and nociception.',
    evidence: [
      {
        title: 'Kallikrein–kinin system in health and disease (review)',
        year: 2001,
        source: 'PubMed',
        summary: 'Review of kallikrein-kinin system biology',
        url: 'https://pubmed.ncbi.nlm.nih.gov/11223758/',
      },
    ],
    common_adverse_effects: 'Pain, flushing in provocation models',
    contraindications: 'Unknown',
    recommended_dosage: 'Research provocation models only',
  },
  {
    id: '33',
    slug: 'endothelin-1',
    name: 'Endothelin-1 (ET-1)',
    regulatory_status: 'Research-only/Unapproved',
    summary: 'Potent vasoconstrictor peptide used in cardiovascular physiology and endothelial function studies.',
    mechanism: 'Activates ETA/ETB receptors on vascular smooth muscle and endothelium to regulate tone and remodeling.',
    evidence: [
      {
        title: 'Endothelin system in cardiovascular disease (review)',
        year: 2002,
        source: 'PubMed',
        summary: 'Review of endothelin system in cardiovascular pathophysiology',
        url: 'https://pubmed.ncbi.nlm.nih.gov/11997486/',
      },
    ],
    common_adverse_effects: 'Headache, BP changes in provocation models',
    contraindications: 'Unknown',
    recommended_dosage: 'Research provocation protocols only',
  },
  {
    id: '34',
    slug: 'urocortin-2',
    name: 'Urocortin-2',
    regulatory_status: 'Research-only/Unapproved',
    summary: 'Member of the corticotropin-releasing factor family studied for inotropy and vasodilation in heart failure research.',
    mechanism: 'Selectively activates CRF2 receptors, enhancing myocardial contractility and causing vasodilation in models.',
    evidence: [
      {
        title: 'Urocortin-2 in cardiac function (overview)',
        year: 2010,
        source: 'PubMed',
        summary: 'Overview of urocortin-2 cardiovascular effects',
        url: 'https://pubmed.ncbi.nlm.nih.gov/20451544/',
      },
    ],
    common_adverse_effects: 'Flushing, headache in small physiology studies',
    contraindications: 'Unknown',
    recommended_dosage: 'Research protocols only',
  },
  {
    id: '35',
    slug: 'aod-9604',
    name: 'AOD-9604',
    regulatory_status: 'Research-only/Unapproved',
    summary: 'C-terminal fragment of human growth hormone marketed online for weight loss claims; not FDA-approved.',
    mechanism: 'Proposed to influence adipocyte lipolysis pathways without classic GH receptor activity; most evidence is preclinical and heterogeneous.',
    evidence: [
      {
        title: 'FDA: Certain bulk drug substances may present significant safety risks',
        year: 2024,
        source: 'FDA',
        summary: 'FDA warning on compounded peptide safety risks',
        url: 'https://www.fda.gov/drugs/human-drug-compounding/certain-bulk-drug-substances-use-compounding-may-present-significant-safety-risks',
      },
      {
        title: 'GH fragments and metabolism (overview)',
        year: 2013,
        source: 'PubMed',
        summary: 'Overview of growth hormone fragments in metabolic research',
        url: 'https://pubmed.ncbi.nlm.nih.gov/24195643/',
      },
    ],
    common_adverse_effects: 'Unknown; non-standardized products raise identity and immunogenicity concerns',
    contraindications: 'Unknown safety; avoid assuming GH-class effects are absent',
    recommended_dosage: 'No approved dosing; research protocols vary',
  },
  {
    id: '36',
    slug: 'pnc-27',
    name: 'PNC-27',
    regulatory_status: 'Research-only/Unapproved',
    summary: 'Controversial experimental peptide reported to target tumor cell membranes in vitro; clinical evidence is limited.',
    mechanism: 'Designed to bind HDM2 on cancer cell membranes and disrupt mitochondrial integrity in preclinical models; selectivity in humans is unproven.',
    evidence: [
      {
        title: 'Peptide–mitochondrial interactions in cancer (review)',
        year: 2018,
        source: 'PubMed',
        summary: 'Review of peptide interactions with mitochondria in cancer research',
        url: 'https://pubmed.ncbi.nlm.nih.gov/30355731/',
      },
    ],
    common_adverse_effects: 'Unknown; not evaluated in rigorous clinical programs',
    contraindications: 'Do not infer anticancer benefit without trials',
    recommended_dosage: 'No established dosing; highly experimental',
  },
  {
    id: '37',
    slug: 'substance-p',
    name: 'Substance P',
    regulatory_status: 'Research-only/Unapproved',
    summary: 'Endogenous neuropeptide involved in pain transmission, neurogenic inflammation, and vasodilation; widely used in experimental models.',
    mechanism: 'Binds neurokinin-1 (NK1) receptors on neurons, endothelial cells, and immune cells, promoting nociception, vasodilation, and plasma extravasation.',
    evidence: [
      {
        title: 'Substance P and the NK1 receptor (review)',
        year: 2001,
        source: 'PubMed',
        summary: 'Review of Substance P and NK1 receptor biology',
        url: 'https://pubmed.ncbi.nlm.nih.gov/11207144/',
      },
    ],
    common_adverse_effects: 'Provokes pain/flush in provocation paradigms',
    contraindications: 'Research use only; not for therapeutic administration',
    recommended_dosage: 'Research provocation protocols only',
  },
  {
    id: '38',
    slug: 'galanin',
    name: 'Galanin',
    regulatory_status: 'Research-only/Unapproved',
    summary: 'Neuromodulatory peptide implicated in feeding, pain, mood, and neuroendocrine regulation; a versatile tool in systems neuroscience.',
    mechanism: 'Signals via GAL1/2/3 receptors, modulating neurotransmitter release and neuronal excitability in hypothalamic and limbic circuits.',
    evidence: [
      {
        title: 'Galanin systems in the brain (review)',
        year: 2012,
        source: 'PubMed',
        summary: 'Review of galanin neurobiology and functions',
        url: 'https://pubmed.ncbi.nlm.nih.gov/22713167/',
      },
    ],
    common_adverse_effects: 'Not a therapeutic entry; adverse effects are model-dependent',
    contraindications: 'Research context only',
    recommended_dosage: 'Research protocols only',
  },
  {
    id: '39',
    slug: 'angiotensin-ii',
    name: 'Angiotensin II',
    regulatory_status: 'Research-only/Unapproved',
    summary: 'Canonical RAS vasoconstrictor used to probe blood pressure control, renal perfusion, and baroreflex physiology.',
    mechanism: 'Binds AT1 receptors to induce vasoconstriction, aldosterone release, sodium retention, and sympathetic facilitation; AT2 actions may oppose some effects.',
    evidence: [
      {
        title: 'Renin–angiotensin system: physiology and pathophysiology (review)',
        year: 2007,
        source: 'PubMed',
        summary: 'Comprehensive review of RAS physiology',
        url: 'https://pubmed.ncbi.nlm.nih.gov/18083914/',
      },
    ],
    common_adverse_effects: 'Headache, BP elevation in provocation studies',
    contraindications: 'Hypertension/CV risk in non-research settings',
    recommended_dosage: 'Research provocation protocols only',
  },
  {
    id: '40',
    slug: 'gdf11-peptides',
    name: 'GDF11-related peptides',
    regulatory_status: 'Research-only/Unapproved',
    summary: 'Peptidic fragments associated with GDF11 signaling studied in aging and regeneration models; findings are controversial.',
    mechanism: 'Hypothesized modulation of SMAD/TGF-β pathways influencing neurogenesis and cardiac/skeletal muscle remodeling in animals.',
    evidence: [
      {
        title: 'GDF11 in aging and regeneration (perspective)',
        year: 2016,
        source: 'PubMed',
        summary: 'Perspective on GDF11 controversies in aging research',
        url: 'https://pubmed.ncbi.nlm.nih.gov/27452948/',
      },
    ],
    common_adverse_effects: 'Unknown; variable by construct',
    contraindications: 'Not a therapeutic; evidence is unsettled',
    recommended_dosage: 'Highly experimental; no established protocols',
  },
  {
    id: '41',
    slug: 'b7-33',
    name: 'B7-33',
    regulatory_status: 'Research-only/Unapproved',
    summary: 'Single-chain relaxin analog engineered to engage RXFP1 with reduced off-target effects; explored for anti-fibrotic signaling.',
    mechanism: 'Partial RXFP1 agonist activity reported in models, promoting anti-fibrotic and vasodilatory pathways while minimizing hypotension risk vs native relaxin.',
    evidence: [
      {
        title: 'B7-33, a relaxin-2 analog with anti-fibrotic actions',
        year: 2015,
        source: 'PubMed',
        summary: 'Study of B7-33 anti-fibrotic properties',
        url: 'https://pubmed.ncbi.nlm.nih.gov/25687646/',
      },
    ],
    common_adverse_effects: 'Unknown in humans',
    contraindications: 'Unknown',
    recommended_dosage: 'Research protocols only',
  },
  {
    id: '42',
    slug: 'palmitoyl-tripeptide-1',
    name: 'Palmitoyl Tripeptide-1 (Pal-GHK)',
    regulatory_status: 'Research-only/Unapproved',
    summary: 'Topical cosmetic peptide derived from GHK, coupled to palmitic acid to enhance skin penetration; used in anti-aging formulations.',
    mechanism: 'Proposed to signal fibroblasts to support collagen matrix maintenance and repair; evidence primarily cosmetic/preclinical.',
    evidence: [
      {
        title: 'Topical peptides in anti-aging: review',
        year: 2013,
        source: 'PubMed',
        summary: 'Review of topical anti-aging peptides',
        url: 'https://pubmed.ncbi.nlm.nih.gov/24301263/',
      },
    ],
    common_adverse_effects: 'Topical irritation possible, formulation-dependent',
    contraindications: 'Copper allergy not directly relevant here (parent GHK-Cu differs)',
    recommended_dosage: 'Topical application per cosmetic formulations',
  },
  {
    id: '43',
    slug: 'palmitoyl-tetrapeptide-7',
    name: 'Palmitoyl Tetrapeptide-7',
    regulatory_status: 'Research-only/Unapproved',
    summary: 'Cosmetic peptide reported to modulate inflammatory signaling in skin; often combined with Pal-Tripeptide-1.',
    mechanism: 'Proposed to reduce pro-inflammatory cytokine signaling in dermis; evidence base is mostly cosmetic/preclinical.',
    evidence: [
      {
        title: 'Anti-inflammatory cosmetic peptides (overview)',
        year: 2020,
        source: 'PubMed',
        summary: 'Overview of anti-inflammatory peptides in cosmetics',
        url: 'https://pubmed.ncbi.nlm.nih.gov/32036743/',
      },
    ],
    common_adverse_effects: 'Potential topical irritation depending on vehicle',
    contraindications: 'None specific; patch testing advisable in studies',
    recommended_dosage: 'Topical application per cosmetic formulations',
  },
  {
    id: '44',
    slug: 'palmitoyl-pentapeptide-4',
    name: 'Palmitoyl Pentapeptide-4 (Matrixyl)',
    regulatory_status: 'Research-only/Unapproved',
    summary: 'Widely cited cosmetic peptide claimed to support collagen renewal; used in anti-wrinkle formulations.',
    mechanism: 'Pentapeptide sequence derived from collagen fragments, proposed to signal ECM repair; palmitoylation improves topical delivery.',
    evidence: [
      {
        title: 'Topical anti-aging peptides: mechanisms and evidence',
        year: 2008,
        source: 'PubMed',
        summary: 'Study of topical anti-aging peptide mechanisms',
        url: 'https://pubmed.ncbi.nlm.nih.gov/18492053/',
      },
    ],
    common_adverse_effects: 'Topical irritation uncommon but possible',
    contraindications: 'None specific; cosmetic context',
    recommended_dosage: 'Topical application per cosmetic formulations',
  },
  {
    id: '45',
    slug: 'thymulin',
    name: 'Thymulin (Facteur Thymique Sérique)',
    regulatory_status: 'Research-only/Unapproved',
    summary: 'Historic thymic peptide studied for T-cell function and immune maturation; interest persists in basic immunology.',
    mechanism: 'Influences T-cell differentiation and thymic epithelial interactions; precise receptor pharmacology remains incompletely defined.',
    evidence: [
      {
        title: 'Thymic peptides and immune function (overview)',
        year: 2006,
        source: 'PubMed',
        summary: 'Overview of thymic peptides in immune regulation',
        url: 'https://pubmed.ncbi.nlm.nih.gov/17145131/',
      },
    ],
    common_adverse_effects: 'Unknown in modern clinical contexts',
    contraindications: 'Research context only',
    recommended_dosage: 'Research protocols vary; no US approval',
  },
  {
    id: '46',
    slug: 'carnosine',
    name: 'Carnosine',
    regulatory_status: 'Research-only/Unapproved',
    summary: 'Endogenous dipeptide concentrated in skeletal muscle and brain; studied for buffering and carbonyl-scavenging roles.',
    mechanism: 'Buffers intracellular pH during high-intensity activity and can scavenge reactive carbonyl species; interacts with metal ions.',
    evidence: [
      {
        title: 'Carnosine in exercise and aging (review)',
        year: 2016,
        source: 'PubMed',
        summary: 'Review of carnosine role in exercise and aging',
        url: 'https://pubmed.ncbi.nlm.nih.gov/26891120/',
      },
    ],
    common_adverse_effects: 'Oral/topical research generally well tolerated in small studies',
    contraindications: 'None specific in research contexts',
    recommended_dosage: 'Supplement/research dosing varies; not a drug',
  },
  {
    id: '47',
    slug: 'uroguanylin',
    name: 'Uroguanylin',
    regulatory_status: 'Research-only/Unapproved',
    summary: 'Endogenous intestinal peptide that activates guanylate cyclase-C (GC-C), regulating fluid/electrolyte transport and satiety circuits.',
    mechanism: 'Binds GC-C on intestinal epithelium to raise cGMP, promoting chloride/bicarbonate secretion; gut–brain signaling roles have been proposed.',
    evidence: [
      {
        title: 'Guanylin peptides and GC-C signaling (review)',
        year: 2012,
        source: 'PubMed',
        summary: 'Review of guanylin peptide family and GC-C signaling',
        url: 'https://pubmed.ncbi.nlm.nih.gov/22400328/',
      },
    ],
    common_adverse_effects: 'N/A in research catalog context',
    contraindications: 'Research context only',
    recommended_dosage: 'Research protocols only',
  },
  {
    id: '48',
    slug: 'obestatin',
    name: 'Obestatin',
    regulatory_status: 'Research-only/Unapproved',
    summary: 'Peptide encoded by the preproghrelin gene; early reports suggested appetite suppression, but findings are inconsistent.',
    mechanism: 'Proposed GPCR interactions remain debated; may counterbalance some ghrelin effects in certain models.',
    evidence: [
      {
        title: 'Obestatin biology: controversies and updates (review)',
        year: 2009,
        source: 'PubMed',
        summary: 'Review of obestatin biology and controversies',
        url: 'https://pubmed.ncbi.nlm.nih.gov/19457485/',
      },
    ],
    common_adverse_effects: 'N/A in research catalog',
    contraindications: 'Research context only',
    recommended_dosage: 'Research protocols only',
  },
  {
    id: '49',
    slug: 'nesfatin-1',
    name: 'Nesfatin-1',
    regulatory_status: 'Research-only/Unapproved',
    summary: 'Hypothalamic peptide implicated in satiety, stress responses, and glucose regulation; part of the expanding gut–brain axis map.',
    mechanism: 'Acts centrally to reduce food intake and modulate autonomic output; interacts with CRF and melanocortin pathways in models.',
    evidence: [
      {
        title: 'Nesfatin-1 and energy homeostasis (review)',
        year: 2011,
        source: 'PubMed',
        summary: 'Review of nesfatin-1 in energy homeostasis',
        url: 'https://pubmed.ncbi.nlm.nih.gov/21193022/',
      },
    ],
    common_adverse_effects: 'N/A in research catalog',
    contraindications: 'Research context only',
    recommended_dosage: 'Research protocols only',
  },
  {
    id: '50',
    slug: 'hbd-2',
    name: 'Human Beta-Defensin 2 (HBD-2)',
    regulatory_status: 'Research-only/Unapproved',
    summary: 'Epithelial antimicrobial peptide induced by infection and inflammation.',
    mechanism: 'Cationic β-sheet peptide that disrupts microbial membranes and signals via chemokine-like pathways to recruit immune cells.',
    evidence: [
      {
        title: 'Human defensins in host defense (review)',
        year: 2006,
        source: 'PubMed',
        summary: 'Review of human defensins in innate immunity',
        url: 'https://pubmed.ncbi.nlm.nih.gov/16424907/',
      },
    ],
    common_adverse_effects: 'N/A in catalog; lab-reagent context',
    contraindications: 'None in research use; inflammatory skin disease requires context in models',
    recommended_dosage: 'Research reagent; not for therapeutic use',
  },
  {
    id: '51',
    slug: 'hbd-3',
    name: 'Human Beta-Defensin 3 (HBD-3)',
    regulatory_status: 'Research-only/Unapproved',
    summary: 'Potent human defensin with broad Gram-positive/negative activity and immune signaling.',
    mechanism: 'Membrane-disruptive activity; can engage CCR6 and modulate Toll-like receptor pathways.',
    evidence: [
      {
        title: 'Beta-defensins: structure and function (review)',
        year: 2004,
        source: 'PubMed',
        summary: 'Review of beta-defensin structure and antimicrobial function',
        url: 'https://pubmed.ncbi.nlm.nih.gov/15310867/',
      },
    ],
    common_adverse_effects: 'N/A in catalog; reagent context',
    contraindications: 'Research context only',
    recommended_dosage: 'Research reagent; not for therapeutic use',
  },
  {
    id: '52',
    slug: 'hnp-1',
    name: 'Human Neutrophil Peptide-1 (HNP-1)',
    regulatory_status: 'Research-only/Unapproved',
    summary: 'Granule peptide from neutrophils involved in early antibacterial defense and immune crosstalk.',
    mechanism: 'Forms pores in microbial membranes and modulates cytokines, complement, and chemotaxis.',
    evidence: [
      {
        title: 'Alpha defensins in innate immunity (review)',
        year: 2004,
        source: 'PubMed',
        summary: 'Review of alpha-defensins in innate immune responses',
        url: 'https://pubmed.ncbi.nlm.nih.gov/15546664/',
      },
    ],
    common_adverse_effects: 'N/A; not a therapeutic entry',
    contraindications: 'Research context only',
    recommended_dosage: 'Research reagent only',
  },
  {
    id: '53',
    slug: 'dermcidin',
    name: 'Dermcidin (DCD-1L)',
    regulatory_status: 'Research-only/Unapproved',
    summary: 'Human sweat-gland peptide secreted onto skin that contributes to surface antimicrobial defense.',
    mechanism: 'Produces broad antimicrobial effects; unusually active in high-salt and variable pH environments typical of sweat.',
    evidence: [
      {
        title: 'Dermcidin: antimicrobial activity in sweat (original report)',
        year: 2002,
        source: 'PubMed',
        summary: 'Original study on dermcidin antimicrobial properties',
        url: 'https://pubmed.ncbi.nlm.nih.gov/12571363/',
      },
    ],
    common_adverse_effects: 'N/A (reagent)',
    contraindications: 'Research context only',
    recommended_dosage: 'Research reagent only',
  },
  {
    id: '54',
    slug: 'histatin-5',
    name: 'Histatin-5',
    regulatory_status: 'Research-only/Unapproved',
    summary: 'Salivary peptide important in oral antifungal defense, notably against Candida species.',
    mechanism: 'Binds fungal cell walls and internal targets, leading to ATP leakage and cell death; can bind metals.',
    evidence: [
      {
        title: 'Histatins: antimicrobial peptides of the oral cavity (review)',
        year: 2006,
        source: 'PubMed',
        summary: 'Review of histatin antimicrobial peptides in oral cavity',
        url: 'https://pubmed.ncbi.nlm.nih.gov/17113228/',
      },
    ],
    common_adverse_effects: 'N/A (reagent)',
    contraindications: 'Research context only',
    recommended_dosage: 'Research protocols only',
  },
  {
    id: '55',
    slug: 'pexiganan',
    name: 'Pexiganan (MSI-78)',
    regulatory_status: 'Research-only/Unapproved',
    summary: 'Synthetic AMP derived from frog magainins, studied topically for diabetic foot infection.',
    mechanism: 'Amphipathic α-helical peptide that disrupts bacterial membranes; broad Gram-positive/negative spectrum in vitro.',
    evidence: [
      {
        title: 'Pexiganan for infected diabetic foot ulcers: clinical data',
        year: 1999,
        source: 'PubMed',
        summary: 'Clinical study of pexiganan in diabetic foot infections',
        url: 'https://pubmed.ncbi.nlm.nih.gov/10428075/',
      },
    ],
    common_adverse_effects: 'Local irritation in studies',
    contraindications: 'Unknown',
    recommended_dosage: 'Topical application in research protocols',
  },
  {
    id: '56',
    slug: 'omiganan',
    name: 'Omiganan (CLS001)',
    regulatory_status: 'Research-only/Unapproved',
    summary: 'Cationic AMP investigated topically for catheter-site infection prevention and dermatologic conditions.',
    mechanism: 'Membrane permeabilization and modulation of microbial signaling; active against bacteria and some fungi.',
    evidence: [
      {
        title: 'Topical antimicrobial peptides: clinical experience (review)',
        year: 2013,
        source: 'PubMed',
        summary: 'Review of topical antimicrobial peptides in clinical trials',
        url: 'https://pubmed.ncbi.nlm.nih.gov/23394903/',
      },
    ],
    common_adverse_effects: 'Local irritation reported',
    contraindications: 'Unknown',
    recommended_dosage: 'Topical application in research protocols',
  },
  {
    id: '57',
    slug: 'setmelanotide',
    name: 'Setmelanotide (IMCIVREE)',
    regulatory_status: 'FDA-approved',
    summary: 'Peptide agonist for rare genetic obesity due to POMC, PCSK1, or LEPR deficiency, and Bardet–Biedl syndrome.',
    mechanism: 'Selectively activates MC4R in hypothalamic pathways controlling appetite and energy expenditure.',
    evidence: [
      {
        title: 'FDA Approval Summary: Setmelanotide in rare genetic obesity',
        year: 2022,
        source: 'PubMed',
        summary: 'FDA approval summary for setmelanotide',
        url: 'https://pubmed.ncbi.nlm.nih.gov/35403460/',
      },
    ],
    common_adverse_effects: 'Hyperpigmentation, injection-site reactions, nausea (reported)',
    contraindications: 'History of melanoma/atypical nevi warrants caution',
    recommended_dosage: 'Per FDA-approved protocol for genetic obesity',
  },
  {
    id: '58',
    slug: 'teduglutide',
    name: 'Teduglutide (Gattex)',
    regulatory_status: 'FDA-approved',
    summary: 'Intestinal trophic peptide analog approved to reduce parenteral support in adults and children with short bowel syndrome.',
    mechanism: 'Activates GLP-2 receptors to enhance mucosal growth, increase absorption, and improve intestinal barrier function.',
    evidence: [
      {
        title: 'Gattex (teduglutide) prescribing information',
        year: 2019,
        source: 'FDA',
        summary: 'FDA prescribing information for teduglutide',
        url: 'https://www.accessdata.fda.gov/drugsatfda_docs/label/2019/203441s010lbl.pdf',
      },
    ],
    common_adverse_effects: 'Abdominal pain, distension, nausea, potential polyp growth (requires surveillance)',
    contraindications: 'Active GI malignancy (clinical caution)',
    recommended_dosage: 'Per FDA-approved protocol for short bowel syndrome',
  },
  {
    id: '59',
    slug: 'teriparatide',
    name: 'Teriparatide (Forteo)',
    regulatory_status: 'FDA-approved',
    summary: 'Recombinant PTH(1-34) used for osteoporosis in high-risk adults; stimulates bone formation.',
    mechanism: 'Intermittent PTH receptor activation favors osteoblast activity and new bone formation, contrasting with chronic hyperparathyroidism effects.',
    evidence: [
      {
        title: 'Teriparatide efficacy and safety (review)',
        year: 2009,
        source: 'PubMed',
        summary: 'Review of teriparatide clinical efficacy and safety',
        url: 'https://pubmed.ncbi.nlm.nih.gov/19093923/',
      },
    ],
    common_adverse_effects: 'Nausea, dizziness; historical osteosarcoma signal in rats prompted duration limits',
    contraindications: 'Bone malignancy or unexplained elevations in ALP (clinical caution)',
    recommended_dosage: 'Per FDA-approved protocol for osteoporosis',
  },
  {
    id: '60',
    slug: 'abaloparatide',
    name: 'Abaloparatide (Tymlos)',
    regulatory_status: 'FDA-approved',
    summary: 'Analog of parathyroid hormone–related peptide approved for osteoporosis in postmenopausal women at high fracture risk.',
    mechanism: 'Preferentially engages PTH1 receptor conformations that promote anabolic bone formation with potentially different signaling bias vs PTH(1-34).',
    evidence: [
      {
        title: 'Abaloparatide pivotal trial (ACTIVE)',
        year: 2016,
        source: 'PubMed',
        summary: 'ACTIVE trial results for abaloparatide in osteoporosis',
        url: 'https://pubmed.ncbi.nlm.nih.gov/27074024/',
      },
    ],
    common_adverse_effects: 'Dizziness, nausea; orthostatic symptoms reported',
    contraindications: 'Bone malignancy risk considerations similar to PTH-class',
    recommended_dosage: 'Per FDA-approved protocol for osteoporosis',
  },
  {
    id: '61',
    slug: 'linaclotide',
    name: 'Linaclotide (Linzess)',
    regulatory_status: 'FDA-approved',
    summary: 'Intestinal guanylate cyclase-C agonist approved for IBS-C and chronic idiopathic constipation.',
    mechanism: 'Binds GC-C on intestinal epithelium to raise cGMP, increasing chloride/bicarbonate secretion, softening stool, and reducing visceral pain via neuronal cGMP.',
    evidence: [
      {
        title: 'Linaclotide clinical pharmacology and trials (review)',
        year: 2013,
        source: 'PubMed',
        summary: 'Review of linaclotide pharmacology and clinical trials',
        url: 'https://pubmed.ncbi.nlm.nih.gov/23814675/',
      },
    ],
    common_adverse_effects: 'Diarrhea is most common; dehydration risk in pediatrics (boxed warning)',
    contraindications: 'Pediatric patients under label-specified ages (safety warning)',
    recommended_dosage: 'Per FDA-approved protocol for IBS-C/CIC',
  },
  {
    id: '62',
    slug: 'plecanatide',
    name: 'Plecanatide (Trulance)',
    regulatory_status: 'FDA-approved',
    summary: 'Uroguanylin-inspired peptide approved for CIC and IBS-C with pH-tuned activation in the small intestine.',
    mechanism: 'Activates GC-C to increase cGMP and intestinal fluid; designed to be active at near-neutral pH, echoing uroguanylin physiology.',
    evidence: [
      {
        title: 'Plecanatide for CIC/IBS-C: efficacy and safety',
        year: 2019,
        source: 'PubMed',
        summary: 'Study of plecanatide efficacy and safety',
        url: 'https://pubmed.ncbi.nlm.nih.gov/30775835/',
      },
    ],
    common_adverse_effects: 'Diarrhea most common; pediatric warning similar to class',
    contraindications: 'Pediatric age groups per label',
    recommended_dosage: 'Per FDA-approved protocol for CIC/IBS-C',
  },
  {
    id: '63',
    slug: 'foxy-5',
    name: 'Foxy-5',
    regulatory_status: 'Research-only/Unapproved',
    summary: 'Peptidic mimetic of Wnt5a signaling studied in oncology for effects on migration and differentiation.',
    mechanism: 'Engages non-canonical Wnt signaling to influence cell polarity, motility, and EMT-related pathways.',
    evidence: [
      {
        title: 'Non-canonical Wnt signaling in cancer (review)',
        year: 2017,
        source: 'PubMed',
        summary: 'Review of non-canonical Wnt signaling in cancer biology',
        url: 'https://pubmed.ncbi.nlm.nih.gov/28483303/',
      },
    ],
    common_adverse_effects: 'Unknown in humans',
    contraindications: 'Unknown',
    recommended_dosage: 'Highly experimental; no established protocols',
  },
  {
    id: '64',
    slug: 'oxytomodulin',
    name: 'Oxytomodulin',
    regulatory_status: 'Research-only/Unapproved',
    summary: 'Endogenous gut peptide with dual GLP-1 and glucagon receptor activity explored in appetite and energy expenditure research.',
    mechanism: 'Co-agonism of GLP-1 and glucagon receptors reduces intake and may raise energy expenditure in models.',
    evidence: [
      {
        title: 'Oxytomodulin and energy balance (human studies)',
        year: 2003,
        source: 'PubMed',
        summary: 'Study of oxytomodulin effects on energy balance',
        url: 'https://pubmed.ncbi.nlm.nih.gov/12915404/',
      },
    ],
    common_adverse_effects: 'Nausea in infusion studies',
    contraindications: 'Research context only',
    recommended_dosage: 'Research protocols only',
  },
  {
    id: '65',
    slug: 'retatrutide',
    name: 'Retatrutide (LY3437943)',
    regulatory_status: 'Research-only/Unapproved',
    summary: 'Investigational triple agonist designed to co-activate GIP, GLP-1, and glucagon receptors for weight and metabolic endpoints.',
    mechanism: 'Balanced co-agonism aims to combine GLP-1 satiety/glycemia control, GIP insulinotropic effects, and glucagon-mediated energy expenditure and lipid mobilization.',
    evidence: [
      {
        title: 'Triple-agonist incretin pharmacology (overview)',
        year: 2023,
        source: 'PubMed',
        summary: 'Overview of triple-agonist incretin approaches',
        url: 'https://pubmed.ncbi.nlm.nih.gov/36610641/',
      },
    ],
    common_adverse_effects: 'Class-typical GI effects in trials (nausea, vomiting); glucagon activity may affect heart rate/metabolism',
    contraindications: 'Personal/family history of medullary thyroid carcinoma/MEN2 (class caution); pancreatitis history (class caution)',
    recommended_dosage: 'Clinical trial protocols; not yet approved',
  },
  {
    id: '66',
    slug: 'anp',
    name: 'Atrial Natriuretic Peptide (ANP)',
    regulatory_status: 'Research-only/Unapproved',
    summary: 'Endogenous cardiac peptide that promotes natriuresis, vasodilation, and RAAS suppression.',
    mechanism: 'Activates guanylate cyclase-A (NPR-A), elevating cGMP to relax vascular smooth muscle and increase renal sodium excretion.',
    evidence: [
      {
        title: 'Natriuretic peptides and cGMP signaling (review)',
        year: 2012,
        source: 'PubMed',
        summary: 'Review of natriuretic peptides and signaling',
        url: 'https://pubmed.ncbi.nlm.nih.gov/22335713/',
      },
    ],
    common_adverse_effects: 'Hypotension in provocation models',
    contraindications: 'Research context only',
    recommended_dosage: 'Research protocols only',
  },
  {
    id: '67',
    slug: 'nesiritide',
    name: 'Nesiritide (Natrecor)',
    regulatory_status: 'FDA-approved',
    summary: 'Recombinant BNP historically used IV for acute decompensated heart failure; clinical use declined with mixed outcome data.',
    mechanism: 'Activates NPR-A to raise cGMP, causing venodilation/diuresis and reduced cardiac filling pressures.',
    evidence: [
      {
        title: 'Nesiritide in acute HF: evidence summary',
        year: 2011,
        source: 'PubMed',
        summary: 'Evidence summary for nesiritide in heart failure',
        url: 'https://pubmed.ncbi.nlm.nih.gov/21751411/',
      },
    ],
    common_adverse_effects: 'Hypotension, renal function shifts',
    contraindications: 'Symptomatic hypotension',
    recommended_dosage: 'Per FDA-approved protocol for acute heart failure',
  },
  {
    id: '68',
    slug: 'vosoritide',
    name: 'Vosoritide (BMN 111)',
    regulatory_status: 'FDA-approved',
    summary: 'Engineered CNP analog for children with achondroplasia to promote endochondral bone growth.',
    mechanism: 'Stimulates NPR-B/cGMP signaling in growth plate chondrocytes, counterbalancing overactive FGFR3 signaling in achondroplasia.',
    evidence: [
      {
        title: 'Vosoritide trial in achondroplasia',
        year: 2021,
        source: 'PubMed',
        summary: 'Clinical trial results for vosoritide in achondroplasia',
        url: 'https://pubmed.ncbi.nlm.nih.gov/34758553/',
      },
    ],
    common_adverse_effects: 'Injection-site reactions, hypotension',
    contraindications: 'Unknown',
    recommended_dosage: 'Per FDA-approved protocol for achondroplasia',
  },
  {
    id: '69',
    slug: 'calcitonin-salmon',
    name: 'Calcitonin (salmon)',
    regulatory_status: 'FDA-approved',
    summary: 'Peptide for Paget disease and (historically) osteoporosis; modern use is limited.',
    mechanism: 'Activates calcitonin receptors to decrease osteoclast activity and reduce bone resorption; also analgesic effects in some pain syndromes.',
    evidence: [
      {
        title: 'Calcitonin clinical use and limitations (review)',
        year: 2013,
        source: 'PubMed',
        summary: 'Review of calcitonin clinical applications',
        url: 'https://pubmed.ncbi.nlm.nih.gov/23877076/',
      },
    ],
    common_adverse_effects: 'Nausea, flushing, rhinitis (nasal)',
    contraindications: 'Unknown',
    recommended_dosage: 'Per FDA-approved protocol for Paget disease',
  },
  {
    id: '70',
    slug: 'cgrp',
    name: 'Calcitonin Gene-Related Peptide (CGRP)',
    regulatory_status: 'Research-only/Unapproved',
    summary: 'Potent vasodilator implicated in migraine pathophysiology; used in human provocation models.',
    mechanism: 'Activates CGRP receptors on vascular and neural targets, increasing cAMP and promoting vasodilation and nociceptive signaling.',
    evidence: [
      {
        title: 'CGRP in migraine (review)',
        year: 2019,
        source: 'PubMed',
        summary: 'Review of CGRP role in migraine pathophysiology',
        url: 'https://pubmed.ncbi.nlm.nih.gov/31177888/',
      },
    ],
    common_adverse_effects: 'Headache in provocation studies',
    contraindications: 'Research context only',
    recommended_dosage: 'Research provocation protocols only',
  },
  {
    id: '71',
    slug: 'cck-8',
    name: 'Cholecystokinin Octapeptide (CCK-8)',
    regulatory_status: 'Research-only/Unapproved',
    summary: 'Classic satiety peptide used to study gallbladder contraction, pancreatic secretion, and appetite regulation.',
    mechanism: 'Activates CCK-A/B receptors, stimulating gallbladder and pancreatic enzyme secretion and signaling satiety via vagal/CNS pathways.',
    evidence: [
      {
        title: 'CCK physiology and appetite (review)',
        year: 2011,
        source: 'PubMed',
        summary: 'Review of CCK in appetite and digestive physiology',
        url: 'https://pubmed.ncbi.nlm.nih.gov/22099672/',
      },
    ],
    common_adverse_effects: 'Abdominal cramping in provocation studies',
    contraindications: 'Research context only',
    recommended_dosage: 'Research protocols only',
  },
  {
    id: '72',
    slug: 'grp',
    name: 'Gastrin-Releasing Peptide (GRP)',
    regulatory_status: 'Research-only/Unapproved',
    summary: 'Neuropeptide that stimulates gastrin release and modulates satiety and stress circuits.',
    mechanism: 'Binds GRP receptors to influence gastric acid secretion, pancreatic function, and CNS behaviors.',
    evidence: [
      {
        title: 'GRP/GRPR in physiology and cancer (review)',
        year: 2011,
        source: 'PubMed',
        summary: 'Review of GRP receptor biology and applications',
        url: 'https://pubmed.ncbi.nlm.nih.gov/22142605/',
      },
    ],
    common_adverse_effects: 'Research context; not administered therapeutically',
    contraindications: 'Research context only',
    recommended_dosage: 'Research protocols only',
  },
  {
    id: '73',
    slug: 'npy',
    name: 'Neuropeptide Y (NPY)',
    regulatory_status: 'Research-only/Unapproved',
    summary: 'Abundant CNS peptide regulating appetite, stress resilience, vasomotion, and pain modulation.',
    mechanism: 'Acts at Y1/Y2/Y5 receptors to influence feeding behavior, anxiety circuits, and sympathetic activity.',
    evidence: [
      {
        title: 'Neuropeptide Y in emotion and energy balance (review)',
        year: 2015,
        source: 'PubMed',
        summary: 'Review of NPY in emotion regulation and energy balance',
        url: 'https://pubmed.ncbi.nlm.nih.gov/25870535/',
      },
    ],
    common_adverse_effects: 'Research context; not administered therapeutically',
    contraindications: 'Research context only',
    recommended_dosage: 'Research protocols only',
  },
  {
    id: '74',
    slug: 'cart-peptide',
    name: 'CART Peptide',
    regulatory_status: 'Research-only/Unapproved',
    summary: 'Hypothalamic peptide implicated in satiety, reward, and stress responses.',
    mechanism: 'Modulates mesolimbic reward and hypothalamic feeding circuits; receptor pharmacology is still being clarified.',
    evidence: [
      {
        title: 'CART peptides in appetite and reward (review)',
        year: 2012,
        source: 'PubMed',
        summary: 'Review of CART peptides in appetite and reward pathways',
        url: 'https://pubmed.ncbi.nlm.nih.gov/22421562/',
      },
    ],
    common_adverse_effects: 'Research context; not administered therapeutically',
    contraindications: 'Research context only',
    recommended_dosage: 'Research protocols only',
  },
  {
    id: '75',
    slug: 'glucagon',
    name: 'Glucagon (research entry)',
    regulatory_status: 'FDA-approved (therapeutic forms exist for severe hypoglycemia)',
    summary: 'Endogenous counter-regulatory hormone that raises blood glucose and influences lipid metabolism; pivotal in energy homeostasis.',
    mechanism: 'Activates hepatic glucagon receptors to stimulate glycogenolysis, gluconeogenesis, and lipolysis; increases energy expenditure.',
    evidence: [
      {
        title: 'Glucagon physiology and therapeutics (review)',
        year: 2018,
        source: 'PubMed',
        summary: 'Review of glucagon physiology and therapeutic applications',
        url: 'https://pubmed.ncbi.nlm.nih.gov/29500308/',
      },
    ],
    common_adverse_effects: 'Nausea in provocation/therapy settings',
    contraindications: 'Unknown',
    recommended_dosage: 'Emergency use for severe hypoglycemia per FDA protocols',
  },
  {
    id: '76',
    slug: 'dulaglutide',
    name: 'Dulaglutide (Trulicity)',
    regulatory_status: 'FDA-approved',
    summary: 'Long-acting GLP-1 RA for type 2 diabetes with cardiovascular outcome data.',
    mechanism: 'Sustained GLP-1 receptor activation improves glucose-dependent insulin secretion, slows gastric emptying, and reduces appetite.',
    evidence: [
      {
        title: 'Dulaglutide clinical outcomes (REWIND)',
        year: 2019,
        source: 'PubMed',
        summary: 'REWIND trial cardiovascular outcomes for dulaglutide',
        url: 'https://pubmed.ncbi.nlm.nih.gov/31189511/',
      },
    ],
    common_adverse_effects: 'Nausea, diarrhea; gallbladder disease risk',
    contraindications: 'MTC/MEN2 history; pancreatitis history (class caution)',
    recommended_dosage: 'Per FDA-approved protocol for type 2 diabetes',
  },
  {
    id: '77',
    slug: 'lixisenatide',
    name: 'Lixisenatide (Adlyxin)',
    regulatory_status: 'FDA-approved',
    summary: 'Once-daily GLP-1 RA for type 2 diabetes; often discussed in fixed-ratio combos with basal insulin.',
    mechanism: 'GLP-1 receptor activation to enhance glucose-dependent insulin secretion and delay gastric emptying.',
    evidence: [
      {
        title: 'Lixisenatide efficacy and safety (review)',
        year: 2015,
        source: 'PubMed',
        summary: 'Review of lixisenatide clinical efficacy and safety',
        url: 'https://pubmed.ncbi.nlm.nih.gov/26453131/',
      },
    ],
    common_adverse_effects: 'Nausea, vomiting',
    contraindications: 'MTC/MEN2 history; pancreatitis history (class caution)',
    recommended_dosage: 'Per FDA-approved protocol for type 2 diabetes',
  },
  {
    id: '78',
    slug: 'ghrelin',
    name: 'Ghrelin (acyl-ghrelin)',
    regulatory_status: 'Research-only/Unapproved',
    summary: 'Endogenous hunger hormone that also modulates GH release, glucose homeostasis, and reward pathways.',
    mechanism: 'Activates GHSR-1a; requires octanoylation for receptor binding; increases appetite, GH pulses, and GI motility.',
    evidence: [
      {
        title: 'Ghrelin biology and clinical implications (review)',
        year: 2018,
        source: 'PubMed',
        summary: 'Review of ghrelin biology and clinical implications',
        url: 'https://pubmed.ncbi.nlm.nih.gov/29469313/',
      },
    ],
    common_adverse_effects: 'Hunger in provocation studies',
    contraindications: 'Research context only',
    recommended_dosage: 'Research protocols only',
  },
  {
    id: '79',
    slug: 'kisspeptin-54',
    name: 'Kisspeptin-54',
    regulatory_status: 'Research-only/Unapproved',
    summary: 'Longer kisspeptin fragment used to stimulate GnRH/LH axis in human physiology studies.',
    mechanism: 'Activates KISS1R on GnRH neurons, eliciting LH/FSH release; longer fragment offers different kinetics vs KP-10.',
    evidence: [
      {
        title: 'Human kisspeptin infusion studies',
        year: 2007,
        source: 'PubMed',
        summary: 'Study of kisspeptin infusion effects on reproductive hormones',
        url: 'https://pubmed.ncbi.nlm.nih.gov/17997633/',
      },
    ],
    common_adverse_effects: 'Flushing, transient nausea',
    contraindications: 'Research context only',
    recommended_dosage: 'Research protocols only',
  },
  {
    id: '80',
    slug: 'orexin-a',
    name: 'Orexin-A (Hypocretin-1)',
    regulatory_status: 'Research-only/Unapproved',
    summary: 'Endogenous hypothalamic peptide essential for wakefulness stability, reward, and energy balance; loss of orexin neurons causes narcolepsy with cataplexy.',
    mechanism: 'Binds orexin receptors OX1R and OX2R to excite monoaminergic/cholinergic arousal networks and modulate reward/autonomic output.',
    evidence: [
      {
        title: 'Orexin/hypocretin system and arousal (review)',
        year: 2011,
        source: 'PubMed',
        summary: 'Review of orexin system in arousal and sleep regulation',
        url: 'https://pubmed.ncbi.nlm.nih.gov/21501697/',
      },
    ],
    common_adverse_effects: 'Research context; not administered therapeutically',
    contraindications: 'Research context only',
    recommended_dosage: 'Research protocols only',
  },
  {
    id: '81',
    slug: 'orexin-b',
    name: 'Orexin-B (Hypocretin-2)',
    regulatory_status: 'Research-only/Unapproved',
    summary: 'Partner peptide to orexin-A with overlapping but distinct receptor preferences and physiological roles.',
    mechanism: 'Preferentially activates OX2R (also binds OX1R), reinforcing wake drive, REM suppression, and autonomic/metabolic outputs.',
    evidence: [
      {
        title: 'Orexin receptor biology (overview)',
        year: 2010,
        source: 'PubMed',
        summary: 'Overview of orexin receptor pharmacology',
        url: 'https://pubmed.ncbi.nlm.nih.gov/20097222/',
      },
    ],
    common_adverse_effects: 'Research context; not administered therapeutically',
    contraindications: 'Research context only',
    recommended_dosage: 'Research protocols only',
  },
  {
    id: '82',
    slug: 'beta-endorphin',
    name: 'β-Endorphin',
    regulatory_status: 'Research-only/Unapproved',
    summary: 'POMC-derived opioid peptide involved in analgesia, stress response, and reward; acts primarily at μ-opioid receptors.',
    mechanism: 'Activates MOR (μ-opioid receptors) to inhibit nociceptive transmission and modulate dopaminergic reward pathways.',
    evidence: [
      {
        title: 'Endogenous opioids: physiology and behavior (review)',
        year: 2011,
        source: 'PubMed',
        summary: 'Review of endogenous opioid systems',
        url: 'https://pubmed.ncbi.nlm.nih.gov/21986472/',
      },
    ],
    common_adverse_effects: 'Research context; not administered therapeutically',
    contraindications: 'Research context only',
    recommended_dosage: 'Research protocols only',
  },
  {
    id: '83',
    slug: 'met-enkephalin',
    name: 'Met-Enkephalin',
    regulatory_status: 'Research-only/Unapproved',
    summary: 'Pentapeptide opioid transmitter enriched in CNS circuits for pain modulation and affect.',
    mechanism: 'Preferentially activates δ-opioid receptors (also μ), inhibiting neurotransmitter release and nociceptive signaling.',
    evidence: [
      {
        title: 'Enkephalinergic modulation of pain (review)',
        year: 2011,
        source: 'PubMed',
        summary: 'Review of enkephalin systems in pain modulation',
        url: 'https://pubmed.ncbi.nlm.nih.gov/21576136/',
      },
    ],
    common_adverse_effects: 'Research context; not administered therapeutically',
    contraindications: 'Research context only',
    recommended_dosage: 'Research protocols only',
  },
  {
    id: '84',
    slug: 'dynorphin-a',
    name: 'Dynorphin A (1-17)',
    regulatory_status: 'Research-only/Unapproved',
    summary: 'Kappa-preferring opioid peptide implicated in stress dysphoria, analgesia, and negative affect.',
    mechanism: 'Activates κ-opioid receptors (KOR), producing analgesia but also dysphoria/aversive states via mesolimbic modulation.',
    evidence: [
      {
        title: 'Dynorphin–KOR in stress and addiction (review)',
        year: 2015,
        source: 'PubMed',
        summary: 'Review of dynorphin-KOR system in stress and addiction',
        url: 'https://pubmed.ncbi.nlm.nih.gov/25770799/',
      },
    ],
    common_adverse_effects: 'Research context; not administered therapeutically',
    contraindications: 'Research context only',
    recommended_dosage: 'Research protocols only',
  },
  {
    id: '85',
    slug: 'nociceptin',
    name: 'Nociceptin/Orphanin FQ (N/OFQ)',
    regulatory_status: 'Research-only/Unapproved',
    summary: 'Opioid-like peptide with distinct receptor (NOP) that modulates pain, stress, and reward with context-dependent effects.',
    mechanism: 'Binds NOP receptor (distinct from μ/δ/κ) to regulate neurotransmission; can be anti- or pro-nociceptive depending on site.',
    evidence: [
      {
        title: 'Nociceptin/OFQ system overview',
        year: 2011,
        source: 'PubMed',
        summary: 'Overview of nociceptin/OFQ system biology',
        url: 'https://pubmed.ncbi.nlm.nih.gov/21971049/',
      },
    ],
    common_adverse_effects: 'Research context; not administered therapeutically',
    contraindications: 'Research context only',
    recommended_dosage: 'Research protocols only',
  },
  {
    id: '86',
    slug: 'neurotensin',
    name: 'Neurotensin',
    regulatory_status: 'Research-only/Unapproved',
    summary: 'Triple-domain peptide involved in pain modulation, thermoregulation, dopaminergic signaling, and gut motility.',
    mechanism: 'Acts on NTSR1/NTSR2 GPCRs; modulates dopamine pathways and spinal nociception; peripheral effects include GI motility.',
    evidence: [
      {
        title: 'Neurotensin biology and receptors (review)',
        year: 2010,
        source: 'PubMed',
        summary: 'Review of neurotensin receptor biology',
        url: 'https://pubmed.ncbi.nlm.nih.gov/20869990/',
      },
    ],
    common_adverse_effects: 'Research context; not administered therapeutically',
    contraindications: 'Research context only',
    recommended_dosage: 'Research protocols only',
  },
  {
    id: '87',
    slug: 'nps',
    name: 'Neuropeptide S (NPS)',
    regulatory_status: 'Research-only/Unapproved',
    summary: 'Brainstem-origin peptide that produces wakefulness and anxiolysis, an unusual combination in arousal pharmacology.',
    mechanism: 'Activates NPSR1 (GPCR) to promote arousal while reducing anxiety-like behavior in rodent models.',
    evidence: [
      {
        title: 'Neuropeptide S and arousal/anxiety (review)',
        year: 2010,
        source: 'PubMed',
        summary: 'Review of NPS in arousal and anxiety regulation',
        url: 'https://pubmed.ncbi.nlm.nih.gov/20122999/',
      },
    ],
    common_adverse_effects: 'Research context; not administered therapeutically',
    contraindications: 'Research context only',
    recommended_dosage: 'Research protocols only',
  },
  {
    id: '88',
    slug: 'bombesin',
    name: 'Bombesin',
    regulatory_status: 'Research-only/Unapproved',
    summary: 'Frog-derived peptide that inspired discovery of mammalian GRP; used as a tool for GRPR imaging/targeting.',
    mechanism: 'Agonizes GRP receptors influencing gastric secretion, satiety, and CNS behaviors; radiolabeled analogs aid tumor imaging.',
    evidence: [
      {
        title: 'Bombesin/GRP systems and cancer imaging (review)',
        year: 2012,
        source: 'PubMed',
        summary: 'Review of bombesin receptor systems in imaging',
        url: 'https://pubmed.ncbi.nlm.nih.gov/22313643/',
      },
    ],
    common_adverse_effects: 'Research context; not administered therapeutically',
    contraindications: 'Research context only',
    recommended_dosage: 'Research protocols only',
  },
  {
    id: '89',
    slug: 'secretin',
    name: 'Secretin (native)',
    regulatory_status: 'Research-only/Unapproved (diagnostic formulations exist)',
    summary: 'Duodenal peptide that stimulates pancreatic bicarbonate secretion and modulates gastric acid; classic physiology peptide.',
    mechanism: 'Activates secretin receptors on pancreatic ductal cells to raise cAMP and bicarbonate secretion; influences gastric/duodenal motility.',
    evidence: [
      {
        title: 'Secretin physiology and clinical uses (review)',
        year: 2006,
        source: 'PubMed',
        summary: 'Review of secretin physiology and diagnostic uses',
        url: 'https://pubmed.ncbi.nlm.nih.gov/16431821/',
      },
    ],
    common_adverse_effects: 'Research context; diagnostic use well-tolerated',
    contraindications: 'Research/diagnostic context',
    recommended_dosage: 'Diagnostic protocols per clinical use',
  },
  {
    id: '90',
    slug: 'gastrin',
    name: 'Gastrin (native)',
    regulatory_status: 'Research-only/Unapproved',
    summary: 'Antral peptide that stimulates gastric acid secretion and mucosal growth via CCK-B receptors.',
    mechanism: 'Binds CCK-B receptors on parietal cells and ECL cells to enhance acid output and histamine release.',
    evidence: [
      {
        title: 'Gastrin biology and pathology (review)',
        year: 2005,
        source: 'PubMed',
        summary: 'Review of gastrin in digestive physiology',
        url: 'https://pubmed.ncbi.nlm.nih.gov/16027035/',
      },
    ],
    common_adverse_effects: 'Research context; not administered therapeutically',
    contraindications: 'Research context only',
    recommended_dosage: 'Research protocols only',
  },
  {
    id: '91',
    slug: 'gip',
    name: 'GIP (Glucose-dependent Insulinotropic Polypeptide)',
    regulatory_status: 'Research-only/Unapproved',
    summary: 'Duodenal/jejunal K-cell peptide that enhances glucose-stimulated insulin secretion; co-targeted in modern dual agonists.',
    mechanism: 'Binds GIP receptors on β-cells to potentiate insulin release; has adipose and CNS effects in models.',
    evidence: [
      {
        title: 'GIP physiology and therapeutic implications (review)',
        year: 2019,
        source: 'PubMed',
        summary: 'Review of GIP in metabolic physiology',
        url: 'https://pubmed.ncbi.nlm.nih.gov/30779629/',
      },
    ],
    common_adverse_effects: 'Research context; not administered therapeutically',
    contraindications: 'Research context only',
    recommended_dosage: 'Research protocols only',
  },
  {
    id: '92',
    slug: 'glp-2',
    name: 'GLP-2 (Glucagon-like Peptide-2)',
    regulatory_status: 'Research-only/Unapproved (analog approved: teduglutide)',
    summary: 'Proglucagon-derived peptide that promotes intestinal growth and barrier function; therapeutic impact realized via stable analogs.',
    mechanism: 'Activates GLP-2R on enteric neurons and epithelium to enhance mucosal growth, absorption, and barrier integrity.',
    evidence: [
      {
        title: 'GLP-2 biology and therapy (review)',
        year: 2017,
        source: 'PubMed',
        summary: 'Review of GLP-2 biology and therapeutic applications',
        url: 'https://pubmed.ncbi.nlm.nih.gov/28178576/',
      },
    ],
    common_adverse_effects: 'Research context; analog (teduglutide) has known profile',
    contraindications: 'Research context only',
    recommended_dosage: 'Research protocols only; see teduglutide for approved analog',
  },
  {
    id: '93',
    slug: 'leptin',
    name: 'Leptin (native)',
    regulatory_status: 'Research-only/Unapproved (for general obesity); analog approved for rare deficiency',
    summary: 'Adipocyte-derived hormone that signals energy stores to the hypothalamus to regulate appetite and metabolism.',
    mechanism: 'Binds leptin receptors (Ob-Rb) in hypothalamus to reduce food intake and increase energy expenditure; widespread peripheral actions.',
    evidence: [
      {
        title: 'Leptin and the regulation of body weight (review)',
        year: 2001,
        source: 'PubMed',
        summary: 'Foundational review of leptin in energy balance',
        url: 'https://pubmed.ncbi.nlm.nih.gov/11557872/',
      },
    ],
    common_adverse_effects: 'Research context; replacement therapy in deficiency generally tolerated',
    contraindications: 'Research context only',
    recommended_dosage: 'See metreleptin for approved analog',
  },
  {
    id: '94',
    slug: 'metreleptin',
    name: 'Metreleptin (Myalept)',
    regulatory_status: 'FDA-approved',
    summary: 'Recombinant leptin analog approved for generalized lipodystrophy to correct severe leptin deficiency and metabolic complications.',
    mechanism: 'Restores leptin signaling to improve satiety, insulin sensitivity, hypertriglyceridemia, and endocrine abnormalities in leptin-deficient states.',
    evidence: [
      {
        title: 'Metreleptin therapy in lipodystrophy (review)',
        year: 2017,
        source: 'PubMed',
        summary: 'Review of metreleptin therapy in lipodystrophy',
        url: 'https://pubmed.ncbi.nlm.nih.gov/28613180/',
      },
    ],
    common_adverse_effects: 'Headache, hypoglycemia (with insulin), injection-site reactions; anti-drug antibodies possible',
    contraindications: 'Hypersensitivity; caution with immunogenicity and lymphoma risk discussion in label',
    recommended_dosage: 'Per FDA-approved protocol for lipodystrophy',
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

