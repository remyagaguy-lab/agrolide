import { redirect } from "next/navigation"
import { eq } from "drizzle-orm"
import { auth } from "@/lib/auth/server"
import { db } from "@/db"
import { users } from "@/db/schema"
import { PageEntete } from "@/components/layout/PageEntete"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs"
import DemandeServiceForm from "@/components/modules/agrobusiness/DemandeServiceForm"
import IncubationForm from "@/components/modules/agrobusiness/IncubationForm"

import { Lightbulb, TrendingUp } from "@/components/ui/icons"
export const metadata = { title: "Entreprendre" }

export default async function EntreprendreMembrePage() {
  const { userId } = await auth()
  if (!userId) redirect("/login")

  const profil = await db.query.users.findFirst({
    where: eq(users.id, userId),
    columns: { prenom: true, nom: true, email: true, pays: true, organisation: true },
  })
  const initial = {
    prenom: profil?.prenom ?? undefined,
    nom: profil?.nom ?? undefined,
    email: profil?.email ?? undefined,
    pays: profil?.pays ?? undefined,
    organisation: profil?.organisation ?? undefined,
  }

  return (
    <div className="max-w-[1200px] mx-auto px-2 md:px-4 py-6 space-y-6">
      <PageEntete
        titre="Entreprendre"
        description="Transformez votre idée agricole en projet viable : candidatez à l'incubation ou demandez un accompagnement sur mesure."
      />

      <Tabs defaultValue="incubation">
        <TabsList aria-label="Type d'accompagnement">
          <TabsTrigger value="incubation"><TrendingUp className="mr-2 size-4" aria-hidden /> Lancer mon projet</TabsTrigger>
          <TabsTrigger value="accompagnement"><Lightbulb className="mr-2 size-4" aria-hidden /> Être accompagné</TabsTrigger>
        </TabsList>

        <TabsContent value="incubation" className="max-w-3xl">
          <p className="mb-4 text-body-md text-on-surface-variant">
            Le programme d'incubation s'adresse aux agripreneurs : mentorat, coaching au pitch et préparation du dossier de financement.
          </p>
          <IncubationForm initial={initial} />
        </TabsContent>

        <TabsContent value="accompagnement" className="max-w-3xl">
          <p className="mb-4 text-body-md text-on-surface-variant">
            Études de faisabilité, business plans, conseil technique : un de nos experts vous recontacte sous 72 h.
          </p>
          <DemandeServiceForm initial={initial} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
