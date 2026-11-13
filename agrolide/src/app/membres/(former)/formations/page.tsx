import Link from 'next/link'
import { redirect } from 'next/navigation'
import { eq } from 'drizzle-orm'
import { auth } from '@/lib/auth/server'
import { db } from '@/db'
import { users } from '@/db/schema'
import { suiviFormations } from '@/lib/formations/suivi.server'
import { certificatsDuMembre, delivrerCertificat, formationAUnExamen } from '@/lib/formations/examen.server'
import { favorisDuMembre, lecturesDuMembre } from '@/lib/bibliotheque/parcours.server'
import { PageEntete } from '@/components/layout/PageEntete'
import { buttonVariants } from '@/components/ui/Button'
import { DownloadCertificatButton } from '@/components/modules/formations/DownloadCertificatButtonLazy'
import {
  DocumentParcoursCarte,
  FormationEnCours,
  RubriqueParcours,
  VideParcours,
} from '@/components/modules/parcours/ParcoursBlocs'

import { Award, Library, NotebookPen, Heart } from "@/components/ui/icons"
export const metadata = { title: 'Mon parcours' }

/**
 * « Mon parcours » : tout ce que le membre a entrepris, au même endroit.
 * Formations en cours, lectures en cours, documents aimés, certificats obtenus.
 */
export default async function MonParcoursPage() {
  const { userId } = await auth()
  if (!userId) redirect('/login')

  const [profil, suivis, lectures, favoris] = await Promise.all([
    db.query.users.findFirst({ where: eq(users.id, userId), columns: { nom: true, prenom: true } }),
    suiviFormations(userId),
    lecturesDuMembre(userId),
    favorisDuMembre(userId),
  ])

  const enCours = suivis.filter((s) => !s.terminee && s.statut !== 'annule')
  // Un certificat existe pour chaque formation terminée : parcours en leçons dont toutes les leçons sont validées,
  // ou session (présentiel / classe virtuelle) marquée « terminée ».
  const certifiees = suivis.filter((s) => s.terminee)
  // Chaque certificat « Participation » reçoit un numéro public vérifiable (créé à la première visite, puis stable).
  let certificats: Awaited<ReturnType<typeof certificatsDuMembre>> = []
  try {
    await Promise.all(certifiees.map((s) => delivrerCertificat(userId, s.formationId, 'participation')))
    certificats = await certificatsDuMembre(userId)
  } catch (e) {
    // Tables de certificats absentes (migration 0014 pas encore lancée) : la page reste utilisable sans numéros.
    console.error('Certificats indisponibles', e)
  }
  const numeroDe = (formationId: string, niveau: string) => certificats.find((c) => c.formation_id === formationId && c.niveau === niveau)?.numero

  const repere = [
    { href: '#en-cours', n: enCours.length, libelle: enCours.length > 1 ? 'formations en cours' : 'formation en cours', Icone: NotebookPen },
    { href: '#lectures', n: lectures.length, libelle: lectures.length > 1 ? 'documents lus' : 'document lu', Icone: Library },
    { href: '#favoris', n: favoris.length, libelle: favoris.length > 1 ? 'favoris' : 'favori', Icone: Heart },
    { href: '#certificats', n: certifiees.length, libelle: certifiees.length > 1 ? 'certificats' : 'certificat', Icone: Award },
  ]

  return (
    <div className="mx-auto max-w-[1200px] space-y-10 px-2 py-6 md:px-4">
      <PageEntete
        titre="Mon parcours"
        description="Vos formations, vos lectures et vos certificats, là où vous les avez laissés."
        action={
          <Link href="/membres/formations/catalogue" className={buttonVariants({ variant: 'tonal', size: 'sm' })}>
            <NotebookPen className="size-4" aria-hidden /> Trouver une formation
          </Link>
        }
      />

      <nav aria-label="Aller à une rubrique de mon parcours">
        <ul className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {repere.map(({ href, n, libelle, Icone }) => (
            <li key={href}>
              <a
                href={href}
                className="ag-state flex min-h-16 items-center gap-3 rounded-card border border-outline-variant bg-surface-container-lowest px-4 py-3 transition-colors hover:border-primary"
              >
                <span className="flex size-10 shrink-0 items-center justify-center rounded-control bg-primary-container text-on-primary-container">
                  <Icone className="size-5" aria-hidden />
                </span>
                <span className="min-w-0">
                  <span className="block text-headline-sm font-bold leading-none text-on-surface">{n}</span>
                  <span className="mt-1 block truncate text-label-md text-on-surface-variant">{libelle}</span>
                </span>
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <RubriqueParcours id="en-cours" titre="Formations en cours" nombre={enCours.length} lien={{ href: '/membres/formations/catalogue', libelle: 'Voir le catalogue' }}>
        {enCours.length === 0 ? (
          <VideParcours
            titre="Aucune formation en cours"
            description="Inscrivez-vous à une formation : elle apparaîtra ici avec votre progression."
            href="/membres/formations/catalogue"
            libelle="Parcourir les formations"
          />
        ) : (
          <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {enCours.map((s) => (
              <FormationEnCours key={s.inscriptionId} s={s} />
            ))}
          </ul>
        )}
      </RubriqueParcours>

      <RubriqueParcours id="lectures" titre="Mes lectures" nombre={lectures.length} lien={{ href: '/membres/bibliotheque', libelle: 'Ouvrir la bibliothèque' }}>
        {lectures.length === 0 ? (
          <VideParcours
            titre="Rien en cours de lecture"
            description="Les documents que vous ouvrez dans la bibliothèque sont gardés ici pour les reprendre plus tard."
            href="/membres/bibliotheque"
            libelle="Explorer la bibliothèque"
          />
        ) : (
          <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {lectures.map((d) => (
              <DocumentParcoursCarte key={d.id} d={d} reprise />
            ))}
          </ul>
        )}
      </RubriqueParcours>

      <RubriqueParcours id="favoris" titre="Mes favoris" nombre={favoris.length}>
        {favoris.length === 0 ? (
          <VideParcours
            titre="Aucun favori pour le moment"
            description="Sur la fiche d'un document, touchez « Ajouter aux favoris » pour le retrouver ici."
            href="/membres/bibliotheque"
            libelle="Explorer la bibliothèque"
          />
        ) : (
          <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {favoris.map((d) => (
              <DocumentParcoursCarte key={d.id} d={d} />
            ))}
          </ul>
        )}
      </RubriqueParcours>

      <RubriqueParcours id="certificats" titre="Mes certificats" nombre={certifiees.length}>
        {certifiees.length === 0 ? (
          <VideParcours
            titre="Aucun certificat pour le moment"
            description={
              enCours.length > 0
                ? "Terminez toutes les leçons d'une formation pour obtenir votre premier certificat."
                : "Menez une formation jusqu'au bout pour obtenir votre premier certificat."
            }
            href={enCours.length > 0 ? '#en-cours' : '/membres/formations/catalogue'}
            libelle={enCours.length > 0 ? 'Reprendre une formation' : 'Parcourir les formations'}
          />
        ) : (
          <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {certifiees.map((s) => {
              const date = s.session?.dateDebut ?? s.termineeLe
              return (
                <li key={s.inscriptionId} className="flex flex-col gap-4 rounded-card border border-outline-variant bg-surface-container-lowest p-5">
                  <div className="flex items-start gap-3">
                    <span className="flex size-11 shrink-0 items-center justify-center rounded-control bg-primary-container text-on-primary-container">
                      <Award className="size-5" aria-hidden />
                    </span>
                    <div className="min-w-0">
                      <h3 className="text-title-sm font-bold leading-snug text-on-surface">{s.titre}</h3>
                      {date ? <p className="mt-0.5 text-label-md text-on-surface-variant">Terminée le {new Date(date).toLocaleDateString('fr-FR')}</p> : null}
                    </div>
                  </div>
                  {profil?.nom && profil?.prenom && date ? (
                    <div className="flex flex-col gap-2">
                      <DownloadCertificatButton nom={profil.nom} prenom={profil.prenom} formationTitre={s.titre} dateDebut={date} inscriptionId={s.inscriptionId} numero={numeroDe(s.formationId, 'participation')} niveau="participation" />
                      {numeroDe(s.formationId, 'reussite') ? (
                        <DownloadCertificatButton nom={profil.nom} prenom={profil.prenom} formationTitre={s.titre} dateDebut={date} inscriptionId={s.inscriptionId} numero={numeroDe(s.formationId, 'reussite')} niveau="reussite" />
                      ) : formationAUnExamen(s.formationId) ? (
                        <Link href={`/membres/formations/${s.formationId}/examen`} className="text-sm font-bold text-primary underline-offset-2 hover:underline">
                          Examen final et business plan complet : certificat de réussite
                        </Link>
                      ) : null}
                    </div>
                  ) : (
                    <p className="text-body-sm text-on-surface-variant">
                      Complétez votre nom et votre prénom dans{' '}
                      <Link href="/membres/profil/modifier" className="font-bold text-primary underline-offset-2 hover:underline">
                        votre profil
                      </Link>{' '}
                      pour générer le certificat.
                    </p>
                  )}
                </li>
              )
            })}
          </ul>
        )}
      </RubriqueParcours>
    </div>
  )
}
