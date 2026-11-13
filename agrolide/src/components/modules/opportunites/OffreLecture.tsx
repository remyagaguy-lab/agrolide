import { notFound } from 'next/navigation'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { marked } from 'marked'
import { and, eq, or } from 'drizzle-orm'
import { db } from '@/db'
import { opportunites } from '@/db/schema'
import Breadcrumb from '@/components/ui/Breadcrumb'
import { Badge } from '@/components/ui/Badge'
import { Card } from '@/components/ui/Card'
import { buttonVariants } from '@/components/ui/Button'
import { Building2, CalendarDays, ExternalLink, MapPin } from '@/components/ui/icons'

const LIBELLES_TYPE: Record<string, string> = {
  emploi: 'Emploi',
  stage: 'Stage',
  formation: 'Formation',
  bourse: 'Bourse',
  appel: 'Appel à projets',
  partenariat: 'Partenariat',
  financement: 'Financement',
  autre: 'Opportunité',
}

/** Lien externe : uniquement https (le lien est enregistré par un administrateur, mais on ne l'affiche jamais autrement). */
const lienSur = (url: string | null) => (url && /^https:\/\//i.test(url) ? url : null)

export async function chargerOffre(id: string, userId?: string | null) {
  const visible = userId
    ? or(eq(opportunites.statut, 'publie'), eq(opportunites.poste_par, userId))
    : eq(opportunites.statut, 'publie')
  return db.query.opportunites.findFirst({ where: and(eq(opportunites.id, id), visible) })
}

/**
 * Page de lecture d'une opportunité : résumé rédigé par Agrolide. Le bouton mène à l'offre complète sur le site de la
 * source ; c'est là que se trouve le lien pour postuler.
 */
export default async function OffreLecture({ id, userId, espaceMembre }: { id: string; userId?: string | null; espaceMembre: boolean }) {
  const offre = await chargerOffre(id, userId)
  if (!offre) notFound()

  const limite = offre.date_limite ? new Date(offre.date_limite) : null
  const expiree = !!limite && limite < new Date()
  const source = lienSur(offre.lien_externe)
  const retour = espaceMembre ? '/membres/opportunites' : '/opportunites'

  return (
    <div className="max-w-4xl mx-auto px-2 md:px-4 py-6 space-y-6">
      <Breadcrumb jsonLd={false} className="mb-0" items={[{ label: 'Opportunités', href: retour }, { label: offre.titre }]} />

      <header className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="neutral">{LIBELLES_TYPE[offre.type_opp] ?? 'Opportunité'}</Badge>
          {expiree && <Badge variant="neutral">Date limite dépassée</Badge>}
          {offre.statut !== 'publie' && <Badge variant="info">En attente de validation</Badge>}
        </div>
        <h1 className="text-headline-sm md:text-headline-md text-on-surface">{offre.titre}</h1>
      </header>

      <Card variant="filled" className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {offre.organisation && (
          <div className="flex items-start gap-3">
            <Building2 className="mt-0.5 size-5 text-primary" aria-hidden="true" />
            <div>
              <p className="text-body-sm text-on-surface-variant">Organisation</p>
              <p className="text-title-md text-on-surface">{offre.organisation}</p>
            </div>
          </div>
        )}
        {offre.pays && (
          <div className="flex items-start gap-3">
            <MapPin className="mt-0.5 size-5 text-primary" aria-hidden="true" />
            <div>
              <p className="text-body-sm text-on-surface-variant">Lieu</p>
              <p className="text-title-md text-on-surface">{offre.pays}</p>
            </div>
          </div>
        )}
        <div className="flex items-start gap-3">
          <CalendarDays className="mt-0.5 size-5 text-primary" aria-hidden="true" />
          <div>
            <p className="text-body-sm text-on-surface-variant">Date limite</p>
            <p className="text-title-md text-on-surface">
              {limite ? format(limite, 'd MMMM yyyy', { locale: fr }) : 'Non précisée dans l’annonce'}
            </p>
          </div>
        </div>
      </Card>

      <section className="prose prose-green max-w-none text-on-surface-variant" aria-labelledby="offre-resume">
        <h2 id="offre-resume" className="text-title-lg text-on-surface mb-3">Résumé de l'offre</h2>
        {offre.description ? (
          <div dangerouslySetInnerHTML={{ __html: marked.parse(offre.description, { async: false }) as string }} />
        ) : (
          <p className="italic">Aucune description n'a été fournie pour le moment.</p>
        )}
      </section>

      <div className="border-t border-outline-variant pt-6 space-y-3">
        {source ? (
          <>
            <a href={source} target="_blank" rel="noopener noreferrer" className={buttonVariants({ variant: 'primary' })}>
              Lire l'offre complète <ExternalLink className="size-4" aria-hidden="true" />
            </a>
            <p className="text-body-sm text-on-surface-variant">
              Ce résumé ne remplace pas l'annonce d'origine. Les conditions détaillées et le lien pour postuler se trouvent sur la page de l'offre complète.
            </p>
          </>
        ) : (
          <p className="text-body-md text-on-surface-variant">Aucune source en ligne n'est associée à cette offre.</p>
        )}
      </div>
    </div>
  )
}
