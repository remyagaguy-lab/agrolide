import Image from "next/image"
import Link from "next/link"

export const revalidate = 3600 // ISR 1h

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      
      {/* SECTION 1 — HERO */}
      <section className="bg-[#1b5e38] py-[80px] md:py-[120px]">
        <div className="max-w-[1100px] mx-auto px-6 grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
          {/* Gauche (60%) */}
          <div className="md:col-span-7 flex flex-col items-start">
            <div className="border border-[rgba(255,255,255,0.3)] rounded-[4px] px-[12px] py-[4px] text-[12px] text-[rgba(255,255,255,0.8)] inline-block mb-[20px]">
              Réseau professionnel · Agriculture africaine
            </div>
            <h1 className="font-heading font-[800] text-[34px] md:text-[52px] text-[#fff] leading-[1.18] tracking-[-0.03em]">
              Fédérer la chaîne agricole, pour conquérir la <span className="text-[#fcb726]">souveraineté alimentaire</span>
            </h1>
            <p className="font-sans text-[16px] text-[rgba(255,255,255,0.72)] max-w-[460px] leading-[1.7] mt-[20px] mb-[32px]">
              Le réseau continental des acteurs de l'agriculture africaine — agronomes, chercheurs, agripreneurs, partenaires.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/rejoindre" className="bg-[#fff] text-[#1b5e38] font-[700] px-[28px] py-[12px] rounded-[7px] text-[15px] hover:bg-gray-100 transition-colors">
                Rejoindre le réseau
              </Link>
              <Link href="#actions" className="bg-transparent border-[1.5px] border-[rgba(255,255,255,0.5)] text-[#fff] font-[600] px-[28px] py-[12px] rounded-[7px] text-[15px] hover:bg-white/10 transition-colors">
                Découvrir nos actions
              </Link>
            </div>
          </div>
          
          {/* Droite (40%) */}
          <div className="md:col-span-5 w-full">
            <div className="bg-white rounded-[12px] p-[28px] flex flex-col gap-[16px] shadow-lg">
              <div className="flex items-center gap-3">
                <span className="text-xl">🌍</span>
                <span className="font-sans text-[#555] font-medium">Présent dans 12 pays</span>
              </div>
              <div className="h-[1px] w-full bg-[#e8e8e4]" />
              <div className="flex items-center gap-3">
                <span className="text-xl">✅</span>
                <span className="font-sans text-[#555] font-medium">500+ membres actifs</span>
              </div>
              <div className="h-[1px] w-full bg-[#e8e8e4]" />
              <div className="flex items-center gap-3">
                <span className="text-xl">📚</span>
                <span className="font-sans text-[#555] font-medium">80+ ressources techniques</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2 — STATS */}
      <section className="bg-[#f8f8f6] border-y border-[#e8e8e4]">
        <div className="max-w-[1100px] mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4">
            <div className="py-[32px] md:border-r border-[#e8e8e4] flex flex-col items-center justify-center text-center">
              <div className="font-heading font-[800] text-[40px] text-[#1b5e38]">500+</div>
              <div className="font-heading font-[500] text-[12px] text-[#888] uppercase tracking-[0.06em] mt-1">Membres actifs</div>
            </div>
            <div className="py-[32px] md:border-r border-[#e8e8e4] flex flex-col items-center justify-center text-center">
              <div className="font-heading font-[800] text-[40px] text-[#1b5e38]">12</div>
              <div className="font-heading font-[500] text-[12px] text-[#888] uppercase tracking-[0.06em] mt-1">Pays couverts</div>
            </div>
            <div className="py-[32px] md:border-r border-[#e8e8e4] flex flex-col items-center justify-center text-center">
              <div className="font-heading font-[800] text-[40px] text-[#1b5e38]">80+</div>
              <div className="font-heading font-[500] text-[12px] text-[#888] uppercase tracking-[0.06em] mt-1">Documents</div>
            </div>
            <div className="py-[32px] flex flex-col items-center justify-center text-center">
              <div className="font-heading font-[800] text-[40px] text-[#1b5e38]">15</div>
              <div className="font-heading font-[500] text-[12px] text-[#888] uppercase tracking-[0.06em] mt-1">Formations</div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3 — RAISON D'ÊTRE */}
      <section className="bg-white py-[64px] md:py-[96px]">
        <div className="max-w-[1100px] mx-auto px-6 grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
          <div className="md:col-span-6 lg:col-span-7 flex flex-col items-start">
            <div className="text-[12px] font-[700] text-[#50a853] tracking-[0.1em] uppercase mb-[12px]">Notre raison d'être</div>
            <h2 className="font-heading font-[800] text-[36px] text-[#1a1a1a] leading-[1.2] mb-6">
              Transformer la fragmentation en cohésion continentale.
            </h2>
            <p className="font-sans text-[16px] text-[#555] leading-[1.8] mb-4">
              L'agriculture représente jusqu'à 40% du PIB africain et emploie la majorité de notre population active. Pourtant, les acteurs de la chaîne de valeur évoluent souvent de manière fragmentée, sans cadre de collaboration pérenne.
            </p>
            <p className="font-sans text-[16px] text-[#555] leading-[1.8] mb-8">
              agrolide est né d'une ambition collective : doter l'Afrique d'un écosystème professionnel intégré, capable de mobiliser les ressources, renforcer les compétences et incuber les projets qui feront notre souveraineté alimentaire.
            </p>
            <Link href="/qui-sommes-nous" className="text-[#1b5e38] font-[600] text-[15px] group flex items-center gap-2 hover:underline">
              Découvrir notre histoire <span className="transition-transform group-hover:translate-x-1">→</span>
            </Link>
          </div>
          <div className="md:col-span-6 lg:col-span-5 w-full">
            <div className="bg-[#e8e8e4] rounded-[12px] aspect-[4/3] w-full overflow-hidden">
              {/* Image placeholder as requested */}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4 — LES 4 FREINS */}
      <section className="bg-[#f8f8f6] py-[64px] md:py-[96px]">
        <div className="max-w-[1100px] mx-auto px-6">
          <div className="text-center mb-12">
            <div className="text-[12px] font-[700] text-[#50a853] tracking-[0.1em] uppercase mb-[12px]">Constat</div>
            <h2 className="font-heading font-[800] text-[36px] text-[#1a1a1a] leading-[1.2]">
              L'agriculture africaine face à 4 freins
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-[20px] mb-12">
            {[
              { num: "01", title: "Isolement professionnel", desc: "Peu de réseaux solides existent pour permettre aux agronomes et praticiens d'échanger et de collaborer efficacement sur le continent." },
              { num: "02", title: "Documentation inadaptée", desc: "La quasi-totalité des ressources techniques et scientifiques ignorent les réalités climatiques et pédologiques africaines." },
              { num: "03", title: "Déficit d'accompagnement", desc: "Trop d'agripreneurs avancent sans mentorat, sans accès aux marchés et sans financement structuré." },
              { num: "04", title: "Recherche sous-valorisée", desc: "Des milliers de thèses africaines restent inaccessibles et non appliquées sur le terrain par les producteurs." },
            ].map((frein) => (
              <div key={frein.num} className="bg-white border border-[#e8e8e4] rounded-[10px] p-[28px]">
                <div className="text-[11px] font-[700] text-[#50a853] tracking-[0.1em] mb-[12px]">{frein.num}</div>
                <h3 className="font-heading font-[700] text-[17px] text-[#1a1a1a] mb-[8px]">{frein.title}</h3>
                <p className="font-sans text-[14px] text-[#666] leading-[1.6]">{frein.desc}</p>
              </div>
            ))}
          </div>
          
          <p className="text-center font-heading font-[700] text-[18px] text-[#1a1a1a]">
            agrolide a été fondé pour briser ces quatre freins simultanément.
          </p>
        </div>
      </section>

      {/* SECTION 5 — NOS 3 DOMAINES D'ACTIVITÉ */}
      <section id="actions" className="bg-white py-[64px] md:py-[96px]">
        <div className="max-w-[1100px] mx-auto px-6">
          <div className="mb-12">
            <div className="text-[12px] font-[700] text-[#50a853] tracking-[0.1em] uppercase mb-[12px]">Notre approche</div>
            <h2 className="font-heading font-[800] text-[36px] text-[#1a1a1a] leading-[1.2]">
              Un écosystème intégré en 3 domaines
            </h2>
          </div>
          
          <div className="flex flex-col">
            {[
              { num: "1", title: "Mobilisation & Réseautage", desc: "Un annuaire exclusif pour fédérer les compétences, connecter les pairs et développer des synergies panafricaines.", link: "/annuaire" },
              { num: "2", title: "Formation & Insertion", desc: "Des programmes de renforcement de capacités techniques et managériales, ancrés dans les réalités du terrain africain.", link: "/formations" },
              { num: "3", title: "Agrobusiness & Consulting", desc: "Un accompagnement stratégique pour structurer vos projets, accéder aux financements et conquérir les marchés.", link: "/agrobusiness" },
            ].map((domaine, idx) => (
              <Link href={domaine.link} key={domaine.num} className={`flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-[40px] py-[32px] group ${idx !== 0 ? 'border-t border-[#e8e8e4]' : ''}`}>
                <div className="font-heading font-[800] text-[48px] text-[#e8e8e4] min-w-[50px]">
                  {domaine.num}
                </div>
                <div className="flex-1">
                  <h3 className="font-heading font-[700] text-[20px] text-[#1a1a1a] mb-[8px] group-hover:text-[#1b5e38] transition-colors">{domaine.title}</h3>
                  <p className="font-sans text-[15px] text-[#666] leading-[1.7] max-w-[600px]">{domaine.desc}</p>
                </div>
                <div className="text-[#1b5e38] font-heading font-[600] text-[14px] whitespace-nowrap hidden md:block opacity-0 group-hover:opacity-100 transition-opacity translate-x-[-10px] group-hover:translate-x-0">
                  Découvrir →
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 6 — TÉMOIGNAGES */}
      <section className="bg-[#f8f8f6] py-[64px] md:py-[96px]">
        <div className="max-w-[1100px] mx-auto px-6">
          <div className="text-center mb-12">
            <div className="text-[12px] font-[700] text-[#50a853] tracking-[0.1em] uppercase mb-[12px]">Impact</div>
            <h2 className="font-heading font-[800] text-[36px] text-[#1a1a1a] leading-[1.2]">
              La voix du réseau
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((item) => (
              <div key={item} className="bg-white border border-[#e8e8e4] rounded-[10px] p-[28px] flex flex-col">
                <span className="font-heading font-[800] text-[48px] text-[#e8f5e9] leading-[0.8] block mb-2">"</span>
                <p className="font-sans italic text-[15px] text-[#444] leading-[1.8] mb-[20px] flex-1">
                  agrolide m'a permis de structurer mon approche et de trouver des partenaires solides. L'accès aux ressources adaptées à notre continent change véritablement la donne pour les agripreneurs.
                </p>
                <div className="border-t border-[#f0f0f0] pt-[16px] mt-[16px] flex items-center gap-4">
                  <div className="w-[40px] h-[40px] rounded-[50%] bg-[#e8f5e9] text-[#1b5e38] flex items-center justify-center font-heading font-[700] text-[14px]">
                    JD
                  </div>
                  <div>
                    <div className="font-heading font-[600] text-[14px] text-[#1a1a1a]">Jean Dupont</div>
                    <div className="bg-[#f0f7f0] text-[#1b5e38] text-[11px] font-[700] px-[8px] py-[2px] rounded-[4px] inline-block mt-1">
                      Agripreneur
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 7 — BLOG */}
      <section className="bg-white py-[64px] md:py-[96px]">
        <div className="max-w-[1100px] mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <div className="text-[12px] font-[700] text-[#50a853] tracking-[0.1em] uppercase mb-[12px]">Ressources</div>
              <h2 className="font-heading font-[800] text-[36px] text-[#1a1a1a] leading-[1.2]">
                Derniers articles
              </h2>
            </div>
            <Link href="/blog" className="text-[#1b5e38] font-[600] text-[15px] hover:underline mt-4 md:mt-0">
              Tous les articles →
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((item) => (
              <div key={item} className="bg-white border border-[#e8e8e4] rounded-[10px] overflow-hidden opacity-35">
                <div className="h-[180px] bg-[#f0f0ee] w-full" />
                <div className="p-[20px]">
                  <div className="bg-[#f0f7f0] text-[#1b5e38] text-[11px] font-[700] px-[8px] py-[2px] rounded-[4px] inline-block mb-3">
                    Bientôt disponible
                  </div>
                  <h3 className="font-heading font-[700] text-[16px] text-[#1a1a1a] mb-2 leading-snug">
                    Articles bientôt disponibles sur la plateforme
                  </h3>
                  <p className="font-sans text-[13px] text-[#666] line-clamp-2 mb-4">
                    Notre équipe éditoriale prépare actuellement une série de contenus techniques et stratégiques pour vous.
                  </p>
                  <div className="font-sans text-[12px] text-[#999]">
                    À venir • 0 min de lecture
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 8 — CTA FINAL */}
      <section className="bg-[#1b5e38] py-[96px] text-center">
        <div className="max-w-[1100px] mx-auto px-6 flex flex-col items-center">
          <h2 className="font-heading font-[800] text-[32px] md:text-[40px] text-white max-w-[600px] mb-6 leading-tight">
            Prêt à participer à la conquête de la souveraineté alimentaire ?
          </h2>
          <p className="font-sans text-[16px] text-[rgba(255,255,255,0.65)] mb-10">
            Annuaire • Formations • Agrobusiness • Bibliothèque • Événements
          </p>
          <Link href="/rejoindre" className="bg-[#f99e1d] text-white font-heading font-[800] text-[16px] px-[40px] py-[16px] rounded-[8px] hover:bg-[#fcb726] transition-colors inline-block">
            Rejoindre le réseau
          </Link>
        </div>
      </section>
      
    </div>
  )
}
