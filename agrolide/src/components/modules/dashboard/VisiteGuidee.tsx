"use client"

import * as React from "react"
import { Button } from "@/components/ui/Button"
import { enregistrerVisiteVue } from "@/app/actions/visite"

interface Etape {
  /** Valeur de l'attribut `data-visite` de l'élément à éclairer. */
  cible: string
  titre: string
  texte: string
}

const ETAPES: Etape[] = [
  {
    cible: "navigation",
    titre: "Votre navigation",
    texte: "Se former, réseauter, opportunités, entreprendre, messages : toutes les rubriques de votre espace sont ici.",
  },
  {
    cible: "bibliotheque",
    titre: "La bibliothèque",
    texte: "Des centaines de guides, de fiches et de cours à consulter. Cherchez un sujet, une culture ou un élevage.",
  },
  {
    cible: "compte",
    titre: "Votre compte",
    texte: "Complétez votre profil pour être mieux suggéré aux autres membres, et suivez l'état de votre adhésion.",
  },
  {
    cible: "apprendre",
    titre: "Formations et événements",
    texte: "Reprenez votre formation, inscrivez-vous aux webinaires et aux rencontres du réseau.",
  },
  {
    cible: "entreprendre",
    titre: "Entreprendre",
    texte: "Un projet agricole ? Candidatez à l'incubation ou demandez un accompagnement sur mesure.",
  },
]

const MARGE = 8
const LARGEUR_BULLE = 340
const HAUTEUR_BULLE = 220

/** Premier élément portant `data-visite="x"` qui est réellement affiché (la barre latérale n'existe pas sur téléphone). */
function trouverCible(nom: string): HTMLElement | null {
  const candidats = document.querySelectorAll<HTMLElement>(`[data-visite="${nom}"]`)
  for (const el of candidats) {
    const r = el.getBoundingClientRect()
    if (r.width > 0 && r.height > 0) return el
  }
  return null
}

/**
 * Visite guidée du tableau de bord : le reste de la page s'assombrit, l'élément expliqué reste éclairé, une bulle dit
 * à quoi il sert. « Suivant » / « Précédent » pour avancer, « Passer » ou Échap pour quitter.
 * Affichée une seule fois par membre (mémorisé en base), rejouable depuis le menu du compte (?visite=1).
 */
export function VisiteGuidee({ afficher }: { afficher: boolean }) {
  const [ouverte, setOuverte] = React.useState(false)
  const [index, setIndex] = React.useState(0)
  const [rect, setRect] = React.useState<DOMRect | null>(null)
  const [fenetre, setFenetre] = React.useState({ l: 1024, h: 768 })
  const boutonSuivant = React.useRef<HTMLButtonElement>(null)
  const fermee = React.useRef(false)

  // Ouverture un instant après l'affichage de la page (le temps que les blocs se posent).
  React.useEffect(() => {
    if (!afficher) return
    const t = window.setTimeout(() => setOuverte(true), 700)
    return () => window.clearTimeout(t)
  }, [afficher])

  const mesurer = React.useCallback(() => {
    setFenetre({ l: window.innerWidth, h: window.innerHeight })
    const el = trouverCible(ETAPES[index].cible)
    setRect(el ? el.getBoundingClientRect() : null)
  }, [index])

  // À chaque étape : amener l'élément à l'écran, puis le mesurer (et le re-mesurer si la page défile ou change de taille).
  React.useEffect(() => {
    if (!ouverte) return
    const el = trouverCible(ETAPES[index].cible)
    const reduit = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    el?.scrollIntoView({ block: "center", behavior: reduit ? "auto" : "smooth" })
    mesurer()
    let image = 0
    const replanifier = () => {
      cancelAnimationFrame(image)
      image = requestAnimationFrame(mesurer)
    }
    const fin = window.setTimeout(mesurer, 450)
    window.addEventListener("scroll", replanifier, true)
    window.addEventListener("resize", replanifier)
    boutonSuivant.current?.focus({ preventScroll: true })
    return () => {
      window.clearTimeout(fin)
      cancelAnimationFrame(image)
      window.removeEventListener("scroll", replanifier, true)
      window.removeEventListener("resize", replanifier)
    }
  }, [ouverte, index, mesurer])

  const fermer = React.useCallback((issue: "terminee" | "passee") => {
    if (fermee.current) return
    fermee.current = true
    setOuverte(false)
    // Retire ?visite=1 de l'adresse (visite rejouée à la demande).
    if (window.location.search.includes("visite=")) window.history.replaceState(null, "", window.location.pathname)
    void enregistrerVisiteVue(issue)
  }, [])

  React.useEffect(() => {
    if (!ouverte) return
    const surTouche = (e: KeyboardEvent) => {
      if (e.key === "Escape") fermer("passee")
    }
    window.addEventListener("keydown", surTouche)
    return () => window.removeEventListener("keydown", surTouche)
  }, [ouverte, fermer])

  if (!afficher || !ouverte) return null

  const etape = ETAPES[index]
  const derniere = index === ETAPES.length - 1

  // Position de la bulle : à droite d'une cible haute et étroite (barre latérale), sinon dessous, sinon dessus ;
  // sur téléphone, bandeau en haut ou en bas de l'écran, du côté opposé à la cible.
  const etroit = fenetre.l < 640
  let bulle: React.CSSProperties
  if (etroit || !rect) {
    const enBas = !rect || rect.top < fenetre.h / 2
    bulle = { left: 12, right: 12, ...(enBas ? { bottom: 12 } : { top: 12 }) }
  } else if (rect.width < fenetre.l * 0.5 && rect.height > fenetre.h * 0.5) {
    bulle = { left: Math.min(rect.right + 16, fenetre.l - LARGEUR_BULLE - 12), top: Math.max(12, Math.min(rect.top + 24, fenetre.h - HAUTEUR_BULLE - 12)), width: LARGEUR_BULLE }
  } else {
    const dessous = fenetre.h - rect.bottom >= HAUTEUR_BULLE + 16
    const dessus = rect.top >= HAUTEUR_BULLE + 16
    const left = Math.max(12, Math.min(rect.left, fenetre.l - LARGEUR_BULLE - 12))
    if (dessous) bulle = { left, top: rect.bottom + 16, width: LARGEUR_BULLE }
    else if (dessus) bulle = { left, top: rect.top - HAUTEUR_BULLE - 16 + 0, width: LARGEUR_BULLE }
    else bulle = { left, bottom: 12, width: LARGEUR_BULLE }
  }

  return (
    <div role="dialog" aria-modal="true" aria-labelledby="visite-titre" className="fixed inset-0 z-[100]">
      {/* Bloque les clics sur la page pendant la visite. */}
      <div className="absolute inset-0" aria-hidden="true" />
      {rect ? (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute rounded-card ring-4 ring-accent-sun motion-safe:transition-all motion-safe:duration-200"
          style={{
            top: rect.top - MARGE,
            left: rect.left - MARGE,
            width: rect.width + MARGE * 2,
            height: rect.height + MARGE * 2,
            boxShadow: "0 0 0 9999px color-mix(in srgb, var(--ag-sys-color-on-surface) 70%, transparent)",
          }}
        />
      ) : (
        <div aria-hidden="true" className="absolute inset-0" style={{ background: "color-mix(in srgb, var(--ag-sys-color-on-surface) 70%, transparent)" }} />
      )}

      <div
        className="absolute rounded-card border border-outline-variant bg-surface-container-lowest p-5 shadow-elev-2"
        style={bulle}
      >
        <p className="text-label-md text-on-surface-variant">Étape {index + 1} sur {ETAPES.length}</p>
        <h2 id="visite-titre" className="mt-1 text-title-md text-on-surface">{etape.titre}</h2>
        <p className="mt-1.5 text-body-md text-on-surface-variant">{etape.texte}</p>
        <div className="mt-4 flex items-center justify-between gap-2">
          <Button type="button" variant="text" size="sm" className="min-h-11" onClick={() => fermer("passee")}>
            Passer
          </Button>
          <div className="flex items-center gap-2">
            {index > 0 && (
              <Button type="button" variant="outline" size="sm" className="min-h-11" onClick={() => setIndex(index - 1)}>
                Précédent
              </Button>
            )}
            <Button
              ref={boutonSuivant}
              type="button"
              variant="secondary"
              size="sm"
              className="min-h-11"
              onClick={() => (derniere ? fermer("terminee") : setIndex(index + 1))}
            >
              {derniere ? "Terminer" : "Suivant"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
