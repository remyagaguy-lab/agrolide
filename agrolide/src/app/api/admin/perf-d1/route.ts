import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth/admin'

/**
 * Bilan du chronomètre D1 (table d1_mesures), réservé aux administrateurs.
 * À ouvrir connecté : https://www.agrolide.org/api/admin/perf-d1 (option ?jours=3, 7 par défaut).
 *
 * Lecture par un fetch direct et non par `db` : consulter le bilan ne doit pas fausser les mesures.
 */
export const dynamic = 'force-dynamic'

function centile(valeurs: number[], p: number) {
  if (!valeurs.length) return null
  const t = [...valeurs].sort((a, b) => a - b)
  return Math.round(t[Math.min(t.length - 1, Math.floor((p / 100) * t.length))] * 10) / 10
}

const resume = (valeurs: number[]) => ({
  appels: valeurs.length,
  moyenne_ms: valeurs.length ? Math.round((valeurs.reduce((a, b) => a + b, 0) / valeurs.length) * 10) / 10 : null,
  mediane_ms: centile(valeurs, 50),
  p95_ms: centile(valeurs, 95),
  max_ms: valeurs.length ? Math.round(Math.max(...valeurs) * 10) / 10 : null,
})

export async function GET(request: Request) {
  const admin = await requireAdmin()
  if (!admin.ok) return admin.response

  const jours = Math.min(Math.max(Number(new URL(request.url).searchParams.get('jours')) || 7, 1), 30)
  const depuis = new Date(Date.now() - jours * 86_400_000).toISOString()

  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID
  const dbId = process.env.CLOUDFLARE_DATABASE_ID
  const token = process.env.CLOUDFLARE_D1_TOKEN
  if (!accountId || !dbId || !token) return NextResponse.json({ error: 'Variables D1 manquantes' }, { status: 500 })

  const res = await fetch(`https://api.cloudflare.com/client/v4/accounts/${accountId}/d1/database/${dbId}/query`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      sql: 'SELECT created_at, total_ms, sql_ms, methode, table_nom, froid, region FROM d1_mesures WHERE created_at >= ? ORDER BY created_at DESC LIMIT 20000',
      params: [depuis],
    }),
  })
  const json = await res.json().catch(() => null)
  if (!json?.success) {
    return NextResponse.json(
      { error: "Table d1_mesures illisible : la migration 0010 est-elle appliquée ?", details: json?.errors ?? null },
      { status: 500 },
    )
  }

  type Ligne = { created_at: string; total_ms: number; sql_ms: number | null; methode: string | null; table_nom: string | null; froid: number; region: string | null }
  const lignes: Ligne[] = json.result?.[0]?.results ?? []
  const chaudes = lignes.filter((l) => !l.froid)

  const parTable: Record<string, number[]> = {}
  for (const l of chaudes) (parTable[l.table_nom ?? '?'] ??= []).push(l.total_ms)

  const parJour: Record<string, number[]> = {}
  for (const l of chaudes) (parJour[l.created_at.slice(0, 10)] ??= []).push(l.total_ms)

  const surcout = chaudes.filter((l) => l.sql_ms != null).map((l) => l.total_ms - (l.sql_ms as number))

  return NextResponse.json({
    periode: { jours, depuis, echantillons: lignes.length },
    lecture:
      "total_ms = aller-retour complet vu depuis Vercel ; sql_ms = temps réel dans D1. L'écart (surcout_reseau) est ce qu'une liaison directe supprimerait.",
    appels_a_chaud: resume(chaudes.map((l) => l.total_ms)),
    appels_instance_froide: resume(lignes.filter((l) => l.froid).map((l) => l.total_ms)),
    temps_interne_d1_ms: resume(chaudes.filter((l) => l.sql_ms != null).map((l) => l.sql_ms as number)),
    surcout_reseau_ms: resume(surcout),
    regions: [...new Set(lignes.map((l) => l.region ?? '?'))],
    par_table: Object.fromEntries(Object.entries(parTable).sort((a, b) => b[1].length - a[1].length).slice(0, 15).map(([t, v]) => [t, resume(v)])),
    par_jour: Object.fromEntries(Object.entries(parJour).sort().map(([j, v]) => [j, resume(v)])),
  })
}
