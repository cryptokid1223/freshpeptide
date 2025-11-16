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

  const systemPrompt = `You are a medical intelligence system for peptide therapy. Analyze user health data and provide evidence-based peptide recommendations with clinically accurate dosages.

CRITICAL REQUIREMENTS:

- All dosages must be medically accurate
- Use standard units (mg, mcg, IU)
- Include administration details
- Cite research evidence
- List contraindications

RESPOND ONLY WITH VALID JSON IN THIS EXACT FORMAT:

{
  "peptideStack": [
    {
      "name": "Peptide Name",
      "class": "Peptide class (e.g., GLP-1, Growth Hormone Secretagogue)",
      "dosage": {
        "amount": "X mg or X mcg (MUST include unit)",
        "frequency": "once daily / twice weekly / etc",
        "timing": "morning fasted / before bed / etc",
        "route": "subcutaneous / oral / etc"
      },
      "duration": "12 weeks / 3-6 months / etc",
      "mechanism": "How it works",
      "benefits": ["benefit 1", "benefit 2"],
      "sideEffects": ["side effect 1", "side effect 2"],
      "contraindications": ["contraindication 1"],
      "researchEvidence": "Research citation or study reference",
      "regulatoryStatus": "FDA-approved / Research use / etc"
    }
  ],
  "stackRationale": "Why these peptides work together",
  "safetyConsiderations": ["safety note 1", "safety note 2"],
  "consultationAdvice": "Consult healthcare provider before use"
}

DOSAGE GUIDELINES (USE THESE):

- Semaglutide: Start 0.25mg weekly, titrate to 1-2.4mg weekly
- Tirzepatide: Start 2.5mg weekly, titrate to 5-15mg weekly
- Liraglutide: Start 0.6mg daily, titrate to 3mg daily
- Ipamorelin: 200-300mcg before bed
- CJC-1295: 100-200mcg 2-3x weekly
- BPC-157: 250-500mcg daily or twice daily
- TB-500: 2-5mg twice weekly for 4-6 weeks
- Thymosin Alpha-1: 1.6mg twice weekly

NEVER recommend peptides without complete dosage information.`;

  const userMessage = `Analyze this user's health profile and recommend a peptide stack:

${JSON.stringify(intakeData, null, 2)}

Provide your response in the exact JSON format specified.`;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userMessage },
      ],
      temperature: 0.3,
      max_tokens: 2500,
      response_format: { type: 'json_object' },
    });

    const content = completion.choices[0].message.content;
    
    if (!content) {
      throw new Error('No content received from OpenAI');
    }

    // Parse JSON response from OpenAI
    const raw = JSON.parse(content);

    // Validate structure
    if (!raw.peptideStack || !Array.isArray(raw.peptideStack)) {
      throw new Error('Invalid API response structure: missing peptideStack array');
    }

    // Validate dosage fields for each peptide
    raw.peptideStack.forEach((peptide: any) => {
      if (
        !peptide.dosage?.amount ||
        !peptide.dosage?.frequency ||
        !peptide.dosage?.timing ||
        !peptide.dosage?.route
      ) {
        throw new Error(`Incomplete dosage for ${peptide.name || 'Unnamed peptide'}`);
      }

      if (!/\d+\.?\d*\s*(mg|mcg|IU)/i.test(peptide.dosage.amount)) {
        throw new Error(
          `Invalid dosage format for ${peptide.name || 'Unnamed peptide'}: ${peptide.dosage.amount}`
        );
      }
    });

    console.log('✅ OpenAI raw peptideStack response:', raw);

    // Map the validated OpenAI response into the existing BriefOutput structure
    const brief: BriefOutput = {
      goalAlignment:
        raw.stackRationale ||
        'This peptide stack is designed to align with your reported goals and health profile.',
      recommendedStack: {
        name: 'Personalized Peptide Stack',
        description:
          raw.stackRationale ||
          'A combination of peptides selected based on your health questionnaire and goals.',
        synergies:
          raw.stackRationale ||
          'These peptides have complementary mechanisms that may support your goals in a synergistic way.',
      },
      candidatePeptides: raw.peptideStack.map((p: any) => ({
        name: p.name,
        why: p.mechanism || '',
        mechanism: p.mechanism || '',
        detailedInfo: `Class: ${p.class || 'Not specified'}. Regulatory status: ${
          p.regulatoryStatus || 'Not specified'
        }. Research: ${p.researchEvidence || 'Not specified'}.`,
        recommendedDosage: p.dosage?.amount
          ? `${p.dosage.amount} ${p.dosage.route ? p.dosage.route : ''} ${
              p.dosage.frequency || ''
            }`.trim()
          : '',
        timing: {
          frequency: p.dosage?.frequency || '',
          timeOfDay: p.dosage?.timing || '',
          withFood: '',
          cycleDuration: p.duration || '',
        },
        potentialBenefits: Array.isArray(p.benefits) ? p.benefits : [],
        sideEffects: Array.isArray(p.sideEffects) ? p.sideEffects : [],
      })),
      keyRisks: Array.isArray(raw.safetyConsiderations)
        ? raw.safetyConsiderations
        : ['Use only under the supervision of a qualified healthcare professional.'],
      evidenceList: raw.peptideStack
        .filter((p: any) => !!p.researchEvidence)
        .map((p: any) => ({
          title: p.researchEvidence,
          year: 0,
          source: '',
          summary: p.researchEvidence,
          url: '',
        })),
      medicalConsiderations: {
        drugInteractions: [],
        contraindications: raw.peptideStack
          .flatMap((p: any) => (Array.isArray(p.contraindications) ? p.contraindications : [])),
        monitoringRecommendations: [],
      },
    };

    return brief;
  } catch (error) {
    console.error('OpenAI API Error:', error);
    console.error('User data sent:', JSON.stringify(intakeData, null, 2));
    throw new Error('Failed to generate peptide recommendations');
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

