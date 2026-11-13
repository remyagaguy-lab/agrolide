'use client'

import * as React from 'react'
import * as Popover from '@radix-ui/react-popover'
import { cn } from '@/lib/utils/formatters'
import { fieldControlClasses, fieldControlProps, useFieldContext } from './FormField'
import { Check, ChevronDown, Plus, X } from '@/components/ui/icons'

export interface MultiSelectGroupe {
  /** Titre du groupe (facultatif). */
  titre?: string
  options: readonly string[]
}

export interface MultiSelectProps {
  /** Valeurs choisies (listées ou saisies librement). */
  value: string[]
  onChange: (valeurs: string[]) => void
  groupes: readonly MultiSelectGroupe[]
  placeholder?: string
  /** Libellé du champ d'ajout libre ; sans lui, seules les options proposées sont choisissables. */
  ajoutLibre?: string
  /** Longueur maximale d'une valeur libre. */
  longueurMax?: number
  /** Nombre maximal de choix. */
  max?: number
  /** Nom accessible du menu (affiché aux lecteurs d'écran). */
  ariaLabel: string
}

const norm = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim()

/**
 * Menu déroulant à choix multiples. Les choix s'affichent en pastilles retirables sous le champ ;
 * une saisie libre permet d'ajouter ce qui manque à la liste. Clavier : Entrée dans le champ d'ajout, Échap pour fermer.
 */
export function MultiSelect({ value, onChange, groupes, placeholder = 'Choisir…', ajoutLibre, longueurMax = 40, max = 12, ariaLabel }: MultiSelectProps) {
  const ctx = useFieldContext()
  const [ouvert, setOuvert] = React.useState(false)
  const [saisie, setSaisie] = React.useState('')
  const [message, setMessage] = React.useState('')
  const proposees = React.useMemo(() => new Set(groupes.flatMap((g) => g.options)), [groupes])
  const horsListe = value.filter((v) => !proposees.has(v))
  const complet = value.length >= max

  const bascule = (v: string) => {
    setMessage('')
    if (value.includes(v)) return onChange(value.filter((x) => x !== v))
    if (complet) return setMessage(`${max} choix au maximum.`)
    onChange([...value, v])
  }

  const ajouter = () => {
    const brut = saisie.trim().replace(/\s+/g, ' ')
    if (!brut) return
    const existant = [...proposees, ...value].find((o) => norm(o) === norm(brut))
    if (existant) {
      if (!value.includes(existant)) bascule(existant)
      setSaisie('')
      return setMessage(value.includes(existant) ? 'Déjà dans vos choix.' : '')
    }
    if (complet) return setMessage(`${max} choix au maximum.`)
    onChange([...value, brut.charAt(0).toUpperCase() + brut.slice(1)])
    setSaisie('')
    setMessage('')
  }

  const resume = value.length === 0 ? placeholder : `${value.length} choisi${value.length > 1 ? 's' : ''}`

  return (
    <div className="space-y-2">
      <Popover.Root open={ouvert} onOpenChange={(o) => { setOuvert(o); if (!o) setMessage('') }}>
        <Popover.Trigger asChild>
          <button
            type="button"
            aria-haspopup="listbox"
            aria-label={`${ariaLabel} : ${resume}`}
            className={cn(fieldControlClasses, 'flex h-12 items-center justify-between gap-2 text-left', value.length === 0 && 'text-on-surface-muted')}
            {...fieldControlProps(ctx)}
          >
            <span className="truncate">{resume}</span>
            <ChevronDown className={cn('size-5 shrink-0 text-on-surface-variant transition-transform', ouvert && 'rotate-180')} aria-hidden />
          </button>
        </Popover.Trigger>
        <Popover.Portal>
          <Popover.Content
            align="start"
            sideOffset={4}
            collisionPadding={12}
            className="z-50 w-[var(--radix-popover-trigger-width)] min-w-64 overflow-hidden rounded-card border border-outline-variant bg-surface-container-lowest text-on-surface shadow-elev-3"
          >
            <div role="listbox" aria-multiselectable="true" aria-label={ariaLabel} className="max-h-[min(20rem,50vh)] overflow-y-auto overscroll-contain p-1">
              {groupes.map((g, i) => (
                <div key={g.titre ?? i} role="group" aria-label={g.titre}>
                  {g.titre && <p className="px-3 pb-1 pt-2 text-label-md font-bold uppercase tracking-wider text-on-surface-variant">{g.titre}</p>}
                  {g.options.map((o) => {
                    const coche = value.includes(o)
                    return (
                      <button
                        key={o}
                        type="button"
                        role="option"
                        aria-selected={coche}
                        onClick={() => bascule(o)}
                        className="ag-state flex min-h-11 w-full items-center gap-3 rounded-control px-3 py-2 text-left text-body-md hover:bg-primary-container hover:text-on-primary-container"
                      >
                        <span className={cn('flex size-5 shrink-0 items-center justify-center rounded border', coche ? 'border-primary bg-primary text-on-primary' : 'border-outline')}>
                          {coche && <Check className="size-4" aria-hidden />}
                        </span>
                        {o}
                      </button>
                    )
                  })}
                </div>
              ))}
              {horsListe.length > 0 && (
                <div role="group" aria-label="Vos ajouts">
                  <p className="px-3 pb-1 pt-2 text-label-md font-bold uppercase tracking-wider text-on-surface-variant">Vos ajouts</p>
                  {horsListe.map((o) => (
                    <button key={o} type="button" role="option" aria-selected onClick={() => bascule(o)} className="ag-state flex min-h-11 w-full items-center gap-3 rounded-control px-3 py-2 text-left text-body-md hover:bg-primary-container hover:text-on-primary-container">
                      <span className="flex size-5 shrink-0 items-center justify-center rounded border border-primary bg-primary text-on-primary"><Check className="size-4" aria-hidden /></span>
                      {o}
                    </button>
                  ))}
                </div>
              )}
            </div>
            {ajoutLibre && (
              <div className="border-t border-outline-variant p-2">
                <label htmlFor={`${ctx?.id ?? 'ms'}-ajout`} className="mb-1 block px-1 text-label-md text-on-surface-variant">{ajoutLibre}</label>
                <div className="flex gap-2">
                  <input
                    id={`${ctx?.id ?? 'ms'}-ajout`}
                    value={saisie}
                    maxLength={longueurMax}
                    onChange={(e) => { setSaisie(e.target.value); setMessage('') }}
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); ajouter() } }}
                    enterKeyHint="done"
                    className="h-11 min-w-0 flex-1 rounded-control border border-outline bg-surface-container-lowest px-3 text-body-md text-on-surface placeholder:text-on-surface-muted focus-visible:border-primary"
                    placeholder="Écrire ici"
                  />
                  <button type="button" onClick={ajouter} disabled={!saisie.trim()} className="ag-state inline-flex size-11 shrink-0 items-center justify-center rounded-control border border-outline text-on-surface hover:bg-primary-container disabled:opacity-40" aria-label="Ajouter à mes choix">
                    <Plus className="size-5" aria-hidden />
                  </button>
                </div>
                {message && <p role="status" className="px-1 pt-1.5 text-body-sm text-on-surface-variant">{message}</p>}
              </div>
            )}
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>

      {value.length > 0 && (
        <ul className="flex flex-wrap gap-2" aria-label={`Choix pour : ${ariaLabel}`}>
          {value.map((v) => (
            <li key={v}>
              <span className="inline-flex min-h-8 items-center gap-0 rounded-full bg-primary-container pl-3 pr-0 text-label-md text-on-primary-container">
                {v}
                <button type="button" onClick={() => bascule(v)} className="ag-state -my-2 inline-flex size-11 items-center justify-center rounded-full hover:bg-on-primary-container/10" aria-label={`Retirer ${v}`}>
                  <X className="size-4" aria-hidden />
                </button>
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
