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
              <StatCard.Root variant="featured">
                <StatCard.Header>
                  <StatCard.Label icon={CreditCard}>Adhésion</StatCard.Label>
                  <StatCard.Badge variant={isAdhesionActive ? "success" : "error"}>
                    {isAdhesionActive ? "Actif" : "Inactif"}
                  </StatCard.Badge>
                </StatCard.Header>
                <StatCard.Content>
                  <div className="flex items-baseline gap-1.5">
                    <StatCard.Value>{joursRestants}</StatCard.Value>
                    <StatCard.Subtext>Jours restants</StatCard.Subtext>
                  </div>
                  <StatCard.Action href="/membres/cotisation" label="Gérer mon adhésion" />
                </StatCard.Content>
              </StatCard.Root>

              {/* Card 2: Formations */}
              <StatCard.Root variant="default">
                <StatCard.Header>
                  <StatCard.Label>Formations</StatCard.Label>
                  <StatCard.Icon 
                    icon={BookOpen} 
                    colorClass="text-blue-600" 
                    bgClass="bg-blue-50" 
                  />
                </StatCard.Header>
                <StatCard.Content>
                  <div>
                    <StatCard.Value>5</StatCard.Value>
                    <div className="text-[11px] text-gray-500 mt-1 font-medium">En cours ou terminées</div>
                  </div>
                  <StatCard.Action href="/membres/formations" label="Voir les formations" />
                </StatCard.Content>
              </StatCard.Root>

              {/* Card 3: Opportunités */}
              <StatCard.Root variant="default">
                <StatCard.Header>
                  <StatCard.Label>Opportunités</StatCard.Label>
                  <StatCard.Icon 
                    icon={Briefcase} 
                    colorClass="text-amber-600" 
                    bgClass="bg-amber-50" 
                  />
                </StatCard.Header>
                <StatCard.Content>
                  <div>
                    <StatCard.Value>{oppsData.length}</StatCard.Value>
                    <div className="text-[11px] text-gray-500 mt-1 font-medium">Postes & Missions</div>
                  </div>
                  <StatCard.Action href="/membres/opportunites" label="Voir les opportunités" />
                </StatCard.Content>
              </StatCard.Root>

              {/* Card 4: Ressources */}
              <StatCard.Root variant="default">
                <StatCard.Header>
                  <StatCard.Label>Ressources</StatCard.Label>
                  <StatCard.Icon 
                    icon={Library} 
                    colorClass="text-[#1b5e38]" 
                    bgClass="bg-[#f0fdf4]" 
                  />
                </StatCard.Header>
                <StatCard.Content>
                  <div>
                    <StatCard.Value>{artsData.length}</StatCard.Value>
                    <div className="text-[11px] text-gray-500 mt-1 font-medium">Articles & Guides</div>
                  </div>
                  <StatCard.Action href="/membres/bibliotheque" label="Explorer la bibliothèque" />
                </StatCard.Content>
              </StatCard.Root>

            </div>

            {/* OPPORTUNITIES WIDGET */}
            <OpportunitiesWidget.Root>
              <OpportunitiesWidget.Header 
                title="Dernières Opportunités"
                viewAllHref="/membres/opportunites"
                count={oppsData.length}
              />
              {oppsData.length > 0 ? (
                <OpportunitiesWidget.Table>
                  {oppsData.map((opp) => (
                    <OpportunitiesWidget.Row
                      key={opp.id}
                      id={opp.id}
                      titre={opp.titre}
                      organisation={opp.organisation}
                      pays={opp.pays}
                      type_opp={opp.type_opp}
                      createdAt={opp.created_at}
                      href="/membres/opportunites"
                    />
                  ))}
                </OpportunitiesWidget.Table>
              ) : (
                <OpportunitiesWidget.EmptyState message="Aucune opportunité pour l'instant." />
              )}
            </OpportunitiesWidget.Root>

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
