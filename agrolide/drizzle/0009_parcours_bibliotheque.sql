-- « Mon parcours » (Se former) : favoris et lectures de la bibliothèque — migration ADDITIVE : deux nouvelles tables,
-- aucune donnée existante touchée. Le code reste fonctionnel (listes vides) tant qu'elle n'est pas appliquée.
--   npx wrangler d1 execute agrolide-d1 --remote --file=drizzle/0009_parcours_bibliotheque.sql

-- Documents « aimés » par un membre (un cœur par document).
CREATE TABLE IF NOT EXISTS `documents_favoris` (
	`id` text PRIMARY KEY NOT NULL,
	`membre_id` text NOT NULL REFERENCES `user`(`id`) ON DELETE CASCADE,
	`document_id` text NOT NULL REFERENCES `documents`(`id`) ON DELETE CASCADE,
	`created_at` text NOT NULL
);
CREATE UNIQUE INDEX IF NOT EXISTS `uq_documents_favoris` ON `documents_favoris` (`membre_id`, `document_id`);
CREATE INDEX IF NOT EXISTS `idx_documents_favoris_membre` ON `documents_favoris` (`membre_id`, `created_at`);

-- Documents ouverts en lecture par un membre : alimente « Mes lectures ».
CREATE TABLE IF NOT EXISTS `lectures_membres` (
	`id` text PRIMARY KEY NOT NULL,
	`membre_id` text NOT NULL REFERENCES `user`(`id`) ON DELETE CASCADE,
	`document_id` text NOT NULL REFERENCES `documents`(`id`) ON DELETE CASCADE,
	`premiere_lecture` text NOT NULL,
	`derniere_lecture` text NOT NULL,
	`nb_ouvertures` integer NOT NULL DEFAULT 1,
	-- le membre a marqué le document comme terminé
	`termine` integer NOT NULL DEFAULT 0
);
CREATE UNIQUE INDEX IF NOT EXISTS `uq_lectures_membres` ON `lectures_membres` (`membre_id`, `document_id`);
CREATE INDEX IF NOT EXISTS `idx_lectures_membres_membre` ON `lectures_membres` (`membre_id`, `derniere_lecture`);

-- RETOUR ARRIÈRE :
--   DROP TABLE IF EXISTS `documents_favoris`;
--   DROP TABLE IF EXISTS `lectures_membres`;
