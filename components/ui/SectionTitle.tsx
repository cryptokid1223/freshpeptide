interface SectionTitleProps {
  children: React.ReactNode;
  subtitle?: string;
  className?: string;
}

export function SectionTitle({ children, subtitle, className = '' }: SectionTitleProps) {
  return (
    <div className={`mb-6 ${className}`}>
      <h2 className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-[#6EE7F5] to-[#12B3FF] tracking-[-0.01em] mb-1">
        {children}
      </h2>
      {subtitle && (
        <p className="text-sm text-[var(--text-dim)] mt-1">{subtitle}</p>
      )}
    </div>
  );
}

