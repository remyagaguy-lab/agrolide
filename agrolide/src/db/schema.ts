import { text, integer, sqliteTable, primaryKey, real, index, uniqueIndex } from "drizzle-orm/sqlite-core";

export const agripreneurs = sqliteTable("agripreneurs", {
  created_at: text("created_at"),
  description: text("description"),
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  lien_web: text("lien_web"),
  nom: text("nom").notNull(),
  pays: text("pays"),
  photo_url: text("photo_url"),
  projet: text("projet").notNull(),
  publie: integer("publie", { mode: "boolean" }),
  secteur: text("secteur"),
  temoignage: text("temoignage"),
});

export const articles = sqliteTable("articles", {
  acces: text("acces"),
  auteur_externe: text("auteur_externe"),
  auteur_id: text("auteur_id"),
  categorie: text("categorie").notNull(),
  contenu_json: text("contenu_json").notNull(),
  created_at: text("created_at"),
  cta_lien: text("cta_lien"),
  cta_texte: text("cta_texte"),
  extrait: text("extrait"),
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  image_une_url: text("image_une_url"),
  published_at: text("published_at"),
  slug: text("slug").notNull(),
  statut: text("statut"),
  tags: text("tags"),
  titre: text("titre").notNull(),
  updated_at: text("updated_at"),
}, (t) => [
  index("idx_articles_statut_published_at").on(t.statut, t.published_at),
  index("idx_articles_slug").on(t.slug),
  index("idx_articles_auteur_id").on(t.auteur_id),
]);

export const avis_formation = sqliteTable("avis_formation", {
  commentaire: text("commentaire"),
  created_at: text("created_at"),
  formation_id: text("formation_id").notNull(),
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  membre_id: text("membre_id").notNull(),
  note: integer("note").notNull(),
}, (t) => [
  index("idx_avis_formation_formation_id").on(t.formation_id),
]);

export const campagnes_financement = sqliteTable("campagnes_financement", {
  active: integer("active", { mode: "boolean" }),
  created_at: text("created_at"),
  date_debut: text("date_debut"),
  date_fin: text("date_fin"),
  description: text("description"),
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  objectif_fcfa: integer("objectif_fcfa").notNull(),
  titre: text("titre").notNull(),
});

export const candidatures_incubation = sqliteTable("candidatures_incubation", {
  created_at: text("created_at"),
  cv_r2_key: text("cv_r2_key"),
  email: text("email").notNull(),
  financement_recu: integer("financement_recu", { mode: "boolean" }),
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  marche_cible: text("marche_cible"),
  modele_eco: text("modele_eco"),
  montant_financement: text("montant_financement"),
  motivation: text("motivation"),
  nom: text("nom").notNull(),
  nom_projet: text("nom_projet").notNull(),
  pays: text("pays"),
  prenom: text("prenom").notNull(),
  probleme: text("probleme"),
  secteur: text("secteur"),
  solution: text("solution"),
  stade: text("stade"),
  statut: text("statut"),
  telephone: text("telephone"),
  besoins: text("besoins"),
});

export const contributions = sqliteTable("contributions", {
  anonyme: integer("anonyme", { mode: "boolean" }),
  created_at: text("created_at"),
  email: text("email").notNull(),
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  methode: text("methode").notNull(),
  montant_fcfa: integer("montant_fcfa").notNull(),
  prenom: text("prenom"),
  provider_ref: text("provider_ref"),
  statut: text("statut"),
}, (t) => [
  index("idx_contributions_statut").on(t.statut),
]);

export const cotisations = sqliteTable("cotisations", {
  categorie: text("categorie").notNull(),
  created_at: text("created_at"),
  date_debut: text("date_debut"),
  date_fin: text("date_fin"),
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  membre_id: text("membre_id").notNull(),
  methode: text("methode").notNull(),
  montant_fcfa: integer("montant_fcfa").notNull(),
  provider_ref: text("provider_ref"),
  statut: text("statut"),
}, (t) => [
  index("idx_cotisations_membre_id").on(t.membre_id),
  index("idx_cotisations_statut").on(t.statut),
]);

export const demandes_service = sqliteTable("demandes_service", {
  budget_tranche: text("budget_tranche"),
  created_at: text("created_at"),
  delai: text("delai"),
  description: text("description").notNull(),
  email: text("email").notNull(),
  fichier_r2_key: text("fichier_r2_key"),
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  nom: text("nom").notNull(),
  organisation: text("organisation"),
  pays: text("pays"),
  prenom: text("prenom").notNull(),
  statut: text("statut"),
  telephone: text("telephone"),
  type_service: text("type_service").notNull(),
});

export const documents = sqliteTable("documents", {
  acces: text("acces").notNull(),
  annee: integer("annee"),
  auteurs: text("auteurs").notNull(),
  created_at: text("created_at"),
  depose_par: text("depose_par"),
  fichier_r2_key: text("fichier_r2_key").notNull(),
  filiere: text("filiere"),
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  langue: text("langue"),
  nb_telechargements: integer("nb_telechargements"),
  pays: text("pays"),
  published_at: text("published_at"),
  resume: text("resume"),
  statut: text("statut").notNull(),
  taille_octets: integer("taille_octets"),
  thematique: text("thematique").notNull(),
  titre: text("titre").notNull(),
  type_doc: text("type_doc").notNull(),
  valide_par: text("valide_par"),
  // Classement de la bibliothèque (voir src/lib/bibliotheque/taxonomie.ts pour les valeurs)
  domaine: text("domaine"),
  sous_domaine: text("sous_domaine"),
  public_cible: text("public_cible"),
  niveau: text("niveau"),
  licence: text("licence"),
  source_organisation: text("source_organisation"),
  mots_cles: text("mots_cles", { mode: "json" }).$type<string[]>(),
  reference: text("reference"), // identifiant stable de la fiche de curation (DOC-00001)
}, (t) => [
  index("idx_documents_statut_published_at").on(t.statut, t.published_at),
  index("idx_documents_domaine").on(t.statut, t.domaine, t.sous_domaine),
  uniqueIndex("uq_documents_reference").on(t.reference),
]);

export const evenements = sqliteTable("evenements", {
  created_at: text("created_at"),
  date_debut: text("date_debut").notNull(),
  date_fin: text("date_fin"),
  description: text("description"),
  en_ligne: integer("en_ligne", { mode: "boolean" }),
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  image_url: text("image_url"),
  /** Autres affiches (liste JSON d'adresses), montrées à la suite de l'affiche principale (migration 0018). */
  affiches_supplementaires: text("affiches_supplementaires"),
  /** Faux : entrée libre, aucun processus d'inscription (ni bouton, ni mention « inscrit »). Vide ou vrai : inscription proposée. */
  inscription_requise: integer("inscription_requise", { mode: "boolean" }),
  lien_inscription: text("lien_inscription"),
  /** Replay d'une séance passée : réservé aux inscrits (migration 0016) ; jamais envoyé aux pages publiques. */
  lien_replay: text("lien_replay"),
  /** Document de la bibliothèque rattaché (diaporama du webinaire). */
  document_id: text("document_id"),
  lieu: text("lieu"),
  pays: text("pays"),
  places_max: integer("places_max"),
  presentation_url: text("presentation_url"),
  publie: integer("publie", { mode: "boolean" }),
  ressources_url: text("ressources_url"),
  titre: text("titre").notNull(),
  type_evt: text("type_evt").notNull(),
}, (t) => [
  index("idx_evenements_publie_date_debut").on(t.publie, t.date_debut),
]);

export const formations = sqliteTable("formations", {
  acces: text("acces"),
  created_at: text("created_at").$defaultFn(() => new Date().toISOString()),
  description: text("description"),
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  intervenants: text("intervenants", { mode: "json" }),
  modalite: text("modalite").notNull(),
  niveau: text("niveau"),
  prix_fcfa: integer("prix_fcfa"),
  programme_json: text("programme_json", { mode: "json" }), // Legacy support
  thematique: text("thematique"),
  titre: text("titre").notNull(),
  statut: text("statut"),
  cover_image_url: text("cover_image_url"), // Added for course display
  lien_externe: text("lien_externe"),
  source_externe: text("source_externe").default("Agrolide"), // editorial:ignore valeur stockée en base
}, (t) => [
  index("idx_formations_created_at").on(t.created_at),
]);

export const formation_modules = sqliteTable("formation_modules", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  formation_id: text("formation_id").notNull(),
  titre: text("titre").notNull(),
  description: text("description"),
  ordre: integer("ordre").notNull(),
  created_at: text("created_at").$defaultFn(() => new Date().toISOString()),
}, (t) => [
  index("idx_formation_modules_formation_id").on(t.formation_id),
]);

export const formation_lecons = sqliteTable("formation_lecons", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  module_id: text("module_id").notNull(),
  titre: text("titre").notNull(),
  contenu: text("contenu").notNull(), // Markdown or HTML
  duree_minutes: integer("duree_minutes"),
  ordre: integer("ordre").notNull(),
  quiz_json: text("quiz_json", { mode: "json" }), // Store quiz questions array
  created_at: text("created_at").$defaultFn(() => new Date().toISOString()),
}, (t) => [
  index("idx_formation_lecons_module_id").on(t.module_id),
]);

export const progression_lecons = sqliteTable("progression_lecons", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  membre_id: text("membre_id").notNull(),
  lecon_id: text("lecon_id").notNull(),
  completed_at: text("completed_at").$defaultFn(() => new Date().toISOString()),
}, (t) => [
  index("idx_progression_lecons_membre_id").on(t.membre_id),
  index("idx_progression_lecons_lecon_id").on(t.lecon_id),
]);

export const forum_categories = sqliteTable("forum_categories", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  nom: text("nom").notNull(),
  ordre: integer("ordre"),
});

export const forum_fils = sqliteTable("forum_fils", {
  auteur_id: text("auteur_id").notNull(),
  categorie_id: text("categorie_id").notNull(),
  created_at: text("created_at"),
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  last_activity_at: text("last_activity_at"),
  nb_reponses: integer("nb_reponses"),
  statut: text("statut"),
  titre: text("titre").notNull(),
}, (t) => [
  index("idx_forum_fils_categorie_id").on(t.categorie_id),
  index("idx_forum_fils_auteur_id").on(t.auteur_id),
  index("idx_forum_fils_created_at").on(t.created_at),
]);

export const forum_messages = sqliteTable("forum_messages", {
  auteur_id: text("auteur_id").notNull(),
  contenu: text("contenu").notNull(),
  created_at: text("created_at"),
  fil_id: text("fil_id").notNull(),
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  statut: text("statut"),
  updated_at: text("updated_at"),
}, (t) => [
  index("idx_forum_messages_fil_id").on(t.fil_id),
  index("idx_forum_messages_auteur_id").on(t.auteur_id),
]);

export const commentaires_forum = sqliteTable("commentaires_forum", {
  auteur_id: text("auteur_id").notNull(),
  contenu: text("contenu").notNull(),
  created_at: text("created_at"),
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  message_id: text("message_id").notNull(),
  updated_at: text("updated_at"),
}, (t) => [
  index("idx_commentaires_forum_message_id").on(t.message_id),
]);

export const contacts_partenariat = sqliteTable("contacts_partenariat", {
  budget: text("budget"),
  created_at: text("created_at").$defaultFn(() => new Date().toISOString()),
  email: text("email").notNull(),
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  message: text("message").notNull(),
  nature_collaboration: text("nature_collaboration").notNull(),
  raison_sociale: text("raison_sociale").notNull(),
  secteur: text("secteur").notNull(),
});

export const inscriptions_evenement = sqliteTable("inscriptions_evenement", {
  created_at: text("created_at"),
  email_externe: text("email_externe"),
  evenement_id: text("evenement_id").notNull(),
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  membre_id: text("membre_id"),
  nom: text("nom"),
  prenom: text("prenom"),
}, (t) => [
  index("idx_inscriptions_evenement_evenement_id").on(t.evenement_id),
  index("idx_inscriptions_evenement_membre_id").on(t.membre_id),
]);

export const inscriptions_formation = sqliteTable("inscriptions_formation", {
  certificat_r2_key: text("certificat_r2_key"),
  created_at: text("created_at"),
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  membre_id: text("membre_id").notNull(),
  formation_id: text("formation_id"), // Added for async formations
  session_id: text("session_id"), // Made optional
  statut: text("statut"),
  /** Formations externes : date du premier clic sur « Accéder au cours » (vide tant que le membre n'a pas ouvert le cours). */
  premier_acces_le: text("premier_acces_le"),
}, (t) => [
  index("idx_inscriptions_formation_membre_id_formation_id").on(t.membre_id, t.formation_id),
  index("idx_inscriptions_formation_formation_id").on(t.formation_id),
]);

/** Réponses au questionnaire d'inscription d'une formation Agrolide (projet, domaine, objectif, attentes). */
export const reponses_inscription_formation = sqliteTable("reponses_inscription_formation", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  membre_id: text("membre_id").notNull(),
  formation_id: text("formation_id").notNull(),
  projet: text("projet"),
  domaine: text("domaine"),
  objectif: text("objectif"),
  attentes: text("attentes"),
  created_at: text("created_at").$defaultFn(() => new Date().toISOString()),
}, (t) => [
  index("idx_reponses_inscription_formation").on(t.formation_id, t.membre_id),
]);

/** Codes d'accès aux formations Agrolide (challenges) : un code = une personne, usage unique. */
export const codes_acces_formation = sqliteTable("codes_acces_formation", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  code: text("code").notNull(),
  /** Vide = valable pour toutes les formations Agrolide. */
  formation_id: text("formation_id"),
  /** Nom du challenge ou de la campagne d'origine. */
  lot: text("lot"),
  expire_le: text("expire_le"),
  utilise_par: text("utilise_par"),
  utilise_le: text("utilise_le"),
  created_at: text("created_at").$defaultFn(() => new Date().toISOString()),
}, (t) => [
  uniqueIndex("idx_codes_acces_formation_code").on(t.code),
  index("idx_codes_acces_formation_lot").on(t.lot),
]);

/**
 * Abonnements aux notifications push (Web Push) : un appareil (navigateur ou application installée) = une ligne.
 * `endpoint` est unique : se réabonner depuis le même appareil met la ligne à jour au lieu de la dupliquer.
 * `categories` : catégories d'alertes choisies par le membre pour cet appareil, séparées par des virgules
 * (messages, reseau, opportunites, activite, compte).
 */
export const abonnements_push = sqliteTable("abonnements_push", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  user_id: text("user_id").notNull(),
  endpoint: text("endpoint").notNull(),
  p256dh: text("p256dh").notNull(),
  auth: text("auth").notNull(),
  categories: text("categories").notNull().default("messages,reseau,opportunites,activite,compte"),
  user_agent: text("user_agent"),
  created_at: text("created_at").$defaultFn(() => new Date().toISOString()),
  derniere_utilisation: text("derniere_utilisation"),
}, (t) => [
  uniqueIndex("idx_abonnements_push_endpoint").on(t.endpoint),
  index("idx_abonnements_push_user_id").on(t.user_id),
]);

export const messages = sqliteTable("messages", {
  contenu: text("contenu").notNull(),
  created_at: text("created_at"),
  destinataire_id: text("destinataire_id").notNull(),
  expediteur_id: text("expediteur_id").notNull(),
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  lu: integer("lu", { mode: "boolean" }),
}, (t) => [
  index("idx_messages_destinataire_id_lu").on(t.destinataire_id, t.lu),
  index("idx_messages_expediteur_id").on(t.expediteur_id),
]);

export const notifications = sqliteTable("notifications", {
  contenu: text("contenu").notNull(),
  created_at: text("created_at"),
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  lien: text("lien"),
  lu: integer("lu", { mode: "boolean" }),
  type: text("type").notNull(),
  user_id: text("user_id").notNull(),
}, (t) => [
  index("idx_notifications_user_id_lu").on(t.user_id, t.lu),
]);

export const opportunites = sqliteTable("opportunites", {
  created_at: text("created_at"),
  date_limite: text("date_limite"),
  description: text("description"),
  filiere: text("filiere"),
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  lien_externe: text("lien_externe"),
  organisation: text("organisation"),
  pays: text("pays"),
  poste_par: text("poste_par"),
  statut: text("statut"),
  titre: text("titre").notNull(),
  type_opp: text("type_opp").notNull(),
}, (t) => [
  index("idx_opportunites_statut").on(t.statut),
]);

export const pages_statiques = sqliteTable("pages_statiques", {
  contenu_json: text("contenu_json", { mode: "json" }),
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  meta_description: text("meta_description"),
  slug: text("slug").notNull(),
  titre: text("titre"),
  updated_at: text("updated_at"),
}, (t) => [
  index("idx_pages_statiques_slug").on(t.slug),
]);

export const partenaires = sqliteTable("partenaires", {
  contact_nom: text("contact_nom"),
  contact_titre: text("contact_titre"),
  created_at: text("created_at"),
  description: text("description"),
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  logo_url: text("logo_url"),
  nom: text("nom").notNull(),
  ordre: integer("ordre"),
  publie: integer("publie", { mode: "boolean" }),
  site_web: text("site_web"),
  temoignage: text("temoignage"),
});


export const sessions_formation = sqliteTable("sessions_formation", {
  created_at: text("created_at"),
  date_debut: text("date_debut").notNull(),
  date_fin: text("date_fin").notNull(),
  formation_id: text("formation_id").notNull(),
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  lien_rejoindre: text("lien_rejoindre"),
  lieu: text("lieu"),
  places_max: integer("places_max"),
  places_restantes: integer("places_restantes"),
  statut: text("statut"),
}, (t) => [
  index("idx_sessions_formation_formation_id").on(t.formation_id),
]);

export const telechargements = sqliteTable("telechargements", {
  created_at: text("created_at"),
  document_id: text("document_id").notNull(),
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  membre_id: text("membre_id").notNull(),
}, (t) => [
  index("idx_telechargements_document_id").on(t.document_id),
  index("idx_telechargements_membre_id").on(t.membre_id),
]);

export const temoignages = sqliteTable("temoignages", {
  categorie: text("categorie"),
  citation: text("citation").notNull(),
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  nom: text("nom"),
  ordre: integer("ordre"),
  pays: text("pays"),
  photo_url: text("photo_url"),
  prenom: text("prenom").notNull(),
  publie: integer("publie", { mode: "boolean" }),
});

export const webinaires = sqliteTable("webinaires", {
  acces: text("acces"),
  created_at: text("created_at"),
  date_heure: text("date_heure").notNull(),
  description: text("description"),
  duree_minutes: integer("duree_minutes"),
  fiche_resumee_id: text("fiche_resumee_id"),
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  intervenant: text("intervenant"),
  titre: text("titre").notNull(),
  youtube_id: text("youtube_id"),
  youtube_live_id: text("youtube_live_id"),
});


export const users = sqliteTable("user", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text("name"),
  email: text("email").notNull().unique(),
  emailVerified: integer("emailVerified", { mode: "timestamp_ms" }),
  image: text("image"),
  password_hash: text("password_hash"),
  // Profiles fields
  annuaire_visible: integer("annuaire_visible", { mode: "boolean" }),
  biographie: text("biographie"),
  categorie: text("categorie"),
  // Compte de l'organisation elle-même (ex. le compte « agrolide ») : affiche « Organisation » au lieu de la catégorie technique.
  est_organisation: integer("est_organisation", { mode: "boolean" }).default(false),
  // Type d'organisation (Partenaire ou compte organisation) : valeur de la liste proposée ou saisie libre.
  type_organisation: text("type_organisation"),
  langues: text("langues"),
  linkedin_url: text("linkedin_url"),
  newsletter_brevo: integer("newsletter_brevo", { mode: "boolean" }),
  niveau_etudes: text("niveau_etudes"),
  nom: text("nom"),
  notif_evenements: integer("notif_evenements", { mode: "boolean" }),
  notif_opportunites: integer("notif_opportunites", { mode: "boolean" }),
  organisation: text("organisation"),
  ouvert_contact: integer("ouvert_contact", { mode: "boolean" }),
  pays: text("pays"),
  photo_url: text("photo_url"),
  prenom: text("prenom"),
  role_plateforme: text("role_plateforme").default('membre'),
  secteurs_expertise: text("secteurs_expertise"),
  site_web_url: text("site_web_url"),
  specialite: text("specialite"),
  statut_adhesion: text("statut_adhesion").default('gratuit'),
  created_at: text("created_at"),
  updated_at: text("updated_at"),
  ville: text("ville"),
  // Lot 5 du réseau (migration drizzle/0006_reseau_lot5.sql, appliquée) : carte publique opt-in, centres d'intérêt et recherche (JSON, listes fermées).
  profil_public: integer("profil_public", { mode: "boolean" }).default(false),
  centres_interet: text("centres_interet"),
  recherche: text("recherche"),
}, (t) => [
  index("idx_users_role_plateforme").on(t.role_plateforme),
  index("idx_users_statut_adhesion").on(t.statut_adhesion),
]);

// Alias for easier migration
export const profiles = users;

export const accounts = sqliteTable(
  "account",
  {
    userId: text("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<string>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  })
);

export const sessions = sqliteTable("session", {
  sessionToken: text("sessionToken").primaryKey(),
  userId: text("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  expires: integer("expires", { mode: "timestamp_ms" }).notNull(),
});

export const verificationTokens = sqliteTable(
  "verificationToken",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: integer("expires", { mode: "timestamp_ms" }).notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
  })
);

export const user_connections = sqliteTable("user_connections", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  requester_id: text("requester_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  receiver_id: text("receiver_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  status: text("status").notNull(), // 'pending', 'accepted', 'rejected'
  message: text("message"), // note facultative d'invitation (≤ 300 caractères, contrôlée côté serveur)
  created_at: text("created_at").$defaultFn(() => new Date().toISOString()),
  updated_at: text("updated_at").$defaultFn(() => new Date().toISOString()),
}, (t) => [
  index("idx_user_connections_requester_id").on(t.requester_id),
  index("idx_user_connections_receiver_id").on(t.receiver_id),
  index("idx_user_connections_receiver_status").on(t.receiver_id, t.status),
  // L'index unique de la paire de membres (uq_user_connections_pair, expression min()/max()) n'existe que dans le SQL
  // de la migration : drizzle-kit ne sait pas le décrire. Ne pas le supprimer si `generate` le propose.
]);

/** Blocage : `blocker_id` a bloqué `blocked_id`. */
export const user_blocks = sqliteTable("user_blocks", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  blocker_id: text("blocker_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  blocked_id: text("blocked_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  created_at: text("created_at").notNull().$defaultFn(() => new Date().toISOString()),
}, (t) => [
  uniqueIndex("uq_user_blocks_pair").on(t.blocker_id, t.blocked_id),
  index("idx_user_blocks_blocked_id").on(t.blocked_id),
]);

/** Signalement d'un membre : motif choisi dans une liste fermée, statut 'nouveau' à la création. */
export const signalements = sqliteTable("signalements", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  signaleur_id: text("signaleur_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  signale_id: text("signale_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  motif: text("motif").notNull(),
  statut: text("statut").notNull().default("nouveau"),
  created_at: text("created_at").notNull().$defaultFn(() => new Date().toISOString()),
}, (t) => [
  index("idx_signalements_statut").on(t.statut, t.created_at),
  index("idx_signalements_signale_id").on(t.signale_id),
]);


// --- RELATIONS ---
import { relations } from "drizzle-orm";

export const usersRelations = relations(users, ({ many }) => ({
  articles: many(articles),
  evenements: many(evenements),
  opportunites: many(opportunites),
  documents: many(documents),
  forum_fils: many(forum_fils),
  forum_messages: many(forum_messages),
  sent_connections: many(user_connections, { relationName: "requester" }),
  received_connections: many(user_connections, { relationName: "receiver" }),
}));

export const userConnectionsRelations = relations(user_connections, ({ one }) => ({
  requester: one(users, {
    fields: [user_connections.requester_id],
    references: [users.id],
    relationName: "requester",
  }),
  receiver: one(users, {
    fields: [user_connections.receiver_id],
    references: [users.id],
    relationName: "receiver",
  }),
}));

export const articlesRelations = relations(articles, ({ one }) => ({
  auteur: one(users, {
    fields: [articles.auteur_id],
    references: [users.id],
  }),
}));

export const forumFilsRelations = relations(forum_fils, ({ one, many }) => ({
  auteur: one(users, {
    fields: [forum_fils.auteur_id],
    references: [users.id],
  }),
  categorie: one(forum_categories, {
    fields: [forum_fils.categorie_id],
    references: [forum_categories.id],
  }),
  messages: many(forum_messages),
}));

export const forumMessagesRelations = relations(forum_messages, ({ one }) => ({
  auteur: one(users, {
    fields: [forum_messages.auteur_id],
    references: [users.id],
  }),
  fil: one(forum_fils, {
    fields: [forum_messages.fil_id],
    references: [forum_fils.id],
  }),
}));

export const forumCategoriesRelations = relations(forum_categories, ({ many }) => ({
  fils: many(forum_fils),
}));

export const documentsRelations = relations(documents, ({ one }) => ({
  depose_par: one(users, {
    fields: [documents.depose_par],
    references: [users.id],
  }),
  valide_par: one(users, {
    fields: [documents.valide_par],
    references: [users.id],
  }),
}));

export const evenementsRelations = relations(evenements, ({ one, many }) => ({
  inscriptions: many(inscriptions_evenement),
}));

export const inscriptionsEvenementRelations = relations(inscriptions_evenement, ({ one }) => ({
  evenement: one(evenements, {
    fields: [inscriptions_evenement.evenement_id],
    references: [evenements.id],
  }),
  membre: one(users, {
    fields: [inscriptions_evenement.membre_id],
    references: [users.id],
  }),
}));

export const formationsRelations = relations(formations, ({ one, many }) => ({
  sessions_formation: many(sessions_formation),
  modules: many(formation_modules),
}));

export const sessionsFormationRelations = relations(sessions_formation, ({ one, many }) => ({
  formation: one(formations, {
    fields: [sessions_formation.formation_id],
    references: [formations.id],
  }),
  inscriptions: many(inscriptions_formation),
}));

export const inscriptionsFormationRelations = relations(inscriptions_formation, ({ one }) => ({
  sessions_formation: one(sessions_formation, {
    fields: [inscriptions_formation.session_id],
    references: [sessions_formation.id],
  }),
  formation: one(formations, {
    fields: [inscriptions_formation.formation_id],
    references: [formations.id],
  }),
  membre: one(users, {
    fields: [inscriptions_formation.membre_id],
    references: [users.id],
  }),
}));

export const opportunitesRelations = relations(opportunites, ({ one }) => ({
  auteur: one(users, {
    fields: [opportunites.poste_par],
    references: [users.id],
  }),
}));

export const modulesRelations = relations(formation_modules, ({ one, many }) => ({
  formation: one(formations, {
    fields: [formation_modules.formation_id],
    references: [formations.id],
  }),
  lecons: many(formation_lecons),
}));

export const leconsRelations = relations(formation_lecons, ({ one }) => ({
  module: one(formation_modules, {
    fields: [formation_lecons.module_id],
    references: [formation_modules.id],
  }),
}));

// Lectures gratuites de visiteurs non connectés (filet anti-contournement du quota).
// `empreinte` = hash(IP + navigateur), jamais l'IP en clair.
export const lectures_anonymes = sqliteTable("lectures_anonymes", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  empreinte: text("empreinte").notNull(),
  document_id: text("document_id").notNull(),
  created_at: text("created_at").notNull(),
}, (t) => [
  index("idx_lectures_anonymes_empreinte").on(t.empreinte, t.created_at),
]);

/**
 * Demandes et historique de changement de catégorie (migration drizzle/0007_demandes_categorie.sql).
 * Statuts : en_attente (validation admin : Partenaire, Sénior) | programmee (baisse à l'échéance) | acceptee | refusee | annulee.
 */
export const demandes_categorie = sqliteTable("demandes_categorie", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  user_id: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  categorie_avant: text("categorie_avant"),
  categorie_demandee: text("categorie_demandee").notNull(),
  statut: text("statut").notNull(),
  effet_le: text("effet_le"),
  regularisation_fcfa: integer("regularisation_fcfa"),
  motif_refus: text("motif_refus"),
  created_at: text("created_at").notNull(),
  traite_le: text("traite_le"),
  traite_par: text("traite_par"),
}, (t) => [
  index("idx_demandes_categorie_statut").on(t.statut, t.created_at),
  index("idx_demandes_categorie_user").on(t.user_id, t.statut),
]);

/**
 * Rappels d'adhésion déjà envoyés (migration drizzle/0008_rappels_adhesion.sql) : la clé unique
 * (membre, palier j30 | j7 | j0, échéance AAAA-MM-JJ) empêche d'envoyer deux fois le même rappel.
 */
export const rappels_adhesion = sqliteTable("rappels_adhesion", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  user_id: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  type: text("type").notNull(),
  echeance: text("echeance").notNull(),
  envoye_le: text("envoye_le").notNull(),
}, (t) => [
  uniqueIndex("uq_rappels_adhesion").on(t.user_id, t.type, t.echeance),
]);

/**
 * « Mon parcours » : documents aimés et documents ouverts en lecture par un membre
 * (migration drizzle/0009_parcours_bibliotheque.sql).
 */
export const documents_favoris = sqliteTable("documents_favoris", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  membre_id: text("membre_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  document_id: text("document_id").notNull().references(() => documents.id, { onDelete: "cascade" }),
  created_at: text("created_at").notNull(),
}, (t) => [
  uniqueIndex("uq_documents_favoris").on(t.membre_id, t.document_id),
  index("idx_documents_favoris_membre").on(t.membre_id, t.created_at),
]);

export const lectures_membres = sqliteTable("lectures_membres", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  membre_id: text("membre_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  document_id: text("document_id").notNull().references(() => documents.id, { onDelete: "cascade" }),
  premiere_lecture: text("premiere_lecture").notNull(),
  derniere_lecture: text("derniere_lecture").notNull(),
  nb_ouvertures: integer("nb_ouvertures").notNull().default(1),
  termine: integer("termine", { mode: "boolean" }).notNull().default(false),
}, (t) => [
  uniqueIndex("uq_lectures_membres").on(t.membre_id, t.document_id),
  index("idx_lectures_membres_membre").on(t.membre_id, t.derniere_lecture),
]);

// Visite guidée du tableau de bord : une ligne par membre qui l'a vue ou passée (migration drizzle/0011_visite_guidee.sql).
export const visite_guidee = sqliteTable("visite_guidee", {
  membre_id: text("membre_id").primaryKey().references(() => users.id, { onDelete: "cascade" }),
  vue_le: text("vue_le").notNull(),
  issue: text("issue").notNull(), // terminee | passee
});

/** Examen final d'une formation : une ligne par tentative. `questions_json` = ids tirés, fixés à l'ouverture (le serveur corrige CE tirage). */
export const tentatives_examen = sqliteTable("tentatives_examen", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  membre_id: text("membre_id").notNull(),
  formation_id: text("formation_id").notNull(),
  questions_json: text("questions_json").notNull(),
  debut_le: text("debut_le").notNull(),
  fin_le: text("fin_le"),
  bonnes: integer("bonnes"),
  total: integer("total"),
  pourcent: integer("pourcent"),
  reussi: integer("reussi", { mode: "boolean" }),
}, (t) => [
  index("idx_tentatives_examen_membre_formation").on(t.membre_id, t.formation_id),
]);

/** Livrables notés : un par module et par membre ; une nouvelle remise remplace la précédente. */
export const livrables_formation = sqliteTable("livrables_formation", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  membre_id: text("membre_id").notNull(),
  formation_id: text("formation_id").notNull(),
  module_ordre: integer("module_ordre").notNull(),
  contenu: text("contenu").notNull(),
  /** soumis | valide | a_revoir */
  statut: text("statut").notNull(),
  note: integer("note"),
  commentaire: text("commentaire"),
  correcteur_id: text("correcteur_id"),
  soumis_le: text("soumis_le").notNull(),
  corrige_le: text("corrige_le"),
}, (t) => [
  uniqueIndex("idx_livrables_formation_unique").on(t.membre_id, t.formation_id, t.module_ordre),
]);

/** Certificats délivrés (numéro public vérifiable) : un par membre, formation et niveau. */
export const certificats_formation = sqliteTable("certificats_formation", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  numero: text("numero").notNull(),
  /** participation | reussite */
  niveau: text("niveau").notNull(),
  membre_id: text("membre_id").notNull(),
  formation_id: text("formation_id").notNull(),
  delivre_le: text("delivre_le").notNull(),
}, (t) => [
  uniqueIndex("idx_certificats_formation_numero").on(t.numero),
  uniqueIndex("idx_certificats_formation_unique").on(t.membre_id, t.formation_id, t.niveau),
]);
