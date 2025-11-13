interface Category {
  id: string;
  label: string;
}

interface CategoryChipsProps {
  categories: Category[];
  selected: string;
  onSelect: (id: string) => void;
  className?: string;
}

export function CategoryChips({ categories, selected, onSelect, className = '' }: CategoryChipsProps) {
  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onSelect(cat.id)}
          className={`px-4 py-2 rounded-full text-xs font-semibold transition-all duration-150 ${
            selected === cat.id
              ? 'bg-[var(--accent)] text-[#001018] shadow-[0_0_16px_rgba(18,179,255,0.4)]'
              : 'bg-[var(--surface-2)] text-[var(--text-dim)] border border-[var(--border)] hover:border-[var(--accent)]/50 hover:text-[var(--text)]'
          }`}
        >
          {cat.label}
        </button>
      ))}
    </div>
  );
}

