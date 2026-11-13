import { Skeleton } from "@/components/ui/Skeleton"

/** Chargement du tableau de bord : bandeau, bibliothèque + compte, formations + événements, offres. */
export default function DashboardLoading() {
  return (
    <div className="space-y-5" role="status" aria-busy="true" aria-label="Chargement du tableau de bord">
      <Skeleton className="h-32 w-full rounded-card" />
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-12">
        <Skeleton className="h-80 rounded-card xl:col-span-8" />
        <Skeleton className="h-80 rounded-card xl:col-span-4" />
      </div>
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <Skeleton className="h-56 rounded-card" />
        <Skeleton className="h-56 rounded-card" />
      </div>
      <Skeleton className="h-48 rounded-card" />
    </div>
  )
}
