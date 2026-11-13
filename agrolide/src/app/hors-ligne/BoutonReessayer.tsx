'use client'

import { Button } from '@/components/ui/Button'

/** Recharge la page demandée (le service worker a servi ce repli à son adresse d'origine). */
export function BoutonReessayer() {
  return (
    <Button variant="outline" fullWidth onClick={() => window.location.reload()}>
      Réessayer
    </Button>
  )
}
