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
  conditions: z.enum(['none', 'diabetes', 'hypertension', 'heart_disease', 'thyroid_disorder', 'autoimmune', 'mental_health', 'other'], {
    required_error: 'Please select an option',
  }),
  medications: z.enum(['none', 'blood_pressure', 'diabetes', 'thyroid', 'antidepressants', 'pain_medication', 'supplements_only', 'other'], {
    required_error: 'Please select an option',
  }),
  allergies: z.enum(['none', 'food_allergies', 'drug_allergies', 'environmental', 'multiple', 'other'], {
    required_error: 'Please select an option',
  }),
});

// Lifestyle schema (Step C)
export const lifestyleSchema = z.object({
  sleep: z.enum(['less_than_5', '5_to_6', '6_to_7', '7_to_8', 'more_than_8', 'irregular'], {
    required_error: 'Please select your sleep pattern',
  }),
  exercise: z.enum(['sedentary', 'light_1_2x_week', 'moderate_3_4x_week', 'active_5_6x_week', 'very_active_daily', 'athlete'], {
    required_error: 'Please select your exercise level',
  }),
  alcohol: z.enum(['none', 'occasional_1_2_monthly', 'light_1_2_weekly', 'moderate_3_5_weekly', 'heavy_6plus_weekly', 'daily'], {
    required_error: 'Please select your alcohol consumption',
  }),
});

// Goals schema (Step D)
export const goalsSchema = z.object({
  selectedGoals: z.array(z.string()).min(1, 'Please select at least one goal'),
  customGoal: z.string().optional(),
});

// Combined intake schema
export const intakeSchema = z.object({
  demographics: demographicsSchema,
  medical: medicalSchema,
  lifestyle: lifestyleSchema,
  goals: goalsSchema,
});

export type DemographicsData = z.infer<typeof demographicsSchema>;
export type MedicalData = z.infer<typeof medicalSchema>;
export type LifestyleData = z.infer<typeof lifestyleSchema>;
export type GoalsData = z.infer<typeof goalsSchema>;
export type IntakeFormData = z.infer<typeof intakeSchema>;

