import { text, integer, sqliteTable, primaryKey, real } from "drizzle-orm/sqlite-core";
import type { AdapterAccountType } from "next-auth/adapters";

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
  contenu_json: text("contenu_json", { mode: "json" }).notNull(),
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
});

export const avis_formation = sqliteTable("avis_formation", {
  commentaire: text("commentaire"),
  created_at: text("created_at"),
  formation_id: text("formation_id").notNull(),
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  membre_id: text("membre_id").notNull(),
  note: integer("note").notNull(),
});

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
});

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
});

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
});

export const evenements = sqliteTable("evenements", {
  created_at: text("created_at"),
  date_debut: text("date_debut").notNull(),
  date_fin: text("date_fin"),
  description: text("description"),
  en_ligne: integer("en_ligne", { mode: "boolean" }),
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  image_url: text("image_url"),
  lien_inscription: text("lien_inscription"),
  lieu: text("lieu"),
  pays: text("pays"),
  places_max: integer("places_max"),
  publie: integer("publie", { mode: "boolean" }),
  titre: text("titre").notNull(),
  type_evt: text("type_evt").notNull(),
});

export const formations = sqliteTable("formations", {
  acces: text("acces"),
  created_at: text("created_at"),
  description: text("description"),
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  intervenants: text("intervenants", { mode: "json" }),
  modalite: text("modalite").notNull(),
  niveau: text("niveau"),
  prix_fcfa: integer("prix_fcfa"),
  programme_json: text("programme_json", { mode: "json" }),
  thematique: text("thematique"),
  titre: text("titre").notNull(),
});

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
});

export const forum_messages = sqliteTable("forum_messages", {
  auteur_id: text("auteur_id").notNull(),
  contenu: text("contenu").notNull(),
  created_at: text("created_at"),
  fil_id: text("fil_id").notNull(),
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  statut: text("statut"),
  updated_at: text("updated_at"),
});

export const inscriptions_evenement = sqliteTable("inscriptions_evenement", {
  created_at: text("created_at"),
  email_externe: text("email_externe"),
  evenement_id: text("evenement_id").notNull(),
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  membre_id: text("membre_id"),
  nom: text("nom"),
  prenom: text("prenom"),
});

export const inscriptions_formation = sqliteTable("inscriptions_formation", {
  certificat_r2_key: text("certificat_r2_key"),
  created_at: text("created_at"),
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  membre_id: text("membre_id").notNull(),
  session_id: text("session_id").notNull(),
  statut: text("statut"),
});

export const messages = sqliteTable("messages", {
  contenu: text("contenu").notNull(),
  created_at: text("created_at"),
  destinataire_id: text("destinataire_id").notNull(),
  expediteur_id: text("expediteur_id").notNull(),
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  lu: integer("lu", { mode: "boolean" }),
});

export const notifications = sqliteTable("notifications", {
  contenu: text("contenu").notNull(),
  created_at: text("created_at"),
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  lien: text("lien"),
  lu: integer("lu", { mode: "boolean" }),
  type: text("type").notNull(),
  user_id: text("user_id").notNull(),
});

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
});

export const pages_statiques = sqliteTable("pages_statiques", {
  contenu_json: text("contenu_json", { mode: "json" }),
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  meta_description: text("meta_description"),
  slug: text("slug").notNull(),
  titre: text("titre"),
  updated_at: text("updated_at"),
});

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

export const profiles = sqliteTable("profiles", {
  annuaire_visible: integer("annuaire_visible", { mode: "boolean" }),
  biographie: text("biographie"),
  categorie: text("categorie").notNull(),
  created_at: text("created_at"),
  email: text("email").notNull(),
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  langues: text("langues"),
  linkedin_url: text("linkedin_url"),
  newsletter_brevo: integer("newsletter_brevo", { mode: "boolean" }),
  niveau_etudes: text("niveau_etudes"),
  nom: text("nom").notNull(),
  notif_evenements: integer("notif_evenements", { mode: "boolean" }),
  notif_opportunites: integer("notif_opportunites", { mode: "boolean" }),
  organisation: text("organisation"),
  ouvert_contact: integer("ouvert_contact", { mode: "boolean" }),
  pays: text("pays").notNull(),
  photo_url: text("photo_url"),
  prenom: text("prenom").notNull(),
  role_plateforme: text("role_plateforme").notNull(),
  secteurs_expertise: text("secteurs_expertise"),
  site_web_url: text("site_web_url"),
  specialite: text("specialite"),
  statut_adhesion: text("statut_adhesion").notNull(),
  updated_at: text("updated_at"),
  ville: text("ville"),
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
});

export const telechargements = sqliteTable("telechargements", {
  created_at: text("created_at"),
  document_id: text("document_id").notNull(),
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  membre_id: text("membre_id").notNull(),
});

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
  categorie: text("categorie").default('professionnel'),
  langues: text("langues", { mode: "json" }),
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
  secteurs_expertise: text("secteurs_expertise", { mode: "json" }),
  site_web_url: text("site_web_url"),
  specialite: text("specialite"),
  statut_adhesion: text("statut_adhesion").default('gratuit'),
  created_at: text("created_at"),
  updated_at: text("updated_at"),
  ville: text("ville"),
});

// Alias for easier migration
export const profiles = users;

export const accounts = sqliteTable(
  "account",
  {
    userId: text("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccountType>().notNull(),
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
