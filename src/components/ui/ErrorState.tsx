"use client";

import { AlertTriangle } from "lucide-react";
import Button from "./Button";

interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
}

export default function ErrorState({
  title = "Terjadi kesalahan",
  description = "Coba lagi nanti.",
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center gap-4">
      <div className="w-16 h-16 rounded-full bg-danger/10 flex items-center justify-center">
        <AlertTriangle size={32} strokeWidth={2.5} className="text-danger" />
      </div>
      <h3 className="font-bold text-h3">{title}</h3>
      <p className="text-neutral-black/60">{description}</p>
      {onRetry && (
        <Button variant="primary" onClick={onRetry}>
          Coba Lagi
        </Button>
      )}
    </div>
  );
}
