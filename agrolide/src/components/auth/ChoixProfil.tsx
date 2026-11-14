'use client'

import { cn } from '@/lib/utils/formatters'
import { Briefcase, Building2, CheckCircle2, GraduationCap, Heart, UserRound } from '@/components/ui/icons'

/** Les cinq profils proposés à l'inscription, avec ce que chacun recouvre. */
export const PROFILS_INSCRIPTION = [
  { id: 'passionne', label: 'Passionné', icon: Heart, desc: 'Curieux ou non-professionnel', exemples: "Vous aimez l'agriculture sans en faire votre métier." },
  { id: 'junior', label: 'Junior / Étudiant', icon: GraduationCap, desc: 'Vous débutez dans le secteur', exemples: 'Étudiant, stagiaire, jeune diplômé, première expérience.' },
  { id: 'professionnel', label: 'Professionnel', icon: UserRound, desc: 'Vous êtes un acteur du secteur', exemples: 'Agronome, ingénieur, technicien, producteur, entrepreneur.' },
  { id: 'partenaire', label: 'Partenaire', icon: Building2, desc: 'Vous représentez une organisation', exemples: 'Entreprise, association, ONG, coopérative, institution. Validé par un administrateur.' },
  { id: 'senior', label: 'Sénior', icon: Briefcase, desc: 'Vous avez une forte expérience', exemples: 'Expert ou mentor prêt à transmettre. Validé par un administrateur.' },
] as const

export type ProfilInscription = (typeof PROFILS_INSCRIPTION)[number]['id']

export const estProfilInscription = (v: unknown): v is ProfilInscription => PROFILS_INSCRIPTION.some((p) => p.id === v)

export function libelleProfil(id: string): string {
  return PROFILS_INSCRIPTION.find((p) => p.id === id)?.label ?? id
}

/** Choix du profil : groupe de boutons radio (clavier : flèches). */
export function ChoixProfil({ valeur, onChange }: { valeur: string; onChange: (id: ProfilInscription) => void }) {
  return (
    <fieldset>
      <legend className="mb-3 text-label-lg text-on-surface">
        Quel est votre profil ? <span aria-hidden="true" className="text-error">*</span>
      </legend>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {PROFILS_INSCRIPTION.map((p) => {
          const Icon = p.icon
          const choisi = valeur === p.id
          return (
            <label
              key={p.id}
              className={cn(
                'relative flex min-h-12 cursor-pointer flex-col items-center rounded-card border p-4 text-center transition-colors duration-150 ease-standard',
                'has-[:focus-visible]:outline has-[:focus-visible]:outline-[length:var(--ag-sys-focus-width)] has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-focus-ring',
                choisi
                  ? 'border-primary bg-primary-container text-on-primary-container ring-1 ring-primary'
                  : 'border-outline-variant bg-surface-container-lowest text-on-surface hover:border-outline',
              )}
            >
              <input type="radio" name="profil-categorie" value={p.id} checked={choisi} onChange={() => onChange(p.id)} className="sr-only" />
              {choisi && <CheckCircle2 className="absolute right-2 top-2 size-5 text-primary" aria-hidden="true" />}
              <Icon className={cn('mb-2 size-6', choisi ? 'text-primary' : 'text-on-surface-muted')} aria-hidden="true" />
              <span className="text-title-sm">{p.label}</span>
              <span className={cn('mt-1 text-body-sm', choisi ? 'text-on-primary-container' : 'text-on-surface-variant')}>{p.desc}</span>
              <span className={cn('mt-1 text-label-md', choisi ? 'text-on-primary-container' : 'text-on-surface-muted')}>{p.exemples}</span>
            </label>
          )
        })}
      </div>
    </fieldset>
  )
}
