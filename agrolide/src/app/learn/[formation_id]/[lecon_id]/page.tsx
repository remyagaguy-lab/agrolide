import { db } from "@/db";
import { formation_lecons, formation_modules, formations } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Link from "next/link";
import { ChevronLeft, ChevronRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Quiz } from "./Quiz";

export default async function LeconPage({
  params,
}: {
  params: { formation_id: string; lecon_id: string };
}) {
  const formationId = params.formation_id;
  const leconId = params.lecon_id;

  // Fetch the current lesson and the whole formation structure to determine previous/next
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

  // Flatten the lessons to easily find previous and next
  const allLecons = formation.modules.flatMap((m) => m.lecons);
  const currentIndex = allLecons.findIndex((l) => l.id === leconId);

  if (currentIndex === -1) {
    notFound();
  }

  const currentLecon = allLecons[currentIndex];
  const previousLecon = currentIndex > 0 ? allLecons[currentIndex - 1] : null;
  const nextLecon = currentIndex < allLecons.length - 1 ? allLecons[currentIndex + 1] : null;

  // Check if there is a quiz
  let quizData = null;
  if (currentLecon.quiz_json) {
    try {
      quizData = JSON.parse(currentLecon.quiz_json as string);
    } catch (e) {
      console.error("Failed to parse quiz JSON", e);
    }
  }

  return (
    <div className="flex flex-col min-h-full">
      <div className="flex-1 w-full max-w-4xl mx-auto p-6 md:p-10 lg:p-12">
        {/* Module Title */}
        <div className="text-sm font-medium text-primary mb-2">
          {formation.modules.find(m => m.id === currentLecon.module_id)?.titre}
        </div>
        
        {/* Lesson Title */}
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-8">
          {currentLecon.titre}
        </h1>

        {/* Markdown Content */}
        <div className="prose prose-slate dark:prose-invert prose-lg max-w-none mb-12">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {currentLecon.contenu}
          </ReactMarkdown>
        </div>

        {/* Quiz Section */}
        {quizData && quizData.length > 0 && (
          <div className="mt-12 pt-8 border-t">
            <h2 className="text-2xl font-semibold mb-6">Vérifiez vos connaissances</h2>
            <Quiz questions={quizData} />
          </div>
        )}
      </div>

      {/* Bottom Navigation Bar */}
      <div className="bg-card border-t p-4 mt-auto">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          {previousLecon ? (
            <Button variant="outline" asChild>
              <Link href={`/learn/${formationId}/${previousLecon.id}`}>
                <ChevronLeft className="mr-2 h-4 w-4" />
                Précédent
              </Link>
            </Button>
          ) : (
            <div></div> // Empty div to keep 'Suivant' on the right
          )}

          {nextLecon ? (
            <Button asChild>
              <Link href={`/learn/${formationId}/${nextLecon.id}`}>
                Suivant
                <ChevronRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          ) : (
            <Button variant="default" className="bg-green-600 hover:bg-green-700">
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Terminer la formation
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
