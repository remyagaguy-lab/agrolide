import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { Lock } from 'lucide-react'
import { auth } from '@/lib/auth/server'
import { Button } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/EmptyState'
import { FicheView } from '@/components/modules/reseau/FicheView'
import { fetchFiche } from '@/lib/reseau/fiche'

// Fiche réservée aux membres connectés : aucune donnée de profil n'est lue ni affichée pour un visiteur,
// et le titre de la page ne révèle pas le nom (pas d'énumération, pas d'indexation).
export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Profil membre | Agrolide',
    robots: { index: false, follow: false },
  }
}

export default async function FicheProfilPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { userId } = await auth()

  if (!userId) {
    return (
      <div className="container max-w-2xl py-16 md:py-24">
        <EmptyState arche
          icon={<Lock />}
          title="Ce profil est réservé aux membres"
          description="Connectez-vous pour consulter les profils du réseau agrolide, vous connecter aux autres membres et échanger avec eux."
          action={
            <div className="flex flex-wrap justify-center gap-3">
              <Button variant="secondary" href={`/login?next=${encodeURIComponent(`/annuaire/${id}`)}`}>
                Se connecter
              </Button>
              <Button variant="outline" href="/inscription">
                Rejoindre le réseau
              </Button>
            </div>
          }
        />
      </div>
    )
  }

  const fiche = await fetchFiche(userId, id)
  if (!fiche) notFound()

  return <FicheView fiche={fiche} />
}
