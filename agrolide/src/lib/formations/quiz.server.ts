import 'server-only'
import { and, eq, inArray } from 'drizzle-orm'
import { db } from '@/db'
import { formation_lecons, formation_modules, formations, progression_lecons } from '@/db/schema'
import { notifier } from '@/lib/notifications.server'

/**
 * Quiz de leçon : tout se passe côté serveur.
 * Le navigateur ne reçoit jamais `correctAnswer` ni `explanation` avant d'avoir envoyé ses réponses ;
 * le serveur corrige, renvoie le score, et ne valide la leçon que si le seuil est atteint.
 */

/** Seuil de réussite en % (configurable : variable d'environnement QUIZ_SEUIL_REUSSITE, 70 par défaut). */
export function seuilReussite(): number {
  const v = Number(process.env.QUIZ_SEUIL_REUSSITE)
  return Number.isFinite(v) && v >= 1 && v <= 100 ? v : 70
}

/** Au-delà de ce nombre de questions en banque, chaque tentative en tire NB_TIRAGE au hasard. */
export const NB_TIRAGE = 4
const BANQUE_MIN_POUR_TIRAGE = 6

type QuestionBrute = { question: string; options: string[]; correctAnswer: number; explanation?: string }

/** Question telle qu'envoyée au navigateur : sans bonne réponse ni explication. `id` = position dans la banque. */
export type QuestionPublique = { id: number; question: string; options: string[] }

export function lireBanque(quizJson: unknown): QuestionBrute[] {
  let data: unknown = quizJson
  if (typeof data === 'string') {
    try { data = JSON.parse(data) } catch { return [] }
  }
  if (!Array.isArray(data)) return []
  return data.filter(
    (q): q is QuestionBrute =>
      q && typeof q.question === 'string' && Array.isArray(q.options) && Number.isInteger(q.correctAnswer),
  )
}

/** Nombre de questions posées à chaque tentative. */
export function nbQuestionsPosees(tailleBanque: number): number {
  return tailleBanque >= BANQUE_MIN_POUR_TIRAGE ? NB_TIRAGE : tailleBanque
}

/** Tire les questions d'une tentative (mélange de Fisher-Yates) et retire les réponses. */
export function tirerQuestions(banque: QuestionBrute[]): QuestionPublique[] {
  const ids = banque.map((_, i) => i)
  for (let i = ids.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[ids[i], ids[j]] = [ids[j], ids[i]]
  }
  return ids
    .slice(0, nbQuestionsPosees(banque.length))
    .map((id) => ({ id, question: banque[id].question, options: banque[id].options }))
}

export type ReponseMembre = { id: number; choix: number }

export type ResultatQuestion = {
  id: number
  choix: number
  correctAnswer: number
  juste: boolean
  explanation: string
}

/** Corrige une tentative. Renvoie null si la tentative est invalide (mauvais nombre de questions, doublons, ids inconnus). */
export function corriger(banque: QuestionBrute[], reponses: unknown) {
  if (!Array.isArray(reponses)) return null
  const attendu = nbQuestionsPosees(banque.length)
  if (reponses.length !== attendu) return null
  const vus = new Set<number>()
  const details: ResultatQuestion[] = []
  for (const r of reponses) {
    if (!r || !Number.isInteger(r.id) || !Number.isInteger(r.choix)) return null
    if (r.id < 0 || r.id >= banque.length || vus.has(r.id)) return null
    vus.add(r.id)
    const q = banque[r.id]
    details.push({
      id: r.id,
      choix: r.choix,
      correctAnswer: q.correctAnswer,
      juste: r.choix === q.correctAnswer,
      explanation: q.explanation ?? '',
    })
  }
  const bonnes = details.filter((d) => d.juste).length
  const pourcent = Math.round((bonnes / attendu) * 100)
  return { details, bonnes, total: attendu, pourcent, reussi: pourcent >= seuilReussite() }
}

/** Enregistre la validation d'une leçon (idempotent) et prévient le membre quand la formation est terminée. */
export async function validerLecon(userId: string, formationId: string, leconId: string) {
  const existante = await db.query.progression_lecons.findFirst({
    where: and(eq(progression_lecons.membre_id, userId), eq(progression_lecons.lecon_id, leconId)),
  })
  if (existante) return

  await db.insert(progression_lecons).values({ membre_id: userId, lecon_id: leconId })

  const lecons = await db
    .select({ id: formation_lecons.id })
    .from(formation_lecons)
    .innerJoin(formation_modules, eq(formation_lecons.module_id, formation_modules.id))
    .where(eq(formation_modules.formation_id, formationId))
  if (lecons.length === 0) return
  const faites = await db
    .select({ id: progression_lecons.id })
    .from(progression_lecons)
    .where(and(eq(progression_lecons.membre_id, userId), inArray(progression_lecons.lecon_id, lecons.map((l) => l.id))))
  if (faites.length >= lecons.length) {
    const formation = await db.query.formations.findFirst({
      columns: { titre: true },
      where: eq(formations.id, formationId),
    })
    await notifier(userId, {
      type: 'formation',
      contenu: `Bravo ! Vous avez terminé la formation « ${formation?.titre ?? 'Formation'} ».`,
      lien: '/membres/formations/mes-certificats',
    })
  }
}

/**
 * Contrôles communs aux routes : la leçon appartient bien à la formation, et la leçon précédente est validée
 * (on ne valide pas une leçon verrouillée). Renvoie la leçon ou une erreur.
 */
export async function leconAccessible(userId: string, formationId: string, leconId: string) {
  const rows = await db
    .select({ id: formation_lecons.id, quiz_json: formation_lecons.quiz_json, moduleOrdre: formation_modules.ordre, ordre: formation_lecons.ordre })
    .from(formation_lecons)
    .innerJoin(formation_modules, eq(formation_lecons.module_id, formation_modules.id))
    .where(eq(formation_modules.formation_id, formationId))
  const ordonnees = rows.sort((a, b) => a.moduleOrdre - b.moduleOrdre || a.ordre - b.ordre)
  const idx = ordonnees.findIndex((l) => l.id === leconId)
  if (idx === -1) return { erreur: 'Leçon introuvable', status: 404 as const }
  if (idx > 0) {
    const precedente = await db.query.progression_lecons.findFirst({
      where: and(eq(progression_lecons.membre_id, userId), eq(progression_lecons.lecon_id, ordonnees[idx - 1].id)),
    })
    if (!precedente) return { erreur: 'Validez d’abord la leçon précédente', status: 403 as const }
  }
  return { lecon: ordonnees[idx] }
}
