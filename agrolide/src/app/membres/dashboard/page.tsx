import { redirect } from "next/navigation"
import { auth } from "@/lib/auth/server"
import { db } from "@/db"
import { users, notifications, evenements, articles, documents, opportunites, cotisations, formations } from "@/db/schema"
import { and, eq, desc, gte, notInArray } from "drizzle-orm"
import { TYPES_HORS_CLOCHE } from "@/lib/notifications"
import {
  Library,
  Users,
  Briefcase,
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
  const { userId } = await auth()
  if (!userId) redirect("/login")

  const nowIso = new Date().toISOString()

  // Toutes les requêtes sont indépendantes : on les lance en parallèle
  // (chaque requête D1 est un aller-retour réseau, en série elles s'additionnent).
  const [
    userRows,
    userCotisation,
    evtsData,
    upcomingEventsRows,
    oppsData,
    opportunitesRows,
    formationsData,
    publishedDocsRows,
    publishedArticlesRows,
    recentDocsData,
    artsData,
    notifsData,
    directoryMembers,
  ] = await Promise.all([
    db.select({
      id: users.id,
      prenom: users.prenom,
      nom: users.nom,
      photo_url: users.photo_url,
      categorie: users.categorie,
      specialite: users.specialite,
      organisation: users.organisation,
      ville: users.ville,
      pays: users.pays,
      annuaire_visible: users.annuaire_visible
    })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1),

    db.query.cotisations.findFirst({
      where: eq(cotisations.membre_id, userId),
      orderBy: [desc(cotisations.created_at)]
    }),

    db.query.evenements.findMany({
      where: gte(evenements.date_debut, nowIso),
      orderBy: (evts, { asc }) => [asc(evts.date_debut)],
      limit: 1
    }),

    db.select({ id: evenements.id }).from(evenements).where(gte(evenements.date_debut, nowIso)).limit(100),

    db.query.opportunites.findMany({
      orderBy: [desc(opportunites.created_at)],
      limit: 5
    }),

    db.select({ id: opportunites.id }).from(opportunites).limit(100),

    db.query.formations.findMany({
      orderBy: [desc(formations.created_at)],
      limit: 5
    }),

    db.select({ id: documents.id }).from(documents).where(eq(documents.statut, "publie")),
    db.select({ id: articles.id }).from(articles).where(eq(articles.statut, "publie")),

    db.query.documents.findMany({
      where: eq(documents.statut, "publie"),
      orderBy: [desc(documents.created_at)],
      limit: 4
    }),
    db.query.articles.findMany({
      where: eq(articles.statut, "publie"),
      orderBy: [desc(articles.published_at)],
      limit: 4
    }),

    db.query.notifications.findMany({
      where: and(eq(notifications.user_id, userId), notInArray(notifications.type, TYPES_HORS_CLOCHE)),
      orderBy: [desc(notifications.created_at)],
      limit: 5
    }),

    db.select({ id: users.id }).from(users).limit(500),
  ])

  const profile = userRows[0] || null
  if (!profile) redirect("/login")

  // Cotisation
  const dateFinRaw = userCotisation?.date_fin ? new Date(userCotisation.date_fin) : null
  const dateFinCotisation = (dateFinRaw && !isNaN(dateFinRaw.getTime())) ? dateFinRaw : null
  const joursRestants = dateFinCotisation
    ? Math.max(0, Math.ceil((dateFinCotisation.getTime() - Date.now()) / (1000 * 3600 * 24)))
    : 0
  const isAdhesionActive = !!dateFinCotisation && joursRestants > 0

  const prochainEvt = evtsData[0] || null
  const upcomingEventsCount = upcomingEventsRows.length
  const opportunitesCount = opportunitesRows.length
  const membersCount = directoryMembers.length
  const totalResourcesCount = (publishedDocsRows.length || 0) + (publishedArticlesRows.length || 0)

  const resourcesForWidget = recentDocsData.length > 0
    ? recentDocsData.map(doc => ({
        id: doc.id,
        titre: doc.titre,
        categorie: doc.thematique || doc.type_doc || "Guide Technique",
        slug: doc.id,
        published_at: doc.created_at
      }))
    : artsData.map(art => ({
        id: art.id,
        titre: art.titre,
        categorie: art.categorie || "Article",
        slug: art.slug || art.id,
        published_at: art.published_at
      }))

  return (
    <div className="h-full flex flex-col space-y-5">
      {/* ================= 1. EN-TÊTE ================= */}
      <DashboardHeader
        prenom={profile.prenom}
        nom={profile.nom}
        categorie={profile.categorie}
        specialite={profile.specialite}
        organisation={profile.organisation}
        pays={profile.pays}
        ville={profile.ville}
      />

      {/* ================= 2. CHIFFRES CLÉS (valeurs réelles) ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 shrink-0">
        <StatCard
          variant="default"
          label="Bibliothèque"
          icon={Library}
          tone="brand"
          value={totalResourcesCount}
          subtext="Fiches & Guides techniques"
          action={{ href: "/membres/bibliotheque", label: "Consulter les fiches" }}
        />

        <StatCard
          variant="default"
          label="Réseau"
          icon={Users}
          tone="leaf"
          value={membersCount}
          subtext={membersCount > 1 ? "Membres inscrits" : "Membre inscrit"}
          action={{ href: "/membres/annuaire", label: "Explorer l'annuaire" }}
        />

        <StatCard
          variant="default"
          label="Opportunités"
          icon={Briefcase}
          tone="info"
          value={opportunitesCount}
          subtext="Offres & Appels à projets"
          action={{ href: "/membres/opportunites", label: "Voir les offres" }}
        />

        <StatCard
          variant="default"
          label="Événements"
          icon={Calendar}
          tone="warning"
          value={upcomingEventsCount}
          subtext={upcomingEventsCount > 1 ? "Événements à venir" : "Événement à venir"}
          action={{ href: "/membres/evenements", label: "Voir le calendrier" }}
        />
      </div>

      {/* ================= 3. GRILLE PRINCIPALE (8/12 - 4/12) ================= */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 flex-1 min-h-0 items-start">

        {/* ----- COLONNE PRINCIPALE ----- */}
        <div className="xl:col-span-8 flex flex-col gap-5 min-h-0">
          <OpportunitiesWidget
            opportunities={oppsData}
            title="Opportunités & Appels à Projets"
            viewAllHref="/membres/opportunites"
          />

          <FormationsWidget
            formations={formationsData}
            title="Formations & Cours"
            viewAllHref="/membres/formations/catalogue"
          />

          <ResourcesWidget
            resources={resourcesForWidget}
            title="Fiches Techniques & Bibliothèque"
            viewAllHref="/membres/bibliotheque"
          />
        </div>

        {/* ----- COLONNE LATÉRALE ----- */}
        <div className="xl:col-span-4 flex flex-col gap-5 min-h-0">
          <EventWidget event={prochainEvt} />

          <ActivityTimeline
            notifications={notifsData}
            title="Activités & Notifications"
            viewAllHref="/membres/notifications"
          />

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
            annuaireVisible={profile.annuaire_visible}
          />
        </div>

      </div>
    </div>
  )
}
