import { auth } from "@/auth";
import { formation_lecons, formation_modules, formations, progression_lecons } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { notFound, redirect } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Link from "next/link";
import { db } from "@/db";
import { ChevronLeft, ChevronRight, CheckCircle2, Lock } from "lucide-react";
import { Quiz } from "./Quiz";

export default async function LeconPage({
  params,
}: {
  params: Promise<{ formation_id: string; lecon_id: string }>;
}) {
  const { formation_id: formationId, lecon_id: leconId } = await params;

  const session = await auth();
  if (!session || !session.user || !session.user.id) {
    redirect("/login");
  }
  const userId = session.user.id;

  // Fetch the formation structure to determine previous/next
  const formation = await db.query.formations.findFirst({
    where: eq(formations.id, formationId),
    columns: { id: true },
    with: {
      modules: {
        columns: { id: true, titre: true, ordre: true },
        orderBy: (modules, { asc }) => [asc(modules.ordre)],
        with: {
          lecons: {
            columns: { id: true, titre: true, ordre: true, module_id: true },
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

  const previousLecon = currentIndex > 0 ? allLecons[currentIndex - 1] : null;
  const nextLecon = currentIndex < allLecons.length - 1 ? allLecons[currentIndex + 1] : null;

  // Check progression
  const userProgress = await db.query.progression_lecons.findMany({
    where: eq(progression_lecons.membre_id, userId),
  });
  const completedLeconIds = new Set(userProgress.map(p => p.lecon_id));
  
  // Verify if this lesson is unlocked
  const isUnlocked = currentIndex === 0 || completedLeconIds.has(allLecons[currentIndex - 1].id);
  
  if (!isUnlocked) {
    // Redirect to the first incomplete lesson
    const firstIncomplete = allLecons.find(l => !completedLeconIds.has(l.id));
    if (firstIncomplete) {
      redirect(`/learn/${formationId}/${firstIncomplete.id}`);
    } else {
      redirect(`/learn/${formationId}/${allLecons[0].id}`);
    }
  }

  const isCompleted = completedLeconIds.has(leconId);

  // Fetch the full lesson content individually to avoid D1 JSON payload limits
  const currentLeconFull = await db.query.formation_lecons.findFirst({
    where: eq(formation_lecons.id, leconId)
  });

  if (!currentLeconFull) {
    notFound();
  }

  // Check if there is a quiz
  let quizData = null;
  if (currentLeconFull.quiz_json) {
    try {
      quizData = JSON.parse(currentLeconFull.quiz_json as string);
    } catch (e) {
      console.error("Failed to parse quiz JSON", e);
    }
  }

  return (
    <div className="flex flex-col min-h-full bg-white">
      {/* Corporate Header for Reading Mode */}
      <section className="pt-12 md:pt-16 pb-12 bg-[#1b5e38]">
        <div className="container max-w-3xl mx-auto px-6">
          <div className="flex flex-col gap-4">
            <div>
              <span className="font-urbanist font-bold text-[11px] uppercase tracking-[0.1em] text-[#50a853] bg-[#0f351f] px-3 py-1 rounded-full">
                {formation.modules.find(m => m.id === currentLeconFull.module_id)?.titre}
              </span>
            </div>
            <h1 className="font-urbanist text-h2 md:text-h1 text-white leading-tight mt-2">
              {currentLeconFull.titre}
            </h1>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-3xl mx-auto px-6 py-10 md:py-16 bg-white">
        {/* Markdown Content */}
        <div className="prose prose-slate prose-lg max-w-none mb-16 prose-headings:font-urbanist prose-headings:text-[#1a1a1a] prose-p:font-baskerville prose-p:text-[#4a4a4a] prose-p:leading-[1.8] prose-li:font-baskerville prose-li:text-[#4a4a4a] prose-a:text-[#1b5e38] prose-strong:font-bold prose-strong:text-[#1a1a1a]">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {currentLeconFull.contenu}
          </ReactMarkdown>
        </div>

        {/* Quiz Section */}
        {quizData && quizData.length > 0 && (
          <div className="mt-16 pt-12 border-t border-[#e8e8e4]" id="quiz-section">
            <h2 className="font-urbanist text-h3 text-[#1a1a1a] mb-8">Vérifiez vos connaissances</h2>
            <Quiz 
              questions={quizData} 
              formationId={formationId}
              leconId={leconId}
              isCompleted={isCompleted}
            />
          </div>
        )}
      </main>

      {/* Bottom Navigation Bar */}
      <div className="bg-white border-t border-[#e8e8e4] py-6 sticky bottom-0 z-20">
        <div className="container max-w-3xl mx-auto px-6 flex items-center justify-between">
          {previousLecon ? (
            <Link 
              href={`/learn/${formationId}/${previousLecon.id}`}
              className="inline-flex items-center justify-center bg-transparent border-[1.5px] border-[#e8e8e4] hover:border-[#1b5e38] hover:text-[#1b5e38] hover:bg-[#f0f7f0] text-[#1a1a1a] font-urbanist font-[600] text-[15px] px-[28px] min-h-[48px] rounded-lg transition-all"
            >
              <ChevronLeft className="w-5 h-5 mr-2" />
              Précédent
            </Link>
          ) : (
            <div /> // Spacer
          )}
          
          {nextLecon ? (
            isCompleted || !quizData || quizData.length === 0 ? (
              <Link 
                href={`/learn/${formationId}/${nextLecon.id}`}
                className="inline-flex items-center justify-center bg-[#f99e1d] hover:bg-[#fcb726] text-white font-urbanist font-[700] text-[15px] px-[28px] min-h-[48px] rounded-lg transition-colors"
              >
                Suivant
                <ChevronRight className="w-5 h-5 ml-2" />
              </Link>
            ) : (
              <button 
                disabled
                className="inline-flex items-center justify-center bg-[#f0f0ee] text-[#9a9a96] font-urbanist font-[700] text-[15px] px-[28px] min-h-[48px] rounded-lg transition-colors cursor-not-allowed"
                title="Validez le quiz pour passer à la suite"
              >
                Suivant bloqué
                <Lock className="w-4 h-4 ml-2" />
              </button>
            )
          ) : (
            <Link 
              href={`/formations/${formationId}`}
              className="inline-flex items-center justify-center bg-[#1b5e38] hover:bg-[#145030] text-white font-urbanist font-[700] text-[15px] px-[28px] min-h-[48px] rounded-lg transition-colors"
            >
              <CheckCircle2 className="w-5 h-5 mr-2" />
              Terminer la formation
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
