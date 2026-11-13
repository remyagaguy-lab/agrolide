-- Chronomètre des appels D1 (src/db/mesure-d1.ts) — migration ADDITIVE : une nouvelle table, aucune donnée touchée.
--   npx wrangler d1 execute agrolide-d1 --remote --file=drizzle/0010_d1_mesures.sql
-- Elle ne contient aucune donnée de membre : durée, nom de table, type d'opération, région.
-- Tant qu'elle n'existe pas, le chronomètre reste en veille sans effet sur le site.

CREATE TABLE IF NOT EXISTS `d1_mesures` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`created_at` text NOT NULL,
	-- aller-retour complet vu depuis le serveur (Vercel), en millisecondes
	`total_ms` real NOT NULL,
	-- durée interne de la requête dans D1 (meta.duration)
	`sql_ms` real,
	-- all | get | values | run
	`methode` text,
	`table_nom` text,
	`lignes` integer,
	-- 1 = premier appel d'une instance serverless qui vient de démarrer
	`froid` integer NOT NULL DEFAULT 0,
	`region` text
);
CREATE INDEX IF NOT EXISTS `idx_d1_mesures_date` ON `d1_mesures` (`created_at`);

-- NETTOYAGE (à lancer de temps en temps, ou une fois l'enquête terminée) :
--   DELETE FROM d1_mesures WHERE created_at < date('now', '-14 days');
-- RETOUR ARRIÈRE (arrête aussi l'enregistrement) :
--   DROP TABLE IF EXISTS `d1_mesures`;
