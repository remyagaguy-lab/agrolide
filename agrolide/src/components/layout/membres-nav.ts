import { Telescope, NotebookPen, LayoutDashboard, MessageCircle, TrendingUp, Users, type LucideIcon } from "@/components/ui/icons"
/**
 * Navigation de l'espace membre : six rubriques, nommées d'après les verbes de la navigation publique
 * (nav.ts : Réseauter / Se former / Entreprendre). Une rubrique regroupe plusieurs pages, présentées
 * en onglets par le layout de son groupe de routes — les URL, elles, ne changent pas.
 */
export interface MembresOnglet {
  label: string
  href: string
  /** Pastille portée par l'onglet. */
  badge?: "invitations" | "messages"
}

export interface MembresRubrique {
  key: "accueil" | "former" | "reseauter" | "opportunites" | "entreprendre" | "messages"
  label: string
  /** Destination du lien de la barre latérale (premier onglet). */
  href: string
  icon: LucideIcon
  /** Préfixes d'URL qui rendent la rubrique active dans la barre latérale. */
  prefixes: string[]
  onglets: MembresOnglet[]
  badge?: "invitations" | "messages"
}

/** Le forum reste masqué tant qu'il n'est pas réactivé : passer à `true` fait réapparaître l'onglet. */
export const FORUM_ACTIF = false

export const MEMBRES_RUBRIQUES: MembresRubrique[] = [
  {
    key: "accueil",
    label: "Accueil",
    href: "/membres/dashboard",
    icon: LayoutDashboard,
    prefixes: ["/membres/dashboard"],
    onglets: [],
  },
  {
    key: "former",
    label: "Se former",
    href: "/membres/formations",
    icon: NotebookPen,
    prefixes: ["/membres/formations", "/membres/bibliotheque", "/membres/webinaires"],
    onglets: [
      // « Mon parcours » réunit formations suivies, lectures, favoris et certificats.
      { label: "Mon parcours", href: "/membres/formations" },
      { label: "Bibliothèque", href: "/membres/bibliotheque" },
      { label: "Formations", href: "/membres/formations/catalogue" },
      { label: "Webinaires", href: "/membres/webinaires" },
    ],
  },
  {
    key: "reseauter",
    label: "Réseauter",
    href: "/membres/annuaire",
    icon: Users,
    prefixes: ["/membres/annuaire", "/membres/reseau", "/membres/evenements", "/membres/forum"],
    badge: "invitations",
    onglets: [
      { label: "Annuaire", href: "/membres/annuaire" },
      { label: "Mon réseau", href: "/membres/reseau", badge: "invitations" },
      { label: "Événements", href: "/membres/evenements" },
      ...(FORUM_ACTIF ? [{ label: "Forum", href: "/membres/forum" }] : []),
    ],
  },
  {
    key: "opportunites",
    label: "Opportunités",
    href: "/membres/opportunites",
    icon: Telescope,
    // Les offres seulement : « Entreprendre » a sa propre rubrique (son préfixe, plus long, l'emporte).
    prefixes: ["/membres/opportunites"],
    onglets: [],
  },
  {
    key: "entreprendre",
    label: "Entreprendre",
    href: "/membres/opportunites/entreprendre",
    icon: TrendingUp,
    prefixes: ["/membres/opportunites/entreprendre"],
    onglets: [],
  },
  {
    key: "messages",
    label: "Messages",
    href: "/membres/messages",
    icon: MessageCircle,
    prefixes: ["/membres/messages"],
    badge: "messages",
    onglets: [],
  },
]

export function rubriqueParCle(key: MembresRubrique["key"]): MembresRubrique {
  const r = MEMBRES_RUBRIQUES.find((x) => x.key === key)
  if (!r) throw new Error(`Rubrique inconnue : ${key}`)
  return r
}

/**
 * Une URL appartient à une rubrique si elle égale un de ses préfixes ou s'y trouve en dessous.
 * Si plusieurs rubriques correspondent (Entreprendre vit sous /membres/opportunites), le préfixe le plus long l'emporte.
 */
export function rubriqueActive(pathname: string | null | undefined): MembresRubrique["key"] | null {
  if (!pathname) return null
  let meilleure: { key: MembresRubrique["key"]; longueur: number } | null = null
  for (const r of MEMBRES_RUBRIQUES) {
    for (const p of r.prefixes) {
      if ((pathname === p || pathname.startsWith(`${p}/`)) && (!meilleure || p.length > meilleure.longueur)) {
        meilleure = { key: r.key, longueur: p.length }
      }
    }
  }
  return meilleure?.key ?? null
}

export const labelInvitations = (n: number) => `${n} ${n > 1 ? "demandes en attente" : "demande en attente"}`
export const labelMessages = (n: number) => `${n} ${n > 1 ? "messages non lus" : "message non lu"}`
export const afficherNombre = (n: number) => (n > 99 ? "99+" : String(n))

/**
 * Pages de lecture ou de conversation : la barre latérale s'y replie d'elle-même (le contenu a besoin de la place)
 * et reprend l'état choisi par le membre dès qu'il en sort. Le membre peut quand même la rouvrir à la main.
 */
const ROUTES_IMMERSIVES = [
  /^\/membres\/formations\/[^/]+\/suivre(\/|$)/, // lecteur de cours et ses leçons
  /^\/membres\/bibliotheque\/[^/]+\/lire(\/|$)/, // lecteur de documents
  /^\/membres\/messages(\/|$)/, // messagerie
]
export const estPageImmersive = (pathname: string | null | undefined) =>
  !!pathname && ROUTES_IMMERSIVES.some((re) => re.test(pathname))

/** Cookie du choix de repli : lu côté serveur pour rendre la barre dans le bon état dès le premier affichage (aucun saut). */
export const COOKIE_BARRE_REPLIEE = "ag-barre-repliee"
