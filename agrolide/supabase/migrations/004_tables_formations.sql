-- =====================================================
-- FORMATIONS & WEBINAIRES
-- =====================================================

CREATE TABLE formations (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  titre           TEXT NOT NULL,
  description     TEXT,
  programme_json  JSONB,                       -- [{module: "...", contenu: "..."}]
  modalite        formation_modalite NOT NULL,
  thematique      TEXT,
  niveau          TEXT,                        -- 'debutant', 'intermediaire', 'avance'
  acces           doc_acces DEFAULT 'membres',
  prix_fcfa       INTEGER DEFAULT 0,           -- 0 = gratuit
  intervenants    JSONB,                       -- [{nom, titre, photo_url}]
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE sessions_formation (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  formation_id    UUID NOT NULL REFERENCES formations(id),
  date_debut      TIMESTAMPTZ NOT NULL,
  date_fin        TIMESTAMPTZ NOT NULL,
  lieu            TEXT,                        -- Ville ou "En ligne"
  lien_rejoindre  TEXT,                        -- Zoom/Teams pour J-1
  places_max      INTEGER,
  places_restantes INTEGER,
  statut          TEXT DEFAULT 'ouvert',       -- 'ouvert', 'complet', 'annule', 'termine'
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE inscriptions_formation (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id      UUID NOT NULL REFERENCES sessions_formation(id),
  membre_id       UUID NOT NULL REFERENCES profiles(id),
  statut          inscription_statut DEFAULT 'inscrit',
  certificat_r2_key TEXT,                      -- Clé R2 du PDF certificat
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(session_id, membre_id)
);

-- Avis formations
CREATE TABLE avis_formation (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  formation_id    UUID NOT NULL REFERENCES formations(id),
  membre_id       UUID NOT NULL REFERENCES profiles(id),
  note            INTEGER NOT NULL CHECK (note BETWEEN 1 AND 5),
  commentaire     TEXT CHECK (char_length(commentaire) <= 500),
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(formation_id, membre_id)
);

-- Webinaires
CREATE TABLE webinaires (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  titre           TEXT NOT NULL,
  description     TEXT,
  date_heure      TIMESTAMPTZ NOT NULL,
  duree_minutes   INTEGER,
  intervenant     TEXT,
  youtube_id      TEXT,                        -- ID vidéo YouTube (embed)
  youtube_live_id TEXT,                        -- ID live YouTube (si direct)
  acces           doc_acces DEFAULT 'membres',
  fiche_resumee_id UUID REFERENCES documents(id), -- Fiche technique post-webinaire
  created_at      TIMESTAMPTZ DEFAULT NOW()
);
