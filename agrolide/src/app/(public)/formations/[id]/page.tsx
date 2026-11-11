import { db } from "@/db";
import { formations } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { CheckCircle2, Clock, BookOpen, GraduationCap, ExternalLink, Plus, Minus, Share2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { auth } from "@/lib/auth/server";
import { inscriptions_formation } from "@/db/schema";
import { and } from "drizzle-orm";
import { EnrollButton } from "./EnrollButton";

export default async function FormationPublicPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  // Formation, session et inscription sont indépendantes : une seule attente.
  const [formation, { userId }, existing] = await Promise.all([
  db.query.formations.findFirst({
    where: eq(formations.id, id),
    with: {
      modules: {
        orderBy: (modules, { asc }) => [asc(modules.ordre)],
        with: {
          lecons: {
            orderBy: (lecons, { asc }) => [asc(lecons.ordre)],
          },
        },
      },
    },
  }),
    auth(),
    auth().then(({ userId: uid }) =>
      uid
        ? db.query.inscriptions_formation.findFirst({
            where: and(
              eq(inscriptions_formation.membre_id, uid),
              eq(inscriptions_formation.formation_id, id)
            ),
          })
        : null
    ),
  ]);

  if (!formation) {
    notFound();
  }

  const totalModules = formation.modules.length;
  const allLecons = formation.modules.flatMap(m => m.lecons);
  const totalLecons = allLecons.length;
  const totalDuree = allLecons.reduce((acc, curr) => acc + (curr.duree_minutes || 0), 0);
  const formattedDuree = totalDuree >= 60 
    ? `${Math.floor(totalDuree / 60)}h${totalDuree % 60 > 0 ? ` ${totalDuree % 60}min` : ''}` 
    : `${totalDuree} min`;

  const isLoggedIn = !!userId;
  let isEnrolled = false;

  if (isLoggedIn && userId) {
    if (existing) {
      isEnrolled = true;
    }
  }

  const firstLeconId = allLecons[0]?.id || "";
  const isExternal = !!formation.lien_externe;

  let extProgramme: any = null;
  if (isExternal && formation.programme_json) {
    try {
      extProgramme = typeof formation.programme_json === "string" 
        ? JSON.parse(formation.programme_json)
        : formation.programme_json;
    } catch (e) {
      console.error("Failed to parse programme_json", e);
    }
  }

  return (
    <div className="min-h-screen bg-white relative">
      {/* Banner Background */}
      <div className="absolute top-0 left-0 right-0 h-[180px] md:h-[260px] bg-primary z-0" />
      
      <div className="container relative z-10 pt-8 md:pt-16 pb-24">
        
        {/* Header Top Row (Image & Title side-by-side on Desktop) */}
        <div className="flex flex-col md:flex-row gap-6 md:gap-10 items-start md:items-end mb-10 md:mb-16">
          
          {/* Cover Image Wrapper */}
          <div className="w-full md:w-[420px] lg:w-[480px] flex-shrink-0">
            {formation.cover_image_url ? (
              <div className="rounded-[10px] overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.12)] bg-white border border-outline-variant p-1.5 md:p-2 aspect-[4/3] w-full">
                {formation.cover_image_url.startsWith("/") ? (
                  <div className="relative w-full h-full">
                    <Image
                      src={formation.cover_image_url}
                      alt={formation.titre}
                      fill
                      sizes="(min-width: 1024px) 480px, (min-width: 768px) 420px, 100vw"
                      className="object-cover rounded-[6px]"
                      priority
                    />
                  </div>
                ) : (
                  <img
                    src={formation.cover_image_url}
                    alt={formation.titre}
                    className="w-full h-full object-cover rounded-[6px]"
                    loading="lazy"
                  />
                )}
              </div>
            ) : (
              <div className="rounded-[10px] overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.12)] bg-[#1a2e22] border border-primary aspect-[4/3] w-full flex items-center justify-center p-6">
                 <span className="font-heading font-semibold text-white/50 text-center text-lg">{formation.source_externe || "AGROLIDE FORMATION"}</span>
              </div>
            )}
          </div>
          
          {/* Title */}
          <div className="flex-1 md:pb-4">
            <h1 className="font-heading font-[900] text-[clamp(28px,4vw,44px)] leading-[1.15] text-on-surface md:text-white tracking-[-0.02em]">
              {formation.titre}
            </h1>
          </div>
        </div>

        {/* Content & Sidebar Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-12 lg:gap-16">
          
          {/* LEFT COLUMN: Main Content */}
          <div className="space-y-10">
            {/* Description intro */}
            <div>
              <p className="font-body text-[16px] md:text-[17px] leading-[1.8] text-on-surface-variant">
                {formation.description}
              </p>
            </div>

            {/* Accordions Container */}
            <div className="space-y-3">
              {isExternal && extProgramme ? (
                <>
                  {extProgramme.contexte && (
                    <details open className="group border border-outline-variant bg-surface-container-low rounded-[8px] overflow-hidden">
                      <summary className="flex items-center justify-between cursor-pointer p-4 md:p-5 font-heading font-[800] text-[16px] text-on-surface list-none [&::-webkit-details-marker]:hidden hover:bg-surface-container transition-colors">
                        Contexte
                        <span className="group-open:hidden"><Plus className="w-5 h-5 text-primary" /></span>
                        <span className="hidden group-open:block"><Minus className="w-5 h-5 text-primary" /></span>
                      </summary>
                      <div className="p-4 md:p-5 pt-0 bg-surface-container-low font-body text-[15px] leading-[1.75] text-on-surface-variant">
                        <div className="pt-2">{extProgramme.contexte}</div>
                      </div>
                    </details>
                  )}

                  {extProgramme.public_cible && (
                    <details className="group border border-outline-variant bg-surface-container-low rounded-[8px] overflow-hidden">
                      <summary className="flex items-center justify-between cursor-pointer p-4 md:p-5 font-heading font-[800] text-[16px] text-on-surface list-none [&::-webkit-details-marker]:hidden hover:bg-surface-container transition-colors">
                        Public cible
                        <span className="group-open:hidden"><Plus className="w-5 h-5 text-primary" /></span>
                        <span className="hidden group-open:block"><Minus className="w-5 h-5 text-primary" /></span>
                      </summary>
                      <div className="p-4 md:p-5 pt-0 bg-surface-container-low font-body text-[15px] leading-[1.75] text-on-surface-variant">
                        <div className="pt-2">{extProgramme.public_cible}</div>
                      </div>
                    </details>
                  )}

                  {extProgramme.objectifs && extProgramme.objectifs.length > 0 && (
                    <details className="group border border-outline-variant bg-surface-container-low rounded-[8px] overflow-hidden">
                      <summary className="flex items-center justify-between cursor-pointer p-4 md:p-5 font-heading font-[800] text-[16px] text-on-surface list-none [&::-webkit-details-marker]:hidden hover:bg-surface-container transition-colors">
                        Ce que vous allez apprendre
                        <span className="group-open:hidden"><Plus className="w-5 h-5 text-primary" /></span>
                        <span className="hidden group-open:block"><Minus className="w-5 h-5 text-primary" /></span>
                      </summary>
                      <div className="p-4 md:p-5 pt-0 bg-surface-container-low">
                        <div className="grid grid-cols-1 gap-3 pt-2">
                          {extProgramme.objectifs.map((obj: string, i: number) => (
                            <div key={i} className="flex items-start gap-3">
                              <CheckCircle2 className="w-[18px] h-[18px] text-primary mt-[3px] flex-shrink-0" />
                              <span className="font-heading text-[14px] font-medium text-on-surface leading-[1.5]">{obj}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </details>
                  )}

                  {extProgramme.presentation_structure && (
                    <details className="group border border-outline-variant bg-surface-container-low rounded-[8px] overflow-hidden">
                      <summary className="flex items-center justify-between cursor-pointer p-4 md:p-5 font-heading font-[800] text-[16px] text-on-surface list-none [&::-webkit-details-marker]:hidden hover:bg-surface-container transition-colors">
                        À propos du partenaire
                        <span className="group-open:hidden"><Plus className="w-5 h-5 text-primary" /></span>
                        <span className="hidden group-open:block"><Minus className="w-5 h-5 text-primary" /></span>
                      </summary>
                      <div className="p-4 md:p-5 pt-0 bg-surface-container-low font-body text-[15px] leading-[1.75] text-on-surface-variant">
                        <div className="pt-2">{extProgramme.presentation_structure}</div>
                      </div>
                    </details>
                  )}
                </>
              ) : (
                /* Programme for internal formations */
                <details open className="group border border-outline-variant bg-surface-container-low rounded-[8px] overflow-hidden">
                  <summary className="flex items-center justify-between cursor-pointer p-4 md:p-5 font-heading font-[800] text-[16px] text-on-surface list-none [&::-webkit-details-marker]:hidden hover:bg-surface-container transition-colors">
                    Structure du cours
                    <span className="group-open:hidden"><Plus className="w-5 h-5 text-primary" /></span>
                    <span className="hidden group-open:block"><Minus className="w-5 h-5 text-primary" /></span>
                  </summary>
                  <div className="p-4 md:p-5 pt-0 bg-surface-container-low">
                    <div className="space-y-6 pt-2">
                      {formation.modules.map((mod, index) => (
                        <div key={mod.id}>
                          <div className="flex items-start gap-3 mb-2">
                            <div className="w-8 h-8 rounded-full bg-white border border-outline-variant flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm">
                              <span className="font-heading text-primary font-[700] text-[13px]">
                                {String(index + 1).padStart(2, '0')}
                              </span>
                            </div>
                            <div>
                              <h3 className="font-heading text-[15px] font-[700] leading-[1.3] text-on-surface mb-1">
                                {mod.titre}
                              </h3>
                              <p className="font-heading text-[14px] font-[400] leading-[1.5] text-on-surface-variant">
                                {mod.description}
                              </p>
                            </div>
                          </div>
                          
                          <div className="pl-11 space-y-2.5 pt-2">
                            {mod.lecons.map((lecon) => (
                              <div key={lecon.id} className="flex items-start gap-2.5">
                                <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                                <div>
                                  <p className="font-heading font-medium text-[13.5px] leading-[1.4] text-on-surface">
                                    {lecon.titre}
                                  </p>
                                  {lecon.duree_minutes && (
                                    <p className="font-heading font-[400] text-[12px] text-on-surface-muted mt-0.5">
                                      {lecon.duree_minutes} min
                                    </p>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </details>
              )}
            </div>
          </div>

          {/* RIGHT COLUMN: Sidebar */}
          <div className="space-y-6">
            
            {/* Metadata Block (Grey box) */}
            <div className="bg-surface-container-low border border-outline-variant p-6 md:p-7 rounded-[12px]">
              <h3 className="font-heading font-[800] text-[13px] uppercase tracking-wide text-on-surface mb-5">
                Détails du cours
              </h3>
              
              <div className="space-y-5">
                {!isExternal && (
                  <div>
                    <span className="block font-heading text-[12px] uppercase text-on-surface-muted mb-1 font-bold tracking-wide">Durée d'apprentissage</span>
                    <span className="font-heading text-[15px] text-on-surface font-medium">{formattedDuree}</span>
                  </div>
                )}
                
                <div>
                  <span className="block font-heading text-[12px] uppercase text-on-surface-muted mb-1 font-bold tracking-wide">Niveau</span>
                  <span className="font-heading text-[15px] text-on-surface font-medium">{formation.niveau || "Tous niveaux"}</span>
                </div>

                <div>
                  <span className="block font-heading text-[12px] uppercase text-on-surface-muted mb-1 font-bold tracking-wide">Modalité</span>
                  <span className="font-heading text-[15px] text-on-surface font-medium">{formation.modalite || "En ligne"}</span>
                </div>

                {isExternal && (
                  <div>
                    <span className="block font-heading text-[12px] uppercase text-on-surface-muted mb-1 font-bold tracking-wide">Domaine / Source</span>
                    <span className="font-heading text-[15px] text-primary font-semibold">{formation.source_externe || "Partenaire"}</span>
                  </div>
                )}
                
                {!isExternal && (
                  <div>
                    <span className="block font-heading text-[12px] uppercase text-on-surface-muted mb-1 font-bold tracking-wide">Modules</span>
                    <span className="font-heading text-[15px] text-on-surface font-medium">{totalModules} modules</span>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-3">
              <EnrollButton 
                formationId={formation.id}
                firstLeconId={firstLeconId}
                isEnrolled={isEnrolled}
                isLoggedIn={isLoggedIn}
                isExternal={isExternal}
                lienExterne={formation.lien_externe || ""}
                className="w-full"
              />
              <button className="w-full h-[48px] flex items-center justify-center gap-2 rounded-[8px] border-2 border-primary/20 bg-transparent text-primary font-heading font-[700] text-[15px] hover:bg-primary/5 transition-colors">
                <Share2 className="w-4 h-4" />
                Partager ce cours
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
