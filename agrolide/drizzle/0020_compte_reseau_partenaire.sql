-- Le compte du réseau (agrolide) passe de Passionné à Partenaire. Sa catégorie reste masquée partout par `est_organisation`
-- (badge « Organisation », aucune cotisation, aucun rappel). Migration de DONNÉES, aucune colonne.
--   npx wrangler d1 execute agrolide-d1 --remote --file=drizzle/0020_compte_reseau_partenaire.sql
UPDATE `user` SET `categorie` = 'partenaire' WHERE `id` = '9b4e6d21-7a3c-4f58-8e10-c5a2d7f1b836' AND `est_organisation` = 1;
