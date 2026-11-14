'use client'

import React, { useCallback, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { getNotifications, markAsReadAction } from '@/app/actions/notifications'
import { Emblem } from '@/components/brand'
import { depuis, grouperParJour, libelleType, lienSur, type NotificationItem } from '@/lib/notifications'

import { ArrowRight, Check, CheckCheck, Loader2, Settings } from '@/components/ui/icons'

const heure = (iso: string | null) => {
  if (!iso) return ''
  const d = new Date(iso)
  return Number.isNaN(d.getTime()) ? '' : d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
}

/** Coches de lecture : une grise = reçu, deux vertes = vu. */
function Coches({ lu }: { lu: boolean }) {
  return lu ? (
    <span className="inline-flex items-center gap-0.5 text-success">
      <CheckCheck className="size-4" aria-hidden />
      <span className="sr-only">Vu</span>
    </span>
  ) : (
    <span className="inline-flex items-center text-on-surface-muted">
      <Check className="size-4" aria-hidden />
      <span className="sr-only">Reçu, pas encore vu</span>
    </span>
  )
}

/**
 * Notifications présentées comme une messagerie à sens unique : l'expéditeur est agrolide, il n'y a aucune zone de réponse.
 * Une bulle affichée à l'écran est marquée comme vue (deux coches vertes), sans action du membre.
 */
function Bulle({ n, nouveau, onVue, onOuvrir }: { n: NotificationItem; nouveau: boolean; onVue: (id: string) => void; onOuvrir: (n: NotificationItem) => void }) {
  const ref = useRef<HTMLLIElement>(null)

  useEffect(() => {
    if (n.lu) return
    const el = ref.current
    if (!el || typeof IntersectionObserver === 'undefined') return
    let minuteur: number | undefined
    const obs = new IntersectionObserver(
      ([e]) => {
        window.clearTimeout(minuteur)
        // Vue = bien affichée (au moins 60 %) pendant une seconde : un simple défilement rapide ne compte pas.
        if (e.isIntersecting) minuteur = window.setTimeout(() => onVue(n.id), 1000)
      },
      { threshold: 0.6 },
    )
    obs.observe(el)
    return () => {
      window.clearTimeout(minuteur)
      obs.disconnect()
    }
  }, [n.id, n.lu, onVue])

  return (
    <li ref={ref} className="flex">
      <div className="max-w-[94%] sm:max-w-[75%]">
        <div className={`rounded-2xl rounded-bl-sm border px-4 py-3 shadow-sm ${nouveau ? 'border-primary bg-primary-container' : 'border-outline-variant bg-surface-container-lowest'}`}>
          <p className="text-label-sm font-bold uppercase tracking-wider text-primary">{libelleType(n.type)}</p>
          <p className="mt-1 whitespace-pre-line text-body-md text-on-surface">{n.contenu}</p>
          {n.lien && (
            <button
              type="button"
              onClick={() => onOuvrir(n)}
              className="ag-state mt-2 inline-flex min-h-11 items-center gap-1.5 rounded-control text-label-lg font-bold text-primary"
            >
              Ouvrir <ArrowRight className="size-4" aria-hidden />
            </button>
          )}
          <p className="mt-1 flex items-center justify-end gap-1.5 text-label-sm text-on-surface-muted">
            <time dateTime={n.created_at ?? undefined} title={depuis(n.created_at)}>
              {heure(n.created_at)}
            </time>
            <Coches lu={n.lu} />
          </p>
        </div>
      </div>
    </li>
  )
}

export default function NotificationsClient() {
  const router = useRouter()
  const [notifications, setNotifications] = useState<NotificationItem[]>([])
  const [nouvelles, setNouvelles] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)
  // Barre d'en-tête « soudée » à la barre du haut dès qu'on a défilé.
  const [collee, setCollee] = useState(false)
  const reperRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = reperRef.current
    if (!el || typeof IntersectionObserver === 'undefined') return
    const obs = new IntersectionObserver(([e]) => setCollee(!e.isIntersecting))
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  const fetchData = useCallback(async () => {
    try {
      const liste = await getNotifications()
      setNotifications(liste)
      // Les messages non lus à l'ouverture restent surlignés jusqu'à la fin de la visite.
      setNouvelles((prev) => new Set([...prev, ...liste.filter((n) => !n.lu).map((n) => n.id)]))
    } catch (e) {
      console.error('[notifications] chargement impossible :', e)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void fetchData()
  }, [fetchData])

  const marquerVue = useCallback((id: string) => {
    setNotifications((prev) => prev.map((x) => (x.id === id ? { ...x, lu: true } : x)))
    void markAsReadAction(id).catch(() => {})
  }, [])

  const ouvrir = (n: NotificationItem) => {
    if (!n.lu) marquerVue(n.id)
    if (n.lien) router.push(lienSur(n.lien))
  }

  // Du plus ancien au plus récent, comme une conversation : le plus récent en bas.
  const groupes = grouperParJour([...notifications].reverse())
  const nonLues = notifications.filter((n) => !n.lu).length

  return (
    <div>
      {/* Repère : quand il sort de l'écran, l'en-tête est collé à la barre du haut. */}
      <div ref={reperRef} aria-hidden className="h-px" />
      <header
        className={`sticky top-0 z-20 -mx-3 -mt-3 mb-3 border-b bg-surface-container-lowest transition-shadow duration-200 md:-mx-5 md:-mt-5 lg:-mx-6 lg:-mt-6 ${collee ? 'border-outline-variant shadow-elev-2' : 'border-transparent'}`}
      >
        <div className={`mx-auto flex max-w-[720px] items-center gap-3 px-4 transition-[padding] duration-200 ${collee ? 'py-2' : 'py-4'}`}>
          <span className={`flex shrink-0 items-center justify-center rounded-full bg-primary-container transition-[width,height] duration-200 ${collee ? 'size-9' : 'size-11'}`} aria-hidden>
            <Emblem variant="couleur" className={collee ? 'size-6' : 'size-7'} />
          </span>
          <div className="min-w-0 flex-1">
            <h1 className="font-heading text-title-lg font-bold leading-tight text-on-surface">agrolide</h1>
            <p className="truncate text-label-md text-on-surface-variant" aria-live="polite">
              {loading ? 'Chargement…' : nonLues > 0 ? `${nonLues} nouveau${nonLues > 1 ? 'x' : ''} message${nonLues > 1 ? 's' : ''}` : 'Messages du réseau agrolide'}
            </p>
          </div>
          <Link
            href="/membres/notifications/reglages"
            aria-label="Réglages des notifications"
            className="ag-state inline-flex size-11 shrink-0 items-center justify-center rounded-full border border-outline-variant text-on-surface-variant"
          >
            <Settings className="size-5" aria-hidden />
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-[720px] space-y-4">
      {loading ? (
        <div className="p-8 text-center text-on-surface-muted">
          <Loader2 className="mx-auto size-5 animate-spin" aria-label="Chargement" />
        </div>
      ) : notifications.length === 0 ? (
        <div className="rounded-2xl border border-outline-variant bg-surface-container-lowest p-10 text-center">
          <p className="text-title-sm font-bold text-on-surface">Aucun message pour le moment</p>
          <p className="mt-1 text-body-sm text-on-surface-variant">Les nouveautés du réseau apparaîtront ici.</p>
        </div>
      ) : (
        <div className="space-y-5">
          {groupes.map((g) => (
            <section key={g.jour} aria-label={g.jour} className="space-y-3">
              <h2 className="mx-auto w-fit rounded-full bg-surface-container-high px-3 py-1 text-label-md font-medium text-on-surface-variant">{g.jour}</h2>
              <ul className="space-y-3">
                {g.items.map((n) => (
                  <Bulle key={n.id} n={n} nouveau={nouvelles.has(n.id) && !n.lu} onVue={marquerVue} onOuvrir={ouvrir} />
                ))}
              </ul>
            </section>
          ))}
          <p className="text-center text-label-sm text-on-surface-muted">Ces messages ne permettent pas de répondre.</p>
        </div>
      )}
      </div>
    </div>
  )
}
