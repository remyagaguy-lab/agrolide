import { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { SectionLabel } from "@/components/ui/SectionLabel"
import { Card } from "@/components/ui/Card"
import { Users, Crown, Star, Lightbulb, Target, BookOpen, Microscope, Share2, Globe, ArrowRight, LineChart } from "lucide-react"

export const metadata: Metadata = {
  title: "Qui sommes-nous ?",
  description: "Découvrez l'histoire, la mission et les valeurs d'agrolide. Apprenez comment notre réseau agricole continental rassemble les acteurs de l'agriculture africaine.",,
  alternates: { canonical: '/qui-sommes-nous' }
}

export default function QuiSommesNousPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* ── HERO ─────────────────────────────────── */}
      <section className="bg-[#0d3520] pt-12 pb-16 text-white text-center relative overflow-hidden">
        {/* Motif Background */}
        <div 
          className="absolute inset-0 z-0 opacity-[0.05] pointer-events-none" 
          style={{ backgroundImage: "url('/images/motif-transparent.png')", backgroundSize: "800px", backgroundRepeat: "repeat" }} 
        />
        
        <div className="container mx-auto px-4 relative z-10">
          <h1 className="text-4xl sm:text-5xl font-heading font-bold mb-4">
            Qui sommes-nous&nbsp;?
          </h1>
          <p className="text-lg max-w-2xl mx-auto text-white/80">
            Découvrez l'histoire, la mission et les valeurs qui animent le premier réseau continental de l'agriculture africaine.
          </p>
        </div>
      </section>

      {/* ── LE PARADOXE ───────────────────────────── */}
      <section className="bg-vert-clair relative overflow-hidden">
        <div className="container relative z-10">
          <div className="text-center mb-16">
            <SectionLabel className="mx-auto flex justify-center text-center">Le paradoxe</SectionLabel>
            <h2 className="text-h2 text-vert-profond">
              Pourquoi le réseau agrolide&nbsp;?
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-[48px] items-center">
            <div>
              <p className="text-body-lg text-gris-titre font-[500]">
                L'Afrique possède <strong className="text-vert-profond font-[800]">60 % des terres arables non exploitées</strong> de la planète. Elle abrite des milliers de techniciens et d'ingénieurs agronomes, des chercheurs passionnés, des entrepreneurs audacieux et des producteurs tenaces...
              </p>
            </div>
            
            <Card className="relative mt-8 md:mt-0">
              <div className="absolute -left-4 -top-6 w-14 h-14 bg-orange-dore rounded-full flex items-center justify-center text-white font-heading font-[800] text-[28px] shadow-lg transform -rotate-12">
                ?
              </div>
              <p className="text-body text-gris-texte mb-6">
                Et pourtant... elle n'arrive pas encore à nourrir tous ses enfants, elle dépense <strong className="text-orange-accent font-[800] underline decoration-orange-dore/30 decoration-4">65 milliards de dollars par an</strong> pour importer sa nourriture. Une dépendance en hausse depuis 3 ans consécutifs.
              </p>
              <div className="bg-gris-fond p-4 rounded-btn border border-gris-border text-center">
                <p className="font-heading font-[700] text-[15px] text-gris-titre">
                  Ce n'est pas un manque de talent, ni un manque de savoir.
                </p>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* ── LES 4 FREINS ───────────────────────────── */}
      <section className="bg-gris-fond">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-h2 text-vert-profond mb-4">
              C'est un manque...
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-[16px]">
            <Card className="group relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-sm">
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-vert-principal opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="font-heading font-[700] text-[11px] text-vert-principal uppercase tracking-[0.1em] mb-4">01</div>
              <h3 className="font-heading font-[700] text-[17px] text-gris-titre mb-[12px]">...de connexion entre les professionnels.</h3>
              <p className="font-sans font-[400] text-[14px] text-gris-texte leading-[1.6]">
                Faute de réseaux agricoles structurés, des étudiants brillants terminent leurs études sans savoir à quelle porte frapper. Les professionnels travaillent en vase clos et reproduisent des erreurs que d'autres ont déjà surmontées.
              </p>
            </Card>

            <Card className="group relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-sm">
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-vert-principal opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="font-heading font-[700] text-[11px] text-vert-principal uppercase tracking-[0.1em] mb-4">02</div>
              <h3 className="font-heading font-[700] text-[17px] text-gris-titre mb-[12px]">...d'accompagnement entrepreneurial et visibilité.</h3>
              <p className="font-sans font-[400] text-[14px] text-gris-texte leading-[1.6]">
                De nombreux jeunes diplômés et porteurs de projets manquent de mentorat, d'accès au financement et de compétences pratiques. Même les entrepreneurs les plus talentueux restent invisibles, faute de réseaux structurés.
              </p>
            </Card>

            <Card className="group relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-sm">
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-vert-principal opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="font-heading font-[700] text-[11px] text-vert-principal uppercase tracking-[0.1em] mb-4">03</div>
              <h3 className="font-heading font-[700] text-[17px] text-gris-titre mb-[12px]">...de documentation adaptée à nos réalités.</h3>
              <p className="font-sans font-[400] text-[14px] text-gris-texte leading-[1.6]">
                La quasi-totalité des ressources techniques disponibles a été conçue pour des contextes occidentaux. Elle ne répond pas aux contraintes spécifiques de l'agriculture africaine : sols tropicaux, variabilité climatique, marchés informels.
              </p>
            </Card>

            <Card className="group relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-sm">
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-vert-principal opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="font-heading font-[700] text-[11px] text-vert-principal uppercase tracking-[0.1em] mb-4">04</div>
              <h3 className="font-heading font-[700] text-[17px] text-gris-titre mb-[12px]">...de passerelles entre la recherche et le terrain.</h3>
              <p className="font-sans font-[400] text-[14px] text-gris-texte leading-[1.6]">
                Des milliers de thèses et mémoires agronomiques sont produits chaque année dans les universités africaines et ne parviennent jamais aux producteurs. Les solutions existent, mais elles dorment dans les tiroirs.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* ── LA SOLUTION & NOTRE HISTOIRE ──────────────────────────── */}
      <section className="bg-gris-fond pt-[60px] md:pt-[100px] relative overflow-hidden">
        <div className="container max-w-[1200px] mx-auto px-6 mb-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-stretch">
            
            {/* Colonne 1: Un Réseau comme solution */}
            <div className="bg-gradient-to-br from-[#1b5e38] to-[#124026] p-8 md:p-12 rounded-3xl text-white relative overflow-hidden shadow-xl flex flex-col justify-center">
              {/* Motif Background */}
              <div 
                className="absolute inset-0 z-0 opacity-[0.05] pointer-events-none" 
                style={{ backgroundImage: "url('/images/motif-transparent.png')", backgroundSize: "400px", backgroundRepeat: "repeat" }} 
              />
              <div className="relative z-10">
                <h2 className="font-heading font-[800] text-[32px] md:text-[40px] mb-4 leading-[1.15]">
                  Un Réseau comme solution...
                </h2>
                <p className="font-sans text-[18px] md:text-[20px] text-white/90 leading-[1.6] mb-8">
                  Et si la solution à ces défis n'était pas une nouvelle technologie... <strong className="text-[#fcb726]">mais un réseau ?</strong>
                </p>
                
                <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-2xl shadow-lg">
                  <div className="flex items-start gap-4 mb-6">
                    <ArrowRight className="w-5 h-5 text-[#fcb726] flex-shrink-0 mt-1" />
                    <p className="font-sans text-[16px] text-white/90 leading-[1.6] m-0">Un réseau qui <strong className="text-white">connecte</strong>, qui <strong className="text-white">forme</strong>, qui <strong className="text-white">accompagne</strong>, qui <strong className="text-white">valorise</strong> chaque acteur de la chaîne agricole africaine.</p>
                  </div>
                  <div className="border-t border-white/20 pt-4 text-center">
                    <p className="font-heading font-[700] text-[16px] text-[#fcb726] m-0 leading-[1.5]">
                      C'est exactement ce que nous construisons ensemble, pour vous, pour l'Afrique. Bienvenue dans le Réseau agrolide.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Colonne 2: Notre histoire */}
            <div className="bg-white p-8 md:p-12 rounded-3xl shadow-md border border-[#f0f0f0] flex flex-col justify-center">
              <h2 className="font-heading font-[800] text-[32px] md:text-[40px] text-[#1b5e38] mb-6">Notre histoire...</h2>
              <div className="space-y-4">
                <p className="font-sans text-[16px] md:text-[18px] text-[#555] leading-[1.8]">
                  <strong className="text-[#1a1a1a]">agrolide</strong> est né d'un geste simple : <strong className="text-[#1b5e38]">celui de partager</strong>. 
                  Tout a commencé avec <strong className="text-[#1a1a1a]">«La Bibliothèque de l'Agronome»</strong>, une communauté virtuelle, spontanée, où étudiants, professionnels et entrepreneurs du domaine agricole de tous horizons partageaient librement leurs savoirs, leurs expériences, leurs ressources.
                </p>
                <p className="font-sans text-[16px] md:text-[18px] text-[#555] leading-[1.8]">
                  Ce signal était clair : <strong className="text-[#1a1a1a]">la demande existait et la volonté aussi.</strong> Il ne manquait qu'une structure pour lui donner toute sa puissance. C'est précisément ce que nous avons décidé de construire.
                </p>
              </div>
            </div>

          </div>
        </div>

        <div className="container pb-[60px] md:pb-[100px]">
          <div className="text-center mb-16">
            <h2 className="text-h2 text-gris-titre">L'évolution du réseau</h2>
          </div>
          
          <div className="relative">
            {/* Ligne verticale centrale (desktop) ou à gauche (mobile) */}
            <div className="absolute left-6 md:left-1/2 top-4 bottom-4 w-[2px] bg-gris-border transform md:-translate-x-1/2 z-0"></div>
            
            <div className="space-y-8 md:space-y-12 relative z-10">
              {[
                { date: "21 Octobre 2025", text: "Création du groupe WhatsApp \"Bibliothèque Agricole\"", colorClass: "text-vert-profond", borderClass: "border-vert-profond" },
                { date: "26 Novembre 2025", text: "Début des réflexions pour trouver des solutions défis du monde agricole", colorClass: "text-orange-dore", borderClass: "border-orange-dore" },
                { date: "2 Déc. 2025", text: "La \"Bibliothèque Agricole\" devient BIFERA", colorClass: "text-gris-titre", borderClass: "border-gris-titre" },
                { date: "20 Déc. 2025", text: "Premier webinaire sur la gestion de projet agricole", colorClass: "text-vert-profond", borderClass: "border-vert-profond" },
                { date: "Janvier 2026", text: "Mise en place d'une équipe d'appui", colorClass: "text-orange-dore", borderClass: "border-orange-dore" },
                { date: "31 Janvier 2026", text: "2ème Webinaire sur la commercialisation des produits agricoles", colorClass: "text-vert-profond", borderClass: "border-vert-profond" },
                { date: "Février - Avril 2026", text: "Structuration de BIFERA en un réseau : Gouvernance, activités stratégiques, pilotes...", colorClass: "text-gris-titre", borderClass: "border-gris-titre" },
                { date: "Mai - Juin 2026", text: "Relance des activités, BIFERA devient agrolide", colorClass: "text-orange-dore", borderClass: "border-orange-dore" },
                { date: "Juil à Déc. 2026", text: "Mise en place de l'organe de gouvernance, création formelle et lancement officiel des activités du réseau agrolide", colorClass: "text-gris-titre", borderClass: "border-gris-titre" },
              ].map((step, idx) => {
                const isEven = idx % 2 === 0;
                return (
                  <div key={idx} className={`relative flex flex-col items-start md:items-center ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                    <div className={`hidden md:block md:w-1/2 ${isEven ? 'md:pr-12 text-right' : 'md:pl-12 text-left'}`}>
                      <div className={`font-heading font-[800] text-[22px] ${step.colorClass}`}>{step.date}</div>
                    </div>
                    <div className={`absolute left-6 md:left-1/2 transform -translate-x-1/2 w-5 h-5 bg-blanc border-[4px] ${step.borderClass} rounded-full shadow-sm z-10 mt-6 md:mt-0`}></div>
                    <div className={`pl-16 md:w-1/2 w-full ${isEven ? 'md:pl-12' : 'md:pr-12 md:pl-0'}`}>
                      <Card className={`hover:shadow-md transition-shadow ${!isEven ? 'md:text-right' : ''}`}>
                        <div className={`md:hidden font-heading font-[800] text-[18px] ${step.colorClass} mb-2`}>{step.date}</div>
                        <p className="text-body text-gris-texte">{step.text}</p>
                      </Card>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ── MISSION & VISION ─────────────────────── */}
      <section className="bg-gradient-to-br from-[#0d3520] to-[#0a2818] py-[60px] md:py-[100px] relative overflow-hidden">
        {/* Motif Background */}
        <div 
          className="absolute inset-0 z-0 opacity-[0.05] pointer-events-none" 
          style={{ backgroundImage: "url('/images/motif-transparent.png')", backgroundSize: "800px", backgroundRepeat: "repeat" }} 
        />
        <div className="max-w-[1100px] mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-block px-8 py-4 bg-white/10 backdrop-blur-md shadow-[0_10px_30px_rgba(0,0,0,0.1)] text-[#fcb726] rounded-full font-heading font-[800] text-[16px] md:text-[20px] mb-8 border border-white/20">
              « Fédérer la chaîne agricole, pour conquérir la souveraineté alimentaire »
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="group relative bg-white/5 backdrop-blur-sm rounded-2xl p-10 border border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.1)] hover:bg-white/10 hover:-translate-y-1 transition-all duration-300">
              <div className="w-14 h-14 bg-[#fcb726]/20 rounded-xl flex items-center justify-center text-[#fcb726] mb-6">
                <Target size={28} />
              </div>
              <h3 className="font-heading font-[800] text-[24px] text-white mb-4">Notre Mission</h3>
              <p className="font-sans text-[16px] text-white/80 leading-[1.8]">
                Fédérer et valoriser les acteurs de la chaîne agricole africaine par la mutualisation des ressources, le renforcement des compétences, l'incubation entrepreneuriale et le développement de leur visibilité, pour contribuer activement à la conquête de la souveraineté alimentaire africaine.
              </p>
            </div>
            
            <div className="group relative bg-white/5 backdrop-blur-sm rounded-2xl p-10 border border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.1)] hover:bg-white/10 hover:-translate-y-1 transition-all duration-300">
              <div className="w-14 h-14 bg-[#fcb726]/20 rounded-xl flex items-center justify-center text-[#fcb726] mb-6">
                <Lightbulb size={28} />
              </div>
              <h3 className="font-heading font-[800] text-[24px] text-white mb-4">Notre Vision</h3>
              <p className="font-sans text-[16px] text-white/80 leading-[1.8]">
                Être le réseau continental où chaque acteur de la chaîne agricole africaine trouve les ressources, les opportunités et les connexions nécessaires pour participer activement à la conquête de la souveraineté alimentaire.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── NOTRE ÉQUIPE ───────────────────────────── */}
      <section id="equipe" className="py-[40px] md:py-[80px] bg-white">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="text-center max-w-[700px] mx-auto mb-16">
            <h2 className="font-heading font-[800] text-[32px] md:text-[44px] text-[#1a1a1a] mb-6">
              L'équipe pilote
            </h2>
            <p className="font-sans text-[16px] text-[#666] leading-[1.7]">
              Une équipe de passionnés, alliant expertise agronomique, technologique et stratégique au service de l'agriculture africaine.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { 
                name: "M. Remyaga Guy KOUMANTEGA", 
                role: "Fondateur du Réseau agrolide", 
                bullets: ["Ingénieur des travaux agricoles", "Social Média Manager", "Créateur de contenu Business"],
                image: "/equipe/Remyaga%20Guy%20KOUMANTEGA.jpg"
              },
              { 
                name: "M. Antoine AHONDO", 
                role: "Community & Programs Manager", 
                bullets: ["Ingénieur des travaux agricoles"],
                image: "/equipe/Antoine%20AHONDO.jpg"
              },
              { 
                name: "Mlle. Saratou NAYA", 
                role: "Responsable Partenariat et événementiel", 
                bullets: ["Agroéconomiste en formation"],
                image: "/equipe/Saratou%20NAYA.jpg"
              },
              { 
                name: "À pourvoir", 
                role: "Responsable Affaires Juridiques et Administration", 
                bullets: ["Poste à pourvoir"],
                image: ""
              },
              { 
                name: "À pourvoir", 
                role: "Responsable Marketing et Communication", 
                bullets: ["Poste à pourvoir"],
                image: ""
              },
              { 
                name: "À pourvoir", 
                role: "Responsable Finance et Logistique", 
                bullets: ["Poste à pourvoir"],
                image: ""
              },
              { 
                name: "À pourvoir", 
                role: "Responsable Contrôle Qualité et Reporting", 
                bullets: ["Poste à pourvoir"],
                image: ""
              }
            ].map((member, i) => (
              <div key={i} className="group text-center flex flex-col items-center">
                <div className="w-[160px] h-[160px] md:w-[200px] md:h-[200px] mb-6 relative rounded-full bg-[#f8f8f6] border-4 border-[#eaeaea] group-hover:border-[#fcb726] transition-all duration-300 overflow-hidden flex items-center justify-center shadow-sm">
                  {member.image ? (
                    <Image src={member.image} alt={member.name} fill className="object-cover" />
                  ) : (
                    <span className="font-heading font-[800] text-[40px] text-[#ccc] group-hover:text-[#fcb726] transition-colors">
                      {member.name === "À pourvoir" ? "?" : member.name.substring(0, 2).toUpperCase()}
                    </span>
                  )}
                </div>
                <h3 className="font-heading font-[800] text-[18px] md:text-[20px] text-[#1a1a1a] mb-1">{member.name}</h3>
                <p className="font-sans text-[13px] md:text-[14px] font-[600] text-[#1b5e38] uppercase tracking-wider mb-3 leading-[1.4] min-h-[40px] flex items-start justify-center">
                  {member.role}
                </p>
                <div className="font-sans text-[14px] md:text-[15px] text-[#666] leading-[1.6] max-w-[260px] flex flex-col gap-1 text-center">
                  {member.bullets.map((bullet, idx) => (
                    <span key={idx} className="block">{bullet}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── NOS VALEURS ──────────────────────────── */}
      <section className="py-[40px] md:py-[80px] bg-[#f8f8f6]">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="text-center max-w-[700px] mx-auto mb-16">
            <h2 className="font-heading font-[800] text-[32px] md:text-[44px] text-[#1a1a1a] mb-6">
              Nos valeurs fondatrices
            </h2>
            <p className="font-sans text-[16px] text-[#666] leading-[1.7]">
              Ces principes guident chacune de nos actions et unissent tous les membres du réseau à travers le continent.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 md:gap-6">
            {[
              { icon: <Users size={24} />, title: "Solidarité", desc: "Le réseau est notre première ressource. La réussite de chacun passe par la force du collectif et la mutualisation des compétences entre membres." },
              { icon: <Crown size={24} />, title: "Leadership", desc: "agrolide forge des leaders agricoles. Chaque acteur accompagné est un futur moteur de la chaîne agricole et de la souveraineté alimentaire africaine." },
              { icon: <Star size={24} />, title: "Excellence", desc: "Rigueur et professionnalisme dans chaque formation, chaque accompagnement et chaque service proposé aux membres." },
              { icon: <Lightbulb size={24} />, title: "Innovation africaine", desc: "Des solutions pensées pour et par les réalités africaines — adaptées aux terroirs, aux marchés et aux contraintes du continent." },
              { icon: <Target size={24} />, title: "Impact", desc: "Chaque action est évaluée à l'aune de sa contribution concrète à la souveraineté alimentaire africaine." },
            ].map((v, i) => (
              <div key={i} className="group bg-white rounded-2xl p-6 border border-[#f0f0f0] shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:shadow-[0_20px_40px_rgba(27,94,56,0.08)] hover:-translate-y-1 transition-all duration-300 flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-[#f0f7f0] group-hover:bg-[#1b5e38] rounded-xl flex items-center justify-center text-[#1b5e38] group-hover:text-white transition-colors duration-300 mb-4">
                  {v.icon}
                </div>
                <h3 className="font-heading font-[800] text-[18px] text-[#1a1a1a] mb-2">{v.title}</h3>
                <p className="font-sans text-[14px] text-[#666] leading-[1.6]">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA FINAL ────────────────────────────── */}
      <section className="bg-vert-clair py-[96px] text-center">
        <div className="container flex flex-col items-center">
          <h2 className="font-heading font-[900] text-[clamp(24px,4vw,36px)] text-vert-profond leading-[1.2] max-w-[700px] mx-auto mb-8">
            Prêt à faire partie de l'histoire&nbsp;?
          </h2>
          <Link href="/rejoindre" className="btn-primary inline-flex items-center">
            Rejoindre le réseau <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </div>
      </section>
    </div>
  )
}
