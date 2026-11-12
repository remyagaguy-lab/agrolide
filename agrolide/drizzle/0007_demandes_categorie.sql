-- Changement de catégorie en libre-service (sujet 2) — migration ADDITIVE : une nouvelle table, aucune donnée existante touchée.
-- À appliquer AVANT le déploiement du code qui l'utilise (sinon l'enregistrement d'une demande de Partenaire / Sénior échoue ;
-- la page « Modifier mon profil » et les changements libres continuent de fonctionner sans elle).
--   npx wrangler d1 execute agrolide-d1 --remote --file=drizzle/0007_demandes_categorie.sql

CREATE TABLE IF NOT EXISTS `demandes_categorie` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL REFERENCES `user`(`id`) ON DELETE CASCADE,
	`categorie_avant` text,
	`categorie_demandee` text NOT NULL,
	-- en_attente (validation admin) | programmee (baisse à l'échéance) | acceptee | refusee | annulee
	`statut` text NOT NULL,
	`effet_le` text,
	`regularisation_fcfa` integer,
	`motif_refus` text,
	`created_at` text NOT NULL,
	`traite_le` text,
	`traite_par` text
);
CREATE INDEX IF NOT EXISTS `idx_demandes_categorie_statut` ON `demandes_categorie` (`statut`, `created_at`);
CREATE INDEX IF NOT EXISTS `idx_demandes_categorie_user` ON `demandes_categorie` (`user_id`, `statut`);

-- RETOUR ARRIÈRE :
--   DROP TABLE IF EXISTS `demandes_categorie`;
