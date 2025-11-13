import { z } from 'zod';

// Demographics schema (Step A)
export const demographicsSchema = z.object({
  age: z.number().min(18, 'Must be 18 or older').max(120, 'Invalid age'),
  sex: z.enum(['male', 'female', 'other', 'prefer_not_to_say']),
  height: z.string().min(1, 'Height is required'),
  weight: z.string().min(1, 'Weight is required'),
});

// Medical basics schema (Step B)
export const medicalSchema = z.object({
  conditions: z.enum(['none', 'diabetes', 'hypertension', 'heart_disease', 'thyroid_disorder', 'autoimmune', 'mental_health', 'other']),
  medications: z.enum(['none', 'blood_pressure', 'diabetes', 'thyroid', 'antidepressants', 'pain_medication', 'supplements_only', 'other']),
  allergies: z.enum(['none', 'food_allergies', 'drug_allergies', 'environmental', 'multiple', 'other']),
});

// Lifestyle schema (Step C)
export const lifestyleSchema = z.object({
  sleep: z.enum(['less_than_5', '5_to_6', '6_to_7', '7_to_8', 'more_than_8', 'irregular']),
  exercise: z.enum(['sedentary', 'light_1_2x_week', 'moderate_3_4x_week', 'active_5_6x_week', 'very_active_daily', 'athlete']),
  alcohol: z.enum(['none', 'occasional_1_2_monthly', 'light_1_2_weekly', 'moderate_3_5_weekly', 'heavy_6plus_weekly', 'daily']),
});

// Dietary Approach schema (Step D)
export const dietarySchema = z.object({
  diet: z.enum(['balanced', 'high_protein_low_carb', 'keto_low_carb', 'plant_based_vegetarian', 'intermittent_fasting', 'no_specific_diet']),
});

// Stress Level schema (Step E)
export const stressSchema = z.object({
  stress: z.enum(['low', 'moderate', 'high']),
});

// Recovery Pattern schema (Step F)
export const recoverySchema = z.object({
  recovery: z.enum(['quick_1_day', 'average_2_3_days', 'slow_4plus_days']),
});

// Goals schema (Step G)
export const goalsSchema = z.object({
  selectedGoals: z.array(z.string()).min(1, 'Please select at least one goal'),
  customGoal: z.string().optional(),
});

// Peptide Experience schema (Step H)
export const experienceSchema = z.object({
  peptideExperience: z.enum(['never_used', 'beginner_1_3_months', 'intermediate_3_12_months', 'experienced_1plus_years']),
  previousPeptides: z.string().optional(), // Optional text field for which peptides they've used
  injectionComfort: z.enum(['never_injected', 'uncomfortable_need_guidance', 'somewhat_comfortable', 'very_comfortable']),
});

// Combined intake schema
export const intakeSchema = z.object({
  demographics: demographicsSchema,
  medical: medicalSchema,
  lifestyle: lifestyleSchema,
  dietary: dietarySchema,
  stress: stressSchema,
  recovery: recoverySchema,
  goals: goalsSchema,
  experience: experienceSchema,
});

export type DemographicsData = z.infer<typeof demographicsSchema>;
export type MedicalData = z.infer<typeof medicalSchema>;
export type LifestyleData = z.infer<typeof lifestyleSchema>;
export type DietaryData = z.infer<typeof dietarySchema>;
export type StressData = z.infer<typeof stressSchema>;
export type RecoveryData = z.infer<typeof recoverySchema>;
export type GoalsData = z.infer<typeof goalsSchema>;
export type ExperienceData = z.infer<typeof experienceSchema>;
export type IntakeFormData = z.infer<typeof intakeSchema>;

