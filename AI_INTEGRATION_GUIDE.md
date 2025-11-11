# AI Integration Guide - ChatGPT-Powered Peptide Analysis

## 🎉 What's New

Your FreshPeptide application now has a **comprehensive AI-powered analysis system** that uses OpenAI's GPT-4o to create personalized peptide recommendations based on user health data.

## ✨ Features

The AI system now provides:

### 1. **Complete User Profile Analysis**
- Analyzes demographics (age, sex, height, weight)
- Reviews medical conditions and current medications
- Considers allergies and contraindications
- Evaluates lifestyle factors (sleep, exercise, alcohol)
- Understands user's specific health and wellness goals

### 2. **Personalized Peptide Stacks**
- Creates custom 2-4 peptide combinations tailored to the user
- Names the stack based on user's goals
- Explains why this specific combination was chosen
- Details how peptides work synergistically

### 3. **Detailed Peptide Information**
For each peptide, the AI provides:
- **Full name and description**
- **Why it's recommended** for this specific user
- **Mechanism of action** - how it works in the body
- **Detailed background** - history and research status
- **Exact dosage recommendations** with units (mcg, mg, IU)
- **Precise timing instructions**:
  - Frequency (daily, weekly, etc.)
  - Time of day (morning, bedtime, post-workout)
  - Food interactions (with/without food)
  - Cycle duration (when to take breaks)
- **Potential benefits** - 4-6 specific benefits
- **Side effects** - 3-6 possible side effects to monitor

### 4. **Medical Research & Evidence**
- 4-6 **real peer-reviewed research articles**
- Article titles, publication years, and journals
- Detailed summaries of research findings
- **Direct PubMed links** to access full research

### 5. **Personalized Medical Considerations**
- **Drug interactions** - specific to user's medications
- **Contraindications** - based on user's health conditions
- **Monitoring recommendations** - labs and tests to track

### 6. **Safety & Risk Assessment**
- Comprehensive list of risks specific to user's profile
- Warnings about contraindications
- Emphasis on medical supervision requirements

## 🚀 How to Use It

### Option 1: Testing with Mock AI (No API Key Required)

1. The app is already configured with `USE_MOCK_AI=true`
2. Just run `npm run dev`
3. Go through the questionnaire
4. Click "Generate Peptide Stack"
5. You'll see enhanced mock data with all features

### Option 2: Using Real AI (OpenAI GPT-4o)

#### Step 1: Get OpenAI API Key
1. Go to [https://platform.openai.com/api-keys](https://platform.openai.com/api-keys)
2. Sign up or log in
3. Click "Create new secret key"
4. Copy your API key

#### Step 2: Create `.env.local` File
Create a file called `.env.local` in the root directory:

```bash
# OpenAI Configuration
OPENAI_API_KEY=sk-your-actual-api-key-here
USE_MOCK_AI=false

# Optional: Supabase (for production)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key
```

#### Step 3: Restart Server
```bash
# Stop current server (Ctrl+C)
npm run dev
```

#### Step 4: Test It Out
1. Complete the intake questionnaire with real answers
2. Click "Generate Peptide Stack"
3. Wait 10-30 seconds for AI analysis
4. Review your personalized peptide stack!

## 💰 Cost Information

OpenAI API costs are very affordable:
- **Typical cost per generation**: $0.03 - $0.10
- **Model used**: GPT-4o (latest and most capable)
- **Tokens per request**: ~3000-4000 tokens
- You only pay for what you use

## 🔍 What the AI Analyzes

The AI receives and analyzes ALL of this information:

```
DEMOGRAPHICS:
- Age, Sex, Height, Weight

MEDICAL HISTORY:
- Current Medical Conditions (None, Diabetes, Hypertension, etc.)
- Current Medications (None, Blood Pressure meds, etc.)
- Known Allergies (None, Food, Drug, Environmental, etc.)

LIFESTYLE:
- Sleep Patterns (hours per night)
- Exercise Habits (sedentary to athlete level)
- Alcohol Consumption (none to daily)

GOALS:
- Muscle growth and recovery
- Fat loss and metabolism
- Cognitive enhancement
- Anti-aging and longevity
- Injury recovery
- Immune support
- Sleep quality
- Stress reduction
- Sexual health
- Skin health
- Plus any custom goals
```

## 📊 Example Output

Here's what a user receives:

### Your Personalized Analysis
Detailed analysis of how their specific profile aligns with peptide research.

### 🎯 Recovery & Performance Stack
- **Description**: Why this combination was chosen
- **Synergies**: How peptides work together

### Peptide #1: BPC-157
- **Why Recommended**: Matches injury recovery goals
- **About**: History and research background
- **Mechanism**: How it works in the body
- **Dosage**: 250-500 mcg daily
- **Timing**:
  - Frequency: Once daily
  - Time: Morning or post-workout
  - With Food: Can take with or without
  - Cycle: 4-8 weeks, then 2-4 week break
- **Benefits**: Enhanced healing, reduced inflammation, etc.
- **Side Effects**: Injection site reactions, etc.

*(Repeated for 2-4 peptides)*

### 🏥 Medical Considerations
- Drug interactions with their specific medications
- Contraindications based on their conditions
- Monitoring recommendations for their profile

### 📚 Scientific Evidence
4-6 research articles with:
- Full citation
- Journal name
- Summary of findings
- **Direct link to PubMed**

## 🛡️ Safety Features

The AI is instructed to:
1. ✅ Always emphasize educational purpose
2. ✅ Require medical supervision
3. ✅ Consider contraindications
4. ✅ Warn about drug interactions
5. ✅ Provide comprehensive risk disclosure
6. ✅ Include monitoring recommendations
7. ✅ Reference real medical research

## 🔧 Customization

### Modify the AI Prompt
Edit `/app/api/generate-brief/route.ts` in the `systemPrompt` section to:
- Change the tone
- Add more specific instructions
- Focus on different aspects
- Adjust the format

### Change AI Model
In the same file, change the model:
```typescript
model: 'gpt-4o', // or 'gpt-4', 'gpt-3.5-turbo'
```

### Adjust Response Length
```typescript
max_tokens: 4000, // increase for more detail
```

## 📱 UI Features

The updated interface displays:
- Color-coded sections (cyan for info, green for benefits, amber for warnings)
- Organized cards for each peptide
- Collapsible sections for better readability
- Direct links to research articles
- Clear dosing and timing schedules
- Prominent safety warnings

## 🐛 Troubleshooting

### "OpenAI API key not configured"
- Make sure `.env.local` exists in root directory
- Check `OPENAI_API_KEY` is set correctly
- Restart the dev server after creating `.env.local`

### "Failed to generate brief"
- Check your API key is valid
- Ensure you have credits in your OpenAI account
- Check the terminal for detailed error messages
- Try with `USE_MOCK_AI=true` to test without API

### API is too slow
- This is normal - AI analysis takes 10-30 seconds
- GPT-4o is slower but more accurate than GPT-3.5
- Consider caching responses for repeated queries

### Costs are too high
- Use mock AI for testing/demos
- Switch to `gpt-3.5-turbo` for lower costs
- Add caching to prevent duplicate generations
- Reduce `max_tokens` if responses are too long

## 📚 Technical Details

### Files Modified
1. `/lib/supabase.ts` - Updated types for enhanced data
2. `/app/api/generate-brief/route.ts` - Comprehensive AI prompt
3. `/app/generate/page.tsx` - Enhanced UI display
4. `/package.json` - Added OpenAI SDK

### New Dependencies
- `openai` - Official OpenAI Node.js SDK

### Data Flow
1. User completes intake questionnaire
2. Data saved to localStorage (and Supabase in production)
3. User clicks "Generate Peptide Stack"
4. Frontend sends data to `/api/generate-brief`
5. Backend formats data and sends to OpenAI
6. OpenAI analyzes and returns structured JSON
7. Backend returns to frontend
8. UI displays comprehensive results

## 🎯 Next Steps

### For Development
1. Test with mock AI first
2. Get OpenAI API key when ready
3. Test with real AI using your own profile
4. Customize the prompt for your use case
5. Deploy to production

### For Production
1. Add rate limiting to prevent abuse
2. Implement caching for common queries
3. Add user authentication (Supabase)
4. Save briefs to database for history
5. Add cost monitoring and limits
6. Implement error tracking (Sentry, etc.)

## 📖 Additional Resources

- **OpenAI Documentation**: [platform.openai.com/docs](https://platform.openai.com/docs)
- **ENV Setup Guide**: See `ENV_SETUP.md`
- **General Setup**: See `SETUP.md`
- **Supabase Integration**: See `SUPABASE_INTEGRATION.md`

## ⚠️ Important Disclaimers

This AI integration:
- ✅ Provides educational information only
- ✅ Is NOT medical advice
- ✅ Requires medical professional oversight
- ✅ Should not be used for self-diagnosis or treatment
- ✅ Is for research and demonstration purposes

Always emphasize to users that they must consult healthcare professionals before making any health-related decisions.

---

## 💡 Pro Tips

1. **Detailed Questionnaires = Better Results**: The more accurate the user input, the better the AI recommendations
2. **Test Thoroughly**: Always test with various profiles before production
3. **Monitor Costs**: Set up billing alerts in OpenAI dashboard
4. **Cache Results**: Save generated briefs to avoid duplicate API calls
5. **Customize Prompts**: Tailor the AI instructions to your specific needs
6. **Keep Updated**: OpenAI regularly improves models - stay updated

---

**Need Help?** Check the troubleshooting section or review the code comments in `/app/api/generate-brief/route.ts`

