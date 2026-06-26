import { createClient } from '@supabase/supabase-js'

export async function checkRappels(env: any) {
  const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_KEY)

  // 1. Rappels J-7 et J-1
  // on cherche les inscriptions 'inscrit' dont la session est dans 7 ou 1 jour
  const now = new Date()
  const in7days = new Date()
  in7days.setDate(in7days.getDate() + 7)
  
  const in1day = new Date()
  in1day.setDate(in1day.getDate() + 1)

  // Récupérer les sessions à venir
  const { data: sessions } = await supabase
    .from('sessions_formation')
    .select('*, formations(titre)')
    .gte('date_debut', now.toISOString())
    .lte('date_debut', in7days.toISOString())

  if (sessions && sessions.length > 0) {
    for (const session of sessions) {
      const sessionDate = new Date(session.date_debut)
      const diffTime = sessionDate.getTime() - now.getTime()
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      
      let typeRappel = ''
      if (diffDays === 7) typeRappel = 'J-7'
      if (diffDays === 1) typeRappel = 'J-1'
      
      if (typeRappel !== '') {
        // Obtenir les inscrits
        const { data: inscrits } = await supabase
          .from('inscriptions_formation')
          .select('id, membre_id, profiles(email, prenom)')
          .eq('session_id', session.id)
          .eq('statut', 'inscrit')

        if (inscrits) {
          for (const ins of inscrits) {
            // Check redis
            const redisUrl = `${env.UPSTASH_REDIS_URL}/get/rappel:sent:${ins.id}:${typeRappel}`
            const redisRes = await fetch(redisUrl, {
              headers: { Authorization: `Bearer ${env.UPSTASH_REDIS_TOKEN}` }
            })
            const redisData = await redisRes.json()
            
            if (!redisData.result) {
              // Set redis to prevent duplicate
              await fetch(`${env.UPSTASH_REDIS_URL}/set/rappel:sent:${ins.id}:${typeRappel}/true/EX/2592000`, {
                headers: { Authorization: `Bearer ${env.UPSTASH_REDIS_TOKEN}` }
              })

              // Send email (mock if Resend not fully setup, but this is the logic)
              if (env.RESEND_API_KEY && ins.profiles?.email) {
                try {
                  await fetch('https://api.resend.com/emails', {
                    method: 'POST',
                    headers: {
                      'Authorization': `Bearer ${env.RESEND_API_KEY}`,
                      'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                      from: 'Agrolide <contact@agrolide.org>',
                      to: ins.profiles.email,
                      subject: `Rappel ${typeRappel} : Formation ${session.formations?.titre}`,
                      html: `<p>Bonjour ${ins.profiles.prenom},</p><p>Votre formation <strong>${session.formations?.titre}</strong> a lieu dans ${typeRappel.replace('J-', '')} jour(s).</p>`
                    })
                  })
                } catch (e) {
                  console.error('Erreur rappel', e)
                }
              }
            }
          }
        }
      }
    }
  }

  // 2. Annulation inscriptions non payées > 48h
  const in48h = new Date()
  in48h.setHours(in48h.getHours() - 48)

  const { data: unpaidInscriptions } = await supabase
    .from('inscriptions_formation')
    .select('id, session_id')
    .eq('statut', 'en_attente_paiement')
    .lte('date_inscription', in48h.toISOString())

  if (unpaidInscriptions && unpaidInscriptions.length > 0) {
    for (const ins of unpaidInscriptions) {
      await supabase
        .from('inscriptions_formation')
        .update({ statut: 'annule' })
        .eq('id', ins.id)
        
      // Le trigger en base (si configuré) remettra la place_restante + 1
    }
  }
}
