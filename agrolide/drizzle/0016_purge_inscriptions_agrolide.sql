-- Supprime les inscriptions faites avant l'obligation du code d'accès, pour les formations Agrolide uniquement.
-- Les formations externes (lien_externe renseigné) ne sont pas touchées. La progression et les notes ne sont pas touchées.
-- À lancer depuis le dossier agrolide/ :
--   npx wrangler d1 execute agrolide-d1 --remote --file=drizzle/0016_purge_inscriptions_agrolide.sql
-- Pas de retour arrière possible (suppression de lignes) : à lancer en connaissance de cause.

DELETE FROM `inscriptions_formation`
WHERE `formation_id` IN (
  SELECT `id` FROM `formations` WHERE `lien_externe` IS NULL OR `lien_externe` = ''
);
