-- Trigger : mise à jour automatique de updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Appliquer à toutes les tables avec updated_at
CREATE TRIGGER trg_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_articles_updated_at
  BEFORE UPDATE ON articles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_forum_messages_updated_at
  BEFORE UPDATE ON forum_messages
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Trigger : décrémenter places_restantes à l'inscription formation
CREATE OR REPLACE FUNCTION decrement_places()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE sessions_formation
  SET places_restantes = places_restantes - 1
  WHERE id = NEW.session_id AND places_restantes > 0;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_inscription_places
  AFTER INSERT ON inscriptions_formation
  FOR EACH ROW EXECUTE FUNCTION decrement_places();

-- Trigger : incrémenter nb_reponses dans forum_fils
CREATE OR REPLACE FUNCTION increment_nb_reponses()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE forum_fils
  SET nb_reponses = nb_reponses + 1,
      last_activity_at = NOW()
  WHERE id = NEW.fil_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_forum_reponses
  AFTER INSERT ON forum_messages
  FOR EACH ROW EXECUTE FUNCTION increment_nb_reponses();
