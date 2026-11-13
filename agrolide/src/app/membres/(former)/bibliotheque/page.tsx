import Link from 'next/link'
import { PageEntete } from '@/components/layout/PageEntete'
import { buttonVariants } from '@/components/ui/Button'
import { BibliothequeClient } from '@/components/modules/bibliotheque/BibliothequeClient'
import { db } from '@/db'
import { documents } from '@/db/schema'
import { desc } from 'drizzle-orm'
import { colonnesCarteDocument, conditionsBibliotheque, TAILLE_PAGE } from '@/lib/bibliotheque/filtres'

import { Heart } from "@/components/ui/icons"
export const metadata = {
  title: "Bibliothèque",
  description: 'Bibliothèque de documents pour les membres Agrolide',
}

export default async function MembresBibliothequePage({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  // Next 15+ needs await on searchParams
  const params = await searchParams
  const lire = (cle: string) => (typeof params[cle] === 'string' ? (params[cle] as string) : '')

  const data = await db.select(colonnesCarteDocument).from(documents)
    .where(conditionsBibliotheque({
      search: lire('search'),
      type: lire('type'),
      domaine: lire('domaine'),
      sous_domaine: lire('sous_domaine'),
      public_cible: lire('public'),
      niveau: lire('niveau'),
    }))
    .orderBy(desc(documents.created_at))
    .limit(TAILLE_PAGE)

  const initialData = {
    data: data || [],
    nextCursor: data && data.length === TAILLE_PAGE ? data[data.length - 1].created_at : null
  }

  return (
    <div className="max-w-[1200px] mx-auto px-2 md:px-4 py-6 space-y-6">
      <PageEntete
        titre="Bibliothèque"
        description="Recherchez et consultez nos ressources documentaires."
        action={
          <Link href="/membres/formations#lectures" className={buttonVariants({ variant: 'tonal', size: 'sm' })}>
            <Heart className="size-4" aria-hidden /> Mes lectures et favoris
          </Link>
        }
      />

      <BibliothequeClient
        initialData={initialData}
      />
    </div>
  )
}
