export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      agripreneurs: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          lien_web: string | null
          nom: string
          pays: string | null
          photo_url: string | null
          projet: string
          publie: boolean | null
          secteur: string | null
          temoignage: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          lien_web?: string | null
          nom: string
          pays?: string | null
          photo_url?: string | null
          projet: string
          publie?: boolean | null
          secteur?: string | null
          temoignage?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          lien_web?: string | null
          nom?: string
          pays?: string | null
          photo_url?: string | null
          projet?: string
          publie?: boolean | null
          secteur?: string | null
          temoignage?: string | null
        }
        Relationships: []
      }
      articles: {
        Row: {
          acces: Database["public"]["Enums"]["doc_acces"] | null
          auteur_externe: string | null
          auteur_id: string | null
          categorie: string
          contenu_json: Json
          created_at: string | null
          cta_lien: string | null
          cta_texte: string | null
          extrait: string | null
          id: string
          image_une_url: string | null
          published_at: string | null
          slug: string
          statut: string | null
          tags: string[] | null
          titre: string
          updated_at: string | null
        }
        Insert: {
          acces?: Database["public"]["Enums"]["doc_acces"] | null
          auteur_externe?: string | null
          auteur_id?: string | null
          categorie: string
          contenu_json: Json
          created_at?: string | null
          cta_lien?: string | null
          cta_texte?: string | null
          extrait?: string | null
          id?: string
          image_une_url?: string | null
          published_at?: string | null
          slug: string
          statut?: string | null
          tags?: string[] | null
          titre: string
          updated_at?: string | null
        }
        Update: {
          acces?: Database["public"]["Enums"]["doc_acces"] | null
          auteur_externe?: string | null
          auteur_id?: string | null
          categorie?: string
          contenu_json?: Json
          created_at?: string | null
          cta_lien?: string | null
          cta_texte?: string | null
          extrait?: string | null
          id?: string
          image_une_url?: string | null
          published_at?: string | null
          slug?: string
          statut?: string | null
          tags?: string[] | null
          titre?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "articles_auteur_id_fkey"
            columns: ["auteur_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      avis_formation: {
        Row: {
          commentaire: string | null
          created_at: string | null
          formation_id: string
          id: string
          membre_id: string
          note: number
        }
        Insert: {
          commentaire?: string | null
          created_at?: string | null
          formation_id: string
          id?: string
          membre_id: string
          note: number
        }
        Update: {
          commentaire?: string | null
          created_at?: string | null
          formation_id?: string
          id?: string
          membre_id?: string
          note?: number
        }
        Relationships: [
          {
            foreignKeyName: "avis_formation_formation_id_fkey"
            columns: ["formation_id"]
            isOneToOne: false
            referencedRelation: "formations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "avis_formation_membre_id_fkey"
            columns: ["membre_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      campagnes_financement: {
        Row: {
          active: boolean | null
          created_at: string | null
          date_debut: string | null
          date_fin: string | null
          description: string | null
          id: string
          objectif_fcfa: number
          titre: string
        }
        Insert: {
          active?: boolean | null
          created_at?: string | null
          date_debut?: string | null
          date_fin?: string | null
          description?: string | null
          id?: string
          objectif_fcfa: number
          titre: string
        }
        Update: {
          active?: boolean | null
          created_at?: string | null
          date_debut?: string | null
          date_fin?: string | null
          description?: string | null
          id?: string
          objectif_fcfa?: number
          titre?: string
        }
        Relationships: []
      }
      candidatures_incubation: {
        Row: {
          created_at: string | null
          cv_r2_key: string | null
          email: string
          financement_recu: boolean | null
          id: string
          marche_cible: string | null
          modele_eco: string | null
          montant_financement: string | null
          motivation: string | null
          nom: string
          nom_projet: string
          pays: string | null
          prenom: string
          probleme: string | null
          secteur: string | null
          solution: string | null
          stade: string | null
          statut: string | null
        }
        Insert: {
          created_at?: string | null
          cv_r2_key?: string | null
          email: string
          financement_recu?: boolean | null
          id?: string
          marche_cible?: string | null
          modele_eco?: string | null
          montant_financement?: string | null
          motivation?: string | null
          nom: string
          nom_projet: string
          pays?: string | null
          prenom: string
          probleme?: string | null
          secteur?: string | null
          solution?: string | null
          stade?: string | null
          statut?: string | null
        }
        Update: {
          created_at?: string | null
          cv_r2_key?: string | null
          email?: string
          financement_recu?: boolean | null
          id?: string
          marche_cible?: string | null
          modele_eco?: string | null
          montant_financement?: string | null
          motivation?: string | null
          nom?: string
          nom_projet?: string
          pays?: string | null
          prenom?: string
          probleme?: string | null
          secteur?: string | null
          solution?: string | null
          stade?: string | null
          statut?: string | null
        }
        Relationships: []
      }
      contributions: {
        Row: {
          anonyme: boolean | null
          created_at: string | null
          email: string
          id: string
          methode: Database["public"]["Enums"]["paiement_methode"]
          montant_fcfa: number
          prenom: string | null
          provider_ref: string | null
          statut: Database["public"]["Enums"]["paiement_statut"] | null
        }
        Insert: {
          anonyme?: boolean | null
          created_at?: string | null
          email: string
          id?: string
          methode: Database["public"]["Enums"]["paiement_methode"]
          montant_fcfa: number
          prenom?: string | null
          provider_ref?: string | null
          statut?: Database["public"]["Enums"]["paiement_statut"] | null
        }
        Update: {
          anonyme?: boolean | null
          created_at?: string | null
          email?: string
          id?: string
          methode?: Database["public"]["Enums"]["paiement_methode"]
          montant_fcfa?: number
          prenom?: string | null
          provider_ref?: string | null
          statut?: Database["public"]["Enums"]["paiement_statut"] | null
        }
        Relationships: []
      }
      cotisations: {
        Row: {
          categorie: Database["public"]["Enums"]["membre_categorie"]
          created_at: string | null
          date_debut: string | null
          date_fin: string | null
          id: string
          membre_id: string
          methode: Database["public"]["Enums"]["paiement_methode"]
          montant_fcfa: number
          provider_ref: string | null
          statut: Database["public"]["Enums"]["paiement_statut"] | null
        }
        Insert: {
          categorie: Database["public"]["Enums"]["membre_categorie"]
          created_at?: string | null
          date_debut?: string | null
          date_fin?: string | null
          id?: string
          membre_id: string
          methode: Database["public"]["Enums"]["paiement_methode"]
          montant_fcfa: number
          provider_ref?: string | null
          statut?: Database["public"]["Enums"]["paiement_statut"] | null
        }
        Update: {
          categorie?: Database["public"]["Enums"]["membre_categorie"]
          created_at?: string | null
          date_debut?: string | null
          date_fin?: string | null
          id?: string
          membre_id?: string
          methode?: Database["public"]["Enums"]["paiement_methode"]
          montant_fcfa?: number
          provider_ref?: string | null
          statut?: Database["public"]["Enums"]["paiement_statut"] | null
        }
        Relationships: [
          {
            foreignKeyName: "cotisations_membre_id_fkey"
            columns: ["membre_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      demandes_service: {
        Row: {
          budget_tranche: string | null
          created_at: string | null
          delai: string | null
          description: string
          email: string
          fichier_r2_key: string | null
          id: string
          nom: string
          organisation: string | null
          pays: string | null
          prenom: string
          statut: Database["public"]["Enums"]["demande_statut"] | null
          type_service: string
        }
        Insert: {
          budget_tranche?: string | null
          created_at?: string | null
          delai?: string | null
          description: string
          email: string
          fichier_r2_key?: string | null
          id?: string
          nom: string
          organisation?: string | null
          pays?: string | null
          prenom: string
          statut?: Database["public"]["Enums"]["demande_statut"] | null
          type_service: string
        }
        Update: {
          budget_tranche?: string | null
          created_at?: string | null
          delai?: string | null
          description?: string
          email?: string
          fichier_r2_key?: string | null
          id?: string
          nom?: string
          organisation?: string | null
          pays?: string | null
          prenom?: string
          statut?: Database["public"]["Enums"]["demande_statut"] | null
          type_service?: string
        }
        Relationships: []
      }
      documents: {
        Row: {
          acces: Database["public"]["Enums"]["doc_acces"]
          annee: number | null
          auteurs: string
          created_at: string | null
          depose_par: string | null
          fichier_r2_key: string
          filiere: string | null
          id: string
          langue: string | null
          nb_telechargements: number | null
          pays: string | null
          published_at: string | null
          resume: string | null
          statut: Database["public"]["Enums"]["doc_statut"]
          taille_octets: number | null
          thematique: string
          titre: string
          type_doc: Database["public"]["Enums"]["doc_type"]
          valide_par: string | null
        }
        Insert: {
          acces?: Database["public"]["Enums"]["doc_acces"]
          annee?: number | null
          auteurs: string
          created_at?: string | null
          depose_par?: string | null
          fichier_r2_key: string
          filiere?: string | null
          id?: string
          langue?: string | null
          nb_telechargements?: number | null
          pays?: string | null
          published_at?: string | null
          resume?: string | null
          statut?: Database["public"]["Enums"]["doc_statut"]
          taille_octets?: number | null
          thematique: string
          titre: string
          type_doc: Database["public"]["Enums"]["doc_type"]
          valide_par?: string | null
        }
        Update: {
          acces?: Database["public"]["Enums"]["doc_acces"]
          annee?: number | null
          auteurs?: string
          created_at?: string | null
          depose_par?: string | null
          fichier_r2_key?: string
          filiere?: string | null
          id?: string
          langue?: string | null
          nb_telechargements?: number | null
          pays?: string | null
          published_at?: string | null
          resume?: string | null
          statut?: Database["public"]["Enums"]["doc_statut"]
          taille_octets?: number | null
          thematique?: string
          titre?: string
          type_doc?: Database["public"]["Enums"]["doc_type"]
          valide_par?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "documents_depose_par_fkey"
            columns: ["depose_par"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documents_valide_par_fkey"
            columns: ["valide_par"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      evenements: {
        Row: {
          created_at: string | null
          date_debut: string
          date_fin: string | null
          description: string | null
          en_ligne: boolean | null
          id: string
          image_url: string | null
          lien_inscription: string | null
          lieu: string | null
          pays: string | null
          places_max: number | null
          publie: boolean | null
          titre: string
          type_evt: Database["public"]["Enums"]["evenement_type"]
        }
        Insert: {
          created_at?: string | null
          date_debut: string
          date_fin?: string | null
          description?: string | null
          en_ligne?: boolean | null
          id?: string
          image_url?: string | null
          lien_inscription?: string | null
          lieu?: string | null
          pays?: string | null
          places_max?: number | null
          publie?: boolean | null
          titre: string
          type_evt: Database["public"]["Enums"]["evenement_type"]
        }
        Update: {
          created_at?: string | null
          date_debut?: string
          date_fin?: string | null
          description?: string | null
          en_ligne?: boolean | null
          id?: string
          image_url?: string | null
          lien_inscription?: string | null
          lieu?: string | null
          pays?: string | null
          places_max?: number | null
          publie?: boolean | null
          titre?: string
          type_evt?: Database["public"]["Enums"]["evenement_type"]
        }
        Relationships: []
      }
      formations: {
        Row: {
          acces: Database["public"]["Enums"]["doc_acces"] | null
          created_at: string | null
          description: string | null
          id: string
          intervenants: Json | null
          modalite: Database["public"]["Enums"]["formation_modalite"]
          niveau: string | null
          prix_fcfa: number | null
          programme_json: Json | null
          thematique: string | null
          titre: string
        }
        Insert: {
          acces?: Database["public"]["Enums"]["doc_acces"] | null
          created_at?: string | null
          description?: string | null
          id?: string
          intervenants?: Json | null
          modalite: Database["public"]["Enums"]["formation_modalite"]
          niveau?: string | null
          prix_fcfa?: number | null
          programme_json?: Json | null
          thematique?: string | null
          titre: string
        }
        Update: {
          acces?: Database["public"]["Enums"]["doc_acces"] | null
          created_at?: string | null
          description?: string | null
          id?: string
          intervenants?: Json | null
          modalite?: Database["public"]["Enums"]["formation_modalite"]
          niveau?: string | null
          prix_fcfa?: number | null
          programme_json?: Json | null
          thematique?: string | null
          titre?: string
        }
        Relationships: []
      }
      forum_categories: {
        Row: {
          id: string
          nom: string
          ordre: number | null
        }
        Insert: {
          id?: string
          nom: string
          ordre?: number | null
        }
        Update: {
          id?: string
          nom?: string
          ordre?: number | null
        }
        Relationships: []
      }
      forum_fils: {
        Row: {
          auteur_id: string
          categorie_id: string
          created_at: string | null
          id: string
          last_activity_at: string | null
          nb_reponses: number | null
          statut: string | null
          titre: string
        }
        Insert: {
          auteur_id: string
          categorie_id: string
          created_at?: string | null
          id?: string
          last_activity_at?: string | null
          nb_reponses?: number | null
          statut?: string | null
          titre: string
        }
        Update: {
          auteur_id?: string
          categorie_id?: string
          created_at?: string | null
          id?: string
          last_activity_at?: string | null
          nb_reponses?: number | null
          statut?: string | null
          titre?: string
        }
        Relationships: [
          {
            foreignKeyName: "forum_fils_auteur_id_fkey"
            columns: ["auteur_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "forum_fils_categorie_id_fkey"
            columns: ["categorie_id"]
            isOneToOne: false
            referencedRelation: "forum_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      forum_messages: {
        Row: {
          auteur_id: string
          contenu: string
          created_at: string | null
          fil_id: string
          id: string
          statut: string | null
          updated_at: string | null
        }
        Insert: {
          auteur_id: string
          contenu: string
          created_at?: string | null
          fil_id: string
          id?: string
          statut?: string | null
          updated_at?: string | null
        }
        Update: {
          auteur_id?: string
          contenu?: string
          created_at?: string | null
          fil_id?: string
          id?: string
          statut?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "forum_messages_auteur_id_fkey"
            columns: ["auteur_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "forum_messages_fil_id_fkey"
            columns: ["fil_id"]
            isOneToOne: false
            referencedRelation: "forum_fils"
            referencedColumns: ["id"]
          },
        ]
      }
      inscriptions_evenement: {
        Row: {
          created_at: string | null
          email_externe: string | null
          evenement_id: string
          id: string
          membre_id: string | null
          nom: string | null
          prenom: string | null
        }
        Insert: {
          created_at?: string | null
          email_externe?: string | null
          evenement_id: string
          id?: string
          membre_id?: string | null
          nom?: string | null
          prenom?: string | null
        }
        Update: {
          created_at?: string | null
          email_externe?: string | null
          evenement_id?: string
          id?: string
          membre_id?: string | null
          nom?: string | null
          prenom?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "inscriptions_evenement_evenement_id_fkey"
            columns: ["evenement_id"]
            isOneToOne: false
            referencedRelation: "evenements"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inscriptions_evenement_membre_id_fkey"
            columns: ["membre_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      inscriptions_formation: {
        Row: {
          certificat_r2_key: string | null
          created_at: string | null
          id: string
          membre_id: string
          session_id: string
          statut: Database["public"]["Enums"]["inscription_statut"] | null
        }
        Insert: {
          certificat_r2_key?: string | null
          created_at?: string | null
          id?: string
          membre_id: string
          session_id: string
          statut?: Database["public"]["Enums"]["inscription_statut"] | null
        }
        Update: {
          certificat_r2_key?: string | null
          created_at?: string | null
          id?: string
          membre_id?: string
          session_id?: string
          statut?: Database["public"]["Enums"]["inscription_statut"] | null
        }
        Relationships: [
          {
            foreignKeyName: "inscriptions_formation_membre_id_fkey"
            columns: ["membre_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inscriptions_formation_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "sessions_formation"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          contenu: string
          created_at: string | null
          destinataire_id: string
          expediteur_id: string
          id: string
          lu: boolean | null
        }
        Insert: {
          contenu: string
          created_at?: string | null
          destinataire_id: string
          expediteur_id: string
          id?: string
          lu?: boolean | null
        }
        Update: {
          contenu?: string
          created_at?: string | null
          destinataire_id?: string
          expediteur_id?: string
          id?: string
          lu?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "messages_destinataire_id_fkey"
            columns: ["destinataire_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_expediteur_id_fkey"
            columns: ["expediteur_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          contenu: string
          created_at: string | null
          id: string
          lien: string | null
          lu: boolean | null
          type: string
          user_id: string
        }
        Insert: {
          contenu: string
          created_at?: string | null
          id?: string
          lien?: string | null
          lu?: boolean | null
          type: string
          user_id: string
        }
        Update: {
          contenu?: string
          created_at?: string | null
          id?: string
          lien?: string | null
          lu?: boolean | null
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      opportunites: {
        Row: {
          created_at: string | null
          date_limite: string | null
          description: string | null
          filiere: string | null
          id: string
          lien_externe: string | null
          organisation: string | null
          pays: string | null
          poste_par: string | null
          statut: string | null
          titre: string
          type_opp: Database["public"]["Enums"]["opportunite_type"]
        }
        Insert: {
          created_at?: string | null
          date_limite?: string | null
          description?: string | null
          filiere?: string | null
          id?: string
          lien_externe?: string | null
          organisation?: string | null
          pays?: string | null
          poste_par?: string | null
          statut?: string | null
          titre: string
          type_opp: Database["public"]["Enums"]["opportunite_type"]
        }
        Update: {
          created_at?: string | null
          date_limite?: string | null
          description?: string | null
          filiere?: string | null
          id?: string
          lien_externe?: string | null
          organisation?: string | null
          pays?: string | null
          poste_par?: string | null
          statut?: string | null
          titre?: string
          type_opp?: Database["public"]["Enums"]["opportunite_type"]
        }
        Relationships: [
          {
            foreignKeyName: "opportunites_poste_par_fkey"
            columns: ["poste_par"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      pages_statiques: {
        Row: {
          contenu_json: Json | null
          id: string
          meta_description: string | null
          slug: string
          titre: string | null
          updated_at: string | null
        }
        Insert: {
          contenu_json?: Json | null
          id?: string
          meta_description?: string | null
          slug: string
          titre?: string | null
          updated_at?: string | null
        }
        Update: {
          contenu_json?: Json | null
          id?: string
          meta_description?: string | null
          slug?: string
          titre?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      partenaires: {
        Row: {
          contact_nom: string | null
          contact_titre: string | null
          created_at: string | null
          description: string | null
          id: string
          logo_url: string | null
          nom: string
          ordre: number | null
          publie: boolean | null
          site_web: string | null
          temoignage: string | null
        }
        Insert: {
          contact_nom?: string | null
          contact_titre?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          logo_url?: string | null
          nom: string
          ordre?: number | null
          publie?: boolean | null
          site_web?: string | null
          temoignage?: string | null
        }
        Update: {
          contact_nom?: string | null
          contact_titre?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          logo_url?: string | null
          nom?: string
          ordre?: number | null
          publie?: boolean | null
          site_web?: string | null
          temoignage?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          annuaire_visible: boolean | null
          biographie: string | null
          categorie: Database["public"]["Enums"]["membre_categorie"]
          created_at: string | null
          email: string
          id: string
          langues: string[] | null
          linkedin_url: string | null
          newsletter_brevo: boolean | null
          niveau_etudes: string | null
          nom: string
          notif_evenements: boolean | null
          notif_opportunites: boolean | null
          organisation: string | null
          ouvert_contact: boolean | null
          pays: string
          photo_url: string | null
          prenom: string
          role_plateforme: Database["public"]["Enums"]["role_plateforme"]
          secteurs_expertise: string[] | null
          site_web_url: string | null
          specialite: string | null
          statut_adhesion: Database["public"]["Enums"]["adhesion_statut"]
          updated_at: string | null
          ville: string | null
        }
        Insert: {
          annuaire_visible?: boolean | null
          biographie?: string | null
          categorie: Database["public"]["Enums"]["membre_categorie"]
          created_at?: string | null
          email: string
          id: string
          langues?: string[] | null
          linkedin_url?: string | null
          newsletter_brevo?: boolean | null
          niveau_etudes?: string | null
          nom: string
          notif_evenements?: boolean | null
          notif_opportunites?: boolean | null
          organisation?: string | null
          ouvert_contact?: boolean | null
          pays: string
          photo_url?: string | null
          prenom: string
          role_plateforme?: Database["public"]["Enums"]["role_plateforme"]
          secteurs_expertise?: string[] | null
          site_web_url?: string | null
          specialite?: string | null
          statut_adhesion?: Database["public"]["Enums"]["adhesion_statut"]
          updated_at?: string | null
          ville?: string | null
        }
        Update: {
          annuaire_visible?: boolean | null
          biographie?: string | null
          categorie?: Database["public"]["Enums"]["membre_categorie"]
          created_at?: string | null
          email?: string
          id?: string
          langues?: string[] | null
          linkedin_url?: string | null
          newsletter_brevo?: boolean | null
          niveau_etudes?: string | null
          nom?: string
          notif_evenements?: boolean | null
          notif_opportunites?: boolean | null
          organisation?: string | null
          ouvert_contact?: boolean | null
          pays?: string
          photo_url?: string | null
          prenom?: string
          role_plateforme?: Database["public"]["Enums"]["role_plateforme"]
          secteurs_expertise?: string[] | null
          site_web_url?: string | null
          specialite?: string | null
          statut_adhesion?: Database["public"]["Enums"]["adhesion_statut"]
          updated_at?: string | null
          ville?: string | null
        }
        Relationships: []
      }
      sessions_formation: {
        Row: {
          created_at: string | null
          date_debut: string
          date_fin: string
          formation_id: string
          id: string
          lien_rejoindre: string | null
          lieu: string | null
          places_max: number | null
          places_restantes: number | null
          statut: string | null
        }
        Insert: {
          created_at?: string | null
          date_debut: string
          date_fin: string
          formation_id: string
          id?: string
          lien_rejoindre?: string | null
          lieu?: string | null
          places_max?: number | null
          places_restantes?: number | null
          statut?: string | null
        }
        Update: {
          created_at?: string | null
          date_debut?: string
          date_fin?: string
          formation_id?: string
          id?: string
          lien_rejoindre?: string | null
          lieu?: string | null
          places_max?: number | null
          places_restantes?: number | null
          statut?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sessions_formation_formation_id_fkey"
            columns: ["formation_id"]
            isOneToOne: false
            referencedRelation: "formations"
            referencedColumns: ["id"]
          },
        ]
      }
      telechargements: {
        Row: {
          created_at: string | null
          document_id: string
          id: string
          membre_id: string
        }
        Insert: {
          created_at?: string | null
          document_id: string
          id?: string
          membre_id: string
        }
        Update: {
          created_at?: string | null
          document_id?: string
          id?: string
          membre_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "telechargements_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "documents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "telechargements_membre_id_fkey"
            columns: ["membre_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      temoignages: {
        Row: {
          categorie: Database["public"]["Enums"]["membre_categorie"] | null
          citation: string
          id: string
          nom: string | null
          ordre: number | null
          pays: string | null
          photo_url: string | null
          prenom: string
          publie: boolean | null
        }
        Insert: {
          categorie?: Database["public"]["Enums"]["membre_categorie"] | null
          citation: string
          id?: string
          nom?: string | null
          ordre?: number | null
          pays?: string | null
          photo_url?: string | null
          prenom: string
          publie?: boolean | null
        }
        Update: {
          categorie?: Database["public"]["Enums"]["membre_categorie"] | null
          citation?: string
          id?: string
          nom?: string | null
          ordre?: number | null
          pays?: string | null
          photo_url?: string | null
          prenom?: string
          publie?: boolean | null
        }
        Relationships: []
      }
      webinaires: {
        Row: {
          acces: Database["public"]["Enums"]["doc_acces"] | null
          created_at: string | null
          date_heure: string
          description: string | null
          duree_minutes: number | null
          fiche_resumee_id: string | null
          id: string
          intervenant: string | null
          titre: string
          youtube_id: string | null
          youtube_live_id: string | null
        }
        Insert: {
          acces?: Database["public"]["Enums"]["doc_acces"] | null
          created_at?: string | null
          date_heure: string
          description?: string | null
          duree_minutes?: number | null
          fiche_resumee_id?: string | null
          id?: string
          intervenant?: string | null
          titre: string
          youtube_id?: string | null
          youtube_live_id?: string | null
        }
        Update: {
          acces?: Database["public"]["Enums"]["doc_acces"] | null
          created_at?: string | null
          date_heure?: string
          description?: string | null
          duree_minutes?: number | null
          fiche_resumee_id?: string | null
          id?: string
          intervenant?: string | null
          titre?: string
          youtube_id?: string | null
          youtube_live_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "webinaires_fiche_resumee_id_fkey"
            columns: ["fiche_resumee_id"]
            isOneToOne: false
            referencedRelation: "documents"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      adhesion_statut: "en_attente_paiement" | "actif" | "expire" | "suspendu"
      demande_statut: "nouveau" | "en_cours" | "traite" | "clos"
      doc_acces: "public" | "membres"
      doc_statut: "en_attente_validation" | "publie" | "rejete" | "archive"
      doc_type:
        | "these"
        | "memoire"
        | "fiche_technique"
        | "guide_pratique"
        | "article"
        | "rapport"
      evenement_type:
        | "meetup"
        | "webinaire"
        | "conference"
        | "atelier"
        | "autre"
      formation_modalite: "presentiel" | "distanciel" | "hybride"
      inscription_statut: "inscrit" | "en_attente" | "complete" | "annule"
      membre_categorie: "junior" | "professionnel" | "partenaire" | "senior"
      opportunite_type: "emploi" | "appel_a_projets" | "partenariat"
      paiement_methode: "stripe" | "cinetpay"
      paiement_statut: "en_attente" | "valide" | "echoue" | "rembourse"
      role_plateforme: "membre" | "admin_content" | "super_admin"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      adhesion_statut: ["en_attente_paiement", "actif", "expire", "suspendu"],
      demande_statut: ["nouveau", "en_cours", "traite", "clos"],
      doc_acces: ["public", "membres"],
      doc_statut: ["en_attente_validation", "publie", "rejete", "archive"],
      doc_type: [
        "these",
        "memoire",
        "fiche_technique",
        "guide_pratique",
        "article",
        "rapport",
      ],
      evenement_type: ["meetup", "webinaire", "conference", "atelier", "autre"],
      formation_modalite: ["presentiel", "distanciel", "hybride"],
      inscription_statut: ["inscrit", "en_attente", "complete", "annule"],
      membre_categorie: ["junior", "professionnel", "partenaire", "senior"],
      opportunite_type: ["emploi", "appel_a_projets", "partenariat"],
      paiement_methode: ["stripe", "cinetpay"],
      paiement_statut: ["en_attente", "valide", "echoue", "rembourse"],
      role_plateforme: ["membre", "admin_content", "super_admin"],
    },
  },
} as const
