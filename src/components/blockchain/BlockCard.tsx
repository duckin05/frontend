import type { IBlock } from "../../types"
import { formatDateTime, truncateHash } from "../../utils/format"

export function BlockCard({ block, isValid }: { block: IBlock; isValid?: boolean }) {
  const statusColor = isValid === false ? "border-error/50 bg-error/5" : "border-primary/30 bg-primary/5"
  const glowClass = isValid === false ? "shadow-error/30" : "shadow-primary/20"

  return (
    <div
      className={`flex-shrink-0 w-64 p-4 rounded-xl border ${statusColor} bg-base-100 shadow-lg ${glowClass} transition-all duration-300 hover:shadow-xl hover:scale-[1.02]`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-mono font-bold text-base-content/40">
          #{block.index}
        </span>
        {isValid !== undefined && (
          <span className={`text-xs font-bold ${isValid ? "text-success" : "text-error"}`}>
            {isValid ? "✅ Valid" : "❌ Invalid"}
          </span>
        )}
      </div>

      {/* Timestamp */}
      <p className="text-[11px] text-base-content/50 font-mono mb-2">
        {formatDateTime(block.timestamp)}
      </p>

      {/* Data preview */}
      <div className="mb-3">
        <span className="text-[10px] uppercase tracking-wider text-base-content/30 font-semibold">Data</span>
        <p className="text-xs font-mono mt-0.5 bg-base-200/50 rounded p-1.5 truncate">
          {typeof block.data === "object" ? JSON.stringify(block.data).slice(0, 40) + "..." : String(block.data).slice(0, 40)}
        </p>
      </div>

      {/* Hash */}
      <div className="mb-1">
        <span className="text-[10px] uppercase tracking-wider text-base-content/30 font-semibold">Hash</span>
        <p className="text-[10px] font-mono mt-0.5 text-base-content/50 truncate">
          {truncateHash(block.hash, 24)}
        </p>
      </div>

      {/* Previous Hash */}
      <div>
        <span className="text-[10px] uppercase tracking-wider text-base-content/30 font-semibold">Previous Hash</span>
        <p className="text-[10px] font-mono mt-0.5 text-base-content/40 truncate">
          {truncateHash(block.previous_hash, 24)}
        </p>
      </div>
    </div>
  )
}
