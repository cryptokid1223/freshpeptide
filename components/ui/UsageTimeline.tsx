interface TimelineLog {
  id: string;
  peptide_name: string;
  logged_at: string;
  amount?: string | null;
  effects?: string | null;
}

interface UsageTimelineProps {
  logs: TimelineLog[];
  limit?: number;
}

export function UsageTimeline({ logs, limit = 10 }: UsageTimelineProps) {
  const displayLogs = logs.slice(0, limit);

  if (logs.length === 0) {
    return (
      <div className="text-center py-12">
        <svg className="w-12 h-12 mx-auto mb-3 text-[var(--text-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
        <p className="text-[var(--text-dim)] text-sm">No logs yet</p>
        <p className="text-xs text-[var(--text-muted)] mt-1">Start tracking your peptides</p>
      </div>
    );
  }

  const groupLogsByDate = (logs: TimelineLog[]) => {
    const grouped: { [key: string]: TimelineLog[] } = {};
    logs.forEach(log => {
      const date = new Date(log.logged_at).toLocaleDateString('en-US', { 
        weekday: 'short', 
        month: 'short', 
        day: 'numeric' 
      });
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(log);
    });
    return grouped;
  };

  const groupedLogs = groupLogsByDate(displayLogs);

  return (
    <div className="space-y-6">
      {Object.entries(groupedLogs).map(([date, dateLogs]) => (
        <div key={date} className="relative">
          {/* Date Header */}
          <div className="flex items-center gap-3 mb-3">
            <div className="flex-shrink-0 w-2 h-2 rounded-full bg-[var(--accent)]"></div>
            <h4 className="text-sm font-semibold text-[var(--text)]">{date}</h4>
            <div className="flex-1 h-px bg-[var(--border)]"></div>
          </div>

          {/* Logs for this date */}
          <div className="ml-5 border-l-2 border-[var(--border)] pl-6 space-y-3">
            {dateLogs.map((log) => (
              <div key={log.id} className="relative">
                {/* Timeline dot */}
                <div className="absolute -left-[27px] top-2 w-3 h-3 rounded-full border-2 border-[var(--accent)] bg-[var(--bg)]"></div>
                
                {/* Log card */}
                <div className="rounded-lg border border-[var(--border)] bg-[var(--surface-2)] p-3">
                  <div className="flex items-start justify-between mb-1">
                    <h5 className="font-medium text-[var(--accent)] text-sm">{log.peptide_name}</h5>
                    <span className="text-xs text-[var(--text-muted)]">
                      {new Date(log.logged_at).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}
                    </span>
                  </div>
                  
                  {log.amount && (
                    <p className="text-xs text-[var(--text-dim)]">
                      <strong>Dose:</strong> {log.amount}
                    </p>
                  )}
                  
                  {log.effects && (
                    <p className="text-xs text-[var(--text-dim)] mt-1">
                      <strong className="text-[var(--ok)]">Effects:</strong> {log.effects}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
      
      {logs.length > limit && (
        <div className="text-center pt-2">
          <p className="text-xs text-[var(--text-muted)]">
            Showing {limit} of {logs.length} logs
          </p>
        </div>
      )}
    </div>
  );
}

