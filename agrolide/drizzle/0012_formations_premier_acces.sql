-- Formations externes : date du premier clic sur « Accéder au cours » — migration ADDITIVE : une colonne facultative.
-- L'inscription (created_at) existe déjà ; cette colonne dit si, et quand, le membre a réellement ouvert le cours chez l'organisme.
--   npx wrangler d1 execute agrolide-d1 --remote --file=drizzle/0012_formations_premier_acces.sql
-- Aucune donnée existante touchée (valeur vide pour les inscriptions déjà enregistrées).

ALTER TABLE `inscriptions_formation` ADD COLUMN `premier_acces_le` text;

-- RETOUR ARRIÈRE :
--   ALTER TABLE `inscriptions_formation` DROP COLUMN `premier_acces_le`;
