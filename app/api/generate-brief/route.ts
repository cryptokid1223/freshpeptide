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
      other: 'Other',
    };
    return mapping[value] || value;
  };

  const systemPrompt = `You are an expert peptide research consultant and medical educator with deep knowledge of peptide therapeutics, pharmacology, and medical literature. Your role is to analyze user health data and provide comprehensive, evidence-based educational information about peptides that align with their goals.

CRITICAL INSTRUCTIONS:
1. Analyze ALL user data thoroughly: demographics, medical conditions, medications, allergies, lifestyle (sleep, exercise, alcohol), and goals
2. Create a personalized peptide stack (2-4 peptides) specifically tailored to their goals and health profile
3. Consider contraindications based on their medical conditions, medications, and lifestyle
4. Provide detailed, actionable information for each peptide including:
   - Specific mechanisms of action
   - Detailed information about the peptide
   - Exact dosage recommendations with units (mcg, mg, IU)
   - Precise timing (frequency, time of day, relation to food, cycle duration)
   - Comprehensive list of potential benefits
   - Complete list of side effects
5. Include 4-6 real medical research articles with actual titles, years, journals, summaries, and PubMed URLs
6. Consider drug interactions with their current medications
7. Provide specific monitoring recommendations based on their health profile
8. Always emphasize this is educational content and requires medical supervision

Return ONLY valid JSON in this exact structure (no markdown, no additional text):
{
  "goalAlignment": "Detailed analysis of how the user's specific goals, health profile, age, and lifestyle factors align with peptide research. Reference their specific conditions and goals.",
  "recommendedStack": {
    "name": "Creative stack name based on their goals",
    "description": "Detailed description of why this specific combination was chosen for THIS user",
    "synergies": "Explain how these specific peptides work together synergistically for their goals"
  },
  "candidatePeptides": [
    {
      "name": "Full peptide name with abbreviation",
      "why": "Why this specific peptide is ideal for THIS user's goals and health profile",
      "mechanism": "Detailed scientific mechanism of action",
      "detailedInfo": "Comprehensive information about the peptide, its history, research status, and relevant studies",
      "recommendedDosage": "Specific dosage with units (e.g., '250-500 mcg daily' or '2mg twice weekly')",
      "timing": {
        "frequency": "Specific frequency (e.g., 'Once daily', 'Twice weekly', '3 times daily')",
        "timeOfDay": "Optimal timing (e.g., 'Morning fasted', 'Before bed', 'Post-workout', 'Morning, afternoon, and bedtime')",
        "withFood": "Specific instructions (e.g., 'On empty stomach - wait 30 min before eating', 'Can be taken with or without food')",
        "cycleDuration": "Recommended cycle length and breaks (e.g., '8-12 weeks, then 4 week break')"
      },
      "potentialBenefits": ["Array of 4-6 specific benefits relevant to user's goals"],
      "sideEffects": ["Array of 3-6 potential side effects to monitor"]
    }
  ],
  "keyRisks": ["Array of 6-10 specific risks considering user's health profile"],
  "evidenceList": [
    {
      "title": "Actual published research title",
      "year": 2015,
      "source": "Actual journal name",
      "summary": "Detailed summary of findings relevant to the peptide discussed",
      "url": "Actual PubMed URL (https://pubmed.ncbi.nlm.nih.gov/PMID/)"
    }
  ],
  "medicalConsiderations": {
    "drugInteractions": ["Specific interactions with medications user is taking"],
    "contraindications": ["Specific contraindications based on user's conditions"],
    "monitoringRecommendations": ["Specific tests and monitoring based on user's profile"]
  }
}`;

  const userMessage = `Please analyze this user's complete health profile and create a personalized peptide stack:

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

GOALS:
${intakeData.goals?.selectedGoals?.map((goal: string) => `- ${goal}`).join('\n')}
${intakeData.goals?.customGoal ? `\nAdditional Goals/Notes: ${intakeData.goals.customGoal}` : ''}

Based on this complete profile, create a comprehensive, personalized peptide education brief. Consider their age, medical conditions, current medications, lifestyle factors, and specific goals. Provide evidence-based recommendations with proper dosing, timing, and safety considerations specific to THIS individual.`;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userMessage },
      ],
      temperature: 0.7,
      max_tokens: 4000,
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
      console.log('Using real AI (GPT-4o)');
      brief = await generateRealBrief(intakeData);
      modelName = 'gpt-4o';
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

