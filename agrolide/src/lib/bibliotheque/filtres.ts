import { and, eq, inArray, lt, or, sql } from 'drizzle-orm'
import { documents } from '@/db/schema'

export interface FiltresBibliotheque {
  search?: string
  type?: string
  domaine?: string
  sous_domaine?: string
  public_cible?: string
  niveau?: string
  cursor?: string | null
}

export const TAILLE_PAGE = 20

const liste = (v?: string) => (v ? v.split(',').map((s) => s.trim()).filter(Boolean).slice(0, 20) : [])

/** Échappe % et _ pour qu'une recherche « 100% » ne soit pas lue comme un joker SQL. */
const motif = (s: string) => `%${s.replace(/[\\%_]/g, (c) => `\\${c}`)}%`

/** Conditions SQL communes à la liste publique, à la liste membres et à l'action « charger plus ». */
export function conditionsBibliotheque(f: FiltresBibliotheque) {
  const conditions = [eq(documents.statut, 'publie')]

  const mots = (f.search ?? '').trim().slice(0, 100)
  if (mots) {
    const p = motif(mots)
    conditions.push(
      or(
        sql`${documents.titre} LIKE ${p} ESCAPE '\\'`,
        sql`${documents.auteurs} LIKE ${p} ESCAPE '\\'`,
        sql`${documents.resume} LIKE ${p} ESCAPE '\\'`,
        sql`${documents.mots_cles} LIKE ${p} ESCAPE '\\'`,
        sql`${documents.filiere} LIKE ${p} ESCAPE '\\'`,
      )!,
    )
  }

  const filtres: [typeof documents.type_doc | typeof documents.domaine, string[]][] = [
    [documents.type_doc, liste(f.type)],
    [documents.domaine, liste(f.domaine)],
  ]
  for (const [colonne, valeurs] of filtres) if (valeurs.length) conditions.push(inArray(colonne, valeurs))

  const sous = liste(f.sous_domaine)
  if (sous.length) conditions.push(inArray(documents.sous_domaine, sous))
  const publics = liste(f.public_cible)
  if (publics.length) conditions.push(inArray(documents.public_cible, publics))
  const niveaux = liste(f.niveau)
  if (niveaux.length) conditions.push(inArray(documents.niveau, niveaux))

  if (f.cursor) conditions.push(lt(documents.created_at, f.cursor))

  return and(...conditions)
}
