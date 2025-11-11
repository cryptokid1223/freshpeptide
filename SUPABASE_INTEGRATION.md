# Supabase Integration Guide

This guide will help you connect FreshPeptide to Supabase for production use.

## Overview

Currently, FreshPeptide uses **localStorage** for demo purposes. This guide shows how to integrate with Supabase for:
- Real user authentication
- Persistent data storage
- Row-level security
- Real-time updates (optional)

---

## Step 1: Set Up Supabase Project

### 1.1 Create Project

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click "New Project"
3. Choose organization and enter project details:
   - **Name:** freshpeptide (or your choice)
   - **Database Password:** Save this securely
   - **Region:** Choose closest to your users
   - **Pricing Plan:** Free tier is sufficient for testing

### 1.2 Run Database Schema

1. In Supabase Dashboard, go to **SQL Editor**
2. Click **New Query**
3. Copy the entire contents of `database-schema.sql`
4. Paste and click **Run**
5. Verify tables were created:
   - Go to **Table Editor**
   - You should see: `profiles`, `intake`, `briefs`, `peptides`

### 1.3 Get API Credentials

1. Go to **Settings** > **API**
2. Copy these values:
   - **Project URL:** `https://xxxxx.supabase.co`
   - **anon/public key:** `eyJhbGc...` (long string)

---

## Step 2: Configure Environment Variables

Update your `.env.local` file:

```env
# Replace with your Supabase credentials
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# AI Configuration
OPENAI_API_KEY=sk-your-key-here
USE_MOCK_AI=false  # Set to true to keep using mock AI
```

**Restart your dev server** after changing environment variables.

---

## Step 3: Enable Authentication

### 3.1 Configure Supabase Auth

1. Go to **Authentication** > **Providers**
2. Enable **Email** provider
3. Configure settings:
   - Enable "Confirm Email": OFF (for easier testing) or ON (for production)
   - Enable "Secure Email Change": ON
   - Enable "Secure Password Change": ON

### 3.2 Configure Email Templates (Optional)

Go to **Authentication** > **Email Templates** to customize:
- Confirmation email
- Magic Link email
- Password reset email

---

## Step 4: Update Application Code

### 4.1 Create Authentication Helper

Create `lib/auth.ts`:

```typescript
import { supabase } from './supabase';

export async function signInWithEmail(email: string) {
  const { data, error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${window.location.origin}/consent`,
    },
  });

  if (error) throw error;
  return data;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function getCurrentUser() {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) throw error;
  return user;
}

export async function getSession() {
  const { data: { session }, error } = await supabase.auth.getSession();
  if (error) throw error;
  return session;
}
```

### 4.2 Update Auth Page

Replace the contents of `app/auth/page.tsx` with:

```typescript
'use client';

import React, { useState } from 'react';
import { MainLayout } from '@/components/MainLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { signInWithEmail } from '@/lib/auth';

export default function AuthPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    try {
      await signInWithEmail(email);
      setMessage('Check your email for a magic link!');
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto">
          <Card className="bg-slate-800/50 border-slate-700 p-8">
            <h1 className="text-3xl font-bold text-cyan-400 mb-2 text-center">
              Welcome to FreshPeptide
            </h1>
            <p className="text-slate-400 text-center mb-8">
              Sign in with your email
            </p>

            <form onSubmit={handleSignIn} className="space-y-4">
              <div>
                <Label htmlFor="email" className="text-slate-300">
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-slate-900 border-slate-600 text-slate-100 mt-2"
                />
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-cyan-600 hover:bg-cyan-700 text-white"
              >
                {isLoading ? 'Sending link...' : 'Send Magic Link'}
              </Button>
            </form>

            {message && (
              <div className="mt-4 p-4 bg-blue-900/20 border border-blue-700 rounded-lg">
                <p className="text-sm text-slate-300">{message}</p>
              </div>
            )}
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}
```

### 4.3 Create Auth Middleware

Create `middleware.ts` in the root directory:

```typescript
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Protect routes that require authentication
  const protectedRoutes = ['/consent', '/intake', '/generate', '/dashboard', '/account'];
  const isProtectedRoute = protectedRoutes.some(route => 
    req.nextUrl.pathname.startsWith(route)
  );

  if (isProtectedRoute && !session) {
    const redirectUrl = req.nextUrl.clone();
    redirectUrl.pathname = '/auth';
    return NextResponse.redirect(redirectUrl);
  }

  return res;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
```

### 4.4 Update Intake Page for Auto-Save

Modify the `saveData` function in `app/intake/page.tsx`:

```typescript
const saveData = async (data: any) => {
  setIsSaving(true);
  const updatedData = { ...intakeData, ...data };
  setIntakeData(updatedData);
  
  // Save to localStorage (for immediate feedback)
  localStorage.setItem('intake_data', JSON.stringify(updatedData));
  
  // Save to Supabase
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { error } = await supabase
        .from('intake')
        .upsert({
          user_id: user.id,
          intake_data: updatedData,
          updated_at: new Date().toISOString(),
        }, {
          onConflict: 'user_id'
        });
      
      if (error) throw error;
    }
  } catch (error) {
    console.error('Error saving to Supabase:', error);
  }
  
  setLastSaved(new Date());
  setTimeout(() => setIsSaving(false), 500);
};
```

### 4.5 Update API Route for Brief Generation

Modify `app/api/generate-brief/route.ts`:

```typescript
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { createHash } from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    
    // Verify authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { intakeData } = await request.json();

    // Generate brief (using mock or real AI)
    const useMockAI = process.env.USE_MOCK_AI === 'true';
    let brief: BriefOutput;
    
    if (useMockAI) {
      brief = generateMockBrief(intakeData);
    } else {
      brief = await generateRealBrief(intakeData);
    }

    // Save to Supabase
    const { data, error } = await supabase
      .from('briefs')
      .insert({
        user_id: user.id,
        brief_output: brief,
        model_name: useMockAI ? 'mock' : 'gpt-4',
        input_hash: createHash('md5').update(JSON.stringify(intakeData)).digest('hex'),
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({
      success: true,
      brief,
      model: useMockAI ? 'mock' : 'gpt-4',
    });
  } catch (error) {
    console.error('Error generating brief:', error);
    return NextResponse.json(
      { error: 'Failed to generate brief' },
      { status: 500 }
    );
  }
}
```

---

## Step 5: Test the Integration

### 5.1 Test Authentication

1. Start your dev server: `npm run dev`
2. Navigate to `/auth`
3. Enter your email
4. Check your email for the magic link
5. Click the link to authenticate
6. Verify you're redirected to `/consent`

### 5.2 Test Data Persistence

1. Complete the intake form
2. Check Supabase Table Editor > `intake` table
3. You should see your data stored

### 5.3 Test Brief Generation

1. Generate a brief
2. Check Supabase Table Editor > `briefs` table
3. Verify the brief was saved

---

## Step 6: Row Level Security (RLS)

The database schema includes RLS policies. To verify they're working:

### Test User Can Only See Their Own Data

1. Sign in as User A
2. Complete intake and generate brief
3. Sign out and sign in as User B
4. Complete intake and generate brief
5. Verify User B cannot see User A's data

### Policies Applied:

- **profiles:** Users can view/update only their own profile
- **intake:** Users can view/insert/update only their own intake
- **briefs:** Users can view/insert only their own briefs
- **peptides:** All authenticated users can read peptides

---

## Step 7: Optional Enhancements

### 7.1 Real-time Updates

Enable real-time subscriptions for live updates:

```typescript
const subscription = supabase
  .channel('intake-changes')
  .on('postgres_changes', 
    { 
      event: 'UPDATE', 
      schema: 'public', 
      table: 'intake',
      filter: `user_id=eq.${userId}`
    }, 
    (payload) => {
      console.log('Intake updated:', payload);
      setIntakeData(payload.new.intake_data);
    }
  )
  .subscribe();
```

### 7.2 Storage for Files

If you want to add file uploads (e.g., medical documents):

1. Go to **Storage** in Supabase
2. Create a bucket (e.g., `user-documents`)
3. Set policies for access control
4. Use `supabase.storage` API in your code

### 7.3 Edge Functions

For more complex server-side logic, use Supabase Edge Functions:

```bash
supabase functions new generate-brief
```

Deploy:

```bash
supabase functions deploy generate-brief
```

---

## Troubleshooting

### RLS Errors

If you see "row-level security policy" errors:
1. Check policies in Supabase Dashboard > Authentication > Policies
2. Verify `auth.uid()` matches the user_id in your tables
3. Test queries in SQL Editor with `auth.uid()` function

### Authentication Issues

If magic links don't work:
1. Check Supabase logs: Dashboard > Logs
2. Verify email settings in Authentication > Settings
3. Check spam folder for emails
4. Try with "Confirm Email" disabled for testing

### Migration Issues

If you need to modify the schema:
1. Make changes in Supabase SQL Editor
2. Download schema: `supabase db dump -f schema.sql`
3. Version control your schema changes

---

## Production Checklist

Before going live:

- [ ] Enable "Confirm Email" in Auth settings
- [ ] Set up custom SMTP for emails (Authentication > Settings > SMTP)
- [ ] Review and tighten RLS policies
- [ ] Enable database backups (automatic on paid plans)
- [ ] Set up monitoring and alerts
- [ ] Configure rate limiting
- [ ] Add proper error logging (e.g., Sentry)
- [ ] Test all user flows end-to-end
- [ ] Review Supabase security checklist

---

## Resources

- [Supabase Auth Docs](https://supabase.com/docs/guides/auth)
- [Supabase RLS Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [Next.js + Supabase](https://supabase.com/docs/guides/getting-started/quickstarts/nextjs)
- [Supabase Client Libraries](https://supabase.com/docs/reference/javascript/introduction)

---

## Support

If you encounter issues:
1. Check Supabase Dashboard > Logs
2. Review browser console for errors
3. Check terminal logs for server errors
4. Consult Supabase Discord or GitHub discussions

