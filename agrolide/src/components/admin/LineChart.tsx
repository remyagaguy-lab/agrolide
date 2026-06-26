"use client"

import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

export function LineChart({ data, dataKey = "value", nameKey = "name", stroke = "#16a34a" }: any) {
  return (
    <div className="h-[250px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <RechartsLineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
          <XAxis 
            dataKey={nameKey} 
            axisLine={false} 
            tickLine={false} 
            tick={{ fontSize: 12, fill: "#64748b" }} 
            dy={10} 
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fontSize: 12, fill: "#64748b" }} 
            tickFormatter={(value) => `${value}`}
          />
          <Tooltip 
            cursor={{ fill: "transparent", stroke: "#e2e8f0", strokeWidth: 2, strokeDasharray: "3 3" }}
            contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }}
          />
          <Line 
            type="monotone" 
            dataKey={dataKey} 
            stroke={stroke} 
            strokeWidth={3}
            dot={{ r: 4, fill: stroke, strokeWidth: 2, stroke: "#fff" }}
            activeDot={{ r: 6, fill: stroke, stroke: "#fff", strokeWidth: 2 }}
          />
        </RechartsLineChart>
      </ResponsiveContainer>
    </div>
  )
}
