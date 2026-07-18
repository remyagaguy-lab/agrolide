-- =====================================================
-- TABLE: evenements (Sécurisation RLS)
-- =====================================================
ALTER TABLE evenements ENABLE ROW LEVEL SECURITY;

-- Lecture : Tout le monde peut voir les événements (ils sont publics)
CREATE POLICY "evenements_select_all" ON evenements
  FOR SELECT USING (TRUE);

-- Insertion, Mise à jour, Suppression : Réservé aux administrateurs
CREATE POLICY "evenements_admin_all" ON evenements
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND role_plateforme IN ('admin_content', 'super_admin')
    )
  );
