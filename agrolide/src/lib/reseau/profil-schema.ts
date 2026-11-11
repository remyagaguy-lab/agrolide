/**
 * Validation du formulaire de profil, partagée par le formulaire (messages en direct) et par la
 * Server Action (seule source de vérité : le navigateur n'est jamais cru sur parole).
 */
import { z } from 'zod'
import { parseList } from './profil'

const texte = (max: number, libelle: string) =>
  z
    .string()
    .trim()
    .max(max, `${libelle} : ${max} caractères au maximum.`)

/** Lien https uniquement ; vide accepté. Renvoie l'adresse normalisée ou une chaîne vide. */
const lienHttps = (libelle: string) =>
  z
    .string()
    .trim()
    .max(300, `${libelle} : 300 caractères au maximum.`)
    .transform((v, ctx) => {
      if (!v) return ''
      try {
        const url = new URL(v)
        if (url.protocol !== 'https:') throw new Error('protocole')
        return url.toString()
      } catch {
        ctx.addIssue({ code: 'custom', message: `${libelle} : saisissez une adresse commençant par https://` })
        return z.NEVER
      }
    })

const liste = (max: number, libelle: string) =>
  z
    .array(z.string().trim().min(1).max(60))
    .max(max, `${libelle} : ${max} choix au maximum.`)
    .transform((l) => Array.from(new Set(l)))

export const profilSchema = z.object({
  prenom: z.string().trim().min(2, 'Le prénom est requis (2 caractères au minimum).').max(60, 'Prénom : 60 caractères au maximum.'),
  nom: z.string().trim().min(2, 'Le nom est requis (2 caractères au minimum).').max(60, 'Nom : 60 caractères au maximum.'),
  organisation: texte(120, 'Organisation'),
  specialite: texte(100, 'Spécialité'),
  pays: texte(60, 'Pays'),
  ville: texte(80, 'Ville'),
  niveau_etudes: texte(80, "Niveau d'études"),
  biographie: texte(500, 'Biographie'),
  thematiques: liste(12, 'Thématiques'),
  langues: liste(12, 'Langues'),
  linkedin_url: lienHttps('Lien LinkedIn'),
  site_web_url: lienHttps('Site web'),
})

export type ProfilInput = z.input<typeof profilSchema>
export type ProfilValeurs = z.output<typeof profilSchema>

/** Champs du profil pris en compte dans l'indicateur « profil complété » (tous réellement modifiables). */
const CHAMPS_COMPLETION: ReadonlyArray<{ cle: string; libelle: string }> = [
  { cle: 'prenom', libelle: 'Prénom' },
  { cle: 'nom', libelle: 'Nom' },
  { cle: 'photo_url', libelle: 'Photo' },
  { cle: 'specialite', libelle: 'Spécialité' },
  { cle: 'organisation', libelle: 'Organisation' },
  { cle: 'pays', libelle: 'Pays' },
  { cle: 'ville', libelle: 'Ville' },
  { cle: 'biographie', libelle: 'Biographie' },
  { cle: 'thematiques', libelle: 'Thématiques' },
  { cle: 'langues', libelle: 'Langues' },
  { cle: 'niveau_etudes', libelle: "Niveau d'études" },
  { cle: 'linkedin_url', libelle: 'Lien LinkedIn' },
  { cle: 'site_web_url', libelle: 'Site web' },
]

/** Pourcentage de profil complété et libellés des champs encore vides. Fonction pure. */
export function completionProfil(valeurs: Record<string, unknown>): { pourcentage: number; manquants: string[] } {
  const manquants = CHAMPS_COMPLETION.filter(({ cle }) => {
    const v = valeurs[cle]
    if (Array.isArray(v)) return v.length === 0
    if (cle === 'langues' || cle === 'thematiques') return parseList(v).length === 0
    return !(typeof v === 'string' ? v.trim() : v)
  }).map((c) => c.libelle)
  const remplis = CHAMPS_COMPLETION.length - manquants.length
  return { pourcentage: Math.round((remplis / CHAMPS_COMPLETION.length) * 100), manquants }
}
