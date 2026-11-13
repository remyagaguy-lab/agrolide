'use client'

import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth/client'
import { Button } from '@/components/ui/Button'

import { Eye } from "@/components/ui/icons"
/**
 * Geste de la fiche : lire en ligne (gratuit). Les documents ne se téléchargent pas : ils se lisent dans la liseuse
 * sécurisée (le nom du fichier est historique). Le bouton orange de la vue, c'est la lecture.
 */
export function DownloadButton({ documentId, mode = 'public' }: { documentId: string; mode?: 'membre' | 'public' }) {
  const router = useRouter()
  const { isSignedIn, isLoaded } = useAuth()
  const isAuthenticated = isLoaded ? isSignedIn : null

  // Le quota de lectures gratuites est géré par le serveur (cookie signé) : on ouvre simplement le lecteur.
  const handleRead = () => {
    router.push(`${mode === 'membre' ? '/membres' : ''}/bibliotheque/${documentId}/lire`)
  }

  return (
    <div className="space-y-2">
      <Button type="button" variant="primary" fullWidth onClick={handleRead}>
        <Eye className="size-5" aria-hidden />
        Lire en ligne
      </Button>
      {isAuthenticated === false && (
        <p className="text-center text-label-md text-on-surface-variant">5 documents à lire en entier, sans compte</p>
      )}
    </div>
  )
}
