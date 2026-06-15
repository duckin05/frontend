import { formatDateTime } from "../../utils/format"

export interface TimelineItem {
  id: string
  icon: string
  title: string
  description: string
  timestamp: string
}

export function Timeline({ items }: { items: TimelineItem[] }) {
  if (!items || items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-base-content/40 text-sm">
        Chưa có hoạt động gần đây
      </div>
    )
  }

  return (
    <ul className="timeline timeline-vertical timeline-compact">
      {items.map((item, index) => (
        <li key={item.id}>
          {index > 0 && <hr className="bg-base-300" />}
          <div className="timeline-middle">
            <span className="text-lg">{item.icon}</span>
          </div>
          <div className={`timeline-${index % 2 === 0 ? "end" : "start"} mb-4`}>
            <time className="text-xs text-base-content/40 font-mono">
              {formatDateTime(item.timestamp)}
            </time>
            <div className="text-sm font-medium mt-1">{item.title}</div>
            <div className="text-xs text-base-content/50 mt-0.5">{item.description}</div>
          </div>
          {index < items.length - 1 && <hr className="bg-base-300" />}
        </li>
      ))}
    </ul>
  )
}
