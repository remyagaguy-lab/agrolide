import { after } from 'next/server'

/**
 * Chronomètre discret des appels D1 (API REST Cloudflare), pour savoir combien de temps un appel coûte
 * RÉELLEMENT depuis Vercel avant de décider d'une éventuelle optimisation de l'accès à la base.
 *
 * - Chaque appel est chronométré ; un appel sur quatre (D1_MESURE_ECHANTILLON, 0 à 1) est enregistré dans la
 *   table `d1_mesures` (migration 0010). Les journaux Vercel ne gardent pas assez longtemps pour « quelques jours ».
 * - Ne sont enregistrés que : durée totale, durée interne de D1, type d'opération, nom de table, nombre de
 *   lignes, région. Jamais le texte de la requête ni ses paramètres : aucune donnée de membre.
 * - Un appel de plus de 1,5 s laisse aussi une ligne dans les journaux.
 * - Jamais bloquant : tout échec est avalé. Si la table n'existe pas encore, l'enregistrement se met en veille
 *   jusqu'au prochain démarrage de l'instance. D1_MESURE=off coupe tout.
 * - L'écriture utilise son propre fetch (jamais `db`), sinon elle se mesurerait elle-même.
 */

const ACTIF = process.env.D1_MESURE !== 'off'
const ECHANTILLON = (() => {
  const v = Number(process.env.D1_MESURE_ECHANTILLON)
  return Number.isFinite(v) && v >= 0 && v <= 1 && process.env.D1_MESURE_ECHANTILLON !== undefined ? v : 0.25
})()
const SEUIL_LENT_MS = 1500

let instanceChaude = false
let enveille = false

export interface MesureD1 {
  sql: string
  methode: string
  totalMs: number
  sqlMs: number | null
  lignes: number | null
}

const tableDe = (sql: string) => /\b(?:from|into|update)\s+[`"]?(\w+)[`"]?/i.exec(sql)?.[1] ?? null

export function noterMesureD1(m: MesureD1) {
  if (!ACTIF) return
  const froid = !instanceChaude
  instanceChaude = true
  const table = tableDe(m.sql)

  if (m.totalMs >= SEUIL_LENT_MS) {
    console.warn(`[d1] appel lent : ${Math.round(m.totalMs)} ms (interne ${m.sqlMs ?? '?'} ms) table=${table ?? '?'}${froid ? ' [instance froide]' : ''}`)
  }

  // Les appels d'une instance qui vient de démarrer sont toujours gardés : c'est là que la connexion se paie.
  if (enveille || (!froid && Math.random() >= ECHANTILLON)) return

  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID
  const dbId = process.env.CLOUDFLARE_DATABASE_ID
  const token = process.env.CLOUDFLARE_D1_TOKEN
  if (!accountId || !dbId || !token) return

  const ecrire = async () => {
    try {
      const res = await fetch(`https://api.cloudflare.com/client/v4/accounts/${accountId}/d1/database/${dbId}/query`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        signal: AbortSignal.timeout(5000),
        body: JSON.stringify({
          sql: 'INSERT INTO d1_mesures (created_at, total_ms, sql_ms, methode, table_nom, lignes, froid, region) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
          params: [
            new Date().toISOString(),
            Math.round(m.totalMs * 10) / 10,
            m.sqlMs,
            m.methode,
            table,
            m.lignes,
            froid ? 1 : 0,
            process.env.VERCEL_REGION ?? null,
          ],
        }),
      })
      const json = await res.json().catch(() => null)
      if (!json?.success) {
        enveille = true // table absente (migration pas encore appliquée) ou refus : on n'insiste pas
        console.warn('[d1] chronomètre en veille : enregistrement impossible (migration 0010 appliquée ?)')
      }
    } catch {
      enveille = true
    }
  }

  try {
    after(ecrire) // après l'envoi de la réponse : n'allonge jamais la page
  } catch {
    void ecrire() // hors requête (script, cron) : tir sans attente
  }
}
