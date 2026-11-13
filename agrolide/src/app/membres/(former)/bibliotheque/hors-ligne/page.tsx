import { PageEntete } from '@/components/layout/PageEntete'
import { HorsLigneListe } from '@/components/modules/bibliotheque/HorsLigneListe'

export const metadata = { title: 'Documents hors ligne' }

export default function HorsLignePage() {
  return (
    <div className="mx-auto max-w-[900px] space-y-6 px-2 py-6 md:px-4">
      <PageEntete
        titre="Documents hors ligne"
        description="Les documents gardés sur cet appareil se lisent sans connexion, dans la liseuse de l'application. Ils ne se téléchargent pas et sont effacés à la déconnexion."
      />
      <HorsLigneListe />
    </div>
  )
}
