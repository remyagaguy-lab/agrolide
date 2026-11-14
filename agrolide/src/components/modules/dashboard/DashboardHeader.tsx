import React from "react"
import { Badge, type BadgeVariant } from "@/components/ui/Badge"
import { Sillons } from "@/components/brand"
import NotificationBell from "@/components/shared/NotificationBell"
import { MembresUserMenu } from "@/components/layout/MembresUserMenu"

import { UserCheck } from "@/components/ui/icons"
interface DashboardHeaderProps {
  userId: string
  prenom?: string | null
  nom?: string | null
  email?: string | null
  photo_url?: string | null
  image?: string | null
  categorie?: string | null
  specialite?: string | null
  organisation?: string | null
  pays?: string | null
  ville?: string | null
}

function categoryBadge(cat?: string | null): { label: string; variant: BadgeVariant } | null {
  if (!cat) return null
  const lower = cat.toLowerCase()
  if (lower.includes("professionnel")) return { label: "Membre professionnel", variant: "professionnel" }
  if (lower.includes("junior") || lower.includes("etudiant") || lower.includes("étudiant")) return { label: "Membre junior", variant: "junior" }
  if (lower.includes("partenaire")) return { label: "Partenaire", variant: "partenaire" }
  if (lower.includes("senior") || lower.includes("expert")) return { label: "Membre sénior", variant: "senior" }
  return { label: cat, variant: "junior" }
}

/**
 * Bandeau de bienvenue. Il remplace la barre du haut sur le tableau de bord : la cloche et le menu du compte
 * y sont intégrés (à droite, sur ordinateur ; sur téléphone, l'en-tête mobile les garde).
 * Décor : sillons de l'emblème à 10 % dans le coin bas-droit (le coin haut-droit porte la cloche et le menu),
 * jamais sous le texte, à gauche.
 */
export function DashboardHeader({ userId, prenom, nom, email, photo_url, image, categorie, specialite, organisation, pays, ville }: DashboardHeaderProps) {
  const displayName = [prenom, nom].filter(Boolean).join(" ") || "Membre"

  const formattedDate = new Date().toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" })
  const capitalizedDate = formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1)

  const badge = categoryBadge(categorie)
  const metaItems = [specialite, organisation, ville && pays ? `${ville}, ${pays}` : pays || ville].filter(Boolean)

  return (
    <section
      aria-label="Bienvenue"
      className="relative shrink-0 overflow-hidden rounded-card bg-surface-brand p-5 text-on-surface-brand md:p-6"
    >
      <Sillons coin="bas-droite" opacite={0.1} className="hidden w-44 md:block" />
      <div className="relative z-10 flex items-start justify-between gap-4">
        <div className="min-w-0 space-y-2">
          <p className="text-label-md text-on-surface-brand/80">{capitalizedDate}</p>
          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="text-headline-sm" style={{ textWrap: "balance" }}>
              Bonjour, {displayName}
            </h1>
            {badge && (
              <Badge variant={badge.variant} className="rounded-full border border-on-surface-brand/40 px-3 uppercase tracking-wider">
                <UserCheck className="size-4" aria-hidden="true" />
                {badge.label}
              </Badge>
            )}
          </div>

          <p className="flex max-w-xl flex-wrap items-center gap-x-2.5 gap-y-1 text-body-md text-on-surface-brand/85">
            {metaItems.length > 0 ? (
              metaItems.map((item, idx) => (
                <React.Fragment key={idx}>
                  {idx > 0 && <span aria-hidden="true" className="text-on-surface-brand/50">·</span>}
                  <span>{item}</span>
                </React.Fragment>
              ))
            ) : (
              <span>Espace membre du réseau panafricain des professionnels du secteur agricole</span>
            )}
          </p>
        </div>

        <div className="hidden shrink-0 items-center gap-2.5 lg:flex">
          <NotificationBell userId={userId} className="border border-on-surface-brand/30 bg-on-surface-brand/10 text-on-surface-brand" />
          <MembresUserMenu profile={{ prenom, nom, email, photo_url, image }} tone="marque" />
        </div>
      </div>
    </section>
  )
}
