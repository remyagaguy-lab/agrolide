import { Skeleton, SkeletonList } from "@/components/ui/Skeleton"

/** Chargement d'une page de l'espace membre : titre puis liste, à la place du contenu. */
export default function MembresLoading() {
  return (
    <div className="space-y-6" aria-busy="true">
      <div className="space-y-3">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-96 max-w-full" />
      </div>
      <SkeletonList count={4} />
    </div>
  )
}
