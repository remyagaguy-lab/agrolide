import Image from "next/image";
import type { ReactNode } from "react";
import { db } from "@/db";
import { formations, inscriptions_formation } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/Badge";
import { DetailHero } from "@/components/ui/DetailHero";
import { auth } from "@/lib/auth/server";
import { EnrollButton } from "./EnrollButton";
import { PartagerBouton } from "./PartagerBouton";
import Breadcrumb from "@/components/ui/Breadcrumb";
import { Award, CheckCircle2, Clock, Languages, ExternalLink, GraduationCap, Layers, MonitorPlay, Plus, Minus, Tag } from "@/components/ui/icons"
type Espace = "membre" | "public";

/** Une rubrique repliable de la fiche (contexte, public, objectifs…). */
function Rubrique({ titre, ouverte = false, children }: { titre: string; ouverte?: boolean; children: ReactNode }) {
  return (
    <details open={ouverte} className="group overflow-hidden rounded-card border border-outline-variant bg-surface-container-lowest">
      <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-title-md font-bold text-on-surface transition-colors hover:bg-surface-container-low [&::-webkit-details-marker]:hidden">
        {titre}
        <span className="group-open:hidden"><Plus className="size-5 text-primary" aria-hidden /></span>
        <span className="hidden group-open:block"><Minus className="size-5 text-primary" aria-hidden /></span>
      </summary>
      <div className="px-5 pb-5">{children}</div>
    </details>
  );
}

/** Une ligne du résumé : pictogramme, intitulé discret, valeur. */
function Fait({ Icone, libelle, children }: { Icone: typeof Clock; libelle: string; children: ReactNode }) {
  return (
    <div className="flex items-start gap-3">
      <span className="flex size-10 shrink-0 items-center justify-center rounded-control bg-primary-container text-on-primary-container">
        <Icone className="size-5" aria-hidden />
      </span>
      <div className="min-w-0">
        <dt className="text-label-md font-bold uppercase tracking-wider text-on-surface-variant">{libelle}</dt>
        <dd className="text-body-md font-medium text-on-surface">{children}</dd>
      </div>
    </div>
  );
}

const texte = "text-body-md leading-relaxed text-on-surface-variant";

/**
 * Fiche d'une formation, partagée par le site public (/formations/[id]) et l'espace membre
 * (/membres/formations/[id]). L'espace membre ouvre le lecteur de cours dans /membres, sans repasser par le site public.
 */
export async function FormationDetailView({ id, mode }: { id: string; mode: Espace }) {
  // Formation, session et inscription sont indépendantes : une seule attente.
  const [formation, { userId }, existing] = await Promise.all([
    db.query.formations.findFirst({
      where: eq(formations.id, id),
      with: {
        modules: {
          orderBy: (modules, { asc }) => [asc(modules.ordre)],
          with: { lecons: { orderBy: (lecons, { asc }) => [asc(lecons.ordre)] } },
        },
      },
    }),
    auth(),
    auth().then(({ userId: uid }) =>
      uid
        ? db.query.inscriptions_formation.findFirst({
            where: and(eq(inscriptions_formation.membre_id, uid), eq(inscriptions_formation.formation_id, id)),
          })
        : null,
    ),
  ]);

  if (!formation) notFound();

  const totalModules = formation.modules.length;
  const allLecons = formation.modules.flatMap((m) => m.lecons);
  const totalLecons = allLecons.length;
  const totalDuree = allLecons.reduce((acc, curr) => acc + (curr.duree_minutes || 0), 0);
  const formattedDuree =
    totalDuree >= 60 ? `${Math.floor(totalDuree / 60)} h${totalDuree % 60 > 0 ? ` ${totalDuree % 60} min` : ""}` : `${totalDuree} min`;

  const isLoggedIn = !!userId;
  const isEnrolled = isLoggedIn && !!existing;
  const firstLeconId = allLecons[0]?.id || "";
  const isExternal = !!formation.lien_externe;
  const etiquette = isExternal ? `Formation externe${formation.source_externe ? ` · ${formation.source_externe}` : ""}` : "Formation";
  const gratuit = !formation.prix_fcfa;

  let extProgramme: any = null;
  if (isExternal && formation.programme_json) {
    try {
      extProgramme = typeof formation.programme_json === "string" ? JSON.parse(formation.programme_json) : formation.programme_json;
    } catch (e) {
      console.error("Failed to parse programme_json", e);
    }
  }

  return (
    <div className={mode === "public" ? "min-h-screen bg-surface-container-lowest" : ""}>
      {mode === "public" ? (
        <DetailHero
          label={etiquette}
          title={formation.titre}
          image={formation.cover_image_url ? { src: formation.cover_image_url, alt: `Couverture de la formation « ${formation.titre} »` } : null}
          breadcrumb={[{ label: "Formations", href: "/formations" }, { label: formation.titre }]}
        />
      ) : (
        <header className="space-y-4">
          <Breadcrumb jsonLd={false} className="mb-0" items={[{ label: "Formations", href: "/membres/formations/catalogue" }, { label: formation.titre }]} />
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="neutral">{etiquette}</Badge>
            {formation.thematique ? <Badge variant="category">{formation.thematique}</Badge> : null}
            {isEnrolled ? <Badge variant="success">Vous êtes inscrit(e)</Badge> : null}
          </div>
          <h1 className="text-headline-sm text-on-surface md:text-headline-md">{formation.titre}</h1>
        </header>
      )}

      <div className={mode === "public" ? "container pb-24 pt-10 md:pt-14" : "pt-6"}>
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_340px] lg:gap-12">
          {/* Contenu */}
          <div className="min-w-0 space-y-8">
            {mode === "membre" && formation.cover_image_url ? (
              <div className="relative aspect-[16/7] w-full overflow-hidden rounded-card bg-surface-container">
                <Image
                  src={formation.cover_image_url}
                  alt={`Couverture de la formation « ${formation.titre} »`}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 800px"
                  className="object-cover"
                />
              </div>
            ) : null}

            {/* Résumé chiffré : visible d'emblée sur mobile (l'encart d'inscription vient après le contenu). */}
            <dl className="grid grid-cols-2 gap-4 rounded-card border border-outline-variant bg-surface-container-lowest p-4 lg:hidden">
              <Fait Icone={GraduationCap} libelle="Niveau">{formation.niveau || "Tous niveaux"}</Fait>
              {isExternal ? (extProgramme?.duree ? <Fait Icone={Clock} libelle="Durée">{extProgramme.duree}</Fait> : null) : <Fait Icone={Clock} libelle="Durée">{formattedDuree}</Fait>}
            </dl>

            <section aria-labelledby="apropos" className="space-y-3">
              <h2 id="apropos" className="text-title-lg font-bold text-on-surface">À propos de la formation</h2>
              <p className="text-body-lg leading-[1.8] text-on-surface-variant">{formation.description}</p>
            </section>

            <div className="space-y-3">
              {isExternal && extProgramme ? (
                <>
                  {extProgramme.contexte && (
                    <Rubrique titre="Contexte" ouverte>
                      <p className={texte}>{extProgramme.contexte}</p>
                    </Rubrique>
                  )}
                  {extProgramme.public_cible && (
                    <Rubrique titre="Public cible">
                      <p className={texte}>{extProgramme.public_cible}</p>
                    </Rubrique>
                  )}
                  {extProgramme.objectifs && extProgramme.objectifs.length > 0 && (
                    <Rubrique titre="Ce que vous allez apprendre">
                      <ul className="grid grid-cols-1 gap-3">
                        {extProgramme.objectifs.map((obj: string, i: number) => (
                          <li key={i} className="flex items-start gap-3">
                            <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden />
                            <span className="text-body-md text-on-surface">{obj}</span>
                          </li>
                        ))}
                      </ul>
                    </Rubrique>
                  )}
                  {extProgramme.presentation_structure && (
                    <Rubrique titre="À propos du partenaire">
                      <p className={texte}>{extProgramme.presentation_structure}</p>
                    </Rubrique>
                  )}
                </>
              ) : (
                <section aria-labelledby="programme" className="space-y-3">
                  <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                    <h2 id="programme" className="text-title-lg font-bold text-on-surface">Programme</h2>
                    {totalModules > 0 && (
                      <p className="text-body-md text-on-surface-variant">
                        {totalModules} module{totalModules > 1 ? "s" : ""} · {totalLecons} leçon{totalLecons > 1 ? "s" : ""} · {formattedDuree}
                      </p>
                    )}
                  </div>
                  {formation.modules.length === 0 ? (
                    <p className={texte}>Le programme détaillé sera bientôt publié.</p>
                  ) : (
                    formation.modules.map((mod, index) => {
                      const minutes = mod.lecons.reduce((acc, l) => acc + (l.duree_minutes || 0), 0);
                      return (
                        <details key={mod.id} className="group overflow-hidden rounded-card border border-outline-variant bg-surface-container-lowest">
                          <summary className="flex min-h-14 cursor-pointer list-none items-center gap-3 px-4 py-3 transition-colors hover:bg-surface-container-low [&::-webkit-details-marker]:hidden">
                            <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary-container text-label-lg font-bold text-on-primary-container">
                              {String(index + 1).padStart(2, "0")}
                            </span>
                            <span className="min-w-0 flex-1">
                              <span className="block text-title-md font-bold leading-snug text-on-surface">{mod.titre}</span>
                              <span className="block text-label-md text-on-surface-variant">
                                {mod.lecons.length} leçon{mod.lecons.length > 1 ? "s" : ""}{minutes ? ` · ${minutes} min` : ""}
                              </span>
                            </span>
                            <span className="group-open:hidden"><Plus className="size-5 text-primary" aria-hidden /></span>
                            <span className="hidden group-open:block"><Minus className="size-5 text-primary" aria-hidden /></span>
                          </summary>
                          <div className="space-y-3 px-4 pb-4">
                            {mod.description ? <p className={texte}>{mod.description}</p> : null}
                            {mod.lecons.length > 0 && (
                              <ul className="space-y-2 border-l border-outline-variant pl-4">
                                {mod.lecons.map((lecon) => (
                                  <li key={lecon.id} className="flex items-start justify-between gap-3">
                                    <span className="flex items-start gap-2 text-body-md text-on-surface">
                                      <CheckCircle2 className="mt-1 size-4 shrink-0 text-primary" aria-hidden />
                                      {lecon.titre}
                                    </span>
                                    {lecon.duree_minutes ? <span className="shrink-0 text-label-md text-on-surface-variant">{lecon.duree_minutes} min</span> : null}
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>
                        </details>
                      );
                    })
                  )}
                </section>
              )}
            </div>
          </div>

          {/* Encart : résumé et inscription (reste visible en défilant) */}
          <aside className="space-y-4 lg:sticky lg:top-6 lg:self-start">
            <div className="space-y-5 rounded-card border border-outline-variant bg-surface-container-lowest p-6">
              <p className="text-headline-sm font-bold text-on-surface">{gratuit ? (isExternal ? "Gratuit" : "Sur invitation") : `${formation.prix_fcfa?.toLocaleString("fr-FR")} FCFA`}</p>

              <dl className="space-y-4">
                <Fait Icone={GraduationCap} libelle="Niveau">{formation.niveau || "Tous niveaux"}</Fait>
                <Fait Icone={MonitorPlay} libelle="Modalité">{formation.modalite || "En ligne"}</Fait>
                {!isExternal && (
                  <>
                    <Fait Icone={Clock} libelle="Durée">{formattedDuree}</Fait>
                    <Fait Icone={Layers} libelle="Contenu">
                      {totalModules} module{totalModules > 1 ? "s" : ""} · {totalLecons} leçon{totalLecons > 1 ? "s" : ""}
                    </Fait>
                  </>
                )}
                {isExternal && extProgramme?.duree ? <Fait Icone={Clock} libelle="Durée">{extProgramme.duree}</Fait> : null}
                {isExternal && extProgramme?.langue ? <Fait Icone={Languages} libelle="Langue">{extProgramme.langue}</Fait> : null}
                {isExternal && extProgramme?.certificat ? <Fait Icone={Award} libelle="Certificat">{extProgramme.certificat}</Fait> : null}
                {isExternal && (
                  <Fait Icone={ExternalLink} libelle="Source">{formation.source_externe || "Partenaire"}</Fait>
                )}
                {formation.thematique ? <Fait Icone={Tag} libelle="Thématique">{formation.thematique}</Fait> : null}
              </dl>

              {isExternal ? (
                <p className="rounded-control bg-surface-container-low p-3 text-body-md text-on-surface-variant">
                  Formation hébergée par {formation.source_externe || "un organisme partenaire"}, {gratuit ? "gratuite" : "payante"}.
                  {extProgramme?.certificat ? ` Certificat délivré par ${formation.source_externe || "l'organisme"}.` : ""}{" "}
                  {isEnrolled
                    ? "Vous êtes inscrit(e) sur Agrolide : le cours s'ouvre sur le site de l'organisme, où un compte gratuit peut vous être demandé."
                    : "Inscrivez-vous d'abord sur Agrolide pour accéder au cours."}
                </p>
              ) : null}

              <div className="flex flex-col gap-3">
                <EnrollButton
                  mode={mode}
                  formationId={formation.id}
                  firstLeconId={firstLeconId}
                  isEnrolled={isEnrolled}
                  isLoggedIn={isLoggedIn}
                  isExternal={isExternal}
                  lienExterne={formation.lien_externe || ""}
                  className="w-full"
                />
                <PartagerBouton titre={formation.titre} />
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
