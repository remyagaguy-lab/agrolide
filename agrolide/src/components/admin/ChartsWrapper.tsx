"use client"
import dynamic from "next/dynamic"

const RevenueChart = dynamic(
  () => import("./RevenueChart").then(m => m.RevenueChart),
  { ssr: false, loading: () => <div className="h-[220px] bg-gray-50 rounded-lg animate-pulse" /> }
)

const DonutChart = dynamic(
  () => import("./DonutChart").then(m => m.DonutChart),
  { ssr: false, loading: () => <div className="h-[180px] bg-gray-50 rounded-lg animate-pulse" /> }
)

export function AdminRevenueChart(props: React.ComponentProps<typeof RevenueChart>) {
  return <RevenueChart {...props} />
}

export function AdminDonutChart(props: React.ComponentProps<typeof DonutChart>) {
  return <DonutChart {...props} />
}
