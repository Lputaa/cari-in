import { User } from "lucide-react";

interface AnonymousBadgeProps {
  anonymousId: string;
}

export default function AnonymousBadge({ anonymousId }: AnonymousBadgeProps) {
  return (
    <div className="inline-flex items-center gap-1.5">
      <div className="w-7 h-7 rounded-[var(--radius-badge)] border-2 border-neutral-black bg-secondary flex items-center justify-center shadow-[1px_1px_0px_#000]">
        <User size={14} strokeWidth={2.5} />
      </div>
      <span className="font-bold text-caption text-neutral-black">
        #{anonymousId}
      </span>
    </div>
  );
}
