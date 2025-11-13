interface StatusPillProps {
  status: string;
  className?: string;
}

export function StatusPill({ status, className = '' }: StatusPillProps) {
  const normalized = status.toLowerCase();
  
  let styles = '';
  let label = status;
  
  if (normalized.includes('fda') || normalized.includes('approved')) {
    styles = 'bg-[rgba(34,197,94,0.1)] text-[#22C55E] border-[#1D3525]';
    label = 'FDA-Approved';
  } else if (normalized.includes('trial') || normalized.includes('clinical')) {
    styles = 'bg-[rgba(110,231,245,0.08)] text-[#6EE7F5] border-[#143842]';
    label = 'Clinical Trials';
  } else if (normalized.includes('research') || normalized.includes('unapproved')) {
    styles = 'bg-[rgba(245,158,11,0.08)] text-[#F59E0B] border-[#3A2B10]';
    label = 'Research Only';
  } else if (normalized.includes('diagnostic')) {
    styles = 'bg-[rgba(110,231,245,0.08)] text-[#6EE7F5] border-[#143842]';
    label = 'Diagnostic';
  } else {
    styles = 'bg-[rgba(166,173,186,0.08)] text-[#A9AFB8] border-[#2A2E35]';
  }
  
  return (
    <span 
      className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-semibold ${styles} ${className}`}
    >
      {label}
    </span>
  );
}

