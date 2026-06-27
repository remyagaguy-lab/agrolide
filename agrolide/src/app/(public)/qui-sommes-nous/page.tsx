import { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { Users, Crown, Star, Lightbulb, Target } from "lucide-react"

export const metadata: Metadata = {
  title: "Qui sommes-nous | agrolide",
  description: "Découvrez l'histoire, la mission et les valeurs fondatrices du réseau agrolide, le réseau continental de l'agriculture africaine.",
}

export default function QuiSommesNousPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* ── HERO ─────────────────────────────────── */}
      <section className="relative overflow-hidden pt-[100px] pb-[60px] md:pt-[140px] md:pb-[80px] bg-[#1a1a1a]">
        {/* Dynamic Abstract Background */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[140%] bg-[#1b5e38]/20 rounded-full blur-[120px] pointer-events-none" />
          <div className="absolute bottom-[-20%] right-[-10%] w-[40%] h-[120%] bg-[#fcb726]/10 rounded-full blur-[100px] pointer-events-none" />
        </div>
        
        <div className="max-w-[900px] mx-auto px-6 relative z-10 text-center">
          <div className="inline-block px-4 py-2 rounded-full border border-white/10 text-[#fcb726] font-heading font-[700] text-[11px] tracking-[0.2em] uppercase mb-6">
            Réseau agrolide
          </div>
          <h1 className="font-heading font-[800] text-[40px] md:text-[64px] text-white leading-[1.1] tracking-[-0.02em] mb-8">
            Qui sommes-nous ?
          </h1>
          <p className="font-sans text-[16px] md:text-[20px] text-[rgba(255,255,255,0.7)] max-w-[700px] mx-auto leading-[1.7]">
            Découvrez l'histoire, la mission et les valeurs qui animent le premier réseau continental de l'agriculture africaine.
          </p>
        </div>
      </section>

      {/* ── NOTRE HISTOIRE ───────────────────────── */}
      <section className="py-[40px] md:py-[80px] bg-white">
        <div className="max-w-[1100px] mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-[#1b5e38]/10 text-[#1b5e38] font-heading font-[700] text-[11px] tracking-[0.15em] uppercase mb-6">
              <span className="w-2 h-2 rounded-full bg-[#fcb726]" />
              Origines du réseau
            </div>
            <h2 className="font-heading font-[800] text-[32px] md:text-[44px] text-[#1a1a1a] leading-[1.15] max-w-[800px] mx-auto">
              D'une fragmentation à une <span className="text-[#1b5e38]">cohésion continentale</span>
            </h2>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-3 text-[#1b5e38] font-heading font-[800] text-[20px]">
                <div className="w-10 h-10 rounded-full bg-[#1b5e38]/10 flex items-center justify-center">1</div>
                Le Paradoxe
              </div>
              <p className="font-sans text-[16px] text-[#555] leading-[1.8] border-l-4 border-[#eaeaea] pl-6">
                L'agriculture est le <strong className="text-[#1a1a1a]">pilier du développement africain</strong> (30-40% du PIB, 60% des emplois). Pourtant, malgré ce potentiel immense, ses acteurs évoluent souvent de manière fragmentée, freinant ainsi la conquête de la souveraineté alimentaire.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[#f8f8f6] p-6 rounded-2xl border border-[#eaeaea] text-center">
                <div className="font-heading font-[800] text-[32px] text-[#1b5e38] mb-2">40%</div>
                <div className="font-sans text-[13px] text-[#666] font-[600] uppercase">du PIB en moyenne</div>
              </div>
              <div className="bg-[#f8f8f6] p-6 rounded-2xl border border-[#eaeaea] text-center">
                <div className="font-heading font-[800] text-[32px] text-[#fcb726] mb-2">60%</div>
                <div className="font-sans text-[13px] text-[#666] font-[600] uppercase">des emplois actifs</div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-[#1b5e38] to-[#124026] rounded-3xl p-8 md:p-12 text-white relative overflow-hidden shadow-[0_20px_40px_rgba(27,94,56,0.15)] mb-16">
            <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-[#fcb726]/10 rounded-full blur-[80px] pointer-events-none" />
            <h3 className="font-heading font-[800] text-[24px] md:text-[28px] mb-8 relative z-10 text-center">
              Les 4 freins structurels à briser
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 relative z-10">
              <div className="bg-white/10 backdrop-blur-sm border border-white/10 p-5 rounded-2xl flex items-start gap-4">
                <div className="w-10 h-10 bg-[#fcb726] text-[#1a1a1a] rounded-xl flex items-center justify-center flex-shrink-0 font-heading font-[800]">01</div>
                <div>
                  <h4 className="font-heading font-[700] text-[18px] mb-1">Isolement professionnel</h4>
                  <p className="font-sans text-[14px] text-white/80 leading-[1.6]">Manque de synergie et de réseau structuré entre les acteurs.</p>
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm border border-white/10 p-5 rounded-2xl flex items-start gap-4">
                <div className="w-10 h-10 bg-[#fcb726] text-[#1a1a1a] rounded-xl flex items-center justify-center flex-shrink-0 font-heading font-[800]">02</div>
                <div>
                  <h4 className="font-heading font-[700] text-[18px] mb-1">Déficit documentaire</h4>
                  <p className="font-sans text-[14px] text-white/80 leading-[1.6]">Manque d'informations adaptées aux réalités du terrain africain.</p>
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm border border-white/10 p-5 rounded-2xl flex items-start gap-4">
                <div className="w-10 h-10 bg-[#fcb726] text-[#1a1a1a] rounded-xl flex items-center justify-center flex-shrink-0 font-heading font-[800]">03</div>
                <div>
                  <h4 className="font-heading font-[700] text-[18px] mb-1">Sous-valorisation</h4>
                  <p className="font-sans text-[14px] text-white/80 leading-[1.6]">La recherche scientifique agricole peine à atteindre le producteur.</p>
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm border border-white/10 p-5 rounded-2xl flex items-start gap-4">
                <div className="w-10 h-10 bg-[#fcb726] text-[#1a1a1a] rounded-xl flex items-center justify-center flex-shrink-0 font-heading font-[800]">04</div>
                <div>
                  <h4 className="font-heading font-[700] text-[18px] mb-1">Besoin d'accompagnement</h4>
                  <p className="font-sans text-[14px] text-white/80 leading-[1.6]">Les entrepreneurs agricoles manquent de visibilité et de mentorat.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center max-w-[800px] mx-auto">
            <h3 className="font-heading font-[800] text-[28px] text-[#1a1a1a] mb-6">Notre Réponse : agrolide</h3>
            <p className="font-sans text-[18px] text-[#555] leading-[1.8] bg-[#f8f8f6] p-8 rounded-3xl border border-[#eaeaea]">
              Transformer cette fragmentation en un <strong className="text-[#1a1a1a]">écosystème professionnel intégré</strong>, capable de mobiliser les ressources, de renforcer les compétences et d'incuber les projets qui feront de l'agriculture un moteur de souveraineté.
            </p>
          </div>

        </div>
      </section>

      {/* ── MISSION & VISION ─────────────────────── */}
      <section className="bg-gradient-to-br from-[#f8f8f6] to-white py-[60px] md:py-[100px] relative overflow-hidden">
        <div className="max-w-[1100px] mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-block px-8 py-4 bg-white shadow-[0_10px_30px_rgba(0,0,0,0.05)] text-[#1b5e38] rounded-full font-heading font-[800] text-[16px] md:text-[20px] mb-8 border border-[#eaeaea]">
              « Fédérer la chaîne agricole, pour conquérir la souveraineté alimentaire »
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="group relative bg-white rounded-2xl p-10 border border-[#f0f0f0] shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_40px_rgba(27,94,56,0.08)] hover:-translate-y-1 transition-all duration-300">
              <div className="w-14 h-14 bg-[#fcb726]/10 rounded-xl flex items-center justify-center text-[#d9970c] mb-6">
                <Target size={28} />
              </div>
              <h3 className="font-heading font-[800] text-[24px] text-[#1a1a1a] mb-4">Notre Mission</h3>
              <p className="font-sans text-[16px] text-[#666] leading-[1.8]">
                Fédérer et valoriser les acteurs de la chaîne agricole africaine par la mutualisation des ressources, le renforcement des compétences, l'incubation entrepreneuriale et le développement de leur visibilité, pour contribuer activement à la conquête de la souveraineté alimentaire africaine.
              </p>
            </div>
            
            <div className="group relative bg-white rounded-2xl p-10 border border-[#f0f0f0] shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_40px_rgba(27,94,56,0.08)] hover:-translate-y-1 transition-all duration-300">
              <div className="w-14 h-14 bg-[#1b5e38]/10 rounded-xl flex items-center justify-center text-[#1b5e38] mb-6">
                <Lightbulb size={28} />
              </div>
              <h3 className="font-heading font-[800] text-[24px] text-[#1a1a1a] mb-4">Notre Vision</h3>
              <p className="font-sans text-[16px] text-[#666] leading-[1.8]">
                Être le réseau continental où chaque acteur de la chaîne agricole africaine trouve les ressources, les opportunités et les connexions nécessaires pour participer activement à la conquête de la souveraineté alimentaire.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── NOTRE ÉQUIPE ───────────────────────────── */}
      <section className="py-[40px] md:py-[80px] bg-white">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="text-center max-w-[700px] mx-auto mb-16">
            <h2 className="font-heading font-[800] text-[32px] md:text-[44px] text-[#1a1a1a] mb-6">
              L'équipe fondatrice
            </h2>
            <p className="font-sans text-[16px] text-[#666] leading-[1.7]">
              Une équipe de passionnés, alliant expertise agronomique, technologique et stratégique au service de l'agriculture africaine.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { name: "Remy Gaguy", role: "Fondateur & CEO", desc: "Visionnaire et leader, expert en développement d'écosystèmes agricoles." },
              { name: "Alice K.", role: "Directrice des Opérations", desc: "Assure la structuration et le bon déploiement des actions sur le terrain." },
              { name: "Marc D.", role: "Lead Tech", desc: "Architecte de la plateforme agrolide et de ses solutions digitales." },
              { name: "Sarah N.", role: "Responsable Réseau", desc: "Anime la communauté et construit les partenariats stratégiques." }
            ].map((member, i) => (
              <div key={i} className="group text-center">
                <div className="w-[160px] h-[160px] md:w-[200px] md:h-[200px] mx-auto mb-6 relative rounded-full bg-[#f8f8f6] border-4 border-[#eaeaea] group-hover:border-[#fcb726] transition-all duration-300 overflow-hidden flex items-center justify-center shadow-sm">
                  <span className="font-heading font-[800] text-[40px] text-[#ccc] group-hover:text-[#fcb726] transition-colors">{member.name.substring(0, 2).toUpperCase()}</span>
                </div>
                <h3 className="font-heading font-[800] text-[20px] text-[#1a1a1a] mb-1">{member.name}</h3>
                <p className="font-sans text-[14px] font-[600] text-[#1b5e38] uppercase tracking-wider mb-3">{member.role}</p>
                <p className="font-sans text-[15px] text-[#666] leading-[1.6] max-w-[260px] mx-auto">{member.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── NOS VALEURS ──────────────────────────── */}
      <section className="py-[40px] md:py-[80px] bg-[#f8f8f6]">
        <div className="max-w-[1100px] mx-auto px-6">
          <div className="text-center max-w-[700px] mx-auto mb-16">
            <h2 className="font-heading font-[800] text-[32px] md:text-[44px] text-[#1a1a1a] mb-6">
              Nos valeurs fondatrices
            </h2>
            <p className="font-sans text-[16px] text-[#666] leading-[1.7]">
              Ces principes guident chacune de nos actions et unissent tous les membres du réseau à travers le continent.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: <Users size={24} />, title: "Solidarité", desc: "Le réseau est notre première ressource. La réussite de chacun passe par la force du collectif et la mutualisation des compétences entre membres." },
              { icon: <Crown size={24} />, title: "Leadership", desc: "agrolide forge des leaders agricoles. Chaque acteur accompagné est un futur moteur de la chaîne agricole et de la souveraineté alimentaire africaine." },
              { icon: <Star size={24} />, title: "Excellence", desc: "Rigueur et professionnalisme dans chaque formation, chaque accompagnement et chaque service proposé aux membres." },
              { icon: <Lightbulb size={24} />, title: "Innovation africaine", desc: "Des solutions pensées pour et par les réalités africaines — adaptées aux terroirs, aux marchés et aux contraintes du continent." },
              { icon: <Target size={24} />, title: "Impact", desc: "Chaque action est évaluée à l'aune de sa contribution concrète à la souveraineté alimentaire africaine." },
            ].map((v, i) => (
              <div key={i} className="group bg-white rounded-2xl p-8 border border-[#f0f0f0] shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:shadow-[0_20px_40px_rgba(27,94,56,0.08)] hover:-translate-y-1 transition-all duration-300">
                <div className="w-12 h-12 bg-[#f0f7f0] group-hover:bg-[#1b5e38] rounded-xl flex items-center justify-center text-[#1b5e38] group-hover:text-white transition-colors duration-300 mb-6">
                  {v.icon}
                </div>
                <h3 className="font-heading font-[800] text-[20px] text-[#1a1a1a] mb-4">{v.title}</h3>
                <p className="font-sans text-[15px] text-[#666] leading-[1.7]">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA FINAL ────────────────────────────── */}
      <section className="bg-gradient-to-br from-[#1b5e38] to-[#124026] py-[60px] md:py-[100px] text-center relative overflow-hidden">
        <div className="absolute inset-0 z-0">
           <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#fcb726]/10 rounded-full blur-[100px] pointer-events-none" />
        </div>
        <div className="max-w-[800px] mx-auto px-6 relative z-10">
          <h2 className="font-heading font-[800] text-[32px] md:text-[48px] text-white mb-10 leading-[1.15]">
            Prêt à faire partie de l'histoire ?
          </h2>
          <Link
            href="/rejoindre"
            className="inline-flex items-center gap-3 bg-[#fcb726] text-[#1a1a1a] font-heading font-[800] text-[16px] px-[40px] py-[18px] rounded-full hover:bg-white hover:shadow-[0_0_40px_rgba(252,183,38,0.4)] transition-all duration-300 hover:-translate-y-1"
          >
            Rejoindre le réseau
          </Link>
        </div>
      </section>
    </div>
  )
}
