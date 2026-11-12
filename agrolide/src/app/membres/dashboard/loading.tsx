import { Skeleton } from "@/components/ui/Skeleton"

/** Chargement du tableau de bord : bandeau, quatre chiffres clés, deux encarts. */
export default function DashboardLoading() {
  return (
    <div className="space-y-5" role="status" aria-busy="true" aria-label="Chargement du tableau de bord">
      <Skeleton className="h-24 w-full rounded-card" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-32 rounded-card" />
        ))}
      </div>
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <Skeleton className="h-64 rounded-card" />
        <Skeleton className="h-64 rounded-card" />
      </div>
    </div>
  )
}
