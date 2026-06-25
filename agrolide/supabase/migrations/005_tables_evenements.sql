-- =====================================================
-- ÉVÉNEMENTS & COMMUNAUTÉ
-- =====================================================

CREATE TABLE evenements (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  titre           TEXT NOT NULL,
  description     TEXT,
  type_evt        evenement_type NOT NULL,
  date_debut      TIMESTAMPTZ NOT NULL,
  date_fin        TIMESTAMPTZ,
  lieu            TEXT,
  pays            TEXT,
  en_ligne        BOOLEAN DEFAULT FALSE,
  lien_inscription TEXT,                       -- Lien externe ou interne
  places_max      INTEGER,
  image_url       TEXT,                        -- R2
  publie          BOOLEAN DEFAULT FALSE,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE inscriptions_evenement (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  evenement_id    UUID NOT NULL REFERENCES evenements(id),
  membre_id       UUID REFERENCES profiles(id),
  email_externe   TEXT,                        -- Pour les non-membres (visiteurs)
  prenom          TEXT,
  nom             TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Forum
CREATE TABLE forum_categories (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nom             TEXT NOT NULL UNIQUE,
  ordre           INTEGER DEFAULT 0
);

CREATE TABLE forum_fils (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  categorie_id    UUID NOT NULL REFERENCES forum_categories(id),
  titre           TEXT NOT NULL,
  auteur_id       UUID NOT NULL REFERENCES profiles(id),
  statut          TEXT DEFAULT 'ouvert',       -- 'ouvert', 'ferme', 'signale'
  nb_reponses     INTEGER DEFAULT 0,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  last_activity_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE forum_messages (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  fil_id          UUID NOT NULL REFERENCES forum_fils(id),
  auteur_id       UUID NOT NULL REFERENCES profiles(id),
  contenu         TEXT NOT NULL CHECK (char_length(contenu) <= 3000),
  statut          TEXT DEFAULT 'publie',       -- 'publie', 'en_revue', 'supprime'
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Opportunités
CREATE TABLE opportunites (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type_opp        opportunite_type NOT NULL,
  titre           TEXT NOT NULL,
  description     TEXT,
  organisation    TEXT,
  pays            TEXT,
  filiere         TEXT,
  date_limite     DATE,
  lien_externe    TEXT,
  poste_par       UUID REFERENCES profiles(id),
  statut          TEXT DEFAULT 'en_attente_validation',
  created_at      TIMESTAMPTZ DEFAULT NOW()
);
