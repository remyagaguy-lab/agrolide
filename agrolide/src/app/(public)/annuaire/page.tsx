import React from 'react'
import { Metadata } from 'next'
import { EyeOff, Mail, MessageCircle, Search, UserPlus } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { FeatureCard } from '@/components/ui/FeatureCard'
import { PageHero } from '@/components/ui/PageHero'
import { Section } from '@/components/ui/Section'
import { StepList } from '@/components/ui/StepList'

export const metadata: Metadata = {
  title: "Annuaire du réseau",
  description:
    "L'annuaire du réseau agrolide est réservé aux membres connectés : retrouvez d'autres membres, envoyez des invitations et échangez par la messagerie du réseau.",
  alternates: { canonical: '/annuaire' },
}

// Page statique : aucune donnée de membre n'est lue ici.
export const revalidate = 3600

const ANNUAIRE_MEMBRES = '/membres/annuaire'

export default function AnnuairePublicPage() {
  return (
    <>
      <PageHero
        nextTone="low"
        label="Réseau agrolide"
        title="L'annuaire du réseau est réservé aux membres."
        description="Pour protéger les données personnelles de ses membres, agrolide ne publie pas la liste de ses membres. Connectez-vous pour retrouver d'autres acteurs agricoles et échanger avec eux."
        actions={
          <>
            <Button href="/inscription">Rejoindre le réseau</Button>
            <Button href={ANNUAIRE_MEMBRES} variant="ghost-dark">
              Accéder à l&apos;annuaire
            </Button>
          </>
        }
      />

      <Section
        id="fonctionnement"
        tone="low"
        label="Dans l'annuaire"
        title="Retrouver, se connecter, échanger"
      >
        <div className="grid gap-6 md:grid-cols-3">
          <FeatureCard icon={<Search />} title="Retrouver un membre">
            Recherchez par nom, pays ou domaine d&apos;activité, et filtrez par catégorie de membre.
          </FeatureCard>
          <FeatureCard icon={<UserPlus />} title="Envoyer une invitation">
            Invitez un membre à se connecter à vous : la personne accepte ou ignore votre invitation.
          </FeatureCard>
          <FeatureCard icon={<MessageCircle />} title="Échanger">
            Une fois la connexion acceptée, discutez avec elle par la messagerie du réseau.
          </FeatureCard>
        </div>
      </Section>

      <Section
        id="donnees"
        tone="surface"
        label="Vos données"
        title="Un annuaire pensé pour protéger ses membres"
      >
        <div className="grid gap-6 md:grid-cols-2">
          <FeatureCard icon={<EyeOff />} title="Pas de liste publique">
            Les profils de l&apos;annuaire ne sont consultables qu&apos;après connexion à votre compte.
          </FeatureCard>
          <FeatureCard icon={<Mail />} title="Coordonnées non affichées">
            L&apos;adresse e-mail et le numéro de téléphone d&apos;un membre ne figurent jamais sur son profil.
          </FeatureCard>
        </div>
      </Section>

      <Section
        id="rejoindre"
        tone="low"
        label="Rejoindre"
        title="Comment faire partie de l'annuaire"
      >
        <StepList
          items={[
            {
              title: 'Créez votre compte',
              description: 'Indiquez votre pays, votre spécialité et votre catégorie de membre.',
            },
            {
              title: 'Complétez votre profil',
              description: 'Une photo et une courte présentation aident les autres membres à vous reconnaître.',
            },
            {
              title: 'Connectez-vous aux autres membres',
              description: "Parcourez l'annuaire, envoyez des invitations et échangez par la messagerie.",
            },
          ]}
        />
        <div className="mt-10 flex flex-wrap items-center gap-3">
          <Button variant="secondary" href="/inscription">
            Créer mon compte
          </Button>
          <Button variant="text" href={`/login?next=${encodeURIComponent(ANNUAIRE_MEMBRES)}`}>
            J&apos;ai déjà un compte
          </Button>
        </div>
      </Section>
    </>
  )
}
