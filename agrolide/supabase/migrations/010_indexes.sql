-- Recherche annuaire
CREATE INDEX idx_profiles_categorie ON profiles(categorie);
CREATE INDEX idx_profiles_pays ON profiles(pays);
CREATE INDEX idx_profiles_annuaire ON profiles(annuaire_visible, statut_adhesion);
CREATE INDEX idx_profiles_search ON profiles USING GIN (to_tsvector('french', prenom || ' ' || nom || ' ' || COALESCE(specialite, '') || ' ' || COALESCE(organisation, '')));

-- Bibliothèque
CREATE INDEX idx_documents_statut_acces ON documents(statut, acces);
CREATE INDEX idx_documents_thematique ON documents(thematique);
CREATE INDEX idx_documents_pays ON documents(pays);
CREATE INDEX idx_documents_search ON documents USING GIN (to_tsvector('french', titre || ' ' || COALESCE(resume, '')));

-- Blog
CREATE INDEX idx_articles_slug ON articles(slug);
CREATE INDEX idx_articles_statut_published ON articles(statut, published_at DESC);
CREATE INDEX idx_articles_categorie ON articles(categorie);

-- Forum
CREATE INDEX idx_forum_fils_last_activity ON forum_fils(last_activity_at DESC);
CREATE INDEX idx_forum_messages_fil ON forum_messages(fil_id, created_at);

-- Notifications
CREATE INDEX idx_notifications_user_lu ON notifications(user_id, lu, created_at DESC);

-- Cotisations
CREATE INDEX idx_cotisations_membre ON cotisations(membre_id, statut);
