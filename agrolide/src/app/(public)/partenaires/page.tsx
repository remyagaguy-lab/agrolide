import { Metadata } from "next"
import { createClient } from "@supabase/supabase-js"
import Image from "next/image"
import PartenariatForm from "@/components/modules/fonds/PartenariatForm"
import { Handshake, Target, Globe } from "lucide-react"

export const metadata: Metadata = {
  title: "Nos Partenaires | agrolide",
  description: "Découvrez les organisations qui nous accompagnent dans la structuration de l'agriculture en Afrique.",
}

export const revalidate = 3600 // ISR toutes les heures

export default async function PartenairesPage() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
  const supabase = createClient(supabaseUrl, supabaseKey)

  // Fetch des partenaires actifs
  const { data: partenaires } = await supabase
    .from('partenaires')
    .select('*')
    .eq('statut', 'actif')
    .order('niveau', { ascending: true }) // par ex: 1 = Platinum, 2 = Gold, etc.
    .order('created_at', { ascending: false })

  // Grouper par niveau si besoin, ou juste afficher une grille
  // Pour la simplicité, on affiche une grille unique

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-[var(--color-vert-principal)] py-20 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 opacity-10 pointer-events-none">
          <Handshake size={400} className="-mr-20 -mt-20" />
        </div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl font-heading font-bold mb-6">
            Ils nous font confiance
          </h1>
          <p className="text-xl max-w-2xl mx-auto text-white/90">
            Ensemble, nous construisons un écosystème agricole africain plus fort, plus structuré et plus innovant.
          </p>
        </div>
      </section>

      {/* Liste des partenaires */}
      <section className="py-24">
        <div className="container mx-auto px-4 max-w-6xl">
          
          <div className="text-center mb-16">
            <h2 className="text-3xl font-heading font-bold text-[var(--color-vert-principal)] mb-4">
              Nos Partenaires & Sponsors
            </h2>
            <div className="w-24 h-1 bg-[var(--color-orange-accent)] mx-auto rounded-full"></div>
          </div>

          {partenaires && partenaires.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {partenaires.map((p) => (
                <div key={p.id} className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center justify-center text-center hover:shadow-md transition-shadow group relative">
                  <div className="w-32 h-32 relative mb-4 grayscale group-hover:grayscale-0 transition-all duration-300 flex items-center justify-center">
                    {p.logo_url ? (
                      <Image 
                        src={p.logo_url} 
                        alt={p.nom} 
                        fill
                        className="object-contain"
                      />
                    ) : (
                      <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 font-bold text-xl">
                        {p.nom.substring(0, 2).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <h3 className="font-bold text-gray-900">{p.nom}</h3>
                  <p className="text-xs text-gray-500 mt-1">{p.type}</p>
                  
                  {p.website_url && (
                    <a href={p.website_url} target="_blank" rel="noreferrer" className="absolute inset-0 z-10">
                      <span className="sr-only">Visiter le site de {p.nom}</span>
                    </a>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center bg-white p-12 rounded-2xl border border-dashed border-gray-300">
              <Globe className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-700 mb-2">Devenez notre premier partenaire officiel !</h3>
              <p className="text-gray-500">agrolide s'ouvre aux collaborations. Remplissez le formulaire ci-dessous pour initier la discussion.</p>
            </div>
          )}
        </div>
      </section>

      {/* Devenir Partenaire */}
      <section className="py-24 bg-white border-t border-gray-100">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
            
            <div className="md:col-span-5 space-y-6">
              <h2 className="text-3xl font-heading font-bold text-gray-900 leading-tight">
                Pourquoi s'associer à agrolide ?
              </h2>
              
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <Target className="w-6 h-6 text-primary-600 flex-shrink-0" />
                  <div>
                    <h4 className="font-bold text-gray-900">Visibilité ciblée</h4>
                    <p className="text-sm text-gray-600">Touchez une audience qualifiée de professionnels et d'entrepreneurs de l'agriculture.</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Handshake className="w-6 h-6 text-primary-600 flex-shrink-0" />
                  <div>
                    <h4 className="font-bold text-gray-900">Impact RSE direct</h4>
                    <p className="text-sm text-gray-600">Soutenez concrètement l'innovation et l'emploi des jeunes en Afrique.</p>
                  </div>
                </li>
              </ul>
            </div>

            <div className="md:col-span-7">
              <PartenariatForm />
            </div>

          </div>
        </div>
      </section>
    </div>
  )
}
