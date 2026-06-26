'use client'

import React from 'react'
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval, 
  isSameMonth, 
  isSameDay, 
  isToday 
} from 'date-fns'
import { fr } from 'date-fns/locale'
import { ChevronLeft, ChevronRight } from 'lucide-react'

// Utilise le type du DDL
type Evenement = {
  id: string
  titre: string
  type_evt: string
  date_debut: string
  date_fin: string | null
  lieu: string | null
  en_ligne: boolean | null
  [key: string]: any
}

interface CustomCalendarProps {
  events: Evenement[]
  currentDate: Date
  onCurrentDateChange: (date: Date) => void
  onEventClick: (event: Evenement) => void
}

export default function CustomCalendar({ 
  events, 
  currentDate, 
  onCurrentDateChange,
  onEventClick
}: CustomCalendarProps) {
  
  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(monthStart)
  const startDate = startOfWeek(monthStart, { weekStartsOn: 1 }) // Commence Lundi
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 })
  
  const dateFormat = "MMMM yyyy"
  
  const days = eachDayOfInterval({
    start: startDate,
    end: endDate
  })

  const nextMonth = () => {
    onCurrentDateChange(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
  }

  const prevMonth = () => {
    onCurrentDateChange(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-gray-50">
        <button 
          onClick={prevMonth}
          className="p-2 hover:bg-gray-200 rounded-full transition-colors"
        >
          <ChevronLeft className="w-5 h-5 text-gray-600" />
        </button>
        <h2 className="text-lg font-bold text-gray-900 capitalize">
          {format(currentDate, dateFormat, { locale: fr })}
        </h2>
        <button 
          onClick={nextMonth}
          className="p-2 hover:bg-gray-200 rounded-full transition-colors"
        >
          <ChevronRight className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      {/* Days of week header */}
      <div className="grid grid-cols-7 border-b border-gray-100">
        {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map((day) => (
          <div key={day} className="py-2 text-center text-xs font-semibold text-gray-500 uppercase">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 auto-rows-fr">
        {days.map((day, idx) => {
          // Trouver les événements pour ce jour
          const dayEvents = events.filter(e => isSameDay(new Date(e.date_debut), day))
          
          return (
            <div 
              key={day.toString()}
              className={`min-h-[100px] p-2 border-b border-r border-gray-100 relative
                ${!isSameMonth(day, monthStart) ? 'bg-gray-50/50 text-gray-400' : 'text-gray-700'}
                ${isToday(day) ? 'bg-primary-50/30' : ''}
              `}
            >
              <div className={`text-right text-sm mb-1 ${isToday(day) ? 'font-bold text-primary-600' : ''}`}>
                {format(day, 'd')}
              </div>
              
              <div className="flex flex-col gap-1 mt-1">
                {dayEvents.map(evt => (
                  <button
                    key={evt.id}
                    onClick={() => onEventClick(evt)}
                    className="text-xs p-1 rounded bg-primary-50 text-primary-700 border border-primary-100 truncate text-left hover:bg-primary-100 transition-colors w-full"
                    title={evt.titre}
                  >
                    <span className="w-2 h-2 rounded-full bg-primary-500 inline-block mr-1"></span>
                    {evt.titre}
                  </button>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
