import { notFound, redirect } from 'next/navigation'
import Image from 'next/image'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { marked } from 'marked'
import { and, eq } from 'drizzle-orm'
import { db } from '@/db'
import { evenements, inscriptions_evenement } from '@/db/schema'
import { auth } from '@/lib/auth/server'
import Breadcrumb from '@/components/ui/Breadcrumb'
import { Badge } from '@/components/ui/Badge'
import { Card } from '@/components/ui/Card'
import { buttonVariants } from '@/components/ui/Button'
import { InscriptionEvenementBouton } from '@/components/modules/evenements/InscriptionEvenementBouton'

import Link from 'next/link'
import { CalendarDays, Clock, Download, FileText, Globe, MapPin, CheckCircle2, Video } from "@/components/ui/icons"
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const event = await db.query.evenements.findFirst({ columns: { titre: true }, where: eq(evenements.id, id) })
  return { title: event?.titre ?? 'Événement' }
}

const proxyR2 = (url: string) => (url.includes('r2.cloudflarestorage.com') ? `/api/r2-proxy?url=${encodeURIComponent(url)}` : url)

export default async function EvenementMembrePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { userId } = await auth()
  if (!userId) redirect(`/login?next=${encodeURIComponent(`/membres/evenements/${id}`)}`)

  const [event, inscription] = await Promise.all([
    db.query.evenements.findFirst({ where: eq(evenements.id, id) }),
    db.query.inscriptions_evenement.findFirst({
      columns: { id: true },
      where: and(eq(inscriptions_evenement.evenement_id, id), eq(inscriptions_evenement.membre_id, userId)),
    }),
  ])
  if (!event || !event.publie) notFound()

  const dateDebut = new Date(event.date_debut)
  const passe = dateDebut < new Date()
  const inscrit = !!inscription

  return (
    <div className="max-w-4xl mx-auto px-2 md:px-4 py-6 space-y-6">
      <Breadcrumb jsonLd={false} className="mb-0" items={[{ label: 'Événements', href: '/membres/evenements' }, { label: event.titre }]} />

      <header className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="neutral" className="capitalize">{event.type_evt.replace('_', ' ')}</Badge>
          {event.en_ligne && <Badge variant="info"><Globe className="size-4" aria-hidden="true" /> En ligne</Badge>}
          {passe ? <Badge variant="neutral">Terminé</Badge> : null}
        </div>
        <h1 className="text-headline-sm md:text-headline-md text-on-surface">{event.titre}</h1>
      </header>

      {event.image_url && (
        <div className="relative h-56 w-full overflow-hidden rounded-card bg-surface-container md:h-72">
          <Image
            src={proxyR2(event.image_url)}
            alt={`Visuel de l'événement « ${event.titre} »`}
            fill
            sizes="(max-width: 896px) 100vw, 896px"
            className="object-cover"
            unoptimized={event.image_url.includes('r2.cloudflarestorage.com')}
          />
        </div>
      )}

      <Card variant="filled" className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="flex items-start gap-3">
          <CalendarDays className="mt-0.5 size-5 text-primary" aria-hidden="true" />
          <div>
            <p className="text-body-sm text-on-surface-variant">Date</p>
            <p className="text-title-md capitalize text-on-surface">{format(dateDebut, 'EEEE d MMMM yyyy', { locale: fr })}</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <Clock className="mt-0.5 size-5 text-primary" aria-hidden="true" />
          <div>
            <p className="text-body-sm text-on-surface-variant">Heure</p>
            <p className="text-title-md text-on-surface">
              {format(dateDebut, 'HH:mm')}
              {event.date_fin && ` - ${format(new Date(event.date_fin), 'HH:mm')}`}
            </p>
          </div>
        </div>
        {!event.en_ligne && event.lieu && (
          <div className="flex items-start gap-3">
            <MapPin className="mt-0.5 size-5 text-primary" aria-hidden="true" />
            <div>
              <p className="text-body-sm text-on-surface-variant">Lieu</p>
              <p className="text-title-md text-on-surface">{event.lieu}</p>
            </div>
          </div>
        )}
      </Card>

      <section className="prose prose-green max-w-none text-on-surface-variant" aria-labelledby="evt-apropos">
        <h2 id="evt-apropos" className="text-title-lg text-on-surface mb-3">À propos de l'événement</h2>
        {event.description ? (
          <div dangerouslySetInnerHTML={{ __html: marked.parse(event.description, { async: false }) as string }} />
        ) : (
          <p className="italic">Aucune description détaillée n'a été fournie pour le moment.</p>
        )}
      </section>

      <div className="border-t border-outline-variant pt-6">
        {passe ? (
          <div className="flex flex-col gap-3 sm:flex-row">
            {event.lien_replay && (
              <a href={event.lien_replay} target="_blank" rel="noopener noreferrer" className={buttonVariants({ variant: 'secondary' })}>
                <Video className="size-4" aria-hidden="true" /> Revoir le replay
              </a>
            )}
            {event.document_id && (
              <Link href={`/bibliotheque/${event.document_id}`} className={buttonVariants({ variant: 'tonal' })}>
                <FileText className="size-4" aria-hidden="true" /> Document du webinaire
              </Link>
            )}
            {event.presentation_url && (
              <a href={proxyR2(event.presentation_url)} target="_blank" rel="noopener noreferrer" className={buttonVariants({ variant: 'tonal' })}>
                <FileText className="size-4" aria-hidden="true" /> Voir la présentation
              </a>
            )}
            {event.ressources_url && (
              <a href={proxyR2(event.ressources_url)} target="_blank" rel="noopener noreferrer" className={buttonVariants({ variant: 'tonal' })}>
                <Download className="size-4" aria-hidden="true" /> Accéder aux ressources
              </a>
            )}
            {!event.presentation_url && !event.ressources_url && !event.lien_replay && !event.document_id && (
              <p className="text-body-md text-on-surface-variant">Cet événement est terminé.</p>
            )}
          </div>
        ) : inscrit ? (
          <p role="status" className="flex items-center gap-2 text-label-lg text-success">
            <CheckCircle2 className="size-5" aria-hidden="true" /> Vous êtes inscrit(e) à cet événement
          </p>
        ) : event.lien_inscription ? (
          <a href={event.lien_inscription} target="_blank" rel="noopener noreferrer" className={buttonVariants({ variant: 'primary' })}>
            S'inscrire à l'événement
          </a>
        ) : (
          <InscriptionEvenementBouton evenementId={event.id} />
        )}
      </div>
    </div>
  )
}
