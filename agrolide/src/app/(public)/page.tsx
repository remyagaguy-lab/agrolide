import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { Metadata } from "next"
import { db } from "@/db"
import { articles, documents } from "@/db/schema"
import { eq, desc, count } from "drizzle-orm"
import { SectionLabel } from "@/components/ui/SectionLabel"
import { Card } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Users, BookOpen, TrendingUp, MessageSquare, Library } from "lucide-react"
import { Feuille, HORIZON_MASQUE_TERRE, Motif, Sillons } from "@/components/brand"

export const metadata: Metadata = {
  title: {
    absolute: "Réseau Agricole Africain | agrolide",
  },
  description: "Fédérer la chaîne agricole africaine pour conquérir la souveraineté alimentaire. Rejoignez le premier réseau agricole d'Afrique.",
  alternates: { canonical: '/' }
}

export const revalidate = 3600;

const ALT_HERO = "Une agricultrice souriante s'accroupit près d'un énorme chou dans son champ"
/** Masque de la terre (photo) selon l'horizon de l'emblème : la bande `--horizon` suit la ligne, le reste est plein. */
const masqueTerre: React.CSSProperties = {
  maskImage: `${HORIZON_MASQUE_TERRE}, linear-gradient(black, black)`,
  WebkitMaskImage: `${HORIZON_MASQUE_TERRE}, linear-gradient(black, black)`,
  maskSize: "100% var(--horizon), 100% calc(100% - var(--horizon) + 1px)",
  WebkitMaskSize: "100% var(--horizon), 100% calc(100% - var(--horizon) + 1px)",
  maskPosition: "top, bottom",
  WebkitMaskPosition: "top, bottom",
  maskRepeat: "no-repeat",
  WebkitMaskRepeat: "no-repeat",
}

const ROLES = ["Étudiants en agronomie", "Ingénieurs agronomes", "Chercheurs", "Entreprises agricoles", "Investisseurs"]
/** Nombre de ressources affiché si la base ne répond pas (dernier total connu). */
const RESSOURCES_PAR_DEFAUT = 273
const CHIFFRES = [
  { valeur: "1000", suffixe: "+", label: "Abonnés" },
  { valeur: "5", suffixe: " pays", label: "Pays africains" },
  { valeur: "__RESSOURCES__", suffixe: "+", label: "Ressources techniques" },
  { valeur: "100", suffixe: " %", label: "Dédiés à l’Afrique" },
]

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
  // Fetch 3 derniers articles publiés depuis Cloudflare D1
  let latestArticles: any[] = []
  try {
    // Seulement ce que les cartes affichent (pas le texte complet des articles).
    latestArticles = await db.select({
      id: articles.id,
      slug: articles.slug,
      titre: articles.titre,
      extrait: articles.extrait,
      categorie: articles.categorie,
      image_une_url: articles.image_une_url,
      published_at: articles.published_at,
      auteur_externe: articles.auteur_externe,
    }).from(articles)
      .where(eq(articles.statut, 'publie'))
      .orderBy(desc(articles.published_at))
      .limit(3)
  } catch (e) {
    console.error('Erreur fetch articles homepage:', e)
  }

  // Nombre de documents publiés de la bibliothèque : le chiffre suit les ajouts (page régénérée toutes les heures)
  let nbRessources = RESSOURCES_PAR_DEFAUT
  try {
    const [res] = await db.select({ value: count() }).from(documents).where(eq(documents.statut, 'publie'))
    if (res?.value) nbRessources = res.value
  } catch (e) {
    console.error('Erreur comptage ressources homepage:', e)
  }

  const fallbackArticles = [
    { slug: "pratiques-agroecologiques", categorie: "Production Végétal", titre: "Pratiques agroécologiques pour sols tropicaux", extrait: "Comment adapter les techniques de conservation des sols aux conditions climatiques de l'Afrique subsaharienne.", published_at: "2024-10-12T00:00:00Z" },
    { slug: "financer-projet-agricole", categorie: "Agrobusiness", titre: "Financer son projet agricole : les clés", extrait: "Tour d'horizon des instruments financiers accessibles aux agripreneurs africains en 2024.", published_at: "2024-10-05T00:00:00Z" },
    { slug: "competences-agronomes", categorie: "Agroeconomie", titre: "Compétences du futur pour les agronomes", extrait: "Panorama des formations techniques et managériales qui font la différence sur le terrain africain.", published_at: "2024-09-28T00:00:00Z" }
  ];

  const displayArticles = latestArticles && latestArticles.length > 0 ? latestArticles : fallbackArticles;

  return (
    <div className="flex flex-col min-h-screen">

      {/* ── HERO : le texte dans le ciel vert, la photo est la terre. Bureau : horizon VERTICAL (l'horizon de l'emblème tourné de 90°, terre à droite) ;
          mobile : horizon horizontal, la photo sous le texte. ── */}
      {/* Un seul fond vert et un seul motif pour l'en-tête et les chiffres : pas de rupture entre les deux. */}
      <div className="relative isolate overflow-hidden bg-surface-brand text-on-surface-brand">
        {/* texture du motif sur tout le ciel vert : la photo est découpée par l'horizon (masque), le motif continue jusqu'à la ligne */}
        <Motif size={800} opacity={0.05} className="text-on-surface-brand" />
      <section className="relative py-0">
        <div className="container relative z-10 pt-8 pb-8 md:flex md:min-h-[34rem] md:items-center md:py-14 lg:min-h-[38rem]">
          <div className="md:w-[44%] md:max-w-[34rem] lg:w-[46%] xl:w-[56%] xl:max-w-[40rem]">
            <h1 className="text-headline-md text-balance md:text-display-md">
              Fédérer la chaîne <br className="hidden xl:block" />agricole, pour conquérir <br className="hidden xl:block" />
              <span className="text-accent-sun xl:whitespace-nowrap">la souveraineté alimentaire</span>
            </h1>
            <p className="mt-3 text-body-md text-pretty text-on-surface-brand/90 md:mt-5 md:text-body-lg">
              Rejoignez le mouvement qui connecte, forme et propulse les acteurs de l&apos;agriculture africaine.
              {/* sur mobile, la phrase des publics est retirée : le sous-titre tient en 3 lignes et la photo apparaît à l'ouverture */}
              <span className="hidden md:inline">
                {" "}
                {ROLES.map((r, i) => (
                  <React.Fragment key={r}>
                    <strong className="font-bold text-accent-sun">{r}</strong>
                    {i < ROLES.length - 1 ? ", " : " "}
                  </React.Fragment>
                ))}
                : construisons ensemble l&apos;agriculture africaine que nous voulons.
              </span>
            </p>
            <div className="mt-6 grid grid-cols-2 gap-3 sm:flex sm:flex-wrap md:mt-8">
              <Button variant="primary" href="/rejoindre">Rejoindre le réseau</Button>
              <Button variant="ghost-dark" href="#actions">Nos actions</Button>
            </div>
          </div>
        </div>

        {/* mobile : horizon horizontal, la photo sous le texte */}
        <div className="relative h-[340px] [--horizon:4rem] sm:[--horizon:6rem] md:hidden" style={masqueTerre}>
          <Image
            src="/hero-accueil.webp"
            alt={ALT_HERO}
            fill
            priority
            sizes="(min-width: 768px) 0px, 100vw"
            className="object-cover object-[78%_40%]"
          />
        </div>

        {/* bureau : horizon vertical. La zone est un cadre « container query » ; le calque de masque a la taille du cadre tourné
            (longueur = hauteur de la zone, épaisseur = sa largeur), puis tourne de -90° autour du centre : la terre passe à droite. */}
        <div className="absolute right-0 top-0 hidden h-full w-[52%] [--horizon:6rem] lg:w-[52%] xl:w-[44%] [container-type:size] md:block lg:[--horizon:8rem]">
          <div
            className="absolute left-1/2 top-1/2 h-[100cqw] w-[100cqh] -translate-x-1/2 -translate-y-1/2 -rotate-90"
            style={masqueTerre}
          >
            <div className="absolute left-1/2 top-1/2 h-[100cqh] w-[100cqw] -translate-x-1/2 -translate-y-1/2 rotate-90">
              <Image
                src="/hero-accueil.webp"
                alt={ALT_HERO}
                fill
                priority
                sizes="(min-width: 1280px) 44vw, (min-width: 1024px) 52vw, (min-width: 768px) 52vw, 0px"
                className="object-cover object-[72%_20%]"
              />
            </div>
          </div>
        </div>

      </section>

      {/* ── CHIFFRES : même fond que l'en-tête, sillons dans le coin haut droit ── */}
      <section className="relative overflow-hidden py-0">
        <Sillons coin="haut-droite" opacite={0.08} className="w-[30%] md:w-[18rem]" />
        {/* les chiffres laissent le coin aux sillons : sous eux sur mobile, à gauche du coin sur bureau */}
        <div className="container relative z-10 pb-10 pt-24 md:py-14">
          <dl className="grid grid-cols-2 gap-x-6 gap-y-8 md:max-w-[52rem] md:grid-cols-4">
            {CHIFFRES.map((c) => (
              <div key={c.label} className="text-center md:text-left">
                <dt className="sr-only">{c.label}</dt>
                <dd className="text-display-md tabular-nums text-accent-sun">
                  {c.valeur === "__RESSOURCES__" ? nbRessources : c.valeur}<span className="text-headline-sm">{c.suffixe}</span>
                </dd>
                <dd aria-hidden="true" className="mt-1 text-label-md uppercase tracking-[0.08em] text-on-surface-brand/85">{c.label}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>
      </div>

      {/* ── LEAD MAGNET (CRO) ── */}
      <section className="bg-tertiary-container py-12 border-b border-tertiary/30">
        <div className="container">
          <div className="flex flex-col items-center justify-between gap-8 rounded-panel border border-outline-variant bg-surface-container-lowest p-8 shadow-elev-2 md:flex-row md:p-12">
            <div className="md:w-1/2">
              <div className="mb-4 inline-flex items-center gap-2 rounded-tag bg-tertiary-container px-3 py-1 text-label-sm uppercase tracking-[0.1em] text-on-tertiary-container">
                <BookOpen className="w-4 h-4" /> Guide Gratuit
              </div>
              <h2 className="mb-4 text-headline-md text-on-surface">
                Le Manuel de l'Agroécologie en Afrique de l'Ouest
              </h2>
              <p className="mb-6 text-body-lg text-on-surface-variant">
                Découvrez les 10 pratiques essentielles pour adapter vos cultures aux changements climatiques et augmenter vos rendements sans intrants chimiques.
              </p>
              <form className="flex flex-col sm:flex-row gap-3">
                <input 
                  type="email" 
                  placeholder="Votre adresse e-mail..."
                  aria-label="Votre adresse e-mail"
                  className="flex-1 rounded-control border border-outline bg-surface-container-lowest px-4 py-3 text-body-md text-on-surface focus:border-tertiary focus:outline-none focus:ring-2 focus:ring-tertiary"
                  required
                />
                <Button type="submit" variant="primary">Recevoir le PDF</Button>
              </form>
            </div>
            <div className="md:w-1/3 flex justify-center relative">
              <div className="relative h-64 w-48 rotate-3 overflow-hidden rounded-card border-4 border-surface-container-lowest bg-surface-container-high shadow-elev-3 transition-transform duration-300 hover:rotate-0">
                <Image src="/hero-background.webp" alt="Couverture du guide" fill sizes="250px" className="object-cover" />
                <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-b from-surface-brand/10 to-surface-brand/90 p-4">
                  <div className="mb-1 text-title-md uppercase text-on-surface-brand">Manuel pratique</div>
                  <div className="text-label-md text-accent-sun">Agroécologie</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── RAISON D'ÊTRE ── */}
      <section className="bg-surface border-b border-outline-variant">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-[55%_1fr] gap-[48px] items-start">
            {/* Colonne gauche */}
            <div>
              <SectionLabel>Notre raison d'être</SectionLabel>
              <h2 className="text-headline-md mb-6">
                Transformer la fragmentation en{" "}
                <span className="text-primary">cohésion continentale</span>
              </h2>
              <p className="text-body-lg mb-4">
                L'agriculture représente jusqu'à 40 % du PIB africain et emploie la majorité de notre population active. Pourtant, les acteurs de la chaîne de valeur évoluent de manière fragmentée, sans cadre de collaboration pérenne.
              </p>
              <p className="text-body-lg mb-8">
                agrolide est né d'une ambition collective : doter l'Afrique d'un écosystème professionnel intégré, capable de mobiliser les ressources, renforcer les compétences et incuber les projets qui feront notre souveraineté alimentaire.
              </p>
              <Link href="/qui-sommes-nous" className="inline-flex items-center gap-1.5 text-label-lg font-semibold text-primary underline decoration-transparent transition-colors hover:decoration-primary">
                En savoir plus <IconArrowRight />
              </Link>
            </div>

            {/* Colonne droite */}
            <div className="hidden md:block relative bg-surface-container rounded-card aspect-[4/3] overflow-hidden shadow-lg">
              <Image 
                src="/raison-detre.webp" 
                alt="Cohésion continentale en agriculture africaine" 
                fill 
                sizes="(max-width: 768px) 100vw, 45vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── LES 4 FREINS ── layout horizontal inspiré template Features ── */}
      <section className="bg-surface-container-low border-b border-outline-variant">
        <div className="container">
          <div className="text-center max-w-[640px] mx-auto mb-12">
            <SectionLabel className="mx-auto flex justify-center text-center">Constat</SectionLabel>
            <h2 className="text-headline-md text-on-surface">
              L'agriculture africaine face à 4 freins majeurs
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <div className="mb-3 text-label-sm tracking-[0.1em] text-primary">01</div>
              <h3 className="text-title-lg text-on-surface mb-2">Isolement professionnel</h3>
              <p className="text-body-md text-on-surface-variant">
                Peu de réseaux solides permettent aux agronomes d'échanger et de collaborer efficacement sur le continent africain.
              </p>
            </Card>
            <Card>
              <div className="mb-3 text-label-sm tracking-[0.1em] text-primary">02</div>
              <h3 className="text-title-lg text-on-surface mb-2">Documentation inadaptée</h3>
              <p className="text-body-md text-on-surface-variant">
                La quasi-totalité des ressources techniques ignore les réalités climatiques et pédologiques propres à l'Afrique.
              </p>
            </Card>
            <Card>
              <div className="mb-3 text-label-sm tracking-[0.1em] text-primary">03</div>
              <h3 className="text-title-lg text-on-surface mb-2">Déficit d'accompagnement</h3>
              <p className="text-body-md text-on-surface-variant">
                Trop d'agripreneurs avancent sans mentorat, sans accès aux marchés et sans financement structuré.
              </p>
            </Card>
            <Card>
              <div className="mb-3 text-label-sm tracking-[0.1em] text-primary">04</div>
              <h3 className="text-title-lg text-on-surface mb-2">Recherche sous-valorisée</h3>
              <p className="text-body-md text-on-surface-variant">
                Des milliers de thèses africaines restent inaccessibles et non appliquées sur le terrain.
              </p>
            </Card>
          </div>

          <p className="mx-auto mt-8 max-w-[44rem] text-balance text-center text-title-md text-on-surface">
            agrolide a été fondé pour briser ces quatre barrières simultanément et débloquer le potentiel de notre continent.
          </p>
        </div>
      </section>

      {/* ── 3 DOMAINES D'ACTIVITÉ ── */}
      <section id="actions" className="bg-surface-container-lowest">
        <div className="container">
          <div className="text-center mb-12">
            <SectionLabel className="mx-auto flex justify-center text-center">Notre approche</SectionLabel>
            <h2 className="text-headline-md text-on-surface">
              Un écosystème intégré en 3 piliers d'action
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-[20px]">
            <Link href="/annuaire" className="block group">
              <Card variant="feature" className="flex h-full flex-col transition-shadow group-hover:shadow-elev-2">
                <Users aria-hidden="true" className="mb-4 size-10 text-primary" strokeWidth={1.75} />
                <h3 className="text-title-lg text-on-surface mb-2">Mobilisation & Réseautage</h3>
                <p className="mb-6 text-body-md text-on-surface-variant">
                  Un annuaire exclusif pour fédérer les compétences, connecter les pairs et développer des synergies panafricaines.
                </p>
                <div className="inline-flex items-center gap-1.5 text-label-lg font-semibold text-primary underline decoration-transparent transition-colors hover:decoration-primary mt-auto">Découvrir <IconArrowRight /></div>
              </Card>
            </Link>

            <Link href="/formations" className="block group">
              <Card variant="feature" className="flex h-full flex-col transition-shadow group-hover:shadow-elev-2">
                <BookOpen aria-hidden="true" className="mb-4 size-10 text-primary" strokeWidth={1.75} />
                <h3 className="text-title-lg text-on-surface mb-2">Formation & Insertion</h3>
                <p className="mb-6 text-body-md text-on-surface-variant">
                  Des programmes de renforcement de capacités techniques et managériales, ancrés dans les réalités du terrain africain.
                </p>
                <div className="inline-flex items-center gap-1.5 text-label-lg font-semibold text-primary underline decoration-transparent transition-colors hover:decoration-primary mt-auto">Découvrir <IconArrowRight /></div>
              </Card>
            </Link>

            <Link href="/agrobusiness" className="block group">
              <Card variant="feature" className="flex h-full flex-col transition-shadow group-hover:shadow-elev-2">
                <TrendingUp aria-hidden="true" className="mb-4 size-10 text-primary" strokeWidth={1.75} />
                <h3 className="text-title-lg text-on-surface mb-2">Agrobusiness & Consulting</h3>
                <p className="mb-6 text-body-md text-on-surface-variant">
                  Un accompagnement stratégique pour structurer vos projets, accéder aux financements et conquérir les marchés.
                </p>
                <div className="inline-flex items-center gap-1.5 text-label-lg font-semibold text-primary underline decoration-transparent transition-colors hover:decoration-primary mt-auto">Découvrir <IconArrowRight /></div>
              </Card>
            </Link>
          </div>
        </div>
      </section>
      {/* ── SECTION PLATEFORME (BENTO GRID) ── */}
      <section className="bg-surface-container-low">

        <div className="container relative z-10">
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-headline-md text-on-surface mb-4">
              L'écosystème <span className="text-primary">complet</span>
            </h2>
            <p className="text-body-lg text-on-surface-variant">
              Une plateforme innovante au service de la mutualisation des ressources entre les acteurs de la chaîne de valeur agricole africaine.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Bloc 1 : Espace d'échange (Pleine largeur sur grand écran) */}
            <div className="lg:col-span-12 group bg-primary-container overflow-hidden rounded-panel border border-outline-variant transition-shadow duration-500 hover:shadow-elev-2">
              <div className="grid grid-cols-1 lg:grid-cols-2 h-full">
                <div className="p-10 md:p-16 flex flex-col justify-center">
                  <MessageSquare aria-hidden="true" className="mb-6 size-10 text-primary" strokeWidth={1.75} />
                  <h3 className="mb-4 text-headline-md text-on-surface">Espace d'échange agricole</h3>
                  <p className="mb-8 max-w-[400px] text-body-lg text-on-surface-variant">
                    Un véritable carrefour de discussion réunissant passionnés, professionnels et acteurs du secteur. Restez informé des dernières actualités et découvrez de nouvelles opportunités.
                  </p>
                  <Link href="/rejoindre" className="inline-flex w-fit items-center gap-2 text-label-lg text-primary underline decoration-transparent transition-colors hover:decoration-primary">
                    Rejoindre les discussions <IconArrowRight />
                  </Link>
                </div>
                <div className="relative min-h-[300px] lg:min-h-[400px] bg-surface-container-lowest/40 overflow-hidden">
                  <Image src="/plateforme-forum-ui.webp" alt="Espace d'échange" fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover object-left-top lg:rounded-tl-panel lg:border-l lg:border-t border-outline-variant shadow-sm transform group-hover:-translate-y-2 group-hover:-translate-x-2 transition-transform duration-700" />
                </div>
              </div>
            </div>

            {/* Bloc 2 : Annuaire (Moitié gauche) */}
            <div className="lg:col-span-6 group bg-tertiary-container overflow-hidden rounded-panel border border-outline-variant transition-shadow duration-500 hover:shadow-elev-2 flex flex-col">
              <div className="p-10 flex-1">
                <Users aria-hidden="true" className="mb-6 size-10 text-primary" strokeWidth={1.75} />
                <h3 className="mb-4 text-headline-sm text-on-surface">Annuaire Panafricain</h3>
                <p className="mb-8 text-body-md text-on-surface-variant">
                  Recherchez et connectez-vous avec des experts, des agronomes et des partenaires sur tout le continent.
                </p>
                <Link href="/annuaire" className="inline-flex items-center gap-2 text-label-lg text-on-tertiary-container underline decoration-transparent transition-colors hover:decoration-on-tertiary-container">
                  Explorer le réseau <IconArrowRight />
                </Link>
              </div>
              <div className="relative h-[250px] md:h-[300px] w-full mt-auto bg-surface-container-lowest/40 overflow-hidden">
                <Image src="/plateforme-annuaire-ui.webp" alt="Annuaire Panafricain" fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover object-top border-t border-outline-variant transform group-hover:scale-[1.03] transition-transform duration-700" />
              </div>
            </div>

            {/* Bloc 3 : Bibliothèque (Moitié droite) */}
            <div className="lg:col-span-6 group bg-surface-container overflow-hidden rounded-panel border border-outline-variant transition-shadow duration-500 hover:shadow-elev-2 flex flex-col">
              <div className="p-10 flex-1">
                <Library aria-hidden="true" className="mb-6 size-10 text-primary" strokeWidth={1.75} />
                <h3 className="mb-4 text-headline-sm text-on-surface">Bibliothèque de Ressources</h3>
                <p className="mb-8 text-body-md text-on-surface-variant">
                  Accédez à des centaines de documents techniques, thèses et guides pratiques spécifiquement adaptés aux sols africains.
                </p>
                <Link href="/bibliotheque" className="inline-flex items-center gap-2 text-label-lg text-primary underline decoration-transparent transition-colors hover:decoration-primary">
                  Consulter les guides <IconArrowRight />
                </Link>
              </div>
              <div className="relative h-[250px] md:h-[300px] w-full mt-auto bg-surface-container-lowest/40 overflow-hidden">
                <Image src="/plateforme-bibliotheque-ui.webp" alt="Bibliothèque de Ressources" fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover object-top border-t border-outline-variant transform group-hover:scale-[1.03] transition-transform duration-700" />
              </div>
            </div>

          </div>
        </div>
      </section>



      {/* ── TÉMOIGNAGES ── */}
      <section className="bg-surface-container-low">
        <div className="container">
          <div className="mb-12 text-center">
            <SectionLabel className="mx-auto flex justify-center text-center">Témoignages</SectionLabel>
            <h2 className="text-headline-md text-on-surface">
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
                <Feuille className="mt-1 w-6 text-accent-leaf" />
                <p className="mt-4 flex-1 font-baskerville text-body-md italic text-on-surface-variant">
                  {t.quote}
                </p>
                <div className="border-t border-outline-variant mt-4 pt-4 flex items-center gap-3">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary-container text-label-md text-on-primary-container">
                    {t.initials}
                  </div>
                  <div className="flex flex-col">
                    <div className="text-title-sm text-on-surface">{t.name}</div>
                    <div className="mt-0.5 text-body-sm text-on-surface-muted">{t.role} · {t.country}</div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION BLOG ── */}
      <section className="bg-surface-container-lowest">
        <div className="container">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
            <div>
              <SectionLabel>Ressources</SectionLabel>
              <h2 className="text-headline-md text-on-surface">
                Derniers articles
              </h2>
            </div>
            <Link href="/blog" className="inline-flex items-center gap-1.5 text-label-lg font-semibold text-primary underline decoration-transparent transition-colors hover:decoration-primary self-start md:self-auto mb-2 md:mb-0">
              Tous les articles <IconArrowRight />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-[20px]">
            {displayArticles.map((item, i) => {
              const articleDate = item.published_at ? new Date(item.published_at).toLocaleDateString('fr-FR', {
                year: 'numeric', month: 'short', day: 'numeric'
              }) : "Récemment";
              
              const auteurName = item.profiles ? `${item.profiles.prenom} ${item.profiles.nom}` : (item.auteur_externe || "Équipe Agrolide");

              return (
              <Link href={`/blog/${item.slug}`} key={i} className="block group">
                <Card className="p-0 h-full flex flex-col overflow-hidden">
                  <div className="relative w-full h-48 bg-surface-container">
                    {item.image_une_url && (
                      <Image 
                        src={item.image_une_url} 
                        alt={item.titre} 
                        fill 
                        className="object-cover transition-transform duration-700 group-hover:scale-105" 
                      />
                    )}
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <p className="mb-2 flex items-center gap-1.5 text-label-sm uppercase tracking-[0.08em] text-primary">
                      <Feuille className="w-3 text-accent-leaf" />{item.categorie || "Article"}
                    </p>
                    <h3 className="mb-2 text-title-md text-on-surface transition-colors group-hover:text-primary">{item.titre}</h3>
                    <p className="mb-4 line-clamp-2 flex-1 text-body-sm text-on-surface-variant">
                      {item.extrait}
                    </p>
                    <div className="mt-auto flex items-center justify-between border-t border-outline-variant pt-4 text-body-sm text-on-surface-variant">
                      <span className="font-medium">{articleDate} · 5 min</span>
                      <span className="font-medium text-on-surface-variant truncate max-w-[120px]">Par {auteurName}</span>
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
