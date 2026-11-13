import { Suspense } from 'react'
import Link from 'next/link'
import { buttonVariants } from '@/components/ui/Button'
import { DocumentCard, DocumentType } from '@/components/modules/bibliotheque/DocumentCard'
import { BibliothequeClient } from '@/components/modules/bibliotheque/BibliothequeClient'
import { ArrowRight, BookOpen } from 'lucide-react'

import { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Bibliothèque Agricole",
  description: "Accédez à des centaines de documents techniques, thèses et guides spécialisés. Une ressource indispensable pour les membres de notre réseau agricole en Afrique.",
  alternates: { canonical: '/bibliotheque' }
}

export const revalidate = 3600 // ISR 1 heure

import { db } from '@/db'
import { documents } from '@/db/schema'
import { eq, desc, count } from 'drizzle-orm'
import { Motif } from "@/components/brand"
import { colonnesCarteDocument } from '@/lib/bibliotheque/filtres'

async function getBibliothequeData() {
  try {
    // Compter le nombre de documents
    const countResult = await db.select({ value: count() })
      .from(documents)
      .where(eq(documents.statut, 'publie'))

    // Récupérer les derniers documents (ex: les 6 plus récents)
    const docs = await db.select(colonnesCarteDocument).from(documents)
      .where(eq(documents.statut, 'publie'))
      .orderBy(desc(documents.created_at))
      .limit(6)

    return {
      count: countResult[0].value || 0,
      documents: (docs || []) as any[]
    }
  } catch (error) {
    console.error('Erreur lors du fetch de la bibliothèque (Drizzle):', error)
    return { count: 0, documents: [] }
  }
}

export default async function BibliothequePublicPage() {
  const { count, documents } = await getBibliothequeData()

  return (
    <div className="min-h-screen bg-surface-container-low">

      {/* Hero section */}
      <section className="bg-surface-brand pt-10 pb-10 relative overflow-hidden">
        {/* Motif Background */}
        <Motif size={800} opacity={0.05} className="text-on-surface-brand" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">

          <h1 className="font-heading font-extrabold text-3xl sm:text-4xl text-on-surface-brand mb-4 max-w-3xl mx-auto leading-tight">
            Bibliothèque agricole
          </h1>

          <p className="text-on-surface-brand/70 text-lg mb-6 max-w-2xl mx-auto font-sans">
            Accédez à notre collection de{' '}
            {count > 0 ? (
              <span className="font-semibold text-on-tertiary-container">{count} documents</span>
            ) : (
              'documents'
            )}{' '}
            techniques, rapports, thèses et guides spécialisés en agriculture et développement durable.
          </p>

          <Link
            href="/rejoindre"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-accent-sun text-on-accent font-heading font-bold text-sm hover:bg-tertiary-hover transition-colors"
          >
            Devenir membre
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Documents section */}
      <section className="pt-10 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">


          {/* Section title */}
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-heading font-extrabold text-2xl text-on-surface">Tous les documents</h2>
          </div>

          <Suspense fallback={<div className="text-center py-12 text-on-surface-muted">Chargement de la bibliothèque...</div>}>
            <BibliothequeClient 
              initialData={{ 
                data: documents, 
                nextCursor: documents.length === 6 ? documents[documents.length - 1].created_at : null 
              }}
              publicView={true}
            />
          </Suspense>

          {/* Bottom CTA card */}
        </div>
      </section>

      {/* ── CTA FINAL ────────────────────────────── */}
      <section className="bg-primary-container py-[96px] text-center">
        <div className="container flex flex-col items-center">
          <h2 className="font-heading font-black text-[clamp(24px,4vw,36px)] text-primary leading-[1.2] max-w-[700px] mx-auto mb-4">
            Accédez à la bibliothèque complète
          </h2>
          <p className="font-sans font-normal text-body-sm text-on-surface-variant mb-[28px]">
            Rejoignez Agrolide pour consulter, télécharger et même partager vos propres documents avec la communauté.
          </p>
          <Link href="/rejoindre" className={buttonVariants({ variant: 'primary' })}>
            Voir les offres d&apos;adhésion <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </div>
      </section>

    </div>
  )
}
