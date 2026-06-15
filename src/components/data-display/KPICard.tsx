import type { ReactNode } from "react"
import { SparklineChart } from "../chart/SparklineChart"

export function KPICard({
  icon,
  label,
  value,
  subtext,
  trend,
  sparklineData,
  color = "primary",
  gradient = false,
}: {
  icon: ReactNode
  label: string
  value: string | number
  subtext?: string
  trend?: { value: number; isUp: boolean }
  sparklineData?: { value: number }[]
  color?: string
  gradient?: boolean
}) {
  const gradientMap: Record<string, string> = {
    blue: "from-blue-600 to-blue-400",
    purple: "from-purple-600 to-purple-400",
    green: "from-emerald-600 to-teal-400",
    orange: "from-orange-600 to-amber-400",
    red: "from-red-600 to-rose-400",
    primary: "from-primary to-primary/70",
    secondary: "from-secondary to-secondary/70",
    accent: "from-accent to-accent/70",
  }

  const baseClasses = "card p-5 border border-base-300/30 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1"
  const gradientClass = gradient ? ` bg-gradient-to-br ${gradientMap[color] || gradientMap.primary} text-white` : " bg-base-100"

  return (
    <div className={`${baseClasses}${gradientClass}`}>
      <div className="flex items-start justify-between mb-3">
        <div className={`p-2.5 rounded-xl ${gradient ? "bg-white/15" : "bg-primary/10"}`}>
          {icon}
        </div>
        {trend && (
          <span
            className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-xs font-medium ${
              trend.isUp
                ? gradient ? "bg-white/20 text-white" : "bg-success/10 text-success"
                : gradient ? "bg-white/20 text-white" : "bg-error/10 text-error"
            }`}
          >
            <span className={`${trend.isUp ? "" : "rotate-180"}`}>&#8593;</span>
            {Math.abs(trend.value)}%
          </span>
        )}
      </div>

      <div className="flex flex-col">
        <span className={`text-sm font-medium ${gradient ? "text-white/80" : "text-base-content/60"}`}>
          {label}
        </span>
        <span className={`text-3xl font-bold mt-0.5 ${gradient ? "text-white" : "text-base-content"}`}>
          {value}
        </span>
        {subtext && (
          <span className={`text-xs mt-1 ${gradient ? "text-white/60" : "text-base-content/40"}`}>
            {subtext}
          </span>
        )}
      </div>

      {sparklineData && (
        <div className="mt-2 opacity-60">
          <SparklineChart data={sparklineData} color={gradient ? "#ffffff" : undefined} />
        </div>
      )}
    </div>
  )
}
