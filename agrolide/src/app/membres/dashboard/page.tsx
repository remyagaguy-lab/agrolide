import { redirect } from "next/navigation"
import { auth } from "@clerk/nextjs/server"
import { db } from "@/db"
import { users, notifications, evenements, articles, opportunites, cotisations } from "@/db/schema"
import { eq, desc, gte } from "drizzle-orm"
import { 
  CreditCard, 
  BookOpen, 
  Briefcase, 
  Library, 
  Sparkles
} from "lucide-react"

import {
  DashboardHeader,
  StatCard,
  OpportunitiesWidget,
  EventWidget,
  ActivityTimeline,
  ResourcesWidget,
} from "@/components/modules/dashboard"

export const metadata = { title: "Tableau de bord | Agrolide" }

export default async function DashboardPage() {
  try {
    const { userId } = await auth()
    if (!userId) redirect("/login")

    // Fetch Profile
    const userRows = await db.select({
      id: users.id,
      prenom: users.prenom,
      nom: users.nom,
      photo_url: users.photo_url,
      categorie: users.categorie,
      specialite: users.specialite,
      organisation: users.organisation,
      ville: users.ville,
      pays: users.pays
    })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1)

    const profile = userRows[0] || null
    if (!profile) redirect("/login")

    // Fetch Cotisation
    const userCotisation = await db.query.cotisations.findFirst({
      where: eq(cotisations.membre_id, userId),
      orderBy: [desc(cotisations.created_at)]
    })
    const dateFinRaw = userCotisation?.date_fin ? new Date(userCotisation.date_fin) : null
    const dateFinCotisation = (dateFinRaw && !isNaN(dateFinRaw.getTime())) ? dateFinRaw : null
    const joursRestants = dateFinCotisation 
      ? Math.max(0, Math.ceil((dateFinCotisation.getTime() - new Date().getTime()) / (1000 * 3600 * 24)))
      : 0
    const isAdhesionActive = !!dateFinCotisation && joursRestants > 0

    // Fetch Events (prochain événement à venir)
    const evtsData = await db.query.evenements.findMany({
      where: gte(evenements.date_debut, new Date().toISOString()),
      orderBy: (evts, { asc }) => [asc(evts.date_debut)],
      limit: 1
    })
    const prochainEvt = evtsData[0] || null

    // Fetch Opportunités
    const oppsData = await db.query.opportunites.findMany({
      orderBy: [desc(opportunites.created_at)],
      limit: 4
    })

    // Fetch Articles / Ressources
    const artsData = await db.query.articles.findMany({
      where: eq(articles.statut, "publie"),
      orderBy: [desc(articles.published_at)],
      limit: 4
    })

    // Fetch Notifications
    const notifsData = await db.query.notifications.findMany({
      where: eq(notifications.user_id, userId),
      orderBy: [desc(notifications.created_at)],
      limit: 5
    })

    return (
      <div className="h-full flex flex-col space-y-4">
        {/* ================= 1. HEADER ================= */}
        <DashboardHeader 
          prenom={profile.prenom} 
          nom={profile.nom} 
          categorie={profile.categorie}
          specialite={profile.specialite}
        />

        {/* ================= 2. BENTO GRID ================= */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 flex-1 min-h-0">
          
          {/* ----- LEFT MAIN COLUMN (8/12) ----- */}
          <div className="xl:col-span-8 flex flex-col gap-4 min-h-0">
            
            {/* TOP METRICS ROW (4 Cards) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 shrink-0">
              
              {/* Card 1: Adhésion (Featured / High Contrast) */}
              <StatCard
                variant="featured"
                label="Adhésion"
                icon={CreditCard}
                badge={{
                  text: isAdhesionActive ? "Actif" : "Inactif",
                  variant: isAdhesionActive ? "success" : "error"
                }}
                value={joursRestants}
                subtext="Jours restants"
                action={{ href: "/membres/cotisation", label: "Gérer mon adhésion" }}
              />

              {/* Card 2: Formations */}
              <StatCard
                variant="default"
                label="Formations"
                icon={BookOpen}
                iconColorClass="text-blue-600"
                iconBgClass="bg-blue-50"
                value="5"
                subtext="En cours ou terminées"
                action={{ href: "/membres/formations", label: "Voir les formations" }}
              />

              {/* Card 3: Opportunités */}
              <StatCard
                variant="default"
                label="Opportunités"
                icon={Briefcase}
                iconColorClass="text-amber-600"
                iconBgClass="bg-amber-50"
                value={oppsData.length}
                subtext="Postes & Missions"
                action={{ href: "/membres/opportunites", label: "Voir les opportunités" }}
              />

              {/* Card 4: Ressources */}
              <StatCard
                variant="default"
                label="Ressources"
                icon={Library}
                iconColorClass="text-[#1b5e38]"
                iconBgClass="bg-[#f0fdf4]"
                value={artsData.length}
                subtext="Articles & Guides"
                action={{ href: "/membres/bibliotheque", label: "Explorer la bibliothèque" }}
              />

            </div>

            {/* OPPORTUNITIES WIDGET */}
            <OpportunitiesWidget 
              opportunities={oppsData}
              title="Dernières Opportunités"
              viewAllHref="/membres/opportunites"
            />

          </div>

          {/* ----- RIGHT SIDEBAR (4/12) ----- */}
          <div className="xl:col-span-4 flex flex-col gap-4 min-h-0">
            
            {/* 1. Prochain Événement Widget */}
            <EventWidget event={prochainEvt} />

            {/* 2. Notifications Timeline Widget */}
            <ActivityTimeline notifications={notifsData} />

            {/* 3. Dernières Ressources Widget */}
            <ResourcesWidget resources={artsData} />

          </div>

        </div>
      </div>
    )
  } catch (err: any) {
    if (err.digest !== 'NEXT_REDIRECT' && !err.message?.includes('NEXT_REDIRECT')) {
      (globalThis as any).lastError = {
        message: err.message,
        stack: err.stack,
        digest: err.digest,
        location: 'dashboard'
      };
    }
    throw err;
  }
}
