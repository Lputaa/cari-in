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
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center gap-4">
      <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
        <Search size={32} strokeWidth={2.5} className="text-primary" />
      </div>
      <h3 className="font-bold text-h3">{title}</h3>
      <p className="text-neutral-black/60">{description}</p>
      {actionLabel && onAction && (
        <Button variant="primary" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
