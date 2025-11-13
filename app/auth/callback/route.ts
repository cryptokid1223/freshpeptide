import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET(request: Request) {
  try {
    const requestUrl = new URL(request.url);
    const code = requestUrl.searchParams.get('code');

    if (code) {
      // Create a new supabase client for the server
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );

      // Exchange the code for a session
      const { data, error } = await supabase.auth.exchangeCodeForSession(code);

      if (error) {
        console.error('Auth callback error:', error);
        return NextResponse.redirect(new URL('/auth?error=verification_failed', request.url));
      }

      if (data.user) {
        // Profile is created automatically by database trigger
        // Check if user has completed intake
        const { data: intakeRecord } = await supabase
          .from('intake')
          .select('intake_data')
          .eq('user_id', data.user.id)
          .maybeSingle();

        const intake = intakeRecord?.intake_data;
        const hasCompletedIntake = intake && 
          intake.demographics && 
          intake.medical && 
          intake.lifestyle && 
          intake.dietary &&
          intake.stress &&
          intake.recovery &&
          intake.goals &&
          intake.experience;

        if (hasCompletedIntake) {
          // User has completed intake, go to dashboard
          return NextResponse.redirect(new URL('/dashboard', request.url));
        }
      }
    }

    // New user or hasn't completed intake, go to consent first
    return NextResponse.redirect(new URL('/consent', request.url));
  } catch (error) {
    console.error('Callback route error:', error);
    return NextResponse.redirect(new URL('/auth?error=callback_failed', request.url));
  }
}

