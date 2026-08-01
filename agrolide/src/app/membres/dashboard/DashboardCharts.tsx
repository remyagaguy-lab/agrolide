"use client"
import React from 'react'
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

const areaData = [
  { name: 'Lun', vues: 40, interactions: 24 },
  { name: 'Mar', vues: 30, interactions: 13 },
  { name: 'Mer', vues: 20, interactions: 98 },
  { name: 'Jeu', vues: 27, interactions: 39 },
  { name: 'Ven', vues: 18, interactions: 48 },
  { name: 'Sam', vues: 23, interactions: 38 },
  { name: 'Dim', vues: 34, interactions: 43 },
]

export function NetworkActivityChart() {
  return (
    <div className="h-[200px] w-full mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={areaData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="colorVues" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#1b5e38" stopOpacity={0.2}/>
              <stop offset="95%" stopColor="#1b5e38" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorInteractions" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#878e2c" stopOpacity={0.2}/>
              <stop offset="95%" stopColor="#878e2c" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#9ca3af' }} dy={10} />
          <Tooltip 
            contentStyle={{ borderRadius: '12px', border: '1px solid #e8e8e4', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
            itemStyle={{ fontSize: '11px', fontWeight: 'bold' }}
            labelStyle={{ fontSize: '10px', color: '#6b7280', marginBottom: '4px' }}
          />
          <Area type="monotone" dataKey="vues" name="Vues profil" stroke="#1b5e38" strokeWidth={2} fillOpacity={1} fill="url(#colorVues)" />
          <Area type="monotone" dataKey="interactions" name="Interactions" stroke="#878e2c" strokeWidth={2} fillOpacity={1} fill="url(#colorInteractions)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

const pieData = [
  { name: 'Renseigné', value: 85 },
  { name: 'Manquant', value: 15 },
]
const COLORS = ['#50a853', '#f0f7f0']

export function ProfileCompletionChart() {
  return (
    <div className="h-[120px] w-full relative">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={pieData}
            cx="50%"
            cy="50%"
            innerRadius={35}
            outerRadius={50}
            startAngle={90}
            endAngle={-270}
            dataKey="value"
            stroke="none"
            cornerRadius={4}
          >
            {pieData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <span className="text-lg font-bold text-[#1a1a1a] font-heading">85%</span>
      </div>
    </div>
  )
}
