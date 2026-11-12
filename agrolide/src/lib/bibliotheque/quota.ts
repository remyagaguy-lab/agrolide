import 'server-only'
import { createHash, createHmac, timingSafeEqual } from 'crypto'
import { NextRequest, NextResponse } from 'next/server'
import { and, eq, gte } from 'drizzle-orm'
import { db } from '@/db'
import { lectures_anonymes } from '@/db/schema'

/** Nombre de documents lisibles en entier sans compte. */
export const FREE_READS = 5
/**
 * Filet de sécurité : même sans cookie (effacé, navigation privée), un même appareil/réseau
 * ne peut pas dépasser ce nombre de documents distincts sur 30 jours. Volontairement plus haut
 * que FREE_READS : plusieurs personnes peuvent partager la même IP (cybercafé, réseau mobile).
 */
const FINGERPRINT_MAX = 10
const COOKIE = 'agr_lectures'
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365

function secret() {
  return process.env.QUOTA_SECRET || process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.R2_SECRET_ACCESS_KEY || ''
}

function sign(payload: string) {
  return createHmac('sha256', secret()).update(payload).digest('base64url')
}

/** Lit la liste des documents déjà lus depuis le cookie signé (liste vide si absent ou falsifié). */
function readCookie(request: NextRequest): string[] {
  const raw = request.cookies.get(COOKIE)?.value
  if (!raw || !secret()) return []
  const [payload, sig] = raw.split('.')
  if (!payload || !sig) return []
  const expected = sign(payload)
  const a = Buffer.from(sig)
  const b = Buffer.from(expected)
  if (a.length !== b.length || !timingSafeEqual(a, b)) return []
  try {
    const ids = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'))
    return Array.isArray(ids) ? ids.filter((x): x is string => typeof x === 'string').slice(0, 50) : []
  } catch {
    return []
  }
}

function cookieValue(ids: string[]) {
  const payload = Buffer.from(JSON.stringify(ids)).toString('base64url')
  return `${payload}.${sign(payload)}`
}

function fingerprint(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || request.headers.get('x-real-ip') || ''
  const ua = request.headers.get('user-agent') || ''
  return createHash('sha256').update(`${ip}|${ua}|${secret()}`).digest('hex').slice(0, 32)
}

export type Admission =
  | { ok: true; used: number; setCookie?: string }
  | { ok: false; used: number }

/**
 * Décide si un visiteur NON connecté peut lire ce document en entier.
 * - déjà lu (cookie signé) : oui, sans consommer de quota
 * - sinon : oui s'il lui reste de la place (FREE_READS) ET que l'empreinte appareil/réseau n'est pas saturée
 */
export async function admitAnonymous(request: NextRequest, documentId: string): Promise<Admission> {
  const read = readCookie(request)
  if (read.includes(documentId)) return { ok: true, used: read.length }
  if (read.length >= FREE_READS) return { ok: false, used: read.length }

  // Filet anti-contournement (cookie effacé) : si la table n'existe pas encore, on l'ignore.
  const fp = fingerprint(request)
  try {
    const since = new Date(Date.now() - 30 * 24 * 3600 * 1000).toISOString()
    const rows = await db
      .select({ doc: lectures_anonymes.document_id })
      .from(lectures_anonymes)
      .where(and(eq(lectures_anonymes.empreinte, fp), gte(lectures_anonymes.created_at, since)))
    const distinct = new Set(rows.map((r) => r.doc))
    if (!distinct.has(documentId)) {
      if (distinct.size >= FINGERPRINT_MAX) return { ok: false, used: FREE_READS }
      await db.insert(lectures_anonymes).values({
        empreinte: fp,
        document_id: documentId,
        created_at: new Date().toISOString(),
      })
    }
  } catch (e) {
    console.error('Quota (empreinte) indisponible, repli sur le cookie seul:', e)
  }

  const next = [...read, documentId]
  return { ok: true, used: next.length, setCookie: cookieValue(next) }
}

export function applyQuotaCookie(res: NextResponse, value: string) {
  res.cookies.set(COOKIE, value, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: COOKIE_MAX_AGE,
  })
}
