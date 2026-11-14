"use client"

import * as React from "react"
import { FormField } from "@/components/ui/FormField"
import { Input } from "@/components/ui/Input"
import { NativeSelect } from "@/components/ui/Select"
import { TYPE_ORGANISATION_AUTRE, TYPES_ORGANISATION } from "@/lib/reseau/profil"

/**
 * Type d'organisation d'un Partenaire : liste de types courants, plus « Autre » avec saisie libre.
 * La valeur transmise est le type lui-même (valeur de la liste, ou texte libre), jamais le mot « Autre ».
 */
export function TypeOrganisationChamp({
  valeur,
  onChange,
  erreur,
  required = false,
  id = "champ-type_organisation",
}: {
  valeur: string
  onChange: (valeur: string) => void
  erreur?: string
  required?: boolean
  id?: string
}) {
  const dansLaListe = (TYPES_ORGANISATION as readonly string[]).includes(valeur)
  // « Autre » reste affiché pendant la saisie, même si le champ libre est encore vide.
  const [autre, setAutre] = React.useState(() => !!valeur && !dansLaListe)
  const choix = autre ? TYPE_ORGANISATION_AUTRE : dansLaListe ? valeur : ""

  return (
    <div className="space-y-3">
      <FormField label="Type d’organisation" id={id} error={autre ? undefined : erreur} required={required}>
        <NativeSelect
          value={choix}
          onChange={(e) => {
            const v = e.target.value
            if (v === TYPE_ORGANISATION_AUTRE) {
              setAutre(true)
              if (dansLaListe) onChange("")
            } else {
              setAutre(false)
              onChange(v)
            }
          }}
        >
          <option value="">Sélectionnez un type</option>
          {TYPES_ORGANISATION.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
          <option value={TYPE_ORGANISATION_AUTRE}>{TYPE_ORGANISATION_AUTRE}</option>
        </NativeSelect>
      </FormField>
      {autre && (
        <FormField label="Précisez le type" id={`${id}-libre`} error={erreur} required={required}>
          <Input
            value={valeur}
            onChange={(e) => onChange(e.target.value)}
            maxLength={40}
            placeholder="Ex : fondation, syndicat, incubateur…"
          />
        </FormField>
      )}
    </div>
  )
}
