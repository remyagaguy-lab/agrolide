'use client'

import * as React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import * as Popover from '@radix-ui/react-popover'
import { markAllAsReadAction, markAsReadAction } from '@/app/actions/notifications'
import { depuis, libelleType, lienSur, type NotificationItem } from '@/lib/notifications'
import { cn } from '@/lib/utils/formatters'

import { Bell, CheckCheck } from "@/components/ui/icons"
/** Intervalle de rafraîchissement quand l'onglet est visible. Le temps réel (WebSocket) n'est qu'un bonus. */
const RAFRAICHISSEMENT_MS = 60_000

interface NotificationBellProps {
  /** Identifiant du membre : sert uniquement au canal temps réel, facultatif. */
  userId?: string | null
  className?: string
}

/**
 * Cloche de notifications de l'espace membre.
 * Fonctionne sans temps réel : chargement à l'ouverture de la page, au retour sur l'onglet et toutes les 60 s.
 * Les messages ne passent pas ici (pastille « Messages ») ; les invitations de connexion, si.
 */
export default function NotificationBell({ userId, className }: NotificationBellProps) {
  const router = useRouter()
  const [open, setOpen] = React.useState(false)
  const [items, setItems] = React.useState<NotificationItem[]>([])
  const [nonLues, setNonLues] = React.useState(0)
  const [charge, setCharge] = React.useState(false)
  const enCours = React.useRef(false)

  const rafraichir = React.useCallback(async () => {
    if (enCours.current) return
    enCours.current = true
    try {
      // fetch ordinaire (et non Server Action) : ne met jamais une navigation en attente.
      const res = await fetch('/api/notifications/resume', { cache: 'no-store', credentials: 'same-origin' })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const r = (await res.json()) as { items: NotificationItem[]; nonLues: number }
      setItems(r.items)
      setNonLues(r.nonLues)
    } catch (e) {
      // Une cloche muette vaut mieux qu'une page en erreur : on garde l'état précédent.
      console.error('[notifications] rafraîchissement impossible :', e)
    } finally {
      enCours.current = false
      setCharge(true)
    }
  }, [])

  React.useEffect(() => {
    // Premier chargement différé : la page demandée passe avant la cloche.
    const premier = window.setTimeout(() => void rafraichir(), 1500)
    let dernier = Date.now()
    const quandVisible = (force = false) => {
      if (document.visibilityState !== 'visible') return
      // Retour sur l'onglet : on ne redemande pas si la dernière réponse a moins de 30 s.
      if (!force && Date.now() - dernier < 30_000) return
      dernier = Date.now()
      void rafraichir()
    }
    const minuteur = window.setInterval(() => quandVisible(true), RAFRAICHISSEMENT_MS)
    const auRetour = () => quandVisible()
    document.addEventListener('visibilitychange', auRetour)
    window.addEventListener('focus', auRetour)
    return () => {
      window.clearTimeout(premier)
      window.clearInterval(minuteur)
      document.removeEventListener('visibilitychange', auRetour)
      window.removeEventListener('focus', auRetour)
    }
  }, [rafraichir])

  // Temps réel facultatif : uniquement si le serveur WebSocket est configuré (jamais de repli sur localhost).
  React.useEffect(() => {
    const base = process.env.NEXT_PUBLIC_WS_URL
    if (!base || !userId) return
    let ws: WebSocket | null = null
    try {
      ws = new WebSocket(`${base.replace(/^http/, 'ws')}/ws/notif_${userId}`)
      ws.onmessage = (event) => {
        try {
          if (JSON.parse(event.data)?.type === 'NEW_NOTIFICATION') void rafraichir()
        } catch {
          /* message illisible : ignoré, le rafraîchissement périodique prend le relais */
        }
      }
    } catch {
      /* connexion impossible : le rafraîchissement périodique suffit */
    }
    return () => ws?.close()
  }, [userId, rafraichir])

  const ouvrir = async (n: NotificationItem) => {
    setOpen(false)
    if (!n.lu) {
      setItems((prev) => prev.map((x) => (x.id === n.id ? { ...x, lu: true } : x)))
      setNonLues((v) => Math.max(0, v - 1))
      void markAsReadAction(n.id).catch(() => rafraichir())
    }
    router.push(lienSur(n.lien))
  }

  const toutLire = async () => {
    setItems((prev) => prev.map((x) => ({ ...x, lu: true })))
    setNonLues(0)
    try {
      await markAllAsReadAction()
    } finally {
      void rafraichir()
    }
  }

  const etiquette = nonLues > 0
    ? `Notifications (${nonLues} non ${nonLues > 1 ? 'lues' : 'lue'})`
    : 'Notifications'

  return (
    <Popover.Root open={open} onOpenChange={(v) => { setOpen(v); if (v) void rafraichir() }}>
      <Popover.Trigger asChild>
        <button
          type="button"
          aria-label={etiquette}
          className={cn('ag-state relative flex size-11 items-center justify-center rounded-control text-on-surface-variant', className)}
        >
          <Bell className="size-5" aria-hidden />
          {nonLues > 0 && (
            <span
              aria-hidden
              className="absolute right-1 top-1 flex min-w-5 items-center justify-center rounded-full bg-error px-1 text-label-sm font-bold text-on-error"
            >
              {nonLues > 9 ? '9+' : nonLues}
            </span>
          )}
        </button>
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Content
          align="end"
          sideOffset={8}
          collisionPadding={16}
          className="z-50 w-[min(22rem,calc(100vw-2rem))] overflow-hidden rounded-card border border-outline-variant bg-surface-container-lowest shadow-elev-2"
        >
          <div className="flex items-center justify-between gap-2 border-b border-outline-variant px-4 py-3">
            <h2 className="text-title-sm text-on-surface">Notifications</h2>
            {nonLues > 0 && (
              <button
                type="button"
                onClick={toutLire}
                className="ag-state inline-flex min-h-9 items-center gap-1.5 rounded-control px-2 text-label-md text-primary"
              >
                <CheckCheck className="size-4" aria-hidden />
                Tout marquer comme lu
              </button>
            )}
          </div>

          <div className="max-h-[22rem] overflow-y-auto">
            {!charge ? (
              <p className="p-6 text-center text-body-sm text-on-surface-muted" role="status">Chargement…</p>
            ) : items.length === 0 ? (
              <p className="p-6 text-center text-body-sm text-on-surface-muted">Vous êtes à jour : aucune notification.</p>
            ) : (
              <ul className="divide-y divide-outline-variant">
                {items.map((n) => (
                  <li key={n.id}>
                    <button
                      type="button"
                      onClick={() => ouvrir(n)}
                      className={cn('ag-state flex w-full items-start gap-3 px-4 py-3 text-left', !n.lu && 'bg-primary-container/40')}
                    >
                      <span
                        aria-hidden
                        className={cn('mt-1.5 size-2 shrink-0 rounded-full', n.lu ? 'bg-transparent' : 'bg-primary')}
                      />
                      <span className="min-w-0 flex-1">
                        <span className="block text-label-sm uppercase tracking-wider text-on-surface-muted">
                          {libelleType(n.type)}
                          {!n.lu && <span className="sr-only">, non lue</span>}
                        </span>
                        <span className={cn('mt-0.5 line-clamp-2 block text-body-sm', n.lu ? 'text-on-surface-variant' : 'font-semibold text-on-surface')}>
                          {n.contenu}
                        </span>
                        {depuis(n.created_at) && (
                          <span className="mt-1 block text-label-sm text-on-surface-muted">{depuis(n.created_at)}</span>
                        )}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="border-t border-outline-variant p-1 text-center">
            <Link
              href="/membres/notifications"
              onClick={() => setOpen(false)}
              className="ag-state inline-flex min-h-11 w-full items-center justify-center rounded-control text-label-lg text-primary"
            >
              Voir toutes les notifications
            </Link>
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  )
}
