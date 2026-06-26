import { Metadata } from "next"
import { createClient } from "@supabase/supabase-js"
import DonationForm from "@/components/modules/fonds/DonationForm"
import { Heart, Target, TrendingUp, Users } from "lucide-react"

export const metadata: Metadata = {
  title: "Nous Soutenir | agrolide",
  description: "Soutenir agrolide, c'est investir dans la souveraineté alimentaire africaine.",
}

export const revalidate = 1800 // ISR toutes les 30 minutes

export default async function NousSoutenirPage({ searchParams }: { searchParams: Promise<{ merci?: string }> }) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
  const supabase = createClient(supabaseUrl, supabaseKey)
  
  const params = await searchParams;

  // 1. Récupérer la campagne active
  const { data: campagne } = await supabase
    .from('campagnes_fonds')
    .select('*')
    .eq('statut', 'active')
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  // 2. Calculer le total collecté
  let totalCollecte = 0
  let progressPercentage = 0
  let recentDonors: any[] = []

  if (campagne) {
    const { data: contributions } = await supabase
      .from('contributions')
      .select('montant_fcfa, prenom, anonyme, created_at')
      .eq('campagne_id', campagne.id)
      .eq('statut', 'valide')

    if (contributions) {
      totalCollecte = contributions.reduce((sum, c) => sum + Number(c.montant_fcfa), 0)
      progressPercentage = Math.min(100, Math.round((totalCollecte / campagne.objectif_fcfa) * 100))
      
      // Trier et filtrer pour les derniers soutiens publics
      recentDonors = contributions
        .filter(c => !c.anonyme)
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, 5)
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-[var(--color-vert-principal)] py-20 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 opacity-10 pointer-events-none">
          <Heart size={400} className="-mr-20 -mt-20" />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-heading font-bold mb-6 leading-tight">
              Soutenir agrolide, c'est investir dans la <span className="text-[var(--color-orange-accent)]">souveraineté alimentaire africaine.</span>
            </h1>
            <p className="text-xl text-white/90">
              Votre contribution permet de financer l'accompagnement des agripreneurs, la création de ressources documentaires et le développement technologique du réseau.
            </p>
          </div>
        </div>
      </section>

      {params?.merci === 'true' && (
        <div className="container mx-auto px-4 mt-8">
          <div className="bg-green-50 border border-green-200 text-green-800 p-4 rounded-xl flex items-center gap-3 shadow-sm">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
              <Heart className="w-4 h-4 text-green-600" />
            </div>
            <div>
              <p className="font-bold">Un immense merci pour votre générosité !</p>
              <p className="text-sm">Votre don a bien été enregistré. Vous recevrez un reçu par email d'ici quelques minutes.</p>
            </div>
          </div>
        </div>
      )}

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* Colonne Gauche : Objectif & Contexte */}
            <div className="lg:col-span-7 space-y-12">
              
              {/* Barre de progression */}
              {campagne && (
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                  <div className="flex items-center gap-3 mb-6">
                    <Target className="w-8 h-8 text-[var(--color-orange-accent)]" />
                    <h2 className="text-2xl font-bold text-gray-900">{campagne.titre}</h2>
                  </div>
                  
                  <div className="mb-4">
                    <div className="flex justify-between items-end mb-2">
                      <div className="text-3xl font-bold text-[var(--color-vert-principal)]">
                        {totalCollecte.toLocaleString('fr-FR')} <span className="text-xl text-gray-500 font-normal">FCFA collectés</span>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-bold text-gray-900">{progressPercentage}%</div>
                        <div className="text-xs text-gray-500">sur {campagne.objectif_fcfa.toLocaleString('fr-FR')} FCFA</div>
                      </div>
                    </div>
                    <div className="h-4 w-full bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-[#fcb726] transition-all duration-1000 ease-out"
                        style={{ width: `${progressPercentage}%` }}
                      />
                    </div>
                  </div>
                  
                  <p className="text-gray-600 leading-relaxed">
                    {campagne.description}
                  </p>
                </div>
              )}

              {/* Contexte & Impact */}
              <div className="prose prose-lg max-w-none text-gray-700">
                <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-2 mb-4">
                  <TrendingUp className="w-6 h-6 text-primary-600" />
                  L'impact de votre don
                </h3>
                <p>
                  agrolide est une initiative à but non lucratif dédiée à la structuration de l'écosystème agricole en Afrique. Notre modèle repose sur la gratuité d'accès à la majorité de nos ressources pour les jeunes diplômés et petits producteurs.
                </p>
                <p>
                  En nous soutenant financièrement, vous contribuez directement à :
                </p>
                <ul>
                  <li><strong>Vulgariser la science :</strong> Traduction et adaptation de recherches agronomiques en fiches techniques utilisables sur le terrain.</li>
                  <li><strong>Incuber les talents :</strong> Financement de bourses pour permettre aux jeunes porteurs de projets d'accéder à notre programme d'incubation.</li>
                  <li><strong>Maintenir la plateforme :</strong> Couverture des frais d'hébergement, d'outils et de développement pour garder le réseau accessible à tous.</li>
                </ul>
              </div>

              {/* Derniers soutiens */}
              <div className="bg-primary-50 p-8 rounded-2xl border border-primary-100">
                <h3 className="text-xl font-bold text-primary-900 flex items-center gap-2 mb-6">
                  <Users className="w-6 h-6 text-primary-600" />
                  Ils nous soutiennent
                </h3>
                {recentDonors.length > 0 ? (
                  <div className="space-y-4">
                    {recentDonors.map((donor: any, i: number) => (
                      <div key={i} className="flex items-center justify-between bg-white p-4 rounded-xl shadow-sm border border-primary-50">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-bold">
                            {donor.prenom.charAt(0)}
                          </div>
                          <div>
                            <div className="font-bold text-gray-900">{donor.prenom}</div>
                            <div className="text-xs text-gray-500">{new Date(donor.created_at).toLocaleDateString()}</div>
                          </div>
                        </div>
                        <div className="font-bold text-primary-700">
                          {Number(donor.montant_fcfa).toLocaleString('fr-FR')} FCFA
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-primary-700 italic text-center py-4 bg-white/50 rounded-xl">Soyez le premier à soutenir publiquement cette campagne !</p>
                )}
              </div>

            </div>

            {/* Colonne Droite : Formulaire */}
            <div className="lg:col-span-5">
              <div className="sticky top-24">
                <DonationForm campagneId={campagne?.id || ''} />
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  )
}
