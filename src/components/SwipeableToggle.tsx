"use client";

interface SwipeableToggleProps {
  options: { label: string; value: string; icon: string; color: string }[];
  value: string;
  onChange: (value: string) => void;
}

export default function SwipeableToggle({ options, value, onChange }: SwipeableToggleProps) {
  const currentIndex = options.findIndex((o) => o.value === value);
  const current = options[currentIndex];

  return (
    <div className="relative flex items-center bg-neutral-gray rounded-[var(--radius-brutal)] border-2 border-neutral-black p-1 gap-1">
      {options.map((option) => {
        const isActive = value === option.value;
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={`
              relative flex items-center justify-center w-10 h-10
              rounded-[var(--radius-badge)] border-2 border-neutral-black
              font-bold cursor-pointer transition-all duration-150
              ${isActive
                ? `${option.color} shadow-[var(--shadow-brutal-sm)] -translate-y-0.5 text-neutral-black`
                : "bg-neutral-white text-neutral-black/30 hover:text-neutral-black/60"
              }
            `}
            title={option.label}
          >
            <span className="text-lg">{option.icon}</span>
          </button>
        );
      })}
    </div>
  );
}
