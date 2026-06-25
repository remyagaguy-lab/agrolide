-- =====================================================
-- TABLE: profiles
-- =====================================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Lecture : chaque membre lit son propre profil ; 
-- les membres actifs lisent les profils annuaire_visible = true et actifs
CREATE POLICY "profiles_select_own" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "profiles_select_annuaire" ON profiles
  FOR SELECT USING (
    annuaire_visible = TRUE
    AND statut_adhesion = 'actif'
    AND EXISTS (
      SELECT 1 FROM profiles p2
      WHERE p2.id = auth.uid()
      AND p2.statut_adhesion = 'actif'
    )
  );

-- Mise à jour : chaque membre met à jour son propre profil uniquement
CREATE POLICY "profiles_update_own" ON profiles
  FOR UPDATE USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id AND role_plateforme = 'membre'); -- Ne peut pas s'auto-promouvoir admin

-- Super admin : lecture et écriture totale
CREATE POLICY "profiles_admin_all" ON profiles
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role_plateforme = 'super_admin')
  );

-- =====================================================
-- TABLE: documents
-- =====================================================
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

-- Lecture publique des documents publiés à accès public
CREATE POLICY "documents_select_public" ON documents
  FOR SELECT USING (statut = 'publie' AND acces = 'public');

-- Lecture membres actifs : tous documents publiés
CREATE POLICY "documents_select_membres" ON documents
  FOR SELECT USING (
    statut = 'publie'
    AND EXISTS (
      SELECT 1 FROM profiles WHERE id = auth.uid() AND statut_adhesion = 'actif'
    )
  );

-- Dépôt : membres actifs non-Junior
CREATE POLICY "documents_insert_membres" ON documents
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND statut_adhesion = 'actif'
      AND categorie IN ('professionnel', 'partenaire', 'senior')
    )
  );

-- Admin : lecture et écriture totale
CREATE POLICY "documents_admin_all" ON documents
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role_plateforme IN ('admin_content', 'super_admin'))
  );

-- =====================================================
-- TABLE: messages
-- =====================================================
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Lecture : expéditeur ou destinataire uniquement
CREATE POLICY "messages_select_own" ON messages
  FOR SELECT USING (auth.uid() = expediteur_id OR auth.uid() = destinataire_id);

-- Insertion : membre actif Professionnel/Partenaire/Sénior
CREATE POLICY "messages_insert_membres" ON messages
  FOR INSERT WITH CHECK (
    auth.uid() = expediteur_id
    AND EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND statut_adhesion = 'actif'
      AND categorie IN ('professionnel', 'partenaire', 'senior')
    )
  );

-- Mise à jour : destinataire peut marquer comme lu
CREATE POLICY "messages_update_destinataire" ON messages
  FOR UPDATE USING (auth.uid() = destinataire_id)
  WITH CHECK (auth.uid() = destinataire_id);

-- =====================================================
-- TABLE: forum_messages
-- =====================================================
ALTER TABLE forum_messages ENABLE ROW LEVEL SECURITY;

-- Lecture : membres actifs (tous les messages publiés)
CREATE POLICY "forum_select_membres" ON forum_messages
  FOR SELECT USING (
    statut = 'publie'
    AND EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND statut_adhesion = 'actif')
  );

-- Insertion : membres actifs
CREATE POLICY "forum_insert_membres" ON forum_messages
  FOR INSERT WITH CHECK (
    auth.uid() = auteur_id
    AND EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND statut_adhesion = 'actif')
  );

-- Mise à jour : auteur uniquement dans les 24h
CREATE POLICY "forum_update_own" ON forum_messages
  FOR UPDATE USING (
    auth.uid() = auteur_id
    AND created_at > NOW() - INTERVAL '24 hours'
  );

-- =====================================================
-- TABLE: cotisations
-- =====================================================
ALTER TABLE cotisations ENABLE ROW LEVEL SECURITY;

-- Lecture : membre lit ses propres cotisations
CREATE POLICY "cotisations_select_own" ON cotisations
  FOR SELECT USING (auth.uid() = membre_id);

-- Insertion : uniquement via le Worker (service role)
-- => Pas de politique INSERT pour les rôles utilisateur
-- Le Worker utilise le service_role_key Supabase (non exposé au client)

-- =====================================================
-- Tables entièrement gérées par le Worker (service role) :
-- contributions, demandes_service, candidatures_incubation,
-- inscriptions_formation, inscriptions_evenement, notifications
-- => RLS activé mais pas de policy SELECT/INSERT pour auth.uid()
-- => Accès uniquement via service_role dans le Worker
-- =====================================================
