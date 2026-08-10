import { db } from "@/db";
import { formations } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { CheckCircle2, Clock, BookOpen, GraduationCap } from "lucide-react";
import ReactMarkdown from "react-markdown";

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
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-[#50a853]" />
                  <span>Environ {formattedDuree}</span>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-[#50a853]" />
                  <span>{totalModules} Modules</span>
                </div>
                <div className="flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-[#50a853]" />
                  <span>{totalLecons} Leçons</span>
                </div>
              </div>

              <div className="pt-8 flex flex-col sm:flex-row gap-4">
                <Link 
                  href={`/learn/${formation.id}`}
                  className="inline-flex items-center justify-center bg-[#f99e1d] hover:bg-[#fcb726] text-white font-heading font-[700] text-[15px] px-[28px] py-[12px] rounded-lg transition-colors min-h-[48px]"
                >
                  Commencer la formation
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Course Content Section */}
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
    </div>
  );
}
