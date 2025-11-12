'use client';

import React, { useState, useEffect } from 'react';
import { MainLayout } from '@/components/MainLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { supabase } from '@/lib/supabase';
import { 
  demographicsSchema, 
  medicalSchema, 
  lifestyleSchema, 
  goalsSchema,
  type DemographicsData,
  type MedicalData,
  type LifestyleData,
  type GoalsData
} from '@/lib/schemas';

const GOAL_OPTIONS = [
  'Muscle growth and recovery',
  'Fat loss and metabolism',
  'Cognitive enhancement',
  'Anti-aging and longevity',
  'Injury recovery and tissue repair',
  'Immune system support',
  'Sleep quality improvement',
  'Stress and anxiety reduction',
  'Sexual health and libido',
  'Skin health and appearance',
];

export default function IntakePage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  // Initialize form data - will be loaded from Supabase
  const [intakeData, setIntakeData] = useState<any>({});

  useEffect(() => {
    // Check authentication with Supabase and load existing intake data
    const checkAuthAndLoadData = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        router.push('/auth');
        return;
      }
      
      // Don't check consent in localStorage - just set it to true since they're authenticated
      // This allows cross-device access
      localStorage.setItem('consent_given', 'true');
      
      setIsAuthenticated(true);

      // Load existing intake data from Supabase database
      const { data: intakeRecord } = await supabase
        .from('intake')
        .select('intake_data')
        .eq('user_id', session.user.id)
        .maybeSingle();

      if (intakeRecord?.intake_data && Object.keys(intakeRecord.intake_data).length > 0) {
        console.log('📥 Loading existing intake data from Supabase database');
        console.log('Loaded data:', intakeRecord.intake_data);
        console.log('Data sections:', Object.keys(intakeRecord.intake_data));
        setIntakeData(intakeRecord.intake_data);
        // Also save to localStorage as cache
        localStorage.setItem('intake_data', JSON.stringify(intakeRecord.intake_data));
      } else {
        console.log('No intake data found in Supabase, checking localStorage');
        // Try localStorage as fallback (for backward compatibility)
        const savedIntake = localStorage.getItem('intake_data');
        if (savedIntake) {
          console.log('Found data in localStorage, using as fallback');
          setIntakeData(JSON.parse(savedIntake));
        } else {
          console.log('No intake data found anywhere - starting fresh');
        }
      }
    };
    
    checkAuthAndLoadData();
  }, [router]);

  // Auto-save function
  const saveData = async (data: any) => {
    setIsSaving(true);
    const updatedData = { ...intakeData, ...data };
    setIntakeData(updatedData);
    
    // Save to localStorage (immediate feedback)
    localStorage.setItem('intake_data', JSON.stringify(updatedData));
    
    // Save to Supabase
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        console.log('💾 Saving intake data to Supabase for user:', user.email);
        console.log('Data being saved:', updatedData);
        console.log('Data sections:', Object.keys(updatedData));
        
        const { data: result, error: upsertError } = await supabase
          .from('intake')
          .upsert({
            user_id: user.id,
            intake_data: updatedData,
            updated_at: new Date().toISOString(),
          }, { onConflict: 'user_id' });
        
        if (upsertError) {
          console.error('❌ Supabase upsert error:', upsertError);
        } else {
          console.log('✅ Intake data saved successfully to Supabase');
        }
      } else {
        console.error('❌ No user found when trying to save');
      }
    } catch (error) {
      console.error('❌ Error saving to Supabase:', error);
    }
    
    setLastSaved(new Date());
    setTimeout(() => setIsSaving(false), 500);
  };

  const steps = [
    { title: 'Demographics', component: StepA },
    { title: 'Medical History', component: StepB },
    { title: 'Lifestyle', component: StepC },
    { title: 'Goals', component: StepD },
  ];

  const CurrentStepComponent = steps[currentStep].component;

  const handleNext = async (data: any) => {
    await saveData(data);
    
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Final step completed - ensure data is fully saved
      console.log('🎉 All intake steps completed!');
      console.log('Final intake data:', { ...intakeData, ...data });
      
      // Mark as completed
      localStorage.setItem('intake_completed', 'true');
      
      // Verify data is in Supabase before proceeding
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          // Double-check the data was saved
          const { data: verifyRecord } = await supabase
            .from('intake')
            .select('intake_data')
            .eq('user_id', user.id)
            .maybeSingle();
          
          console.log('✅ Verification: Data in Supabase:', verifyRecord?.intake_data);
          
          if (verifyRecord?.intake_data) {
            console.log('✅ Confirmed: All data saved. Routing to /generate');
            router.push('/generate');
          } else {
            console.error('⚠️ Warning: Data not found in Supabase after save');
            router.push('/generate');
          }
        }
      } catch (error) {
        console.error('Error verifying save:', error);
        router.push('/generate');
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto">
          {/* Progress Indicator */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              {steps.map((step, index) => (
                <div key={index} className="flex items-center flex-1">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 
                    ${index <= currentStep 
                      ? 'bg-cyan-600 border-cyan-600 text-white' 
                      : 'border-slate-600 text-slate-500'}`}
                  >
                    {index + 1}
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`flex-1 h-1 mx-2 
                      ${index < currentStep ? 'bg-cyan-600' : 'bg-slate-700'}`} 
                    />
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-between text-sm">
              {steps.map((step, index) => (
                <div 
                  key={index} 
                  className={`flex-1 text-center ${index === currentStep ? 'text-cyan-400' : 'text-slate-500'}`}
                >
                  {step.title}
                </div>
              ))}
            </div>
          </div>

          {/* Auto-save indicator */}
          {lastSaved && (
            <div className="mb-4 text-sm text-slate-400 text-right">
              {isSaving ? 'Saving...' : `Last saved: ${lastSaved.toLocaleTimeString()}`}
            </div>
          )}

          {/* Current Step */}
          <CurrentStepComponent
            data={intakeData}
            onNext={handleNext}
            onBack={handleBack}
            showBack={currentStep > 0}
          />
        </div>
      </div>
    </MainLayout>
  );
}

// Step A: Demographics
function StepA({ data, onNext, onBack, showBack }: any) {
  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<DemographicsData>({
    resolver: zodResolver(demographicsSchema),
    defaultValues: data.demographics || {},
  });

  const sex = watch('sex');

  return (
    <Card className="bg-slate-800/50 border-slate-700 p-8">
      <h2 className="text-2xl font-bold text-cyan-400 mb-6">Step A: Demographics</h2>
      
      <form onSubmit={handleSubmit((formData) => onNext({ demographics: formData }))} className="space-y-6">
        <div>
          <Label htmlFor="age" className="text-slate-300">Age</Label>
          <Input
            id="age"
            type="number"
            {...register('age', { valueAsNumber: true })}
            className="bg-slate-900 border-slate-600 text-slate-100 mt-2"
          />
          {errors.age && <p className="text-red-400 text-sm mt-1">{errors.age.message}</p>}
        </div>

        <div>
          <Label htmlFor="sex" className="text-slate-300">Sex</Label>
          <Select onValueChange={(value) => setValue('sex', value as any)} value={sex}>
            <SelectTrigger className="bg-slate-900 border-slate-600 text-slate-100 mt-2">
              <SelectValue placeholder="Select sex" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
              <SelectItem value="other">Other</SelectItem>
              <SelectItem value="prefer_not_to_say">Prefer not to say</SelectItem>
            </SelectContent>
          </Select>
          {errors.sex && <p className="text-red-400 text-sm mt-1">{errors.sex.message}</p>}
        </div>

        <div>
          <Label htmlFor="height" className="text-slate-300">Height (e.g., 5'10" or 178cm)</Label>
          <Input
            id="height"
            {...register('height')}
            className="bg-slate-900 border-slate-600 text-slate-100 mt-2"
            placeholder="5'10&quot; or 178cm"
          />
          {errors.height && <p className="text-red-400 text-sm mt-1">{errors.height.message}</p>}
        </div>

        <div>
          <Label htmlFor="weight" className="text-slate-300">Weight (e.g., 170 lbs or 77 kg)</Label>
          <Input
            id="weight"
            {...register('weight')}
            className="bg-slate-900 border-slate-600 text-slate-100 mt-2"
            placeholder="170 lbs or 77 kg"
          />
          {errors.weight && <p className="text-red-400 text-sm mt-1">{errors.weight.message}</p>}
        </div>

        <div className="flex gap-4 pt-4">
          {showBack && (
            <Button type="button" onClick={onBack} variant="outline" className="border-slate-600">
              Back
            </Button>
          )}
          <Button type="submit" className="flex-1 bg-cyan-600 hover:bg-cyan-700">
            Next
          </Button>
        </div>
      </form>
    </Card>
  );
}

// Step B: Medical History
function StepB({ data, onNext, onBack, showBack }: any) {
  const { handleSubmit, formState: { errors }, setValue, watch } = useForm<MedicalData>({
    resolver: zodResolver(medicalSchema),
    defaultValues: data.medical || {},
  });

  const conditions = watch('conditions');
  const medications = watch('medications');
  const allergies = watch('allergies');

  return (
    <Card className="bg-slate-800/50 border-slate-700 p-8">
      <h2 className="text-2xl font-bold text-cyan-400 mb-6">Step B: Medical History</h2>
      
      <form onSubmit={handleSubmit((formData) => onNext({ medical: formData }))} className="space-y-6">
        <div>
          <Label htmlFor="conditions" className="text-slate-300">
            Current Medical Conditions
          </Label>
          <Select onValueChange={(value) => setValue('conditions', value as any)} value={conditions}>
            <SelectTrigger className="bg-slate-900 border-slate-600 text-slate-100 mt-2">
              <SelectValue placeholder="Select a condition" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">None</SelectItem>
              <SelectItem value="diabetes">Diabetes</SelectItem>
              <SelectItem value="hypertension">Hypertension (High Blood Pressure)</SelectItem>
              <SelectItem value="heart_disease">Heart Disease</SelectItem>
              <SelectItem value="thyroid_disorder">Thyroid Disorder</SelectItem>
              <SelectItem value="autoimmune">Autoimmune Condition</SelectItem>
              <SelectItem value="mental_health">Mental Health Condition</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
          {errors.conditions && <p className="text-red-400 text-sm mt-1">{errors.conditions.message}</p>}
        </div>

        <div>
          <Label htmlFor="medications" className="text-slate-300">
            Current Medications
          </Label>
          <Select onValueChange={(value) => setValue('medications', value as any)} value={medications}>
            <SelectTrigger className="bg-slate-900 border-slate-600 text-slate-100 mt-2">
              <SelectValue placeholder="Select medication type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">None</SelectItem>
              <SelectItem value="blood_pressure">Blood Pressure Medication</SelectItem>
              <SelectItem value="diabetes">Diabetes Medication</SelectItem>
              <SelectItem value="thyroid">Thyroid Medication</SelectItem>
              <SelectItem value="antidepressants">Antidepressants/Mental Health</SelectItem>
              <SelectItem value="pain_medication">Pain Medication</SelectItem>
              <SelectItem value="supplements_only">Supplements Only</SelectItem>
              <SelectItem value="other">Other Prescription Medication</SelectItem>
            </SelectContent>
          </Select>
          {errors.medications && <p className="text-red-400 text-sm mt-1">{errors.medications.message}</p>}
        </div>

        <div>
          <Label htmlFor="allergies" className="text-slate-300">
            Known Allergies
          </Label>
          <Select onValueChange={(value) => setValue('allergies', value as any)} value={allergies}>
            <SelectTrigger className="bg-slate-900 border-slate-600 text-slate-100 mt-2">
              <SelectValue placeholder="Select allergy type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">None</SelectItem>
              <SelectItem value="food_allergies">Food Allergies</SelectItem>
              <SelectItem value="drug_allergies">Drug/Medication Allergies</SelectItem>
              <SelectItem value="environmental">Environmental Allergies</SelectItem>
              <SelectItem value="multiple">Multiple Types</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
          {errors.allergies && <p className="text-red-400 text-sm mt-1">{errors.allergies.message}</p>}
        </div>

        <div className="flex gap-4 pt-4">
          <Button type="button" onClick={onBack} variant="outline" className="border-slate-600">
            Back
          </Button>
          <Button type="submit" className="flex-1 bg-cyan-600 hover:bg-cyan-700">
            Next
          </Button>
        </div>
      </form>
    </Card>
  );
}

// Step C: Lifestyle
function StepC({ data, onNext, onBack, showBack }: any) {
  const { handleSubmit, formState: { errors }, setValue, watch } = useForm<LifestyleData>({
    resolver: zodResolver(lifestyleSchema),
    defaultValues: data.lifestyle || {},
  });

  const sleep = watch('sleep');
  const exercise = watch('exercise');
  const alcohol = watch('alcohol');

  return (
    <Card className="bg-slate-800/50 border-slate-700 p-8">
      <h2 className="text-2xl font-bold text-cyan-400 mb-6">Step C: Lifestyle</h2>
      
      <form onSubmit={handleSubmit((formData) => onNext({ lifestyle: formData }))} className="space-y-6">
        <div>
          <Label htmlFor="sleep" className="text-slate-300">
            Sleep Patterns (Hours per Night)
          </Label>
          <Select onValueChange={(value) => setValue('sleep', value as any)} value={sleep}>
            <SelectTrigger className="bg-slate-900 border-slate-600 text-slate-100 mt-2">
              <SelectValue placeholder="Select sleep duration" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="less_than_5">Less than 5 hours</SelectItem>
              <SelectItem value="5_to_6">5-6 hours</SelectItem>
              <SelectItem value="6_to_7">6-7 hours</SelectItem>
              <SelectItem value="7_to_8">7-8 hours</SelectItem>
              <SelectItem value="more_than_8">More than 8 hours</SelectItem>
              <SelectItem value="irregular">Irregular/Varies greatly</SelectItem>
            </SelectContent>
          </Select>
          {errors.sleep && <p className="text-red-400 text-sm mt-1">{errors.sleep.message}</p>}
        </div>

        <div>
          <Label htmlFor="exercise" className="text-slate-300">
            Exercise Habits
          </Label>
          <Select onValueChange={(value) => setValue('exercise', value as any)} value={exercise}>
            <SelectTrigger className="bg-slate-900 border-slate-600 text-slate-100 mt-2">
              <SelectValue placeholder="Select exercise level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sedentary">Sedentary - Little to no exercise</SelectItem>
              <SelectItem value="light_1_2x_week">Light - 1-2 times per week</SelectItem>
              <SelectItem value="moderate_3_4x_week">Moderate - 3-4 times per week</SelectItem>
              <SelectItem value="active_5_6x_week">Active - 5-6 times per week</SelectItem>
              <SelectItem value="very_active_daily">Very Active - Daily exercise</SelectItem>
              <SelectItem value="athlete">Athlete - Training multiple times daily</SelectItem>
            </SelectContent>
          </Select>
          {errors.exercise && <p className="text-red-400 text-sm mt-1">{errors.exercise.message}</p>}
        </div>

        <div>
          <Label htmlFor="alcohol" className="text-slate-300">
            Alcohol Consumption
          </Label>
          <Select onValueChange={(value) => setValue('alcohol', value as any)} value={alcohol}>
            <SelectTrigger className="bg-slate-900 border-slate-600 text-slate-100 mt-2">
              <SelectValue placeholder="Select alcohol consumption" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">None</SelectItem>
              <SelectItem value="occasional_1_2_monthly">Occasional - 1-2 times per month</SelectItem>
              <SelectItem value="light_1_2_weekly">Light - 1-2 drinks per week</SelectItem>
              <SelectItem value="moderate_3_5_weekly">Moderate - 3-5 drinks per week</SelectItem>
              <SelectItem value="heavy_6plus_weekly">Heavy - 6+ drinks per week</SelectItem>
              <SelectItem value="daily">Daily consumption</SelectItem>
            </SelectContent>
          </Select>
          {errors.alcohol && <p className="text-red-400 text-sm mt-1">{errors.alcohol.message}</p>}
        </div>

        <div className="flex gap-4 pt-4">
          <Button type="button" onClick={onBack} variant="outline" className="border-slate-600">
            Back
          </Button>
          <Button type="submit" className="flex-1 bg-cyan-600 hover:bg-cyan-700">
            Next
          </Button>
        </div>
      </form>
    </Card>
  );
}

// Step D: Goals
function StepD({ data, onNext, onBack, showBack }: any) {
  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<GoalsData>({
    resolver: zodResolver(goalsSchema),
    defaultValues: data.goals || { selectedGoals: [], customGoal: '' },
  });

  const [selectedGoals, setSelectedGoals] = useState<string[]>(data.goals?.selectedGoals || []);

  const handleGoalToggle = (goal: string) => {
    const updated = selectedGoals.includes(goal)
      ? selectedGoals.filter(g => g !== goal)
      : [...selectedGoals, goal];
    setSelectedGoals(updated);
    setValue('selectedGoals', updated);
  };

  return (
    <Card className="bg-slate-800/50 border-slate-700 p-8">
      <h2 className="text-2xl font-bold text-cyan-400 mb-6">Step D: Goals</h2>
      
      <form onSubmit={handleSubmit((formData) => onNext({ goals: { ...formData, selectedGoals } }))} className="space-y-6">
        <div>
          <Label className="text-slate-300 mb-3 block">
            Select your health and wellness goals (choose at least one):
          </Label>
          <div className="space-y-3">
            {GOAL_OPTIONS.map((goal) => (
              <div key={goal} className="flex items-start gap-3 p-3 bg-slate-900/50 rounded-lg">
                <Checkbox
                  id={goal}
                  checked={selectedGoals.includes(goal)}
                  onCheckedChange={() => handleGoalToggle(goal)}
                  className="mt-1"
                />
                <Label htmlFor={goal} className="text-slate-300 cursor-pointer flex-1">
                  {goal}
                </Label>
              </div>
            ))}
          </div>
          {errors.selectedGoals && (
            <p className="text-red-400 text-sm mt-2">{errors.selectedGoals.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="customGoal" className="text-slate-300">
            Additional Goals or Notes (Optional)
          </Label>
          <Textarea
            id="customGoal"
            {...register('customGoal')}
            className="bg-slate-900 border-slate-600 text-slate-100 mt-2 min-h-[100px]"
            placeholder="Describe any additional goals or specific outcomes you'd like to achieve"
          />
        </div>

        <div className="flex gap-4 pt-4">
          <Button type="button" onClick={onBack} variant="outline" className="border-slate-600">
            Back
          </Button>
          <Button type="submit" className="flex-1 bg-cyan-600 hover:bg-cyan-700">
            Complete & Continue
          </Button>
        </div>
      </form>
    </Card>
  );
}

