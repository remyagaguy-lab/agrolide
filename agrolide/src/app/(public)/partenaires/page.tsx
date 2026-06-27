import { Metadata } from "next"
import { createClient } from "@supabase/supabase-js"
import Image from "next/image"
import PartenariatForm from "@/components/modules/fonds/PartenariatForm"
import { Handshake, Target, Globe, Building2, CheckCircle2 } from "lucide-react"

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
            Écosystème
          </div>
          <h1 className="font-heading font-[800] text-[40px] md:text-[64px] text-white leading-[1.1] tracking-[-0.02em] mb-8">
            Ils nous font confiance
          </h1>
          <p className="font-sans text-[16px] md:text-[20px] text-[rgba(255,255,255,0.7)] max-w-[700px] mx-auto leading-[1.7]">
            Ensemble, avec nos partenaires et sponsors, nous construisons un écosystème agricole africain plus fort, plus structuré et plus innovant.
          </p>
        </div>
      </section>

      {/* ── LISTE DES PARTENAIRES ────────────────── */}
      <section className="py-[40px] md:py-[80px] bg-[#f8f8f6]">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="font-heading font-[800] text-[32px] md:text-[44px] text-[#1a1a1a] mb-4">
              Nos Partenaires & Sponsors
            </h2>
            <div className="w-16 h-1 bg-[#fcb726] mx-auto rounded-full"></div>
          </div>

          {partenaires && partenaires.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {partenaires.map((p) => (
                <div key={p.id} className="group bg-white rounded-3xl p-8 border border-[#eaeaea] shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.06)] hover:-translate-y-1 transition-all duration-300 flex flex-col items-center text-center relative overflow-hidden">
                  <div className="w-24 h-24 md:w-32 md:h-32 relative mb-6 grayscale group-hover:grayscale-0 transition-all duration-500 flex items-center justify-center">
                    {p.logo_url ? (
                      <Image 
                        src={p.logo_url} 
                        alt={p.nom} 
                        fill
                        className="object-contain drop-shadow-sm group-hover:drop-shadow-md transition-all duration-500"
                      />
                    ) : (
                      <div className="w-20 h-20 bg-[#f8f8f6] rounded-full flex items-center justify-center text-[#1a1a1a] font-heading font-[800] text-2xl border border-[#eaeaea]">
                        {p.nom.substring(0, 2).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <h3 className="font-heading font-[800] text-[18px] text-[#1a1a1a] mb-2">{p.nom}</h3>
                  <p className="font-sans text-[13px] font-[600] text-[#1b5e38] uppercase tracking-wider bg-[#1b5e38]/5 px-3 py-1 rounded-full">{p.type}</p>
                  
                  {p.website_url && (
                    <a href={p.website_url} target="_blank" rel="noreferrer" className="absolute inset-0 z-10">
                      <span className="sr-only">Visiter le site de {p.nom}</span>
                    </a>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center bg-white p-12 md:p-20 rounded-3xl border border-dashed border-[#ccc] shadow-sm max-w-[800px] mx-auto">
              <div className="w-20 h-20 bg-[#fcb726]/10 text-[#d9970c] rounded-full flex items-center justify-center mx-auto mb-6">
                <Globe size={40} />
              </div>
              <h3 className="font-heading font-[800] text-[24px] text-[#1a1a1a] mb-4">Devenez notre premier partenaire officiel !</h3>
              <p className="font-sans text-[16px] text-[#666] leading-[1.7]">agrolide s'ouvre aux collaborations. Remplissez le formulaire ci-dessous pour initier la discussion et rejoindre notre mouvement.</p>
            </div>
          )}
        </div>
      </section>

      {/* ── DEVENIR PARTENAIRE ───────────────────── */}
      <section className="py-[40px] md:py-[80px] bg-white border-t border-[#f0f0f0]">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            
            <div className="space-y-8">
              <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-[#1b5e38]/10 text-[#1b5e38] font-heading font-[700] text-[11px] tracking-[0.15em] uppercase">
                <span className="w-2 h-2 rounded-full bg-[#fcb726]" />
                Collaboration
              </div>
              <h2 className="font-heading font-[800] text-[36px] md:text-[48px] text-[#1a1a1a] leading-[1.15]">
                Pourquoi s'associer à <span className="text-[#1b5e38]">agrolide</span> ?
              </h2>
              <p className="font-sans text-[18px] text-[#555] leading-[1.7]">
                En devenant partenaire, vous associez votre image à une initiative structurante pour l'avenir du continent africain.
              </p>
              
              <div className="space-y-6 pt-4">
                <div className="flex items-start gap-4 p-6 bg-[#f8f8f6] rounded-2xl border border-[#eaeaea]">
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-[#1b5e38] flex-shrink-0 shadow-sm">
                    <Target size={24} />
                  </div>
                  <div>
                    <h4 className="font-heading font-[800] text-[18px] text-[#1a1a1a] mb-2">Visibilité ciblée</h4>
                    <p className="font-sans text-[15px] text-[#666] leading-[1.6]">Touchez une audience ultra-qualifiée de professionnels, décideurs et entrepreneurs de l'agriculture sur tout le continent.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4 p-6 bg-[#f8f8f6] rounded-2xl border border-[#eaeaea]">
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-[#1b5e38] flex-shrink-0 shadow-sm">
                    <Handshake size={24} />
                  </div>
                  <div>
                    <h4 className="font-heading font-[800] text-[18px] text-[#1a1a1a] mb-2">Impact RSE direct</h4>
                    <p className="font-sans text-[15px] text-[#666] leading-[1.6]">Soutenez concrètement l'innovation, la formation professionnelle et l'insertion des jeunes diplômés en Afrique.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-6 bg-[#f8f8f6] rounded-2xl border border-[#eaeaea]">
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-[#1b5e38] flex-shrink-0 shadow-sm">
                    <Building2 size={24} />
                  </div>
                  <div>
                    <h4 className="font-heading font-[800] text-[18px] text-[#1a1a1a] mb-2">Sourcing & Talents</h4>
                    <p className="font-sans text-[15px] text-[#666] leading-[1.6]">Accédez à un vivier exclusif de compétences pour vos recrutements et collaborez avec les esprits les plus brillants.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 md:p-10 rounded-3xl border border-[#eaeaea] shadow-[0_20px_40px_rgba(0,0,0,0.06)] relative">
              <div className="absolute -top-6 -right-6 w-32 h-32 bg-[#fcb726]/10 rounded-full blur-2xl pointer-events-none" />
              <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-[#1b5e38]/10 rounded-full blur-2xl pointer-events-none" />
              <div className="relative z-10">
                <h3 className="font-heading font-[800] text-[24px] text-[#1a1a1a] mb-8">Formulaire de partenariat</h3>
                <PartenariatForm />
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  )
}
