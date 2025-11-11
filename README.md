# FreshPeptide - Research & Educational Peptide Platform

A comprehensive web application demonstrating a full-stack peptide research platform with AI-powered educational brief generation.

## 🚀 Features

- **Multi-step Health Intake**: Comprehensive questionnaire covering demographics, medical history, lifestyle, and goals
- **AI-Powered Analysis**: Server-side AI generates educational briefs mapping user goals to research-backed peptides
- **Searchable Library**: Curated database of peptides with mechanisms, regulatory status, and evidence
- **Auto-save Functionality**: Intake data automatically saves to prevent data loss
- **Mock AI Provider**: Toggle between real AI and deterministic mock responses for testing
- **Dark Theme**: Professional dark aesthetic throughout the application
- **Persistent Safety Banner**: "RESEARCH / DEMO PURPOSES ONLY" disclaimer on all pages

## 🛠️ Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: TailwindCSS + Shadcn/ui components
- **Forms**: React Hook Form + Zod validation
- **Backend**: Supabase (for production) / localStorage (for demo)
- **AI Integration**: OpenAI API (configurable, with mock provider option)

## 📁 Project Structure

```
freshpeptide/
├── app/
│   ├── page.tsx              # Landing page
│   ├── auth/                 # Authentication page
│   ├── consent/              # Consent acknowledgment
│   ├── intake/               # Multi-step intake form
│   ├── generate/             # AI brief generation
│   ├── dashboard/            # User dashboard
│   ├── library/              # Peptide library
│   ├── account/              # Account settings
│   └── api/
│       └── generate-brief/   # Server-side AI endpoint
├── components/
│   ├── ResearchBanner.tsx    # Safety disclaimer banner
│   ├── MainLayout.tsx        # Main layout wrapper
│   └── ui/                   # Shadcn UI components
├── lib/
│   ├── supabase.ts           # Supabase client & types
│   ├── schemas.ts            # Zod validation schemas
│   └── utils.ts              # Utility functions
├── database-schema.sql       # Supabase database schema
└── .env.local                # Environment variables
```

## 🚦 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone and navigate to the project:**

```bash
cd freshpeptide
```

2. **Install dependencies:**

```bash
npm install
```

3. **Configure environment variables:**

Create a `.env.local` file (or copy from `.env.local.example`):

```env
# For demo mode (using mock AI)
USE_MOCK_AI=true

# For production (using real Supabase and AI)
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
OPENAI_API_KEY=your-openai-api-key
USE_MOCK_AI=false
```

4. **Run the development server:**

```bash
npm run dev
```

5. **Open your browser:**

Navigate to [http://localhost:3000](http://localhost:3000)

## 📊 Database Setup (Production)

### Supabase Setup

1. Create a new Supabase project at [supabase.com](https://supabase.com)

2. Run the SQL schema in your Supabase SQL editor:

```bash
# Copy contents of database-schema.sql and run in Supabase SQL Editor
```

3. Update your `.env.local` with your Supabase credentials

4. Enable Email authentication in Supabase Auth settings

### Database Schema

The application uses the following tables:

- **profiles**: User profile information
- **intake**: Health intake data (JSONB)
- **briefs**: AI-generated educational briefs (JSONB)
- **peptides**: Peptide library with mechanisms and evidence

## 🤖 AI Integration

### Mock AI Provider (Default)

Set `USE_MOCK_AI=true` in `.env.local` to use deterministic mock responses for testing without API costs.

### Real AI Provider (OpenAI)

1. Get an OpenAI API key from [platform.openai.com](https://platform.openai.com)
2. Set `USE_MOCK_AI=false` and add `OPENAI_API_KEY=sk-...` to `.env.local`
3. The system uses GPT-4 with a strict educational prompt

### AI System Prompt

The AI follows a mandatory system prompt that:
- Maps goals to research-backed peptide classes
- Explains mechanisms at a high level
- Lists adverse effects and contraindications
- Provides evidence citations
- Includes recommended dosages with clear educational framing

## 🎯 User Flow

1. **Landing Page** (`/`) - Overview and CTA
2. **Authentication** (`/auth`) - Simple email sign-in
3. **Consent** (`/consent`) - Research acknowledgment checkboxes
4. **Intake** (`/intake`) - 4-step questionnaire:
   - Step A: Demographics (age, sex, height, weight)
   - Step B: Medical history (conditions, medications, allergies)
   - Step C: Lifestyle (sleep, exercise, alcohol)
   - Step D: Goals (select from list + custom)
5. **Generate** (`/generate`) - AI brief generation
6. **Dashboard** (`/dashboard`) - View intake summary and brief
7. **Library** (`/library`) - Browse searchable peptide database
8. **Account** (`/account`) - Manage profile and data

## 🔒 Safety Features

### Non-Negotiable Safeguards

- ⚠️ Persistent "RESEARCH / DEMO PURPOSES ONLY" banner on all pages
- ✅ Mandatory consent checkboxes before intake
- 🔒 Server-side AI calls (API keys never exposed to client)
- 📋 Comprehensive disclaimers on all AI-generated content
- 🚫 Clear "NOT MEDICAL ADVICE" messaging throughout

### Data Security

- All sensitive operations happen server-side
- API keys stored in environment variables
- Row-level security (RLS) policies in Supabase
- User data isolated by auth user ID

## 🧪 Testing

### Manual Testing

1. Complete the full user flow from landing to dashboard
2. Test autosave by refreshing during intake
3. Test search functionality in the library
4. Test data clearing and reset functions

### Mock AI Testing

The mock provider returns deterministic responses, perfect for:
- UI/UX testing
- Form validation testing
- Integration testing without API costs

## 📝 Development Notes

### Current Demo Mode

The application currently uses **localStorage** for demo purposes:
- Authentication is simulated
- Data persists in browser storage
- No actual Supabase connection required

### Production Migration

To move to production with Supabase:

1. Uncomment Supabase client calls in:
   - `app/api/generate-brief/route.ts`
   - Add auth middleware for protected routes
   - Replace localStorage with Supabase queries

2. Implement actual Supabase Auth:
   - Replace mock auth in `/auth` page
   - Add auth middleware
   - Implement proper session management

3. Set up Row Level Security (RLS) policies in Supabase

## 🎨 Customization

### Theme Colors

The application uses a dark aesthetic with cyan accents:
- Primary: Cyan-400 (#22D3EE)
- Background: Slate-900 (#0F172A)
- Cards: Slate-800 with transparency

Modify in `app/globals.css` and component className props.

### Peptide Library

Add more peptides by updating the `PEPTIDES` array in `app/library/page.tsx` or by inserting into the Supabase `peptides` table.

## 📦 Build & Deploy

### Build for production:

```bash
npm run build
```

### Deploy to Vercel:

```bash
vercel deploy
```

### Environment Variables in Production:

Set these in your hosting platform:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `OPENAI_API_KEY`
- `USE_MOCK_AI`

## 🚨 Important Disclaimers

This platform is designed for **RESEARCH AND DEMONSTRATION PURPOSES ONLY**:

- ❌ Not intended for actual medical use
- ❌ Does not provide medical advice
- ❌ AI outputs are educational only
- ❌ Many peptides are research-only substances
- ✅ Always consult qualified healthcare professionals

## 📄 License

This is a demonstration project. Please ensure compliance with applicable regulations if adapting for real-world use.

## 🤝 Contributing

This is a demonstration scaffold. For production use:
1. Implement proper authentication
2. Add comprehensive error handling
3. Add logging and monitoring
4. Implement rate limiting
5. Add automated testing
6. Add HIPAA compliance measures (if handling real health data)

## 📧 Support

This is a demonstration project created as a prototype. For questions about implementation, refer to the code comments and structure.

---

**Built with Next.js 15, TypeScript, TailwindCSS, and Shadcn/ui**
