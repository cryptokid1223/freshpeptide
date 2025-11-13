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
  const formatCondition = (value: string) => {
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
   - ONLY use dosages from published clinical trials and research studies
   - NEVER make up or estimate dosages
   - Format: "[X-Y] [unit] [route] [frequency]" 
     Examples: "250-500 mcg subcutaneously once daily" OR "2 mg intramuscularly twice weekly"
   - Include cycle duration: "X weeks on, Y weeks off"
   - Reference the study where dosage was used if possible
   
   SPECIFIC DOSAGE RANGES (based on research literature):
   
   FIRST-TIME USER DOSING - ALWAYS START LOW:
   • Start at the LOWER end of ranges for first-time users
   • Titrate up slowly over 1-2 weeks if well-tolerated
   • Monitor for side effects before increasing
   
   PEPTIDE-SPECIFIC DOSING (with insulin syringe units):
   
   **WEIGHT LOSS / METABOLIC:**
   • Semaglutide (GLP-1 agonist, FDA approved):
     - First-time: 0.25 mg SC weekly, titrate up by 0.25 mg every 4 weeks
     - Standard: 0.5-2.4 mg SC weekly
   • Tirzepatide (GLP-1/GIP agonist, FDA approved):
     - First-time: 2.5 mg SC weekly, titrate up
     - Standard: 5-15 mg SC weekly
   • Retatrutide (Triple agonist, research):
     - Research protocols: 1-12 mg SC weekly (investigational)
   • Tesamorelin (GHRH analog):
     - Standard: 2 mg SC daily = 20 units (if 10mg/mL)
   • AOD-9604 (Modified GH fragment):
     - First-time: 250 mcg SC daily = 25 units (if 1mg/mL)
     - Standard: 250-500 mcg SC daily
   
   **MUSCLE GROWTH / ANABOLIC:**
   • CJC-1295 (no DAC): 
     - First-time: 100 mcg SC 1-2x daily = 10 units (if 1mg/mL)
     - Experienced: 100-200 mcg SC 2-3x daily
   • CJC-1295 (with DAC): 
     - First-time: 0.5-1 mg SC weekly = 25-50 units (if 2mg/mL)
     - Experienced: 1-2 mg SC weekly
   • Ipamorelin: 
     - First-time: 200 mcg SC 2x daily = 20 units (if 1mg/mL)
     - Experienced: 200-300 mcg SC 2-3x daily
   • GHRP-6:
     - First-time: 100 mcg SC 2x daily = 10 units (if 1mg/mL)
     - Standard: 100-200 mcg SC 2-3x daily
   • Follistatin-344:
     - Research: 100 mcg SC daily (limited human data)
   • IGF-1 LR3:
     - Research: 20-40 mcg SC daily (research only)
   
   **INJURY RECOVERY / TISSUE REPAIR:**
   • BPC-157: 
     - First-time: 200-250 mcg SC/IM daily = 20-25 units (if 2mg/mL)
     - Experienced: 250-500 mcg SC/IM daily
   • TB-500: 
     - First-time: 2 mg SC/IM 2x/week = 20 units (if 10mg/mL)
     - Experienced: 2-2.5 mg SC/IM 2x/week loading
   • KPV (Anti-inflammatory):
     - Standard: 500-1000 mcg SC daily = 50-100 units (if 1mg/mL)
   
   **COGNITIVE ENHANCEMENT / NEUROPROTECTION:**
   • Semax:
     - First-time: 300 mcg intranasal 1x daily
     - Standard: 300-600 mcg intranasal 1-2x daily
   • Selank:
     - First-time: 250 mcg intranasal 1x daily
     - Standard: 250-500 mcg intranasal 1-2x daily
   • Dihexa:
     - Research: 5-10 mg oral daily (research only, limited data)
   • P21 (Cerebrolysin derivative):
     - Research: 10-30 mg SC daily (research only)
   • NSI-189:
     - Research: 40 mg oral 3x daily (clinical trials)
   
   **ANTI-AGING / LONGEVITY:**
   • Epithalon (Epitalon):
     - Cycle: 5-10 mg SC daily for 10-20 days, 2x/year
   • GHK-Cu (Copper peptide):
     - First-time: 1 mg SC daily = 10 units (if 10mg/mL)
     - Standard: 1-3 mg SC daily or topical
   • MOTS-c (Mitochondrial):
     - Standard: 5-10 mg SC 2-3x/week
   • Humanin:
     - Research: 1-5 mg SC daily (limited human data)
   
   **SEXUAL HEALTH:**
   • PT-141 (Bremelanotide, FDA approved):
     - Standard: 1.75 mg SC as needed, max 1x/24h
   • Kisspeptin:
     - Research: 1-10 mcg/kg IV (research protocols)
   
   **SKIN / HAIR / COSMETIC:**
   • GHK-Cu variants (topical or SC)
   • PTD-DBM (Hair growth):
     - Research: Topical application (limited data)
   • Melanotan II (tanning):
     - Research: 250-500 mcg SC 2-3x/week (not FDA approved)
   
   INSULIN SYRINGE CALCULATION:
   - Standard insulin syringes are 1mL (100 units)
   - 1 unit = 0.01 mL
   - Units depend on reconstitution concentration
   - ALWAYS include both mcg/mg AND syringe units
   - Example: "250 mcg (25 units on insulin syringe if reconstituted at 1mg/mL)"

2. EVIDENCE REQUIREMENTS (MANDATORY):
   - Each peptide MUST have 1-2 research articles that DIRECTLY study THAT SPECIFIC peptide
   - Articles MUST be real, published, peer-reviewed studies
   - Include actual PubMed PMID numbers in URLs: https://pubmed.ncbi.nlm.nih.gov/[PMID]/
   - Article must relate to the claimed benefits or mechanism
   - NO generic peptide articles - each must be specific to the peptide recommended
   
   EXAMPLE VALID EVIDENCE:
   If recommending BPC-157 → Must cite BPC-157 specific research (e.g., PMID: 22698226)
   If recommending Ipamorelin → Must cite Ipamorelin research (e.g., PMID: 11158024)
   
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
   - Match peptides SPECIFICALLY to their PRIMARY goals:
     * **Fat loss/Weight management goals** → Semaglutide, Tirzepatide, Tesamorelin, AOD-9604, Retatrutide
     * **Muscle growth goals** → GHRP-6, CJC-1295, Ipamorelin, Follistatin, IGF-1 LR3
     * **Cognitive enhancement goals** → Semax, Selank, Dihexa, P21, NSI-189
     * **Anti-aging goals** → Epithalon, GHK-Cu, MOTS-c, Humanin
     * **Injury recovery goals** → BPC-157, TB-500, KPV
     * **Sexual health goals** → PT-141, Kisspeptin
     * **Skin/hair goals** → GHK-Cu, PTD-DBM, Melanotan II
   - Consider previously used peptides (if provided) and avoid recommending the same ones if they didn't work
   - Prioritize newer, more effective peptides when appropriate (e.g., Tirzepatide over Semaglutide for weight loss if suitable)
   - Provide 2-4 peptides that create a synergistic stack for their SPECIFIC goals
   
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
      "recommendedDosage": "MUST include: dose amount + unit + route + frequency + INSULIN SYRINGE UNITS. Example formats: '250 mcg subcutaneously once daily (25 units on insulin syringe if reconstituted at 1mg/mL)' OR '2 mg intramuscularly twice weekly (20 units if reconstituted at 10mg/mL)'. ALWAYS include syringe units for injectables. Start with FIRST-TIME USER dosing (lower end of range).",
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
      "title": "Actual published research title - MUST directly study the specific peptide recommended",
      "year": 2015,
      "source": "Actual journal name",
      "summary": "Detailed summary of findings. Explain what this study found about THIS specific peptide and how it supports YOUR recommendation.",
      "url": "Actual PubMed URL with PMID (https://pubmed.ncbi.nlm.nih.gov/[PMID]/) - MUST be real and verifiable"
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
- Age: ${intakeData.demographics?.age} years old
- Sex: ${formatCondition(intakeData.demographics?.sex)}
- Height: ${intakeData.demographics?.height}
- Weight: ${intakeData.demographics?.weight}

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
${intakeData.goals?.selectedGoals?.map((goal: string) => `- ${goal}`).join('\n')}
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

    // Check if we should use mock or real AI
    const useMockAI = process.env.USE_MOCK_AI === 'true';

    console.log('Generating brief with:', { useMockAI, hasOpenAIKey: !!process.env.OPENAI_API_KEY });

    let brief: BriefOutput;
    let modelName = 'mock';
    
    if (useMockAI) {
      // Use mock AI for testing
      console.log('Using mock AI');
      brief = generateMockBrief(intakeData);
    } else {
      // Use real AI provider
      console.log('Using real AI (GPT-4 Turbo)');
      brief = await generateRealBrief(intakeData);
      modelName = 'gpt-4-turbo-preview';
    }

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

