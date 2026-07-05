export function PropertyCardSkeleton() {
  return (
    <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl overflow-hidden animate-pulse">
      <div className="aspect-[16/10] bg-[var(--surface)]" />
      <div className="p-5 space-y-3">
        <div className="h-4 bg-[var(--surface)] rounded w-3/4" />
        <div className="h-3 bg-[var(--surface)] rounded w-1/2" />
        <div className="h-5 bg-[var(--surface)] rounded w-1/3" />
        <div className="h-16 bg-[var(--surface)] rounded" />
        <div className="h-9 bg-[var(--surface)] rounded-xl" />
      </div>
    </div>
  );
}
