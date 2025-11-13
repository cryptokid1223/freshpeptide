import { StatusPill } from './StatusPill';

interface PeptideMiniCardProps {
  name: string;
  status: string;
  summary: string;
  onClick: () => void;
  isSelected?: boolean;
}

export function PeptideMiniCard({ name, status, summary, onClick, isSelected = false }: PeptideMiniCardProps) {
  return (
    <div
      onClick={onClick}
      className={`rounded-2xl border p-4 cursor-pointer transition-all duration-200 ${
        isSelected
          ? 'bg-[var(--surface-2)] border-[var(--accent)] shadow-[0_0_20px_rgba(18,179,255,0.15)]'
          : 'bg-[var(--surface-1)] border-[var(--border)] hover:border-[var(--accent)]/50 hover:bg-[var(--surface-2)]'
      }`}
      style={{ boxShadow: isSelected ? '0 0 20px rgba(18,179,255,0.15)' : 'var(--shadow)' }}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <h3 className="font-semibold text-sm text-[var(--accent)] leading-tight">{name}</h3>
        <StatusPill status={status} />
      </div>
      <p className="text-xs text-[var(--text-dim)] line-clamp-2 leading-relaxed">{summary}</p>
    </div>
  );
}

