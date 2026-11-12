-- Classement de la bibliothèque : 8 colonnes ajoutées à `documents` + 2 index. Migration ADDITIVE (aucune donnée touchée).
-- À appliquer AVANT le déploiement du code (les pages lisent ces colonnes) :
--   npx wrangler d1 execute agrolide-d1 --remote --file drizzle/0008_bibliotheque_classification.sql
ALTER TABLE `documents` ADD `domaine` text;--> statement-breakpoint
ALTER TABLE `documents` ADD `sous_domaine` text;--> statement-breakpoint
ALTER TABLE `documents` ADD `public_cible` text;--> statement-breakpoint
ALTER TABLE `documents` ADD `niveau` text;--> statement-breakpoint
ALTER TABLE `documents` ADD `licence` text;--> statement-breakpoint
ALTER TABLE `documents` ADD `source_organisation` text;--> statement-breakpoint
ALTER TABLE `documents` ADD `mots_cles` text;--> statement-breakpoint
ALTER TABLE `documents` ADD `reference` text;--> statement-breakpoint
CREATE INDEX `idx_documents_domaine` ON `documents` (`statut`,`domaine`,`sous_domaine`);--> statement-breakpoint
CREATE UNIQUE INDEX `uq_documents_reference` ON `documents` (`reference`);