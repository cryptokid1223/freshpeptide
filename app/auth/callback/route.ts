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
    }
  }

  // Redirect to consent page after successful auth
  return NextResponse.redirect(new URL('/consent', request.url));
}

