export function LoadingSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-4 animate-pulse">
          <div className="h-4 w-8 bg-base-300 rounded" />
          <div className="h-4 w-24 bg-base-300 rounded" />
          <div className="h-4 w-32 bg-base-300 rounded flex-1" />
          <div className="h-4 w-20 bg-base-300 rounded" />
          <div className="h-4 w-28 bg-base-300 rounded" />
        </div>
      ))}
    </div>
  )
}
