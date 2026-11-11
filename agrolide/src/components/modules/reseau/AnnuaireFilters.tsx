'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { Search, SlidersHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { FormField } from '@/components/ui/FormField'
import { Input } from '@/components/ui/Input'
import { NativeSelect } from '@/components/ui/Select'
import { filtersToQuery, type AnnuaireFilters as Filters, type Tri } from '@/lib/reseau/filtres'
import { CATEGORIES, LANGUES, PAYS, PAYS_AUTRE, THEMATIQUES } from '@/lib/reseau/profil'

/**
 * Recherche et filtres de l'annuaire. Un vrai formulaire (méthode GET) : fonctionne sans JavaScript,
 * et l'état vit dans l'adresse de la page (lien partageable, bouton Précédent fonctionnel).
 * Sur mobile, les filtres se replient derrière un bouton « Filtres » ; sur ordinateur ils sont toujours visibles.
 */
export function AnnuaireFilters({ basePath, initial, triParDefaut }: { basePath: string; initial: Filters; triParDefaut: Tri }) {
  const router = useRouter()
  const [pending, startTransition] = React.useTransition()
  const triActuel = initial.tri ?? triParDefaut
  const activeCount = [initial.pays, initial.categorie, initial.theme, initial.langue].filter(Boolean).length + (triActuel !== triParDefaut ? 1 : 0)
  const [open, setOpen] = React.useState(activeCount > 0)

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const data = new FormData(e.currentTarget)
    const next: Partial<Filters> = {
      q: String(data.get('q') ?? '').trim(),
      pays: String(data.get('pays') ?? ''),
      categorie: String(data.get('categorie') ?? ''),
      theme: String(data.get('theme') ?? ''),
      tri: data.get('tri') === 'nom' ? 'nom' : 'recents',
    }
    startTransition(() => router.push(`${basePath}${filtersToQuery(next)}`))
  }

  // La clé relance les champs quand l'adresse change (effacer un filtre depuis une puce, par exemple).
  const formKey = filtersToQuery({ ...initial, page: 1 })

  return (
    <form key={formKey} action={basePath} method="get" role="search" aria-label="Rechercher dans l’annuaire" onSubmit={onSubmit} className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <FormField label="Rechercher un membre" className="sm:flex-1">
          <Input type="search" name="q" defaultValue={initial.q} maxLength={80} placeholder="Nom, organisation, spécialité, ville…" autoComplete="off" />
        </FormField>
        <div className="flex gap-3">
          <Button type="submit" variant="secondary" loading={pending} className="flex-1 sm:flex-none">
            <Search className="size-5" aria-hidden />
            Rechercher
          </Button>
          <Button
            type="button"
            variant="outline"
            className="md:hidden"
            aria-expanded={open}
            aria-controls="filtres-annuaire"
            onClick={() => setOpen((v) => !v)}
          >
            <SlidersHorizontal className="size-5" aria-hidden />
            Filtres{activeCount > 0 ? ` (${activeCount})` : ''}
          </Button>
        </div>
      </div>

      <div id="filtres-annuaire" className={open ? 'grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5' : 'hidden gap-4 md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5'}>
        <FormField label="Pays">
          <NativeSelect name="pays" defaultValue={initial.pays}>
            <option value="">Tous les pays</option>
            {PAYS.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
            <option value={PAYS_AUTRE}>{PAYS_AUTRE}</option>
          </NativeSelect>
        </FormField>
        <FormField label="Catégorie de membre">
          <NativeSelect name="categorie" defaultValue={initial.categorie}>
            <option value="">Toutes les catégories</option>
            {CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </NativeSelect>
        </FormField>
        <FormField label="Thématique">
          <NativeSelect name="theme" defaultValue={initial.theme}>
            <option value="">Toutes les thématiques</option>
            {THEMATIQUES.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </NativeSelect>
        </FormField>
        <FormField label="Langue">
          <NativeSelect name="langue" defaultValue={initial.langue}>
            <option value="">Toutes les langues</option>
            {LANGUES.map((l) => (
              <option key={l} value={l}>{l}</option>
            ))}
          </NativeSelect>
        </FormField>
        <FormField label="Trier par">
          <NativeSelect name="tri" defaultValue={triActuel}>
            <option value="pertinence">Pertinence pour vous</option>
            <option value="recents">Inscrits récemment</option>
            <option value="nom">Nom (A à Z)</option>
          </NativeSelect>
        </FormField>
      </div>
    </form>
  )
}
