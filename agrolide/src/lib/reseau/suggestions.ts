/**
 * Suggestions de membres : algorithme transparent, fonction pure (aucun accès base, aucun hasard).
 *
 * Règles (voir `Reseau-proposition.md` §2) :
 *  - spécialité proche 0–30, thématiques communes 10 chacune (max 25), même pays 20 (+5 même ville)
 *    ou même région 8, relations en commun 8 chacune (max 24), langue commune 5, même catégorie 5,
 *    profil renseigné 5 (jamais affiché) ;
 *  - seuil de 20 points pour être « suggéré » ; en dessous : « nouveau membre », sans prétendre à une proximité ;
 *  - jamais de score à l'écran, seulement les 3 raisons les plus lourdes, toutes réellement calculées ;
 *  - départage stable : score, puis profil renseigné, puis inscription la plus récente, puis identifiant.
 */
import { categorieLabel, lireLangues, parseList, regionDe } from './profil'
import { motsSignificatifs, normaliser } from './texte'

export const SEUIL_SUGGESTION = 20
export const MAX_RAISONS = 3

/** Ce que l'algorithme lit d'un profil : uniquement des champs que la personne a choisi de renseigner. */
export interface ProfilPourScore {
  specialite: string | null
  thematiques: string[]
  langues: string[]
  pays: string | null
  ville: string | null
  categorie: string | null
}

export interface CandidatPourScore extends ProfilPourScore {
  id: string
  /** Photo ET biographie présentes (qualité de la carte). */
  profilRenseigne: boolean
  /** Date d'inscription (ISO), pour le départage. */
  created_at: string | null
}

export interface Raison {
  /** Phrase affichée telle quelle. */
  texte: string
  points: number
}

export interface ResultatScore {
  score: number
  raisons: string[]
}

const PTS_SPECIALITE_MAX = 30
const PTS_THEME = 10
const PTS_THEMES_MAX = 25
const PTS_PAYS = 20
const PTS_VILLE = 5
const PTS_REGION = 8
const PTS_RELATION = 8
const PTS_RELATIONS_MAX = 24
const PTS_LANGUE = 5
const PTS_CATEGORIE = 5
const PTS_PROFIL = 5

/** Combien de données le membre a saisies pour que les suggestions aient un sens. */
export function donneesProfil(p: ProfilPourScore): number {
  return [p.specialite?.trim(), p.thematiques.length > 0, p.langues.length > 0, p.pays?.trim()].filter(Boolean).length
}

/** Un profil est « assez renseigné » à partir de deux informations parmi spécialité, thématiques, langues, pays. */
export function profilSuffisant(p: ProfilPourScore): boolean {
  return donneesProfil(p) >= 2
}

const inter = (a: string[], b: string[]) => {
  const nb = new Set(b.map(normaliser))
  return a.filter((x) => nb.has(normaliser(x)))
}

const pluriel = (n: number, un: string, plusieurs: string) => `${n} ${n > 1 ? plusieurs : un}`

/**
 * Score d'un candidat pour un membre. `relationsEnCommun` = nombre de relations acceptées partagées.
 * Les raisons sont triées par poids décroissant (puis par ordre fixe des critères) et limitées à 3.
 */
export function scoreSuggestion(moi: ProfilPourScore, candidat: CandidatPourScore, relationsEnCommun = 0): ResultatScore {
  const raisons: Raison[] = []

  // Métier proche : recouvrement des mots significatifs (radicaux, sans accents ni mots vides).
  const mesMots = motsSignificatifs(moi.specialite)
  const sesMots = motsSignificatifs(candidat.specialite)
  if (mesMots.size > 0 && sesMots.size > 0) {
    const communs = [...sesMots.keys()].filter((r) => mesMots.has(r))
    if (communs.length > 0) {
      const recouvrement = communs.length / Math.min(mesMots.size, sesMots.size)
      const points = Math.max(1, Math.round(PTS_SPECIALITE_MAX * recouvrement))
      raisons.push({ texte: `Métier proche : ${communs.map((r) => sesMots.get(r)).join(', ')}`, points })
    }
  }

  // Thématiques communes.
  const themes = inter(candidat.thematiques, moi.thematiques)
  if (themes.length > 0) {
    raisons.push({
      texte: `${themes.length > 1 ? 'Spécialités communes' : 'Spécialité commune'} : ${themes.join(', ')}`,
      points: Math.min(PTS_THEMES_MAX, themes.length * PTS_THEME),
    })
  }

  // Lieu : même pays (+ même ville), sinon même région.
  const mesPays = normaliser(moi.pays)
  if (mesPays && mesPays === normaliser(candidat.pays)) {
    const memeVille = Boolean(normaliser(moi.ville)) && normaliser(moi.ville) === normaliser(candidat.ville)
    raisons.push(
      memeVille
        ? { texte: `Même ville : ${candidat.ville?.trim()} (${candidat.pays})`, points: PTS_PAYS + PTS_VILLE }
        : { texte: `Même pays : ${candidat.pays}`, points: PTS_PAYS },
    )
  } else {
    const region = regionDe(moi.pays)
    if (region && region === regionDe(candidat.pays)) {
      raisons.push({ texte: `Même région : ${region}`, points: PTS_REGION })
    }
  }

  // Relations en commun.
  if (relationsEnCommun > 0) {
    raisons.push({
      texte: `${pluriel(relationsEnCommun, 'relation', 'relations')} en commun`,
      points: Math.min(PTS_RELATIONS_MAX, relationsEnCommun * PTS_RELATION),
    })
  }

  // Langue commune.
  const langues = inter(candidat.langues, moi.langues)
  if (langues.length > 0) {
    raisons.push({ texte: `${langues.length > 1 ? 'Langues communes' : 'Langue commune'} : ${langues.join(', ')}`, points: PTS_LANGUE })
  }

  // Même catégorie.
  const cat = categorieLabel(candidat.categorie)
  if (cat && normaliser(moi.categorie) && normaliser(moi.categorie) === normaliser(candidat.categorie)) {
    raisons.push({ texte: `Même catégorie : ${cat}`, points: PTS_CATEGORIE })
  }

  const score = raisons.reduce((s, r) => s + r.points, 0) + (candidat.profilRenseigne ? PTS_PROFIL : 0)
  const principales = [...raisons].sort((a, b) => b.points - a.points).slice(0, MAX_RAISONS)
  return { score, raisons: principales.map((r) => r.texte) }
}

export interface MembreNote<T> {
  membre: T
  score: number
  raisons: string[]
  suggere: boolean
}

/**
 * Classe les candidats. Ordre : suggérés (score ≥ seuil) d'abord, par score décroissant ; puis les autres
 * (« nouveaux membres ») du plus récent au plus ancien. Départage stable, aucun aléa.
 * `communs` associe l'identifiant d'un candidat au nombre de relations partagées.
 */
export function classerSuggestions<T extends CandidatPourScore>(
  moi: ProfilPourScore,
  candidats: T[],
  communs: ReadonlyMap<string, number> = new Map(),
): { suggeres: MembreNote<T>[]; nouveaux: MembreNote<T>[] } {
  const notes: MembreNote<T>[] = candidats.map((membre) => {
    const { score, raisons } = scoreSuggestion(moi, membre, communs.get(membre.id) ?? 0)
    return { membre, score, raisons, suggere: score >= SEUIL_SUGGESTION && raisons.length > 0 }
  })

  const recent = (a: MembreNote<T>, b: MembreNote<T>) =>
    (b.membre.created_at ?? '').localeCompare(a.membre.created_at ?? '') || a.membre.id.localeCompare(b.membre.id)

  const suggeres = notes
    .filter((n) => n.suggere)
    .sort(
      (a, b) =>
        b.score - a.score ||
        Number(b.membre.profilRenseigne) - Number(a.membre.profilRenseigne) ||
        recent(a, b),
    )
  const nouveaux = notes
    .filter((n) => !n.suggere)
    .sort(recent)
    // Un « nouveau membre » n'affiche aucune raison : il n'est pas présenté comme proche.
    .map((n) => ({ ...n, raisons: [] as string[] }))

  return { suggeres, nouveaux }
}

/** Conversion pratique depuis les colonnes brutes d'une ligne de profil. */
export function profilDepuisLigne(row: {
  specialite: string | null
  secteurs_expertise: string | null
  langues: string | null
  pays: string | null
  ville: string | null
  categorie: string | null
}): ProfilPourScore {
  return {
    specialite: row.specialite,
    thematiques: parseList(row.secteurs_expertise),
    langues: lireLangues(row.langues).toutes,
    pays: row.pays,
    ville: row.ville,
    categorie: row.categorie,
  }
}
