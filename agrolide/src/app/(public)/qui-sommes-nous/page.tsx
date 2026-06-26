import { Metadata } from "next"
import Link from "next/link"
import { Users, Crown, Star, Lightbulb, Target } from "lucide-react"

export const metadata: Metadata = {
  title: "Qui sommes-nous | agrolide",
  description: "Découvrez l'histoire, la mission et les valeurs fondatrices du réseau agrolide, le réseau continental de l'agriculture africaine.",
}

export default function QuiSommesNousPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* ── HERO ─────────────────────────────────── */}
      <section className="relative overflow-hidden pt-[140px] pb-[80px] md:pt-[180px] md:pb-[100px] bg-[#1a1a1a]">
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
      <section className="py-[60px] md:py-[100px] bg-white">
        <div className="max-w-[900px] mx-auto px-6">
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-[#1b5e38]/10 text-[#1b5e38] font-heading font-[700] text-[11px] tracking-[0.15em] uppercase mb-8">
            <span className="w-2 h-2 rounded-full bg-[#fcb726]" />
            Notre Histoire
          </div>
          <h2 className="font-heading font-[800] text-[32px] md:text-[44px] text-[#1a1a1a] leading-[1.15] mb-10">
            D'une fragmentation à une <span className="text-[#1b5e38]">cohésion continentale</span>
          </h2>
          
          <div className="space-y-6 font-sans text-[17px] text-[#555] leading-[1.8]">
            <p>
              L'agriculture constitue le pilier fondamental du développement économique en Afrique. Elle représente en moyenne 30 à 40 % du produit intérieur brut des pays africains et emploie plus de 60 % de la population active, jouant un rôle déterminant dans la sécurité alimentaire, la création d'emplois et la réduction de la pauvreté. Pourtant, malgré l'immensité de ce potentiel, les acteurs du secteur — agronomes, étudiants, entrepreneurs et producteurs — évoluent souvent de manière fragmentée, en dehors de tout cadre de collaboration structuré et pérenne.
            </p>
            <p>
              Le réseau <strong className="text-[#1a1a1a] font-[700]">agrolide</strong> est né d'une ambition collective : transformer cette fragmentation en cohésion, et doter la chaîne agricole africaine d'un écosystème professionnel intégré capable de mobiliser les ressources, renforcer les compétences et incuber les projets entrepreneuriaux qui feront de l'agriculture africaine un véritable moteur de souveraineté alimentaire.
            </p>
            <p>
              Une analyse approfondie conduite à travers des débats participatifs, des sondages communautaires et des recherches documentaires a permis d'identifier quatre freins structurels majeurs qui bloquent l'émergence d'une agriculture africaine forte et compétitive : l'isolement professionnel, le manque de documentation adaptée aux réalités locales, le déficit d'accompagnement entrepreneurial et de visibilité, ainsi que la sous-valorisation des connaissances scientifiques.
            </p>
            <div className="p-8 md:p-10 bg-gradient-to-br from-[#1b5e38] to-[#124026] text-white rounded-3xl mt-12 shadow-[0_20px_40px_rgba(27,94,56,0.15)] relative overflow-hidden">
              {/* Decorative element */}
              <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/5 rounded-full blur-2xl pointer-events-none" />
              
              <p className="font-heading font-[700] text-[20px] md:text-[24px] leading-[1.6] relative z-10">
                "C'est précisément pour briser ces quatre freins structurels qu'agrolide a été fondé."
              </p>
            </div>
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

      {/* ── NOS VALEURS ──────────────────────────── */}
      <section className="py-[60px] md:py-[100px] bg-white">
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
      <section className="bg-gradient-to-br from-[#1b5e38] to-[#124026] py-[80px] md:py-[120px] text-center relative overflow-hidden">
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
