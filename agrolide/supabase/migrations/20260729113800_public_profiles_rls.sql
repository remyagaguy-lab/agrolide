-- =====================================================
-- Update RLS for public directory access
-- =====================================================

-- Drop the old policy that restricted viewing to active members only
DROP POLICY IF EXISTS "profiles_select_annuaire" ON profiles;

-- Create a new policy that allows ANYONE to view active profiles that opted in
CREATE POLICY "profiles_select_annuaire_public" ON profiles
  FOR SELECT USING (
    annuaire_visible = TRUE
    AND statut_adhesion = 'actif'
  );
