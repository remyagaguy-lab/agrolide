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
      <section className="relative pt-16 md:pt-24 pb-16 md:pb-24 bg-[#1b5e38]">
        <div className="container relative z-10">
          <div className="flex flex-col lg:flex-row gap-12 items-start">
            <div className="flex-1 space-y-6 max-w-3xl">
              <div className="flex items-center gap-3">
                <Badge variant="category" className="px-3 py-1 bg-white/10 text-white border-transparent hover:bg-white/20">
                  {formation.modalite || "En ligne"}
                </Badge>
                {formation.statut === 'publié' && (
                  <Badge variant="nouveau" className="bg-[#50a853] text-white border-transparent">Nouveau</Badge>
                )}
              </div>
              
              <h1 className="text-h1 text-white">
                {formation.titre}
              </h1>
              
              <p className="text-body-lg text-white/90 max-w-2xl">
                {formation.description}
              </p>
              
              <div className="flex flex-wrap items-center gap-6 pt-4 text-sm font-medium text-white/80">
                {!isExternal && (
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-[#50a853]" />
                    <span>Environ {formattedDuree}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-[#50a853]" />
                  <span>Niveau {formation.niveau}</span>
                </div>
                {!isExternal && (
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-[#50a853]" />
                    <span>{totalModules} Modules</span>
                  </div>
                )}
                {isExternal && (
                  <div className="flex items-center gap-2">
                    <ExternalLink className="w-5 h-5 text-[#f99e1d]" />
                    <span>Source : {formation.source_externe}</span>
                  </div>
                )}
              </div>

              <div className="pt-8 flex flex-col sm:flex-row gap-4">
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
          </div>
        </div>
      </section>

      {/* Course Content Section */}
      {isExternal && extProgramme ? (
        <section className="py-16 md:py-24 bg-[#f8f8f6]">
          <div className="container">
            <div className="max-w-4xl mx-auto space-y-12">
              
              {extProgramme.contexte && (
                <div>
                  <h2 className="text-h2 text-[#1a1a1a] mb-6">Contexte de la formation</h2>
                  <p className="text-body-lg text-[#4a4a4a] leading-relaxed">
                    {extProgramme.contexte}
                  </p>
                </div>
              )}

              {extProgramme.public_cible && (
                <div>
                  <h2 className="text-h2 text-[#1a1a1a] mb-6">Public cible</h2>
                  <div className="bg-white p-6 rounded-xl border border-[#e8e8e4]">
                    <p className="text-body text-[#4a4a4a]">
                      {extProgramme.public_cible}
                    </p>
                  </div>
                </div>
              )}

              {extProgramme.objectifs && extProgramme.objectifs.length > 0 && (
                <div>
                  <h2 className="text-h2 text-[#1a1a1a] mb-6">Ce que vous allez apprendre</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {extProgramme.objectifs.map((obj: string, i: number) => (
                      <div key={i} className="flex items-start gap-3 bg-white p-4 rounded-xl border border-[#e8e8e4]">
                        <CheckCircle2 className="w-5 h-5 text-[#50a853] mt-0.5 flex-shrink-0" />
                        <span className="text-[#1a1a1a] leading-tight">{obj}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {extProgramme.presentation_structure && (
                <div>
                  <h2 className="text-h2 text-[#1a1a1a] mb-6">À propos de {formation.source_externe}</h2>
                  <div className="bg-[#1b5e38]/5 p-6 rounded-xl border border-[#1b5e38]/10">
                    <p className="text-body text-[#4a4a4a]">
                      {extProgramme.presentation_structure}
                    </p>
                  </div>
                </div>
              )}

            </div>
          </div>
        </section>
      ) : !isExternal && (
        <section className="py-16 md:py-24 bg-[#f8f8f6]">
          <div className="container">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-h2 text-[#1a1a1a] mb-10">Programme de la formation</h2>
              
              <div className="space-y-6">
                {formation.modules.map((mod, index) => (
                  <div key={mod.id} className="bg-white border border-[#e8e8e4] rounded-xl overflow-hidden shadow-none">
                    <div className="p-6 md:p-8">
                      <div className="flex items-start gap-4 mb-2">
                        <div className="w-10 h-10 rounded-full bg-[#f0f0ee] flex items-center justify-center flex-shrink-0 mt-1">
                          <span className="text-[#1b5e38] font-bold text-lg">{index + 1}</span>
                        </div>
                        <div>
                          <h3 className="text-h3 text-[#1a1a1a] mb-2">{mod.titre}</h3>
                          <p className="text-body text-[#4a4a4a]">{mod.description}</p>
                        </div>
                      </div>
                      
                      <div className="pl-14 space-y-4 pt-6 border-t border-[#e8e8e4] mt-6">
                        {mod.lecons.map((lecon) => (
                          <div key={lecon.id} className="flex items-start gap-3">
                            <CheckCircle2 className="w-5 h-5 text-[#50a853] mt-0.5 flex-shrink-0" />
                            <div>
                              <p className="font-medium text-[#1a1a1a]">{lecon.titre}</p>
                              <p className="text-body-sm mt-1">{lecon.duree_minutes} min</p>
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
