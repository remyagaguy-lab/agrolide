import "server-only"
import { db } from "@/db"
import { formation_lecons, formation_modules, inscriptions_formation, progression_lecons } from "@/db/schema"
import { and, eq, inArray } from "drizzle-orm"

/** Où en est un membre dans une de ses formations (progression réelle, lue dans `progression_lecons`). */
export interface SuiviFormation {
  inscriptionId: string
  formationId: string
  titre: string
  statut: string | null
  modalite: string | null
  couverture: string | null
  /** Formation externe : le suivi se fait sur la plateforme du partenaire. */
  lienExterne: string | null
  sourceExterne: string | null
  thematique: string | null
  /** Session en présentiel / classe virtuelle (ancien modèle) : dates et lieu de la session. */
  session: { dateDebut: string; dateFin: string; lieu: string | null } | null
  /** Parcours en leçons : nombre de leçons et de leçons validées. */
  total: number
  faites: number
  pourcent: number
  /** Première leçon non validée (celle qu'il faut rouvrir pour « reprendre »). */
  prochaineLeconId: string | null
  terminee: boolean
  /** Date de la dernière leçon validée (date de fin d'un parcours en leçons). */
  termineeLe: string | null
  derniereActivite: string | null
}

export async function suiviFormations(userId: string): Promise<SuiviFormation[]> {
  const inscriptions = await db.query.inscriptions_formation.findMany({
    where: eq(inscriptions_formation.membre_id, userId),
    with: { sessions_formation: { with: { formation: true } }, formation: true },
    orderBy: (i, { desc }) => [desc(i.created_at)],
  })

  const formationIds = [
    ...new Set(
      inscriptions
        .map((i) => i.formation?.id ?? i.sessions_formation?.formation?.id)
        .filter((id): id is string => !!id),
    ),
  ]

  const [lecons, progression] = formationIds.length
    ? await Promise.all([
        db
          .select({
            id: formation_lecons.id,
            formationId: formation_modules.formation_id,
            moduleOrdre: formation_modules.ordre,
            ordre: formation_lecons.ordre,
          })
          .from(formation_lecons)
          .innerJoin(formation_modules, eq(formation_lecons.module_id, formation_modules.id))
          .where(inArray(formation_modules.formation_id, formationIds)),
        db
          .select({ leconId: progression_lecons.lecon_id, termineeLe: progression_lecons.completed_at })
          .from(progression_lecons)
          .where(eq(progression_lecons.membre_id, userId)),
      ])
    : [[], []]

  const faitesParLecon = new Map(progression.map((p) => [p.leconId, p.termineeLe]))
  const leconsParFormation = new Map<string, typeof lecons>()
  for (const l of lecons) {
    const liste = leconsParFormation.get(l.formationId) ?? []
    liste.push(l)
    leconsParFormation.set(l.formationId, liste)
  }

  const suivis: SuiviFormation[] = []
  for (const ins of inscriptions) {
    const f = ins.formation ?? ins.sessions_formation?.formation
    if (!f) continue
    const ordonnees = (leconsParFormation.get(f.id) ?? []).sort(
      (a, b) => a.moduleOrdre - b.moduleOrdre || a.ordre - b.ordre,
    )
    const validees = ordonnees.filter((l) => faitesParLecon.has(l.id))
    const dates = validees.map((l) => faitesParLecon.get(l.id) ?? "").filter(Boolean).sort()
    const parcoursComplet = ordonnees.length > 0 && validees.length >= ordonnees.length
    const s = ins.sessions_formation
    suivis.push({
      inscriptionId: ins.id,
      formationId: f.id,
      titre: f.titre,
      statut: ins.statut,
      modalite: f.modalite,
      couverture: f.cover_image_url,
      lienExterne: f.lien_externe,
      sourceExterne: f.source_externe,
      thematique: f.thematique,
      session: s ? { dateDebut: s.date_debut, dateFin: s.date_fin, lieu: s.lieu } : null,
      total: ordonnees.length,
      faites: validees.length,
      pourcent: ordonnees.length ? Math.round((validees.length / ordonnees.length) * 100) : 0,
      prochaineLeconId: ordonnees.find((l) => !faitesParLecon.has(l.id))?.id ?? null,
      terminee: ins.statut === "complete" || parcoursComplet,
      termineeLe: dates.length ? dates[dates.length - 1] : null,
      derniereActivite: dates.length ? dates[dates.length - 1] : ins.created_at,
    })
  }
  return suivis
}
