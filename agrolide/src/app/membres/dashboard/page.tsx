import { redirect } from "next/navigation"
import { auth } from "@clerk/nextjs/server"
import { db } from "@/db"
import { users, notifications, evenements, articles, opportunites, cotisations } from "@/db/schema"
import { eq, desc, gte } from "drizzle-orm"
import { 
  CreditCard, 
  Users, 
  Briefcase, 
  Library 
} from "lucide-react"

import {
  DashboardHeader,
  StatCard,
  OpportunitiesWidget,
  EventWidget,
  ActivityTimeline,
  ResourcesWidget,
  ProfileSummaryWidget
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

    // Fetch Cotisation status
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
      limit: 5
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

    // Count members in directory
    const directoryMembers = await db.select({ id: users.id }).from(users).limit(500)
    const membersCount = directoryMembers.length > 0 ? directoryMembers.length : 150

    return (
      <div className="h-full flex flex-col space-y-5">
        {/* ================= 1. HEADER ================= */}
        <DashboardHeader 
          prenom={profile.prenom} 
          nom={profile.nom} 
          categorie={profile.categorie}
          specialite={profile.specialite}
          organisation={profile.organisation}
          pays={profile.pays}
          ville={profile.ville}
        />

        {/* ================= 2. TOP METRICS STRIP (FULL WIDTH) ================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 shrink-0">
          
          {/* Card 1: Adhésion */}
          <StatCard
            variant={isAdhesionActive ? "featured" : "default"}
            label="Adhésion"
            icon={CreditCard}
            badge={{
              text: isAdhesionActive ? "Active" : "En attente",
              variant: isAdhesionActive ? "success" : "warning"
            }}
            value={isAdhesionActive ? `${joursRestants} j` : "Inactive"}
            subtext={isAdhesionActive ? "Cotisation annuelle à jour" : "Régularisation requise"}
            action={{ href: "/membres/cotisation", label: "Gérer mon adhésion" }}
          />

          {/* Card 2: Réseau & Pairs */}
          <StatCard
            variant="default"
            label="Réseau"
            icon={Users}
            iconColorClass="text-[#1b5e38]"
            iconBgClass="bg-[#f0f7f0]"
            value={`${membersCount}+`}
            subtext="Membres & Experts"
            action={{ href: "/membres/annuaire", label: "Explorer l'annuaire" }}
          />

          {/* Card 3: Opportunités */}
          <StatCard
            variant="default"
            label="Opportunités"
            icon={Briefcase}
            iconColorClass="text-amber-700"
            iconBgClass="bg-[#fef3e2]"
            value={oppsData.length}
            subtext="Postes & Missions"
            action={{ href: "/membres/opportunites", label: "Voir toutes les offres" }}
          />

          {/* Card 4: Bibliothèque */}
          <StatCard
            variant="default"
            label="Bibliothèque"
            icon={Library}
            iconColorClass="text-[#1b5e38]"
            iconBgClass="bg-[#f0fdf4]"
            value={artsData.length}
            subtext="Fiches & Guides techniques"
            action={{ href: "/membres/bibliotheque", label: "Consulter les fiches" }}
          />

        </div>

        {/* ================= 3. BENTO GRID (8/12 - 4/12) ================= */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 flex-1 min-h-0 items-start">
          
          {/* ----- LEFT MAIN COLUMN (8/12) ----- */}
          <div className="xl:col-span-8 flex flex-col gap-5 min-h-0">
            
            {/* OPPORTUNITIES WIDGET */}
            <OpportunitiesWidget 
              opportunities={oppsData}
              title="Dernières Opportunités & Missions"
              viewAllHref="/membres/opportunites"
            />

            {/* RESOURCES WIDGET */}
            <ResourcesWidget 
              resources={artsData}
              title="Fiches Techniques & Bibliothèque"
              viewAllHref="/membres/bibliotheque"
            />

          </div>

          {/* ----- RIGHT SIDEBAR (4/12) ----- */}
          <div className="xl:col-span-4 flex flex-col gap-5 min-h-0">
            
            {/* 1. Prochain Événement Widget */}
            <EventWidget event={prochainEvt} />

            {/* 2. Notifications Timeline Widget */}
            <ActivityTimeline 
              notifications={notifsData}
              title="Activités & Notifications"
              viewAllHref="/membres/notifications"
            />

            {/* 3. Profile Visibility Summary */}
            <ProfileSummaryWidget
              prenom={profile.prenom}
              nom={profile.nom}
              photo_url={profile.photo_url}
              specialite={profile.specialite}
              organisation={profile.organisation}
              pays={profile.pays}
              ville={profile.ville}
              categorie={profile.categorie}
            />

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
