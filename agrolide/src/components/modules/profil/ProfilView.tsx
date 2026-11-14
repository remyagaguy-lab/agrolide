import Link from "next/link"
import type { ReactNode } from "react"
import { categorieAffichee, categorieLabel, lireLangues, typeOrganisationAffiche, parseList, safeExternalUrl } from "@/lib/reseau/profil"
import { completionProfil } from "@/lib/reseau/profil-schema"
import { Anneau } from "@/components/brand"
import { Avatar } from "@/components/ui/Avatar"
import { Badge } from "@/components/ui/Badge"
import { buttonVariants } from "@/components/ui/Button"
import { PageEntete } from "@/components/layout/PageEntete"

import { Briefcase, Pencil, Globe, GraduationCap, Languages, Mail, MapPin, ShieldCheck, Lightbulb, UserRound, Linkedin } from "@/components/ui/icons"
/** Les champs de la table `user` que la page lit. */
export interface ProfilAffiche {
  prenom: string | null
  nom: string | null
  email: string
  photo_url: string | null
  specialite: string | null
  organisation: string | null
  categorie: string | null
  est_organisation?: boolean | null
  type_organisation?: string | null
  ville: string | null
  pays: string | null
  biographie: string | null
  niveau_etudes: string | null
  secteurs_expertise: unknown
  centres_interet?: unknown
  langues: unknown
  site_web_url: string | null
  linkedin_url: string | null
  [cle: string]: unknown
}

/** Bloc de la page : titre, pictogramme, contenu. */
function Bloc({ titre, Icone, children }: { titre: string; Icone: typeof UserRound; children: ReactNode }) {
  return (
    <section className="rounded-card border border-outline-variant bg-surface-container-lowest p-6">
      <h2 className="mb-4 flex items-center gap-2 text-title-md font-bold text-on-surface">
        <Icone className="size-5 text-primary" aria-hidden /> {titre}
      </h2>
      {children}
    </section>
  )
}

/** Une information : intitulé discret au-dessus, valeur lisible en dessous. */
function Info({ libelle, children }: { libelle: string; children: ReactNode }) {
  return (
    <div>
      <dt className="text-label-md font-bold uppercase tracking-wider text-on-surface-variant">{libelle}</dt>
      <dd className="mt-1 text-body-md text-on-surface">{children}</dd>
    </div>
  )
}

const NonRenseigne = () => <span className="text-on-surface-muted">Non renseigné</span>

/** Page « Mon profil » : identité et complétion, puis à propos, expertise et contact. */
export function ProfilView({ profile }: { profile: ProfilAffiche }) {
  const thematiques = parseList(profile.secteurs_expertise)
  const { maternelle, autres: langues } = lireLangues(profile.langues)
  const interets = parseList(profile.centres_interet)
  const { pourcentage: completion, manquants } = completionProfil({ ...profile, thematiques })
  const nom = [profile.prenom, profile.nom].filter(Boolean).join(" ") || "Mon profil"
  const lieu = [profile.ville, profile.pays].filter(Boolean).join(", ")
  const siteWeb = safeExternalUrl(profile.site_web_url)
  const linkedin = safeExternalUrl(profile.linkedin_url)

  return (
    <div className="mx-auto max-w-[1000px] space-y-6 pb-10">
      <PageEntete
        titre="Mon profil"
        description="Ce que les autres membres voient de vous, et ce que vous pouvez encore compléter."
        action={
          <div className="flex flex-wrap gap-3">
            <Link href="/membres/profil/confidentialite" className={buttonVariants({ variant: "outline", size: "sm" })}>
              <ShieldCheck className="size-4" aria-hidden /> Confidentialité
            </Link>
            <Link href="/membres/profil/modifier" className={buttonVariants({ variant: "secondary", size: "sm" })}>
              <Pencil className="size-4" aria-hidden /> Modifier mon profil
            </Link>
          </div>
        }
      />

      {/* Identité */}
      <section className="rounded-card border border-outline-variant bg-surface-container-lowest p-6">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
          {/* Anneau de progression de l'emblème autour de la photo */}
          <span className="relative flex size-28 shrink-0 items-center justify-center self-start">
            <Anneau mode="progression" valeur={completion / 100} label={`Profil complété à ${completion} %`} className="absolute inset-0 size-full text-primary" />
            <Avatar src={profile.photo_url} name={nom} size="xl" className="size-20" />
          </span>

          <div className="min-w-0 flex-1">
            <h2 className="text-headline-sm font-bold text-on-surface">{nom}</h2>
            {profile.specialite ? <p className="mt-1 text-body-lg text-on-surface-variant">{profile.specialite}</p> : null}
            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
              {profile.categorie ? <Badge variant="brand">{categorieLabel(categorieAffichee(profile))}</Badge> : null}
              {typeOrganisationAffiche(profile) ? <Badge variant="category">{typeOrganisationAffiche(profile)}</Badge> : null}
              {profile.organisation ? (
                <span className="inline-flex items-center gap-1.5 text-body-md text-on-surface-variant">
                  <Briefcase className="size-4" aria-hidden /> {profile.organisation}
                </span>
              ) : null}
              {lieu ? (
                <span className="inline-flex items-center gap-1.5 text-body-md text-on-surface-variant">
                  <MapPin className="size-4" aria-hidden /> {lieu}
                </span>
              ) : null}
            </div>
          </div>

          <div className="shrink-0 text-left sm:text-right">
            <p className="text-headline-sm font-bold text-on-surface">{completion} %</p>
            <p className="text-label-md text-on-surface-variant">du profil renseigné</p>
          </div>
        </div>

        {manquants.length > 0 && (
          <div className="mt-6 rounded-control border border-outline-variant bg-surface-container-low p-4">
            <p className="flex items-center gap-2 text-label-lg font-bold text-on-surface">
              <Lightbulb className="size-4 text-primary" aria-hidden /> Pour un profil plus visible, ajoutez :
            </p>
            <ul className="mt-2 flex flex-wrap gap-2">
              {manquants.map((m) => (
                <li key={m} className="rounded-full bg-surface-container-lowest px-3 py-1 text-label-md text-on-surface-variant ring-1 ring-outline-variant">
                  {m}
                </li>
              ))}
            </ul>
            <Link href="/membres/profil/modifier" className="mt-3 inline-flex min-h-11 items-center text-label-lg font-bold text-primary hover:underline">
              Compléter maintenant
            </Link>
          </div>
        )}
      </section>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Bloc titre="À propos" Icone={UserRound}>
            {profile.biographie ? (
              <p className="whitespace-pre-line text-body-md leading-relaxed text-on-surface-variant">{profile.biographie}</p>
            ) : (
              <p className="text-body-md text-on-surface-muted">
                Présentez-vous en quelques lignes : votre parcours, ce que vous cherchez dans le réseau.
              </p>
            )}
          </Bloc>

          <Bloc titre="Expertise et parcours" Icone={GraduationCap}>
            <dl className="grid gap-5 sm:grid-cols-2">
              <Info libelle="Métier ou fonction">{profile.specialite || <NonRenseigne />}</Info>
              <Info libelle="Niveau d'études">{profile.niveau_etudes || <NonRenseigne />}</Info>
              <div className="sm:col-span-2">
                <Info libelle="Spécialités">
                  {thematiques.length > 0 ? (
                    <ul className="flex flex-wrap gap-2">
                      {thematiques.map((t) => (
                        <li key={t}>
                          <Badge variant="category">{t}</Badge>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <NonRenseigne />
                  )}
                </Info>
              </div>
              <div className="sm:col-span-2">
                <Info libelle="Centres d’intérêt">
                  {interets.length > 0 ? (
                    <ul className="flex flex-wrap gap-2">
                      {interets.map((t) => (
                        <li key={t}>
                          <Badge variant="category">{t}</Badge>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <NonRenseigne />
                  )}
                </Info>
              </div>
              <Info libelle="Langue maternelle">{maternelle || <NonRenseigne />}</Info>
              <Info libelle="Autres langues parlées">
                {langues.length > 0 ? (
                  <span className="inline-flex items-center gap-2">
                    <Languages className="size-4 text-on-surface-variant" aria-hidden /> {langues.join(", ")}
                  </span>
                ) : (
                  <NonRenseigne />
                )}
              </Info>
            </dl>
          </Bloc>
        </div>

        <div className="space-y-6">
          <Bloc titre="Contact" Icone={Mail}>
            <dl className="space-y-4">
              <Info libelle="E-mail">
                <span className="break-all">{profile.email}</span>
              </Info>
              <Info libelle="Localisation">{lieu || <NonRenseigne />}</Info>
              {siteWeb ? (
                <Info libelle="Site web">
                  <a href={siteWeb} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 break-all font-medium text-primary hover:underline">
                    <Globe className="size-4 shrink-0" aria-hidden /> {profile.site_web_url}
                  </a>
                </Info>
              ) : null}
              {linkedin ? (
                <Info libelle="LinkedIn">
                  <a href={linkedin} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 font-medium text-primary hover:underline">
                    <Linkedin className="size-4" aria-hidden /> Voir le profil
                  </a>
                </Info>
              ) : null}
            </dl>
            <p className="mt-4 text-body-sm text-on-surface-muted">
              Votre e-mail n'apparaît jamais dans l'annuaire.
            </p>
          </Bloc>
        </div>
      </div>
    </div>
  )
}
