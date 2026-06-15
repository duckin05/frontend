import type { ReactNode } from "react"

export function ChartCard({ title, subtitle, children, className = "" }: {
  title: string
  subtitle?: string
  children: ReactNode
  className?: string
}) {
  return (
    <div className={`card bg-base-100 shadow-sm border border-base-300/30 ${className}`}>
      <div className="card-body p-5">
        <div className="mb-3">
          <h3 className="card-title text-base font-semibold">{title}</h3>
          {subtitle && <p className="text-xs text-base-content/50 mt-0.5">{subtitle}</p>}
        </div>
        {children}
      </div>
    </div>
  )
}
