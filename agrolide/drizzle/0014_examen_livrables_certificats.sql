-- Examen final, livrables notés et certificats vérifiables — migration ADDITIVE : trois nouvelles tables,
-- aucune donnée ni table existante touchée. Schéma validé par le propriétaire le 13/11/2026.
--   npx wrangler d1 execute agrolide-d1 --remote --file=drizzle/0014_examen_livrables_certificats.sql

CREATE TABLE IF NOT EXISTS `tentatives_examen` (
	`id` text PRIMARY KEY NOT NULL,
	`membre_id` text NOT NULL,
	`formation_id` text NOT NULL,
	`questions_json` text NOT NULL,
	`debut_le` text NOT NULL,
	`fin_le` text,
	`bonnes` integer,
	`total` integer,
	`pourcent` integer,
	`reussi` integer
);
CREATE INDEX IF NOT EXISTS `idx_tentatives_examen_membre_formation` ON `tentatives_examen` (`membre_id`, `formation_id`);

CREATE TABLE IF NOT EXISTS `livrables_formation` (
	`id` text PRIMARY KEY NOT NULL,
	`membre_id` text NOT NULL,
	`formation_id` text NOT NULL,
	`module_ordre` integer NOT NULL,
	`contenu` text NOT NULL,
	`statut` text NOT NULL,
	`note` integer,
	`commentaire` text,
	`correcteur_id` text,
	`soumis_le` text NOT NULL,
	`corrige_le` text
);
CREATE UNIQUE INDEX IF NOT EXISTS `idx_livrables_formation_unique` ON `livrables_formation` (`membre_id`, `formation_id`, `module_ordre`);

CREATE TABLE IF NOT EXISTS `certificats_formation` (
	`id` text PRIMARY KEY NOT NULL,
	`numero` text NOT NULL,
	`niveau` text NOT NULL,
	`membre_id` text NOT NULL,
	`formation_id` text NOT NULL,
	`delivre_le` text NOT NULL
);
CREATE UNIQUE INDEX IF NOT EXISTS `idx_certificats_formation_numero` ON `certificats_formation` (`numero`);
CREATE UNIQUE INDEX IF NOT EXISTS `idx_certificats_formation_unique` ON `certificats_formation` (`membre_id`, `formation_id`, `niveau`);

-- RETOUR ARRIÈRE :
--   DROP TABLE IF EXISTS `tentatives_examen`;
--   DROP TABLE IF EXISTS `livrables_formation`;
--   DROP TABLE IF EXISTS `certificats_formation`;
