-- Notifications push (Web Push) — migration ADDITIVE : une nouvelle table, aucune donnée ni table existante touchée.
-- Un appareil (navigateur ou application installée) = une ligne ; `endpoint` est unique (pas de doublon).
-- `categories` : alertes choisies pour cet appareil (messages, reseau, opportunites, activite, compte), séparées par des virgules.
--   npx wrangler d1 execute agrolide-d1 --remote --file=drizzle/0015_abonnements_push.sql

CREATE TABLE IF NOT EXISTS `abonnements_push` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`endpoint` text NOT NULL,
	`p256dh` text NOT NULL,
	`auth` text NOT NULL,
	`categories` text DEFAULT 'messages,reseau,opportunites,activite,compte' NOT NULL,
	`user_agent` text,
	`created_at` text,
	`derniere_utilisation` text
);
CREATE UNIQUE INDEX IF NOT EXISTS `idx_abonnements_push_endpoint` ON `abonnements_push` (`endpoint`);
CREATE INDEX IF NOT EXISTS `idx_abonnements_push_user_id` ON `abonnements_push` (`user_id`);

-- RETOUR ARRIÈRE :
--   DROP TABLE IF EXISTS `abonnements_push`;
