import Link from "next/link"
import Image from "next/image"
import { Metadata } from "next"
import { SectionLabel } from "@/components/ui/SectionLabel"
import { Card } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"
import { Button } from "@/components/ui/Button"
import { Users, BookOpen, TrendingUp } from "lucide-react"

export const metadata: Metadata = {
  title: "Accueil",
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

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">

      {/* ── HERO ─────────────────────────────────── */}
      <section className="bg-[#1b5e38] relative overflow-hidden">
        {/* Image de fond avec dégradé */}
        <div className="absolute top-0 right-0 w-full md:w-1/2 h-full pointer-events-none z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-[#1b5e38] via-[#1b5e38]/80 to-[#1b5e38]/60 md:via-[#1b5e38]/40 md:to-transparent z-10" />
          <Image
            src="/hero-background.jpg"
            alt="Agriculture africaine"
            fill
            priority
            className="object-cover object-[center_80%] opacity-100"
          />
        </div>

        <div className="max-w-[1100px] mx-auto px-6 pt-[40px] pb-0 md:pt-[60px] relative z-20">
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
      <section className="bg-blanc border-b border-gris-border !py-[28px]">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-gris-border">
            <div className="py-4 md:py-0 text-center">
              <div className="font-heading font-[900] text-[36px] text-vert-profond leading-none mb-1">
                500<span className="font-[400] text-[18px] text-vert-principal">+</span>
              </div>
              <div className="font-heading font-[600] text-[11px] text-gris-muted uppercase tracking-[0.07em]">Membres actifs</div>
            </div>
            <div className="py-4 md:py-0 text-center">
              <div className="font-heading font-[900] text-[36px] text-vert-profond leading-none mb-1">
                5<span className="font-[400] text-[18px] text-vert-principal"> pays</span>
              </div>
              <div className="font-heading font-[600] text-[11px] text-gris-muted uppercase tracking-[0.07em]">Pays africains</div>
            </div>
            <div className="py-4 md:py-0 text-center">
              <div className="font-heading font-[900] text-[36px] text-vert-profond leading-none mb-1">
                700<span className="font-[400] text-[18px] text-vert-principal">+</span>
              </div>
              <div className="font-heading font-[600] text-[11px] text-gris-muted uppercase tracking-[0.07em]">Ressources techniques</div>
            </div>
            <div className="py-4 md:py-0 text-center">
              <div className="font-heading font-[900] text-[36px] text-vert-profond leading-none mb-1">
                100<span className="font-[400] text-[18px] text-vert-principal">%</span>
              </div>
              <div className="font-heading font-[600] text-[11px] text-gris-muted uppercase tracking-[0.07em]">Dédiés à l'Afrique</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── RAISON D'ÊTRE ── */}
      <section className="bg-blanc">
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
            <div className="hidden md:flex bg-gris-light rounded-card aspect-[4/3] items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#c0c0bc" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-image">
                <rect width="18" height="18" x="3" y="3" rx="2" ry="2"/>
                <circle cx="9" cy="9" r="2"/>
                <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* ── LES 4 FREINS ── layout horizontal inspiré template Features ── */}
      <section className="bg-gris-fond">
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
      <section id="actions" className="bg-blanc">
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
      {/* ── SECTION PLATEFORME ── */}
      <section className="bg-[#0f1f17] py-[96px]">
        <div className="container">
          {/* Header */}
          <div className="text-center mb-16">
            <SectionLabel className="mx-auto flex justify-center text-center !bg-[#1a2e22] !text-[#50a853] !border-[rgba(80,168,83,0.2)]">La plateforme</SectionLabel>
            <h2 className="text-h2 text-white">
              L'outil au service de votre croissance
            </h2>
          </div>

          <div className="flex flex-col">
            {/* Bloc 1 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-[48px] items-center pb-[64px] border-b border-[rgba(255,255,255,0.08)] mb-[64px]">
              <div>
                <div className="font-heading font-[900] text-[48px] text-[rgba(255,255,255,0.06)] leading-none mb-2">01</div>
                <h3 className="text-h3 text-white mb-4">Dashboard & Suivi</h3>
                <p className="text-[15px] text-[rgba(255,255,255,0.65)] leading-[1.65] mb-6">
                  Pilotez votre activité, suivez vos candidatures et gérez vos formations depuis une interface centralisée et intuitive.
                </p>
                <Link href="/dashboard" className="btn-text !text-[#50a853]">En savoir plus <IconArrowRight /></Link>
              </div>
              <div className="card-dark aspect-video bg-[#1a2e22] border border-[rgba(255,255,255,0.1)] rounded-[10px] flex items-center justify-center">
                <span className="font-heading font-[600] text-white">Dashboard</span>
              </div>
            </div>

            {/* Bloc 2 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-[48px] items-center pb-[64px] border-b border-[rgba(255,255,255,0.08)] mb-[64px]">
              <div className="order-2 md:order-1 card-dark aspect-video bg-[#1a2e22] border border-[rgba(255,255,255,0.1)] rounded-[10px] flex items-center justify-center">
                <span className="font-heading font-[600] text-white">Annuaire Réseau</span>
              </div>
              <div className="order-1 md:order-2">
                <div className="font-heading font-[900] text-[48px] text-[rgba(255,255,255,0.06)] leading-none mb-2">02</div>
                <h3 className="text-h3 text-white mb-4">Annuaire Panafricain</h3>
                <p className="text-[15px] text-[rgba(255,255,255,0.65)] leading-[1.65] mb-6">
                  Recherchez et connectez-vous avec des experts, des agronomes et des partenaires sur tout le continent grâce à des filtres avancés.
                </p>
                <Link href="/annuaire" className="btn-text !text-[#50a853]">En savoir plus <IconArrowRight /></Link>
              </div>
            </div>

            {/* Bloc 3 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-[48px] items-center pb-[64px] border-b border-[rgba(255,255,255,0.08)]">
              <div>
                <div className="font-heading font-[900] text-[48px] text-[rgba(255,255,255,0.06)] leading-none mb-2">03</div>
                <h3 className="text-h3 text-white mb-4">Bibliothèque de Ressources</h3>
                <p className="text-[15px] text-[rgba(255,255,255,0.65)] leading-[1.65] mb-6">
                  Accédez à des centaines de documents techniques, thèses et guides pratiques spécifiquement adaptés aux sols africains.
                </p>
                <Link href="/bibliotheque" className="btn-text !text-[#50a853]">En savoir plus <IconArrowRight /></Link>
              </div>
              <div className="card-dark aspect-video bg-[#1a2e22] border border-[rgba(255,255,255,0.1)] rounded-[10px] flex items-center justify-center">
                <span className="font-heading font-[600] text-white">Bibliothèque</span>
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
            {[
              { tag: "Agronomie", title: "Pratiques agroécologiques pour sols tropicaux", desc: "Comment adapter les techniques de conservation des sols aux conditions climatiques de l'Afrique subsaharienne.", date: "12 Oct 2024", readTime: "5 min" },
              { tag: "Agrobusiness", title: "Financer son projet agricole : les clés", desc: "Tour d'horizon des instruments financiers accessibles aux agripreneurs africains en 2024.", date: "05 Oct 2024", readTime: "8 min" },
              { tag: "Formation", title: "Compétences du futur pour les agronomes", desc: "Panorama des formations techniques et managériales qui font la différence sur le terrain africain.", date: "28 Sep 2024", readTime: "4 min" },
            ].map((item, i) => (
              <Link href="#" key={i} className="block group">
                <Card className="card-blog p-0 h-full flex flex-col">
                  <div className="card-blog-image relative">
                    <div className="absolute top-4 left-4">
                      <Badge variant="category" className="bg-vert-pale text-vert-principal">{item.tag}</Badge>
                    </div>
                  </div>
                  <div className="card-blog-body flex flex-col flex-1">
                    <h3 className="font-heading font-[700] text-[15px] text-gris-titre leading-[1.4] mb-2">{item.title}</h3>
                    <p className="font-sans text-[13px] text-gris-texte line-clamp-2 mb-4 flex-1">
                      {item.desc}
                    </p>
                    <div className="font-sans text-[12px] text-gris-muted mt-auto pt-4 border-t border-[#f0f0f0]">
                      {item.date} · {item.readTime} de lecture
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA FINAL ── */}
      <section className="bg-[#1b5e38] py-[96px] text-center">
        <div className="container flex flex-col items-center">
          <h2 className="font-heading font-[900] text-[clamp(24px,4vw,36px)] text-white leading-[1.2] max-w-[520px] mx-auto mb-4">
            Prêt à participer à la conquête de la souveraineté alimentaire ?
          </h2>
          <p className="font-sans font-[400] text-[14px] text-[rgba(255,255,255,0.6)] mb-[28px]">
            Annuaire · Formations · Agrobusiness · Bibliothèque · Événements
          </p>
          <Button variant="primary" href="/rejoindre">
            Rejoindre le réseau <IconArrowRight />
          </Button>
        </div>
      </section>

    </div>
  )
}
