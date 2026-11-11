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
        <CartesianGrid strokeDasharray="3 3" stroke="var(--ag-sys-color-outline-variant)" />
        <XAxis dataKey="mois" tick={{ fontSize: 11, fill: "var(--ag-sys-color-on-surface-muted)" }} />
        <YAxis tickFormatter={formatFCFA} tick={{ fontSize: 11, fill: "var(--ag-sys-color-on-surface-muted)" }} width={48} />
        <Tooltip
          formatter={(v, name) => [
            `${Number(v).toLocaleString("fr-FR")} FCFA`,
            name === "cotisations" ? "Cotisations" : "Dons"
          ]}
          labelClassName="font-semibold text-on-surface-variant"
          contentStyle={{ background: "var(--ag-sys-color-surface-container-lowest)", color: "var(--ag-sys-color-on-surface)", border: "1px solid var(--ag-sys-color-outline-variant)", borderRadius: 8, fontSize: 12 }}
        />
        <Bar dataKey="cotisations" fill="var(--ag-sys-color-primary)" radius={[4, 4, 0, 0]} />
        <Bar dataKey="dons" fill="var(--ag-sys-color-accent-leaf)" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
