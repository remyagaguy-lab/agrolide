import Link from 'next/link'
import { ShieldAlert } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { Alert } from '@/components/ui/Alert'
import { EmptyState } from '@/components/ui/EmptyState'
import { buttonVariants } from '@/components/ui/Button'
import { cn } from '@/lib/utils/formatters'
import { STATUTS_SIGNALEMENT, compterSignalements, estStatutSignalement, fetchSignalements, type StatutSignalement } from '@/lib/reseau/signalements'
import { SignalementActions } from './SignalementActions'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Signalements de membres', robots: { index: false, follow: false } }

const dateFr = (iso: string) => {
  const d = new Date(iso)
  return Number.isNaN(d.getTime()) ? '' : d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
}

export default async function SignalementsPage({ searchParams }: { searchParams: Promise<{ statut?: string }> }) {
  const { statut: brut } = await searchParams
  const statut: StatutSignalement = estStatutSignalement(brut) ? brut : 'nouveau'

  let lignes: Awaited<ReturnType<typeof fetchSignalements>> = []
  let totaux: Awaited<ReturnType<typeof compterSignalements>> | null = null
  let erreur = false
  try {
    ;[lignes, totaux] = await Promise.all([fetchSignalements(statut), compterSignalements()])
  } catch (e) {
    console.error('[admin] signalements illisibles :', e)
    erreur = true
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <header className="space-y-1">
        <h1 className="text-headline-md text-on-surface">Signalements de membres</h1>
        <p className="text-body-md text-on-surface-variant">
          Signalements envoyés par les membres. Seuls les noms apparaissent : aucune adresse e-mail ni aucun numéro de téléphone.
        </p>
      </header>

      <nav aria-label="Statut des signalements" className="flex flex-wrap gap-2">
        {STATUTS_SIGNALEMENT.map((s) => (
          <Link
            key={s.value}
            href={`/admin/signalements?statut=${s.value}`}
            aria-current={s.value === statut ? 'page' : undefined}
            className={buttonVariants({ variant: s.value === statut ? 'secondary' : 'outline' })}
          >
            {s.label}
            {totaux ? <span className={cn('ml-2 text-label-md')}>{totaux[s.value]}</span> : null}
          </Link>
        ))}
      </nav>

      {erreur ? (
        <Alert variant="error">Impossible de lire les signalements. Réessayez dans un instant.</Alert>
      ) : lignes.length === 0 ? (
        <EmptyState icon={<ShieldAlert />} title="Aucun signalement dans cette liste" description="Les nouveaux signalements apparaissent ici dès qu’un membre en envoie un." />
      ) : (
        <ul className="space-y-3">
          {lignes.map((l) => (
            <li key={l.id}>
              <article className="space-y-3 rounded-card border border-outline-variant bg-surface-container-lowest p-5">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <h2 className="text-title-md text-on-surface">
                    <Link href={`/annuaire/${l.signaleId}`} className="rounded-tag underline-offset-2 hover:underline">{l.signaleNom}</Link>
                  </h2>
                  <Badge variant="warning">{l.motif}</Badge>
                </div>
                <dl className="grid gap-1 text-body-sm text-on-surface-variant sm:grid-cols-[auto_1fr] sm:gap-x-4">
                  <dt className="text-on-surface-muted">Signalé par</dt>
                  <dd>{l.signaleurNom}</dd>
                  <dt className="text-on-surface-muted">Le</dt>
                  <dd>{dateFr(l.created_at)}</dd>
                  <dt className="text-on-surface-muted">Signalements reçus</dt>
                  <dd>{l.totalSignale} au total pour ce membre</dd>
                </dl>
                <SignalementActions id={l.id} statut={statut} nom={l.signaleNom} />
              </article>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
