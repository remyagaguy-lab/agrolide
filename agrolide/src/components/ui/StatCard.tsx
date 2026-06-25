"use client"

import * as React from "react"
import { cn } from "@/lib/utils/formatters"

export interface StatCardProps {
  title: string;
  value: number | string;
  suffix?: string;
  className?: string;
}

export function StatCard({ title, value, suffix = "", className }: StatCardProps) {
  const [current, setCurrent] = React.useState(0)
  const ref = React.useRef<HTMLDivElement>(null)
  
  const parsedValue = typeof value === 'number' ? value : parseInt(value, 10);
  const isNumber = !isNaN(parsedValue);

  React.useEffect(() => {
    if (!isNumber) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          let start = 0
          const end = parsedValue
          const duration = 2000
          
          if (end === 0) {
            setCurrent(0);
            return;
          }
          
          const stepTime = Math.abs(Math.floor(duration / end))
          
          const timer = setInterval(() => {
            start += Math.ceil(end / 50) // increment by steps
            if (start >= end) {
              setCurrent(end)
              clearInterval(timer)
            } else {
              setCurrent(start)
            }
          }, 40)

          observer.unobserve(entry.target)
        }
      },
      { threshold: 0.1 }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [parsedValue, isNumber])

  return (
    <div ref={ref} className={cn("flex flex-col items-center justify-center p-6 bg-white rounded-lg shadow-sm border border-[var(--color-gris-clair)]", className)}>
      <span className="text-4xl font-heading font-bold text-[var(--color-vert-principal)] mb-2">
        {isNumber ? current : value}{suffix}
      </span>
      <span className="text-[var(--color-gris-texte)] text-center font-medium">
        {title}
      </span>
    </div>
  )
}
