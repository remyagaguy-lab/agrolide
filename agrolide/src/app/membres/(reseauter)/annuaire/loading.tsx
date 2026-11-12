import { Skeleton, SkeletonGrid } from "@/components/ui/Skeleton"

/** Chargement d'une liste de membres : titre, barre de recherche puis cartes. */
export default function ListeMembresLoading() {
  return (
    <div className="space-y-6" aria-busy="true">
      <Skeleton className="h-8 w-56" />
      <Skeleton className="h-12 w-full max-w-xl" />
      <SkeletonGrid count={6} />
    </div>
  )
}
