import 'server-only'
import { NextRequest, NextResponse } from 'next/server'
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

const hasUpstash = !!(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN)
const redis = hasUpstash ? Redis.fromEnv() : null
const limiters = new Map<string, Ratelimit>()
const memory = new Map<string, { count: number; resetAt: number }>()

function clientIp(request: NextRequest) {
  return request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    || request.headers.get('x-real-ip')
    || 'unknown'
}

/**
 * Limiteur de débit par IP et par route.
 * Upstash si configuré (partagé entre instances), sinon repli mémoire (par instance).
 * Retourne une réponse 429 si la limite est dépassée, sinon null.
 */
export async function rateLimit(
  request: NextRequest,
  name: string,
  limit: number,
  windowSeconds = 60
): Promise<NextResponse | null> {
  const key = `${name}:${clientIp(request)}`
  let allowed = true

  if (redis) {
    let rl = limiters.get(name)
    if (!rl) {
      rl = new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(limit, `${windowSeconds} s`),
        prefix: `rl:${name}`,
      })
      limiters.set(name, rl)
    }
    try {
      allowed = (await rl.limit(key)).success
    } catch (e) {
      console.error('Rate limit (Upstash) indisponible:', e)
    }
  } else {
    const now = Date.now()
    const rec = memory.get(key)
    if (!rec || now > rec.resetAt) {
      memory.set(key, { count: 1, resetAt: now + windowSeconds * 1000 })
    } else if (rec.count >= limit) {
      allowed = false
    } else {
      rec.count++
    }
  }

  if (allowed) return null
  return NextResponse.json(
    { error: 'Trop de requêtes. Réessayez dans quelques instants.' },
    { status: 429, headers: { 'Retry-After': String(windowSeconds) } }
  )
}
