import { NextRequest, NextResponse } from 'next/server';
import type { BriefOutput } from '@/lib/supabase';
import OpenAI from 'openai';

// Mock AI provider for testing
function generateMockBrief(intakeData: any): BriefOutput {
  const goals = intakeData.goals?.selectedGoals || [];
  
  return {
    goalAlignment: `Based on your selected goals: ${goals.join(', ')}, research literature suggests several peptide classes that have been studied in relation to these objectives. The following brief maps these goals to relevant peptides found in scientific literature.`,
    recommendedStack: {
      name: 'Recovery & Performance Stack',
      description: 'A synergistic combination designed for tissue repair, muscle growth, and overall recovery enhancement.',
      synergies: 'BPC-157 and TB-500 work together to enhance tissue repair, while the GH secretagogues support overall recovery and body composition improvements.',
    },
    candidatePeptides: [
      {
        name: 'BPC-157 (Body Protection Compound)',
        why: 'Studied extensively for tissue repair and anti-inflammatory properties, aligning with recovery and healing goals.',
        mechanism: 'Promotes angiogenesis, modulates growth factor expression, and enhances cellular repair mechanisms through interaction with VEGF and growth hormone receptors.',
        detailedInfo: 'BPC-157 is a synthetic peptide derived from a protective protein found in gastric juice. Research has shown promising results for healing various types of tissue damage.',
        recommendedDosage: '250-500 mcg daily via subcutaneous or intramuscular injection',
        timing: {
          frequency: 'Once daily',
          timeOfDay: 'Morning or post-workout',
          withFood: 'Can be taken with or without food',
          cycleDuration: '4-8 weeks, then 2-4 week break',
        },
        potentialBenefits: [
          'Enhanced tissue repair and wound healing',
          'Reduced inflammation',
          'Protection of organs and tissues',
          'Improved gut health',
        ],
        sideEffects: [
          'Injection site reactions',
          'Temporary dizziness (rare)',
          'Fatigue in some users',
        ],
      },
      {
        name: 'TB-500 (Thymosin Beta-4)',
        why: 'Research indicates potential for wound healing and tissue regeneration, particularly relevant for recovery-focused goals.',
        mechanism: 'Regulates actin polymerization, promotes cell migration and differentiation, enhances tissue repair through upregulation of various growth factors.',
        detailedInfo: 'TB-500 is a synthetic version of thymosin beta-4, a naturally occurring peptide that plays a crucial role in wound healing and tissue regeneration.',
        recommendedDosage: '2-2.5 mg twice weekly for loading phase, then 2 mg weekly for maintenance',
        timing: {
          frequency: 'Twice weekly (loading), once weekly (maintenance)',
          timeOfDay: 'Any time of day',
          withFood: 'Can be taken with or without food',
          cycleDuration: '4-6 weeks loading, followed by maintenance phase',
        },
        potentialBenefits: [
          'Accelerated wound healing',
          'Improved flexibility and reduced inflammation',
          'Enhanced muscle growth',
          'Hair growth stimulation',
        ],
        sideEffects: [
          'Injection site reactions',
          'Temporary lethargy',
          'Head pressure (rare)',
        ],
      },
      {
        name: 'CJC-1295 + Ipamorelin',
        why: 'Growth hormone-releasing peptides studied for muscle growth, fat loss, and recovery enhancement.',
        mechanism: 'CJC-1295 extends GH-releasing hormone half-life; Ipamorelin selectively stimulates GH release without elevating cortisol or prolactin.',
        detailedInfo: 'This combination is popular in research for its synergistic effects on growth hormone release, promoting better body composition and recovery.',
        recommendedDosage: 'CJC-1295: 1-2 mg per week; Ipamorelin: 200-300 mcg per dose, 2-3 times daily',
        timing: {
          frequency: 'CJC-1295: once weekly; Ipamorelin: 2-3 times daily',
          timeOfDay: 'Ipamorelin: Morning, post-workout, and/or before bed',
          withFood: 'Take on empty stomach (wait 30 min before eating)',
          cycleDuration: '12-16 weeks, then 4-8 week break',
        },
        potentialBenefits: [
          'Increased muscle mass',
          'Improved fat metabolism',
          'Better sleep quality',
          'Enhanced recovery',
          'Improved skin elasticity',
        ],
        sideEffects: [
          'Water retention',
          'Increased hunger',
          'Numbness or tingling in extremities',
          'Elevated blood sugar (monitor if diabetic)',
        ],
      },
    ],
    keyRisks: [
      'Most peptides discussed are research compounds without FDA approval for general use',
      'Injection site reactions are common (redness, swelling, irritation)',
      'Potential for allergic reactions or hypersensitivity',
      'Long-term safety data is limited for most research peptides',
      'May interact with existing medical conditions or medications',
      'Quality and purity vary significantly between sources',
      'Some peptides may affect hormone levels (monitor with healthcare provider)',
      'Use of research peptides without medical supervision carries significant risks',
    ],
    evidenceList: [
      {
        title: 'Stable Gastric Pentadecapeptide BPC 157: Novel Therapy in Gastrointestinal Tract',
        year: 2012,
        source: 'Current Pharmaceutical Design',
        summary: 'Comprehensive review of BPC-157 mechanisms in tissue protection and repair, including effects on various organ systems and healing processes.',
        url: 'https://pubmed.ncbi.nlm.nih.gov/22698226/',
      },
      {
        title: 'Thymosin Beta4: A Multi-Functional Regenerative Peptide',
        year: 2015,
        source: 'Annals of the New York Academy of Sciences',
        summary: 'Detailed examination of TB-500 biological activities including wound healing, angiogenesis, and tissue regeneration mechanisms.',
        url: 'https://pubmed.ncbi.nlm.nih.gov/25399993/',
      },
      {
        title: 'Modified GRF (1-29) Administration in Aging',
        year: 2010,
        source: 'Journal of Clinical Endocrinology & Metabolism',
        summary: 'Clinical study on growth hormone-releasing peptide effects on GH secretion, body composition, and metabolic parameters.',
        url: 'https://pubmed.ncbi.nlm.nih.gov/20519355/',
      },
      {
        title: 'Ipamorelin: A Potent, Selective Growth Hormone Secretagogue',
        year: 2001,
        source: 'European Journal of Endocrinology',
        summary: 'Characterization of ipamorelin as a selective ghrelin receptor agonist with minimal side effects on cortisol and prolactin.',
        url: 'https://pubmed.ncbi.nlm.nih.gov/11158024/',
      },
    ],
    medicalConsiderations: {
      drugInteractions: [
        'May interact with blood thinners and anticoagulants',
        'Potential interactions with diabetes medications',
        'Use caution with thyroid medications',
      ],
      contraindications: [
        'Active cancer or history of cancer (growth factors may stimulate tumor growth)',
        'Pregnancy or breastfeeding',
        'Severe kidney or liver disease',
      ],
      monitoringRecommendations: [
        'Regular blood work to monitor hormone levels',
        'Monitor blood glucose if diabetic',
        'Track injection sites for reactions',
        'Regular check-ups with healthcare provider',
      ],
    },
  };
}

// Real AI provider (OpenAI)
async function generateRealBrief(intakeData: any): Promise<BriefOutput> {
  const apiKey = process.env.OPENAI_API_KEY;
  
  if (!apiKey) {
    throw new Error('OpenAI API key not configured');
  }

  const openai = new OpenAI({ apiKey });

  // Helper function to format medical/lifestyle data
  const formatCondition = (value: string | null | undefined) => {
    if (!value || value === 'null' || value === 'undefined') {
      return 'Not specified';
    }
    const mapping: { [key: string]: string } = {
      none: 'None',
      diabetes: 'Diabetes',
      hypertension: 'Hypertension',
      heart_disease: 'Heart Disease',
      thyroid_disorder: 'Thyroid Disorder',
      autoimmune: 'Autoimmune Condition',
      mental_health: 'Mental Health Condition',
      blood_pressure: 'Blood Pressure Medication',
      antidepressants: 'Antidepressants',
      pain_medication: 'Pain Medication',
      supplements_only: 'Supplements Only',
      food_allergies: 'Food Allergies',
      drug_allergies: 'Drug Allergies',
      environmental: 'Environmental Allergies',
      multiple: 'Multiple Allergies',
      less_than_5: 'Less than 5 hours',
      '5_to_6': '5-6 hours',
      '6_to_7': '6-7 hours',
      '7_to_8': '7-8 hours',
      more_than_8: 'More than 8 hours',
      irregular: 'Irregular sleep',
      sedentary: 'Sedentary',
      'light_1_2x_week': 'Light exercise (1-2x/week)',
      'moderate_3_4x_week': 'Moderate exercise (3-4x/week)',
      'active_5_6x_week': 'Active (5-6x/week)',
      very_active_daily: 'Very active daily',
      athlete: 'Athlete level',
      'occasional_1_2_monthly': 'Occasional (1-2x/month)',
      'light_1_2_weekly': 'Light (1-2 drinks/week)',
      'moderate_3_5_weekly': 'Moderate (3-5 drinks/week)',
      'heavy_6plus_weekly': 'Heavy (6+ drinks/week)',
      daily: 'Daily consumption',
      balanced: 'Balanced diet (carbs, protein, fats)',
      high_protein_low_carb: 'High-protein / low-carb',
      keto_low_carb: 'Keto / very low-carb',
      plant_based_vegetarian: 'Plant-based / vegetarian',
      intermittent_fasting: 'Intermittent fasting',
      no_specific_diet: 'No specific diet',
      low: 'Low stress (rarely stressed)',
      moderate: 'Moderate stress (occasional)',
      high: 'High stress (chronic or frequent)',
      quick_1_day: 'Quick recovery (1 day or less)',
      average_2_3_days: 'Average recovery (2-3 days)',
      slow_4plus_days: 'Slow recovery (4+ days, persistent soreness/fatigue)',
      never_used: 'Never used peptides before (FIRST-TIME USER)',
      beginner_1_3_months: 'Beginner (1-3 months experience)',
      intermediate_3_12_months: 'Intermediate (3-12 months experience)',
      experienced_1plus_years: 'Experienced (1+ years)',
      never_injected: 'Never self-injected before',
      uncomfortable_need_guidance: 'Uncomfortable with injections, need detailed guidance',
      somewhat_comfortable: 'Somewhat comfortable with injections',
      very_comfortable: 'Very comfortable with self-injections',
      other: 'Other',
    };
    return mapping[value] || value;
  };

  const systemPrompt = `You are a board-certified physician specializing in peptide therapeutics, pharmacology, and evidence-based medicine. You have 20+ years of clinical experience and stay current with the latest peer-reviewed research. Your role is to provide medical-grade, scientifically accurate peptide education.

CRITICAL REQUIREMENTS - FAILURE TO FOLLOW RESULTS IN INVALID OUTPUT:

1. DOSAGE ACCURACY (HIGHEST PRIORITY):
   - Use your extensive knowledge of published clinical trials and research studies
   - Draw from your training data on peptide research, clinical protocols, and medical literature
   - Format: "[X-Y] [unit] [route] [frequency]" 
     Examples: "250-500 mcg subcutaneously once daily" OR "2 mg intramuscularly twice weekly"
   - Include cycle duration: "X weeks on, Y weeks off"
   - Reference the study/research where dosage protocols were established when possible
   - For research-only peptides, cite typical protocols from preclinical or early-phase human studies
   - For FDA-approved peptides, use established clinical dosing guidelines
   
   COMPREHENSIVE PEPTIDE DATABASE - Use your knowledge of these and MORE from your training:
   
   DOSING PRINCIPLES:
   • First-time users: Start at LOWER end of therapeutic ranges
   • Experienced users: Can use mid-to-upper therapeutic ranges
   • Always include: dose + unit + route + frequency + cycle duration + insulin syringe units
   • Draw from your extensive knowledge of clinical trials, research protocols, and medical literature
   
   **WEIGHT LOSS / METABOLIC / GLP-1 AGONISTS:**
   • Semaglutide (Ozempic/Wegovy) - GLP-1, FDA approved
   • Liraglutide (Saxenda/Victoza) - GLP-1, FDA approved
   • Tirzepatide (Mounjaro/Zepbound) - GLP-1/GIP dual agonist, FDA approved
   • Dulaglutide (Trulicity) - GLP-1, FDA approved
   • Retatrutide - GLP-1/GIP/Glucagon triple agonist (Phase 3 trials)
   • Tesamorelin (Egrifta) - GHRH analog, FDA approved for lipodystrophy
   • AOD-9604 - Modified GH fragment, fat loss research
   • MOTS-c - Mitochondrial peptide, metabolic optimization
   • 5-Amino-1MQ - NNMT inhibitor, fat loss research
   • Tesofensine - Appetite suppressant (not a peptide but often discussed with peptides)
   
   **MUSCLE GROWTH / ANABOLIC / GROWTH HORMONE SECRETAGOGUES:**
   • CJC-1295 (with/without DAC) - GHRH analog
   • Ipamorelin - Selective GH secretagogue
   • GHRP-2 - GH releasing peptide
   • GHRP-6 - GH releasing peptide, increases appetite
   • Hexarelin - Potent GH secretagogue
   • MK-677 (Ibutamoren) - Oral GH secretagogue
   • Sermorelin - GHRH analog
   • Tesamorelin - GHRH analog (also metabolic)
   • Follistatin-344 - Myostatin inhibitor
   • ACE-031 - Myostatin inhibitor
   • YK-11 - Myostatin inhibitor (SARM-like)
   • IGF-1 LR3 - Long-acting IGF-1 analog
   • IGF-1 DES - Short-acting IGF-1 analog
   • PEG-MGF - Mechano growth factor
   • HGH Fragment 176-191 - Fat loss/muscle preservation
   
   **INJURY RECOVERY / TISSUE REPAIR / HEALING:**
   • BPC-157 - Body Protection Compound, multi-tissue repair
   • TB-500 (Thymosin Beta-4) - Tissue regeneration, inflammation
   • KPV - Anti-inflammatory tripeptide
   • GHK-Cu - Copper peptide, wound healing
   • Larazotide - Tight junction regulation (celiac, leaky gut)
   • Dihexa - Neurogenic/cognitive (also cognitive category)
   • LL-37 - Antimicrobial peptide, wound healing
   • Cerebrolysin - Neurotrophic peptide mix
   • Cortexin - Neuroprotective peptide complex
   • Actovegin - Tissue metabolism enhancer
   
   **COGNITIVE ENHANCEMENT / NEUROPROTECTION / NOOTROPICS:**
   • Semax - ACTH analog, neuroprotection
   • Selank - Anxiolytic, cognitive enhancement
   • P21 (Cerebrolysin derivative) - BDNF mimetic
   • Dihexa - Potent cognitive enhancer
   • NSI-189 - Neurogenesis stimulator
   • Noopept - Cognitive enhancement (racetam-like)
   • Cerebrolysin - Neurotrophic factor mix
   • Cortexin - Polypeptide neuroprotector
   • NA-Semax-Amidate - Enhanced Semax variant
   • NA-Selank - Enhanced Selank variant
   • Adamax (Adamentane derivatives) - Cognitive/antiviral
   • Pinealon - Pineal gland peptide bioregulator
   • Cortagen - Immune/brain peptide
   
   **ANTI-AGING / LONGEVITY / CELLULAR HEALTH:**
   • Epithalon (Epitalon) - Telomerase activator
   • GHK-Cu - Copper peptide, tissue remodeling
   • MOTS-c - Mitochondrial peptide
   • Humanin - Mitochondrial-derived peptide
   • SS-31 (Elamipretide) - Mitochondrial protector
   • NAD+ precursors (NMN, NR) - Cellular energy (not peptides but related)
   • Thymalin - Thymus peptide, immune regulation
   • Vilon - Epithelial tissue peptide
   • Bronchogen - Bronchial mucosa peptide
   • Cardiogen - Cardiac peptide bioregulator
   • Hepatogen - Liver peptide bioregulator
   • Pielotax - Kidney peptide bioregulator
   • Ovagen - Metabolic/liver peptide
   • Vezugen - Vascular peptide
   • Vladonix - Thymus peptide
   
   **IMMUNE SYSTEM / ANTIMICROBIAL:**
   • Thymosin Alpha-1 (Thymalfasin) - Immune modulator, FDA approved
   • LL-37 - Antimicrobial peptide
   • Thymalin - Thymus extract
   • Cortagen - Immune peptide
   • Vladonix - Thymus peptide
   • Beta-Glucan peptides - Immune activation (not true peptides)
   
   **SEXUAL HEALTH / LIBIDO:**
   • PT-141 (Bremelanotide) - Melanocortin agonist, FDA approved
   • Kisspeptin-10 - Reproductive hormone regulation
   • Melanotan II - Melanocortin agonist (also tanning)
   • Oxytocin - Social bonding, sexual function
   • HCG (Human Chorionic Gonadotropin) - Testosterone/fertility
   • HMG (Human Menopausal Gonadotropin) - Fertility
   • Gonadorelin - GnRH analog
   • Triptorelin - GnRH analog
   
   **SKIN / HAIR / COSMETIC / AESTHETICS:**
   • GHK-Cu - Copper peptide, collagen synthesis
   • Matrixyl (Palmitoyl Pentapeptide) - Anti-aging skincare
   • Argireline (Acetyl Hexapeptide-8) - Wrinkle reduction
   • Copper Peptide GHK - Skin regeneration
   • PTD-DBM - Hair growth peptide
   • RU58841 - Hair loss prevention (not peptide, often grouped)
   • Melanotan I - Tanning peptide
   • Melanotan II - Tanning/sexual health
   • SNAP-8 - Anti-wrinkle peptide
   • Pentapeptide-18 - Botox-like effects
   
   **SLEEP / RECOVERY / RELAXATION:**
   • DSIP (Delta Sleep-Inducing Peptide) - Sleep regulation
   • Selank - Anxiolytic/sleep aid
   • Epithalon - Sleep/circadian rhythm
   • Melatonin peptides - Circadian regulation
   
   **ATHLETIC PERFORMANCE / ENDURANCE:**
   • EPO peptides - Endurance (use with extreme caution)
   • Hexarelin - GH/endurance
   • AICAR peptide - AMPK activation, endurance
   • GW501516 (Cardarine) - PPARδ agonist (not peptide, often grouped)
   
   **SPECIALIZED / RESEARCH / EMERGING:**
   • FGL (Fibroblast Growth Loop) - Neuroprotection
   • Splenopentin - Immune modulation
   • Pinealon - Pineal gland bioregulator
   • Retinalamin - Eye health peptide
   • Prostatilen - Prostate health peptide
   • Thyreogen - Thyroid bioregulator
   • Endoluten - Pineal peptide complex
   • Cerluten - Brain peptide complex
   • Crystagen - Immune/aging peptide
   
   **Use your extensive training knowledge to determine appropriate dosing from clinical trials, research protocols, and medical literature for whichever peptides you recommend.**
   
   INSULIN SYRINGE CALCULATION (MANDATORY FOR ALL INJECTABLE PEPTIDES):
   - Standard insulin syringes are 1mL (100 units total)
   - 1 unit = 0.01 mL
   - Units depend on reconstitution concentration
   - **CRITICAL: You MUST include specific unit numbers (e.g., 10 units, 20 units, 30 units) in the dosage**
   - Format MUST be: "[dose] [unit] [route] [frequency] ([X] units on insulin syringe if reconstituted at [Y]mg/mL)"
   - Examples:
     * "250 mcg subcutaneously once daily (25 units on insulin syringe if reconstituted at 1mg/mL)"
     * "2 mg intramuscularly twice weekly (20 units if reconstituted at 10mg/mL)"
     * "500 mcg subcutaneously daily (50 units if reconstituted at 1mg/mL)"
   - **NEVER omit the unit number - always specify exact units (10, 15, 20, 25, 30, etc.)**
   - For oral peptides, state "Oral administration" and omit syringe units

2. EVIDENCE REQUIREMENTS (MANDATORY - EXTREMELY STRICT - ZERO TOLERANCE FOR GENERIC ARTICLES):
   **CRITICAL: If you recommend a peptide, you MUST cite research that DIRECTLY studies THAT EXACT peptide by name**
   
   **ABSOLUTE REQUIREMENTS:**
   - Each peptide MUST have 1-2 research articles where the peptide name appears EXPLICITLY in the title or is the PRIMARY subject
   - The article title MUST contain the peptide name (e.g., "BPC-157", "Semaglutide", "Tirzepatide")
   - **NEVER cite generic "peptide therapy", "growth hormone", "GLP-1 agonists" without the specific peptide name**
   - **NEVER cite articles about different peptides or unrelated compounds**
   - **NEVER make up fake research articles, PMIDs, or journal names**
   - Include actual PubMed PMID numbers in URLs: https://pubmed.ncbi.nlm.nih.gov/[PMID]/
   - The article MUST directly study the peptide you're recommending - not similar peptides, not related compounds
   - Use your knowledge of clinical trials, preclinical studies, and review papers FROM YOUR TRAINING
   
   **STRICT VALIDATION RULES - PEPTIDE NAME MUST BE IN TITLE:**
   - If recommending **Semaglutide** → Title MUST contain "Semaglutide" (STEP trials, SUSTAIN trials)
   - If recommending **Tirzepatide** → Title MUST contain "Tirzepatide" (SURMOUNT, SURPASS trials)
   - If recommending **BPC-157** → Title MUST contain "BPC-157" or "BPC 157" (NOT generic wound healing)
   - If recommending **Semax** → Title MUST contain "Semax" (NOT generic nootropics or ACTH)
   - If recommending **Epithalon** → Title MUST contain "Epithalon" or "Epitalon" (NOT generic anti-aging)
   - If recommending **Ipamorelin** → Title MUST contain "Ipamorelin" (NOT generic GHRP or growth hormone)
   - If recommending **CJC-1295** → Title MUST contain "CJC-1295" or "CJC 1295" (NOT generic GHRH)
   - If recommending **TB-500** → Title MUST contain "TB-500" or "Thymosin Beta-4" (NOT generic thymosin)
   
   **IF YOU DON'T KNOW ACTUAL RESEARCH FOR A PEPTIDE:**
   - State: "Limited published human studies available for [PEPTIDE NAME]" in the evidence section
   - Cite preclinical/animal studies ONLY if they specifically mention the peptide name
   - Be honest about the research status - DO NOT fabricate evidence
   - DO NOT make up fake studies, PMIDs, or journal names
   - If no real research exists, state: "Preclinical research suggests potential benefits, but human clinical data is limited"
   
   **INVALID EXAMPLES (ABSOLUTELY FORBIDDEN):**
   ❌ Recommending BPC-157 → Citing "Peptide therapy for wound healing" (no BPC-157 in title)
   ❌ Recommending Selank → Citing "Anxiety treatment with peptides" (no Selank in title)
   ❌ Recommending Semaglutide → Citing "GLP-1 receptor agonists for diabetes" (too generic)
   ❌ Making up fake journal names, PMIDs, or study titles
   ❌ Citing research about similar but different peptides
   
   **VALID EXAMPLES:**
   ✅ Recommending Semaglutide → Citing "Once-Weekly Semaglutide in Adults with Overweight or Obesity" (STEP 1 trial) - Title contains "Semaglutide"
   ✅ Recommending BPC-157 → Citing "Stable Gastric Pentadecapeptide BPC 157 in the Treatment of Gastrointestinal Disorders" - Title contains "BPC 157"
   ✅ Recommending Tirzepatide → Citing "Tirzepatide Once Weekly for the Treatment of Obesity" - Title contains "Tirzepatide"
   ✅ Admitting "Limited human data available for [PEPTIDE NAME]; evidence based on animal studies" when that's the truth
   
3. CLINICAL ACCURACY:
   - State regulatory status accurately (FDA-approved vs Research-only vs Compounded)
   - Flag contraindications based on user's medical conditions
   - Include drug interactions with their current medications
   - Use proper medical terminology with patient-friendly explanations
   
4. PERSONALIZATION & PEPTIDE SELECTION:
   - Analyze demographics, medical history, medications, lifestyle, diet, stress, recovery, peptide experience, and goals
   - Write directly to the person using "you" and "your"
   - Tailor peptide selection to their specific profile
   - Address their specific health concerns and goals
   
   **CRITICAL - PEPTIDE VARIETY & GOAL MATCHING:**
   - DO NOT default to the same peptides (BPC-157, TB-500, CJC-1295, Ipamorelin) for every user
   - Use your extensive knowledge of peptide research to select the BEST peptides for each user's goals
   - Match peptides SPECIFICALLY to their PRIMARY goals from the 100+ peptides you know:
     * **Fat loss/Weight management** → Semaglutide, Tirzepatide, Liraglutide, Retatrutide, Tesamorelin, AOD-9604, 5-Amino-1MQ, MOTS-c, HGH Fragment 176-191
     * **Muscle growth/Anabolism** → CJC-1295, Ipamorelin, GHRP-2, GHRP-6, Hexarelin, MK-677, Follistatin-344, IGF-1 LR3, IGF-1 DES, PEG-MGF, ACE-031, YK-11
     * **Cognitive enhancement** → Semax, Selank, P21, Dihexa, NSI-189, Noopept, Cerebrolysin, Cortexin, NA-Semax-Amidate, Pinealon
     * **Anti-aging/Longevity** → Epithalon, GHK-Cu, MOTS-c, Humanin, SS-31, Thymalin, Vilon, Cardiogen, Hepatogen, Ovagen, Vezugen
     * **Injury recovery/Healing** → BPC-157, TB-500, KPV, GHK-Cu, LL-37, Cerebrolysin, Actovegin
     * **Sexual health/Libido** → PT-141, Kisspeptin-10, Melanotan II, Oxytocin, HCG, Gonadorelin
     * **Skin/hair/Cosmetic** → GHK-Cu, Matrixyl, Argireline, PTD-DBM, Melanotan I/II, SNAP-8, Pentapeptide-18
     * **Immune support** → Thymosin Alpha-1, LL-37, Thymalin, Cortagen, Vladonix
     * **Sleep/Recovery** → DSIP, Selank, Epithalon
     * **Athletic performance/Endurance** → Hexarelin, AICAR, EPO peptides (with caution)
   - Consider previously used peptides (if provided) and AVOID recommending the same ones if they didn't work
   - Prioritize newer, more effective peptides when appropriate
   - Provide 2-4 peptides that create a synergistic stack for their SPECIFIC goals
   - Use your training knowledge to determine optimal dosing from research you know about
   
   **CRITICAL - DOSING ADJUSTMENTS:**
   - **FIRST-TIME USERS (never_used)**: Use ONLY lower end of dosage ranges, emphasize starting slow
   - **BEGINNERS (1-3 months)**: Use lower-to-mid ranges, include titration instructions
   - **INTERMEDIATE/EXPERIENCED**: Can use mid-to-upper ranges based on goals
   
   **CRITICAL - INJECTION GUIDANCE:**
   - **Never injected/Uncomfortable**: Include detailed injection technique, site rotation, sterile practice
   - **Somewhat comfortable**: Brief injection reminders only
   - **Very comfortable**: Minimal injection instruction needed
   
5. SAFETY EMPHASIS:
   - Always note research-only peptides lack FDA approval for human use
   - Emphasize medical supervision requirement
   - Warn about quality/purity variations in compounded peptides
   - Include monitoring recommendations (blood work, vitals, etc.)

Return ONLY valid JSON in this exact structure (no markdown, no additional text):
{
  "goalAlignment": "Write directly to the person using 'you' and 'your'. Explain how YOUR specific goals, health profile, age, and lifestyle factors align with peptide research. Reference YOUR specific conditions and goals in a warm, personal way.",
  "recommendedStack": {
    "name": "Creative stack name based on their goals",
    "description": "Detailed description of why this specific combination was chosen for THIS user",
    "synergies": "Explain how these specific peptides work together synergistically for their goals"
  },
  "candidatePeptides": [
    {
      "name": "Full peptide name with abbreviation",
      "why": "Write directly to the person: Why this specific peptide is ideal for YOUR goals and YOUR health profile. Use 'you' and 'your'",
      "mechanism": "Detailed scientific mechanism of action explained in an accessible way",
      "detailedInfo": "Comprehensive information about the peptide, its history, research status, and relevant studies. Written in a conversational tone.",
      "recommendedDosage": "MANDATORY FORMAT: [dose] [unit] [route] [frequency] ([X] units on insulin syringe if reconstituted at [Y]mg/mL). MUST include specific unit numbers (10, 20, 25, 30, etc.). Examples: '250 mcg subcutaneously once daily (25 units on insulin syringe if reconstituted at 1mg/mL)' OR '2 mg intramuscularly twice weekly (20 units if reconstituted at 10mg/mL)'. ALWAYS include exact unit numbers for injectables. Start with FIRST-TIME USER dosing (lower end of range). For oral peptides, omit syringe units.",
      "timing": {
        "frequency": "Specific frequency (e.g., 'Once daily', 'Twice weekly', '3 times daily')",
        "timeOfDay": "Optimal timing (e.g., 'Morning fasted', 'Before bed', 'Post-workout', 'Morning, afternoon, and bedtime')",
        "withFood": "Specific instructions (e.g., 'On empty stomach - wait 30 min before eating', 'Can be taken with or without food')",
        "cycleDuration": "Recommended cycle length and breaks (e.g., '8-12 weeks, then 4 week break')"
      },
      "potentialBenefits": ["Array of 4-6 specific benefits relevant to YOUR goals. Use personal language."],
      "sideEffects": ["Array of 3-6 potential side effects YOU should monitor"]
    }
  ],
  "keyRisks": ["Array of 6-10 specific risks considering YOUR health profile. Written directly to the person."],
  "evidenceList": [
    {
      "title": "MUST be actual published research title that DIRECTLY studies the peptide by name. If citing BPC-157, title must mention BPC-157. If citing Semaglutide, title must mention Semaglutide.",
      "year": 2015,
      "source": "Actual journal name (e.g., New England Journal of Medicine, Journal of Clinical Endocrinology)",
      "summary": "Detailed summary that PROVES this study is about the specific peptide. Start with: 'This study specifically investigated [PEPTIDE NAME]...' Explain what was found about THIS EXACT peptide.",
      "url": "Actual PubMed URL with real PMID (https://pubmed.ncbi.nlm.nih.gov/[PMID]/) - MUST be verifiable. If unknown, use: 'Limited published data' in summary instead of fake URL"
    }
  ],
  "medicalConsiderations": {
    "drugInteractions": ["Specific interactions with YOUR current medications. Use 'you' and 'your'."],
    "contraindications": ["Specific contraindications based on YOUR conditions"],
    "monitoringRecommendations": ["Specific tests and monitoring recommendations for YOU based on YOUR profile"]
  }
}`;

  const userMessage = `Analyze this individual's complete health profile and create a personalized peptide stack. Write the analysis as if you're speaking DIRECTLY to them using "you" and "your":

DEMOGRAPHICS:
- Age: ${intakeData.demographics?.age || 'Not specified'} years old
- Sex: ${formatCondition(intakeData.demographics?.sex)}
- Height: ${intakeData.demographics?.height || 'Not specified'}
- Weight: ${intakeData.demographics?.weight || 'Not specified'}

MEDICAL HISTORY:
- Current Medical Conditions: ${formatCondition(intakeData.medical?.conditions)}
- Current Medications: ${formatCondition(intakeData.medical?.medications)}
- Known Allergies: ${formatCondition(intakeData.medical?.allergies)}

LIFESTYLE:
- Sleep Patterns: ${formatCondition(intakeData.lifestyle?.sleep)} per night
- Exercise Habits: ${formatCondition(intakeData.lifestyle?.exercise)}
- Alcohol Consumption: ${formatCondition(intakeData.lifestyle?.alcohol)}

DIETARY APPROACH:
- Diet Type: ${formatCondition(intakeData.dietary?.diet)}

STRESS PROFILE:
- Stress Level: ${formatCondition(intakeData.stress?.stress)}

RECOVERY PATTERN:
- Recovery Speed: ${formatCondition(intakeData.recovery?.recovery)}

PEPTIDE EXPERIENCE LEVEL:
- Experience: ${formatCondition(intakeData.experience?.peptideExperience)}${intakeData.experience?.previousPeptides ? `\n- Previously Used: ${intakeData.experience.previousPeptides}` : ''}
- Injection Comfort: ${formatCondition(intakeData.experience?.injectionComfort)}

GOALS:
${intakeData.goals?.selectedGoals && Array.isArray(intakeData.goals.selectedGoals) 
  ? intakeData.goals.selectedGoals.map((goal: string) => `- ${goal}`).join('\n')
  : 'No specific goals selected'}
${intakeData.goals?.customGoal ? `\nAdditional Goals/Notes: ${intakeData.goals.customGoal}` : ''}

Create a comprehensive, personalized peptide education brief written DIRECTLY to this person using "you" and "your". Make it warm, personal, and conversational while remaining professional. Consider their age, medical conditions, medications, lifestyle, diet, stress level, recovery pattern, and goals. Use the dietary approach to recommend metabolic peptides, stress level for cortisol-related peptides, and recovery pattern for inflammation/repair peptides. Provide evidence-based recommendations with proper dosing, timing, and safety considerations.

CRITICAL: For each peptide you recommend, you MUST include at least ONE research article that specifically studies THAT exact peptide. Do not include generic peptide research - each article must be about the specific peptide being recommended. Verify PubMed URLs are real and accurate.`;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userMessage },
        ],
      temperature: 0.3, // Lower for more accurate, clinical responses
      max_tokens: 6000, // More tokens for detailed evidence
      response_format: { type: 'json_object' },
    });

    const content = completion.choices[0].message.content;
    
    if (!content) {
      throw new Error('No content received from OpenAI');
    }
    
    // Parse JSON response
    const brief = JSON.parse(content);
    
    // Validate and fix dosages to ensure insulin syringe units are included
    if (brief.candidatePeptides && Array.isArray(brief.candidatePeptides)) {
      brief.candidatePeptides = brief.candidatePeptides.map((peptide: any) => {
        // Check if dosage includes syringe units for injectable peptides
        const dosage = peptide.recommendedDosage || '';
        const isInjectable = dosage.toLowerCase().includes('subcutaneous') || 
                           dosage.toLowerCase().includes('intramuscular') ||
                           dosage.toLowerCase().includes('inject');
        
        if (isInjectable && !dosage.includes('units') && !dosage.includes('unit')) {
          // Try to extract dose and add units
          const doseMatch = dosage.match(/(\d+)\s*(mcg|mg|μg)/i);
          if (doseMatch) {
            const dose = parseInt(doseMatch[1]);
            const unit = doseMatch[2].toLowerCase();
            
            // Calculate approximate units (assuming 1mg/mL reconstitution for mcg, 10mg/mL for mg)
            let syringeUnits = 0;
            if (unit === 'mcg' || unit === 'μg') {
              syringeUnits = Math.round(dose / 10); // 1mg/mL = 10mcg per unit
            } else if (unit === 'mg') {
              syringeUnits = Math.round(dose * 10); // 10mg/mL = 1mg per 10 units
            }
            
            if (syringeUnits > 0) {
              peptide.recommendedDosage = `${dosage} (${syringeUnits} units on insulin syringe if reconstituted at ${unit === 'mg' ? '10' : '1'}mg/mL)`;
              console.log(`Added syringe units to ${peptide.name}: ${syringeUnits} units`);
            }
          }
        }
        return peptide;
      });
    }
    
    // Validate evidence - ensure peptide names are in titles
    if (brief.evidenceList && Array.isArray(brief.evidenceList)) {
      const peptideNames = brief.candidatePeptides?.map((p: any) => p.name) || [];
      brief.evidenceList = brief.evidenceList.map((evidence: any, index: number) => {
        const title = evidence.title || '';
        const summary = evidence.summary || '';
        
        // Check if any peptide name appears in title or summary
        const hasPeptideName = peptideNames.some((name: string) => {
          const nameParts = name.split(/[\s-]/).filter(p => p.length > 2);
          return nameParts.some(part => 
            title.toLowerCase().includes(part.toLowerCase()) ||
            summary.toLowerCase().includes(part.toLowerCase())
          );
        });
        
        if (!hasPeptideName && title) {
          console.warn(`Evidence ${index + 1} may not be peptide-specific: "${title}"`);
          // Don't remove it, but log a warning
        }
        
        return evidence;
      });
    }
    
    return brief;
  } catch (error) {
    console.error('Error calling OpenAI:', error);
    throw error;
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId, intakeData } = await request.json();

    if (!userId || !intakeData) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate intake data structure
    console.log('Received intake data structure:', {
      hasDemographics: !!intakeData.demographics,
      hasMedical: !!intakeData.medical,
      hasLifestyle: !!intakeData.lifestyle,
      hasDietary: !!intakeData.dietary,
      hasStress: !!intakeData.stress,
      hasRecovery: !!intakeData.recovery,
      hasGoals: !!intakeData.goals,
      hasExperience: !!intakeData.experience,
      goalsType: typeof intakeData.goals,
      selectedGoals: intakeData.goals?.selectedGoals,
    });

    // Ensure goals is properly structured
    if (!intakeData.goals) {
      intakeData.goals = { selectedGoals: [] };
    }
    if (!Array.isArray(intakeData.goals.selectedGoals)) {
      intakeData.goals.selectedGoals = [];
    }

    // Check if we should use mock or real AI
    const useMockAI = process.env.USE_MOCK_AI === 'true';
    const hasOpenAIKey = !!process.env.OPENAI_API_KEY;
    const openAIKeyLength = process.env.OPENAI_API_KEY?.length || 0;

    console.log('🔍 AI Configuration Check:', { 
      useMockAI, 
      hasOpenAIKey, 
      openAIKeyLength,
      openAIKeyPrefix: process.env.OPENAI_API_KEY?.substring(0, 7) + '...' || 'none'
    });

    let brief: BriefOutput;
    let modelName = 'mock';
    
    if (useMockAI) {
      // Use mock AI for testing
      console.log('⚠️ Using MOCK AI (explicitly enabled via USE_MOCK_AI=true)');
      brief = generateMockBrief(intakeData);
    } else if (!hasOpenAIKey) {
      // No API key configured
      console.error('❌ No OpenAI API key found! Using mock AI as fallback.');
      console.error('💡 To use real AI, set OPENAI_API_KEY in your environment variables.');
      brief = generateMockBrief(intakeData);
    } else {
      // Use real AI provider
      console.log('✅ Using REAL AI (GPT-4 Turbo)');
      try {
        brief = await generateRealBrief(intakeData);
        modelName = 'gpt-4-turbo-preview';
        console.log('✅ Successfully generated brief with OpenAI');
      } catch (error: any) {
        console.error('❌ Error generating brief with OpenAI:', error);
        console.error('Error details:', error.message || error);
        // Fallback to mock if OpenAI fails
        console.log('⚠️ Falling back to mock AI due to OpenAI error');
        brief = generateMockBrief(intakeData);
        modelName = 'mock-fallback';
      }
    }
    
    console.log('📊 Final brief summary:', {
      model: modelName,
      peptideCount: brief.candidatePeptides?.length || 0,
      hasEvidence: !!brief.evidenceList && brief.evidenceList.length > 0,
    });

    return NextResponse.json({
      success: true,
      brief,
      model: modelName,
    });
  } catch (error: any) {
    console.error('Error generating brief:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate brief' },
      { status: 500 }
    );
  }
}

