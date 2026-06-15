import type { IBlock } from "../../types"
import { formatDateTime, truncateHash } from "../../utils/format"

export function BlockchainTable({ blocks }: { blocks: IBlock[] }) {
  if (!blocks || blocks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <span className="text-4xl mb-3">\u26do️</span>
        <p className="text-sm text-base-content/40">Chưa có dữ liệu blockchain</p>
      </div>
    )
  }

  const sorted = [...blocks].sort((a, b) => b.index - a.index)

  return (
    <div className="overflow-x-auto">
      <table className="table table-zebra table-pin-rows">
        <thead>
          <tr className="text-xs uppercase tracking-wider text-base-content/40">
            <th className="w-16">Index</th>
            <th className="w-36">Timestamp</th>
            <th>Data</th>
            <th className="hidden lg:table-cell">Previous Hash</th>
            <th>Hash</th>
            <th className="w-20 text-center">Status</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((block) => (
            <tr key={block.index} className="text-sm font-mono hover">
              <td className="font-bold text-base-content/60">#{block.index}</td>
              <td className="text-xs">{formatDateTime(block.timestamp)}</td>
              <td className="max-w-[200px]">
                <div className="truncate text-xs" title={typeof block.data === "object" ? JSON.stringify(block.data) : String(block.data)}>
                  {typeof block.data === "object" ? JSON.stringify(block.data) : String(block.data)}
                </div>
              </td>
              <td className="hidden lg:table-cell text-[10px] text-base-content/50">
                <code>{truncateHash(block.previous_hash, 20)}</code>
              </td>
              <td className="text-[10px]">
                <code className="bg-base-200/50 px-1.5 py-0.5 rounded">{truncateHash(block.hash, 16)}</code>
              </td>
              <td className="text-center">
                {block.isValid !== undefined ? (
                  block.isValid ? (
                    <span className="text-success text-xs" title="Valid">✅</span>
                  ) : (
                    <span className="text-error text-xs" title="Invalid">❌</span>
                  )
                ) : (
                  <span className="text-base-content/20 text-xs" title="Unknown">❓</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
