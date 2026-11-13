-- Visite guidée du tableau de bord — migration ADDITIVE : une nouvelle table, aucune donnée existante touchée.
-- Elle retient qu'un membre a vu (ou passé) la visite, pour ne la lui proposer qu'une fois, sur tous ses appareils.
-- Table à part (et non une colonne de `user`) : les requêtes existantes sur `user` ne changent pas.
--   npx wrangler d1 execute agrolide-d1 --remote --file=drizzle/0011_visite_guidee.sql
-- Tant qu'elle n'existe pas, la visite ne s'affiche simplement pas : le site continue de fonctionner.

CREATE TABLE IF NOT EXISTS `visite_guidee` (
	`membre_id` text PRIMARY KEY NOT NULL REFERENCES `user`(`id`) ON DELETE CASCADE,
	`vue_le` text NOT NULL,
	-- terminee | passee
	`issue` text NOT NULL
);

-- RETOUR ARRIÈRE :
--   DROP TABLE IF EXISTS `visite_guidee`;
