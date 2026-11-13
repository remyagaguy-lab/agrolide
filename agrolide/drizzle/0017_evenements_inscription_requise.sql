-- Événements en entrée libre : une colonne pour dire « pas d'inscription ». Migration ADDITIVE (aucune donnée supprimée).
--   npx wrangler d1 execute agrolide-d1 --remote --file=drizzle/0017_evenements_inscription_requise.sql
-- Vide ou 1 : l'inscription est proposée (comportement actuel). 0 : aucun bouton ni mention « inscrit(e) ».
ALTER TABLE `evenements` ADD `inscription_requise` integer;
