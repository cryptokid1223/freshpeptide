import { Button } from './button';

interface EmptyStateProps {
  message: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function EmptyState({ message, action }: EmptyStateProps) {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-1)] p-12 text-center" style={{ boxShadow: 'var(--shadow)' }}>
      <div className="w-16 h-16 rounded-full bg-[var(--surface-2)] mx-auto mb-4 flex items-center justify-center">
        <svg className="w-8 h-8 text-[var(--text-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
        </svg>
      </div>
      <p className="text-sm text-[var(--text-dim)] mb-4">{message}</p>
      {action && (
        <Button
          onClick={action.onClick}
          className="bg-[var(--accent)] text-[#001018] hover:opacity-90 rounded-full px-6 font-semibold"
        >
          {action.label}
        </Button>
      )}
    </div>
  );
}

