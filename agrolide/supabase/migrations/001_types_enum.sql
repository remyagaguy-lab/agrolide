-- Types énumérés
CREATE TYPE membre_categorie  AS ENUM ('junior', 'professionnel', 'partenaire', 'senior');
CREATE TYPE adhesion_statut   AS ENUM ('en_attente_paiement', 'actif', 'expire', 'suspendu');
CREATE TYPE role_plateforme   AS ENUM ('membre', 'admin_content', 'super_admin');
CREATE TYPE doc_type          AS ENUM ('these', 'memoire', 'fiche_technique', 'guide_pratique', 'article', 'rapport');
CREATE TYPE doc_acces         AS ENUM ('public', 'membres');
CREATE TYPE doc_statut        AS ENUM ('en_attente_validation', 'publie', 'rejete', 'archive');
CREATE TYPE formation_modalite AS ENUM ('presentiel', 'distanciel', 'hybride');
CREATE TYPE inscription_statut AS ENUM ('inscrit', 'en_attente', 'complete', 'annule');
CREATE TYPE evenement_type    AS ENUM ('meetup', 'webinaire', 'conference', 'atelier', 'autre');
CREATE TYPE paiement_methode  AS ENUM ('stripe', 'cinetpay');
CREATE TYPE paiement_statut   AS ENUM ('en_attente', 'valide', 'echoue', 'rembourse');
CREATE TYPE demande_statut    AS ENUM ('nouveau', 'en_cours', 'traite', 'clos');
CREATE TYPE opportunite_type  AS ENUM ('emploi', 'appel_a_projets', 'partenariat');
