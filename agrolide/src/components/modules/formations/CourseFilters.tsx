'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useTransition } from 'react';
import { Button } from '@/components/ui/Button';
import { FormField } from '@/components/ui/FormField';
import { NativeSelect } from '@/components/ui/Select';
import { SlidersHorizontal, X } from "@/components/ui/icons"
const THEMATIQUES = ['Agrobusiness', 'Production Animale', 'Production Végétale', 'Financement', 'Agroécologie', 'Gestion des Sols'];
const SOURCES = [
  { value: 'Agrolide', label: 'Agrolide' },
  { value: 'FAO elearning Academy', label: 'FAO' },
  { value: 'FUN MOOC', label: 'FUN MOOC' },
];
const NIVEAUX = ['Débutant', 'Intermédiaire', 'Avancé'];
const PRIX = [
  { value: 'gratuit', label: 'Gratuit' },
  { value: 'payant', label: 'Payant' },
];

/**
 * Filtres du catalogue : une barre de listes (comme la bibliothèque et l'annuaire), l'état vit dans l'adresse.
 * Sur mobile, ils se replient derrière un bouton « Filtres ».
 */
export default function CourseFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  const valeur = (cle: string) => searchParams.get(cle) || '';
  const thematique = valeur('thematique');
  const source = valeur('source');
  const niveau = valeur('niveau');
  const prix = valeur('prix');

  const puces = [
    thematique && { cle: 'thematique', libelle: thematique },
    source && { cle: 'source', libelle: SOURCES.find((s) => s.value === source)?.label ?? source },
    niveau && { cle: 'niveau', libelle: niveau },
    prix && { cle: 'prix', libelle: PRIX.find((p) => p.value === prix)?.label ?? prix },
  ].filter(Boolean) as Array<{ cle: string; libelle: string }>;

  const [ouvert, setOuvert] = useState(puces.length > 0);

  const changer = (nom: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(nom, value);
    else params.delete(nom);
    startTransition(() => router.push(`?${params.toString()}`, { scroll: false }));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between md:hidden">
        <p className="text-label-lg font-bold text-on-surface">Filtrer les formations</p>
        <Button
          type="button"
          variant="outline"
          size="sm"
          aria-expanded={ouvert}
          aria-controls="filtres-formations"
          onClick={() => setOuvert((v) => !v)}
        >
          <SlidersHorizontal className="size-4" aria-hidden />
          Filtres{puces.length > 0 ? ` (${puces.length})` : ''}
        </Button>
      </div>

      <div
        id="filtres-formations"
        className={ouvert ? 'grid gap-4 sm:grid-cols-2 lg:grid-cols-4' : 'hidden gap-4 md:grid md:grid-cols-2 lg:grid-cols-4'}
      >
        <FormField label="Thématique">
          <NativeSelect value={thematique} onChange={(e) => changer('thematique', e.target.value)}>
            <option value="">Toutes les thématiques</option>
            {THEMATIQUES.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </NativeSelect>
        </FormField>
        <FormField label="Source">
          <NativeSelect value={source} onChange={(e) => changer('source', e.target.value)}>
            <option value="">Toutes les sources</option>
            {SOURCES.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </NativeSelect>
        </FormField>
        <FormField label="Niveau">
          <NativeSelect value={niveau} onChange={(e) => changer('niveau', e.target.value)}>
            <option value="">Tous les niveaux</option>
            {NIVEAUX.map((n) => (
              <option key={n} value={n}>{n}</option>
            ))}
          </NativeSelect>
        </FormField>
        <FormField label="Accès">
          <NativeSelect value={prix} onChange={(e) => changer('prix', e.target.value)}>
            <option value="">Gratuit et payant</option>
            {PRIX.map((p) => (
              <option key={p.value} value={p.value}>{p.label}</option>
            ))}
          </NativeSelect>
        </FormField>
      </div>

      {puces.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <p className="sr-only">Filtres appliqués</p>
          {puces.map((p) => (
            <button
              key={p.cle}
              type="button"
              onClick={() => changer(p.cle, '')}
              aria-label={`Retirer le filtre ${p.libelle}`}
              className="inline-flex min-h-11 items-center gap-1.5 rounded-full bg-primary-container px-4 text-label-md text-on-primary-container hover:bg-primary-container/80"
            >
              {p.libelle}
              <X className="size-4" aria-hidden />
            </button>
          ))}
          <Button type="button" variant="text" size="sm" onClick={() => startTransition(() => router.push('?', { scroll: false }))}>
            Tout effacer
          </Button>
        </div>
      )}
    </div>
  );
}
