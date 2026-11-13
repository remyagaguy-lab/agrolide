-- Codes d'accès aux formations Agrolide (challenges) — migration ADDITIVE : une nouvelle table, aucune donnée existante touchée.
-- Un code = une personne (usage unique). `formation_id` vide = valable pour toutes les formations Agrolide.
--   npx wrangler d1 execute agrolide-d1 --remote --file=drizzle/0013_codes_acces_formation.sql

CREATE TABLE IF NOT EXISTS `codes_acces_formation` (
	`id` text PRIMARY KEY NOT NULL,
	`code` text NOT NULL,
	`formation_id` text,
	`lot` text,
	`expire_le` text,
	`utilise_par` text,
	`utilise_le` text,
	`created_at` text
);
CREATE UNIQUE INDEX IF NOT EXISTS `idx_codes_acces_formation_code` ON `codes_acces_formation` (`code`);
CREATE INDEX IF NOT EXISTS `idx_codes_acces_formation_lot` ON `codes_acces_formation` (`lot`);

-- RETOUR ARRIÈRE :
--   DROP TABLE IF EXISTS `codes_acces_formation`;
