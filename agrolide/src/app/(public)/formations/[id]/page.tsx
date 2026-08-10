import { db } from "@/db";
import { formations } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { CheckCircle2, Clock, BookOpen, GraduationCap, ExternalLink } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { auth } from "@clerk/nextjs/server";
import { inscriptions_formation } from "@/db/schema";
import { and } from "drizzle-orm";
import { EnrollButton } from "./EnrollButton";

export default async function FormationPublicPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const formation = await db.query.formations.findFirst({
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
  });

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

  // Auth & Enrollment check
  const { userId } = await auth();
  const isLoggedIn = !!userId;
  let isEnrolled = false;

  if (isLoggedIn && userId) {
    const existing = await db.query.inscriptions_formation.findFirst({
      where: and(
        eq(inscriptions_formation.membre_id, userId),
        eq(inscriptions_formation.formation_id, formation.id)
      )
    });
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
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative pt-16 md:pt-24 pb-16 md:pb-32 bg-[#1b5e38]">
        <div className="container relative z-10">
          <div className="flex flex-col lg:flex-row gap-12 items-center">
            {/* Colonne texte */}
            <div className="flex-1 space-y-8 w-full lg:w-[58%]">
              <div className="inline-flex items-center gap-2 border border-white/25 rounded-[5px] px-3.5 py-1.5">
                <div className="w-2 h-2 rounded-full bg-[#50a853]" />
                <span className="text-[12px] font-heading font-medium text-white/80 uppercase tracking-wide">
                  {formation.modalite || "En ligne"}
                  {formation.statut === 'publié' && " · Nouveau"}
                </span>
              </div>
              
              <h1 className="font-heading font-[900] text-[clamp(36px,5vw,56px)] leading-[1.1] tracking-[-0.03em] text-white">
                {formation.titre}
              </h1>
              
              <p className="text-[17px] font-heading font-normal text-white/70 max-w-[480px] leading-[1.75]">
                {formation.description}
              </p>
              
              <div className="flex flex-wrap items-center gap-6 pt-2 text-[14px] font-heading font-medium text-white/80">
                {!isExternal && (
                  <div className="flex items-center gap-2">
                    <Clock className="w-[18px] h-[18px] text-[#50a853]" />
                    <span>Environ {formattedDuree}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <GraduationCap className="w-[18px] h-[18px] text-[#50a853]" />
                  <span>Niveau {formation.niveau || "Tous niveaux"}</span>
                </div>
                {!isExternal && (
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-[18px] h-[18px] text-[#50a853]" />
                    <span>{totalModules} Modules</span>
                  </div>
                )}
                {isExternal && (
                  <div className="flex items-center gap-2">
                    <ExternalLink className="w-[18px] h-[18px] text-[#f99e1d]" />
                    <span>Source : {formation.source_externe || "Partenaire Externe"}</span>
                  </div>
                )}
              </div>

              <div className="pt-6 flex flex-col sm:flex-row gap-4">
                <EnrollButton 
                  formationId={formation.id}
                  firstLeconId={firstLeconId}
                  isEnrolled={isEnrolled}
                  isLoggedIn={isLoggedIn}
                  isExternal={isExternal}
                  lienExterne={formation.lien_externe || ""}
                />
              </div>
            </div>

            {/* Colonne visuelle (Masquée sur mobile pour perfs, affichée sur md+) */}
            <div className="hidden md:block w-full lg:w-[42%]">
              {formation.cover_image_url ? (
                <div className="rounded-xl overflow-hidden aspect-[4/3] relative shadow-lg">
                  <img 
                    src={formation.cover_image_url} 
                    alt={formation.titre}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
              ) : (
                <div className="rounded-xl overflow-hidden aspect-[4/3] bg-[#1a2e22] border border-white/10 flex items-center justify-center flex-col gap-4">
                  <BookOpen className="w-12 h-12 text-white/20" />
                  <span className="font-heading font-semibold text-white/40 text-sm tracking-wide text-center px-4">
                    {formation.source_externe || "AGROLIDE FORMATION"}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Course Content Section */}
      {isExternal && extProgramme ? (
        <section className="py-16 md:py-24 bg-[#f8f8f6]">
          <div className="container">
            <div className="max-w-[1100px] mx-auto grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-12 lg:gap-16">
              <div className="space-y-12">
                {extProgramme.contexte && (
                  <div>
                    <span className="font-heading font-bold text-[11px] uppercase tracking-[0.1em] text-[#50a853] mb-2.5 block">
                      Contexte
                    </span>
                    <h2 className="font-heading font-[800] text-[clamp(22px,3vw,34px)] leading-[1.2] tracking-[-0.02em] text-[#1a1a1a] mb-6">
                      Le contexte de la formation
                    </h2>
                    <div className="bg-white border border-[#e8e8e4] rounded-xl p-6 md:p-8 transition-colors duration-150 hover:border-[#c8c8c4] hover:shadow-[0_2px_12px_rgba(0,0,0,0.06)]">
                      <p className="font-body text-[15px] leading-[1.8] text-[#4a4a4a]">
                        {extProgramme.contexte}
                      </p>
                    </div>
                  </div>
                )}

                {extProgramme.objectifs && extProgramme.objectifs.length > 0 && (
                  <div>
                    <span className="font-heading font-bold text-[11px] uppercase tracking-[0.1em] text-[#50a853] mb-2.5 block">
                      Objectifs
                    </span>
                    <h2 className="font-heading font-[800] text-[clamp(22px,3vw,34px)] leading-[1.2] tracking-[-0.02em] text-[#1a1a1a] mb-6">
                      Ce que vous allez apprendre
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {extProgramme.objectifs.map((obj: string, i: number) => (
                        <div key={i} className="flex items-start gap-3 bg-white p-6 rounded-xl border border-[#e8e8e4] transition-colors duration-150 hover:border-[#c8c8c4] hover:shadow-[0_2px_12px_rgba(0,0,0,0.06)]">
                          <CheckCircle2 className="w-5 h-5 text-[#50a853] mt-0.5 flex-shrink-0" />
                          <span className="font-heading text-[15px] font-medium text-[#1a1a1a] leading-[1.5]">{obj}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              {/* Sidebar informative */}
              <div className="space-y-6">
                {extProgramme.public_cible && (
                  <div className="bg-white border border-[#e8e8e4] rounded-xl p-6 transition-colors duration-150 hover:border-[#c8c8c4] hover:shadow-[0_2px_12px_rgba(0,0,0,0.06)]">
                    <h3 className="font-heading font-[700] text-[17px] text-[#1a1a1a] mb-3">Public cible</h3>
                    <p className="font-heading text-[14px] text-[#4a4a4a] leading-[1.65]">
                      {extProgramme.public_cible}
                    </p>
                  </div>
                )}

                {extProgramme.presentation_structure && (
                  <div className="bg-[#f0f7f0] border border-[#50a853]/20 rounded-xl p-6">
                    <h3 className="font-heading font-[700] text-[17px] text-[#1b5e38] mb-3">
                      À propos du partenaire
                    </h3>
                    <p className="font-heading text-[14px] text-[#1b5e38]/80 leading-[1.65]">
                      {extProgramme.presentation_structure}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      ) : !isExternal && (
        <section className="py-16 md:py-24 bg-[#f8f8f6]">
          <div className="container">
            <div className="max-w-3xl mx-auto">
              <span className="font-heading font-bold text-[11px] uppercase tracking-[0.1em] text-[#50a853] mb-2.5 block text-center">
                Curriculum
              </span>
              <h2 className="font-heading font-[800] text-[clamp(22px,3vw,34px)] leading-[1.2] tracking-[-0.02em] text-[#1a1a1a] mb-12 text-center">
                Programme de la formation
              </h2>
              
              <div className="space-y-6">
                {formation.modules.map((mod, index) => (
                  <div key={mod.id} className="bg-white border border-[#e8e8e4] rounded-xl overflow-hidden hover:border-[#c8c8c4] hover:shadow-[0_2px_12px_rgba(0,0,0,0.06)] transition-all duration-150">
                    <div className="p-6 md:p-8">
                      <div className="flex items-start gap-4 mb-2">
                        <div className="w-10 h-10 rounded-full bg-[#f0f0ee] flex items-center justify-center flex-shrink-0 mt-1">
                          <span className="font-heading text-[#1b5e38] font-[700] text-lg">
                            {String(index + 1).padStart(2, '0')}
                          </span>
                        </div>
                        <div>
                          <h3 className="font-heading text-[clamp(16px,2vw,20px)] font-[700] leading-[1.3] text-[#1a1a1a] mb-2">
                            {mod.titre}
                          </h3>
                          <p className="font-heading text-[15px] font-[400] leading-[1.7] text-[#4a4a4a]">
                            {mod.description}
                          </p>
                        </div>
                      </div>
                      
                      <div className="pl-14 space-y-4 pt-6 border-t border-[#e8e8e4] mt-6">
                        {mod.lecons.map((lecon) => (
                          <div key={lecon.id} className="flex items-start gap-3">
                            <CheckCircle2 className="w-[18px] h-[18px] text-[#50a853] mt-[3px] flex-shrink-0" />
                            <div>
                              <p className="font-heading font-medium text-[15px] text-[#1a1a1a]">
                                {lecon.titre}
                              </p>
                              {lecon.duree_minutes && (
                                <p className="font-heading font-[400] text-[13px] text-[#9a9a96] mt-1">
                                  {lecon.duree_minutes} min
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
