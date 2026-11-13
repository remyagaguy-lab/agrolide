"use client"

import * as React from "react"
import { Modal, ModalContent, ModalDescription, ModalFooter, ModalHeader, ModalTitle } from "@/components/ui/Modal"
import { Alert } from "@/components/ui/Alert"
import { Button } from "@/components/ui/Button"
import { Check, Minus, Plus } from "@/components/ui/icons"

/** Formats acceptés à l'import et poids maximal du fichier d'origine (avant compression). */
export const FORMATS_PHOTO = ["image/jpeg", "image/png", "image/webp"]
export const POIDS_MAX_ORIGINE = 15 * 1024 * 1024

/** Côté de la photo enregistrée, en pixels (affichée au plus à 160 px sur écran dense). */
const COTE_SORTIE = 512
/** Côté de la zone de recadrage affichée, en pixels CSS (classe `size-64`). */
const COTE_ZONE = 256
const ZOOM_MAX = 4

interface Props {
  /** Fichier choisi ; `null` : éditeur fermé. */
  fichier: File | null
  onFermer: () => void
  /** Envoie la photo recadrée ; renvoie un message d'erreur en français, ou `null` si tout s'est bien passé. */
  onValider: (image: Blob) => Promise<string | null>
}

/** Ouvre le fichier comme image décodée (HEIC et autres formats non lisibles : erreur claire). */
function lireImage(fichier: File): Promise<{ img: HTMLImageElement; url: string }> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(fichier)
    const img = new Image()
    img.onload = () => resolve({ img, url })
    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error("Cette image n’a pas pu être lue. Essayez une photo JPEG, PNG ou WebP."))
    }
    img.src = url
  })
}

const borner = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v))

/**
 * Recadrage de la photo de profil : l'image se déplace au doigt (ou à la souris) et se zoome au pincement,
 * à la molette, au curseur ou aux boutons − / +. Le cercle montre exactement ce que verront les autres membres.
 * Le résultat est un JPEG carré de 512 px (environ 60 à 150 Ko), prêt à être envoyé.
 */
export function PhotoProfilEditeur({ fichier, onFermer, onValider }: Props) {
  const [source, setSource] = React.useState<{ img: HTMLImageElement; url: string } | null>(null)
  const [erreur, setErreur] = React.useState("")
  const [envoi, setEnvoi] = React.useState(false)
  const [zoom, setZoom] = React.useState(1)
  const [decalage, setDecalage] = React.useState({ x: 0, y: 0 })
  const pointeurs = React.useRef(new Map<number, { x: number; y: number }>())
  const distancePincement = React.useRef(0)

  // Chargement de l'image à chaque nouveau fichier.
  React.useEffect(() => {
    setSource(null)
    setErreur("")
    setZoom(1)
    setDecalage({ x: 0, y: 0 })
    if (!fichier) return
    let annule = false
    let urlCourante: string | null = null
    lireImage(fichier)
      .then((s) => {
        urlCourante = s.url
        if (annule) URL.revokeObjectURL(s.url)
        else setSource(s)
      })
      .catch((e: Error) => {
        if (!annule) setErreur(e.message)
      })
    return () => {
      annule = true
      if (urlCourante) URL.revokeObjectURL(urlCourante)
    }
  }, [fichier])

  const largeur = source?.img.naturalWidth ?? 1
  const hauteur = source?.img.naturalHeight ?? 1
  // L'image couvre toujours la zone : on ne voit jamais de vide autour de la photo.
  const echelleBase = COTE_ZONE / Math.min(largeur, hauteur)
  const echelle = echelleBase * zoom

  const limiter = React.useCallback(
    (x: number, y: number, z: number) => {
      const e = echelleBase * z
      const mx = Math.max(0, (largeur * e - COTE_ZONE) / 2)
      const my = Math.max(0, (hauteur * e - COTE_ZONE) / 2)
      return { x: borner(x, -mx, mx), y: borner(y, -my, my) }
    },
    [echelleBase, largeur, hauteur],
  )

  const changerZoom = (z: number) => {
    const nz = borner(z, 1, ZOOM_MAX)
    setZoom(nz)
    setDecalage((d) => limiter(d.x, d.y, nz))
  }

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId)
    pointeurs.current.set(e.pointerId, { x: e.clientX, y: e.clientY })
    if (pointeurs.current.size === 2) {
      const [a, b] = [...pointeurs.current.values()]
      distancePincement.current = Math.hypot(a.x - b.x, a.y - b.y)
    }
  }
  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const avant = pointeurs.current.get(e.pointerId)
    if (!avant) return
    pointeurs.current.set(e.pointerId, { x: e.clientX, y: e.clientY })
    if (pointeurs.current.size === 2) {
      const [a, b] = [...pointeurs.current.values()]
      const distance = Math.hypot(a.x - b.x, a.y - b.y)
      if (distancePincement.current > 0) changerZoom(zoom * (distance / distancePincement.current))
      distancePincement.current = distance
    } else if (pointeurs.current.size === 1) {
      setDecalage((d) => limiter(d.x + (e.clientX - avant.x), d.y + (e.clientY - avant.y), zoom))
    }
  }
  const onPointerFin = (e: React.PointerEvent<HTMLDivElement>) => {
    pointeurs.current.delete(e.pointerId)
    distancePincement.current = 0
  }
  const onTouche = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const pas = 12
    const dx = e.key === "ArrowLeft" ? pas : e.key === "ArrowRight" ? -pas : 0
    const dy = e.key === "ArrowUp" ? pas : e.key === "ArrowDown" ? -pas : 0
    if (dx || dy) {
      e.preventDefault()
      setDecalage((d) => limiter(d.x + dx, d.y + dy, zoom))
    } else if (e.key === "+" || e.key === "=") changerZoom(zoom + 0.2)
    else if (e.key === "-") changerZoom(zoom - 0.2)
  }

  const valider = async () => {
    if (!source || envoi) return
    setErreur("")
    setEnvoi(true)
    try {
      const canvas = document.createElement("canvas")
      canvas.width = canvas.height = COTE_SORTIE
      const ctx = canvas.getContext("2d")
      if (!ctx) throw new Error("Ce navigateur ne permet pas de préparer la photo.")
      ctx.fillStyle = "white" // fond des PNG transparents (valeur de pixel, pas une couleur de l'interface)
      ctx.fillRect(0, 0, COTE_SORTIE, COTE_SORTIE)
      ctx.imageSmoothingQuality = "high"
      const cote = COTE_ZONE / echelle
      const sx = largeur / 2 - (COTE_ZONE / 2 + decalage.x) / echelle
      const sy = hauteur / 2 - (COTE_ZONE / 2 + decalage.y) / echelle
      ctx.drawImage(source.img, sx, sy, cote, cote, 0, 0, COTE_SORTIE, COTE_SORTIE)
      const blob = await new Promise<Blob | null>((r) => canvas.toBlob(r, "image/jpeg", 0.85))
      if (!blob) throw new Error("La photo n’a pas pu être préparée. Essayez une autre image.")
      const message = await onValider(blob)
      if (message) setErreur(message)
    } catch (e) {
      setErreur(e instanceof Error ? e.message : "La photo n’a pas pu être préparée.")
    } finally {
      setEnvoi(false)
    }
  }

  return (
    <Modal open={!!fichier} onOpenChange={(ouvert) => !ouvert && !envoi && onFermer()}>
      <ModalContent className="items-center sm:max-w-sm" onInteractOutside={(e) => envoi && e.preventDefault()}>
        <ModalHeader className="w-full">
          <ModalTitle>Recadrer votre photo</ModalTitle>
          <ModalDescription>Faites glisser la photo pour la placer, pincez ou utilisez le curseur pour zoomer. Le cercle correspond à ce que verront les autres membres.</ModalDescription>
        </ModalHeader>

        <div
          role="group"
          tabIndex={0}
          aria-label="Zone de recadrage : flèches pour déplacer, + et − pour zoomer"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerFin}
          onPointerCancel={onPointerFin}
          onKeyDown={onTouche}
          onWheel={(e) => changerZoom(zoom * (e.deltaY < 0 ? 1.08 : 1 / 1.08))}
          className="relative size-64 shrink-0 cursor-grab touch-none select-none overflow-hidden rounded-card bg-surface-container-high outline-offset-2 active:cursor-grabbing"
        >
          {source && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={source.url}
              alt=""
              draggable={false}
              className="pointer-events-none absolute left-1/2 top-1/2 max-w-none"
              style={{
                width: largeur * echelle,
                height: hauteur * echelle,
                transform: `translate(calc(-50% + ${decalage.x}px), calc(-50% + ${decalage.y}px))`,
              }}
            />
          )}
          {/* Masque : tout ce qui est hors du cercle est assombri. */}
          <div aria-hidden className="pointer-events-none absolute inset-0 rounded-full shadow-[0_0_0_999px_var(--ag-sys-scrim)] ring-2 ring-on-surface-brand" />
          {!source && !erreur && <p className="absolute inset-0 flex items-center justify-center text-body-sm text-on-surface-variant">Chargement de l’image…</p>}
        </div>

        <div className="flex w-full items-center gap-2">
          <button type="button" onClick={() => changerZoom(zoom - 0.25)} disabled={!source || envoi || zoom <= 1} aria-label="Dézoomer" className="ag-state inline-flex size-11 shrink-0 items-center justify-center rounded-full text-primary disabled:text-on-surface/38">
            <Minus className="size-5" aria-hidden />
          </button>
          <input
            type="range"
            min={1}
            max={ZOOM_MAX}
            step={0.01}
            value={zoom}
            disabled={!source || envoi}
            onChange={(e) => changerZoom(Number(e.target.value))}
            aria-label="Zoom"
            className="h-11 min-w-0 flex-1 accent-primary"
          />
          <button type="button" onClick={() => changerZoom(zoom + 0.25)} disabled={!source || envoi || zoom >= ZOOM_MAX} aria-label="Zoomer" className="ag-state inline-flex size-11 shrink-0 items-center justify-center rounded-full text-primary disabled:text-on-surface/38">
            <Plus className="size-5" aria-hidden />
          </button>
        </div>

        <div aria-live="polite" className="w-full empty:hidden">
          {erreur && <Alert variant="error">{erreur}</Alert>}
        </div>

        <ModalFooter className="w-full">
          <Button type="button" variant="outline" onClick={onFermer} disabled={envoi}>Annuler</Button>
          <Button type="button" variant="secondary" onClick={valider} loading={envoi} disabled={!source}>
            <Check className="size-5" aria-hidden />
            {envoi ? "Envoi en cours…" : "Utiliser cette photo"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
