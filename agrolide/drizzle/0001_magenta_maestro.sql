CREATE TABLE `user_connections` (
	`id` text PRIMARY KEY NOT NULL,
	`requester_id` text NOT NULL,
	`receiver_id` text NOT NULL,
	`status` text NOT NULL,
	`created_at` text,
	`updated_at` text,
	FOREIGN KEY (`requester_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`receiver_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_user` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text,
	`email` text NOT NULL,
	`emailVerified` integer,
	`image` text,
	`password_hash` text,
	`annuaire_visible` integer,
	`biographie` text,
	`categorie` text,
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
INSERT INTO `__new_user`("id", "name", "email", "emailVerified", "image", "password_hash", "annuaire_visible", "biographie", "categorie", "langues", "linkedin_url", "newsletter_brevo", "niveau_etudes", "nom", "notif_evenements", "notif_opportunites", "organisation", "ouvert_contact", "pays", "photo_url", "prenom", "role_plateforme", "secteurs_expertise", "site_web_url", "specialite", "statut_adhesion", "created_at", "updated_at", "ville") SELECT "id", "name", "email", "emailVerified", "image", "password_hash", "annuaire_visible", "biographie", "categorie", "langues", "linkedin_url", "newsletter_brevo", "niveau_etudes", "nom", "notif_evenements", "notif_opportunites", "organisation", "ouvert_contact", "pays", "photo_url", "prenom", "role_plateforme", "secteurs_expertise", "site_web_url", "specialite", "statut_adhesion", "created_at", "updated_at", "ville" FROM `user`;--> statement-breakpoint
DROP TABLE `user`;--> statement-breakpoint
ALTER TABLE `__new_user` RENAME TO `user`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE UNIQUE INDEX `user_email_unique` ON `user` (`email`);--> statement-breakpoint
ALTER TABLE `evenements` ADD `presentation_url` text;--> statement-breakpoint
ALTER TABLE `evenements` ADD `ressources_url` text;