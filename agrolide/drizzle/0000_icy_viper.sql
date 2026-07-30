CREATE TABLE `account` (
	`userId` text NOT NULL,
	`type` text NOT NULL,
	`provider` text NOT NULL,
	`providerAccountId` text NOT NULL,
	`refresh_token` text,
	`access_token` text,
	`expires_at` integer,
	`token_type` text,
	`scope` text,
	`id_token` text,
	`session_state` text,
	PRIMARY KEY(`provider`, `providerAccountId`),
	FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `agripreneurs` (
	`created_at` text,
	`description` text,
	`id` text PRIMARY KEY NOT NULL,
	`lien_web` text,
	`nom` text NOT NULL,
	`pays` text,
	`photo_url` text,
	`projet` text NOT NULL,
	`publie` integer,
	`secteur` text,
	`temoignage` text
);
--> statement-breakpoint
CREATE TABLE `articles` (
	`acces` text,
	`auteur_externe` text,
	`auteur_id` text,
	`categorie` text NOT NULL,
	`contenu_json` text NOT NULL,
	`created_at` text,
	`cta_lien` text,
	`cta_texte` text,
	`extrait` text,
	`id` text PRIMARY KEY NOT NULL,
	`image_une_url` text,
	`published_at` text,
	`slug` text NOT NULL,
	`statut` text,
	`tags` text,
	`titre` text NOT NULL,
	`updated_at` text
);
--> statement-breakpoint
CREATE TABLE `avis_formation` (
	`commentaire` text,
	`created_at` text,
	`formation_id` text NOT NULL,
	`id` text PRIMARY KEY NOT NULL,
	`membre_id` text NOT NULL,
	`note` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `campagnes_financement` (
	`active` integer,
	`created_at` text,
	`date_debut` text,
	`date_fin` text,
	`description` text,
	`id` text PRIMARY KEY NOT NULL,
	`objectif_fcfa` integer NOT NULL,
	`titre` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `candidatures_incubation` (
	`created_at` text,
	`cv_r2_key` text,
	`email` text NOT NULL,
	`financement_recu` integer,
	`id` text PRIMARY KEY NOT NULL,
	`marche_cible` text,
	`modele_eco` text,
	`montant_financement` text,
	`motivation` text,
	`nom` text NOT NULL,
	`nom_projet` text NOT NULL,
	`pays` text,
	`prenom` text NOT NULL,
	`probleme` text,
	`secteur` text,
	`solution` text,
	`stade` text,
	`statut` text,
	`telephone` text,
	`besoins` text
);
--> statement-breakpoint
CREATE TABLE `commentaires_forum` (
	`auteur_id` text NOT NULL,
	`contenu` text NOT NULL,
	`created_at` text,
	`id` text PRIMARY KEY NOT NULL,
	`message_id` text NOT NULL,
	`updated_at` text
);
--> statement-breakpoint
CREATE TABLE `contacts_partenariat` (
	`budget` text,
	`created_at` text,
	`email` text NOT NULL,
	`id` text PRIMARY KEY NOT NULL,
	`message` text NOT NULL,
	`nature_collaboration` text NOT NULL,
	`raison_sociale` text NOT NULL,
	`secteur` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `contributions` (
	`anonyme` integer,
	`created_at` text,
	`email` text NOT NULL,
	`id` text PRIMARY KEY NOT NULL,
	`methode` text NOT NULL,
	`montant_fcfa` integer NOT NULL,
	`prenom` text,
	`provider_ref` text,
	`statut` text
);
--> statement-breakpoint
CREATE TABLE `cotisations` (
	`categorie` text NOT NULL,
	`created_at` text,
	`date_debut` text,
	`date_fin` text,
	`id` text PRIMARY KEY NOT NULL,
	`membre_id` text NOT NULL,
	`methode` text NOT NULL,
	`montant_fcfa` integer NOT NULL,
	`provider_ref` text,
	`statut` text
);
--> statement-breakpoint
CREATE TABLE `demandes_service` (
	`budget_tranche` text,
	`created_at` text,
	`delai` text,
	`description` text NOT NULL,
	`email` text NOT NULL,
	`fichier_r2_key` text,
	`id` text PRIMARY KEY NOT NULL,
	`nom` text NOT NULL,
	`organisation` text,
	`pays` text,
	`prenom` text NOT NULL,
	`statut` text,
	`telephone` text,
	`type_service` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `documents` (
	`acces` text NOT NULL,
	`annee` integer,
	`auteurs` text NOT NULL,
	`created_at` text,
	`depose_par` text,
	`fichier_r2_key` text NOT NULL,
	`filiere` text,
	`id` text PRIMARY KEY NOT NULL,
	`langue` text,
	`nb_telechargements` integer,
	`pays` text,
	`published_at` text,
	`resume` text,
	`statut` text NOT NULL,
	`taille_octets` integer,
	`thematique` text NOT NULL,
	`titre` text NOT NULL,
	`type_doc` text NOT NULL,
	`valide_par` text
);
--> statement-breakpoint
CREATE TABLE `evenements` (
	`created_at` text,
	`date_debut` text NOT NULL,
	`date_fin` text,
	`description` text,
	`en_ligne` integer,
	`id` text PRIMARY KEY NOT NULL,
	`image_url` text,
	`lien_inscription` text,
	`lieu` text,
	`pays` text,
	`places_max` integer,
	`publie` integer,
	`titre` text NOT NULL,
	`type_evt` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `formations` (
	`acces` text,
	`created_at` text,
	`description` text,
	`id` text PRIMARY KEY NOT NULL,
	`intervenants` text,
	`modalite` text NOT NULL,
	`niveau` text,
	`prix_fcfa` integer,
	`programme_json` text,
	`thematique` text,
	`titre` text NOT NULL,
	`statut` text
);
--> statement-breakpoint
CREATE TABLE `forum_categories` (
	`id` text PRIMARY KEY NOT NULL,
	`nom` text NOT NULL,
	`ordre` integer
);
--> statement-breakpoint
CREATE TABLE `forum_fils` (
	`auteur_id` text NOT NULL,
	`categorie_id` text NOT NULL,
	`created_at` text,
	`id` text PRIMARY KEY NOT NULL,
	`last_activity_at` text,
	`nb_reponses` integer,
	`statut` text,
	`titre` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `forum_messages` (
	`auteur_id` text NOT NULL,
	`contenu` text NOT NULL,
	`created_at` text,
	`fil_id` text NOT NULL,
	`id` text PRIMARY KEY NOT NULL,
	`statut` text,
	`updated_at` text
);
--> statement-breakpoint
CREATE TABLE `inscriptions_evenement` (
	`created_at` text,
	`email_externe` text,
	`evenement_id` text NOT NULL,
	`id` text PRIMARY KEY NOT NULL,
	`membre_id` text,
	`nom` text,
	`prenom` text
);
--> statement-breakpoint
CREATE TABLE `inscriptions_formation` (
	`certificat_r2_key` text,
	`created_at` text,
	`id` text PRIMARY KEY NOT NULL,
	`membre_id` text NOT NULL,
	`session_id` text NOT NULL,
	`statut` text
);
--> statement-breakpoint
CREATE TABLE `messages` (
	`contenu` text NOT NULL,
	`created_at` text,
	`destinataire_id` text NOT NULL,
	`expediteur_id` text NOT NULL,
	`id` text PRIMARY KEY NOT NULL,
	`lu` integer
);
--> statement-breakpoint
CREATE TABLE `notifications` (
	`contenu` text NOT NULL,
	`created_at` text,
	`id` text PRIMARY KEY NOT NULL,
	`lien` text,
	`lu` integer,
	`type` text NOT NULL,
	`user_id` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `opportunites` (
	`created_at` text,
	`date_limite` text,
	`description` text,
	`filiere` text,
	`id` text PRIMARY KEY NOT NULL,
	`lien_externe` text,
	`organisation` text,
	`pays` text,
	`poste_par` text,
	`statut` text,
	`titre` text NOT NULL,
	`type_opp` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `pages_statiques` (
	`contenu_json` text,
	`id` text PRIMARY KEY NOT NULL,
	`meta_description` text,
	`slug` text NOT NULL,
	`titre` text,
	`updated_at` text
);
--> statement-breakpoint
CREATE TABLE `partenaires` (
	`contact_nom` text,
	`contact_titre` text,
	`created_at` text,
	`description` text,
	`id` text PRIMARY KEY NOT NULL,
	`logo_url` text,
	`nom` text NOT NULL,
	`ordre` integer,
	`publie` integer,
	`site_web` text,
	`temoignage` text
);
--> statement-breakpoint
CREATE TABLE `user` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text,
	`email` text NOT NULL,
	`emailVerified` integer,
	`image` text,
	`password_hash` text,
	`annuaire_visible` integer,
	`biographie` text,
	`categorie` text DEFAULT 'professionnel',
	`langues` text,
	`linkedin_url` text,
	`newsletter_brevo` integer,
	`niveau_etudes` text,
	`nom` text,
	`notif_evenements` integer,
	`notif_opportunites` integer,
	`organisation` text,
	`ouvert_contact` integer,
	`pays` text,
	`photo_url` text,
	`prenom` text,
	`role_plateforme` text DEFAULT 'membre',
	`secteurs_expertise` text,
	`site_web_url` text,
	`specialite` text,
	`statut_adhesion` text DEFAULT 'gratuit',
	`created_at` text,
	`updated_at` text,
	`ville` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `user_email_unique` ON `user` (`email`);--> statement-breakpoint
CREATE TABLE `session` (
	`sessionToken` text PRIMARY KEY NOT NULL,
	`userId` text NOT NULL,
	`expires` integer NOT NULL,
	FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `sessions_formation` (
	`created_at` text,
	`date_debut` text NOT NULL,
	`date_fin` text NOT NULL,
	`formation_id` text NOT NULL,
	`id` text PRIMARY KEY NOT NULL,
	`lien_rejoindre` text,
	`lieu` text,
	`places_max` integer,
	`places_restantes` integer,
	`statut` text
);
--> statement-breakpoint
CREATE TABLE `telechargements` (
	`created_at` text,
	`document_id` text NOT NULL,
	`id` text PRIMARY KEY NOT NULL,
	`membre_id` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `temoignages` (
	`categorie` text,
	`citation` text NOT NULL,
	`id` text PRIMARY KEY NOT NULL,
	`nom` text,
	`ordre` integer,
	`pays` text,
	`photo_url` text,
	`prenom` text NOT NULL,
	`publie` integer
);
--> statement-breakpoint
CREATE TABLE `verificationToken` (
	`identifier` text NOT NULL,
	`token` text NOT NULL,
	`expires` integer NOT NULL,
	PRIMARY KEY(`identifier`, `token`)
);
--> statement-breakpoint
CREATE TABLE `webinaires` (
	`acces` text,
	`created_at` text,
	`date_heure` text NOT NULL,
	`description` text,
	`duree_minutes` integer,
	`fiche_resumee_id` text,
	`id` text PRIMARY KEY NOT NULL,
	`intervenant` text,
	`titre` text NOT NULL,
	`youtube_id` text,
	`youtube_live_id` text
);
