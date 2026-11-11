import React from "react"
import Link from "next/link"
import { ChevronRight, CheckCircle2 } from "lucide-react"
import { Widget } from "./Widget"

interface NotificationItem {
  id: string | number
  titre?: string | null
  contenu: string
  type?: string | null
  created_at?: string | Date | null
  lu?: boolean | null
  lien?: string | null
}

interface ActivityTimelineProps {
  notifications: NotificationItem[]
  title?: string
  viewAllHref?: string
}

export function ActivityTimeline({
  notifications,
  title = "Activités & notifications",
  viewAllHref = "/membres/notifications",
}: ActivityTimelineProps) {
  return (
    <Widget className="flex-1 p-5">
      <div className="mb-3.5 flex shrink-0 items-center justify-between">
        <div className="flex items-center gap-2">
          <span aria-hidden="true" className="size-2 rounded-full bg-primary" />
          <h2 className="text-label-md uppercase tracking-wider text-on-surface">{title}</h2>
        </div>
        {viewAllHref && (
          <Link
            href={viewAllHref}
            title="Voir toutes les notifications"
            aria-label="Voir toutes les notifications"
            className="ag-state flex size-11 -mr-2 items-center justify-center rounded-full text-on-surface-variant"
          >
            <ChevronRight className="size-4" aria-hidden="true" />
          </Link>
        )}
      </div>

      <div className="custom-scrollbar relative min-h-0 flex-1 overflow-y-auto pr-1">
        {notifications && notifications.length > 0 ? (
          <ol className="relative space-y-4 py-1 pl-5">
            <span aria-hidden="true" className="absolute bottom-2 left-[7px] top-2 w-px bg-outline-variant" />
            {notifications.map((notif) => {
              const formattedDate = notif.created_at
                ? new Date(notif.created_at).toLocaleDateString("fr-FR", { day: "numeric", month: "short" })
                : "—"
              const displayTitle = notif.titre || notif.contenu
              const hasSeparateContent = Boolean(notif.titre && notif.contenu && notif.titre !== notif.contenu)

              const body = (
                <>
                  <p className="text-title-sm text-on-surface group-hover:text-primary">{displayTitle}</p>
                  {hasSeparateContent && <p className="mt-0.5 line-clamp-1 text-body-sm text-on-surface-muted">{notif.contenu}</p>}
                </>
              )

              return (
                <li key={notif.id} className="group relative">
                  <span
                    aria-hidden="true"
                    className="absolute -left-5 top-1 flex size-3.5 items-center justify-center rounded-full border-2 border-primary bg-surface-container-lowest"
                  >
                    <span className="size-1 rounded-full bg-primary" />
                  </span>
                  {notif.lien ? <Link href={notif.lien} className="block rounded-tag">{body}</Link> : body}
                  <time className="mt-1 block text-label-sm uppercase tracking-wider tabular-nums text-on-surface-muted">{formattedDate}</time>
                </li>
              )
            })}
          </ol>
        ) : (
          <div className="my-auto flex flex-col items-center justify-center py-6 text-center">
            <span aria-hidden="true" className="mb-2 flex size-10 items-center justify-center rounded-full bg-success-container text-on-success-container">
              <CheckCircle2 className="size-5" />
            </span>
            <p className="text-title-sm text-on-surface">Toutes les activités sont à jour</p>
            <p className="mt-0.5 text-body-sm text-on-surface-muted">Aucune nouvelle notification non lue.</p>
          </div>
        )}
      </div>
    </Widget>
  )
}
