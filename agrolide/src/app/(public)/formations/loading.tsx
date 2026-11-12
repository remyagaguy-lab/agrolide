import { Skeleton, SkeletonGrid } from "@/components/ui/Skeleton"

/** Chargement du catalogue : bandeau vert, filtres à gauche, cartes à droite. */
export default function FormationsLoading() {
  return (
    <div className="min-h-screen bg-surface-container-low">
      <div className="bg-surface-brand pb-16 pt-12 md:pt-16 lg:pt-20">
        <div className="container space-y-4">
          <Skeleton className="h-4 w-24 bg-on-surface-brand/20" />
          <Skeleton className="h-12 w-full max-w-xl bg-on-surface-brand/20" />
        </div>
      </div>
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 pt-8 sm:px-6 md:flex-row lg:px-8">
        <Skeleton className="h-96 w-full shrink-0 rounded-card md:w-64 lg:w-72" />
        <div className="flex-1">
          <SkeletonGrid count={6} />
        </div>
      </div>
    </div>
  )
}
