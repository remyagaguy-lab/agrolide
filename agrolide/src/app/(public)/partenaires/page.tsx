import { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { db } from "@/db"
import { partenaires as partenairesTable } from "@/db/schema"
import { eq, asc } from "drizzle-orm"
import PartenariatForm from "@/components/modules/fonds/PartenariatForm"
import { Button } from "@/components/ui/Button"
import { Card } from "@/components/ui/Card"
import { FeatureCard } from "@/components/ui/FeatureCard"
import { PageHero } from "@/components/ui/PageHero"
import { Section } from "@/components/ui/Section"
import { StepList } from "@/components/ui/StepList"

import { Users, ExternalLink, Handshake, Megaphone, MessageSquarePlus, Sprout, Coins, Wrench } from "@/components/ui/icons"
export const metadata: Metadata = {
  title: "Devenir partenaire",
  description: "Associez votre organisation aux actions du réseau agrolide en faveur de l'agriculture africaine : sponsoring, partenariat technique, financement de l'incubation ou partenariat média.",
  alternates: { canonical: '/partenaires' }
}

export const revalidate = 3600 // ISR toutes les heures

const FORMES = [
  { icon: <Coins />, title: "Sponsoring financier", text: "Soutenir financièrement les actions ou un événement du réseau." },
  { icon: <Wrench />, title: "Partenariat technique", text: "Apporter une expertise, des outils ou un accompagnement technique." },
  { icon: <Sprout />, title: "Financement de l'incubation", text: "Contribuer au financement du programme d'incubation des agripreneurs." },
  { icon: <Megaphone />, title: "Partenariat média", text: "Relayer les actions du réseau ou produire des contenus ensemble." },
  { icon: <MessageSquarePlus />, title: "Autre proposition", text: "Une idée différente ? Décrivez-la dans votre message." },
]

export default async function PartenairesPage() {
  // Partenaires publiés
  const partenaires = await db.select()
    .from(partenairesTable)
    .where(eq(partenairesTable.publie, true))
    .orderBy(asc(partenairesTable.ordre))

  return (
    <>
      <PageHero
        nextTone="surface"
        label="Partenariats"
        title="Devenir partenaire du réseau agrolide"
        description="Institutions, fondations, entreprises, ONG et médias : associez votre organisation aux actions du réseau en faveur de l'agriculture africaine."
        actions={
          <Button variant="ghost-dark" href="#contact">
            Proposer un partenariat
          </Button>
        }
      />

      <Section
        tone="surface"
        id="pourquoi"
        label="Pourquoi s'associer"
        title="S'associer à des actions concrètes sur le terrain"
        description="Un partenariat avec agrolide relie votre organisation à un réseau de professionnels, de jeunes diplômés et de porteurs de projets agricoles."
      >
        <div className="grid gap-4 md:grid-cols-3 md:gap-6">
          <FeatureCard icon={<Handshake />} title="Contribuer à l'innovation et à l'insertion">
            Soutenez concrètement l&apos;innovation, la formation professionnelle et l&apos;insertion des jeunes diplômés en Afrique.
          </FeatureCard>
          <FeatureCard icon={<Megaphone />} title="Être visible auprès du réseau">
            Votre organisation est présentée aux membres et aux visiteurs du réseau, selon la forme de collaboration convenue.
          </FeatureCard>
          <FeatureCard icon={<Users />} title="Rencontrer les talents du secteur">
            Échangez avec les professionnels et les jeunes diplômés du secteur agricole qui composent le réseau.
          </FeatureCard>
        </div>
      </Section>

      <Section
        tone="low"
        id="formes"
        label="Formes de collaboration"
        title="Cinq façons de collaborer"
        description="Choisissez la forme qui vous convient dans le formulaire ; nous affinons ensemble le contenu du partenariat."
      >
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FORMES.map((f) => (
            <li key={f.title}>
              <FeatureCard icon={f.icon} title={f.title}>
                {f.text}
              </FeatureCard>
            </li>
          ))}
        </ul>
      </Section>

      <Section tone="surface" id="deroulement" label="Déroulement" title="Comment se déroule un partenariat">
        <StepList
          items={[
            { title: "Vous nous écrivez", description: "Vous présentez votre organisation et votre proposition avec le formulaire ci-dessous." },
            { title: "Nous échangeons", description: "L'équipe partenariats vous contacte pour comprendre vos objectifs et répondre à vos questions." },
            { title: "Nous définissons la collaboration", description: "Nous convenons ensemble de la forme du partenariat et de la manière de le mettre en œuvre." },
          ]}
        />
      </Section>

      {/* Partenaires actuels : affichés seulement s'il y en a (pas de section vide, pas de faux logos) */}
      {partenaires && partenaires.length > 0 && (
        <Section tone="low" id="partenaires-actuels" label="Ils collaborent avec le réseau" title="Nos partenaires et sponsors">
          <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {partenaires.map((p) => {
              const content = (
                <>
                  <div className="relative flex h-20 w-full items-center justify-center">
                    {p.logo_url ? (
                      <Image src={p.logo_url} alt="" fill sizes="(max-width: 640px) 80vw, 240px" className="object-contain" />
                    ) : (
                      <span
                        aria-hidden="true"
                        className="flex size-16 items-center justify-center rounded-full bg-primary-container text-title-lg text-on-primary-container"
                      >
                        {p.nom.substring(0, 2).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <h3 className="mt-4 text-title-md text-on-surface">{p.nom}</h3>
                  {p.description && <p className="mt-1 line-clamp-3 text-body-sm text-on-surface-variant">{p.description}</p>}
                </>
              )
              return (
                <li key={p.id}>
                  {p.site_web ? (
                    <a
                      href={p.site_web}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group block h-full rounded-card border border-outline-variant bg-surface-container-lowest p-6 text-center transition-colors duration-150 hover:border-primary"
                    >
                      {content}
                      <span className="mt-3 inline-flex items-center gap-1 text-label-md text-primary">
                        Visiter le site <ExternalLink className="size-4" aria-hidden="true" />
                        <span className="sr-only">de {p.nom} (s&apos;ouvre dans un nouvel onglet)</span>
                      </span>
                    </a>
                  ) : (
                    <Card className="h-full text-center">{content}</Card>
                  )}
                </li>
              )
            })}
          </ul>
        </Section>
      )}

      <Section
        tone={partenaires && partenaires.length > 0 ? "surface" : "low"}
        id="contact"
        label="Proposer un partenariat"
        title="Parlons de votre proposition"
        description="Quelques informations suffisent pour démarrer l'échange. Vous pouvez aussi nous écrire directement."
      >
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
          <Card variant="elevated" className="!p-6 md:!p-8 lg:col-span-8">
            <PartenariatForm />
          </Card>

          <aside className="space-y-6 lg:col-span-4" aria-label="Autres moyens de nous joindre">
            <div>
              <h3 className="text-title-lg text-on-surface">Nous écrire directement</h3>
              <p className="mt-2 text-body-md text-on-surface-variant">
                <a href="mailto:partenaires@agrolide.org" className="font-semibold text-primary underline underline-offset-2">
                  partenaires@agrolide.org
                </a>
              </p>
            </div>
            <div>
              <h3 className="text-title-lg text-on-surface">Vous souhaitez faire un don ?</h3>
              <p className="mt-2 text-body-md text-on-surface-variant">
                Un particulier ou une organisation peut aussi soutenir le réseau par un don en ligne.
              </p>
              <p className="mt-3">
                <Link href="/nous-soutenir" className="inline-flex min-h-11 items-center font-semibold text-primary underline underline-offset-2">
                  Soutenir le réseau
                </Link>
              </p>
            </div>
          </aside>
        </div>
      </Section>
    </>
  )
}
