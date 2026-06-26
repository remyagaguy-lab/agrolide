"use client"
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  Cell
} from "recharts"

interface RevenueChartProps {
  data: { mois: string; cotisations: number; dons: number }[]
}

const formatFCFA = (v: number) =>
  v >= 1_000_000 ? `${(v / 1_000_000).toFixed(1)}M` :
  v >= 1_000 ? `${(v / 1_000).toFixed(0)}k` :
  String(v)

export function RevenueChart({ data }: RevenueChartProps) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis dataKey="mois" tick={{ fontSize: 11, fill: "#9ca3af" }} />
        <YAxis tickFormatter={formatFCFA} tick={{ fontSize: 11, fill: "#9ca3af" }} width={48} />
        <Tooltip
          formatter={(v, name) => [
            `${Number(v).toLocaleString("fr-FR")} FCFA`,
            name === "cotisations" ? "Cotisations" : "Dons"
          ]}
          labelClassName="font-semibold text-gray-700"
          contentStyle={{ border: "1px solid #e5e7eb", borderRadius: 8, fontSize: 12 }}
        />
        <Bar dataKey="cotisations" fill="#1b5e38" radius={[4, 4, 0, 0]} />
        <Bar dataKey="dons" fill="#86efac" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
