import { Skeleton } from "@/components/ui/Skeleton"

/** Chargement du tableau de bord : bandeau, trois widgets d'action, deux encarts. */
export default function DashboardLoading() {
  return (
    <div className="space-y-5" role="status" aria-busy="true" aria-label="Chargement du tableau de bord">
      <Skeleton className="h-24 w-full rounded-card" />
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
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
