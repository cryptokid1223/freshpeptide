interface NumberedStepProps {
  number: number;
  title: string;
  description: string;
}

export function NumberedStep({ number, title, description }: NumberedStepProps) {
  return (
    <div className="flex items-start gap-4">
      <div className="flex-shrink-0 w-9 h-9 rounded-full bg-gradient-to-b from-[var(--accent-2)] to-[var(--accent)] flex items-center justify-center text-[#001018] font-bold text-sm shadow-lg">
        {number}
      </div>
      <div className="flex-1 pt-0.5">
        <h4 className="font-semibold text-[var(--text)] mb-1 text-sm">{title}</h4>
        <p className="text-xs text-[var(--text-dim)]">{description}</p>
      </div>
    </div>
  );
}

