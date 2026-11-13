import { redirect } from 'next/navigation'
import { db } from '@/db'
import { evenements, inscriptions_evenement } from '@/db/schema'
import { and, asc, desc, eq, gte, lt } from 'drizzle-orm'
import { auth } from '@/lib/auth/server'
import { EmptyState } from '@/components/ui/EmptyState'
import { EvenementsMembreClient } from '@/components/modules/evenements/EvenementsMembreClient'

import { CalendarDays } from "@/components/ui/icons"
export const metadata = { title: "Événements" }

export default async function EvenementsPage() {
  const { userId } = await auth()
  if (!userId) redirect('/login')

  const now = new Date().toISOString()

  let aVenir: any[] = []
  let passes: any[] = []
  let inscritsIds: string[] = []

  try {
    const [prochains, anciens, inscriptions] = await Promise.all([
      db.select().from(evenements)
        .where(and(eq(evenements.publie, true), gte(evenements.date_debut, now)))
        .orderBy(asc(evenements.date_debut))
        .limit(24),
      db.select().from(evenements)
        .where(and(eq(evenements.publie, true), lt(evenements.date_debut, now)))
        .orderBy(desc(evenements.date_debut))
        .limit(6),
      db.select({ evenementId: inscriptions_evenement.evenement_id })
        .from(inscriptions_evenement)
        .where(eq(inscriptions_evenement.membre_id, userId)),
    ])
    aVenir = prochains
    passes = anciens
    inscritsIds = inscriptions.map((i) => i.evenementId)
  } catch (e) {
    console.error("Error fetching events:", e)
  }

  return (
    <div className="max-w-[1200px] mx-auto px-2 md:px-4 py-6 space-y-8">
      <div>
        <h1 className="text-xl md:text-2xl font-bold text-on-surface font-heading">Événements</h1>
        <p className="mt-1 text-on-surface-muted text-xs">Participez aux rencontres, conférences et ateliers du réseau Agrolide.</p>
      </div>

      <section aria-labelledby="evt-a-venir">
        <h2 id="evt-a-venir" className="mb-4 text-lg font-bold text-on-surface font-heading">À venir</h2>
        {aVenir.length > 0 ? (
          <EvenementsMembreClient evenements={aVenir} inscritsIds={inscritsIds} />
        ) : (
          <EmptyState
            icon={<CalendarDays />}
            title="Aucun événement programmé"
            description="Revenez bientôt pour découvrir les prochains événements du réseau."
          />
        )}
      </section>

      {passes.length > 0 && (
        <section aria-labelledby="evt-passes">
          <h2 id="evt-passes" className="mb-4 text-lg font-bold text-on-surface font-heading">Événements passés</h2>
          <EvenementsMembreClient evenements={passes} inscritsIds={inscritsIds} />
        </section>
      )}
    </div>
  )
}
