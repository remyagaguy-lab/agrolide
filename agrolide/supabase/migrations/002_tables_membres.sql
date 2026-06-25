-- =====================================================
-- MEMBRES & AUTH
-- =====================================================

-- Extension de auth.users de Supabase
CREATE TABLE profiles (
  id                  UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  categorie           membre_categorie NOT NULL,
  statut_adhesion     adhesion_statut DEFAULT 'en_attente_paiement' NOT NULL,
  role_plateforme     role_plateforme DEFAULT 'membre' NOT NULL,
  prenom              TEXT NOT NULL,
  nom                 TEXT NOT NULL,
  email               TEXT NOT NULL UNIQUE,
  pays                TEXT NOT NULL,
  ville               TEXT,
  biographie          TEXT CHECK (char_length(biographie) <= 500),
  photo_url           TEXT,                    -- URL R2 signée (stockage)
  specialite          TEXT,
  secteurs_expertise  TEXT[],                  -- Array de tags
  niveau_etudes       TEXT,
  organisation        TEXT,
  linkedin_url        TEXT,
  site_web_url        TEXT,
  langues             TEXT[],
  annuaire_visible    BOOLEAN DEFAULT TRUE,
  ouvert_contact      BOOLEAN DEFAULT TRUE,
  newsletter_brevo    BOOLEAN DEFAULT TRUE,
  notif_opportunites  BOOLEAN DEFAULT TRUE,
  notif_evenements    BOOLEAN DEFAULT TRUE,
  created_at          TIMESTAMPTZ DEFAULT NOW(),
  updated_at          TIMESTAMPTZ DEFAULT NOW()
);

-- Cotisations
CREATE TABLE cotisations (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  membre_id       UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  categorie       membre_categorie NOT NULL,
  montant_fcfa    INTEGER NOT NULL,
  methode         paiement_methode NOT NULL,
  statut          paiement_statut DEFAULT 'en_attente',
  provider_ref    TEXT,                        -- ID transaction Stripe/CinetPay
  date_debut      DATE,
  date_fin        DATE,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Messages internes
CREATE TABLE messages (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  expediteur_id   UUID NOT NULL REFERENCES profiles(id),
  destinataire_id UUID NOT NULL REFERENCES profiles(id),
  contenu         TEXT NOT NULL CHECK (char_length(contenu) <= 2000),
  lu              BOOLEAN DEFAULT FALSE,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Notifications
CREATE TABLE notifications (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  type            TEXT NOT NULL,               -- 'nouveau_message', 'evenement', 'opportunite', etc.
  contenu         TEXT NOT NULL,
  lien            TEXT,
  lu              BOOLEAN DEFAULT FALSE,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);
