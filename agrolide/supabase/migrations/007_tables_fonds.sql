-- =====================================================
-- COLLECTE DE FONDS
-- =====================================================

CREATE TABLE contributions (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  prenom          TEXT,
  email           TEXT NOT NULL,
  montant_fcfa    INTEGER NOT NULL,
  methode         paiement_methode NOT NULL,
  provider_ref    TEXT,
  statut          paiement_statut DEFAULT 'en_attente',
  anonyme         BOOLEAN DEFAULT FALSE,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE campagnes_financement (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  titre           TEXT NOT NULL,
  description     TEXT,
  objectif_fcfa   BIGINT NOT NULL,
  date_debut      DATE,
  date_fin        DATE,
  active          BOOLEAN DEFAULT TRUE,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Partenaires
CREATE TABLE partenaires (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nom             TEXT NOT NULL,
  logo_url        TEXT,
  site_web        TEXT,
  description     TEXT,
  temoignage      TEXT,
  contact_nom     TEXT,
  contact_titre   TEXT,
  ordre           INTEGER DEFAULT 0,
  publie          BOOLEAN DEFAULT TRUE,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);
