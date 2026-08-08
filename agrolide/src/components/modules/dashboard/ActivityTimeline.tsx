import React from "react"
import Link from "next/link"
import { Bell, ChevronRight, CheckCircle2 } from "lucide-react"

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
  title = "Activités & Notifications",
  viewAllHref = "/membres/notifications"
}: ActivityTimelineProps) {
  return (
    <div className="bg-white rounded-2xl border border-gris-border shadow-[0_1px_3px_rgba(0,0,0,0.04),0_1px_2px_rgba(0,0,0,0.06)] p-5 flex flex-col flex-1 min-h-0 overflow-hidden">
      {/* Header */}
      <div className="flex justify-between items-center mb-3.5 shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#1b5e38]" />
          <h3 className="text-xs font-bold text-[#1a1a1a] uppercase tracking-wider font-heading">
            {title}
          </h3>
        </div>
        
        {viewAllHref && (
          <Link 
            href={viewAllHref} 
            className="text-gris-muted hover:text-[#1b5e38] transition-colors p-1 rounded-lg hover:bg-[#f0f7f0]"
            title="Voir toutes les notifications"
            aria-label="Voir toutes les notifications"
          >
            <ChevronRight size={14} strokeWidth={2} />
          </Link>
        )}
      </div>

      {/* Timeline Stream */}
      <div className="flex-1 overflow-y-auto custom-scrollbar pr-1 relative min-h-0">
        {notifications && notifications.length > 0 ? (
          <div className="relative pl-5 py-1 space-y-4">
            {/* Continuous vertical rule */}
            <div className="absolute left-[7px] top-2 bottom-2 w-px bg-gris-border" />

            {notifications.map((notif) => {
              const formattedDate = notif.created_at 
                ? new Date(notif.created_at).toLocaleDateString("fr-FR", {
                    day: "numeric",
                    month: "short"
                  })
                : "—"

              const displayTitle = notif.titre || notif.contenu
              const hasSeparateContent = Boolean(notif.titre && notif.contenu && notif.titre !== notif.contenu)

              return (
                <div key={notif.id} className="relative group">
                  {/* Timeline node */}
                  <div className="absolute -left-5 top-1 w-3.5 h-3.5 bg-[#f0fdf4] border-2 border-[#1b5e38] rounded-full flex items-center justify-center transition-transform duration-150 group-hover:scale-125">
                    <div className="w-1 h-1 bg-[#1b5e38] rounded-full" />
                  </div>

                  {/* Content */}
                  <div>
                    {notif.lien ? (
                      <Link href={notif.lien} className="block">
                        <p className="text-xs font-bold text-[#1a1a1a] leading-tight group-hover:text-[#1b5e38] transition-colors">
                          {displayTitle}
                        </p>
                        {hasSeparateContent && (
                          <p className="text-[11px] font-medium text-gris-muted mt-0.5 line-clamp-1">
                            {notif.contenu}
                          </p>
                        )}
                      </Link>
                    ) : (
                      <>
                        <p className="text-xs font-bold text-[#1a1a1a] leading-tight group-hover:text-[#1b5e38] transition-colors">
                          {displayTitle}
                        </p>
                        {hasSeparateContent && (
                          <p className="text-[11px] font-medium text-gris-muted mt-0.5 line-clamp-1">
                            {notif.contenu}
                          </p>
                        )}
                      </>
                    )}
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-1 block tabular-nums">
                      {formattedDate}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-6 text-center my-auto">
            <div className="w-8 h-8 rounded-full bg-[#f0fdf4] border border-[#c3dec4] flex items-center justify-center text-[#1b5e38] mb-2">
              <CheckCircle2 size={16} strokeWidth={2} />
            </div>
            <p className="text-xs text-gray-700 font-semibold">Toutes les activités sont à jour</p>
            <p className="text-[11px] text-gris-muted mt-0.5">Aucune nouvelle notification non lue.</p>
          </div>
        )}
      </div>
    </div>
  )
}
