import { redirect } from "next/navigation"
import { auth } from "@/lib/auth/server"
import { db } from "@/db"
import { users, evenements, inscriptions_evenement, documents, opportunites, cotisations, visite_guidee } from "@/db/schema"
import { and, asc, count, eq, desc, gte } from "drizzle-orm"
import { completionProfil } from "@/lib/reseau/profil-schema"
import { parseList } from "@/lib/reseau/profil"
import { suiviFormations } from "@/lib/formations/suivi.server"
import { compterInvitations, compterMessagesNonLus } from "@/lib/membres/compteurs.server"
import { getAllFormations } from "@/lib/cache/public-queries"
import { labelDomaine, labelType } from "@/lib/bibliotheque/taxonomie"
import { categorieSansCotisation, gratuiteEnCours } from "@/lib/adhesion"

import {
  DashboardHeader,
  ATraiter,
  BibliothequeWidget,
  FormationsWidget,
  EventWidget,
  OpportunitiesWidget,
  EntreprendreEncart,
  ProfileSummaryWidget,
  VisiteGuidee,
} from "@/components/modules/dashboard"

export const metadata = { title: "Tableau de bord | agrolide" }

/** En dessous de ce pourcentage, « Compléter mon profil » apparaît dans la bande « À traiter ». */
const SEUIL_PROFIL_COMPLET = 80

/**
 * Tableau de bord : d'abord ce qui attend une réponse (bande conditionnelle), puis la bibliothèque, mon compte,
 * mes formations et événements (ou, à défaut, une vitrine), les dernières offres et l'accès à Entreprendre.
 * Un membre neuf voit des « premiers pas » et des vitrines ; un membre actif voit sa formation et son prochain événement.
 */
export default async function DashboardPage({ searchParams }: { searchParams: Promise<{ [cle: string]: string | string[] | undefined }> }) {
  const { visite } = await searchParams
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
    totalDocs,
    evenementsOuverts,
    formationsCatalogue,
    invitations,
    messagesNonLus,
    visiteDejaVue,
  ] = await Promise.all([
    db.select({
      id: users.id,
      email: users.email,
      image: users.image,
      prenom: users.prenom,
      nom: users.nom,
      photo_url: users.photo_url,
      categorie: users.categorie,
      est_organisation: users.est_organisation,
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

    // Mes prochains événements : les premiers à venir parmi ceux auxquels je suis inscrit (le premier est « mon prochain »).
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
    .limit(3),

    db.query.opportunites.findMany({
      where: eq(opportunites.statut, "publie"),
      orderBy: [desc(opportunites.created_at)],
      limit: 3
    }),

    // Progression réelle (inscriptions_formation + progression_lecons), pas les dernières formations du catalogue.
    suiviFormations(userId),

    // Quatre derniers ajouts : seulement les colonnes affichées (pas le résumé, les mots-clés, la clé de fichier…).
    db.select({ id: documents.id, titre: documents.titre, domaine: documents.domaine, type_doc: documents.type_doc, thematique: documents.thematique })
      .from(documents)
      .where(eq(documents.statut, "publie"))
      .orderBy(desc(documents.created_at))
      .limit(4),

    // Compteur exact de la bibliothèque : un COUNT sur l'index (statut, published_at).
    db.select({ total: count() }).from(documents).where(eq(documents.statut, "publie")),

    // Vitrine : les trois prochains événements ouverts à tous.
    db.select({
      id: evenements.id,
      titre: evenements.titre,
      date_debut: evenements.date_debut,
      date_fin: evenements.date_fin,
      lieu: evenements.lieu,
      type_evt: evenements.type_evt,
    })
    .from(evenements)
    .where(and(eq(evenements.publie, true), gte(evenements.date_debut, nowIso)))
    .orderBy(asc(evenements.date_debut))
    .limit(3),

    // Catalogue des formations : la même liste, en cache (1 h), que le catalogue : pas d'appel D1 à chaque visite.
    getAllFormations().catch(() => []),

    compterInvitations(userId),
    compterMessagesNonLus(userId),

    // Visite guidée déjà vue ou passée ? Table à part : si elle n'existe pas encore (migration 0011), on ne montre rien.
    db.select({ id: visite_guidee.membre_id }).from(visite_guidee).where(eq(visite_guidee.membre_id, userId)).limit(1)
      .then((rows) => rows.length > 0 ? "vue" as const : "jamais" as const)
      .catch(() => "indisponible" as const),
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
  // Pendant l'année gratuite (ou pour un profil Passionné), rien à régler.
  const gratuit = !isAdhesionActive && (categorieSansCotisation(profile.categorie, profile.est_organisation) || gratuiteEnCours())
  const cotisationARegler = !isAdhesionActive && !gratuit

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

  const documentsRecents = recentDocsData.map((doc) => ({
    id: doc.id,
    titre: doc.titre,
    domaine: doc.domaine,
    domaineLabel: labelDomaine(doc.domaine) || doc.thematique || "",
    typeLabel: labelType(doc.type_doc),
  }))

  const catalogue = formationsCatalogue.slice(0, 3).map((f) => ({
    id: f.id,
    titre: f.titre,
    niveau: f.niveau ?? "",
    gratuite: f.prix_fcfa === 0,
  }))

  const profilCompletion = completionProfil({ ...profile, thematiques: parseList(profile.secteurs_expertise) })
  const completion = profilCompletion.pourcentage

  // Membre neuf : rien de commencé (ni formation, ni inscription à un événement à venir).
  const nouveau = !formationEnCours && suivis.length === 0 && prochainesInscriptions.length === 0
  // Le profil passe dans « À traiter » tant qu'il n'est pas assez rempli ; il en disparaît dès qu'il l'est.
  const profilATraiter = completion < SEUIL_PROFIL_COMPLET

  return (
    <div className="flex flex-col space-y-5">
      <DashboardHeader
        userId={userId}
        prenom={profile.prenom}
        nom={profile.nom}
        email={profile.email}
        photo_url={profile.photo_url}
        image={profile.image}
        categorie={profile.categorie}
        specialite={profile.specialite}
        organisation={profile.organisation}
        pays={profile.pays}
        ville={profile.ville}
      />

      {/* Bande conditionnelle : invitations, messages, cotisation. Rien n'est rendu si tout est à zéro. */}
      <ATraiter
        invitations={invitations}
        messages={messagesNonLus}
        cotisationARegler={cotisationARegler}
        profilACompleter={profilATraiter ? completion : null}
      />

      {/* La bibliothèque en tête, mon compte à côté */}
      <div className="grid grid-cols-1 items-start gap-5 xl:grid-cols-12">
        <div className="xl:col-span-8">
          <BibliothequeWidget total={Number(totalDocs[0]?.total ?? 0)} documents={documentsRecents} />
        </div>
        <div className="xl:col-span-4">
          <ProfileSummaryWidget
            categorie={profile.categorie}
            estOrganisation={profile.est_organisation}
            isAdhesionActive={isAdhesionActive}
            joursRestants={joursRestants}
            annuaireVisible={profile.annuaire_visible}
            completion={completion}
            manquants={profilCompletion.manquants}
            boutonPrincipal={nouveau}
          />
        </div>
      </div>

      {/* Formations et événements : les miens, ou une vitrine */}
      <div data-visite="apprendre" className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <FormationsWidget formation={formationEnCours} catalogue={catalogue} />
        <EventWidget mesEvenements={prochainesInscriptions} aVenir={evenementsOuverts} />
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-12">
        <div className="xl:col-span-8">
          <OpportunitiesWidget opportunities={oppsData} />
        </div>
        <div className="xl:col-span-4">
          <EntreprendreEncart />
        </div>
      </div>

      <VisiteGuidee afficher={visite === "1" || visiteDejaVue === "jamais"} />
    </div>
  )
}
