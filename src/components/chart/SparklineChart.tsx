import { LineChart, Line, ResponsiveContainer } from "recharts"

export function SparklineChart({ data, color = "#2563eb" }: {
  data: { value: number }[]
  color?: string
}) {
  if (!data || data.length === 0) return null

  return (
    <div className="w-full h-12">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <Line
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={2}
            dot={false}
            activeDot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
