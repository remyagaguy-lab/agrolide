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
import { EncocheCadre, Feuille, HORIZON_MASQUE_TERRE, Motif, Sillons } from "@/components/brand"
import { Users, Library, TrendingUp, MessageCircle, ArrowRight } from "@/components/ui/icons"
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
      {/* Un seul fond vert pour l'en-tête et les chiffres, séparés par un filet ; le motif ne couvre que l'en-tête. */}
      <div className="relative isolate overflow-hidden bg-surface-brand text-on-surface-brand">
      <section className="relative overflow-hidden py-0">
        {/* texture du motif sur le ciel vert de l'en-tête : la photo est découpée par l'horizon (masque), le motif continue jusqu'à la ligne ; les chiffres, dessous, sont sans motif */}
        <Motif size={800} opacity={0.05} className="text-on-surface-brand" />
        <div className="container relative z-10 pt-8 pb-8 md:flex md:min-h-[34rem] md:items-center md:py-14 lg:min-h-[38rem]">
          <div className="md:w-[44%] md:max-w-[34rem] md:-translate-y-8 lg:w-[46%] xl:w-[56%] xl:max-w-[40rem]">
            <h1 className="text-headline-md text-balance md:text-display-md">
              Fédérer la chaîne <br className="hidden xl:block" />agricole, pour conquérir <br className="hidden xl:block" />
              <span className="text-accent-sun xl:whitespace-nowrap">la souveraineté alimentaire</span>
            </h1>
            <p className="mt-3 text-body-md text-pretty text-on-surface-brand/90 md:mt-5 md:text-body-lg">
              Rejoignez le mouvement qui connecte, forme et propulse les acteurs de l&apos;agriculture africaine.
              {/* seulement sur petit téléphone (< 520 px), la phrase des publics est retirée : le sous-titre tient en 3 lignes et la photo apparaît à l'ouverture */}
              <span className="hidden min-[520px]:inline">
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
        <div className="relative z-0 [--horizon:4rem] sm:[--horizon:6rem] md:hidden">
          <div className="relative h-[340px]" style={masqueTerre}>
            <Image
              src="/hero-accueil-hd.webp"
              alt={ALT_HERO}
              fill
              priority
              sizes="(min-width: 768px) 0px, 135vw"
              quality={80}
              className="object-cover object-[78%_40%]"
            />
          </div>
        </div>

        {/* bureau : horizon vertical. La zone est un cadre « container query » ; le calque de masque a la taille du cadre tourné
            (longueur = hauteur de la zone, épaisseur = sa largeur), puis tourne de -90° autour du centre : la terre passe à droite.
            La zone est élargie de `--decale` vers la gauche (l'horizon recule) ; la photo garde sa taille et sa place : son cadre fait `100cqw - --decale`, ancré à droite, et on voit simplement plus de photo. */}
        <div className="absolute right-0 top-0 z-0 hidden h-full w-[calc(52%+3rem)] [--decale:3rem] [--horizon:6rem] [container-type:size] md:block lg:[--horizon:8rem] xl:w-[calc(46%+4.5rem)] xl:[--decale:4.5rem]">
          <div
            className="absolute left-1/2 top-1/2 h-[100cqw] w-[100cqh] -translate-x-1/2 -translate-y-1/2 -rotate-90"
            style={masqueTerre}
          >
            <div className="absolute left-1/2 top-[calc(50%+var(--decale)/2)] h-[100cqh] w-[calc(100cqw-var(--decale))] -translate-x-1/2 -translate-y-1/2 rotate-90">
              <Image
                src="/hero-accueil-hd.webp"
                alt={ALT_HERO}
                fill
                priority
                sizes="(min-width: 1280px) 70vw, 140vw"
                quality={90}
                className="object-cover object-[72%_20%]"
              />
            </div>
          </div>
        </div>

      </section>

      {/* ── CHIFFRES : même fond que l'en-tête (sans motif), sillons dans le coin haut droit ── */}
      <section className="relative overflow-hidden border-t border-on-surface-brand/15 py-0">
        <Sillons coin="haut-droite" opacite={0.08} className="w-[30%] md:w-[18rem]" />
        {/* les chiffres laissent le coin aux sillons : sous eux sur mobile, à gauche du coin sur bureau */}
        <div className="container relative z-10 pb-8 pt-20 md:py-8">
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
                <Library className="size-4" /> Guide Gratuit
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
                En savoir plus <ArrowRight className="size-4" aria-hidden />
              </Link>
            </div>

            {/* Colonne droite */}
            <EncocheCadre format="paysage" className="hidden md:block" fenetreClassName="bg-surface-container">
              <Image 
                src="/raison-detre.webp" 
                alt="Cohésion continentale en agriculture africaine" 
                fill 
                sizes="(max-width: 768px) 100vw, 45vw"
                className="object-cover"
              />
            </EncocheCadre>
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
                <Users aria-hidden="true" className="mb-4 size-6 text-primary" />
                <h3 className="text-title-lg text-on-surface mb-2">Mobilisation & Réseautage</h3>
                <p className="mb-6 text-body-md text-on-surface-variant">
                  Un annuaire exclusif pour fédérer les compétences, connecter les pairs et développer des synergies panafricaines.
                </p>
                <div className="inline-flex items-center gap-1.5 text-label-lg font-semibold text-primary underline decoration-transparent transition-colors hover:decoration-primary mt-auto">Découvrir <ArrowRight className="size-4" aria-hidden /></div>
              </Card>
            </Link>

            <Link href="/formations" className="block group">
              <Card variant="feature" className="flex h-full flex-col transition-shadow group-hover:shadow-elev-2">
                <Library aria-hidden="true" className="mb-4 size-6 text-primary" />
                <h3 className="text-title-lg text-on-surface mb-2">Formation & Insertion</h3>
                <p className="mb-6 text-body-md text-on-surface-variant">
                  Des programmes de renforcement de capacités techniques et managériales, ancrés dans les réalités du terrain africain.
                </p>
                <div className="inline-flex items-center gap-1.5 text-label-lg font-semibold text-primary underline decoration-transparent transition-colors hover:decoration-primary mt-auto">Découvrir <ArrowRight className="size-4" aria-hidden /></div>
              </Card>
            </Link>

            <Link href="/agrobusiness" className="block group">
              <Card variant="feature" className="flex h-full flex-col transition-shadow group-hover:shadow-elev-2">
                <TrendingUp aria-hidden="true" className="mb-4 size-6 text-primary" />
                <h3 className="text-title-lg text-on-surface mb-2">Agrobusiness & Consulting</h3>
                <p className="mb-6 text-body-md text-on-surface-variant">
                  Un accompagnement stratégique pour structurer vos projets, accéder aux financements et conquérir les marchés.
                </p>
                <div className="inline-flex items-center gap-1.5 text-label-lg font-semibold text-primary underline decoration-transparent transition-colors hover:decoration-primary mt-auto">Découvrir <ArrowRight className="size-4" aria-hidden /></div>
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
                  <MessageCircle aria-hidden="true" className="mb-6 size-6 text-primary" />
                  <h3 className="mb-4 text-headline-md text-on-surface">Espace d'échange agricole</h3>
                  <p className="mb-8 max-w-[400px] text-body-lg text-on-surface-variant">
                    Un véritable carrefour de discussion réunissant passionnés, professionnels et acteurs du secteur. Restez informé des dernières actualités et découvrez de nouvelles opportunités.
                  </p>
                  <Link href="/rejoindre" className="inline-flex w-fit items-center gap-2 text-label-lg text-primary underline decoration-transparent transition-colors hover:decoration-primary">
                    Rejoindre les discussions <ArrowRight className="size-4" aria-hidden />
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
                <Users aria-hidden="true" className="mb-6 size-6 text-primary" />
                <h3 className="mb-4 text-headline-sm text-on-surface">Annuaire Panafricain</h3>
                <p className="mb-8 text-body-md text-on-surface-variant">
                  Recherchez et connectez-vous avec des experts, des agronomes et des partenaires sur tout le continent.
                </p>
                <Link href="/annuaire" className="inline-flex items-center gap-2 text-label-lg text-on-tertiary-container underline decoration-transparent transition-colors hover:decoration-on-tertiary-container">
                  Explorer le réseau <ArrowRight className="size-4" aria-hidden />
                </Link>
              </div>
              <div className="relative h-[250px] md:h-[300px] w-full mt-auto bg-surface-container-lowest/40 overflow-hidden">
                <Image src="/plateforme-annuaire-ui.webp" alt="Annuaire Panafricain" fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover object-top border-t border-outline-variant transform group-hover:scale-[1.03] transition-transform duration-700" />
              </div>
            </div>

            {/* Bloc 3 : Bibliothèque (Moitié droite) */}
            <div className="lg:col-span-6 group bg-surface-container overflow-hidden rounded-panel border border-outline-variant transition-shadow duration-500 hover:shadow-elev-2 flex flex-col">
              <div className="p-10 flex-1">
                <Library aria-hidden="true" className="mb-6 size-6 text-primary" />
                <h3 className="mb-4 text-headline-sm text-on-surface">Bibliothèque de Ressources</h3>
                <p className="mb-8 text-body-md text-on-surface-variant">
                  Accédez à des centaines de documents techniques, thèses et guides pratiques spécifiquement adaptés aux sols africains.
                </p>
                <Link href="/bibliotheque" className="inline-flex items-center gap-2 text-label-lg text-primary underline decoration-transparent transition-colors hover:decoration-primary">
                  Consulter les guides <ArrowRight className="size-4" aria-hidden />
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
                quote: "L'accompagnement d'agrolide m'a aidé à passer de l'idée au marché en moins de six mois. Le réseau de mentors est exceptionnel." },
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
              Tous les articles <ArrowRight className="size-4" aria-hidden />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-[20px]">
            {displayArticles.map((item, i) => {
              const articleDate = item.published_at ? new Date(item.published_at).toLocaleDateString('fr-FR', {
                year: 'numeric', month: 'short', day: 'numeric'
              }) : "Récemment";
              
              const auteurName = item.profiles ? `${item.profiles.prenom} ${item.profiles.nom}` : (item.auteur_externe || "Équipe agrolide");

              return (
              <Link href={`/blog/${item.slug}`} key={i} className="block group">
                <Card className="p-0 h-full flex flex-col overflow-hidden">
                  <div className="p-3 pb-0">
                    <EncocheCadre fenetreClassName="bg-surface-container">
                      {item.image_une_url && (
                        <Image 
                          src={item.image_une_url} 
                          alt={item.titre} 
                          fill 
                          sizes="(max-width: 768px) 100vw, 33vw"
                          className="object-cover transition-transform duration-700 group-hover:scale-105" 
                        />
                      )}
                    </EncocheCadre>
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
