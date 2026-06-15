import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface GrowthDataPoint {
  date: string
  count: number
}

export function StudentGrowthChart({ data }: { data: GrowthDataPoint[] }) {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-base-content/40 text-sm">
        Chưa có dữ liệu
      </div>
    )
  }

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--b3) / 0.3)" />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 12 }}
            tickLine={false}
            axisLine={false}
            stroke="hsl(var(--bc) / 0.4)"
          />
          <YAxis
            tick={{ fontSize: 12 }}
            tickLine={false}
            axisLine={false}
            stroke="hsl(var(--bc) / 0.4)"
            allowDecimals={false}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(var(--b1))",
              border: "1px solid hsl(var(--b3) / 0.5)",
              borderRadius: "8px",
              fontSize: "13px",
            }}
          />
          <Line
            type="monotone"
            dataKey="count"
            stroke="hsl(var(--p))"
            strokeWidth={2.5}
            dot={{ r: 3, fill: "hsl(var(--p))" }}
            activeDot={{ r: 5, fill: "hsl(var(--p))" }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

export type { GrowthDataPoint }
