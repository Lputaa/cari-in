import { Search } from "lucide-react";
import Button from "./Button";

interface EmptyStateProps {
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export default function EmptyState({
  title = "Belum ada laporan di sini.",
  description = "Jadi yang pertama membantu!",
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center gap-3">
      <div className="w-14 h-14 rounded-[var(--radius-brutal)] bg-primary border-2 border-neutral-black shadow-[var(--shadow-brutal-sm)] flex items-center justify-center">
        <Search size={28} strokeWidth={2.5} className="text-neutral-black" />
      </div>
      <h3 className="text-h3 font-bold">{title}</h3>
      <p className="text-body text-neutral-black/50 max-w-xs">{description}</p>
      {actionLabel && onAction && (
        <Button variant="secondary" size="sm" onClick={onAction} className="mt-2">
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
