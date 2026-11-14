-- Réponses au questionnaire d'inscription aux formations Agrolide — migration ADDITIVE : une nouvelle table, rien d'existant touché.
-- À lancer depuis le dossier agrolide/ :
--   npx wrangler d1 execute agrolide-d1 --remote --file=drizzle/0017_reponses_inscription_formation.sql
-- (L'inscription fonctionne même avant cette migration : les réponses ne sont alors simplement pas enregistrées.)

CREATE TABLE IF NOT EXISTS `reponses_inscription_formation` (
	`id` text PRIMARY KEY NOT NULL,
	`membre_id` text NOT NULL,
	`formation_id` text NOT NULL,
	`projet` text,
	`domaine` text,
	`objectif` text,
	`attentes` text,
	`created_at` text
);
CREATE INDEX IF NOT EXISTS `idx_reponses_inscription_formation` ON `reponses_inscription_formation` (`formation_id`, `membre_id`);

-- RETOUR ARRIÈRE :
--   DROP TABLE IF EXISTS `reponses_inscription_formation`;
