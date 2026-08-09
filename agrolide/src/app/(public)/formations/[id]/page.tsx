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
  params: { id: string };
}) {
  const formation = await db.query.formations.findFirst({
    where: eq(formations.id, params.id),
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

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-muted/30 pt-16 md:pt-24 pb-16 md:pb-20 border-b">
        <div className="container px-4 md:px-6 relative z-10">
          <div className="flex flex-col lg:flex-row gap-12 items-start">
            <div className="flex-1 space-y-6 max-w-3xl">
              <div className="flex items-center gap-3">
                <Badge variant="category" className="px-3 py-1 bg-primary/10 text-primary hover:bg-primary/20">
                  {formation.modalite || "En ligne"}
                </Badge>
                {formation.statut === 'publié' && (
                  <Badge variant="nouveau" className="text-green-600 border-green-200 bg-green-50">Nouveau</Badge>
                )}
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground">
                {formation.titre}
              </h1>
              
              <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl">
                {formation.description}
              </p>
              
              <div className="flex flex-wrap items-center gap-6 pt-4 text-sm font-medium text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-primary" />
                  <span>Environ {totalDuree} min</span>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-primary" />
                  <span>{totalModules} Modules</span>
                </div>
                <div className="flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-primary" />
                  <span>{totalLecons} Leçons</span>
                </div>
              </div>

              <div className="pt-6 flex flex-col sm:flex-row gap-4">
                <Button variant="primary" className="h-14 px-8 text-lg w-full sm:w-auto" href={`/learn/${formation.id}`}>
                  Commencer la formation
                </Button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Background Decorative Pattern */}
        <div className="absolute right-0 top-0 -translate-y-12 translate-x-1/3 opacity-[0.03] pointer-events-none z-0">
          <svg width="600" height="600" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <path fill="#000000" d="M45.7,-76.4C58.9,-69.3,69.2,-55.8,76.5,-41.2C83.7,-26.6,87.9,-11.1,86.5,4C85.1,19.2,78.2,33.9,69.5,47.3C60.8,60.6,50.3,72.6,36.5,79.5C22.7,86.4,5.6,88.1,-9.6,84.6C-24.8,81,-38.1,72.1,-50.1,61.1C-62.1,50.1,-72.7,36.9,-79.8,21.5C-86.9,6.1,-90.4,-11.5,-85.4,-26.7C-80.4,-41.9,-66.8,-54.6,-52.3,-61.2C-37.8,-67.7,-22.4,-68.2,-6.1,-61C10.2,-53.8,20.4,-38.9,32.6,-83.4Z" transform="translate(100 100)" />
          </svg>
        </div>
      </section>

      {/* Course Content Section */}
      <section className="py-16 md:py-24 container px-4 md:px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold tracking-tight mb-8">Programme de la formation</h2>
          
          <div className="space-y-6">
            {formation.modules.map((mod, index) => (
              <div key={mod.id} className="bg-card border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-primary font-bold text-lg">{index + 1}</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold">{mod.titre}</h3>
                      <p className="text-muted-foreground">{mod.description}</p>
                    </div>
                  </div>
                  
                  <div className="pl-16 space-y-3 pt-4 border-t mt-4">
                    {mod.lecons.map((lecon) => (
                      <div key={lecon.id} className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-medium text-foreground">{lecon.titre}</p>
                          <p className="text-sm text-muted-foreground">{lecon.duree_minutes} min</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
