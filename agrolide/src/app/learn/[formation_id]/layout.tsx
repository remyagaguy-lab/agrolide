import { db } from "@/db";
import { formations, formation_modules, formation_lecons } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, BookOpen, CheckCircle2, Lock } from "lucide-react";
import { auth } from "@/auth";
import { progression_lecons } from "@/db/schema";
import { redirect } from "next/navigation";


export default async function LearnLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ formation_id: string }>;
}) {
  const { formation_id: formationId } = await params;

  const formation = await db.query.formations.findFirst({
    where: eq(formations.id, formationId),
    columns: { id: true, titre: true },
    with: {
      modules: {
        columns: { id: true, titre: true, ordre: true },
        orderBy: (modules, { asc }) => [asc(modules.ordre)],
        with: {
          lecons: {
            columns: { id: true, titre: true, ordre: true },
            orderBy: (lecons, { asc }) => [asc(lecons.ordre)],
          },
        },
      },
    },
  });

  if (!formation) {
    notFound();
  }

  // Check auth
  const session = await auth();
  if (!session || !session.user || !session.user.id) {
    redirect("/login");
  }

  // Flatten lecons for easy progress calculation
  const allLecons = formation.modules.flatMap(m => m.lecons);
  const totalLecons = allLecons.length;

  // Fetch user progress from DB
  const userProgress = await db.query.progression_lecons.findMany({
    where: eq(progression_lecons.membre_id, session.user.id),
  });
  const completedLeconIds = new Set(userProgress.map(p => p.lecon_id));
  
  // A lesson is completed if its id is in completedLeconIds
  // A lesson is unlocked if it's the first one, or if ALL previous lessons are completed.
  const completedLecons = allLecons.filter(l => completedLeconIds.has(l.id)).length;
  const progressPercent = totalLecons === 0 ? 0 : Math.round((completedLecons / totalLecons) * 100);

  // Helper to check if a lesson is unlocked
  const isLessonUnlocked = (lessonIndex: number) => {
    if (lessonIndex === 0) return true;
    // Check if the immediately preceding lesson is completed
    const previousLesson = allLecons[lessonIndex - 1];
    return completedLeconIds.has(previousLesson.id);
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-background">
      {/* Top Navigation Bar */}
      <header className="flex-shrink-0 h-16 border-b border-[#14472a] flex items-center justify-between px-4 lg:px-8 bg-[#1b5e38] text-white z-10">
        <div className="flex items-center gap-4">
          <Link 
            href={`/formations/${formation.id}`} 
            className="p-2 -ml-2 rounded-full hover:bg-white/10 transition-colors flex items-center justify-center text-white/80 hover:text-white"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="sr-only">Retour à la formation</span>
          </Link>
          <div className="h-6 w-px bg-white/20 hidden sm:block"></div>
          <h1 className="font-urbanist font-semibold text-base sm:text-lg text-white line-clamp-1">
            {formation.titre}
          </h1>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-3 text-sm">
            <span className="text-white/80 font-medium">{progressPercent}% terminé</span>
            <div className="w-24 h-2 bg-[#0f351f] rounded-full overflow-hidden">
              <div 
                className="h-full bg-[#f99e1d] rounded-full transition-all duration-500 ease-in-out" 
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar Navigation */}
        <aside className="w-80 flex-shrink-0 border-r border-[#e8e8e4] bg-[#f8f8f6] hidden md:flex flex-col">
          <div className="p-5 border-b border-[#e8e8e4]">
            <h2 className="font-urbanist font-bold text-[11px] uppercase tracking-[0.1em] text-[#1b5e38]">Sommaire du cours</h2>
          </div>
          <div className="flex-1 overflow-y-auto">
            <div className="p-2 space-y-4">
              {formation.modules.map((mod, index) => (
                <div key={mod.id} className="space-y-1">
                  <div className="px-5 py-3 font-urbanist font-bold text-[13px] text-[#1a1a1a] uppercase tracking-wide">
                    Module {index + 1}: {mod.titre}
                  </div>
                  <div className="space-y-0.5">
                    {mod.lecons.map((lecon) => {
                      const globalIndex = allLecons.findIndex(l => l.id === lecon.id);
                      const isCompleted = completedLeconIds.has(lecon.id);
                      const isUnlocked = isLessonUnlocked(globalIndex);

                      return (
                        <div key={lecon.id}>
                          {isUnlocked ? (
                            <Link 
                              href={`/learn/${formation.id}/${lecon.id}`}
                              className="flex items-start gap-3 px-5 py-3 text-sm transition-colors group hover:bg-[#1b5e38]/5 text-[#4a4a4a] font-urbanist rounded-lg mx-2"
                            >
                              <div className="mt-0.5 flex-shrink-0">
                                {isCompleted ? (
                                  <CheckCircle2 className="w-6 h-6 text-[#50a853]" />
                                ) : (
                                  <div className="w-6 h-6 rounded-full border border-[#c0c0bc] flex items-center justify-center text-[11px] font-bold text-[#9a9a96] group-hover:border-[#1b5e38] group-hover:text-[#1b5e38] group-hover:bg-[#1b5e38]/10 transition-colors">
                                    {globalIndex + 1}
                                  </div>
                                )}
                              </div>
                              <span className="line-clamp-2 mt-0.5">{lecon.titre}</span>
                            </Link>
                          ) : (
                            <div className="flex items-start gap-3 px-5 py-3 text-sm opacity-50 cursor-not-allowed text-[#4a4a4a] font-urbanist rounded-lg mx-2">
                              <div className="mt-0.5 flex-shrink-0">
                                <div className="w-6 h-6 rounded-full border border-[#e8e8e4] bg-[#f0f0ee] flex items-center justify-center text-[#9a9a96]">
                                  <Lock className="w-3 h-3" />
                                </div>
                              </div>
                              <span className="line-clamp-2 mt-0.5">{lecon.titre}</span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto bg-background focus:outline-none" id="main-learning-area">
          {children}
        </main>
      </div>
    </div>
  );
}
