import { Card } from './card';
import { StatusPill } from './StatusPill';

interface StackPeptide {
  name: string;
  status: 'active' | 'paused' | 'discontinued';
  lastLogged?: string;
  totalLogs?: number;
  goal?: string;
}

interface StackOverviewCardProps {
  peptides: StackPeptide[];
  onViewDetails?: (peptide: StackPeptide) => void;
}

export function StackOverviewCard({ peptides, onViewDetails }: StackOverviewCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-[var(--accent)]/10 text-[var(--accent)] border-[var(--accent)]/20';
      case 'paused':
        return 'bg-[var(--text-muted)]/10 text-[var(--text-muted)] border-[var(--text-muted)]/20';
      case 'discontinued':
        return 'bg-[var(--danger)]/10 text-[var(--danger)] border-[var(--danger)]/20';
      default:
        return 'bg-[var(--text-muted)]/10 text-[var(--text-muted)] border-[var(--text-muted)]/20';
    }
  };

  const getStatusDot = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-[var(--accent)]';
      case 'paused':
        return 'bg-[var(--text-muted)]';
      case 'discontinued':
        return 'bg-[var(--danger)]';
      default:
        return 'bg-[var(--text-muted)]';
    }
  };

  if (peptides.length === 0) {
    return (
      <Card className="rounded-2xl border border-[var(--border)] bg-[var(--surface-1)] p-6 text-center" style={{ boxShadow: 'var(--shadow)' }}>
        <div className="py-8">
          <svg className="w-16 h-16 mx-auto mb-4 text-[var(--text-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <p className="text-[var(--text-dim)] mb-2">No active peptide stack</p>
          <p className="text-sm text-[var(--text-muted)]">Generate your stack to start tracking</p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {peptides.map((peptide, index) => (
        <Card
          key={index}
          className="rounded-xl border border-[var(--border)] bg-[var(--surface-2)] p-4 hover:border-[var(--accent)]/30 transition-all cursor-pointer"
          onClick={() => onViewDetails && onViewDetails(peptide)}
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className={`w-2 h-2 rounded-full ${getStatusDot(peptide.status)}`}></span>
                <h3 className="font-semibold text-[var(--text)]">{peptide.name}</h3>
              </div>
              
              {peptide.goal && (
                <p className="text-xs text-[var(--text-dim)] mb-2">
                  <strong>Goal:</strong> {peptide.goal}
                </p>
              )}
              
              <div className="flex items-center gap-4 text-xs text-[var(--text-muted)]">
                {peptide.totalLogs !== undefined && (
                  <span>{peptide.totalLogs} log{peptide.totalLogs !== 1 ? 's' : ''}</span>
                )}
                {peptide.lastLogged && (
                  <span>Last: {new Date(peptide.lastLogged).toLocaleDateString()}</span>
                )}
              </div>
            </div>
            
            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${getStatusColor(peptide.status)}`}>
              {peptide.status.charAt(0).toUpperCase() + peptide.status.slice(1)}
            </span>
          </div>
        </Card>
      ))}
    </div>
  );
}

