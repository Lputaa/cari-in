"use client";

interface Tab {
  label: string;
  value: string;
}

interface TabsProps {
  tabs: Tab[];
  active: string;
  onChange: (value: string) => void;
}

export default function Tabs({ tabs, active, onChange }: TabsProps) {
  return (
    <div className="flex border-b-[var(--border-brutal)]">
      {tabs.map((tab) => (
        <button
          key={tab.value}
          onClick={() => onChange(tab.value)}
          className={`
            flex-1 py-3 text-center font-bold text-base cursor-pointer
            border-b-4 transition-colors duration-200
            ${
              active === tab.value
                ? "border-primary text-neutral-black"
                : "border-transparent text-neutral-black/50"
            }
          `}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
