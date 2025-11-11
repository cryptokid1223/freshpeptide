# FreshPeptide Setup Guide

## Quick Start (Demo Mode)

The application is **ready to run** in demo mode with mock data. No external services required!

### 1. Start the Development Server

```bash
npm run dev
```

### 2. Open Your Browser

Navigate to: [http://localhost:3000](http://localhost:3000)

### 3. Test the Flow

1. Click "Start Questions" on the landing page
2. Enter any email address (e.g., `test@example.com`)
3. Acknowledge the consent checkboxes
4. Complete the 4-step intake form
5. Generate your peptide brief
6. Explore the dashboard and library

**That's it!** The demo uses localStorage and mock AI responses.

---

## Production Setup (Supabase + Real AI)

### Prerequisites

- [Supabase Account](https://supabase.com) (free tier available)
- [OpenAI API Key](https://platform.openai.com) (optional, for real AI)

### Step 1: Supabase Setup

1. **Create a new Supabase project** at [supabase.com](https://supabase.com)

2. **Run the database schema:**
   - Go to SQL Editor in your Supabase dashboard
   - Copy the contents of `database-schema.sql`
   - Run the SQL script

3. **Get your credentials:**
   - Go to Settings > API
   - Copy your `Project URL` and `anon/public` key

4. **Enable Email Auth:**
   - Go to Authentication > Providers
   - Enable Email provider
   - Configure email templates (optional)

### Step 2: Environment Variables

Update your `.env.local` file:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# AI Configuration
OPENAI_API_KEY=sk-your-openai-key-here
USE_MOCK_AI=false
```

### Step 3: Update Code for Production

#### A. Update Authentication (`app/auth/page.tsx`)

Replace the mock auth with real Supabase auth:

```typescript
import { supabase } from '@/lib/supabase';

const handleSignIn = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsLoading(true);

  try {
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/consent`,
      },
    });

    if (error) throw error;
    
    alert('Check your email for the login link!');
  } catch (error) {
    console.error('Auth error:', error);
  } finally {
    setIsLoading(false);
  }
};
```

#### B. Update Intake Auto-save (`app/intake/page.tsx`)

Add Supabase persistence:

```typescript
const saveData = async (data: any) => {
  setIsSaving(true);
  const updatedData = { ...intakeData, ...data };
  setIntakeData(updatedData);
  
  // Save to localStorage (for immediate feedback)
  localStorage.setItem('intake_data', JSON.stringify(updatedData));
  
  // Save to Supabase
  const { data: { user } } = await supabase.auth.getUser();
  if (user) {
    await supabase
      .from('intake')
      .upsert({
        user_id: user.id,
        intake_data: updatedData,
      });
  }
  
  setLastSaved(new Date());
  setTimeout(() => setIsSaving(false), 500);
};
```

#### C. Update API Route (`app/api/generate-brief/route.ts`)

Uncomment the Supabase save section:

```typescript
// Save to Supabase
const { data, error } = await supabase
  .from('briefs')
  .insert({
    user_id: userId,
    brief_output: brief,
    model_name: useMockAI ? 'mock' : 'gpt-4',
    input_hash: createHash('md5').update(JSON.stringify(intakeData)).digest('hex'),
  });

if (error) throw error;
```

### Step 4: Deploy

#### Deploy to Vercel (Recommended)

1. **Install Vercel CLI:**

```bash
npm i -g vercel
```

2. **Deploy:**

```bash
vercel
```

3. **Add Environment Variables:**
   - Go to your Vercel project settings
   - Add all environment variables from `.env.local`

#### Alternative: Other Platforms

The app can be deployed to:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

---

## Configuration Options

### Mock AI vs Real AI

**Mock AI (Default):**
- Set `USE_MOCK_AI=true`
- Returns deterministic responses
- No API costs
- Perfect for testing

**Real AI (OpenAI):**
- Set `USE_MOCK_AI=false`
- Requires `OPENAI_API_KEY`
- Costs ~$0.03-0.10 per generation
- Uses GPT-4o model
- Analyzes complete user profile (demographics, medical history, lifestyle, goals)
- Creates personalized peptide stacks with 2-4 peptides
- Provides detailed dosage recommendations
- Includes specific timing instructions (frequency, time of day, food interactions, cycle duration)
- Lists potential benefits and side effects for each peptide
- Includes real medical research articles with PubMed links
- Considers drug interactions with user's current medications
- Provides monitoring recommendations based on health profile

### Customizing the Peptide Library

#### In Demo Mode:

Edit the `PEPTIDES` array in `app/library/page.tsx`

#### In Production Mode:

Insert peptides directly into Supabase:

```sql
INSERT INTO peptides (slug, name, regulatory_status, summary, mechanism, evidence, common_adverse_effects, contraindications, recommended_dosage)
VALUES (
  'your-peptide-slug',
  'Peptide Name',
  'Research-only',
  'Summary text',
  'Mechanism description',
  '[{"title": "Study Title", "year": 2024, "source": "Journal Name", "summary": "Brief summary"}]',
  'Side effects',
  'Contraindications',
  'Dosage information'
);
```

---

## Troubleshooting

### Build Errors

**Issue:** TypeScript errors during build

**Solution:** Run `npm run build` to see specific errors. Most common issues:
- Missing dependencies: `npm install`
- TypeScript version conflicts: `npm install -D typescript@latest`

### Authentication Not Working

**Issue:** Sign-in doesn't redirect

**Solution:**
- Check Supabase Auth settings
- Verify email templates are configured
- Check browser console for errors

### AI Generation Fails

**Issue:** Brief generation returns error

**Solution:**
- Verify `USE_MOCK_AI=true` for demo mode
- For real AI: Check `OPENAI_API_KEY` is valid
- Check server logs in terminal

### Database Connection Issues

**Issue:** Can't connect to Supabase

**Solution:**
- Verify `NEXT_PUBLIC_SUPABASE_URL` is correct
- Verify `NEXT_PUBLIC_SUPABASE_ANON_KEY` is correct
- Check RLS policies allow operations
- Check Supabase project is active

---

## Development Tips

### Hot Reload

The dev server supports hot reload. Changes to:
- Pages and components → Instant refresh
- Environment variables → Requires server restart
- Database schema → Run migration in Supabase

### Resetting Demo Data

Clear localStorage in browser:
```javascript
localStorage.clear();
```

Or use the "Reset Demo" button in the dashboard.

### Adding New Pages

1. Create folder in `app/` directory
2. Add `page.tsx` file
3. Wrap content in `<MainLayout>`
4. Add navigation link in `MainLayout.tsx`

### Modifying AI Prompt

Edit the `systemPrompt` in `app/api/generate-brief/route.ts`

---

## Security Checklist

Before deploying to production:

- [ ] Change all default credentials
- [ ] Enable RLS policies in Supabase
- [ ] Add rate limiting to API routes
- [ ] Implement proper error logging
- [ ] Add CORS restrictions
- [ ] Enable HTTPS only
- [ ] Add authentication middleware
- [ ] Sanitize user inputs
- [ ] Add content security policy headers

---

## Support & Documentation

- **Next.js Docs:** [nextjs.org/docs](https://nextjs.org/docs)
- **Supabase Docs:** [supabase.com/docs](https://supabase.com/docs)
- **Shadcn/ui Docs:** [ui.shadcn.com](https://ui.shadcn.com)
- **React Hook Form:** [react-hook-form.com](https://react-hook-form.com)

---

## License & Disclaimer

This is a **demonstration platform** for educational purposes only. Not intended for actual medical use.

See `README.md` for full disclaimer and licensing information.

