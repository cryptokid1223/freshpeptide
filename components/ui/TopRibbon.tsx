'use client';

export function TopRibbon() {
  return (
    <div 
      className="sticky bottom-0 z-50 h-9 flex items-center justify-center bg-[#B45309] text-[#0B0B0F] font-semibold text-xs tracking-wide shadow-[var(--shadow)]"
      style={{ boxShadow: '0 -2px 12px rgba(0,0,0,0.3)' }}
    >
      <span className="flex items-center gap-1.5">
        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 16 16">
          <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
          <path d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 4.995z"/>
        </svg>
        RESEARCH PURPOSES ONLY — NOT MEDICAL ADVICE
      </span>
    </div>
  );
}

