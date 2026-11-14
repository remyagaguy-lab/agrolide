import Link from 'next/link'
import { and, count, desc, eq, gte, isNull, or, sql } from 'drizzle-orm'
import { db } from '@/db'
import {
  articles,
  demandes_categorie,
  evenements,
  forum_fils,
  forum_messages,
  livrables_formation,
  opportunites,
  signalements,
  users,
} from '@/db/schema'
import { Badge } from '@/components/ui/Badge'
import { categorieLabel, displayName } from '@/lib/reseau/profil'
import {
  ArrowRight,
  CalendarDays,
  FileText,
  Flag,
  FolderOpen,
  GraduationCap,
  Inbox,
  MessageCircle,
  UserCog,
  Users,
} from '@/components/ui/icons'

/** Compte une requête sans jamais faire tomber la page (table absente avant migration, base indisponible). */
async function nombre(requete: PromiseLike<Array<{ n: number | string }>>): Promise<number> {
  try {
    return Number((await requete)[0]?.n ?? 0)
  } catch {
    return 0
  }
}

async function lister<T>(requete: PromiseLike<T[]>): Promise<T[]> {
  try {
    return await requete
  } catch {
    return []
  }
}

const dateCourte = (iso: string | null | undefined) =>
  iso ? new Date(iso).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }) : ''

/**
 * Tableau de bord de l'administrateur du réseau : ce qu'il y a à traiter, qui vient d'arriver, ce qui arrive,
 * et des raccourcis pour publier. Pas de chiffres financiers (réservés au super administrateur).
 */
export async function TableauDeBordReseau() {
  const maintenant = new Date()
  const iso = maintenant.toISOString()
  const ilYa7Jours = new Date(Date.now() - 7 * 86400_000).toISOString()

  const [demandes, signalesNouveaux, livrables, opportunitesAttente, brouillons, messages7j, fils7j, inscrits, evenementsAvenir] = await Promise.all([
    nombre(db.select({ n: count() }).from(demandes_categorie).where(eq(demandes_categorie.statut, 'en_attente'))),
    nombre(db.select({ n: count() }).from(signalements).where(eq(signalements.statut, 'nouveau'))),
    nombre(db.select({ n: count() }).from(livrables_formation).where(eq(livrables_formation.statut, 'soumis'))),
    nombre(db.select({ n: count() }).from(opportunites).where(eq(opportunites.statut, 'en_attente'))),
    nombre(db.select({ n: count() }).from(articles).where(or(eq(articles.statut, 'brouillon'), isNull(articles.statut)))),
    nombre(db.select({ n: count() }).from(forum_messages).where(gte(forum_messages.created_at, ilYa7Jours))),
    nombre(db.select({ n: count() }).from(forum_fils).where(gte(forum_fils.created_at, ilYa7Jours))),
    lister(
      db
        .select({ id: users.id, prenom: users.prenom, nom: users.nom, categorie: users.categorie, est_organisation: users.est_organisation, created_at: users.created_at })
        .from(users)
        .where(or(isNull(users.est_organisation), eq(users.est_organisation, false)))
        .orderBy(desc(users.created_at))
        .limit(6),
    ),
    lister(
      db
        .select({ id: evenements.id, titre: evenements.titre, date_debut: evenements.date_debut, type_evt: evenements.type_evt, publie: evenements.publie })
        .from(evenements)
        .where(and(gte(evenements.date_debut, iso), or(isNull(evenements.publie), eq(evenements.publie, true))))
        .orderBy(sql`${evenements.date_debut} asc`)
        .limit(5),
    ),
  ])

  const aTraiter = [
    { href: '/admin/membres/demandes-categorie', label: 'Demandes de catégorie', detail: 'Partenaire ou Sénior à valider', n: demandes, Icone: UserCog },
    { href: '/admin/signalements', label: 'Signalements', detail: 'Nouveaux, à modérer', n: signalesNouveaux, Icone: Flag },
    { href: '/admin/contenus/formations/livrables', label: 'Livrables à corriger', detail: 'Soumis par les apprenants', n: livrables, Icone: GraduationCap },
    { href: '/admin/contenus/opportunites', label: 'Opportunités', detail: 'En attente de publication', n: opportunitesAttente, Icone: Inbox },
    { href: '/admin/contenus/articles', label: 'Articles', detail: 'Brouillons à relire', n: brouillons, Icone: FileText },
  ]
  const total = aTraiter.reduce((s, a) => s + a.n, 0)

  const raccourcis = [
    { href: '/admin/contenus/articles', label: 'Articles', Icone: FileText },
    { href: '/admin/contenus/evenements', label: 'Événements', Icone: CalendarDays },
    { href: '/admin/contenus/opportunites', label: 'Opportunités', Icone: Inbox },
    { href: '/admin/contenus/documents', label: 'Documents', Icone: FolderOpen },
    { href: '/admin/forum', label: 'Forum', Icone: MessageCircle },
    { href: '/admin/membres', label: 'Membres', Icone: Users },
  ]

  return (
    <div className="space-y-8 pb-10">
      <header>
        <h1 className="text-2xl font-bold text-on-surface">Tableau de bord du réseau</h1>
        <p className="mt-1 text-sm text-on-surface-muted">
          {total > 0 ? `${total} élément${total > 1 ? 's' : ''} à traiter aujourd'hui.` : 'Rien à traiter pour le moment.'}
        </p>
      </header>

      <section aria-labelledby="a-traiter">
        <h2 id="a-traiter" className="mb-3 text-base font-semibold text-on-surface">À traiter</h2>
        <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
          {aTraiter.map(({ href, label, detail, n, Icone }) => (
            <li key={href}>
              <Link
                href={href}
                className="flex h-full flex-col gap-2 rounded-xl border border-outline-variant bg-surface-container-lowest p-4 transition-shadow hover:shadow-md"
              >
                <span className="flex items-center justify-between">
                  <Icone className="size-5 text-on-surface-muted" aria-hidden />
                  <span className={n > 0 ? 'text-2xl font-bold text-primary' : 'text-2xl font-bold text-on-surface-muted'}>{n}</span>
                </span>
                <span className="text-sm font-semibold text-on-surface">{label}</span>
                <span className="text-xs text-on-surface-muted">{detail}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <section aria-labelledby="inscrits" className="rounded-xl border border-outline-variant bg-surface-container-lowest p-5">
          <div className="mb-3 flex items-center justify-between">
            <h2 id="inscrits" className="text-base font-semibold text-on-surface">Derniers inscrits</h2>
            <Link href="/admin/membres" className="inline-flex items-center gap-1 text-sm font-medium text-primary">
              Tous les membres <ArrowRight className="size-4" aria-hidden />
            </Link>
          </div>
          {inscrits.length === 0 ? (
            <p className="text-sm text-on-surface-muted">Aucun inscrit récent.</p>
          ) : (
            <ul className="divide-y divide-outline-variant">
              {inscrits.map((m) => (
                <li key={m.id} className="flex items-center justify-between gap-3 py-2.5">
                  <span className="min-w-0 truncate text-sm font-medium text-on-surface">{displayName(m)}</span>
                  <span className="flex shrink-0 items-center gap-2">
                    {categorieLabel(m.categorie) && (
                      <Badge variant={m.categorie === 'partenaire' ? 'partenaire' : 'category'}>{categorieLabel(m.categorie)}</Badge>
                    )}
                    <span className="text-xs text-on-surface-muted">{dateCourte(m.created_at)}</span>
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section aria-labelledby="agenda" className="rounded-xl border border-outline-variant bg-surface-container-lowest p-5">
          <div className="mb-3 flex items-center justify-between">
            <h2 id="agenda" className="text-base font-semibold text-on-surface">Prochains événements</h2>
            <Link href="/admin/contenus/evenements" className="inline-flex items-center gap-1 text-sm font-medium text-primary">
              Gérer <ArrowRight className="size-4" aria-hidden />
            </Link>
          </div>
          {evenementsAvenir.length === 0 ? (
            <p className="text-sm text-on-surface-muted">Aucun événement à venir. Pensez à en programmer un.</p>
          ) : (
            <ul className="divide-y divide-outline-variant">
              {evenementsAvenir.map((e) => (
                <li key={e.id} className="flex items-center justify-between gap-3 py-2.5">
                  <span className="min-w-0 truncate text-sm font-medium text-on-surface">{e.titre}</span>
                  <span className="shrink-0 text-xs text-on-surface-muted">{dateCourte(e.date_debut)}</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <section aria-labelledby="forum" className="rounded-xl border border-outline-variant bg-surface-container-lowest p-5">
        <h2 id="forum" className="mb-3 text-base font-semibold text-on-surface">Forum, 7 derniers jours</h2>
        <dl className="flex flex-wrap gap-8">
          <div>
            <dt className="text-xs uppercase tracking-wide text-on-surface-muted">Nouveaux fils</dt>
            <dd className="text-2xl font-bold text-on-surface">{fils7j}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide text-on-surface-muted">Messages</dt>
            <dd className="text-2xl font-bold text-on-surface">{messages7j}</dd>
          </div>
        </dl>
      </section>

      <section aria-labelledby="raccourcis">
        <h2 id="raccourcis" className="mb-3 text-base font-semibold text-on-surface">Publier et gérer</h2>
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-6">
          {raccourcis.map(({ href, label, Icone }) => (
            <li key={label}>
              <Link href={href} className="flex min-h-11 items-center gap-2 rounded-xl border border-outline-variant bg-surface-container-lowest px-4 py-3 text-sm font-semibold text-on-surface hover:bg-primary-container">
                <Icone className="size-5 text-on-surface-muted" aria-hidden />
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
