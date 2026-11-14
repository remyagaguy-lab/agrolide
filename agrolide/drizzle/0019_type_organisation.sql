-- Type d'organisation des Partenaires et marqueur « Organisation » du compte du réseau. Migration ADDITIVE (deux colonnes).
--   npx wrangler d1 execute agrolide-d1 --remote --file=drizzle/0019_type_organisation.sql
-- `est_organisation` : 1 = le compte est l'organisation elle-même (badge « Organisation »), sans changer sa catégorie d'adhésion.
-- `type_organisation` : valeur de la liste proposée (Association, ONG, Coopérative…) ou saisie libre.
ALTER TABLE `user` ADD `est_organisation` integer DEFAULT 0;
ALTER TABLE `user` ADD `type_organisation` text;
-- Le compte du réseau lui-même.
UPDATE `user` SET `est_organisation` = 1, `type_organisation` = 'Réseau agricole' WHERE `id` = '9b4e6d21-7a3c-4f58-8e10-c5a2d7f1b836';
