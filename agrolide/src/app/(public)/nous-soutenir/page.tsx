import { Metadata } from "next"
import Link from "next/link"
import { Suspense } from "react"
import MerciBanner from "@/components/modules/fonds/MerciBanner"
import DonationForm from "@/components/modules/fonds/DonationForm"
import { getCampagneData } from "@/lib/cache/public-queries"
import { Button } from "@/components/ui/Button"
import { Card } from "@/components/ui/Card"
import { FeatureCard } from "@/components/ui/FeatureCard"
import { PageHero } from "@/components/ui/PageHero"
import { Section } from "@/components/ui/Section"

import { Library, Building2, EyeOff, Mail, Server, ShieldCheck, Sprout } from "@/components/ui/icons"
export const metadata: Metadata = {
  title: "Nous soutenir - Faire un don",
  description: "Soutenez le développement de notre réseau agricole et investissez dans la souveraineté alimentaire africaine. Découvrez comment contribuer à nos actions sur le terrain.",
  alternates: { canonical: '/nous-soutenir' }
}

export const revalidate = 1800 // ISR toutes les 30 minutes

const dateFr = (value?: string | null) =>
  value ? new Date(value).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" }) : ""

export default async function NousSoutenirPage() {
  // Campagne active et contributions validées (requêtes parallèles, en cache)
  const { campagne, contributions } = await getCampagneData()

  let totalCollecte = 0
  let progressPercentage = 0
  let recentDonors: typeof contributions = []

  if (campagne && contributions) {
    totalCollecte = contributions.reduce((sum, c) => sum + Number(c.montant_fcfa), 0)
    progressPercentage = campagne.objectif_fcfa
      ? Math.min(100, Math.round((totalCollecte / campagne.objectif_fcfa) * 100))
      : 0

    // Derniers soutiens publics (les dons anonymes ne sont jamais listés)
    recentDonors = contributions
      .filter((c) => !c.anonyme)
      .sort((a, b) => {
        const tA = a.created_at ? new Date(a.created_at).getTime() : 0
        const tB = b.created_at ? new Date(b.created_at).getTime() : 0
        return tB - tA
      })
      .slice(0, 5)
  }

  return (
    <>
      <PageHero
        nextTone="low"
        label="Nous soutenir"
        title={
          <>
            Soutenir agrolide, c&apos;est investir dans la{" "}
            <span className="text-accent-sun">souveraineté alimentaire africaine.</span>
          </>
        }
        description="Votre don permet de financer l'accompagnement des agripreneurs, la création de ressources et le développement technologique du réseau."
        actions={
          <Button variant="ghost-dark" href="#don">
            Faire un don
          </Button>
        }
      />

      <Section tone="low" aria-label="Faire un don" className="!pt-6 md:!pt-8">
        <Suspense fallback={null}>
          <MerciBanner />
        </Suspense>

        {/* Campagne en cours : seulement si une campagne est active */}
        {campagne && (
          <Card variant="outlined" className="mb-10 !p-6 md:!p-8">
            <p className="text-label-md uppercase tracking-[0.1em] text-primary">Campagne en cours</p>
            <h2 className="mt-1 text-headline-sm text-on-surface">{campagne.titre}</h2>
            <div className="mt-5 flex flex-wrap items-end justify-between gap-x-6 gap-y-2">
              <p className="text-on-surface">
                <span className="text-headline-md text-primary">{totalCollecte.toLocaleString("fr-FR")}</span>{" "}
                <span className="text-body-md text-on-surface-variant">FCFA collectés</span>
              </p>
              <p className="text-body-md text-on-surface-variant">
                {progressPercentage} % de l&apos;objectif de {Number(campagne.objectif_fcfa).toLocaleString("fr-FR")} FCFA
              </p>
            </div>
            <div
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={progressPercentage}
              aria-label={`Progression de la campagne : ${progressPercentage} % de l'objectif`}
              className="mt-3 h-3 w-full overflow-hidden rounded-full bg-surface-container-high"
            >
              <div className="h-full rounded-full bg-primary" style={{ width: `${progressPercentage}%` }} />
            </div>
            {campagne.description && <p className="mt-5 max-w-3xl text-body-md text-on-surface-variant">{campagne.description}</p>}
          </Card>
        )}

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-14">
          {/* Formulaire : en premier sur mobile (visible tout de suite), à droite sur bureau */}
          <div id="don" className="scroll-mt-24 lg:order-2 lg:col-span-5">
            <Card variant="elevated" className="!p-6 md:!p-8 lg:sticky lg:top-24">
              <h2 className="mb-6 text-headline-sm text-on-surface">Faire un don</h2>
              <DonationForm campagneId={campagne?.id || ""} />
            </Card>
          </div>

          <div className="space-y-14 lg:order-1 lg:col-span-7">
            <div>
              <h2 className="text-headline-md text-on-surface">Ce que finance votre contribution</h2>
              <p className="mt-3 max-w-xl text-body-lg text-on-surface-variant">Votre don soutient trois axes du réseau.</p>
              <div className="mt-8 grid gap-4">
                <FeatureCard icon={<Library />} title="Vulgariser la science">
                  Traduction et adaptation de recherches agronomiques en fiches techniques utilisables sur le terrain.
                </FeatureCard>
                <FeatureCard icon={<Sprout />} title="Accompagner les porteurs de projets">
                  Appui aux jeunes agripreneurs : mentorat et préparation des dossiers de financement.
                </FeatureCard>
                <FeatureCard icon={<Server />} title="Maintenir la plateforme">
                  Couverture des frais d&apos;hébergement, d&apos;outils et de développement pour garder le réseau accessible.
                </FeatureCard>
              </div>
            </div>

            <div>
              <h2 className="text-headline-md text-on-surface">Votre don en toute confiance</h2>
              <ul className="mt-8 space-y-6">
                <li className="flex gap-4">
                  <ShieldCheck className="mt-0.5 size-6 shrink-0 text-primary" aria-hidden="true" />
                  <div>
                    <h3 className="text-title-md text-on-surface">Paiement sécurisé par Stripe</h3>
                    <p className="mt-1 text-body-md text-on-surface-variant">
                      Le paiement se fait sur la page sécurisée de Stripe. agrolide ne voit ni ne conserve votre numéro de carte.
                    </p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <EyeOff className="mt-0.5 size-6 shrink-0 text-primary" aria-hidden="true" />
                  <div>
                    <h3 className="text-title-md text-on-surface">Don anonyme possible</h3>
                    <p className="mt-1 text-body-md text-on-surface-variant">
                      Cochez l&apos;option dans le formulaire : votre nom n&apos;apparaît pas dans la liste des soutiens.
                    </p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <Mail className="mt-0.5 size-6 shrink-0 text-primary" aria-hidden="true" />
                  <div>
                    <h3 className="text-title-md text-on-surface">Confirmation par e-mail</h3>
                    <p className="mt-1 text-body-md text-on-surface-variant">
                      Un e-mail de confirmation vous est envoyé une fois le don validé.
                    </p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <Building2 className="mt-0.5 size-6 shrink-0 text-primary" aria-hidden="true" />
                  <div>
                    <h3 className="text-title-md text-on-surface">Une organisation que vous pouvez joindre</h3>
                    <p className="mt-1 text-body-md text-on-surface-variant">
                      agrolide, siège à Lomé (Togo). Une question avant de donner ?{" "}
                      <a href="mailto:contact@agrolide.org" className="font-semibold text-primary underline underline-offset-2">
                        contact@agrolide.org
                      </a>
                      . Voir les{" "}
                      <Link href="/mentions-legales" className="font-semibold text-primary underline underline-offset-2">
                        mentions légales
                      </Link>{" "}
                      et la{" "}
                      <Link href="/confidentialite" className="font-semibold text-primary underline underline-offset-2">
                        politique de confidentialité
                      </Link>
                      .
                    </p>
                  </div>
                </li>
              </ul>
            </div>

            {recentDonors.length > 0 && (
              <div>
                <h2 className="text-headline-md text-on-surface">Ils nous soutiennent</h2>
                <Card variant="outlined" className="mt-6 !p-0">
                  <ul className="divide-y divide-outline-variant">
                    {recentDonors.map((donor, i) => {
                      const prenom = String(donor.prenom ?? "").trim().split(" ")[0] || "Anonyme"
                      return (
                        <li key={i} className="flex items-center justify-between gap-4 px-5 py-4">
                          <div className="flex items-center gap-4">
                            <span
                              aria-hidden="true"
                              className="flex size-11 items-center justify-center rounded-full bg-primary-container text-title-md text-on-primary-container"
                            >
                              {prenom.charAt(0).toUpperCase()}
                            </span>
                            <div>
                              <p className="text-title-sm text-on-surface">{prenom}</p>
                              <p className="text-body-sm text-on-surface-muted">{dateFr(donor.created_at)}</p>
                            </div>
                          </div>
                          <p className="text-title-sm text-primary">{Number(donor.montant_fcfa).toLocaleString("fr-FR")} FCFA</p>
                        </li>
                      )
                    })}
                  </ul>
                </Card>
              </div>
            )}
          </div>
        </div>
      </Section>

      <Section tone="container" centered title="Vous représentez une organisation ?" description="Fondations, entreprises et institutions peuvent s'associer aux actions du réseau sous forme de partenariat.">
        <div className="flex justify-center">
          <Button variant="secondary" href="/partenaires">
            Devenir partenaire
          </Button>
        </div>
      </Section>
    </>
  )
}
