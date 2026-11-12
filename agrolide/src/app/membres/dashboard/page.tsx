import { redirect } from "next/navigation"
import { auth } from "@/lib/auth/server"
import { db } from "@/db"
import { users, evenements, inscriptions_evenement, documents, opportunites, cotisations } from "@/db/schema"
import { and, asc, eq, desc, gte } from "drizzle-orm"
import { completionProfil } from "@/lib/reseau/profil-schema"
import { parseList } from "@/lib/reseau/profil"
import { suiviFormations } from "@/lib/formations/suivi.server"
import { compterInvitations, compterMessagesNonLus } from "@/lib/membres/compteurs.server"

import {
  DashboardHeader,
  OpportunitiesWidget,
  EventWidget,
  ResourcesWidget,
  ProfileSummaryWidget,
  ReprendreFormationWidget,
  ReseauWidget,
} from "@/components/modules/dashboard"

export const metadata = { title: "Tableau de bord | Agrolide" }

/**
 * Tableau de bord recentré sur « moi » : où j'en suis dans ma formation, mon prochain événement,
 * ce qui attend une réponse dans mon réseau, l'état de ma cotisation et les dernières offres.
 * (Les chiffres généraux — nombre de membres, de documents… — étaient des doublons de la barre latérale.)
 */
export default async function DashboardPage() {
  const { userId } = await auth()
  if (!userId) redirect("/login")

  const nowIso = new Date().toISOString()

  // Toutes les requêtes sont indépendantes : on les lance en parallèle
  // (chaque requête D1 est un aller-retour réseau, en série elles s'additionnent).
  const [
    userRows,
    userCotisation,
    prochainesInscriptions,
    oppsData,
    suivis,
    recentDocsData,
    invitations,
    messagesNonLus,
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
      annuaire_visible: users.annuaire_visible,
      // Champs lus par l'indicateur « profil complété ».
      biographie: users.biographie,
      secteurs_expertise: users.secteurs_expertise,
      langues: users.langues,
      niveau_etudes: users.niveau_etudes,
      linkedin_url: users.linkedin_url,
      site_web_url: users.site_web_url,
    })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1),

    db.query.cotisations.findFirst({
      where: eq(cotisations.membre_id, userId),
      orderBy: [desc(cotisations.created_at)]
    }),

    // Mon prochain événement : le premier à venir parmi ceux auxquels je suis inscrit.
    db.select({
      id: evenements.id,
      titre: evenements.titre,
      date_debut: evenements.date_debut,
      date_fin: evenements.date_fin,
      lieu: evenements.lieu,
      type_evt: evenements.type_evt,
    })
    .from(inscriptions_evenement)
    .innerJoin(evenements, eq(evenements.id, inscriptions_evenement.evenement_id))
    .where(and(
      eq(inscriptions_evenement.membre_id, userId),
      eq(evenements.publie, true),
      gte(evenements.date_debut, nowIso),
    ))
    .orderBy(asc(evenements.date_debut))
    .limit(1),

    db.query.opportunites.findMany({
      where: eq(opportunites.statut, "publie"),
      orderBy: [desc(opportunites.created_at)],
      limit: 5
    }),

    // Progression réelle (inscriptions_formation + progression_lecons), pas les dernières formations du catalogue.
    suiviFormations(userId),

    db.query.documents.findMany({
      where: eq(documents.statut, "publie"),
      orderBy: [desc(documents.created_at)],
      limit: 4
    }),

    compterInvitations(userId),
    compterMessagesNonLus(userId),
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

  const prochainEvt = prochainesInscriptions[0] || null

  // Formation à reprendre : la plus récemment suivie parmi celles qui ne sont pas terminées ni annulées.
  const enCours = suivis
    .filter((s) => !s.terminee && s.statut !== "annule" && (s.total > 0 || s.lienExterne))
    .sort((a, b) => (b.derniereActivite ?? "").localeCompare(a.derniereActivite ?? ""))[0]
  const formationEnCours = enCours
    ? {
        formationId: enCours.formationId,
        titre: enCours.titre,
        faites: enCours.faites,
        total: enCours.total,
        pourcent: enCours.pourcent,
        prochaineLeconId: enCours.prochaineLeconId,
      }
    : null

  const resourcesForWidget = recentDocsData.map(doc => ({
    id: doc.id,
    titre: doc.titre,
    categorie: doc.thematique || doc.type_doc || "Guide Technique",
    slug: doc.id,
    published_at: doc.created_at
  }))

  return (
    <div className="flex flex-col space-y-5">
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

      {/* ================= 2. CE QUI ME CONCERNE : formation, événement, réseau ================= */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        <ReprendreFormationWidget formation={formationEnCours} />
        <EventWidget event={prochainEvt} />
        <ReseauWidget invitations={invitations} messages={messagesNonLus} />
      </div>

      {/* ================= 3. GRILLE PRINCIPALE (8/12 - 4/12) ================= */}
      <div className="grid grid-cols-1 items-start gap-5 xl:grid-cols-12">

        {/* ----- COLONNE PRINCIPALE ----- */}
        <div className="flex flex-col gap-5 xl:col-span-8">
          <OpportunitiesWidget
            opportunities={oppsData}
            title="Dernières opportunités"
            viewAllHref="/membres/opportunites"
          />

          <ResourcesWidget
            resources={resourcesForWidget}
            title="Nouveautés de la bibliothèque"
            viewAllHref="/membres/bibliotheque"
          />
        </div>

        {/* ----- COLONNE LATÉRALE : mon profil et ma cotisation ----- */}
        <div className="flex flex-col gap-5 xl:col-span-4">
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
            completion={completionProfil({ ...profile, thematiques: parseList(profile.secteurs_expertise) }).pourcentage}
          />
        </div>

      </div>
    </div>
  )
}
