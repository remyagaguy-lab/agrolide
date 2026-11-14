-- Suivre une organisation (profil Partenaire ou compte « agrolide ») : migration ADDITIVE (une table, aucune donnée existante modifiée).
--   npx wrangler d1 execute agrolide-d1 --remote --file=drizzle/0019_suivis_organisations.sql
-- `suiveur_id` suit `organisation_id` ; `notifier` = 1 : le suiveur reçoit une alerte à chaque publication de l'organisation.
-- Les abonnés ne sont jamais exposés aux autres membres : seule l'organisation lit sa liste.

CREATE TABLE IF NOT EXISTS `suivis_organisations` (
	`id` text PRIMARY KEY NOT NULL,
	`suiveur_id` text NOT NULL,
	`organisation_id` text NOT NULL,
	`notifier` integer DEFAULT 1 NOT NULL,
	`created_at` text,
	FOREIGN KEY (`suiveur_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`organisation_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
CREATE UNIQUE INDEX IF NOT EXISTS `uq_suivis_organisations_paire` ON `suivis_organisations` (`suiveur_id`, `organisation_id`);
CREATE INDEX IF NOT EXISTS `idx_suivis_organisations_organisation` ON `suivis_organisations` (`organisation_id`);

-- Tous les membres déjà inscrits suivent agrolide (idempotent : relançable sans doublon, ne ressuscite pas un abonnement supprimé
-- seulement si la migration est rejouée après coup : à n'exécuter qu'une fois).
INSERT OR IGNORE INTO `suivis_organisations` (`id`, `suiveur_id`, `organisation_id`, `notifier`, `created_at`)
SELECT lower(hex(randomblob(16))), u.`id`, '9b4e6d21-7a3c-4f58-8e10-c5a2d7f1b836', 1, strftime('%Y-%m-%dT%H:%M:%fZ', 'now')
FROM `user` u
WHERE u.`id` <> '9b4e6d21-7a3c-4f58-8e10-c5a2d7f1b836'
  AND EXISTS (SELECT 1 FROM `user` a WHERE a.`id` = '9b4e6d21-7a3c-4f58-8e10-c5a2d7f1b836');

-- RETOUR ARRIÈRE :
--   DROP TABLE `suivis_organisations`;
