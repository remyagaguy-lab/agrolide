import { Briefcase, CalendarDays, GraduationCap, Handshake, HeartHandshake, Library, Newspaper, Rocket, Sprout, Users, Video, type LucideIcon } from "lucide-react"

/**
 * Navigation publique : trois domaines d'action, nommés par le verbe de ce que le visiteur veut faire.
 * Règles de rédaction : verbe à l'infinitif (ou « mon / mes » quand c'est l'objectif de la personne),
 * une ligne qui dit le bénéfice, jamais « Découvrir ». On n'affiche que ce qui existe aujourd'hui.
 */
export interface NavLeaf {
  label: string
  href: string
}

export interface NavMegaItem {
  label: string
  description: string
  href: string
  Icon: LucideIcon
}

export interface NavMega {
  key: string
  label: string
  /** Promesse du domaine (colonne de gauche du panneau). */
  promise: string
  /** Lien « Voir tout » : section correspondante de /nos-actions. */
  allHref: string
  items: NavMegaItem[]
}

export const NAV_DIRECT: NavLeaf[] = [
  { label: "Accueil", href: "/" },
  { label: "À propos", href: "/qui-sommes-nous" },
  { label: "Nos actions", href: "/nos-actions" },
]

export const NAV_MEGA: NavMega[] = [
  {
    key: "reseauter",
    label: "Réseauter",
    promise: "Rejoignez une communauté d'acteurs agricoles et mobilisez ensemble les ressources du réseau.",
    allHref: "/nos-actions#reseauter",
    items: [
      { label: "Trouver un expert", description: "Parcourez l'annuaire des membres par pays et par spécialité.", href: "/annuaire", Icon: Users },
      { label: "Participer à un événement", description: "Rencontres, opportunités et rendez-vous du réseau.", href: "/actualites", Icon: CalendarDays },
      { label: "Devenir partenaire", description: "Associez votre structure aux activités du réseau.", href: "/partenaires", Icon: Handshake },
      { label: "Soutenir le réseau", description: "Un don pour financer les actions auprès des agriculteurs.", href: "/nous-soutenir", Icon: HeartHandshake },
    ],
  },
  {
    key: "se-former",
    label: "Se former",
    promise: "Montez en compétences et préparez votre insertion professionnelle dans l'agriculture.",
    allHref: "/nos-actions#se-former",
    items: [
      { label: "Suivre une formation", description: "Parcours pratiques et certifiants animés par des experts de terrain.", href: "/formations", Icon: GraduationCap },
      { label: "Consulter la bibliothèque", description: "Thèses, mémoires, guides et fiches techniques adaptés à l'Afrique.", href: "/bibliotheque", Icon: Library },
      { label: "Lire le blog", description: "Analyses, récits et conseils venus du terrain.", href: "/blog", Icon: Newspaper },
      { label: "Participer à un webinaire", description: "Échangez sur les thématiques agricoles avec la communauté.", href: "/webinaires", Icon: Video },
    ],
  },
  {
    key: "entreprendre",
    label: "Entreprendre",
    promise: "Transformez votre idée agricole en projet viable, avec un accompagnement sur mesure.",
    allHref: "/nos-actions#entreprendre",
    items: [
      { label: "Lancer mon projet", description: "Un programme d'incubation pour les agripreneurs.", href: "/agrobusiness/incubation", Icon: Rocket },
      { label: "Être accompagné", description: "Études, business plans et conseil technique.", href: "/agrobusiness", Icon: Briefcase },
      { label: "S'inspirer d'agripreneurs", description: "Découvrez les parcours de ceux qui ont franchi le pas.", href: "/agrobusiness/agripreneurs", Icon: Sprout },
    ],
  },
]
