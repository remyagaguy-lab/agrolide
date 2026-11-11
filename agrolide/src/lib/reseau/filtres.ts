/** Filtres de l'annuaire : lecture et écriture de l'URL. Sans accès base : importable côté client. */
import { CATEGORIES, PAYS, PAYS_AUTRE, THEMATIQUES } from './profil'

export type Tri = 'recents' | 'nom'

export interface AnnuaireFilters {
  q: string
  pays: string
  categorie: string
  theme: string
  tri: Tri
  page: number
}

type RawParams = Record<string, string | string[] | undefined>

const first = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) ?? ''

/** Lit l'URL et ne garde que des valeurs connues : le reste est ignoré (aucune valeur libre n'atteint la requête sauf `q`). */
export function parseFilters(sp: RawParams): AnnuaireFilters {
  const pays = first(sp.pays)
  const categorie = first(sp.categorie)
  const theme = first(sp.theme)
  const page = Number.parseInt(first(sp.page), 10)
  return {
    q: first(sp.q).trim().slice(0, 80),
    pays: pays === PAYS_AUTRE || (PAYS as readonly string[]).includes(pays) ? pays : '',
    categorie: CATEGORIES.some((c) => c.value === categorie) ? categorie : '',
    theme: (THEMATIQUES as readonly string[]).includes(theme) ? theme : '',
    tri: first(sp.tri) === 'nom' ? 'nom' : 'recents',
    page: Number.isFinite(page) && page > 0 ? page : 1,
  }
}

/** Adresse de la page avec ces filtres (page 1 par défaut). */
export function filtersToQuery(f: Partial<AnnuaireFilters>) {
  const p = new URLSearchParams()
  if (f.q) p.set('q', f.q)
  if (f.pays) p.set('pays', f.pays)
  if (f.categorie) p.set('categorie', f.categorie)
  if (f.theme) p.set('theme', f.theme)
  if (f.tri && f.tri !== 'recents') p.set('tri', f.tri)
  if (f.page && f.page > 1) p.set('page', String(f.page))
  const s = p.toString()
  return s ? `?${s}` : ''
}
