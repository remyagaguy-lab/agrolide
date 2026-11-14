import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { auth } from '@/lib/auth/server'
import { Button } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/EmptyState'
import { FicheView } from '@/components/modules/reseau/FicheView'
import { CartePubliqueView } from '@/components/modules/reseau/CartePubliqueView'
import { fetchFiche } from '@/lib/reseau/fiche'
import { fetchCartePublique } from '@/lib/reseau/carte-publique.server'

import { Lock } from "@/components/ui/icons"
// Fiche réservée aux membres connectés. Un visiteur ne voit que la carte publique d'un membre qui l'a activée
// (`profil_public`) ; le titre de la page ne révèle jamais le nom et la page n'est jamais indexée.
export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Profil membre | agrolide',
    robots: { index: false, follow: false },
  }
}

export default async function FicheProfilPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { userId } = await auth()

  if (!userId) {
    // Carte limitée seulement si la personne a activé son profil public ; sinon (inexistant, privé, masqué)
    // exactement la même réponse « réservé aux membres » : pas d'énumération.
    const carte = await fetchCartePublique(id).catch(() => null)
    if (carte) {
      return (
        <div className="container max-w-2xl space-y-6 py-16 md:py-24">
          <CartePubliqueView carte={carte} />
          <div className="space-y-3 rounded-card border border-outline-variant bg-surface-container-low p-6">
            <p className="text-body-md text-on-surface">Connectez-vous pour consulter le profil complet de {carte.nom}, vous connecter et échanger.</p>
            <div className="flex flex-wrap gap-3">
              <Button variant="secondary" href={`/login?next=${encodeURIComponent(`/annuaire/${id}`)}`}>
                Se connecter
              </Button>
              <Button variant="outline" href="/inscription">
                Rejoindre le réseau
              </Button>
            </div>
          </div>
        </div>
      )
    }
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
