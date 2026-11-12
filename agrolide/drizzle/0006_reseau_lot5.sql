-- Lot 5 du réseau agrolide — migration ADDITIVE (aucune colonne existante modifiée, aucune donnée supprimée).
-- À appliquer EN PREMIER, avant tout déploiement du code du lot 5.
-- Ordre : 1) vérifier les doublons (requête 1 de la proposition) ; 2) exécuter ce fichier ; 3) prévenir la session.

-- D. Champs de profil (JSON, listes fermées) ------------------------------------------------
ALTER TABLE `user` ADD COLUMN `centres_interet` text;
ALTER TABLE `user` ADD COLUMN `recherche` text;

-- C. Carte publique opt-in : faux par défaut, donc personne n'est exposé à l'application ------
ALTER TABLE `user` ADD COLUMN `profil_public` integer DEFAULT 0;

-- D. Note facultative d'invitation (≤ 300 caractères, contrôlée côté serveur) ------------------
ALTER TABLE `user_connections` ADD COLUMN `message` text;

-- B. Blocage ---------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `user_blocks` (
	`id` text PRIMARY KEY NOT NULL,
	`blocker_id` text NOT NULL REFERENCES `user`(`id`) ON DELETE CASCADE,
	`blocked_id` text NOT NULL REFERENCES `user`(`id`) ON DELETE CASCADE,
	`created_at` text NOT NULL
);
CREATE UNIQUE INDEX IF NOT EXISTS `uq_user_blocks_pair` ON `user_blocks` (`blocker_id`, `blocked_id`);
CREATE INDEX IF NOT EXISTS `idx_user_blocks_blocked_id` ON `user_blocks` (`blocked_id`);

-- B. Signalement (enregistré ; la lecture côté administration reste à décider) ----------------
CREATE TABLE IF NOT EXISTS `signalements` (
	`id` text PRIMARY KEY NOT NULL,
	`signaleur_id` text NOT NULL REFERENCES `user`(`id`) ON DELETE CASCADE,
	`signale_id` text NOT NULL REFERENCES `user`(`id`) ON DELETE CASCADE,
	`motif` text NOT NULL,
	`statut` text NOT NULL DEFAULT 'nouveau',
	`created_at` text NOT NULL
);
CREATE INDEX IF NOT EXISTS `idx_signalements_statut` ON `signalements` (`statut`, `created_at`);
CREATE INDEX IF NOT EXISTS `idx_signalements_signale_id` ON `signalements` (`signale_id`);

-- E. Intégrité des connexions ----------------------------------------------------------------
-- NE PAS exécuter ces deux lignes avant d'avoir vérifié qu'il n'y a aucun doublon de paire.
CREATE UNIQUE INDEX IF NOT EXISTS `uq_user_connections_pair`
  ON `user_connections` (min(`requester_id`, `receiver_id`), max(`requester_id`, `receiver_id`));
CREATE INDEX IF NOT EXISTS `idx_user_connections_receiver_status` ON `user_connections` (`receiver_id`, `status`);

-- RETOUR ARRIÈRE (toutes ces opérations sont indépendantes ; le code du lot 5 doit alors être retiré aussi) :
--   DROP INDEX IF EXISTS `idx_user_connections_receiver_status`;
--   DROP INDEX IF EXISTS `uq_user_connections_pair`;
--   DROP TABLE IF EXISTS `signalements`;
--   DROP TABLE IF EXISTS `user_blocks`;
--   ALTER TABLE `user_connections` DROP COLUMN `message`;
--   ALTER TABLE `user` DROP COLUMN `profil_public`;
--   ALTER TABLE `user` DROP COLUMN `recherche`;
--   ALTER TABLE `user` DROP COLUMN `centres_interet`;
