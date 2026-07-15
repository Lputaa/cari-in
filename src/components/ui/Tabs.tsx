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
    <div className="flex border-b-2 border-neutral-black">
      {tabs.map((tab) => (
        <button
          key={tab.value}
          onClick={() => onChange(tab.value)}
          className={`
            flex-1 py-3 text-center font-bold text-body cursor-pointer
            border-b-[3px] transition-all duration-150 -mb-[2px]
            ${
              active === tab.value
                ? "border-primary text-neutral-black"
                : "border-transparent text-neutral-black/30 hover:text-neutral-black/60"
            }
          `}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
