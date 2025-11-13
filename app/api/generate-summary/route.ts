import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { supabase } from '@/lib/supabase';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
    }

    // Get week range
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    // Fetch tracking logs from the past week
    const { data: logs } = await supabase
      .from('peptide_logs')
      .select('*')
      .eq('user_id', userId)
      .gte('logged_at', weekAgo.toISOString())
      .order('logged_at', { ascending: false });

    // Fetch journal entries from the past week
    const { data: journals } = await supabase
      .from('daily_journal')
      .select('*')
      .eq('user_id', userId)
      .gte('journal_date', weekAgo.toISOString().split('T')[0])
      .order('journal_date', { ascending: false });

    // Create prompt for AI
    const systemPrompt = `You are a research analyst creating a concise weekly summary of a user's peptide tracking data.

Analyze the provided data and generate a clear, insightful summary covering:
1. Adherence patterns (consistency, frequency)
2. Reported outcomes (positive effects, observations)
3. Side effects or concerns
4. Mood/energy/sleep trends (if journal data available)

Keep the summary factual, supportive, and educational. Limit to 3-4 paragraphs.
Format as plain text, professional yet approachable.`;

    const userData = `
TRACKING LOGS (Past 7 days):
${logs && logs.length > 0 ? logs.map(log => `
- ${log.peptide_name} on ${new Date(log.logged_at).toLocaleDateString()}
  Amount: ${log.amount || 'Not specified'}
  Route: ${log.route || 'Not specified'}
  Effects: ${log.effects || 'None noted'}
  Side Effects: ${log.side_effects || 'None noted'}
  Notes: ${log.notes || 'N/A'}
`).join('\n') : 'No tracking logs this week'}

DAILY JOURNAL ENTRIES (Past 7 days):
${journals && journals.length > 0 ? journals.map(j => `
- ${new Date(j.journal_date).toLocaleDateString()}
  Mood: ${j.mood_rating}/10
  Energy: ${j.energy_rating}/10
  Sleep: ${j.sleep_quality}/10
  Notes: ${j.journal_text || 'N/A'}
`).join('\n') : 'No journal entries this week'}
`;

    // Generate summary with OpenAI
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userData }
      ],
      temperature: 0.7,
      max_tokens: 600,
    });

    const summaryText = completion.choices[0].message.content || 'Unable to generate summary';

    // Extract insights (simplified - could be enhanced with structured output)
    const insights = {
      adherence: logs && logs.length > 0 ? `${logs.length} logs this week` : 'No logs this week',
      outcomes: logs?.some(l => l.effects) ? 'Positive effects reported' : 'Limited outcome data',
      sideEffects: logs?.some(l => l.side_effects) ? 'Side effects noted - review logs' : 'No side effects reported',
      moodTrends: journals && journals.length > 0 
        ? `Avg mood: ${Math.round(journals.reduce((sum, j) => sum + (j.mood_rating || 0), 0) / journals.length)}/10`
        : 'No mood data'
    };

    // Save summary to database
    const { error: saveError } = await supabase
      .from('weekly_summaries')
      .upsert({
        user_id: userId,
        week_start_date: weekAgo.toISOString().split('T')[0],
        week_end_date: now.toISOString().split('T')[0],
        summary_text: summaryText,
        insights
      });

    if (saveError) {
      console.error('Error saving summary:', saveError);
    }

    return NextResponse.json({
      summary: {
        week_start_date: weekAgo.toISOString().split('T')[0],
        week_end_date: now.toISOString().split('T')[0],
        summary_text: summaryText,
        insights
      }
    });

  } catch (error: any) {
    console.error('Summary generation error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate summary' },
      { status: 500 }
    );
  }
}

