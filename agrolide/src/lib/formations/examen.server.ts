import 'server-only'
import { and, desc, eq, inArray } from 'drizzle-orm'
import { db } from '@/db'
import {
  certificats_formation, formation_lecons, formation_modules, formations, livrables_formation, progression_lecons, tentatives_examen,
} from '@/db/schema'
import { EXAMEN_BANQUE } from '@/db/content/bp_agricole/examen_banque'
import { seuilReussite } from '@/lib/formations/quiz.server'
import { notifier } from '@/lib/notifications.server'

/**
 * Examen final : 30 questions tirées d'une banque de 150 (5 par module), corrigées côté serveur.
 * Comme pour les quiz de leçon, le navigateur ne reçoit jamais `correctAnswer` ni `explanation` avant correction.
 * Le tirage est enregistré à l'ouverture : on corrige CE tirage, on ne peut pas choisir ses questions.
 */

/** Formations qui ont un examen final (la banque vit dans un fichier serveur). */
export const FORMATION_EXAMEN = 'form_bp_agricole'
export const NB_PAR_MODULE = 5
export const NB_QUESTIONS_EXAMEN = 30
/** Après ce nombre d'échecs d'affilée, il faut attendre DELAI_ATTENTE_H heures. */
export const ECHECS_AVANT_ATTENTE = 3
export const DELAI_ATTENTE_H = 24
/** Nombre de livrables validés exigés pour le niveau « Réussite » (0 = l'examen seul suffit). Décision produit : à relever quand la correction des livrables est organisée. */
export const LIVRABLES_REQUIS_REUSSITE = 0
export const NB_MODULES_LIVRABLES = 6

export function formationAUnExamen(formationId: string) {
  return formationId === FORMATION_EXAMEN
}

export type QuestionExamenPublique = { id: number; question: string; options: string[] }

function melanger<T>(a: T[]): T[] {
  const r = [...a]
  for (let i = r.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[r[i], r[j]] = [r[j], r[i]]
  }
  return r
}

/** 5 questions par module, puis mélange de l'ensemble. `id` = position dans la banque. */
export function tirerExamen(): number[] {
  const ids: number[] = []
  for (let m = 1; m <= 6; m++) {
    const duModule = EXAMEN_BANQUE.map((q, i) => ({ q, i })).filter((x) => x.q.module === m).map((x) => x.i)
    ids.push(...melanger(duModule).slice(0, NB_PAR_MODULE))
  }
  return melanger(ids)
}

function versPublic(ids: number[]): QuestionExamenPublique[] {
  return ids.map((id) => ({ id, question: EXAMEN_BANQUE[id].question, options: EXAMEN_BANQUE[id].options }))
}

/** Toutes les leçons du parcours sont validées. */
export async function parcoursComplet(userId: string, formationId: string): Promise<boolean> {
  const lecons = await db
    .select({ id: formation_lecons.id })
    .from(formation_lecons)
    .innerJoin(formation_modules, eq(formation_lecons.module_id, formation_modules.id))
    .where(eq(formation_modules.formation_id, formationId))
  if (lecons.length === 0) return false
  const faites = await db
    .select({ id: progression_lecons.id })
    .from(progression_lecons)
    .where(and(eq(progression_lecons.membre_id, userId), inArray(progression_lecons.lecon_id, lecons.map((l) => l.id))))
  return faites.length >= lecons.length
}

export type EtatExamen = {
  parcoursComplet: boolean
  seuil: number
  tentatives: number
  meilleur: number | null
  reussi: boolean
  /** Date (ISO) avant laquelle une nouvelle tentative est refusée, sinon null. */
  attenteJusqua: string | null
  enCours: boolean
}

export async function etatExamen(userId: string, formationId: string): Promise<EtatExamen> {
  const [complet, rows] = await Promise.all([
    parcoursComplet(userId, formationId),
    db
      .select()
      .from(tentatives_examen)
      .where(and(eq(tentatives_examen.membre_id, userId), eq(tentatives_examen.formation_id, formationId)))
      .orderBy(desc(tentatives_examen.debut_le)),
  ])
  const finies = rows.filter((r) => r.fin_le)
  const reussi = finies.some((r) => r.reussi)
  const dernieres = finies.slice(0, ECHECS_AVANT_ATTENTE)
  let attenteJusqua: string | null = null
  if (!reussi && dernieres.length === ECHECS_AVANT_ATTENTE && dernieres.every((r) => !r.reussi)) {
    const fin = new Date(dernieres[0].fin_le as string).getTime() + DELAI_ATTENTE_H * 3600_000
    if (fin > Date.now()) attenteJusqua = new Date(fin).toISOString()
  }
  return {
    parcoursComplet: complet,
    seuil: seuilReussite(),
    tentatives: finies.length,
    meilleur: finies.length ? Math.max(...finies.map((r) => r.pourcent ?? 0)) : null,
    reussi,
    attenteJusqua,
    enCours: rows.some((r) => !r.fin_le),
  }
}

/** Ouvre une tentative, ou reprend celle qui est déjà ouverte (pas de nouveau tirage tant qu'elle n'est pas envoyée). */
export async function ouvrirTentative(userId: string, formationId: string) {
  const etat = await etatExamen(userId, formationId)
  if (!etat.parcoursComplet) return { erreur: "Validez d'abord toutes les leçons.", status: 403 as const }
  if (etat.attenteJusqua) return { erreur: "Trois échecs d'affilée : nouvelle tentative possible plus tard.", status: 429 as const, attenteJusqua: etat.attenteJusqua }

  const ouverte = await db.query.tentatives_examen.findFirst({
    where: and(eq(tentatives_examen.membre_id, userId), eq(tentatives_examen.formation_id, formationId)),
    orderBy: desc(tentatives_examen.debut_le),
  })
  if (ouverte && !ouverte.fin_le) {
    return { questions: versPublic(JSON.parse(ouverte.questions_json) as number[]), seuil: seuilReussite() }
  }
  const ids = tirerExamen()
  await db.insert(tentatives_examen).values({
    membre_id: userId,
    formation_id: formationId,
    questions_json: JSON.stringify(ids),
    debut_le: new Date().toISOString(),
  })
  return { questions: versPublic(ids), seuil: seuilReussite() }
}

/** Corrige la tentative ouverte. Renvoie null si les réponses ne correspondent pas au tirage. */
export async function corrigerTentative(userId: string, formationId: string, reponses: unknown) {
  const t = await db.query.tentatives_examen.findFirst({
    where: and(eq(tentatives_examen.membre_id, userId), eq(tentatives_examen.formation_id, formationId)),
    orderBy: desc(tentatives_examen.debut_le),
  })
  if (!t || t.fin_le) return { erreur: "Aucune tentative ouverte : rouvrez l'examen.", status: 409 as const }
  const ids = JSON.parse(t.questions_json) as number[]
  if (!Array.isArray(reponses) || reponses.length !== ids.length) return { erreur: 'Réponses invalides', status: 400 as const }
  const attendus = new Set(ids)
  const vus = new Set<number>()
  const details = []
  for (const r of reponses) {
    if (!r || !Number.isInteger(r.id) || !Number.isInteger(r.choix) || !attendus.has(r.id) || vus.has(r.id)) {
      return { erreur: 'Réponses invalides', status: 400 as const }
    }
    vus.add(r.id)
    const q = EXAMEN_BANQUE[r.id]
    details.push({ id: r.id, choix: r.choix, correctAnswer: q.correctAnswer, juste: r.choix === q.correctAnswer, explanation: q.explanation })
  }
  const bonnes = details.filter((d) => d.juste).length
  const total = ids.length
  const pourcent = Math.round((bonnes / total) * 100)
  const reussi = pourcent >= seuilReussite()
  // Clôture atomique : si deux envois arrivent ensemble, un seul passe.
  const clos = await db
    .update(tentatives_examen)
    .set({ fin_le: new Date().toISOString(), bonnes, total, pourcent, reussi })
    .where(and(eq(tentatives_examen.id, t.id), eq(tentatives_examen.membre_id, userId)))
    .returning({ id: tentatives_examen.id })
  if (clos.length === 0) return { erreur: 'Tentative déjà envoyée', status: 409 as const }
  let certificat: string | null = null
  if (reussi) certificat = (await accorderReussite(userId, formationId))?.numero ?? null
  return { details, bonnes, total, pourcent, reussi, seuil: seuilReussite(), certificat }
}

// ---------------------------------------------------------------- Certificats

const ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'

/** AGR-BPA-2026-7K3Q9X : aucune donnée personnelle dans le numéro. */
function genererNumero(): string {
  const octets = crypto.getRandomValues(new Uint8Array(6))
  const c = Array.from(octets, (o) => ALPHABET[o % ALPHABET.length]).join('')
  return `AGR-BPA-${new Date().getFullYear()}-${c}`
}

export type Niveau = 'participation' | 'reussite'

/** Délivre le certificat s'il n'existe pas (idempotent). Le numéro ne change plus ensuite. */
export async function delivrerCertificat(userId: string, formationId: string, niveau: Niveau) {
  const existant = await db.query.certificats_formation.findFirst({
    where: and(
      eq(certificats_formation.membre_id, userId),
      eq(certificats_formation.formation_id, formationId),
      eq(certificats_formation.niveau, niveau),
    ),
  })
  if (existant) return existant
  for (let essai = 0; essai < 5; essai++) {
    try {
      const [cree] = await db
        .insert(certificats_formation)
        .values({ numero: genererNumero(), niveau, membre_id: userId, formation_id: formationId, delivre_le: new Date().toISOString() })
        .returning()
      return cree
    } catch {
      // collision de numéro ou de couple (membre, formation, niveau) : on relit, sinon on retente
      const deja = await db.query.certificats_formation.findFirst({
        where: and(
          eq(certificats_formation.membre_id, userId),
          eq(certificats_formation.formation_id, formationId),
          eq(certificats_formation.niveau, niveau),
        ),
      })
      if (deja) return deja
    }
  }
  return null
}

export async function livrablesValides(userId: string, formationId: string): Promise<number> {
  const rows = await db
    .select({ id: livrables_formation.id })
    .from(livrables_formation)
    .where(and(eq(livrables_formation.membre_id, userId), eq(livrables_formation.formation_id, formationId), eq(livrables_formation.statut, 'valide')))
  return rows.length
}

/** Délivre « Réussite » si l'examen est réussi, le parcours complet et le nombre de livrables exigé atteint. */
export async function accorderReussite(userId: string, formationId: string) {
  if (!(await parcoursComplet(userId, formationId))) return null
  const reussie = await db.query.tentatives_examen.findFirst({
    where: and(eq(tentatives_examen.membre_id, userId), eq(tentatives_examen.formation_id, formationId), eq(tentatives_examen.reussi, true)),
  })
  if (!reussie) return null
  if (LIVRABLES_REQUIS_REUSSITE > 0 && (await livrablesValides(userId, formationId)) < LIVRABLES_REQUIS_REUSSITE) return null
  const deja = await db.query.certificats_formation.findFirst({
    where: and(eq(certificats_formation.membre_id, userId), eq(certificats_formation.formation_id, formationId), eq(certificats_formation.niveau, 'reussite')),
  })
  const cert = await delivrerCertificat(userId, formationId, 'reussite')
  if (cert && !deja) {
    const f = await db.query.formations.findFirst({ columns: { titre: true }, where: eq(formations.id, formationId) })
    await notifier(userId, {
      type: 'formation',
      contenu: `Félicitations ! Vous avez obtenu le certificat de réussite « ${f?.titre ?? 'Formation'} ».`,
      lien: '/membres/formations#certificats',
    })
  }
  return cert
}

export async function certificatsDuMembre(userId: string) {
  return db.select().from(certificats_formation).where(eq(certificats_formation.membre_id, userId))
}
