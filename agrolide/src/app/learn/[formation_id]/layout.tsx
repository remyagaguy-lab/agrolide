import { db } from "@/db";
import { formations, formation_modules, formation_lecons } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, BookOpen, CheckCircle } from "lucide-react";


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

  // Flatten lecons for easy progress calculation
  const allLecons = formation.modules.flatMap(m => m.lecons);
  const totalLecons = allLecons.length;
  // TODO: Fetch user progress from DB. For now, assume 0 for demo.
  const completedLecons = 0;
  const progressPercent = totalLecons === 0 ? 0 : Math.round((completedLecons / totalLecons) * 100);

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
                    {mod.lecons.map((lecon, lIndex) => {
                      // In a real app we'd check if it's the active path
                      // For the layout, we will use a client component for navigation highlighting if needed
                      // Or just let the page handle active state
                      return (
                        <Link 
                          key={lecon.id} 
                          href={`/learn/${formation.id}/${lecon.id}`}
                          className="flex items-start gap-3 px-5 py-3 text-sm transition-colors group hover:bg-[#1b5e38]/5 text-[#4a4a4a] font-urbanist rounded-lg mx-2"
                        >
                          <div className="mt-0.5 flex-shrink-0">
                            <div className="w-6 h-6 rounded-full border border-[#c0c0bc] flex items-center justify-center text-[11px] font-bold text-[#9a9a96] group-hover:border-[#1b5e38] group-hover:text-[#1b5e38] group-hover:bg-[#1b5e38]/10 transition-colors">
                              {lIndex + 1}
                            </div>
                          </div>
                          <span className="line-clamp-2 mt-0.5">{lecon.titre}</span>
                        </Link>
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
