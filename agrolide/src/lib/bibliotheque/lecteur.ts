/** Logique pure de la liseuse et des documents similaires (testée dans lecteur.test.ts). */

/**
 * Page « courante » du défilement continu : la dernière dont le haut a passé le seuil de lecture.
 * Quand on est tout en bas, c'est la dernière page : sans cette règle, les dernières pages (courtes, ou en paysage)
 * n'atteignent jamais le seuil et le compteur reste bloqué avant la fin (ex. 18 sur 20).
 */
export function pageCourante(hautsDesPages: number[], seuil: number, auBas: boolean): number {
  if (hautsDesPages.length === 0) return 1
  if (auBas) return hautsDesPages.length
  let courante = 1
  for (let i = 0; i < hautsDesPages.length; i++) {
    if (hautsDesPages[i] <= seuil) courante = i + 1
    else break
  }
  return courante
}

/** Vrai quand la zone de défilement est arrivée en bas (tolérance d'arrondi) ; faux si le contenu tient sans défiler. */
export const estAuBas = (scrollTop: number, clientHeight: number, scrollHeight: number, tolerance = 4) =>
  scrollHeight > clientHeight + tolerance && scrollTop + clientHeight >= scrollHeight - tolerance

export interface DocSimilaire {
  id: string
  titre: string
  type_doc: string
  thematique: string
  domaine?: string | null
  sous_domaine?: string | null
  published_at?: string | null
}

type Reference = Pick<DocSimilaire, 'thematique' | 'domaine' | 'sous_domaine'>

/** Ressemblance : même sous-domaine (3), même domaine (2), même thématique (1). */
export function scoreSimilarite(ref: Reference, d: Reference): number {
  let s = 0
  if (ref.sous_domaine && d.sous_domaine === ref.sous_domaine) s += 3
  if (ref.domaine && d.domaine === ref.domaine) s += 2
  if (ref.thematique && d.thematique === ref.thematique) s += 1
  return s
}

/**
 * Documents similaires : jamais le document courant, ni de doublon ; les plus proches d'abord (puis les plus récents).
 * Si moins de `minimum` documents ressemblent, on complète par les plus récents pour que la rangée ne soit pas vide.
 */
export function choisirSimilaires(courant: Reference & { id: string }, candidats: DocSimilaire[], max = 10, minimum = 3): DocSimilaire[] {
  const autres = candidats.filter((d, i, tous) => d.id !== courant.id && tous.findIndex((x) => x.id === d.id) === i)
  const recent = (a: DocSimilaire, b: DocSimilaire) => (b.published_at ?? '').localeCompare(a.published_at ?? '')
  const proches = autres
    .map((d) => ({ d, s: scoreSimilarite(courant, d) }))
    .filter((x) => x.s > 0)
    .sort((a, b) => b.s - a.s || recent(a.d, b.d))
    .map((x) => x.d)
  if (proches.length >= minimum) return proches.slice(0, max)
  const complement = autres.filter((d) => !proches.includes(d)).sort(recent)
  return [...proches, ...complement].slice(0, max)
}
