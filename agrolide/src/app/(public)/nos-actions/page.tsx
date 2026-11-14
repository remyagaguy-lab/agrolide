import Link from "next/link"
import { Metadata } from "next"
import { SectionLabel } from "@/components/ui/SectionLabel"
import { Card } from "@/components/ui/Card"
import { PageHero } from "@/components/ui/PageHero"
import { buttonVariants, type ButtonVariant } from "@/components/ui/Button"
import { ArchPhoto, Motif, Puce } from "@/components/brand"

import { type LucideIcon, Users, NotebookPen, TrendingUp, CalendarDays, Library, Lightbulb, ArrowRight } from "@/components/ui/icons"
export const metadata: Metadata = {
  title: "Nos actions",
  description: "Découvrez les 3 piliers d'action du réseau agrolide : Mobilisation, Formation et Agrobusiness.",
  alternates: { canonical: '/nos-actions' }
}

interface Pilier {
  id: string
  tone: "lowest" | "low"
  icon: LucideIcon
  label: string
  titre: string
  intro: string
  points: string[]
  cartes: { icon: LucideIcon; titre: string; texte: string }[]
  actions: { href: string; texte: string; variant: ButtonVariant }[]
  photo: { src: string; alt: string }
}

const piliers: Pilier[] = [
  {
    id: "reseauter",
    tone: "lowest",
    icon: Users,
    label: "Mobilisation des ressources et réseautage",
    titre: "1. Réseauter",
    intro: "L'isolement professionnel est le premier frein au développement. Nous avons conçu un environnement collaboratif pour :",
    points: ["Fédérer les agronomes, chercheurs et investisseurs", "Faciliter les synergies et le partage d'opportunités"],
    cartes: [
      { icon: Users, titre: "Annuaire", texte: "Cartographie des acteurs par pays et spécialité pour faciliter la mise en relation." },
      { icon: CalendarDays, titre: "Événements", texte: "Meetups, webinaires et opportunités pour animer notre communauté dynamique." },
    ],
    actions: [{ href: "/annuaire", texte: "Découvrir l'Annuaire", variant: "secondary" }],
    photo: { src: "/plateforme-annuaire.webp", alt: "Une agricultrice consulte sur sa tablette la carte du réseau, au milieu de ses cultures" },
  },
  {
    id: "se-former",
    tone: "low",
    icon: NotebookPen,
    label: "Formation et insertion professionnelle",
    titre: "2. Se former",
    intro: "Pour faire face au manque de documentation adaptée et aux défis de l'insertion, nous avons mis en place :",
    points: ["Une centralisation de la connaissance agronomique africaine", "Des parcours de montée en compétences et de certification"],
    cartes: [
      { icon: Library, titre: "Bibliothèque", texte: "Le répertoire de thèses, mémoires et fiches techniques adaptées à l'Afrique." },
      { icon: NotebookPen, titre: "Formations", texte: "Catalogue de montées en compétences techniques et webinaires exclusifs." },
    ],
    actions: [
      { href: "/bibliotheque", texte: "Bibliothèque", variant: "secondary" },
      { href: "/formations", texte: "Voir nos formations", variant: "outline" },
    ],
    photo: { src: "/plateforme-bibliotheque.webp", alt: "Un technicien agricole étudie un ouvrage et des graphiques dans une bibliothèque de ressources" },
  },
  {
    id: "entreprendre",
    tone: "lowest",
    icon: TrendingUp,
    label: "Agrobusiness : consulting et incubation",
    titre: "3. Entreprendre",
    intro: "Grâce à une expertise sectorielle pointue, nous soutenons le développement de projets pérennes :",
    points: ["Transformation des idées novatrices en entreprises viables", "Accompagnement opérationnel pour la croissance des structures existantes"],
    cartes: [
      { icon: Lightbulb, titre: "Consulting", texte: "Études de faisabilité, business plans et accompagnement technique sur mesure." },
      { icon: TrendingUp, titre: "Incubation", texte: "Un programme complet pour propulser les agripreneurs vers le succès commercial." },
    ],
    actions: [{ href: "/agrobusiness", texte: "Découvrir nos services", variant: "primary" }],
    photo: { src: "/images/formations/cover_bp_agricole.webp", alt: "Un agripreneur en costume travaille sur son dossier, des cultures en arrière-plan" },
  },
]

export default function NosActionsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <PageHero
        nextTone="lowest"
        label="Notre approche"
        title={<>Un écosystème intégré en <span className="text-accent-sun">3 piliers d'action</span></>}
        description="Le réseau agrolide déploie une stratégie d'accompagnement complète pour :"
      >
        <ul className="mt-4 max-w-2xl space-y-2 text-body-lg text-on-surface-brand/85">
          {["Briser l'isolement des professionnels de l'agriculture", "Renforcer les compétences techniques et managériales", "Catalyser la réussite des projets agricoles africains"].map((t) => (
            <li key={t} className="flex items-start gap-3">
              <Puce className="[&_svg]:text-accent-sun" />
              {t}
            </li>
          ))}
        </ul>
      </PageHero>

      {piliers.map((p, i) => {
        const Icon = p.icon
        const photoFirst = i % 2 === 1
        return (
          <section
            key={p.id}
            id={p.id}
            aria-labelledby={`${p.id}-titre`}
            className={`scroll-mt-20 py-14 md:py-20 ${p.tone === "low" ? "bg-surface-container-low" : "bg-surface-container-lowest"}`}
          >
            <div className="container">
              <div className="grid grid-cols-1 items-center gap-10 md:grid-cols-2 md:gap-16">
                <div className={photoFirst ? "md:order-2" : ""}>
                  <span aria-hidden="true" className="mb-6 flex size-16 items-center justify-center rounded-card bg-primary-container text-on-primary-container">
                    <Icon className="size-6" />
                  </span>
                  <SectionLabel>{p.label}</SectionLabel>
                  <h2 id={`${p.id}-titre`} className="mb-4 text-headline-md text-on-surface">{p.titre}</h2>
                  <p className="mb-3 text-body-lg text-on-surface-variant">{p.intro}</p>
                  <ul className="mb-6 space-y-2 text-body-md text-on-surface-variant">
                    {p.points.map((pt) => <li key={pt} className="flex items-start gap-2.5"><Puce />{pt}</li>)}
                  </ul>

                  <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {p.cartes.map((c) => {
                      const CIcon = c.icon
                      return (
                        <Card key={c.titre} variant="filled" className="p-5">
                          <div className="mb-2 flex items-center gap-3">
                            <CIcon aria-hidden="true" className="size-5 text-primary" />
                            <h3 className="text-title-md text-on-surface">{c.titre}</h3>
                          </div>
                          <p className="text-body-sm text-on-surface-variant">{c.texte}</p>
                        </Card>
                      )
                    })}
                  </div>

                  <div className="flex flex-wrap gap-4">
                    {p.actions.map((a) => (
                      <Link key={a.href} href={a.href} className={buttonVariants({ variant: a.variant })}>
                        {a.texte}
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Une seule photo en arche par écran : une par pilier */}
                <div className={photoFirst ? "md:order-1" : ""}>
                  <ArchPhoto src={p.photo.src} alt={p.photo.alt} className="mx-auto max-w-[520px] text-primary md:max-w-none" />
                </div>
              </div>
            </div>
          </section>
        )
      })}

      {/* ── CTA FINAL ────────────────────────────── */}
      <section className="relative overflow-hidden bg-primary-container py-20 text-center md:py-24">
        <Motif size={1000} opacity={0.06} variant="complet" className="text-primary" />
        <div className="container relative z-10 flex flex-col items-center">
          <h2 className="mx-auto mb-4 max-w-2xl text-headline-md text-primary">
            Prêt à bénéficier de tout notre écosystème&nbsp;?
          </h2>
          <p className="mb-7 text-body-md text-on-surface-variant">
            Rejoignez des centaines de professionnels engagés pour la souveraineté alimentaire africaine.
          </p>
          <Link href="/rejoindre" className={buttonVariants({ variant: 'primary' })}>
            Rejoindre le réseau <ArrowRight aria-hidden="true" className="ml-2 size-4" />
          </Link>
        </div>
      </section>
    </div>
  )
}
