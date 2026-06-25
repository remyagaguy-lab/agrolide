-- =====================================================
-- AGROBUSINESS
-- =====================================================

CREATE TABLE demandes_service (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  prenom          TEXT NOT NULL,
  nom             TEXT NOT NULL,
  email           TEXT NOT NULL,
  pays            TEXT,
  organisation    TEXT,
  type_service    TEXT NOT NULL,
  description     TEXT NOT NULL,
  budget_tranche  TEXT,
  delai           TEXT,
  fichier_r2_key  TEXT,
  statut          demande_statut DEFAULT 'nouveau',
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE candidatures_incubation (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  prenom          TEXT NOT NULL,
  nom             TEXT NOT NULL,
  email           TEXT NOT NULL,
  pays            TEXT,
  nom_projet      TEXT NOT NULL,
  secteur         TEXT,
  stade           TEXT,
  probleme        TEXT,
  solution        TEXT,
  marche_cible    TEXT,
  modele_eco      TEXT,
  financement_recu BOOLEAN DEFAULT FALSE,
  montant_financement TEXT,
  cv_r2_key       TEXT,
  motivation      TEXT,
  statut          TEXT DEFAULT 'soumise',
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Vitrine agripreneurs
CREATE TABLE agripreneurs (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nom             TEXT NOT NULL,
  projet          TEXT NOT NULL,
  pays            TEXT,
  secteur         TEXT,
  description     TEXT,
  photo_url       TEXT,
  lien_web        TEXT,
  temoignage      TEXT,
  publie          BOOLEAN DEFAULT FALSE,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);
