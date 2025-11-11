import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET(request: Request) {
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

    if (!error && data.user) {
      // Create profile if it doesn't exist
      await supabase
        .from('profiles')
        .upsert(
          { id: data.user.id, email: data.user.email },
          { onConflict: 'id' }
        );

      // Check if user has completed intake
      const { data: intakeData } = await supabase
        .from('intake')
        .select('intake_data')
        .eq('user_id', data.user.id)
        .single();

      if (intakeData?.intake_data && Object.keys(intakeData.intake_data).length > 0) {
        // User has completed intake, go to dashboard
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }
    }
  }

  // New user or hasn't completed intake, go to consent
  return NextResponse.redirect(new URL('/consent', request.url));
}

