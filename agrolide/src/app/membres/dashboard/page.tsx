import { redirect } from "next/navigation"
import { auth } from "@clerk/nextjs/server"
import { db } from "@/db"
import { users, notifications, evenements, articles, documents, opportunites, cotisations, forum_fils, formations } from "@/db/schema"
import { eq, desc, gte } from "drizzle-orm"
import { 
  Library, 
  Users, 
  MessagesSquare, 
  Calendar 
} from "lucide-react"

import {
  DashboardHeader,
  StatCard,
  OpportunitiesWidget,
  EventWidget,
  ActivityTimeline,
  ResourcesWidget,
  ProfileSummaryWidget,
  FormationsWidget
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

    // Count all events
    const allEvents = await db.select({ id: evenements.id }).from(evenements).limit(100)
    const eventsCount = allEvents.length > 0 ? allEvents.length : 4

    // Fetch Forum fils count
    const forumThreads = await db.select({ id: forum_fils.id }).from(forum_fils).limit(100)
    const forumCount = forumThreads.length > 0 ? forumThreads.length : 12

    // Fetch Opportunités
    const oppsData = await db.query.opportunites.findMany({
      orderBy: [desc(opportunites.created_at)],
      limit: 5
    })

    // Fetch Formations
    const formationsData = await db.query.formations.findMany({
      orderBy: [desc(formations.created_at)],
      limit: 5
    })

    // Fetch exact total published resources in Bibliothèque (documents & articles)
    const [publishedDocsRows, publishedArticlesRows] = await Promise.all([
      db.select({ id: documents.id }).from(documents).where(eq(documents.statut, "publie")),
      db.select({ id: articles.id }).from(articles).where(eq(articles.statut, "publie"))
    ])

    const totalResourcesCount = (publishedDocsRows.length || 0) + (publishedArticlesRows.length || 0)

    // Fetch recent documents for the library widget (fallback to articles)
    const [recentDocsData, artsData] = await Promise.all([
      db.query.documents.findMany({
        where: eq(documents.statut, "publie"),
        orderBy: [desc(documents.created_at)],
        limit: 4
      }),
      db.query.articles.findMany({
        where: eq(articles.statut, "publie"),
        orderBy: [desc(articles.published_at)],
        limit: 4
      })
    ])

    const resourcesForWidget = recentDocsData.length > 0
      ? recentDocsData.map(doc => ({
          id: doc.id,
          titre: doc.titre,
          categorie: doc.thematique || doc.type_doc || "Guide Technique",
          slug: doc.id,
          published_at: doc.created_at || doc.created_at
        }))
      : artsData.map(art => ({
          id: art.id,
          titre: art.titre,
          categorie: art.categorie || "Article",
          slug: art.slug || art.id,
          published_at: art.published_at
        }))

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

        {/* ================= 2. TOP 4 METRICS STRIP (FULL WIDTH) ================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 shrink-0">
          
          {/* Card 1: Bibliothèque (En premier) */}
          <StatCard
            variant="default"
            label="Bibliothèque"
            icon={Library}
            iconColorClass="text-[#1b5e38]"
            iconBgClass="bg-[#f0fdf4]"
            value={totalResourcesCount}
            subtext="Fiches & Guides techniques"
            action={{ href: "/membres/bibliotheque", label: "Consulter les fiches" }}
          />

          {/* Card 2: Réseau (En deuxième) */}
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

          {/* Card 3: Forum (En troisième) */}
          <StatCard
            variant="default"
            label="Forum"
            icon={MessagesSquare}
            iconColorClass="text-[#1d4ed8]"
            iconBgClass="bg-[#eff6ff]"
            value={forumCount}
            subtext="Discussions & Débats"
            action={{ href: "/membres/forum", label: "Participer aux débats" }}
          />

          {/* Card 4: Événements (En quatrième, remplaçant opportunités) */}
          <StatCard
            variant="default"
            label="Événements"
            icon={Calendar}
            iconColorClass="text-amber-700"
            iconBgClass="bg-[#fef3e2]"
            value={eventsCount}
            subtext="Webinaires & Rencontres"
            action={{ href: "/membres/evenements", label: "Voir le calendrier" }}
          />

        </div>

        {/* ================= 3. BENTO GRID (8/12 - 4/12) ================= */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 flex-1 min-h-0 items-start">
          
          {/* ----- LEFT MAIN COLUMN (8/12) ----- */}
          <div className="xl:col-span-8 flex flex-col gap-5 min-h-0">
            
            {/* OPPORTUNITIES WIDGET */}
            <OpportunitiesWidget 
              opportunities={oppsData}
              title="Opportunités & Appels à Projets"
              viewAllHref="/membres/opportunites"
            />

            {/* FORMATIONS WIDGET */}
            <FormationsWidget 
              formations={formationsData}
              title="Formations & Cours"
              viewAllHref="/formations"
            />

            {/* RESOURCES WIDGET */}
            <ResourcesWidget 
              resources={resourcesForWidget}
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

            {/* 3. Profile Visibility & Adhesion Summary */}
            <ProfileSummaryWidget
              prenom={profile.prenom}
              nom={profile.nom}
              photo_url={profile.photo_url}
              specialite={profile.specialite}
              organisation={profile.organisation}
              pays={profile.pays}
              ville={profile.ville}
              categorie={profile.categorie}
              isAdhesionActive={isAdhesionActive}
              joursRestants={joursRestants}
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
