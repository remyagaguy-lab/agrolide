"use client"

import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

export function LineChart({ data, dataKey = "value", nameKey = "name", stroke = "var(--ag-sys-color-primary)" }: any) {
  return (
    <div className="h-[250px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <RechartsLineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--ag-sys-color-outline-variant)" />
          <XAxis 
            dataKey={nameKey} 
            axisLine={false} 
            tickLine={false} 
            tick={{ fontSize: 12, fill: "var(--ag-sys-color-on-surface-muted)" }} 
            dy={10} 
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fontSize: 12, fill: "var(--ag-sys-color-on-surface-muted)" }} 
            tickFormatter={(value) => `${value}`}
          />
          <Tooltip 
            cursor={{ fill: "transparent", stroke: "var(--ag-sys-color-outline)", strokeWidth: 2, strokeDasharray: "3 3" }}
            contentStyle={{ borderRadius: "8px", background: "var(--ag-sys-color-surface-container-lowest)", color: "var(--ag-sys-color-on-surface)", border: "1px solid var(--ag-sys-color-outline-variant)" }}
          />
          <Line 
            type="monotone" 
            dataKey={dataKey} 
            stroke={stroke} 
            strokeWidth={3}
            dot={{ r: 4, fill: stroke, strokeWidth: 2, stroke: "var(--ag-sys-color-surface-container-lowest)" }}
            activeDot={{ r: 6, fill: stroke, stroke: "var(--ag-sys-color-surface-container-lowest)", strokeWidth: 2 }}
          />
        </RechartsLineChart>
      </ResponsiveContainer>
    </div>
  )
}
