-- Plusieurs affiches par événement ou webinaire. Migration ADDITIVE (une colonne, aucune donnée supprimée).
--   npx wrangler d1 execute agrolide-d1 --remote --file=drizzle/0018_evenements_affiches_supplementaires.sql
-- `affiches_supplementaires` : liste JSON d'adresses d'images (["https://…", …]), à la suite de `image_url` (affiche principale).
ALTER TABLE `evenements` ADD `affiches_supplementaires` text;
