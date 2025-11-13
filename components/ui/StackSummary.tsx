import { StatusPill } from './StatusPill';
import { Button } from './button';

interface StackItem {
  name: string;
  why: string;
  family?: string;
  tags?: string[];
  status?: string;
}

interface StackSummaryProps {
  items: StackItem[];
  onViewFull?: () => void;
}

export function StackSummary({ items, onViewFull }: StackSummaryProps) {
  if (!items || items.length === 0) {
    return (
      <div className="text-center py-8 text-[var(--text-dim)]">
        <p>No peptide recommendations yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Legend */}
      <div className="flex flex-wrap items-center gap-4 text-xs text-[var(--text-muted)] pb-2 border-b border-[var(--border)]">
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]"></div>
          <span>Mechanism</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-[var(--ok)]"></div>
          <span>Regulatory Status</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-[var(--text-muted)]"></div>
          <span>Evidence Available</span>
        </div>
      </div>

      {/* Stack Items */}
      {items.map((item, index) => (
        <div 
          key={index}
          className="rounded-xl border border-[var(--border)] bg-[var(--surface-2)] p-4 hover:border-[var(--accent)]/30 transition-all"
        >
          <div className="flex items-start justify-between gap-4 mb-3">
            <div className="flex-1">
              <h3 className="text-lg font-bold text-[var(--accent)] mb-1">{item.name}</h3>
              <p className="text-sm text-[var(--text-dim)] leading-relaxed">
                <span className="text-[var(--text)] font-medium">Why it appears:</span> {item.why}
              </p>
            </div>
            {item.status && (
              <StatusPill status={item.status} />
            )}
          </div>

          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex flex-wrap gap-2">
              {item.family && (
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-[var(--accent)]/10 text-[var(--accent)] border border-[var(--accent)]/20">
                  {item.family}
                </span>
              )}
              {item.tags && item.tags.slice(0, 3).map((tag, i) => (
                <span 
                  key={i}
                  className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-[var(--surface-1)] text-[var(--text-dim)] border border-[var(--border)]"
                >
                  {tag}
                </span>
              ))}
            </div>
            
            {onViewFull && (
              <Button
                onClick={onViewFull}
                variant="ghost"
                size="sm"
                className="text-[var(--accent)] hover:text-[var(--accent-2)] text-xs font-semibold"
              >
                Open Full Brief →
              </Button>
            )}
          </div>

          {index < items.length - 1 && (
            <div className="mt-4 border-b border-[var(--border)]/50"></div>
          )}
        </div>
      ))}
    </div>
  );
}

