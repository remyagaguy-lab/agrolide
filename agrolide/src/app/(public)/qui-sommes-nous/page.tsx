import { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { Users, Crown, Star, Lightbulb, Target, BookOpen, Microscope, Share2, Globe, ArrowRight, LineChart } from "lucide-react"

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

      {/* ── LE PARADOXE ───────────────────────────── */}
      <section className="py-[60px] md:py-[100px] bg-[#f0f7f0] relative overflow-hidden">
        <div className="absolute top-[-10%] right-[-5%] w-[400px] h-[400px] bg-[#1b5e38]/10 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="max-w-[1000px] mx-auto px-6 relative z-10">
          <div className="text-center mb-12">
            <h2 className="font-heading font-[800] text-[36px] md:text-[48px] text-[#1b5e38] mb-6">
              Pourquoi le réseau agrolide ?
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <p className="font-sans text-[18px] md:text-[20px] text-[#1a1a1a] leading-[1.8] font-[500]">
                L'Afrique possède <strong className="text-[#1b5e38] font-[800]">60 % des terres arables non exploitées</strong> de la planète. Elle abrite des milliers de techniciens et d'ingénieurs agronomes, des chercheurs passionnés, des entrepreneurs audacieux et des producteurs tenaces...
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-3xl shadow-[0_10px_30px_rgba(27,94,56,0.08)] border border-[#1b5e38]/10 relative">
              <div className="absolute -left-6 -top-6 w-16 h-16 bg-[#fcb726] rounded-full flex items-center justify-center text-white font-heading font-[800] text-[32px] shadow-lg transform -rotate-12">
                ?
              </div>
              <p className="font-sans text-[16px] md:text-[18px] text-[#555] leading-[1.7]">
                Et pourtant... elle n'arrive pas encore à nourrir tous ses enfants, elle dépense <strong className="text-[#d9970c] font-[800] underline decoration-[#fcb726]/30 decoration-4">65 milliards de dollars par an</strong> pour importer sa nourriture. Une dépendance en hausse depuis 3 ans consécutifs.
              </p>
              <p className="font-sans text-[16px] md:text-[18px] text-[#1a1a1a] font-[700] mt-6 bg-[#f8f8f6] p-4 rounded-xl border border-[#eaeaea] text-center">
                Ce n'est pas un manque de talent, ni un manque de savoir.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── LES 4 FREINS ───────────────────────────── */}
      <section className="py-[60px] md:py-[100px] bg-white">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="font-heading font-[800] text-[36px] md:text-[48px] text-[#1b5e38] mb-4">
              C'est un manque...
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 relative">
            {/* Ligne décorative au centre (visible sur desktop) */}
            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-[#eaeaea] to-transparent transform -translate-x-1/2" />
            <div className="hidden md:block absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#eaeaea] to-transparent transform -translate-y-1/2" />
            
            <div className="bg-[#f8f8f6] p-8 rounded-3xl border border-[#eaeaea] hover:border-[#1b5e38]/30 transition-all duration-300 shadow-sm hover:shadow-md group relative">
              <div className="w-14 h-14 bg-white shadow-sm rounded-2xl flex items-center justify-center text-[#1b5e38] mb-6 group-hover:scale-110 transition-transform">
                <Users size={28} />
              </div>
              <h3 className="font-heading font-[800] text-[20px] text-[#1a1a1a] mb-3">...de connexion entre les professionnels.</h3>
              <p className="font-sans text-[15px] text-[#666] leading-[1.6]">
                Faute de réseaux agricoles structurés, des étudiants brillants terminent leurs études sans savoir à quelle porte frapper. Les professionnels travaillent en vase clos et reproduisent des erreurs que d'autres ont déjà surmontées.
              </p>
            </div>

            <div className="bg-[#f8f8f6] p-8 rounded-3xl border border-[#eaeaea] hover:border-[#fcb726]/30 transition-all duration-300 shadow-sm hover:shadow-md group relative">
              <div className="w-14 h-14 bg-white shadow-sm rounded-2xl flex items-center justify-center text-[#fcb726] mb-6 group-hover:scale-110 transition-transform">
                <Target size={28} />
              </div>
              <h3 className="font-heading font-[800] text-[20px] text-[#1a1a1a] mb-3">...d'accompagnement entrepreneurial et visibilité.</h3>
              <p className="font-sans text-[15px] text-[#666] leading-[1.6]">
                De nombreux jeunes diplômés et porteurs de projets manquent de mentorat, d'accès au financement et de compétences pratiques. Même les entrepreneurs les plus talentueux restent invisibles, faute de réseaux structurés.
              </p>
            </div>

            <div className="bg-[#f8f8f6] p-8 rounded-3xl border border-[#eaeaea] hover:border-[#fcb726]/30 transition-all duration-300 shadow-sm hover:shadow-md group relative">
              <div className="w-14 h-14 bg-white shadow-sm rounded-2xl flex items-center justify-center text-[#fcb726] mb-6 group-hover:scale-110 transition-transform">
                <BookOpen size={28} />
              </div>
              <h3 className="font-heading font-[800] text-[20px] text-[#1a1a1a] mb-3">...de documentation adaptée à nos réalités.</h3>
              <p className="font-sans text-[15px] text-[#666] leading-[1.6]">
                La quasi-totalité des ressources techniques disponibles a été conçue pour des contextes occidentaux. Elle ne répond pas aux contraintes spécifiques de l'agriculture africaine : sols tropicaux, variabilité climatique, marchés informels.
              </p>
            </div>

            <div className="bg-[#f8f8f6] p-8 rounded-3xl border border-[#eaeaea] hover:border-[#1b5e38]/30 transition-all duration-300 shadow-sm hover:shadow-md group relative">
              <div className="w-14 h-14 bg-white shadow-sm rounded-2xl flex items-center justify-center text-[#1b5e38] mb-6 group-hover:scale-110 transition-transform">
                <Microscope size={28} />
              </div>
              <h3 className="font-heading font-[800] text-[20px] text-[#1a1a1a] mb-3">...de passerelles entre la recherche et le terrain.</h3>
              <p className="font-sans text-[15px] text-[#666] leading-[1.6]">
                Des milliers de thèses et mémoires agronomiques sont produits chaque année dans les universités africaines et ne parviennent jamais aux producteurs. Les solutions existent, mais elles dorment dans les tiroirs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── LA SOLUTION ──────────────────────────── */}
      <section className="bg-gradient-to-br from-[#1b5e38] to-[#124026] py-[40px] md:py-[60px] text-white relative overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 20px 20px, rgba(255,255,255,0.2) 2px, transparent 0)', backgroundSize: '40px 40px' }}></div>
        <div className="max-w-[800px] mx-auto px-6 relative z-10 text-center">
          <h2 className="font-heading font-[800] text-[32px] md:text-[40px] mb-4 leading-[1.15]">
            Un Réseau comme solution...
          </h2>
          <p className="font-sans text-[18px] md:text-[20px] text-white/90 leading-[1.6] mb-8">
            Et si la solution à ces défis n'était pas une nouvelle technologie... <strong className="text-[#fcb726]">mais un réseau ?</strong>
          </p>
          
          <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 md:p-8 rounded-2xl shadow-xl text-left">
            <div className="flex items-start gap-4 mb-6">
              <ArrowRight className="w-5 h-5 text-[#fcb726] flex-shrink-0 mt-1" />
              <p className="font-sans text-[16px] md:text-[18px] text-white/90 leading-[1.6] m-0">Un réseau qui <strong className="text-white">connecte</strong>, qui <strong className="text-white">forme</strong>, qui <strong className="text-white">accompagne</strong>, qui <strong className="text-white">valorise</strong> chaque acteur de la chaîne agricole africaine.</p>
            </div>
            <div className="border-t border-white/20 pt-4 text-center">
              <p className="font-heading font-[700] text-[16px] md:text-[18px] text-[#fcb726] m-0 leading-[1.5]">
                C'est exactement ce que nous construisons ensemble, pour vous, pour l'Afrique. <br className="hidden md:block" /> Bienvenue dans le Réseau agrolide.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── NOTRE HISTOIRE & STATS ────────────────── */}
      <section className="py-[60px] md:py-[100px] bg-white">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-6">
              <h2 className="font-heading font-[800] text-[36px] md:text-[44px] text-[#1b5e38]">Notre histoire...</h2>
              <p className="font-sans text-[18px] text-[#555] leading-[1.8]">
                <strong className="text-[#1a1a1a]">agrolide</strong> est né d'un geste simple : <strong className="text-[#1b5e38]">celui de partager</strong>. 
                Tout a commencé avec <strong className="text-[#1a1a1a]">«La Bibliothèque de l'Agronome»</strong>, une communauté virtuelle, spontanée, où étudiants, professionnels et entrepreneurs du domaine agricole de tous horizons partageaient librement leurs savoirs, leurs expériences, leurs ressources.
              </p>
              <p className="font-sans text-[18px] text-[#555] leading-[1.8]">
                Ce signal était clair : <strong className="text-[#1a1a1a]">la demande existait et la volonté aussi.</strong> Il ne manquait qu'une structure pour lui donner toute sa puissance. C'est précisément ce que nous avons décidé de construire.
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-[#1b5e38] text-white p-8 rounded-3xl shadow-lg border border-[#1b5e38]/20 flex flex-col items-center justify-center text-center transform hover:-translate-y-1 transition-transform">
                <div className="font-heading font-[800] text-[48px] text-[#fcb726] leading-none mb-2">1300+</div>
                <div className="font-sans text-[15px] font-[600] opacity-90 uppercase tracking-wide">Membres dans la communauté WhatsApp</div>
              </div>
              <div className="bg-[#1b5e38] text-white p-8 rounded-3xl shadow-lg border border-[#1b5e38]/20 flex flex-col items-center justify-center text-center transform hover:-translate-y-1 transition-transform">
                <div className="font-heading font-[800] text-[48px] text-[#fcb726] leading-none mb-2">900+</div>
                <div className="font-sans text-[15px] font-[600] opacity-90 uppercase tracking-wide">Ressources mobilisées dans la bibliothèque</div>
              </div>
              <div className="sm:col-span-2 bg-[#1b5e38] text-white p-8 rounded-3xl shadow-lg border border-[#1b5e38]/20 flex flex-col sm:flex-row items-center justify-center text-center gap-6 transform hover:-translate-y-1 transition-transform">
                <div className="font-heading font-[800] text-[48px] text-[#fcb726] leading-none">46-55</div>
                <div className="font-sans text-[15px] font-[600] opacity-90 uppercase tracking-wide max-w-[200px]">Participants durant nos 2 premiers webinaires</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CHRONOLOGIE ──────────────────────────── */}
      <section className="py-[60px] md:py-[100px] bg-[#f8f8f6] relative overflow-hidden">
        <div className="max-w-[1000px] mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="font-heading font-[800] text-[36px] md:text-[44px] text-[#1a1a1a]">L'évolution du réseau</h2>
          </div>
          
          <div className="relative">
            {/* Ligne verticale centrale (desktop) ou à gauche (mobile) */}
            <div className="absolute left-6 md:left-1/2 top-4 bottom-4 w-1 bg-[#eaeaea] transform md:-translate-x-1/2 z-0"></div>
            
            <div className="space-y-8 md:space-y-12 relative z-10">
              
              {/* Étape 1 */}
              <div className="relative flex flex-col md:flex-row items-start md:items-center">
                <div className="hidden md:block md:w-1/2 md:pr-12 text-right">
                  <div className="font-heading font-[800] text-[22px] text-[#1b5e38]">21 Octobre 2025</div>
                </div>
                <div className="absolute left-6 md:left-1/2 transform -translate-x-1/2 w-5 h-5 bg-white border-[5px] border-[#1b5e38] rounded-full shadow-md z-10 mt-6 md:mt-0"></div>
                <div className="pl-16 md:pl-12 md:w-1/2 w-full">
                  <div className="bg-white p-6 md:p-8 rounded-3xl border border-[#eaeaea] shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-lg transition-all duration-300 relative group">
                    <div className="md:hidden font-heading font-[800] text-[18px] text-[#1b5e38] mb-2">21 Octobre 2025</div>
                    <p className="font-sans text-[15px] md:text-[16px] text-[#555] leading-[1.6]">Création du groupe WhatsApp "Bibliothèque Agricole"</p>
                  </div>
                </div>
              </div>

              {/* Étape 2 */}
              <div className="relative flex flex-col md:flex-row-reverse items-start md:items-center">
                <div className="hidden md:block md:w-1/2 md:pl-12 text-left">
                  <div className="font-heading font-[800] text-[22px] text-[#fcb726]">26 Novembre 2025</div>
                </div>
                <div className="absolute left-6 md:left-1/2 transform -translate-x-1/2 w-5 h-5 bg-white border-[5px] border-[#fcb726] rounded-full shadow-md z-10 mt-6 md:mt-0"></div>
                <div className="pl-16 md:pr-12 md:pl-0 md:w-1/2 w-full">
                  <div className="bg-white p-6 md:p-8 rounded-3xl border border-[#eaeaea] shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-lg transition-all duration-300 md:text-right relative group">
                    <div className="md:hidden font-heading font-[800] text-[18px] text-[#fcb726] mb-2">26 Novembre 2025</div>
                    <p className="font-sans text-[15px] md:text-[16px] text-[#555] leading-[1.6]">Début des réflexions pour trouver des solutions défis du monde agricole</p>
                  </div>
                </div>
              </div>

              {/* Étape 3 */}
              <div className="relative flex flex-col md:flex-row items-start md:items-center">
                <div className="hidden md:block md:w-1/2 md:pr-12 text-right">
                  <div className="font-heading font-[800] text-[22px] text-[#1a1a1a]">2 Déc. 2025</div>
                </div>
                <div className="absolute left-6 md:left-1/2 transform -translate-x-1/2 w-5 h-5 bg-white border-[5px] border-[#1a1a1a] rounded-full shadow-md z-10 mt-6 md:mt-0"></div>
                <div className="pl-16 md:pl-12 md:w-1/2 w-full">
                  <div className="bg-white p-6 md:p-8 rounded-3xl border border-[#eaeaea] shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-lg transition-all duration-300 relative group">
                    <div className="md:hidden font-heading font-[800] text-[18px] text-[#1a1a1a] mb-2">2 Déc. 2025</div>
                    <p className="font-sans text-[15px] md:text-[16px] text-[#555] leading-[1.6]">La "Bibliothèque Agricole" devient BIFERA</p>
                  </div>
                </div>
              </div>

              {/* Étape 4 */}
              <div className="relative flex flex-col md:flex-row-reverse items-start md:items-center">
                <div className="hidden md:block md:w-1/2 md:pl-12 text-left">
                  <div className="font-heading font-[800] text-[22px] text-[#1b5e38]">20 Déc. 2025</div>
                </div>
                <div className="absolute left-6 md:left-1/2 transform -translate-x-1/2 w-5 h-5 bg-white border-[5px] border-[#1b5e38] rounded-full shadow-md z-10 mt-6 md:mt-0"></div>
                <div className="pl-16 md:pr-12 md:pl-0 md:w-1/2 w-full">
                  <div className="bg-white p-6 md:p-8 rounded-3xl border border-[#eaeaea] shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-lg transition-all duration-300 md:text-right relative group">
                    <div className="md:hidden font-heading font-[800] text-[18px] text-[#1b5e38] mb-2">20 Déc. 2025</div>
                    <p className="font-sans text-[15px] md:text-[16px] text-[#555] leading-[1.6]">Premier webinaire sur la gestion de projet agricole</p>
                  </div>
                </div>
              </div>
              
              {/* Étape 5 */}
              <div className="relative flex flex-col md:flex-row items-start md:items-center">
                <div className="hidden md:block md:w-1/2 md:pr-12 text-right">
                  <div className="font-heading font-[800] text-[22px] text-[#fcb726]">Janvier 2026</div>
                </div>
                <div className="absolute left-6 md:left-1/2 transform -translate-x-1/2 w-5 h-5 bg-white border-[5px] border-[#fcb726] rounded-full shadow-md z-10 mt-6 md:mt-0"></div>
                <div className="pl-16 md:pl-12 md:w-1/2 w-full">
                  <div className="bg-white p-6 md:p-8 rounded-3xl border border-[#eaeaea] shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-lg transition-all duration-300 relative group">
                    <div className="md:hidden font-heading font-[800] text-[18px] text-[#fcb726] mb-2">Janvier 2026</div>
                    <p className="font-sans text-[15px] md:text-[16px] text-[#555] leading-[1.6]">Mise en place d'une équipe d'appui</p>
                  </div>
                </div>
              </div>

              {/* Étape 6 */}
              <div className="relative flex flex-col md:flex-row-reverse items-start md:items-center">
                <div className="hidden md:block md:w-1/2 md:pl-12 text-left">
                  <div className="font-heading font-[800] text-[22px] text-[#1b5e38]">31 Janvier 2026</div>
                </div>
                <div className="absolute left-6 md:left-1/2 transform -translate-x-1/2 w-5 h-5 bg-white border-[5px] border-[#1b5e38] rounded-full shadow-md z-10 mt-6 md:mt-0"></div>
                <div className="pl-16 md:pr-12 md:pl-0 md:w-1/2 w-full">
                  <div className="bg-white p-6 md:p-8 rounded-3xl border border-[#eaeaea] shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-lg transition-all duration-300 md:text-right relative group">
                    <div className="md:hidden font-heading font-[800] text-[18px] text-[#1b5e38] mb-2">31 Janvier 2026</div>
                    <p className="font-sans text-[15px] md:text-[16px] text-[#555] leading-[1.6]">2ème Webinaire sur la commercialisation des produits agricoles</p>
                  </div>
                </div>
              </div>

              {/* Étape 7 */}
              <div className="relative flex flex-col md:flex-row items-start md:items-center">
                <div className="hidden md:block md:w-1/2 md:pr-12 text-right">
                  <div className="font-heading font-[800] text-[22px] text-[#1a1a1a]">Février - Avril 2026</div>
                </div>
                <div className="absolute left-6 md:left-1/2 transform -translate-x-1/2 w-5 h-5 bg-white border-[5px] border-[#1a1a1a] rounded-full shadow-md z-10 mt-6 md:mt-0"></div>
                <div className="pl-16 md:pl-12 md:w-1/2 w-full">
                  <div className="bg-white p-6 md:p-8 rounded-3xl border border-[#eaeaea] shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-lg transition-all duration-300 relative group">
                    <div className="md:hidden font-heading font-[800] text-[18px] text-[#1a1a1a] mb-2">Février - Avril 2026</div>
                    <p className="font-sans text-[15px] md:text-[16px] text-[#555] leading-[1.6]">Structuration de BIFERA en un réseau : Gouvernance, activités stratégiques, pilotes...</p>
                  </div>
                </div>
              </div>

              {/* Étape 8 */}
              <div className="relative flex flex-col md:flex-row-reverse items-start md:items-center">
                <div className="hidden md:block md:w-1/2 md:pl-12 text-left">
                  <div className="font-heading font-[800] text-[22px] text-[#fcb726]">Mai - Juin 2026</div>
                </div>
                <div className="absolute left-6 md:left-1/2 transform -translate-x-1/2 w-5 h-5 bg-white border-[5px] border-[#fcb726] rounded-full shadow-md z-10 mt-6 md:mt-0"></div>
                <div className="pl-16 md:pr-12 md:pl-0 md:w-1/2 w-full">
                  <div className="bg-white p-6 md:p-8 rounded-3xl border border-[#eaeaea] shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-lg transition-all duration-300 md:text-right relative group">
                    <div className="md:hidden font-heading font-[800] text-[18px] text-[#fcb726] mb-2">Mai - Juin 2026</div>
                    <p className="font-sans text-[15px] md:text-[16px] text-[#555] leading-[1.6]">Relance des activité du BIFERA de vient agrolide</p>
                  </div>
                </div>
              </div>

              {/* Étape 9 */}
              <div className="relative flex flex-col md:flex-row items-start md:items-center">
                <div className="hidden md:block md:w-1/2 md:pr-12 text-right">
                  <div className="font-heading font-[800] text-[22px] text-[#1a1a1a]">Juil à Déc. 2026</div>
                </div>
                <div className="absolute left-6 md:left-1/2 transform -translate-x-1/2 w-5 h-5 bg-white border-[5px] border-[#1a1a1a] rounded-full shadow-md z-10 mt-6 md:mt-0"></div>
                <div className="pl-16 md:pl-12 md:w-1/2 w-full">
                  <div className="bg-white p-6 md:p-8 rounded-3xl border border-[#eaeaea] shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-lg transition-all duration-300 relative group">
                    <div className="md:hidden font-heading font-[800] text-[18px] text-[#1a1a1a] mb-2">Juil à Déc. 2026</div>
                    <p className="font-sans text-[15px] md:text-[16px] text-[#555] leading-[1.6]">Mise en place de l'organe de gouvernance, Création formelle et lancement officiel des activités du réseau agrolide</p>
                  </div>
                </div>
              </div>

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
