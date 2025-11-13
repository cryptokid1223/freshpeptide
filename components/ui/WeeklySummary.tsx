import { Card } from './card';
import { Button } from './button';

interface WeeklySummaryData {
  week_start_date: string;
  week_end_date: string;
  summary_text: string;
  insights?: {
    adherence?: string;
    outcomes?: string;
    sideEffects?: string;
    moodTrends?: string;
  };
}

interface WeeklySummaryProps {
  summary: WeeklySummaryData | null;
  isGenerating: boolean;
  onGenerate: () => void;
}

export function WeeklySummary({ summary, isGenerating, onGenerate }: WeeklySummaryProps) {
  if (!summary) {
    return (
      <Card className="rounded-2xl border border-[var(--border)] bg-[var(--surface-1)] p-8 text-center" style={{ boxShadow: 'var(--shadow)' }}>
        <div className="w-16 h-16 rounded-full bg-gradient-to-b from-[var(--accent-2)] to-[var(--accent)] mx-auto mb-4 flex items-center justify-center">
          <svg className="w-8 h-8 text-[#001018]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-[var(--text)] mb-2">Weekly AI Summary</h3>
        <p className="text-sm text-[var(--text-dim)] mb-6 max-w-md mx-auto">
          Generate an AI-powered summary of your tracking data, adherence patterns, and observed outcomes
        </p>
        <Button
          onClick={onGenerate}
          disabled={isGenerating}
          className="bg-gradient-to-b from-[#22C8FF] to-[#08A7E6] hover:opacity-90 text-[#001018] rounded-full px-8 font-semibold"
        >
          {isGenerating ? 'Generating Summary...' : 'Generate This Week\'s Summary'}
        </Button>
      </Card>
    );
  }

  return (
    <Card className="rounded-2xl border border-[var(--accent)]/30 bg-gradient-to-br from-[var(--accent)]/5 to-[var(--surface-1)] p-6" style={{ boxShadow: 'var(--shadow)' }}>
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-xl font-bold text-[var(--accent)] mb-1">Weekly Summary</h3>
          <p className="text-xs text-[var(--text-muted)]">
            {new Date(summary.week_start_date).toLocaleDateString()} - {new Date(summary.week_end_date).toLocaleDateString()}
          </p>
        </div>
        <Button
          onClick={onGenerate}
          disabled={isGenerating}
          size="sm"
          className="bg-[var(--surface-2)] border border-[var(--border)] text-[var(--text)] hover:border-[var(--accent)]/50 rounded-full"
        >
          Regenerate
        </Button>
      </div>

      <div className="space-y-4">
        <div>
          <p className="text-sm text-[var(--text-dim)] leading-relaxed whitespace-pre-line">
            {summary.summary_text}
          </p>
        </div>

        {summary.insights && (
          <div className="grid md:grid-cols-2 gap-4 pt-4 border-t border-[var(--border)]">
            {summary.insights.adherence && (
              <div className="rounded-lg bg-[var(--surface-2)] border border-[var(--border)] p-4">
                <h4 className="text-sm font-semibold text-[var(--accent)] mb-2">📊 Adherence</h4>
                <p className="text-xs text-[var(--text-dim)]">{summary.insights.adherence}</p>
              </div>
            )}
            {summary.insights.outcomes && (
              <div className="rounded-lg bg-[var(--surface-2)] border border-[var(--border)] p-4">
                <h4 className="text-sm font-semibold text-[var(--ok)] mb-2">✅ Outcomes</h4>
                <p className="text-xs text-[var(--text-dim)]">{summary.insights.outcomes}</p>
              </div>
            )}
            {summary.insights.moodTrends && (
              <div className="rounded-lg bg-[var(--surface-2)] border border-[var(--border)] p-4">
                <h4 className="text-sm font-semibold text-[var(--accent-2)] mb-2">😊 Mood Trends</h4>
                <p className="text-xs text-[var(--text-dim)]">{summary.insights.moodTrends}</p>
              </div>
            )}
            {summary.insights.sideEffects && (
              <div className="rounded-lg bg-[var(--surface-2)] border border-[var(--border)] p-4">
                <h4 className="text-sm font-semibold text-[var(--warn)] mb-2">⚠️ Side Effects</h4>
                <p className="text-xs text-[var(--text-dim)]">{summary.insights.sideEffects}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </Card>
  );
}

