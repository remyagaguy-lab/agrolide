import { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { buttonVariants } from "@/components/ui/Button"
import { Card } from "@/components/ui/Card"
import { PageHero } from "@/components/ui/PageHero"
import { Section } from "@/components/ui/Section"
import { ValueCard } from "@/components/ui/ValueCard"
import { SectionLabel } from "@/components/ui/SectionLabel"
import { Emblem, EnchochePhoto, Motif } from "@/components/brand"

import { Users, Flag, Star, Lightbulb, Target, ArrowRight } from "@/components/ui/icons"
export const metadata: Metadata = {
  title: "Qui sommes-nous ?",
  description: "Découvrez l'histoire, la mission et les valeurs d'agrolide. Apprenez comment notre réseau agricole continental rassemble les acteurs de l'agriculture africaine.",
  alternates: { canonical: '/qui-sommes-nous' }
}

const freins = [
  { titre: "...de connexion entre les professionnels.", texte: "Faute de réseaux agricoles structurés, des étudiants brillants terminent leurs études sans savoir à quelle porte frapper. Les professionnels travaillent en vase clos et reproduisent des erreurs que d'autres ont déjà surmontées." },
  { titre: "...d'accompagnement entrepreneurial et visibilité.", texte: "De nombreux jeunes diplômés et porteurs de projets manquent de mentorat, d'accès au financement et de compétences pratiques. Même les entrepreneurs les plus talentueux restent invisibles, faute de réseaux structurés." },
  { titre: "...de documentation adaptée à nos réalités.", texte: "La quasi-totalité des ressources techniques disponibles a été conçue pour des contextes occidentaux. Elle ne répond pas aux contraintes spécifiques de l'agriculture africaine : sols tropicaux, variabilité climatique, marchés informels." },
  { titre: "...de passerelles entre la recherche et le terrain.", texte: "Des milliers de thèses et mémoires agronomiques sont produits chaque année dans les universités africaines et ne parviennent jamais aux producteurs. Les solutions existent, mais elles dorment dans les tiroirs." },
]

const etapes = [
  { date: "21 Octobre 2025", text: "Création du groupe WhatsApp \"Bibliothèque Agricole\"", colorClass: "text-primary", borderClass: "border-primary" },
  { date: "26 Novembre 2025", text: "Début des réflexions pour trouver des solutions défis du monde agricole", colorClass: "text-on-tertiary-container", borderClass: "border-accent-sun" },
  { date: "2 Déc. 2025", text: "La \"Bibliothèque Agricole\" devient BIFERA, ex-nom d'agrolide", colorClass: "text-on-surface", borderClass: "border-on-surface" },
  { date: "20 Déc. 2025", text: "Premier webinaire sur la gestion de projet agricole", colorClass: "text-primary", borderClass: "border-primary" },
  { date: "Janvier 2026", text: "Mise en place d'une équipe d'appui", colorClass: "text-on-tertiary-container", borderClass: "border-accent-sun" },
  { date: "31 Janvier 2026", text: "2ème Webinaire sur la commercialisation des produits agricoles", colorClass: "text-primary", borderClass: "border-primary" },
  { date: "Février à avril 2026", text: "Structuration de BIFERA (ex-nom d'agrolide) en un réseau : Gouvernance, activités stratégiques, pilotes...", colorClass: "text-on-surface", borderClass: "border-on-surface" },
  { date: "Mai à juin 2026", text: "Relance des activités : le réseau, anciennement BIFERA, devient agrolide", colorClass: "text-on-tertiary-container", borderClass: "border-accent-sun" },
  { date: "Juil à Déc. 2026", text: "Mise en place de l'organe de gouvernance, création formelle et lancement officiel des activités du réseau agrolide", colorClass: "text-on-surface", borderClass: "border-on-surface" },
]

const equipe = [
  { name: "M. Remyaga Guy KOUMANTEGA", role: "Fondateur du Réseau agrolide", bullets: ["Ingénieur des travaux agricoles", "Social Média Manager", "Créateur de contenu Business"], image: "/equipe/Remyaga%20Guy%20KOUMANTEGA.jpg" },
  { name: "M. Antoine AHONDO", role: "Community & Programs Manager", bullets: ["Ingénieur des travaux agricoles"], image: "/equipe/Antoine%20AHONDO.jpg" },
  { name: "Mlle. Saratou NAYA", role: "Responsable Partenariat et événementiel", bullets: ["Agroéconomiste en formation"], image: "/equipe/Saratou%20NAYA.jpg" },
  { name: "À pourvoir", role: "Responsable Affaires Juridiques et Administration", bullets: ["Poste à pourvoir"], image: "" },
  { name: "À pourvoir", role: "Responsable Marketing et Communication", bullets: ["Poste à pourvoir"], image: "" },
  { name: "À pourvoir", role: "Responsable Finance et Logistique", bullets: ["Poste à pourvoir"], image: "" },
  { name: "À pourvoir", role: "Responsable Contrôle Qualité et Reporting", bullets: ["Poste à pourvoir"], image: "" },
]

const valeurs = [
  { icon: Users, title: "Solidarité", desc: "Le réseau est notre première ressource. La réussite de chacun passe par la force du collectif et la mutualisation des compétences entre membres." },
  { icon: Flag, title: "Leadership", desc: "agrolide forge des leaders agricoles. Chaque acteur accompagné est un futur moteur de la chaîne agricole et de la souveraineté alimentaire africaine." },
  { icon: Star, title: "Excellence", desc: "Rigueur et professionnalisme dans chaque formation, chaque accompagnement et chaque service proposé aux membres." },
  { icon: Lightbulb, title: "Innovation africaine", desc: "Des solutions pensées pour et par les réalités africaines, adaptées aux terroirs, aux marchés et aux contraintes du continent." },
  { icon: Target, title: "Impact", desc: "Chaque action est évaluée à l'aune de sa contribution concrète à la souveraineté alimentaire africaine." },
]

export default function QuiSommesNousPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <PageHero
        nextTone="container"
        label="Qui sommes-nous"
        title={<>Qui sommes-nous&nbsp;?</>}
        description="Découvrez l'histoire, la mission et les valeurs qui animent le premier réseau continental de l'agriculture africaine."
      />

      {/* ── LE PARADOXE ───────────────────────────── */}
      <section className="bg-primary-container py-14 md:py-20">
        <div className="container">
          <div className="text-center mb-12 md:mb-16">
            <SectionLabel className="mx-auto flex justify-center text-center">Le paradoxe</SectionLabel>
            <h2 className="text-headline-md text-primary">
              Pourquoi le réseau agrolide&nbsp;?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
            <p className="text-body-lg text-on-surface font-medium">
              L'Afrique possède <strong className="text-primary font-extrabold">60 % des terres arables non exploitées</strong> de la planète. Elle abrite des milliers de techniciens et d'ingénieurs agronomes, des chercheurs passionnés, des entrepreneurs audacieux et des producteurs tenaces...
            </p>

            <Card variant="elevated" className="relative mt-4 md:mt-0">
              <span aria-hidden="true" className="absolute -left-3 -top-5 flex size-14 -rotate-12 items-center justify-center rounded-full bg-accent-sun text-headline-sm text-on-accent shadow-elev-2">
                ?
              </span>
              <p className="text-body-md text-on-surface-variant mb-6">
                Et pourtant... elle n'arrive pas encore à nourrir tous ses enfants, elle dépense <strong className="text-on-tertiary-container font-extrabold underline decoration-accent-sun/30 decoration-4">65 milliards de dollars par an</strong> pour importer sa nourriture. Une dépendance en hausse depuis 3 ans consécutifs.
              </p>
              <div className="rounded-control border border-outline-variant bg-surface-container-low p-4 text-center">
                <p className="text-title-md text-on-surface">
                  Ce n'est pas un manque de talent, ni un manque de savoir.
                </p>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* ── LES 4 FREINS ───────────────────────────── */}
      <Section tone="low" centered title="C'est un manque...">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {freins.map((f, i) => (
            <Card key={f.titre} interactive className="group relative overflow-hidden">
              <span aria-hidden="true" className="absolute inset-y-0 left-0 w-1 bg-accent-leaf opacity-0 transition-opacity group-hover:opacity-100" />
              <p className="mb-3 text-label-sm uppercase tracking-[0.1em] text-primary">{String(i + 1).padStart(2, "0")}</p>
              <h3 className="text-title-lg text-on-surface mb-2">{f.titre}</h3>
              <p className="text-body-sm text-on-surface-variant">{f.texte}</p>
            </Card>
          ))}
        </div>
      </Section>

      {/* ── NOTRE HISTOIRE (photo en encoche solaire : une seule par écran) ──────────────────────────── */}
      <section className="bg-surface-container-low pb-14 md:pb-20">
        <div className="container grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-14">
          <div className="order-2 lg:order-1">
            <SectionLabel>Notre histoire</SectionLabel>
            <h2 className="text-headline-md text-primary mb-5">Né d'un geste simple : partager</h2>
            <div className="space-y-4 text-body-lg text-on-surface-variant">
              <p>
                <strong className="text-on-surface">agrolide</strong> est né d'un geste simple : <strong className="text-primary">celui de partager</strong>.
                Tout a commencé avec <strong className="text-on-surface">«La Bibliothèque de l'Agronome»</strong>, une communauté virtuelle, spontanée, où étudiants, professionnels et entrepreneurs du domaine agricole de tous horizons partageaient librement leurs savoirs, leurs expériences, leurs ressources.
              </p>
              <p>
                Ce signal était clair : <strong className="text-on-surface">la demande existait et la volonté aussi.</strong> Il ne manquait qu'une structure pour lui donner toute sa puissance. C'est précisément ce que nous avons décidé de construire.
              </p>
            </div>
          </div>
          <div className="order-1 lg:order-2">
            <EnchochePhoto
              src="/raison-detre.webp"
              alt="Une équipe d'agronomes en polos verts et jaunes consulte une tablette au milieu d'un champ"
              className="mx-auto max-w-[520px] lg:max-w-none"
            />
          </div>
        </div>
      </section>

      {/* ── LA SOLUTION ──────────────────────────── */}
      <section className="bg-surface-container-low pb-14 md:pb-20">
        <div className="container">
          <Card variant="dark" className="relative overflow-hidden bg-surface-brand p-8 md:p-12">
            <Motif size={400} opacity={0.05} className="text-on-surface-brand" />
            <div className="relative z-10 grid gap-8 md:grid-cols-2 md:items-center md:gap-12">
              <div>
                <h2 className="text-headline-md mb-4">Un Réseau comme solution...</h2>
                <p className="text-body-lg text-on-surface-brand/90">
                  Et si la solution à ces défis n'était pas une nouvelle technologie... <strong className="text-accent-sun">mais un réseau ?</strong>
                </p>
              </div>
              <div className="rounded-card border border-on-surface-brand/20 bg-on-surface-brand/8 p-6">
                <div className="flex items-start gap-4 mb-5">
                  <ArrowRight aria-hidden="true" className="mt-1 size-5 shrink-0 text-accent-sun" />
                  <p className="text-body-md text-on-surface-brand/90">Un réseau qui <strong className="text-on-surface-brand">connecte</strong>, qui <strong className="text-on-surface-brand">forme</strong>, qui <strong className="text-on-surface-brand">accompagne</strong>, qui <strong className="text-on-surface-brand">valorise</strong> chaque acteur de la chaîne agricole africaine.</p>
                </div>
                <p className="border-t border-on-surface-brand/20 pt-4 text-center text-title-md text-accent-sun">
                  C'est exactement ce que nous construisons ensemble, pour vous, pour l'Afrique. Bienvenue dans le Réseau agrolide.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* ── L'ÉVOLUTION DU RÉSEAU ─────────────────── */}
      <Section tone="surface" centered title="L'évolution du réseau">
        <div className="relative">
          {/* Ligne verticale centrale (desktop) ou à gauche (mobile) */}
          <div aria-hidden="true" className="absolute left-6 md:left-1/2 top-4 bottom-4 w-0.5 bg-surface-container-high md:-translate-x-1/2 z-0" />

          <ol className="relative z-10 space-y-8 md:space-y-12">
            {etapes.map((step, idx) => {
              const isEven = idx % 2 === 0
              return (
                <li key={step.date} className={`relative flex flex-col items-start md:items-center ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                  <div className={`hidden md:block md:w-1/2 ${isEven ? 'md:pr-12 text-right' : 'md:pl-12 text-left'}`}>
                    <p className={`text-title-lg ${step.colorClass}`}>{step.date}</p>
                  </div>
                  <span aria-hidden="true" className={`absolute left-6 md:left-1/2 -translate-x-1/2 z-10 mt-6 md:mt-0 size-5 rounded-full border-4 bg-surface-container-lowest ${step.borderClass}`} />
                  <div className={`pl-16 md:w-1/2 w-full ${isEven ? 'md:pl-12' : 'md:pr-12 md:pl-0'}`}>
                    <Card className={!isEven ? 'md:text-right' : ''}>
                      <p className={`md:hidden text-title-md ${step.colorClass} mb-2`}>{step.date}</p>
                      <p className="text-body-md text-on-surface-variant">{step.text}</p>
                    </Card>
                  </div>
                </li>
              )
            })}
          </ol>
        </div>
      </Section>

      {/* ── MISSION & VISION ─────────────────────── */}
      <section className="relative overflow-hidden bg-surface-brand py-14 md:py-20 text-on-surface-brand">
        <Motif size={800} opacity={0.05} className="text-on-surface-brand" />
        <div className="container relative z-10 max-w-5xl">
          <p className="mx-auto mb-10 max-w-3xl rounded-full border border-on-surface-brand/20 bg-on-surface-brand/8 px-8 py-4 text-center text-title-lg text-accent-sun md:mb-14">
            « Fédérer la chaîne agricole, pour conquérir la souveraineté alimentaire »
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            <Card variant="dark" className="p-8 md:p-10">
              <span aria-hidden="true" className="mb-5 flex size-14 items-center justify-center rounded-control bg-accent-sun/20 text-accent-sun">
                <Target className="size-6" />
              </span>
              <h3 className="text-headline-sm mb-3">Notre Mission</h3>
              <p className="text-body-md text-on-surface-brand/85">
                Fédérer et valoriser les acteurs de la chaîne agricole africaine par la mutualisation des ressources, le renforcement des compétences, l'incubation entrepreneuriale et le développement de leur visibilité, pour contribuer activement à la conquête de la souveraineté alimentaire africaine.
              </p>
            </Card>

            <Card variant="dark" className="p-8 md:p-10">
              <span aria-hidden="true" className="mb-5 flex size-14 items-center justify-center rounded-control bg-accent-sun/20 text-accent-sun">
                <Lightbulb className="size-6" />
              </span>
              <h3 className="text-headline-sm mb-3">Notre Vision</h3>
              <p className="text-body-md text-on-surface-brand/85">
                Être le réseau continental où chaque acteur de la chaîne agricole africaine trouve les ressources, les opportunités et les connexions nécessaires pour participer activement à la conquête de la souveraineté alimentaire.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* ── NOTRE ÉQUIPE ───────────────────────────── */}
      <Section
        id="equipe"
        tone="lowest"
        centered
        title="L'équipe pilote"
        description="Une équipe de passionnés, alliant expertise agronomique, technologique et stratégique au service de l'agriculture africaine."
      >
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-10">
          {equipe.map((member, i) => (
            <li key={i} className="group flex flex-col items-center text-center">
              <div className="relative mb-5 flex size-40 items-center justify-center overflow-hidden rounded-full border-4 border-outline-variant bg-surface-container-low transition-colors duration-150 group-hover:border-accent-sun md:size-48">
                {member.image ? (
                  <Image src={member.image} alt={member.name} fill sizes="192px" className="object-cover" />
                ) : (
                  <Emblem variant="creux" aria-hidden="true" className="size-16 text-outline" />
                )}
              </div>
              <h3 className="text-title-lg text-on-surface mb-1">{member.name}</h3>
              <p className="mb-3 flex min-h-10 items-start justify-center text-label-md uppercase tracking-wider text-primary">
                {member.role}
              </p>
              <div className="flex max-w-[260px] flex-col gap-1 text-body-sm text-on-surface-variant">
                {member.bullets.map((bullet) => (
                  <span key={bullet} className="block">{bullet}</span>
                ))}
              </div>
            </li>
          ))}
        </ul>
      </Section>

      {/* ── NOS VALEURS ──────────────────────────── */}
      <Section
        tone="low"
        centered
        title="Nos valeurs fondatrices"
        description="Ces principes guident chacune de nos actions et unissent tous les membres du réseau à travers le continent."
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 md:gap-6">
          {valeurs.map((v) => (
            <ValueCard key={v.title} icon={v.icon} title={v.title} description={v.desc} />
          ))}
        </div>
      </Section>

      {/* ── CTA FINAL ────────────────────────────── */}
      <section className="relative overflow-hidden bg-primary-container py-20 text-center md:py-24">
        <Motif size={1000} opacity={0.06} variant="complet" className="text-primary" />
        <div className="container relative z-10 flex flex-col items-center">
          <h2 className="text-headline-md text-primary mx-auto mb-8 max-w-2xl">
            Prêt à faire partie de l'histoire&nbsp;?
          </h2>
          <Link href="/rejoindre" className={buttonVariants({ variant: 'primary' })}>
            Rejoindre le réseau <ArrowRight className="size-4 ml-2" />
          </Link>
        </div>
      </section>
    </div>
  )
}
