export default function SkeletonCard() {
  return (
    <div className="card animate-pulse overflow-hidden">
      <div className="aspect-[4/3] bg-surface-800" />
      <div className="p-4 space-y-3">
        <div className="h-3 w-20 rounded bg-surface-800" />
        <div className="h-5 w-40 rounded bg-surface-800" />
        <div className="h-4 w-32 rounded bg-surface-800" />
        <div className="flex gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-4 w-4 rounded bg-surface-800" />
          ))}
          <div className="h-4 w-8 rounded bg-surface-800 ml-2" />
        </div>
      </div>
    </div>
  );
}
