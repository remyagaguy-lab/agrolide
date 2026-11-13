import React from "react"
import Link from "next/link"
import { CreditCard, Mail, UserPlus } from "lucide-react"
import { cn } from "@/lib/utils/formatters"
import { labelInvitations, labelMessages } from "@/components/layout/membres-nav"

interface ATraiterProps {
  invitations: number
  messages: number
  /** Cotisation à régler (jamais vrai pendant l'année gratuite). */
  cotisationARegler: boolean
}

/**
 * Ce qui attend une réponse. N'existe que s'il y a quelque chose : à zéro, rien n'est rendu
 * (on ne montre pas un bloc pour dire « aucun message »).
 */
export function ATraiter({ invitations, messages, cotisationARegler }: ATraiterProps) {
  const items = [
    invitations > 0 && { href: "/membres/reseau?onglet=invitations", icon: <UserPlus className="size-4" />, texte: labelInvitations(invitations), ton: "bg-primary-container text-on-primary-container" },
    messages > 0 && { href: "/membres/messages", icon: <Mail className="size-4" />, texte: labelMessages(messages), ton: "bg-primary-container text-on-primary-container" },
    cotisationARegler && { href: "/membres/cotisation", icon: <CreditCard className="size-4" />, texte: "Cotisation à régler", ton: "bg-warning-container text-on-warning-container" },
  ].filter(Boolean) as { href: string; icon: React.ReactNode; texte: string; ton: string }[]

  if (items.length === 0) return null

  return (
    <section aria-label="À traiter" className="flex flex-wrap items-center gap-x-4 gap-y-2 rounded-card border border-outline-variant bg-surface-container-lowest px-4 py-2.5 shadow-elev-1">
      <h2 className="text-title-sm text-on-surface">À traiter</h2>
      <ul className="flex flex-wrap gap-2">
        {items.map((it) => (
          <li key={it.href}>
            <Link href={it.href} className={cn("ag-state inline-flex min-h-11 items-center gap-2 rounded-control px-3.5 text-label-lg", it.ton)}>
              {it.icon}
              {it.texte}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}
