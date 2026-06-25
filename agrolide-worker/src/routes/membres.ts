import { Hono } from 'hono'
import { v4 as uuidv4 } from 'uuid' // Or we can just use crypto.randomUUID() which is built-in to workers

export const membresRoute = new Hono()

membresRoute.get('/profil', async (c) => {
  const profile = c.get('profile')
  return c.json({ profile })
})

membresRoute.put('/profil', async (c) => {
  const profile = c.get('profile')
  const body = await c.req.json()
  // TODO: Update logic using service role
  return c.json({ success: true, updated: body })
})

membresRoute.get('/dashboard', async (c) => {
  const profile = c.get('profile')
  // Return custom dashboard data
  return c.json({ stats: { messages: 0, events: 0 } })
})

membresRoute.put('/profil/photo', async (c) => {
  try {
    const profile = c.get('profile')
    const body = await c.req.parseBody()
    const file = body['photo'] as File

    if (!file) {
      return c.json({ error: 'Aucun fichier fourni' }, 400)
    }

    const extension = file.name.split('.').pop()
    const filename = `${profile.id}-${crypto.randomUUID()}.${extension}`
    
    // R2_PROFILS is typed in index.ts Bindings, but we need to assert type here or rely on c.env
    const bucket = (c.env as any).R2_PROFILS
    
    await bucket.put(filename, await file.arrayBuffer(), {
      httpMetadata: { contentType: file.type }
    })

    // URL publique (à adapter selon le domaine configuré pour le bucket R2)
    // Par défaut, on retourne une URL fictive ou celle du worker si le worker sert les fichiers
    const publicUrl = `https://pub-agrolide-profils.r2.dev/${filename}` // Placeholder
    
    return c.json({ url: publicUrl })
  } catch (error: any) {
    console.error('Erreur upload photo:', error)
    return c.json({ error: 'Erreur lors du traitement de l\'image' }, 500)
  }
})
