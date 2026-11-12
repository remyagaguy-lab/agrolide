// Classement de la bibliothèque : valeurs et libellés.
// Généré à partir de Bibliotheque-Curation/taxonomie.json (version v1-depart). Les codes sont stockés en base, les libellés servent à l'affichage.
// Fichier sans dépendance serveur : utilisable dans les composants client comme serveur.

export interface Option { code: string; label: string }
export interface Domaine extends Option { sousDomaines: Option[] }

export const DOMAINES: Domaine[] = [
  {
    "code": "production_vegetale",
    "label": "Production végétale",
    "sousDomaines": [
      {
        "code": "cereales",
        "label": "Céréales"
      },
      {
        "code": "legumineuses_oleagineux",
        "label": "Légumineuses et oléagineux"
      },
      {
        "code": "tubercules_racines",
        "label": "Tubercules et racines"
      },
      {
        "code": "cultures_maraicheres",
        "label": "Cultures maraîchères"
      },
      {
        "code": "arboriculture_fruitiere",
        "label": "Arboriculture fruitière"
      },
      {
        "code": "cultures_de_rente",
        "label": "Cultures de rente et industrielles"
      },
      {
        "code": "plantes_aromatiques_medicinales",
        "label": "Plantes aromatiques et médicinales"
      },
      {
        "code": "horticulture_jardinage",
        "label": "Horticulture et jardinage"
      },
      {
        "code": "agronomie_generale",
        "label": "Agronomie générale et techniques culturales"
      },
      {
        "code": "protection_des_cultures",
        "label": "Protection des cultures"
      },
      {
        "code": "semences_amelioration",
        "label": "Semences et amélioration variétale"
      },
      {
        "code": "fertilisation_amendements",
        "label": "Fertilisation et amendements"
      },
      {
        "code": "culture_sous_abri_hors_sol",
        "label": "Culture sous abri et hors sol"
      }
    ]
  },
  {
    "code": "production_animale",
    "label": "Production animale",
    "sousDomaines": [
      {
        "code": "aviculture",
        "label": "Aviculture"
      },
      {
        "code": "ruminants",
        "label": "Bovins, ovins, caprins"
      },
      {
        "code": "porcins",
        "label": "Porcins"
      },
      {
        "code": "petit_elevage",
        "label": "Petit élevage"
      },
      {
        "code": "apiculture",
        "label": "Apiculture"
      },
      {
        "code": "aquaculture_peche",
        "label": "Aquaculture et pêche"
      },
      {
        "code": "alimentation_animale",
        "label": "Alimentation animale"
      },
      {
        "code": "sante_animale",
        "label": "Santé animale"
      },
      {
        "code": "genetique_reproduction",
        "label": "Génétique et reproduction animale"
      },
      {
        "code": "batiments_equipements_elevage",
        "label": "Bâtiments et équipements d'élevage"
      },
      {
        "code": "elevage_general",
        "label": "Élevage général"
      }
    ]
  },
  {
    "code": "agroeconomie",
    "label": "Agroéconomie",
    "sousDomaines": [
      {
        "code": "gestion_projet_business_plan",
        "label": "Gestion de projet et business plan"
      },
      {
        "code": "entrepreneuriat_agricole",
        "label": "Entrepreneuriat agricole"
      },
      {
        "code": "financement_credit_assurance",
        "label": "Financement, crédit et assurance"
      },
      {
        "code": "economie_filieres_marches",
        "label": "Économie des filières et marchés"
      },
      {
        "code": "agriculture_contractuelle",
        "label": "Agriculture contractuelle et commercialisation"
      },
      {
        "code": "politiques_strategies",
        "label": "Politiques et stratégies agricoles"
      },
      {
        "code": "organisations_paysannes",
        "label": "Coopératives et organisations paysannes"
      },
      {
        "code": "vulgarisation_conseil",
        "label": "Vulgarisation, conseil et formation agricole"
      },
      {
        "code": "gestion_exploitation",
        "label": "Gestion et comptabilité d'exploitation"
      },
      {
        "code": "foncier_droit_agricole",
        "label": "Foncier et droit agricole"
      }
    ]
  },
  {
    "code": "agroalimentaire",
    "label": "Agroalimentaire",
    "sousDomaines": [
      {
        "code": "transformation_cereales_tubercules",
        "label": "Transformation des céréales et tubercules"
      },
      {
        "code": "transformation_fruits_legumes",
        "label": "Transformation des fruits et légumes"
      },
      {
        "code": "transformation_produits_animaux",
        "label": "Transformation des produits animaux"
      },
      {
        "code": "huiles_sucre_corps_gras",
        "label": "Huiles, corps gras et sucre"
      },
      {
        "code": "boissons",
        "label": "Boissons"
      },
      {
        "code": "conservation_post_recolte",
        "label": "Conservation, stockage et post-récolte"
      },
      {
        "code": "qualite_securite_normes",
        "label": "Qualité, sécurité sanitaire et normes"
      },
      {
        "code": "nutrition_alimentation",
        "label": "Nutrition et alimentation humaine"
      },
      {
        "code": "equipements_technologie",
        "label": "Équipements et technologie alimentaire"
      },
      {
        "code": "entreprise_agroalimentaire",
        "label": "Entreprise agroalimentaire"
      }
    ]
  },
  {
    "code": "ressources_naturelles_environnement",
    "label": "Ressources naturelles",
    "sousDomaines": [
      {
        "code": "sol_fertilite",
        "label": "Sol et fertilité"
      },
      {
        "code": "eau_irrigation",
        "label": "Eau et irrigation"
      },
      {
        "code": "foresterie_agroforesterie",
        "label": "Foresterie et agroforesterie"
      },
      {
        "code": "climat_changement_climatique",
        "label": "Climat et changement climatique"
      },
      {
        "code": "biodiversite_ecologie",
        "label": "Biodiversité et écologie"
      },
      {
        "code": "agroecologie_agriculture_durable",
        "label": "Agroécologie et agriculture durable"
      },
      {
        "code": "energie_dechets_valorisation",
        "label": "Énergie, déchets et valorisation"
      }
    ]
  },
  {
    "code": "transversal",
    "label": "Transversal",
    "sousDomaines": [
      {
        "code": "agriculture_generale",
        "label": "Agriculture générale"
      },
      {
        "code": "methodologie_recherche",
        "label": "Méthodologie de recherche et rédaction"
      },
      {
        "code": "sciences_de_base",
        "label": "Sciences de base"
      },
      {
        "code": "statistiques_biometrie",
        "label": "Statistiques et biométrie"
      },
      {
        "code": "numerique_technologies",
        "label": "Numérique et technologies agricoles"
      }
    ]
  }
]

export const TYPES_DOCUMENT: Option[] = [
  {
    "code": "fiche_technique",
    "label": "Fiche technique"
  },
  {
    "code": "guide_pratique",
    "label": "Guide pratique"
  },
  {
    "code": "cours",
    "label": "Cours"
  },
  {
    "code": "ouvrage",
    "label": "Ouvrage"
  },
  {
    "code": "these",
    "label": "Thèse"
  },
  {
    "code": "memoire",
    "label": "Mémoire"
  },
  {
    "code": "article",
    "label": "Article"
  },
  {
    "code": "rapport",
    "label": "Rapport"
  },
  {
    "code": "presentation",
    "label": "Présentation"
  },
  {
    "code": "texte_officiel",
    "label": "Texte officiel"
  },
  {
    "code": "outil_modele",
    "label": "Outil / modèle"
  },
  {
    "code": "periodique",
    "label": "Périodique"
  },
  {
    "code": "actes_conference",
    "label": "Actes de conférence"
  },
  {
    "code": "autre",
    "label": "Autre"
  }
]

export const PUBLICS_CIBLES: Option[] = [
  {
    "code": "producteur",
    "label": "Producteur"
  },
  {
    "code": "technicien_conseiller",
    "label": "Technicien, conseiller, vulgarisateur"
  },
  {
    "code": "etudiant",
    "label": "Étudiant"
  },
  {
    "code": "enseignant_chercheur",
    "label": "Enseignant, chercheur"
  },
  {
    "code": "entrepreneur_porteur_projet",
    "label": "Entrepreneur, porteur de projet"
  },
  {
    "code": "decideur_institution",
    "label": "Décideur, institution, ONG"
  }
]

export const NIVEAUX: Option[] = [
  {
    "code": "initiation",
    "label": "Initiation"
  },
  {
    "code": "intermediaire",
    "label": "Intermédiaire"
  },
  {
    "code": "expert",
    "label": "Expert"
  }
]

const find = (list: Option[], code?: string | null) => (code ? list.find((o) => o.code === code)?.label : undefined)
const humanize = (code: string) => code.replace(/_/g, ' ').replace(/^./, (c) => c.toUpperCase())

export const labelDomaine = (code?: string | null) => find(DOMAINES, code) ?? (code ? humanize(code) : '')
export const labelType = (code?: string | null) => find(TYPES_DOCUMENT, code) ?? (code ? humanize(code) : 'Document')
export const labelPublic = (code?: string | null) => find(PUBLICS_CIBLES, code) ?? (code ? humanize(code) : '')
export const labelNiveau = (code?: string | null) => find(NIVEAUX, code) ?? (code ? humanize(code) : '')
export const labelSousDomaine = (code?: string | null) => {
  if (!code) return ''
  for (const d of DOMAINES) {
    const s = d.sousDomaines.find((x) => x.code === code)
    if (s) return s.label
  }
  return humanize(code)
}

export const sousDomainesDe = (domaine?: string | null): Option[] =>
  DOMAINES.find((d) => d.code === domaine)?.sousDomaines ?? []

/** Couleur du badge selon la nature du document. */
export function couleurType(code?: string | null): string {
  switch (code) {
    case 'fiche_technique':
    case 'guide_pratique':
      return 'bg-success-container text-on-success-container'
    case 'cours':
    case 'presentation':
    case 'ouvrage':
      return 'bg-info-container text-on-info-container'
    case 'article':
    case 'actes_conference':
    case 'these':
    case 'memoire':
      return 'bg-warning-container text-on-warning-container'
    default:
      return 'bg-surface-container text-on-surface'
  }
}
