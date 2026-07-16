-- Migration pour ajouter les ressources aux événements

ALTER TABLE evenements ADD COLUMN IF NOT EXISTS presentation_url TEXT;
ALTER TABLE evenements ADD COLUMN IF NOT EXISTS ressources_url TEXT;
