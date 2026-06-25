import { Context, Next } from 'hono'
import { Redis } from '@upstash/redis'

export async function rateLimiter(limit: number, windowSecs: number, prefix: string) {
  return async (c: Context, next: Next) => {
    const ip = c.req.header('cf-connecting-ip') || 'unknown'
    const key = `${prefix}:${ip}`
    
    // Bypass if UPSTASH keys are missing (local dev fallback)
    if (!c.env.UPSTASH_REDIS_URL || !c.env.UPSTASH_REDIS_TOKEN) {
      return next()
    }

    const redis = new Redis({
      url: c.env.UPSTASH_REDIS_URL,
      token: c.env.UPSTASH_REDIS_TOKEN,
    })

    const currentStr = await redis.get<string>(key)
    const current = currentStr ? parseInt(currentStr, 10) : 0

    if (current >= limit) {
      return c.json({ error: 'Trop de requêtes, veuillez réessayer plus tard.' }, 429)
    }

    const pipe = redis.pipeline()
    pipe.incr(key)
    if (current === 0) {
      pipe.expire(key, windowSecs)
    }
    await pipe.exec()

    await next()
  }
}

// Global API: 100 req / min / IP
export const globalRateLimit = () => rateLimiter(100, 60, 'rate:api')

// Login: 5 req / 15 min / IP
export const loginRateLimit = () => rateLimiter(5, 900, 'rate:login')

// Forms: 3 req / 24h / IP
export const formRateLimit = () => rateLimiter(3, 86400, 'rate:form')
