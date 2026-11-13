import { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/Button"
import Breadcrumb from "@/components/ui/Breadcrumb"
import AgripreneurCard from "@/components/modules/agrobusiness/AgripreneurCard"

import { db } from "@/db"
import { agripreneurs as agripreneursTable } from "@/db/schema"
import { eq, desc } from "drizzle-orm"

import { TrendingUp } from "@/components/ui/icons"
export const metadata: Metadata = {
  title: "Nos Agripreneurs",
  description: "Découvrez les success stories des agripreneurs incubés par le réseau agrolide.",
  alternates: { canonical: '/agrobusiness/agripreneurs' }
}

export const revalidate = 3600 // ISR toutes les heures

export default async function AgripreneursPage() {
  const agripreneurs = await db.select()
    .from(agripreneursTable)
    .where(eq(agripreneursTable.publie, true))
    .orderBy(desc(agripreneursTable.created_at))

  return (
    <div className="flex flex-col min-h-screen bg-surface-container-low">
      {/* Header */}
      <section className="bg-surface-brand py-16 text-on-surface-brand text-center">
        <div className="container mx-auto px-4">
          <Breadcrumb tone="dark" className="justify-center" items={[{ label: 'Agrobusiness', href: '/agrobusiness' }, { label: 'Nos agripreneurs' }]} />
          <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">
            Nos Agripreneurs
          </h1>
          <p className="text-xl max-w-2xl mx-auto text-on-surface-brand/90">
            Les startups et projets qui transforment l'agriculture africaine, accompagnés par l'incubateur agrolide.
          </p>
        </div>
      </section>

      {/* Grille */}
      <section className="py-24">
        <div className="container mx-auto px-4 max-w-7xl">
          {agripreneurs && agripreneurs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {agripreneurs.map((a) => (
                <AgripreneurCard key={a.id} agripreneur={a} />
              ))}
            </div>
          ) : (
            <div className="bg-surface-container-lowest rounded-2xl border border-dashed border-tertiary p-16 text-center max-w-4xl mx-auto shadow-sm">
              <div className="w-24 h-24 bg-tertiary-container rounded-full flex items-center justify-center mx-auto text-on-tertiary-container mb-6">
                <TrendingUp size={24} />
              </div>
              <h2 className="text-3xl font-heading font-bold text-on-surface mb-4">
                Success stories à venir !
              </h2>
              <p className="text-on-surface-variant text-lg mb-8 max-w-xl mx-auto">
                La première cohorte d'incubation n'a pas encore démarré. Les profils des agripreneurs accompagnés seront présentés ici.
              </p>
              <div className="flex justify-center gap-4">
                <Link href="/agrobusiness/incubation">
                  <Button variant="primary">Candidater à l'incubation</Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
