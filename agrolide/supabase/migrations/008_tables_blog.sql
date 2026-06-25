-- =====================================================
-- BLOG
-- =====================================================

CREATE TABLE articles (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  titre           TEXT NOT NULL,
  slug            TEXT NOT NULL UNIQUE,
  auteur_id       UUID REFERENCES profiles(id),
  auteur_externe  TEXT,                        -- Si auteur non-membre
  categorie       TEXT NOT NULL,               -- Pilier éditorial
  tags            TEXT[],
  image_une_url   TEXT,
  contenu_json    JSONB NOT NULL,              -- Format Tiptap JSON
  extrait         TEXT CHECK (char_length(extrait) <= 160),
  cta_texte       TEXT,
  cta_lien        TEXT,
  acces           doc_acces DEFAULT 'public',
  statut          TEXT DEFAULT 'brouillon',    -- 'brouillon', 'planifie', 'publie'
  published_at    TIMESTAMPTZ,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Pages statiques (contenu CMS)
CREATE TABLE pages_statiques (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug            TEXT NOT NULL UNIQUE,        -- 'accueil', 'qui-sommes-nous', etc.
  titre           TEXT,
  contenu_json    JSONB,
  meta_description TEXT,
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Témoignages page d'accueil
CREATE TABLE temoignages (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  prenom          TEXT NOT NULL,
  nom             TEXT,
  categorie       membre_categorie,
  pays            TEXT,
  photo_url       TEXT,
  citation        TEXT NOT NULL,
  ordre           INTEGER DEFAULT 0,
  publie          BOOLEAN DEFAULT TRUE
);
