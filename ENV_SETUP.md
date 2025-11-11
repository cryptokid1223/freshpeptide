# Environment Variables Setup

To use the AI-powered peptide analysis, you need to configure your environment variables.

## Step 1: Create `.env.local` file

Create a new file in the root directory called `.env.local` and add the following:

```bash
# OpenAI API Configuration
# Get your API key from: https://platform.openai.com/api-keys
OPENAI_API_KEY=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

# Set to 'true' to use mock AI for testing without API key
# Set to 'false' to use real OpenAI API
USE_MOCK_AI=false

# Supabase Configuration (Optional - for production)
NEXT_PUBLIC_SUPABASE_URL=https://qzdeinzdrwamwczdnnau.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF6ZGVpbnpkcndhbXdjemRubmF1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI4ODIyOTgsImV4cCI6MjA3ODQ1ODI5OH0.fCW_Ipc7XVUzihJGrQ_g1VzLhXeDj3RNoeM4KpXrmw4
```

## Step 2: Get Your OpenAI API Key

1. Go to [OpenAI Platform](https://platform.openai.com/api-keys)
2. Sign in or create an account
3. Click "Create new secret key"
4. Copy the key and replace `your_openai_api_key_here` in your `.env.local` file
5. Set `USE_MOCK_AI=false` to use the real AI

## Step 3: Testing Without API Key

If you want to test the application without setting up OpenAI:
- Keep `USE_MOCK_AI=true` in your `.env.local` file
- The app will use mock data instead of calling the OpenAI API

## Step 4: Restart Development Server

After creating/updating your `.env.local` file:
```bash
# Stop the current server (Ctrl+C)
npm run dev
```

## Important Notes

- Never commit your `.env.local` file to git (it's already in `.gitignore`)
- The OpenAI API is paid (but very affordable - typically $0.03-0.10 per generation)
- Using GPT-4o model for best results
- Keep your API key secure and never share it publicly

