import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types for our database
export type Profile = {
  id: string;
  email: string;
  created_at: string;
};

export type IntakeData = {
  demographics?: {
    age?: number;
    sex?: string;
    height?: string;
    weight?: string;
  };
  medical?: {
    conditions?: string;
    medications?: string;
    allergies?: string;
  };
  lifestyle?: {
    sleep?: string;
    exercise?: string;
    alcohol?: string;
  };
  goals?: {
    selectedGoals?: string[];
    customGoal?: string;
  };
};

export type Intake = {
  id: string;
  user_id: string;
  intake_data: IntakeData;
  updated_at: string;
};

export type Brief = {
  id: string;
  user_id: string;
  brief_output: BriefOutput;
  model_name?: string;
  input_hash?: string;
  created_at: string;
};

export type BriefOutput = {
  goalAlignment: string;
  recommendedStack: {
    name: string;
    description: string;
    synergies: string;
  };
  candidatePeptides: Array<{
    name: string;
    why: string;
    mechanism: string;
    detailedInfo: string;
    recommendedDosage: string;
    timing: {
      frequency: string;
      timeOfDay: string;
      withFood: string;
      cycleDuration?: string;
    };
    potentialBenefits: string[];
    sideEffects: string[];
  }>;
  keyRisks: string[];
  evidenceList: Array<{
    title: string;
    year: number;
    source: string;
    summary: string;
    url?: string;
  }>;
  medicalConsiderations: {
    drugInteractions: string[];
    contraindications: string[];
    monitoringRecommendations: string[];
  };
};

export type Peptide = {
  id: string;
  slug: string;
  name: string;
  regulatory_status: string;
  summary: string;
  mechanism?: string;
  evidence: Array<{
    title: string;
    year: number;
    source: string;
    summary: string;
  }>;
  common_adverse_effects?: string;
  contraindications?: string;
  recommended_dosage?: string;
  created_at: string;
};

