-- Webinaires : replay réservé aux inscrits + document de la bibliothèque lié. Migration ADDITIVE (2 colonnes, aucune donnée supprimée).
--   npx wrangler d1 execute agrolide-d1 --remote --file=drizzle/0016_evenements_replay_document.sql
-- `lien_replay`  : enregistrement d'une séance passée ; lu seulement dans l'espace membre (jamais envoyé aux pages publiques).
-- `document_id`  : document de la bibliothèque (diaporama) rattaché à l'événement.
ALTER TABLE `evenements` ADD `lien_replay` text;--> statement-breakpoint
ALTER TABLE `evenements` ADD `document_id` text;--> statement-breakpoint
-- Le replay du webinaire 2 avait été saisi dans « lien d'inscription » : on le range à sa place.
UPDATE `evenements` SET `lien_replay` = `lien_inscription`, `lien_inscription` = NULL
  WHERE `type_evt` = 'webinaire' AND `lien_inscription` LIKE 'https://fathom.video/%';
