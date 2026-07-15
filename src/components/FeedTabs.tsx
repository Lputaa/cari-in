"use client";

import { Megaphone, SearchX, Hand } from "lucide-react";

const FEED_TABS = [
  { label: "Mading", value: "all", icon: Megaphone, color: "bg-secondary" },
  { label: "Lost", value: "lost", icon: SearchX, color: "bg-danger" },
  { label: "Found", value: "found", icon: Hand, color: "bg-primary" },
];

interface FeedTabsProps {
  active: string;
  onChange: (value: string) => void;
}

export default function FeedTabs({ active, onChange }: FeedTabsProps) {
  return (
    <div className="flex items-center gap-2">
      {FEED_TABS.map((tab) => {
        const Icon = tab.icon;
        const isActive = active === tab.value;

        return (
          <button
            key={tab.value}
            onClick={() => onChange(tab.value)}
            className={`
              relative flex items-center gap-2 px-4 py-2.5
              rounded-[var(--radius-brutal)] border-2 border-neutral-black
              font-bold text-caption cursor-pointer
              transition-all duration-150
              ${isActive
                ? `${tab.color} shadow-[var(--shadow-brutal-sm)] -translate-y-0.5 text-neutral-black`
                : "bg-neutral-white text-neutral-black/40 hover:text-neutral-black/70 hover:bg-neutral-gray"
              }
            `}
          >
            <Icon size={18} strokeWidth={2.5} />
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        );
      })}

      {/* Count indicator dot — visual flair */}
      <div className="flex-1" />
      <div className="flex items-center gap-1.5">
        {FEED_TABS.map((tab) => (
          <div
            key={tab.value}
            className={`
              w-2 h-2 rounded-full border border-neutral-black transition-all duration-200
              ${active === tab.value ? `${tab.color} scale-125` : "bg-neutral-black/10 scale-100"}
            `}
          />
        ))}
      </div>
    </div>
  );
}
