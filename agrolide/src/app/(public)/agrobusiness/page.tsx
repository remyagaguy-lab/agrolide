import { Metadata } from "next"
import Link from "next/link"
import { buttonVariants } from "@/components/ui/Button"
import { FeatureCard } from "@/components/ui/FeatureCard"
import { PageHero } from "@/components/ui/PageHero"
import { Section } from "@/components/ui/Section"
import DemandeServiceForm from "@/components/modules/agrobusiness/DemandeServiceForm"

import { TrendingUp, LineChart, FileText, ArrowRight } from "@/components/ui/icons"
export const metadata: Metadata = {
  title: "Agrobusiness & Consulting - Accompagnement",
  description: "Conseil stratégique et incubation pour les projets agricoles en Afrique. Notre réseau agricole vous accompagne de l'idée au marché pour bâtir des entreprises viables.",
  alternates: { canonical: '/agrobusiness' }
}

export default function AgrobusinessPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <PageHero
        nextTone="low"
        label="Accompagnement"
        title="Agrobusiness & Consulting"
        description="De l'idée au marché : nous accompagnons vos projets agricoles pour les transformer en entreprises viables et durables."
      />

      <Section id="services" tone="low" centered title="Nos services d'accompagnement">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 md:grid-cols-3 md:gap-8">
          <FeatureCard icon={<FileText />} title="Études & Business Plans">
            Études de faisabilité, études de marché et rédaction de business plans bancables pour sécuriser vos financements.
          </FeatureCard>

          <FeatureCard icon={<LineChart />} title="Conseil Stratégique">
            Appui technique aux exploitations, optimisation des processus de production et structuration de chaînes de valeur.
          </FeatureCard>

          <FeatureCard icon={<TrendingUp />} title="Incubation & Accélération" className="flex flex-col border-2 border-primary">
            <span className="block">
              Programmes complets pour les agripreneurs : mentorat, coaching au pitch et préparation du dossier de financement.
            </span>
            <Link href="/agrobusiness/incubation" className={buttonVariants({ variant: 'secondary', fullWidth: true, className: 'mt-6' })}>
              Découvrir le programme <ArrowRight aria-hidden="true" className="size-4" />
            </Link>
          </FeatureCard>
        </div>
      </Section>

      <Section
        id="demande"
        tone="lowest"
        narrow
        centered
        title="Demander un accompagnement"
        description="Remplissez ce formulaire pour nous faire part de vos besoins. Un de nos experts vous recontacte rapidement, 72 h au maximum."
      >
        <div className="text-left">
          <DemandeServiceForm />
        </div>
      </Section>
    </div>
  )
}
