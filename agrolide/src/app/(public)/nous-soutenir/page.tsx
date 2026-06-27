import { Metadata } from "next"
import { createClient } from "@supabase/supabase-js"
import DonationForm from "@/components/modules/fonds/DonationForm"
import { Heart, Target, TrendingUp, Users, CheckCircle2 } from "lucide-react"

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
    <div className="flex flex-col min-h-screen">
      {/* ── HERO ─────────────────────────────────── */}
      <section className="relative overflow-hidden pt-[100px] pb-[60px] md:pt-[140px] md:pb-[80px] bg-[#1a1a1a]">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[140%] bg-[#1b5e38]/20 rounded-full blur-[120px] pointer-events-none" />
          <div className="absolute bottom-[-20%] right-[-10%] w-[40%] h-[120%] bg-[#fcb726]/10 rounded-full blur-[100px] pointer-events-none" />
        </div>
        
        <div className="max-w-[900px] mx-auto px-6 relative z-10 text-center">
          <div className="inline-block px-4 py-2 rounded-full border border-white/10 text-[#fcb726] font-heading font-[700] text-[11px] tracking-[0.2em] uppercase mb-6">
            Fonds de soutien
          </div>
          <h1 className="font-heading font-[800] text-[40px] md:text-[64px] text-white leading-[1.1] tracking-[-0.02em] mb-8">
            Soutenir agrolide, c'est investir dans la <span className="text-[#fcb726]">souveraineté alimentaire africaine.</span>
          </h1>
          <p className="font-sans text-[16px] md:text-[20px] text-[rgba(255,255,255,0.7)] max-w-[700px] mx-auto leading-[1.7]">
            Votre don permet de financer l'accompagnement des agripreneurs, la création de ressources et le développement technologique du réseau.
          </p>
        </div>
      </section>

      {/* ── MESSAGE DE REMERCIEMENT ──────────────── */}
      {params?.merci === 'true' && (
        <div className="max-w-[1200px] mx-auto px-6 mt-10">
          <div className="bg-[#f0f7f0] border border-[#1b5e38]/20 text-[#1b5e38] p-6 rounded-2xl flex flex-col md:flex-row items-center gap-4 shadow-sm text-center md:text-left">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center flex-shrink-0 shadow-sm">
              <Heart className="w-6 h-6 text-[#1b5e38]" />
            </div>
            <div>
              <p className="font-heading font-[800] text-[20px]">Un immense merci pour votre générosité !</p>
              <p className="font-sans text-[15px] opacity-80 mt-1">Votre don a bien été enregistré. Vous recevrez un reçu par email d'ici quelques minutes.</p>
            </div>
          </div>
        </div>
      )}

      {/* ── CONTENU PRINCIPAL ────────────────────── */}
      <section className="py-[40px] md:py-[80px] bg-[#f8f8f6]">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
            
            {/* Colonne Gauche : Objectif & Contexte */}
            <div className="lg:col-span-7 space-y-12">
              
              {/* Barre de progression */}
              {campagne && (
                <div className="bg-white p-8 md:p-10 rounded-3xl border border-[#eaeaea] shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-14 h-14 bg-[#fcb726]/10 text-[#d9970c] rounded-2xl flex items-center justify-center">
                      <Target size={28} />
                    </div>
                    <h2 className="font-heading font-[800] text-[24px] md:text-[28px] text-[#1a1a1a]">{campagne.titre}</h2>
                  </div>
                  
                  <div className="mb-6">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4 mb-4">
                      <div>
                        <div className="font-heading font-[800] text-[36px] text-[#1b5e38] leading-none">
                          {totalCollecte.toLocaleString('fr-FR')} <span className="text-[18px] text-[#666] font-sans font-normal ml-1">FCFA collectés</span>
                        </div>
                      </div>
                      <div className="text-left sm:text-right">
                        <div className="font-heading font-[800] text-[20px] text-[#1a1a1a] leading-none">{progressPercentage}%</div>
                        <div className="font-sans text-[14px] text-[#666] mt-1">sur {campagne.objectif_fcfa.toLocaleString('fr-FR')} FCFA</div>
                      </div>
                    </div>
                    <div className="h-4 w-full bg-[#f8f8f6] rounded-full overflow-hidden border border-[#eaeaea]">
                      <div 
                        className="h-full bg-gradient-to-r from-[#fcb726] to-[#f99e1d] transition-all duration-1000 ease-out"
                        style={{ width: `${progressPercentage}%` }}
                      />
                    </div>
                  </div>
                  
                  <p className="font-sans text-[16px] text-[#555] leading-[1.7]">
                    {campagne.description}
                  </p>
                </div>
              )}

              {/* Contexte & Impact */}
              <div>
                <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-[#1b5e38]/10 text-[#1b5e38] font-heading font-[700] text-[11px] tracking-[0.15em] uppercase mb-6">
                  <span className="w-2 h-2 rounded-full bg-[#fcb726]" />
                  Transparence
                </div>
                <h3 className="font-heading font-[800] text-[32px] text-[#1a1a1a] mb-6">
                  L'impact de votre don
                </h3>
                <div className="font-sans text-[16px] text-[#555] leading-[1.8] space-y-4 mb-8">
                  <p>
                    <strong className="text-[#1a1a1a]">agrolide</strong> est une initiative dédiée à la structuration de l'écosystème agricole en Afrique. Notre modèle repose sur la gratuité d'accès à la majorité de nos ressources pour les jeunes diplômés et petits producteurs.
                  </p>
                  <p>
                    En nous soutenant financièrement, vous contribuez directement à :
                  </p>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-4 p-5 bg-white rounded-2xl border border-[#eaeaea] shadow-sm">
                    <CheckCircle2 className="w-6 h-6 text-[#1b5e38] flex-shrink-0 mt-1" />
                    <div>
                      <strong className="block font-heading font-[800] text-[18px] text-[#1a1a1a] mb-1">Vulgariser la science</strong>
                      <p className="font-sans text-[15px] text-[#666] leading-[1.6]">Traduction et adaptation de recherches agronomiques en fiches techniques utilisables sur le terrain.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 p-5 bg-white rounded-2xl border border-[#eaeaea] shadow-sm">
                    <CheckCircle2 className="w-6 h-6 text-[#1b5e38] flex-shrink-0 mt-1" />
                    <div>
                      <strong className="block font-heading font-[800] text-[18px] text-[#1a1a1a] mb-1">Incuber les talents</strong>
                      <p className="font-sans text-[15px] text-[#666] leading-[1.6]">Financement de bourses pour permettre aux jeunes porteurs de projets d'accéder à notre programme d'incubation.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 p-5 bg-white rounded-2xl border border-[#eaeaea] shadow-sm">
                    <CheckCircle2 className="w-6 h-6 text-[#1b5e38] flex-shrink-0 mt-1" />
                    <div>
                      <strong className="block font-heading font-[800] text-[18px] text-[#1a1a1a] mb-1">Maintenir la plateforme</strong>
                      <p className="font-sans text-[15px] text-[#666] leading-[1.6]">Couverture des frais d'hébergement, d'outils et de développement pour garder le réseau accessible à tous.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Derniers soutiens */}
              <div className="bg-gradient-to-br from-[#1b5e38] to-[#124026] p-8 md:p-10 rounded-3xl relative overflow-hidden shadow-[0_20px_40px_rgba(27,94,56,0.15)]">
                <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/5 rounded-full blur-2xl pointer-events-none" />
                <h3 className="font-heading font-[800] text-[24px] text-white flex items-center gap-3 mb-8 relative z-10">
                  <Users className="w-6 h-6 text-[#fcb726]" />
                  Ils nous soutiennent
                </h3>
                
                {recentDonors.length > 0 ? (
                  <div className="space-y-4 relative z-10">
                    {recentDonors.map((donor: any, i: number) => (
                      <div key={i} className="flex items-center justify-between bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/10">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-full bg-[#fcb726] text-[#1a1a1a] flex items-center justify-center font-heading font-[800] text-[18px]">
                            {donor.prenom.charAt(0)}
                          </div>
                          <div>
                            <div className="font-heading font-[800] text-white">{donor.prenom}</div>
                            <div className="font-sans text-[13px] text-white/60">{new Date(donor.created_at).toLocaleDateString()}</div>
                          </div>
                        </div>
                        <div className="font-heading font-[800] text-[#fcb726]">
                          {Number(donor.montant_fcfa).toLocaleString('fr-FR')} FCFA
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="font-sans text-[15px] text-white/80 italic py-6 text-center border border-white/10 rounded-xl bg-white/5 relative z-10">
                    Soyez le premier à soutenir publiquement cette campagne !
                  </p>
                )}
              </div>

            </div>

            {/* Colonne Droite : Formulaire */}
            <div className="lg:col-span-5">
              <div className="sticky top-24 bg-white p-8 rounded-3xl border border-[#eaeaea] shadow-[0_20px_40px_rgba(0,0,0,0.06)]">
                <h3 className="font-heading font-[800] text-[24px] text-[#1a1a1a] mb-6">Faire un don</h3>
                <DonationForm campagneId={campagne?.id || ''} />
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  )
}
