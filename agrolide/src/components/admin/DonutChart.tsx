"use client"
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts"

interface DonutChartProps {
  data: { name: string; value: number; color: string }[]
}

export function DonutChart({ data }: DonutChartProps) {
  const total = data.reduce((s, d) => s + d.value, 0)
  if (total === 0) {
    return (
      <div className="h-[180px] flex items-center justify-center text-sm text-gray-400 italic">
        Aucune donnée
      </div>
    )
  }
  return (
    <ResponsiveContainer width="100%" height={180}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={50}
          outerRadius={72}
          paddingAngle={3}
          dataKey="value"
        >
          {data.map((entry, i) => (
            <Cell key={i} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip
          formatter={(v, name) => [`${Number(v)} membre${Number(v) > 1 ? "s" : ""}`, name as string]}
          contentStyle={{ border: "1px solid #e5e7eb", borderRadius: 8, fontSize: 12 }}
        />
        <Legend iconType="circle" iconSize={9} wrapperStyle={{ fontSize: 11 }} />
      </PieChart>
    </ResponsiveContainer>
  )
}
