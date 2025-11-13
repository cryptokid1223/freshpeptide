import { Card } from './card';

interface UsageStatsProps {
  stats: {
    totalLogs: number;
    activePeptides: number;
    logsThisWeek: number;
    logsLastWeek: number;
    mostLoggedPeptide?: string;
    streakDays?: number;
  };
}

export function UsageStats({ stats }: UsageStatsProps) {
  const weeklyChange = stats.logsLastWeek > 0 
    ? Math.round(((stats.logsThisWeek - stats.logsLastWeek) / stats.logsLastWeek) * 100)
    : 0;

  const statCards = [
    {
      label: 'Total Logs',
      value: stats.totalLogs,
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      color: 'from-[var(--accent-2)] to-[var(--accent)]'
    },
    {
      label: 'Active Peptides',
      value: stats.activePeptides,
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
        </svg>
      ),
      color: 'from-[var(--accent)] to-[var(--accent-2)]'
    },
    {
      label: 'This Week',
      value: stats.logsThisWeek,
      subtext: weeklyChange !== 0 ? `${weeklyChange > 0 ? '+' : ''}${weeklyChange}% vs last week` : undefined,
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      color: 'from-[var(--ok)] to-[var(--accent-2)]'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {statCards.map((stat, index) => (
        <Card 
          key={index}
          className="rounded-xl border border-[var(--border)] bg-[var(--surface-1)] p-4" 
          style={{ boxShadow: 'var(--shadow)' }}
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-xs text-[var(--text-muted)] mb-1">{stat.label}</p>
              <p className="text-3xl font-bold text-[var(--text)] mb-1">{stat.value}</p>
              {stat.subtext && (
                <p className={`text-xs ${weeklyChange > 0 ? 'text-[var(--ok)]' : weeklyChange < 0 ? 'text-[var(--danger)]' : 'text-[var(--text-muted)]'}`}>
                  {stat.subtext}
                </p>
              )}
            </div>
            <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${stat.color} flex items-center justify-center text-[#001018]`}>
              {stat.icon}
            </div>
          </div>
        </Card>
      ))}
      
      {stats.mostLoggedPeptide && (
        <Card 
          className="rounded-xl border border-[var(--border)] bg-[var(--surface-1)] p-4 md:col-span-3" 
          style={{ boxShadow: 'var(--shadow)' }}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--accent)] to-[var(--accent-2)] flex items-center justify-center">
              <svg className="w-5 h-5 text-[#001018]" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </div>
            <div>
              <p className="text-xs text-[var(--text-muted)]">Most Tracked</p>
              <p className="font-semibold text-[var(--accent)]">{stats.mostLoggedPeptide}</p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}

