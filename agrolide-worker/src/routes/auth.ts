import { Hono } from 'hono'

export const authRoute = new Hono()

authRoute.post('/refresh', async (c) => {
  // Logic for refreshing tokens will go here
  return c.json({ success: true })
})
