import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { secureHeaders } from 'hono/secure-headers'
import { authMiddleware } from './middleware/auth'
import { globalRateLimit } from './middleware/rateLimiter'

import { authRoute } from './routes/auth'
import { membresRoute } from './routes/membres'
import { paiementsRoute } from './routes/paiements'
import { blogRoute } from './routes/blog'
import { newsletterRoute } from './routes/newsletter'
import { cronsRoute } from './routes/crons'
import { bibliothequeRoute } from './routes/bibliotheque'
import { formationsRoute } from './routes/formations'
import { webinairesRoute } from './routes/webinaires'
import { requireRole } from './middleware/rbac'

type Bindings = {
  SUPABASE_URL: string
  SUPABASE_ANON_KEY: string
  SUPABASE_SERVICE_KEY: string
  UPSTASH_REDIS_URL: string
  UPSTASH_REDIS_TOKEN: string
  ENVIRONMENT: string
  STRIPE_SECRET_KEY: string
  STRIPE_WEBHOOK_SECRET: string
  CINETPAY_APIKEY: string
  CINETPAY_SITE_ID: string
  RESEND_API_KEY: string
  R2_PROFILS: R2Bucket
  R2_MEDIA: R2Bucket
  R2_BIBLIOTHEQUE: R2Bucket
}

const app = new Hono<{ Bindings: Bindings }>()

// Étape 6: CORS & Headers de Sécurité
app.use('*', secureHeaders({
  contentSecurityPolicy: {
    defaultSrc: ["'self'"],
    scriptSrc: ["'self'", "'unsafe-inline'", "https://www.youtube.com"],
    imgSrc: ["'self'", "data:", "https://*.r2.cloudflarestorage.com", "https://img.youtube.com"],
    frameSrc: ["https://www.youtube.com"],
    connectSrc: ["'self'", "https://*.supabase.co", "https://*.upstash.io"]
  },
  xContentTypeOptions: 'nosniff',
  xFrameOptions: 'DENY',
  referrerPolicy: 'strict-origin-when-cross-origin',
  strictTransportSecurity: 'max-age=63072000; includeSubDomains; preload'
}))

app.use('*', cors({ origin: ['https://agrolide.org', 'http://localhost:3000'] }))

// Apply Global Rate Limit dynamically resolving UPSTASH from env
app.use('*', async (c, next) => {
  const limiter = await globalRateLimit()
  return limiter(c, next)
})

app.get('/api/health', (c) => c.json({ status: 'ok' }))

// Auth
app.route('/api/auth', authRoute)

// Membres
app.use('/api/membres/*', authMiddleware)
app.route('/api/membres', membresRoute)

// Bibliothèque
app.route('/api/bibliotheque', bibliothequeRoute)

// Formations & Webinaires
app.route('/api/formations', formationsRoute)
app.route('/api/webinaires', webinairesRoute)

// Paiements
app.use('/api/paiements/checkout', authMiddleware)
app.route('/api/paiements', paiementsRoute)

// Blog API
// GET requests are public
app.get('/api/blog/articles', (c) => blogRoute.fetch(c.req.raw, c.env, c.executionCtx))
app.get('/api/blog/articles/:slug', (c) => blogRoute.fetch(c.req.raw, c.env, c.executionCtx))

// POST/PUT requests require authentication and admin role
app.use('/api/blog/media', authMiddleware, requireRole('admin_content', 'super_admin'))
app.use('/api/blog/articles', authMiddleware, requireRole('admin_content', 'super_admin'))
app.use('/api/blog/articles/:id', authMiddleware, requireRole('admin_content', 'super_admin'))
app.route('/api/blog', blogRoute)

// Newsletter opt-in (public)
app.route('/api/newsletter', newsletterRoute)

export default {
  fetch: app.fetch,
  scheduled: cronsRoute.handler
}
