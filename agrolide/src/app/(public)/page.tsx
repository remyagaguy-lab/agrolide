import Link from "next/link"
import Image from "next/image"
import { Metadata } from "next"
import { createClient } from "@/lib/supabase/server"
import { SectionLabel } from "@/components/ui/SectionLabel"
import { Card } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"
import { Button } from "@/components/ui/Button"
import { Users, BookOpen, TrendingUp } from "lucide-react"

export const metadata: Metadata = {
  title: { absolute: "agrolide | Réseau agricole" },
  description: "Fédérer la chaîne agricole africaine pour conquérir la souveraineté alimentaire."
}

export const revalidate = 3600

// --- Icônes SVG inline ---

function IconGlobe({ className = "" }: { className?: string }) {
  return (
    <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/>
      <path d="M2 12h20"/>
    </svg>
  )
}

function IconUsers({ className = "" }: { className?: string }) {
  return (
    <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
      <circle cx="9" cy="7" r="4"/>
      <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
      <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  )
}

function IconLibrary({ className = "" }: { className?: string }) {
  return (
    <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/>
    </svg>
  )
}

function IconArrowRight({ className = "" }: { className?: string }) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
    </svg>
  )
}

function IconNetwork({ className = "" }: { className?: string }) {
  return (
    <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect width="6" height="6" x="9" y="3" rx="1"/>
      <rect width="6" height="6" x="3" y="15" rx="1"/>
      <rect width="6" height="6" x="15" y="15" rx="1"/>
      <path d="M12 9v3m-3 3H6m12 0h-3M12 12l-3 3m6-3-3 3"/>
    </svg>
  )
}

function IconGraduation({ className = "" }: { className?: string }) {
  return (
    <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
      <path d="M6 12v5c3 3 9 3 12 0v-5"/>
    </svg>
  )
}

function IconBriefcase({ className = "" }: { className?: string }) {
  return (
    <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="14" x="2" y="7" rx="2"/>
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
    </svg>
  )
}

function IconCheck({ className = "" }: { className?: string }) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 6L9 17l-5-5"/>
    </svg>
  )
}

function IconUsersGroup({ className = "" }: { className?: string }) {
  return (
    <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
      <circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
      <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  )
}

function IconBookOpen({ className = "" }: { className?: string }) {
  return (
    <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
    </svg>
  )
}

function IconSeedling({ className = "" }: { className?: string }) {
  return (
    <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M7 20h10"/>
      <path d="M10 20c5.5-2.5.8-6.4 3-10"/>
      <path d="M9.5 9.4c1.1.8 1.8 2.2 2.3 3.7-2 .4-3.5.4-4.8-.3-1.2-.6-2.3-1.9-3-4.2 2.8-.5 4.4 0 5.5.8z"/>
      <path d="M14.1 6a7 7 0 0 1 1.1 7.17c-2.1-.1-3.6-.6-4.8-1.3-1.2-.7-2-1.9-2.4-4.4 2.7-.5 4.7-.2 6.1 1.6z"/>
    </svg>
  )
}

function IconStar({ className = "" }: { className?: string }) {
  return (
    <svg className={className} width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
    </svg>
  )
}

function IconTrendingUp({ className = "" }: { className?: string }) {
  return (
    <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/>
    </svg>
  )
}

function IconHandshake({ className = "" }: { className?: string }) {
  return (
    <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.42 4.58a5.4 5.4 0 0 0-7.65 0l-.77.78-.77-.78a5.4 5.4 0 0 0-7.65 7.65l1.06 1.06L12 21.23l7.77-7.77 1.06-1.06a5.4 5.4 0 0 0-.41-7.82z"/>
    </svg>
  )
}

// --- Page ---

export default async function HomePage() {
  const supabase = await createClient()
  
  // Fetch 3 latest published articles
  const { data: latestArticles } = await supabase
    .from('articles')
    .select('*, profiles(prenom, nom, photo_url)')
    .eq('statut', 'publie')
    .order('published_at', { ascending: false })
    .limit(3)

  const displayArticles = latestArticles && latestArticles.length > 0 ? latestArticles : [
    { slug: "pratiques-agroecologiques", categorie: "Agronomie", titre: "Pratiques agroécologiques pour sols tropicaux", extrait: "Comment adapter les techniques de conservation des sols aux conditions climatiques de l'Afrique subsaharienne.", published_at: "2024-10-12T00:00:00Z" },
    { slug: "financer-projet-agricole", categorie: "Agrobusiness", titre: "Financer son projet agricole : les clés", extrait: "Tour d'horizon des instruments financiers accessibles aux agripreneurs africains en 2024.", published_at: "2024-10-05T00:00:00Z" },
    { slug: "competences-agronomes", categorie: "Formation", titre: "Compétences du futur pour les agronomes", extrait: "Panorama des formations techniques et managériales qui font la différence sur le terrain africain.", published_at: "2024-09-28T00:00:00Z" },
  ];

  return (
    <div className="flex flex-col min-h-screen">

      {/* ── HERO ─────────────────────────────────── */}
      <section className="bg-[#1b5e38] relative overflow-hidden pt-0 md:pt-0">
        {/* Motif Background for texture (placed behind the image) */}
        <div 
          className="absolute inset-0 z-0 opacity-[0.05] pointer-events-none" 
          style={{ backgroundImage: "url('/images/motif-transparent.png')", backgroundSize: "800px", backgroundRepeat: "repeat" }} 
        />

        {/* Image de fond avec mask pour fondu fluide */}
        <div className="absolute top-0 right-0 w-full md:w-[55%] h-full pointer-events-none z-[1]">
          <Image
            src="/hero-background.jpg"
            alt="Agriculture africaine"
            fill
            priority
            sizes="(max-width: 768px) 100vw, 55vw"
            className="object-cover object-[center_80%] opacity-100"
            style={{ 
              WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 40%)', 
              maskImage: 'linear-gradient(to right, transparent 0%, black 40%)' 
            }}
          />
        </div>

        <div className="max-w-[1100px] mx-auto px-6 pt-[32px] pb-0 md:pt-[48px] relative z-20">
          <div className="max-w-[900px]">
            <h1 className="font-heading font-[800] text-[40px] md:text-[64px] text-white leading-[1.08] tracking-[-0.03em] mb-8">
              Fédérer la chaîne<br />
              agricole, pour conquérir<br />
              <span className="text-[#fcb726]">la souveraineté alimentaire</span>
            </h1>
            <p className="font-sans text-[16px] text-white max-w-[600px] leading-[1.8] mb-10">
              Rejoignez le mouvement qui connecte, forme et propulse les acteurs de l'agriculture africaine.{" "}
              <strong className="text-[#f99e1d] font-[700]">Étudiants en agronomie</strong>, <strong className="text-[#f99e1d] font-[700]">Ingénieurs Agronomes</strong>, <strong className="text-[#f99e1d] font-[700]">Chercheurs</strong>, <strong className="text-[#f99e1d] font-[700]">Entreprises Agricoles</strong>, <strong className="text-[#f99e1d] font-[700]">Investisseurs</strong> construisons... ensemble l'agriculture africaine que nous voulons.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/rejoindre"
                className="bg-white text-[#1b5e38] font-heading font-[700] px-[28px] py-[13px] text-[14px] rounded-md hover:bg-[#f0f7f0] transition-colors"
              >
                Rejoindre le réseau
              </Link>
              <Link
                href="#actions"
                className="border border-[rgba(255,255,255,0.28)] text-white font-heading font-[600] px-[28px] py-[13px] text-[14px] rounded-md hover:bg-white/10 transition-colors"
              >
                Nos actions
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* ── SECTION STATS ── */}
      <section className="bg-blanc border-b border-gris-border py-[16px] md:!py-[28px]">
        <div className="container px-2 md:px-6">
          <div className="grid grid-cols-4 divide-x divide-gris-border">
            <div className="px-1 sm:px-2 md:px-0 text-center flex flex-col justify-start md:justify-center">
              <div className="font-heading font-[900] text-[18px] sm:text-[24px] md:text-[36px] text-vert-profond leading-none mb-1">
                500<span className="font-[400] text-[12px] md:text-[18px] text-vert-principal">+</span>
              </div>
              <div className="font-heading font-[600] text-[8px] sm:text-[9px] md:text-[11px] text-gris-muted uppercase tracking-[0.02em] md:tracking-[0.07em] leading-tight">Membres actifs</div>
            </div>
            <div className="px-1 sm:px-2 md:px-0 text-center flex flex-col justify-start md:justify-center">
              <div className="font-heading font-[900] text-[18px] sm:text-[24px] md:text-[36px] text-vert-profond leading-none mb-1">
                5<span className="font-[400] text-[12px] md:text-[18px] text-vert-principal"> pays</span>
              </div>
              <div className="font-heading font-[600] text-[8px] sm:text-[9px] md:text-[11px] text-gris-muted uppercase tracking-[0.02em] md:tracking-[0.07em] leading-tight">Pays africains</div>
            </div>
            <div className="px-1 sm:px-2 md:px-0 text-center flex flex-col justify-start md:justify-center">
              <div className="font-heading font-[900] text-[18px] sm:text-[24px] md:text-[36px] text-vert-profond leading-none mb-1">
                700<span className="font-[400] text-[12px] md:text-[18px] text-vert-principal">+</span>
              </div>
              <div className="font-heading font-[600] text-[8px] sm:text-[9px] md:text-[11px] text-gris-muted uppercase tracking-[0.02em] md:tracking-[0.07em] leading-tight">Ressources techniques</div>
            </div>
            <div className="px-1 sm:px-2 md:px-0 text-center flex flex-col justify-start md:justify-center">
              <div className="font-heading font-[900] text-[18px] sm:text-[24px] md:text-[36px] text-vert-profond leading-none mb-1">
                100<span className="font-[400] text-[12px] md:text-[18px] text-vert-principal">%</span>
              </div>
              <div className="font-heading font-[600] text-[8px] sm:text-[9px] md:text-[11px] text-gris-muted uppercase tracking-[0.02em] md:tracking-[0.07em] leading-tight">Dédiés à l'Afrique</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── LEAD MAGNET (CRO) ── */}
      <section className="bg-gradient-to-r from-orange-50 to-orange-100 py-12 border-b border-orange-200">
        <div className="container">
          <div className="bg-white rounded-2xl shadow-xl border border-orange-100 p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="md:w-1/2">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-bold uppercase tracking-wider mb-4">
                <BookOpen className="w-4 h-4" /> Guide Gratuit
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4 font-heading">
                Le Manuel de l'Agroécologie en Afrique de l'Ouest
              </h2>
              <p className="text-gray-600 mb-6 text-lg">
                Découvrez les 10 pratiques essentielles pour adapter vos cultures aux changements climatiques et augmenter vos rendements sans intrants chimiques.
              </p>
              <form className="flex flex-col sm:flex-row gap-3">
                <input 
                  type="email" 
                  placeholder="Votre adresse e-mail..." 
                  className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  required
                />
                <button 
                  type="submit" 
                  className="px-6 py-3 bg-orange-600 text-white font-bold rounded-lg hover:bg-orange-700 transition-colors shadow-md"
                >
                  Recevoir le PDF
                </button>
              </form>
            </div>
            <div className="md:w-1/3 flex justify-center relative">
              <div className="w-48 h-64 bg-gray-200 rounded-lg shadow-2xl relative rotate-3 transform hover:rotate-0 transition-transform duration-300 overflow-hidden border-4 border-white">
                <Image src="/hero-background.jpg" alt="Couverture du guide" fill className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/80 flex flex-col justify-end p-4">
                  <div className="text-white font-heading font-bold text-lg leading-tight mb-1">MANUEL PRATIQUE</div>
                  <div className="text-orange-300 text-sm font-medium">Agroécologie</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── RAISON D'ÊTRE ── */}
      <section className="bg-[#fcfbf9] border-b border-[#f0ece1]">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-[55%_1fr] gap-[48px] items-start">
            {/* Colonne gauche */}
            <div>
              <SectionLabel>Notre raison d'être</SectionLabel>
              <h2 className="text-h2 mb-6">
                Transformer la fragmentation en{" "}
                <span className="text-vert-profond">cohésion continentale</span>
              </h2>
              <p className="text-body-lg mb-4">
                L'agriculture représente jusqu'à 40 % du PIB africain et emploie la majorité de notre population active. Pourtant, les acteurs de la chaîne de valeur évoluent de manière fragmentée, sans cadre de collaboration pérenne.
              </p>
              <p className="text-body-lg mb-8">
                agrolide est né d'une ambition collective : doter l'Afrique d'un écosystème professionnel intégré, capable de mobiliser les ressources, renforcer les compétences et incuber les projets qui feront notre souveraineté alimentaire.
              </p>
              <Link href="/qui-sommes-nous" className="btn-text">
                En savoir plus <IconArrowRight />
              </Link>
            </div>

            {/* Colonne droite */}
            <div className="hidden md:block relative bg-gris-light rounded-card aspect-[4/3] overflow-hidden shadow-lg">
              <Image 
                src="/raison-detre.png" 
                alt="Cohésion continentale en agriculture africaine" 
                fill 
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── LES 4 FREINS ── layout horizontal inspiré template Features ── */}
      <section className="bg-gradient-to-b from-[#f0f6f0] to-[#e8efe8] border-b border-[#dce6dc]">
        <div className="container">
          <div className="text-center max-w-[640px] mx-auto mb-12">
            <SectionLabel className="mx-auto flex justify-center text-center">Constat</SectionLabel>
            <h2 className="text-h2 text-gris-titre">
              L'agriculture africaine face à 4 freins majeurs
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <div className="font-heading font-[700] text-[11px] text-vert-principal uppercase tracking-[0.1em] mb-3">01</div>
              <h3 className="text-h3 text-gris-titre mb-2">Isolement professionnel</h3>
              <p className="text-[14px] text-gris-texte leading-[1.65]">
                Peu de réseaux solides permettent aux agronomes d'échanger et de collaborer efficacement sur le continent africain.
              </p>
            </Card>
            <Card>
              <div className="font-heading font-[700] text-[11px] text-vert-principal uppercase tracking-[0.1em] mb-3">02</div>
              <h3 className="text-h3 text-gris-titre mb-2">Documentation inadaptée</h3>
              <p className="text-[14px] text-gris-texte leading-[1.65]">
                La quasi-totalité des ressources techniques ignore les réalités climatiques et pédologiques propres à l'Afrique.
              </p>
            </Card>
            <Card>
              <div className="font-heading font-[700] text-[11px] text-vert-principal uppercase tracking-[0.1em] mb-3">03</div>
              <h3 className="text-h3 text-gris-titre mb-2">Déficit d'accompagnement</h3>
              <p className="text-[14px] text-gris-texte leading-[1.65]">
                Trop d'agripreneurs avancent sans mentorat, sans accès aux marchés et sans financement structuré.
              </p>
            </Card>
            <Card>
              <div className="font-heading font-[700] text-[11px] text-vert-principal uppercase tracking-[0.1em] mb-3">04</div>
              <h3 className="text-h3 text-gris-titre mb-2">Recherche sous-valorisée</h3>
              <p className="text-[14px] text-gris-texte leading-[1.65]">
                Des milliers de thèses africaines restent inaccessibles et non appliquées sur le terrain.
              </p>
            </Card>
          </div>

          <p className="text-center font-heading font-[700] text-[17px] text-gris-titre mt-8">
            agrolide a été fondé pour briser ces quatre barrières simultanément et débloquer le potentiel de notre continent.
          </p>
        </div>
      </section>

      {/* ── 3 DOMAINES D'ACTIVITÉ ── */}
      <section id="actions" className="bg-white">
        <div className="container">
          <div className="text-center mb-12">
            <SectionLabel className="mx-auto flex justify-center text-center">Notre approche</SectionLabel>
            <h2 className="text-h2 text-gris-titre">
              Un écosystème intégré en 3 piliers d'action
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-[20px]">
            <Link href="/annuaire" className="block group">
              <Card variant="feature" className="h-full flex flex-col group-hover:border-[#c8c8c4] group-hover:shadow-[0_2px_12px_rgba(0,0,0,0.06)] transition-all">
                <div className="card-feature-icon">
                  <Users size={20} strokeWidth={1.5} color="#1b5e38" />
                </div>
                <h3 className="text-h3 text-gris-titre mb-2">Mobilisation & Réseautage</h3>
                <p className="text-[14px] text-gris-texte leading-[1.65] mb-6">
                  Un annuaire exclusif pour fédérer les compétences, connecter les pairs et développer des synergies panafricaines.
                </p>
                <div className="btn-text mt-auto">Découvrir <IconArrowRight /></div>
              </Card>
            </Link>

            <Link href="/formations" className="block group">
              <Card variant="feature" className="h-full flex flex-col group-hover:border-[#c8c8c4] group-hover:shadow-[0_2px_12px_rgba(0,0,0,0.06)] transition-all">
                <div className="card-feature-icon">
                  <BookOpen size={20} strokeWidth={1.5} color="#1b5e38" />
                </div>
                <h3 className="text-h3 text-gris-titre mb-2">Formation & Insertion</h3>
                <p className="text-[14px] text-gris-texte leading-[1.65] mb-6">
                  Des programmes de renforcement de capacités techniques et managériales, ancrés dans les réalités du terrain africain.
                </p>
                <div className="btn-text mt-auto">Découvrir <IconArrowRight /></div>
              </Card>
            </Link>

            <Link href="/agrobusiness" className="block group">
              <Card variant="feature" className="h-full flex flex-col group-hover:border-[#c8c8c4] group-hover:shadow-[0_2px_12px_rgba(0,0,0,0.06)] transition-all">
                <div className="card-feature-icon">
                  <TrendingUp size={20} strokeWidth={1.5} color="#1b5e38" />
                </div>
                <h3 className="text-h3 text-gris-titre mb-2">Agrobusiness & Consulting</h3>
                <p className="text-[14px] text-gris-texte leading-[1.65] mb-6">
                  Un accompagnement stratégique pour structurer vos projets, accéder aux financements et conquérir les marchés.
                </p>
                <div className="btn-text mt-auto">Découvrir <IconArrowRight /></div>
              </Card>
            </Link>
          </div>
        </div>
      </section>
      {/* ── SECTION PLATEFORME (BENTO GRID) ── */}
      <section className="bg-gris-fond py-section-lg relative overflow-hidden">
        {/* Cercles décoratifs (Glassmorphism / Glow) */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#50a853]/10 rounded-full blur-[100px] pointer-events-none -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[#f99e1d]/5 rounded-full blur-[120px] pointer-events-none translate-y-1/3 -translate-x-1/3" />

        <div className="container relative z-10">
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-h2 text-gris-titre mb-4">
              L'écosystème <span className="text-vert-principal">complet</span>
            </h2>
            <p className="text-gris-texte text-[16px] leading-[1.6]">
              Une plateforme innovante au service de la mutualisation des ressources entre les acteurs de la chaîne de valeur agricole africaine.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Bloc 1 : Espace d'échange (Pleine largeur sur grand écran) */}
            <div className="lg:col-span-12 group bg-gradient-to-br from-[#f0f7f0] to-[#e3f0e3] rounded-[24px] border border-[#d2e3d2] overflow-hidden hover:shadow-[0_12px_40px_rgba(80,168,83,0.15)] transition-all duration-500">
              <div className="grid grid-cols-1 lg:grid-cols-2 h-full">
                <div className="p-10 md:p-16 flex flex-col justify-center">
                  <div className="w-14 h-14 bg-vert-clair text-vert-principal rounded-[16px] flex items-center justify-center mb-6">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                  </div>
                  <h3 className="text-[32px] font-heading font-[800] text-gris-titre mb-4 leading-tight">Espace d'échange agricole</h3>
                  <p className="text-[16px] text-gris-texte leading-[1.7] mb-8 max-w-[400px]">
                    Un véritable carrefour de discussion réunissant passionnés, professionnels et acteurs du secteur. Restez informé des dernières actualités et découvrez de nouvelles opportunités.
                  </p>
                  <Link href="/rejoindre" className="inline-flex items-center gap-2 font-heading font-[700] text-vert-principal hover:text-vert-profond transition-colors w-fit">
                    Rejoindre les discussions <IconArrowRight />
                  </Link>
                </div>
                <div className="relative min-h-[300px] lg:min-h-[400px] bg-white/40 overflow-hidden">
                  <Image src="/plateforme-forum-ui.png" alt="Espace d'échange" fill className="object-cover object-left-top lg:rounded-tl-[24px] lg:border-l lg:border-t border-white/60 shadow-sm transform group-hover:-translate-y-2 group-hover:-translate-x-2 transition-transform duration-700" />
                </div>
              </div>
            </div>

            {/* Bloc 2 : Annuaire (Moitié gauche) */}
            <div className="lg:col-span-6 group bg-gradient-to-br from-[#fffaf0] to-[#fce8d5] rounded-[24px] border border-[#f5d5b5] overflow-hidden hover:shadow-[0_12px_40px_rgba(249,158,29,0.15)] transition-all duration-500 flex flex-col">
              <div className="p-10 flex-1">
                <div className="w-14 h-14 bg-[#fff3e0] text-orange-accent rounded-[16px] flex items-center justify-center mb-6">
                   <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                </div>
                <h3 className="text-[26px] font-heading font-[800] text-gris-titre mb-4 leading-tight">Annuaire Panafricain</h3>
                <p className="text-[15px] text-gris-texte leading-[1.7] mb-8">
                  Recherchez et connectez-vous avec des experts, des agronomes et des partenaires sur tout le continent.
                </p>
                <Link href="/annuaire" className="inline-flex items-center gap-2 font-heading font-[700] text-[#c26a00] hover:text-[#995400] transition-colors">
                  Explorer le réseau <IconArrowRight />
                </Link>
              </div>
              <div className="relative h-[250px] md:h-[300px] w-full mt-auto bg-white/40 overflow-hidden">
                <Image src="/plateforme-annuaire-ui.png" alt="Annuaire Panafricain" fill className="object-cover object-top border-t border-white/60 transform group-hover:scale-[1.03] transition-transform duration-700" />
              </div>
            </div>

            {/* Bloc 3 : Bibliothèque (Moitié droite) */}
            <div className="lg:col-span-6 group bg-gradient-to-br from-[#f8f9f6] to-[#e6ebe3] rounded-[24px] border border-[#d0dbcb] overflow-hidden hover:shadow-[0_12px_40px_rgba(135,142,44,0.12)] transition-all duration-500 flex flex-col">
              <div className="p-10 flex-1">
                <div className="w-14 h-14 bg-vert-clair text-vert-profond rounded-[16px] flex items-center justify-center mb-6">
                   <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7"/><path d="M2 7h20"/><path d="M4 7v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7"/></svg>
                </div>
                <h3 className="text-[26px] font-heading font-[800] text-gris-titre mb-4 leading-tight">Bibliothèque de Ressources</h3>
                <p className="text-[15px] text-gris-texte leading-[1.7] mb-8">
                  Accédez à des centaines de documents techniques, thèses et guides pratiques spécifiquement adaptés aux sols africains.
                </p>
                <Link href="/bibliotheque" className="inline-flex items-center gap-2 font-heading font-[700] text-vert-principal hover:text-vert-profond transition-colors">
                  Consulter les guides <IconArrowRight />
                </Link>
              </div>
              <div className="relative h-[250px] md:h-[300px] w-full mt-auto bg-white/40 overflow-hidden">
                <Image src="/plateforme-bibliotheque-ui.png" alt="Bibliothèque de Ressources" fill className="object-cover object-top border-t border-white/60 transform group-hover:scale-[1.03] transition-transform duration-700" />
              </div>
            </div>

          </div>
        </div>
      </section>



      {/* ── TÉMOIGNAGES ── */}
      <section className="bg-gris-fond">
        <div className="container">
          <div className="text-center mb-16">
            <SectionLabel className="mx-auto flex justify-center text-center">Témoignages</SectionLabel>
            <h2 className="text-h2 text-gris-titre">
              La voix du réseau
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-[20px]">
            {[
              { initials: "KA", name: "Kouamé A.", role: "Agronome", country: "Côte d'Ivoire",
                quote: "agrolide m'a permis de structurer mon approche et de trouver des partenaires solides. L'accès aux ressources adaptées à notre réalité change véritablement la donne." },
              { initials: "FD", name: "Fatou D.", role: "Chercheuse", country: "Sénégal",
                quote: "Grâce au réseau, mes travaux de recherche ont trouvé une audience et des applications concrètes. Un espace unique pour valoriser la science africaine." },
              { initials: "EM", name: "Emmanuel M.", role: "Agripreneur", country: "Cameroun",
                quote: "L'accompagnement d'Agrolide m'a aidé à passer de l'idée au marché en moins de six mois. Le réseau de mentors est exceptionnel." },
            ].map((t) => (
              <Card key={t.initials} className="flex flex-col h-full">
                <div className="font-baskerville text-[48px] text-[#d4ead4] leading-[0.8] mt-2">"</div>
                <p className="font-baskerville italic text-[14px] text-[#444] leading-[1.85] flex-1 mt-4">
                  {t.quote}
                </p>
                <div className="border-t border-[#f0f0f0] mt-4 pt-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gris-light flex items-center justify-center text-vert-principal font-heading font-[700] text-[13px] flex-shrink-0">
                    {t.initials}
                  </div>
                  <div className="flex flex-col">
                    <div className="font-heading font-[600] text-[13px] text-gris-titre leading-tight">{t.name}</div>
                    <div className="font-sans text-[12px] text-gris-muted mt-0.5">{t.role} · {t.country}</div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION BLOG ── */}
      <section className="bg-blanc">
        <div className="container">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
            <div>
              <SectionLabel>Ressources</SectionLabel>
              <h2 className="text-h2 text-gris-titre">
                Derniers articles
              </h2>
            </div>
            <Link href="/blog" className="btn-text self-start md:self-auto mb-2 md:mb-0">
              Tous les articles <IconArrowRight />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-[20px]">
            {displayArticles.map((item, i) => {
              const articleDate = item.published_at ? new Date(item.published_at).toLocaleDateString('fr-FR', {
                year: 'numeric', month: 'short', day: 'numeric'
              }) : "Récemment";

              return (
              <Link href={`/blog/${item.slug}`} key={i} className="block group">
                <Card className="card-blog p-0 h-full flex flex-col">
                  <div className="card-blog-image relative">
                    <div className="absolute top-4 left-4">
                      <Badge variant="category" className="bg-vert-pale text-vert-principal">{item.categorie || "Article"}</Badge>
                    </div>
                  </div>
                  <div className="card-blog-body flex flex-col flex-1">
                    <h3 className="font-heading font-[700] text-[15px] text-gris-titre leading-[1.4] mb-2">{item.titre}</h3>
                    <p className="font-sans text-[13px] text-gris-texte line-clamp-2 mb-4 flex-1">
                      {item.extrait}
                    </p>
                    <div className="font-sans text-[12px] text-gris-muted mt-auto pt-4 border-t border-[#f0f0f0]">
                      {articleDate} · 5 min de lecture
                    </div>
                  </div>
                </Card>
              </Link>
            )})}
          </div>
        </div>
      </section>

    </div>
  )
}
