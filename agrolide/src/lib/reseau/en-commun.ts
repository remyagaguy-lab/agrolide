/**
 * Points communs entre deux profils, pour la fiche d'un membre. Fonction pure (aucun accès base).
 * Uniquement des champs que les deux personnes ont renseignés ; rien n'est déduit.
 */
import type { ProfilPourScore } from './suggestions'
import { motsSignificatifs, normaliser } from './texte'

export interface PointsCommuns {
  /** Mots de spécialité en commun (écriture de l'autre membre). */
  specialite: string[]
  thematiques: string[]
  langues: string[]
  /** Pays commun, sinon `null`. */
  pays: string | null
  /** Ville commune (seulement si le pays est aussi commun), sinon `null`. */
  ville: string | null
}

const inter = (a: string[], b: string[]) => {
  const nb = new Set(b.map(normaliser))
  return a.filter((x) => nb.has(normaliser(x)))
}

export function pointsCommuns(moi: ProfilPourScore, autre: ProfilPourScore): PointsCommuns {
  const mesMots = motsSignificatifs(moi.specialite)
  const sesMots = motsSignificatifs(autre.specialite)
  const specialite = [...sesMots.keys()].filter((r) => mesMots.has(r)).map((r) => sesMots.get(r) as string)

  const memePays = Boolean(normaliser(moi.pays)) && normaliser(moi.pays) === normaliser(autre.pays)
  const memeVille = memePays && Boolean(normaliser(moi.ville)) && normaliser(moi.ville) === normaliser(autre.ville)

  return {
    specialite,
    thematiques: inter(autre.thematiques, moi.thematiques),
    langues: inter(autre.langues, moi.langues),
    pays: memePays ? (autre.pays?.trim() ?? null) : null,
    ville: memeVille ? (autre.ville?.trim() ?? null) : null,
  }
}

export function aDesPointsCommuns(p: PointsCommuns): boolean {
  return p.specialite.length > 0 || p.thematiques.length > 0 || p.langues.length > 0 || p.pays !== null
}
