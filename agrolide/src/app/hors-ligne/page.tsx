import type { Metadata } from 'next'
import Link from 'next/link'
import { buttonVariants } from '@/components/ui/Button'
import { Emblem } from '@/components/brand'
import { Library } from '@/components/ui/icons'
import { BoutonReessayer } from './BoutonReessayer'

export const metadata: Metadata = { title: 'Hors ligne', robots: { index: false, follow: false } }

/**
 * Page de repli du service worker : affichée quand une page ne peut pas se charger faute de réseau.
 * Elle est mise en cache à l'installation de l'application ; elle doit rester statique et sans donnée personnelle.
 */
export default function HorsLignePage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-[480px] flex-col items-center justify-center gap-6 px-6 py-12 text-center">
      <Emblem className="size-20" />
      <div className="space-y-2">
        <h1 className="text-headline-sm font-bold text-on-surface">Vous êtes hors ligne</h1>
        <p className="text-body-lg text-on-surface-variant">
          Cette page a besoin d&apos;une connexion. Les documents que vous avez gardés sur cet appareil restent lisibles sans réseau.
        </p>
      </div>
      <div className="flex w-full flex-col gap-3">
        <Link href="/membres/bibliotheque/hors-ligne" className={buttonVariants({ variant: 'primary', fullWidth: true })}>
          <Library className="size-5" aria-hidden />
          Mes documents hors ligne
        </Link>
        <BoutonReessayer />
      </div>
    </main>
  )
}
