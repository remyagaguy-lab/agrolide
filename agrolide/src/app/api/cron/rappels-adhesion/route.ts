import { timingSafeEqual } from "node:crypto"
import { NextRequest, NextResponse } from "next/server"
import { executerRappelsAdhesion } from "./traitement"

export const dynamic = "force-dynamic"
export const maxDuration = 60

/** Comparaison en temps constant : le secret ne doit pas se deviner par mesure du temps de réponse. */
function secretValide(recu: string | null, attendu: string): boolean {
  const a = Buffer.from(recu ?? "")
  const b = Buffer.from(`Bearer ${attendu}`)
  return a.length === b.length && timingSafeEqual(a, b)
}

/**
 * Tâche planifiée quotidienne (Vercel Cron, voir vercel.json) : rappels d'adhésion à J-30, J-7 et jour J,
 * expiration des adhésions échues, application des changements de catégorie programmés.
 * Vercel envoie `Authorization: Bearer <CRON_SECRET>` ; sans ce secret la route répond 401.
 */
export async function GET(request: NextRequest) {
  const secret = process.env.CRON_SECRET
  if (!secret) {
    return NextResponse.json({ error: "CRON_SECRET n'est pas configuré" }, { status: 500 })
  }
  if (!secretValide(request.headers.get("authorization"), secret)) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
  }

  try {
    const rapport = await executerRappelsAdhesion()
    return NextResponse.json(rapport, { status: rapport.erreurs.length > 0 ? 207 : 200 })
  } catch (e) {
    console.error("[cron rappels-adhesion]", e)
    return NextResponse.json({ error: (e as Error).message }, { status: 500 })
  }
}
