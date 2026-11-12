import React from "react"
import Link from "next/link"
import { Mail, UserPlus, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils/formatters"
import { Widget, WidgetHeader } from "./Widget"

interface LigneProps {
  href: string
  icon: React.ReactNode
  libelle: string
  vide: string
  total: number
  pluriel: (n: number) => string
}

function Ligne({ href, icon, libelle, vide, total, pluriel }: LigneProps) {
  return (
    <li>
      <Link href={href} className="ag-state group flex min-h-14 items-center gap-3 rounded-control p-2.5">
        <span
          aria-hidden="true"
          className={cn(
            "flex size-9 shrink-0 items-center justify-center rounded-control",
            total > 0 ? "bg-error-container text-on-error-container" : "bg-surface-container text-on-surface-muted",
          )}
        >
          {icon}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-title-sm text-on-surface group-hover:text-primary">{total > 0 ? pluriel(total) : vide}</span>
          <span className="block text-label-sm uppercase tracking-wider text-on-surface-muted">{libelle}</span>
        </span>
        <ChevronRight className="size-4 shrink-0 text-on-surface-muted" aria-hidden="true" />
      </Link>
    </li>
  )
}

/** Ce qui attend une réponse : invitations de connexion et messages non lus (compteurs exacts, pas des listes tronquées). */
export function ReseauWidget({ invitations, messages, className }: { invitations: number; messages: number; className?: string }) {
  return (
    <Widget className={className}>
      <WidgetHeader title="Mon réseau" tone="leaf" href="/membres/reseau" linkLabel="Mon réseau" />
      <ul className="flex flex-col gap-1 p-3">
        <Ligne
          href="/membres/reseau?onglet=invitations"
          icon={<UserPlus className="size-4" />}
          libelle="Invitations"
          vide="Aucune invitation en attente"
          total={invitations}
          pluriel={(n) => `${n} invitation${n > 1 ? "s" : ""} en attente`}
        />
        <Ligne
          href="/membres/messages"
          icon={<Mail className="size-4" />}
          libelle="Messages"
          vide="Aucun message non lu"
          total={messages}
          pluriel={(n) => `${n} message${n > 1 ? "s" : ""} non lu${n > 1 ? "s" : ""}`}
        />
      </ul>
    </Widget>
  )
}
