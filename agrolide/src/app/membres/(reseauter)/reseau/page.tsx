import React from 'react'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import type { Metadata } from 'next'
import { auth } from '@/lib/auth/server'
import { Button } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/EmptyState'
import { Input } from '@/components/ui/Input'
import { NativeSelect } from '@/components/ui/Select'
import { cn } from '@/lib/utils/formatters'
import { MemberCard } from '@/components/modules/reseau/MemberCard'
import { RelationCard } from '@/components/modules/reseau/RelationCard'
import { SuggestionGrid } from '@/components/modules/reseau/SuggestionGrid'
import { fetchAnnuaire, fetchMonProfil, parseFilters } from '@/lib/reseau/annuaire'
import { fetchInvitations, fetchRelations, type TriRelations } from '@/lib/reseau/mon-reseau'
import { profilSuffisant } from '@/lib/reseau/suggestions'
import type { ProfilPourScore } from '@/lib/reseau/suggestions'

import { Search, Send, UserPlus, Users } from "@/components/ui/icons"
export const metadata: Metadata = {
  title: 'Mon réseau',
  robots: { index: false, follow: false },
}

const BASE = '/membres/reseau'
const ONGLETS = [
  { id: 'suggestions', label: 'Suggestions' },
  { id: 'invitations', label: 'Invitations' },
  { id: 'relations', label: 'Relations' },
] as const
type OngletId = (typeof ONGLETS)[number]['id']

type SearchParams = Promise<Record<string, string | string[] | undefined>>
const premier = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) ?? ''

export default async function MonReseauPage({ searchParams }: { searchParams: SearchParams }) {
  const { userId } = await auth()
  if (!userId) redirect(`/login?next=${encodeURIComponent(BASE)}`)

  const brut = await searchParams
  const onglet: OngletId = (ONGLETS.find((o) => o.id === premier(brut.onglet))?.id ?? 'suggestions') as OngletId

  // Le nombre d'invitations reçues sert au badge de l'onglet : lu sur tous les onglets (1 requête légère via la liste).
  const invitations = await fetchInvitations(userId)

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-headline-md text-on-surface">Mon réseau</h1>
        <p className="mt-1 text-body-md text-on-surface-variant">
          Répondez à vos invitations, retrouvez vos relations et découvrez des membres proches de votre profil.
        </p>
      </header>

      <nav aria-label="Mon réseau" className="flex gap-1 overflow-x-auto border-b border-outline-variant [scrollbar-width:none]">
        {ONGLETS.map((o) => {
          const actif = o.id === onglet
          return (
            <Link
              key={o.id}
              href={o.id === 'suggestions' ? BASE : `${BASE}?onglet=${o.id}`}
              aria-current={actif ? 'page' : undefined}
              className={cn(
                'ag-state relative -mb-px inline-flex min-h-12 shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-t-control border-b-2 px-4 text-label-lg transition-colors duration-150 ease-standard',
                actif ? 'border-primary text-primary' : 'border-transparent text-on-surface-variant',
              )}
            >
              {o.label}
              {o.id === 'invitations' && invitations.recues.length > 0 && (
                <span className="inline-flex min-w-6 items-center justify-center rounded-full bg-error px-1.5 text-label-md text-on-error">
                  <span aria-hidden>{invitations.recues.length}</span>
                  <span className="sr-only">{invitations.recues.length} {invitations.recues.length > 1 ? 'invitations reçues' : 'invitation reçue'}</span>
                </span>
              )}
            </Link>
          )
        })}
      </nav>

      {onglet === 'suggestions' && <Suggestions viewerId={userId} />}
      {onglet === 'invitations' && <Invitations recues={invitations.recues} envoyees={invitations.envoyees} />}
      {onglet === 'relations' && <Relations viewerId={userId} q={premier(brut.q).trim().slice(0, 80)} tri={premier(brut.tri) === 'nom' ? 'nom' : 'recentes'} />}
    </div>
  )
}

const DECOUVRIR = (
  <Button variant="secondary" href="/membres/annuaire">
    <UserPlus className="size-5" aria-hidden />
    Découvrir des membres
  </Button>
)

async function Suggestions({ viewerId }: { viewerId: string }) {
  const moi: ProfilPourScore | null = await fetchMonProfil(viewerId)
  if (!moi || !profilSuffisant(moi)) {
    return (
      <EmptyState arche
        icon={<UserPlus />}
        title="Complétez votre profil pour recevoir des suggestions"
        description="Sans métier, spécialités, langues ou pays, rien ne permet de vous comparer aux autres membres."
        action={<Button variant="secondary" href="/membres/profil/modifier">Compléter mon profil</Button>}
      />
    )
  }
  const result = await fetchAnnuaire(viewerId, { ...parseFilters({}), tri: 'pertinence' }, moi)
  const suggeres = result.members.filter((m) => m.suggere)
  if (suggeres.length === 0) {
    return (
      <EmptyState arche
        icon={<UserPlus />}
        title="Aucune suggestion pour le moment"
        description="Les membres déjà en relation avec vous ou invités ne sont pas proposés ici. Parcourez l’annuaire pour en trouver d’autres."
        action={DECOUVRIR}
      />
    )
  }
  return (
    <div className="space-y-6">
      <SuggestionGrid members={suggeres} />
      <div>
        <Button variant="outline" href="/membres/annuaire">Voir tout l’annuaire</Button>
      </div>
    </div>
  )
}

function Invitations({ recues, envoyees }: { recues: Awaited<ReturnType<typeof fetchInvitations>>['recues']; envoyees: Awaited<ReturnType<typeof fetchInvitations>>['envoyees'] }) {
  return (
    <div className="space-y-10">
      <div role="region" aria-labelledby="titre-recues" className="space-y-4">
        <h2 id="titre-recues" className="text-title-lg text-on-surface">Reçues</h2>
        {recues.length === 0 ? (
          <EmptyState arche icon={<Users />} title="Aucune invitation en attente." description="Quand un membre vous invitera, vous pourrez l’accepter ou l’ignorer ici." />
        ) : (
          <ul className="grid grid-cols-2 gap-2.5 sm:gap-4 xl:grid-cols-3">
            {recues.map((m) => (
              <li key={m.connectionId ?? m.id}>
                <MemberCard member={m} />
              </li>
            ))}
          </ul>
        )}
      </div>

      <div role="region" aria-labelledby="titre-envoyees" className="space-y-4">
        <h2 id="titre-envoyees" className="text-title-lg text-on-surface">Envoyées</h2>
        {envoyees.length === 0 ? (
          <EmptyState arche icon={<Send />} title="Vous n’avez envoyé aucune invitation." action={DECOUVRIR} />
        ) : (
          <ul className="grid grid-cols-2 gap-2.5 sm:gap-4 xl:grid-cols-3">
            {envoyees.map((m) => (
              <li key={m.connectionId ?? m.id}>
                <MemberCard member={m} libelleEnAttente="En attente" />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

async function Relations({ viewerId, q, tri }: { viewerId: string; q: string; tri: TriRelations }) {
  const { relations, total } = await fetchRelations(viewerId, q, tri)

  if (total === 0) {
    return <EmptyState arche icon={<Users />} title="Vous n’avez pas encore de relations." description="Invitez des membres : une fois l’invitation acceptée, ils apparaissent ici." action={DECOUVRIR} />
  }

  return (
    <div className="space-y-6">
      <form method="get" action={BASE} role="search" aria-label="Rechercher dans mes relations" className="grid gap-3 sm:grid-cols-[1fr_14rem_auto] sm:items-end">
        <input type="hidden" name="onglet" value="relations" />
        <Input label="Rechercher une relation" name="q" type="search" defaultValue={q} placeholder="Nom, spécialité, pays…" maxLength={80} />
        <label className="flex flex-col gap-1.5 text-label-lg text-on-surface">
          Trier par
          <NativeSelect name="tri" defaultValue={tri}>
            <option value="recentes">Plus récentes</option>
            <option value="nom">Nom</option>
          </NativeSelect>
        </label>
        <Button type="submit" variant="secondary">
          <Search className="size-5" aria-hidden />
          Rechercher
        </Button>
      </form>

      <p role="status" className="text-body-md text-on-surface-variant">
        {relations.length} {relations.length > 1 ? 'relations' : 'relation'}
        {q && ` pour « ${q} »`}
      </p>

      {relations.length === 0 ? (
        <EmptyState arche
          icon={<Search />}
          title="Aucune relation ne correspond à votre recherche"
          description="Essayez avec moins de mots, ou une autre orthographe."
          action={<Button variant="secondary" href={`${BASE}?onglet=relations`}>Effacer la recherche</Button>}
        />
      ) : (
        <ul className="grid grid-cols-2 gap-2.5 sm:gap-4 xl:grid-cols-3">
          {relations.map((m) => (
            <li key={m.id}>
              <RelationCard member={m} />
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
