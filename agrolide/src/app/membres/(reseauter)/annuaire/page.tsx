import React, { Suspense } from 'react'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { Metadata } from 'next'
import { auth } from '@/lib/auth/server'
import { buttonVariants, Button } from '@/components/ui/Button'
import { Alert } from '@/components/ui/Alert'
import { PageEntete } from '@/components/layout/PageEntete'
import { EmptyState } from '@/components/ui/EmptyState'
import { SkeletonGrid } from '@/components/ui/Skeleton'
import { AnnuaireFilters } from '@/components/modules/reseau/AnnuaireFilters'
import { MemberCard } from '@/components/modules/reseau/MemberCard'
import { SuggestionGrid } from '@/components/modules/reseau/SuggestionGrid'
import { fetchAnnuaire, fetchMonProfil, filtersToQuery, MAX_RESULTS, parseFilters, triParDefaut, type AnnuaireFilters as Filters } from '@/lib/reseau/annuaire'
import { profilSuffisant } from '@/lib/reseau/suggestions'
import { categorieLabel } from '@/lib/reseau/profil'
import type { ProfilPourScore } from '@/lib/reseau/suggestions'

import { ChevronLeft, ChevronRight, Search, UserRound, X } from "@/components/ui/icons"
export const metadata: Metadata = {
  title: 'Annuaire des membres',
  description: 'Retrouvez les membres du réseau agrolide et connectez-vous à eux.',
  robots: { index: false, follow: false },
}

const BASE = '/membres/annuaire'

type SearchParams = Promise<Record<string, string | string[] | undefined>>

export default async function AnnuaireMembresPage({ searchParams }: { searchParams: SearchParams }) {
  const { userId } = await auth()
  if (!userId) redirect(`/login?next=${encodeURIComponent(BASE)}`)

  const [brut, moi] = await Promise.all([searchParams, fetchMonProfil(userId)])
  const suffisant = moi ? profilSuffisant(moi) : false
  const parDefaut = triParDefaut(suffisant)
  const filters = parseFilters(brut)
  // Tri par défaut : « pertinence » si le profil est assez renseigné, sinon « inscrits récemment ».
  const effectifs: Filters = { ...filters, tri: filters.tri ?? parDefaut }

  return (
    <div className="mx-auto max-w-[1200px] space-y-6 px-2 py-6 md:px-4">
      <PageEntete
        titre="Annuaire des membres"
        description="Retrouvez des membres du réseau, invitez-les à se connecter, puis échangez par la messagerie."
      />
      <AnnuaireFilters basePath={BASE} initial={effectifs} triParDefaut={parDefaut} />
      <ActiveFilters filters={filters} />

      {/* La clé relance l'affichage de chargement à chaque nouvelle recherche. */}
      <Suspense key={filtersToQuery(effectifs)} fallback={<SkeletonGrid count={6} />}>
        <Results viewerId={userId} filters={effectifs} moi={moi} profilSuffisant={suffisant} />
      </Suspense>
    </div>
  )
}

function ActiveFilters({ filters }: { filters: Filters }) {
  const chips: Array<{ label: string; next: Partial<Filters> }> = []
  if (filters.q) chips.push({ label: `Recherche : ${filters.q}`, next: { ...filters, q: '', page: 1 } })
  if (filters.pays) chips.push({ label: `Pays : ${filters.pays}`, next: { ...filters, pays: '', page: 1 } })
  if (filters.categorie) chips.push({ label: `Catégorie : ${categorieLabel(filters.categorie)}`, next: { ...filters, categorie: '', page: 1 } })
  if (filters.langue) chips.push({ label: `Langue : ${filters.langue}`, next: { ...filters, langue: '', page: 1 } })
  if (filters.theme) chips.push({ label: `Spécialité : ${filters.theme}`, next: { ...filters, theme: '', page: 1 } })
  if (chips.length === 0) return null

  return (
    <div className="flex flex-wrap items-center gap-2">
      <p className="sr-only">Filtres appliqués</p>
      {chips.map((c) => (
        <Link
          key={c.label}
          href={`${BASE}${filtersToQuery(c.next)}`}
          aria-label={`Retirer le filtre ${c.label}`}
          className="inline-flex min-h-11 items-center gap-1.5 rounded-full bg-primary-container px-4 text-label-md text-on-primary-container hover:bg-primary-container/80"
        >
          {c.label}
          <X className="size-4" aria-hidden />
        </Link>
      ))}
      <Link href={BASE} className={buttonVariants({ variant: 'text', size: 'sm' })}>
        Tout effacer
      </Link>
    </div>
  )
}

async function Results({ viewerId, filters, moi, profilSuffisant }: { viewerId: string; filters: Filters; moi: ProfilPourScore | null; profilSuffisant: boolean }) {
  const result = await fetchAnnuaire(viewerId, filters, moi)
  const hasFilters = Boolean(filters.q || filters.pays || filters.categorie || filters.theme || filters.langue)
  const pertinence = filters.tri === 'pertinence' && moi !== null

  if (result.total === 0) {
    return hasFilters ? (
      <EmptyState arche
        icon={<Search />}
        title="Aucun membre ne correspond à votre recherche"
        description="Essayez avec moins de critères, ou une autre orthographe."
        action={<Button variant="secondary" href={BASE}>Effacer les filtres</Button>}
      />
    ) : (
      <EmptyState arche
        icon={<UserRound />}
        title="Aucun autre membre n’est visible pour le moment"
        description="Complétez votre profil : les autres membres pourront mieux vous reconnaître quand ils apparaîtront ici."
        action={<Button variant="secondary" href="/membres/profil">Compléter mon profil</Button>}
      />
    )
  }

  const pageHref = (page: number) => `${BASE}${filtersToQuery({ ...filters, page })}`

  return (
    <div role="region" aria-label="Résultats">
      <p role="status" className="mb-4 text-body-md text-on-surface-variant">
        {result.total} {result.total > 1 ? 'membres' : 'membre'}
        {result.total > MAX_RESULTS && ` · les ${MAX_RESULTS} premiers sont affichés, affinez votre recherche pour voir les autres`}
        {result.tronque && ' · liste limitée aux inscriptions les plus récentes, affinez votre recherche pour voir les autres'}
      </p>

      {pertinence && !profilSuffisant && (
        <Alert variant="info" className="mb-4">
          <p>Complétez votre profil pour recevoir de vraies suggestions : sans métier, spécialités, langues ou pays, rien ne permet de vous comparer aux autres membres.</p>
          <Button variant="secondary" href="/membres/profil/modifier" className="mt-3">Compléter mon profil</Button>
        </Alert>
      )}
      {pertinence && (
        <p className="mb-4 text-body-sm text-on-surface-muted">
          Les membres déjà en relation avec vous ou invités ne sont pas proposés ici : choisissez « Inscrits récemment » pour tout voir.
        </p>
      )}

      {pertinence ? (
        <SuggestionGrid members={result.members} />
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {result.members.map((m) => (
            <li key={m.id}>
              <MemberCard member={m} />
            </li>
          ))}
        </ul>
      )}

      {result.pageCount > 1 && (
        <nav aria-label="Pagination" className="mt-8 flex items-center justify-center gap-3">
          {result.page > 1 ? (
            <Link href={pageHref(result.page - 1)} rel="prev" className={buttonVariants({ variant: 'outline' })}>
              <ChevronLeft className="size-5" aria-hidden />
              Précédent
            </Link>
          ) : (
            <span aria-hidden className="min-w-[8.5rem]" />
          )}
          <span className="text-body-md text-on-surface-variant" aria-current="page">
            Page {result.page} sur {result.pageCount}
          </span>
          {result.page < result.pageCount ? (
            <Link href={pageHref(result.page + 1)} rel="next" className={buttonVariants({ variant: 'outline' })}>
              Suivant
              <ChevronRight className="size-5" aria-hidden />
            </Link>
          ) : (
            <span aria-hidden className="min-w-[8.5rem]" />
          )}
        </nav>
      )}
    </div>
  )
}
