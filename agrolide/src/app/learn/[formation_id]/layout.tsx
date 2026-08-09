import { db } from "@/db";
import { formations, formation_modules, formation_lecons } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, BookOpen, CheckCircle } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ThemeToggle } from "@/components/theme-toggle";

export default async function LearnLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { formation_id: string };
}) {
  const formationId = params.formation_id;

  const formation = await db.query.formations.findFirst({
    where: eq(formations.id, formationId),
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

  // Flatten lecons for easy progress calculation
  const allLecons = formation.modules.flatMap(m => m.lecons);
  const totalLecons = allLecons.length;
  // TODO: Fetch user progress from DB. For now, assume 0 for demo.
  const completedLecons = 0;
  const progressPercent = totalLecons === 0 ? 0 : Math.round((completedLecons / totalLecons) * 100);

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-background">
      {/* Top Navigation Bar */}
      <header className="flex-shrink-0 h-16 border-b flex items-center justify-between px-4 lg:px-8 bg-card z-10 shadow-sm">
        <div className="flex items-center gap-4">
          <Link 
            href={`/formations/${formation.id}`} 
            className="p-2 -ml-2 rounded-full hover:bg-muted transition-colors flex items-center justify-center text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="sr-only">Retour à la formation</span>
          </Link>
          <div className="h-6 w-px bg-border hidden sm:block"></div>
          <h1 className="font-semibold text-base sm:text-lg line-clamp-1">
            {formation.titre}
          </h1>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-3 text-sm">
            <span className="text-muted-foreground font-medium">{progressPercent}% terminé</span>
            <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary rounded-full transition-all duration-500 ease-in-out" 
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar Navigation */}
        <aside className="w-80 flex-shrink-0 border-r bg-card/50 hidden md:flex flex-col">
          <div className="p-4 border-b">
            <h2 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">Sommaire du cours</h2>
          </div>
          <ScrollArea className="flex-1">
            <div className="p-2 space-y-4">
              {formation.modules.map((mod, index) => (
                <div key={mod.id} className="space-y-1">
                  <div className="px-3 py-2 text-sm font-medium">
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
                          className="flex items-start gap-3 px-3 py-2 text-sm rounded-md hover:bg-muted transition-colors group text-muted-foreground hover:text-foreground"
                        >
                          <div className="mt-0.5 flex-shrink-0">
                            <div className="w-5 h-5 rounded-full border-2 flex items-center justify-center text-[10px] font-bold border-muted-foreground text-muted-foreground">
                              {lIndex + 1}
                            </div>
                          </div>
                          <span className="line-clamp-2">{lecon.titre}</span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto bg-background focus:outline-none" id="main-learning-area">
          {children}
        </main>
      </div>
    </div>
  );
}
