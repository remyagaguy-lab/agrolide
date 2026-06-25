import { Hono } from 'hono'
import { formRateLimit } from '../middleware/rateLimiter'

export const newsletterRoute = new Hono()

newsletterRoute.post('/subscribe', await formRateLimit(), async (c) => {
  const body = await c.req.json()
  // MVP: Just return success, actual logic (Brevo/Resend) will be implemented later
  return c.json({ success: true, message: 'Inscrit à la newsletter' })
})
