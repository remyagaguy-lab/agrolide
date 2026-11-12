-- Rappels automatiques d'adhésion (sujet 3) — migration ADDITIVE : une nouvelle table, aucune donnée existante touchée.
-- À appliquer AVANT le premier passage de la tâche planifiée (/api/cron/rappels-adhesion).
--   npx wrangler d1 execute agrolide-d1 --remote --file=drizzle/0008_rappels_adhesion.sql
-- La clé unique (membre, palier, échéance) garantit qu'un même rappel ne part jamais deux fois.

CREATE TABLE IF NOT EXISTS `rappels_adhesion` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL REFERENCES `user`(`id`) ON DELETE CASCADE,
	-- j30 | j7 | j0
	`type` text NOT NULL,
	-- échéance concernée, au format AAAA-MM-JJ
	`echeance` text NOT NULL,
	`envoye_le` text NOT NULL
);
CREATE UNIQUE INDEX IF NOT EXISTS `uq_rappels_adhesion` ON `rappels_adhesion` (`user_id`, `type`, `echeance`);

-- RETOUR ARRIÈRE :
--   DROP TABLE IF EXISTS `rappels_adhesion`;
