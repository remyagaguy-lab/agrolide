import { Suspense } from 'react'
import Link from 'next/link'
import { DocumentCard, DocumentType } from '@/components/modules/bibliotheque/DocumentCard'
import { BibliothequeClient } from '@/components/modules/bibliotheque/BibliothequeClient'
import { ArrowRight, BookOpen } from 'lucide-react'

export const revalidate = 3600 // ISR 1 heure

import { createClient } from '@supabase/supabase-js'

async function getBibliothequeData() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
    const supabase = createClient(supabaseUrl, supabaseAnonKey)

    // Compter le nombre de documents
    const { count, error: countError } = await supabase
      .from('documents')
      .select('*', { count: 'exact', head: true })
      .eq('statut', 'publie') // Optionnel: filtrer les publiés

    // Récupérer les derniers documents (ex: les 6 plus récents)
    const { data: documents, error: docsError } = await supabase
      .from('documents')
      .select('*')
      .eq('statut', 'publie')
      .order('created_at', { ascending: false })
      .limit(6)

    if (countError) console.error('Erreur count:', countError)
    if (docsError) console.error('Erreur docs:', docsError)

    return {
      count: count || 0,
      documents: (documents || []) as DocumentType[]
    }
  } catch (error) {
    console.error('Erreur lors du fetch de la bibliothèque (Supabase):', error)
    return { count: 0, documents: [] }
  }
}

export default async function BibliothequePublicPage() {
  const { count, documents } = await getBibliothequeData()

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f8f8f6' }}>

      {/* Hero section */}
      <section className="bg-[#0d3520] pt-10 pb-10 relative overflow-hidden">
        {/* Motif Background */}
        <div 
          className="absolute inset-0 z-0 opacity-[0.07] pointer-events-none" 
          style={{ backgroundImage: "url('/images/motif-transparent.png')", backgroundSize: "800px", backgroundRepeat: "repeat" }} 
        />
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">

          <h1 className="font-heading font-[800] text-3xl sm:text-4xl text-white mb-4 max-w-3xl mx-auto leading-tight">
            Bibliothèque agricole
          </h1>

          <p className="text-white/70 text-lg mb-6 max-w-2xl mx-auto font-sans">
            Accédez à notre collection de{' '}
            {count > 0 ? (
              <span className="font-semibold text-[#fcb726]">{count} documents</span>
            ) : (
              'documents'
            )}{' '}
            techniques, rapports, thèses et guides spécialisés en agriculture et développement durable.
          </p>

          <Link
            href="/rejoindre"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#fcb726] text-[#1a1a1a] font-heading font-[700] text-sm hover:bg-[#e5a620] transition-colors"
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
            <h2 className="font-heading font-[800] text-2xl text-[#1a1a1a]">Tous les documents</h2>
          </div>

          <Suspense fallback={<div className="text-center py-12 text-gray-500">Chargement de la bibliothèque...</div>}>
            <BibliothequeClient 
              initialData={{ 
                data: documents, 
                nextCursor: documents.length === 6 ? documents[documents.length - 1].created_at : null 
              }}
              supabaseUrl={process.env.NEXT_PUBLIC_SUPABASE_URL}
              supabaseAnonKey={process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}
              publicView={true}
            />
          </Suspense>

          {/* Bottom CTA card */}
        </div>
      </section>

      {/* ── CTA FINAL ────────────────────────────── */}
      <section className="bg-gradient-to-br from-[#1b5e38] to-[#124026] py-[60px] md:py-[100px] text-center relative overflow-hidden">
        <div className="absolute inset-0 z-0">
           <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#fcb726]/10 rounded-full blur-[100px] pointer-events-none" />
        </div>
        <div className="max-w-[800px] mx-auto px-6 relative z-10">
          <h2 className="font-heading font-[800] text-[32px] md:text-[48px] text-white mb-6 leading-[1.15]">
            Accédez à la bibliothèque complète
          </h2>
          <p className="text-[16px] text-white/80 max-w-[600px] mx-auto mb-10">
            Rejoignez Agrolide pour consulter, télécharger et même partager vos propres documents avec la communauté.
          </p>
          <Link
            href="/rejoindre"
            className="inline-flex items-center gap-3 bg-[#fcb726] text-[#1a1a1a] font-heading font-[800] text-[16px] px-[40px] py-[18px] rounded-full hover:bg-white hover:shadow-[0_0_40px_rgba(252,183,38,0.4)] transition-all duration-300 hover:-translate-y-1"
          >
            Voir les offres d&apos;adhésion
          </Link>
        </div>
      </section>

    </div>
  )
}
