-- =====================================================
-- BIBLIOTHÈQUE
-- =====================================================

CREATE TABLE documents (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  titre           TEXT NOT NULL,
  auteurs         TEXT NOT NULL,
  type_doc        doc_type NOT NULL,
  acces           doc_acces DEFAULT 'membres' NOT NULL,
  statut          doc_statut DEFAULT 'en_attente_validation' NOT NULL,
  resume          TEXT CHECK (char_length(resume) <= 500),
  thematique      TEXT NOT NULL,
  pays            TEXT,
  filiere         TEXT,
  langue          TEXT DEFAULT 'fr',
  annee           INTEGER,
  fichier_r2_key  TEXT NOT NULL,               -- Clé objet R2 (ex: bibliotheque/uuid.pdf)
  taille_octets   BIGINT,
  nb_telechargements INTEGER DEFAULT 0,
  depose_par      UUID REFERENCES profiles(id),
  valide_par      UUID REFERENCES profiles(id),
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  published_at    TIMESTAMPTZ
);

-- Téléchargements (log)
CREATE TABLE telechargements (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id     UUID NOT NULL REFERENCES documents(id),
  membre_id       UUID NOT NULL REFERENCES profiles(id),
  created_at      TIMESTAMPTZ DEFAULT NOW()
);
