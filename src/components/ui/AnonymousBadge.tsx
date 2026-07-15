import { User } from "lucide-react";

interface AnonymousBadgeProps {
  anonymousId: string;
}

export default function AnonymousBadge({ anonymousId }: AnonymousBadgeProps) {
  return (
    <div className="inline-flex items-center gap-2">
      <div className="w-8 h-8 rounded-[var(--radius-badge)] border-2 border-neutral-black bg-neutral-gray flex items-center justify-center">
        <User size={16} strokeWidth={2.5} />
      </div>
      <span className="font-bold text-caption">Anonymous #{anonymousId}</span>
    </div>
  );
}
