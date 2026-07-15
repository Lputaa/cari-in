export default function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div
      className={`
        bg-neutral-gray border-[var(--border-brutal)] rounded-[var(--radius-brutal)]
        animate-pulse
        ${className}
      `}
    />
  );
}

export function PostCardSkeleton() {
  return (
    <div className="bg-neutral-white rounded-[var(--radius-brutal)] border-[var(--border-brutal)] shadow-[var(--shadow-brutal)] p-4 space-y-3">
      <div className="flex items-center gap-2">
        <Skeleton className="w-8 h-8 rounded-[var(--radius-badge)]" />
        <Skeleton className="w-24 h-4" />
      </div>
      <Skeleton className="w-3/4 h-6" />
      <Skeleton className="w-full h-16" />
      <Skeleton className="w-full h-48" />
      <div className="flex gap-2">
        <Skeleton className="w-20 h-6" />
        <Skeleton className="w-16 h-6" />
      </div>
    </div>
  );
}
