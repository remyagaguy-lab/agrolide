import { structureFormation, leconsTerminees } from "@/lib/formations/suivre.server";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";

import { auth } from "@/lib/auth/server";
import { ArrowLeft, CheckCircle2, ListOrdered, Lock } from "@/components/ui/icons"
/**
 * Lecteur de cours dans l'espace membre : le sommaire reste à côté de la leçon,
 * et le lien de retour ramène à la fiche de la formation, dans /membres.
 */
export default async function SuivreLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const { id: formationId } = await params;

  const { userId } = await auth();
  if (!userId) {
    redirect(`/login?next=${encodeURIComponent(`/membres/formations/${formationId}/suivre`)}`);
  }

  // Mêmes lectures que la page de la leçon : partagées (une seule fois par affichage).
  const [formation, userProgress] = await Promise.all([
    structureFormation(formationId),
    leconsTerminees(userId),
  ]);

  if (!formation) {
    notFound();
  }

  const allLecons = formation.modules.flatMap((m) => m.lecons);
  const totalLecons = allLecons.length;
  const completedLeconIds = new Set(userProgress.map((p) => p.lecon_id));
  const completedLecons = allLecons.filter((l) => completedLeconIds.has(l.id)).length;
  const progressPercent = totalLecons === 0 ? 0 : Math.round((completedLecons / totalLecons) * 100);

  // Une leçon est ouverte si c'est la première ou si la précédente est validée.
  const isLessonUnlocked = (lessonIndex: number) => lessonIndex === 0 || completedLeconIds.has(allLecons[lessonIndex - 1].id);

  const sommaire = (
    <div className="space-y-4 p-2">
      {formation.modules.map((mod, index) => (
        <div key={mod.id} className="space-y-1">
          <div className="px-3 py-2 font-urbanist text-xs font-bold uppercase tracking-wide text-on-surface">
            Module {index + 1} : {mod.titre}
          </div>
          <ul className="space-y-0.5">
            {mod.lecons.map((lecon) => {
              const globalIndex = allLecons.findIndex((l) => l.id === lecon.id);
              const isCompleted = completedLeconIds.has(lecon.id);
              const isUnlocked = isLessonUnlocked(globalIndex);
              return (
                <li key={lecon.id}>
                  {isUnlocked ? (
                    <Link
                      href={`/membres/formations/${formation.id}/suivre/${lecon.id}`}
                      className="ag-state group flex min-h-11 items-start gap-3 rounded-control px-3 py-2 text-sm text-on-surface-variant hover:bg-primary/5"
                    >
                      <span className="mt-0.5 shrink-0">
                        {isCompleted ? (
                          <CheckCircle2 className="size-6 text-primary" aria-label="Leçon validée" />
                        ) : (
                          <span className="flex size-6 items-center justify-center rounded-full border border-outline text-label-sm font-bold text-on-surface-muted group-hover:border-primary group-hover:text-primary">
                            {globalIndex + 1}
                          </span>
                        )}
                      </span>
                      <span className="mt-0.5 line-clamp-2">{lecon.titre}</span>
                    </Link>
                  ) : (
                    <div className="flex min-h-11 cursor-not-allowed items-start gap-3 rounded-control px-3 py-2 text-sm text-on-surface-variant opacity-50" aria-disabled="true">
                      <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full border border-outline-variant bg-surface-container text-on-surface-muted">
                        <Lock className="size-4" aria-label="Leçon verrouillée" />
                      </span>
                      <span className="mt-0.5 line-clamp-2">{lecon.titre}</span>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </div>
  );

  return (
    <div className="space-y-4">
      <header className="flex flex-wrap items-center justify-between gap-3 rounded-card bg-surface-brand px-4 py-3 text-on-surface-brand">
        <div className="flex min-w-0 items-center gap-3">
          <Link
            href={`/membres/formations/${formation.id}`}
            className="ag-state -ml-2 flex size-11 shrink-0 items-center justify-center rounded-full text-on-surface-brand/90 hover:bg-on-surface-brand/10"
          >
            <ArrowLeft className="size-5" aria-hidden="true" />
            <span className="sr-only">Retour à la formation</span>
          </Link>
          <h1 className="line-clamp-1 font-urbanist text-base font-semibold sm:text-lg">{formation.titre}</h1>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <span className="font-medium text-on-surface-brand/90">{progressPercent} % terminé</span>
          <div
            role="progressbar"
            aria-label="Progression dans la formation"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={progressPercent}
            className="h-2 w-24 overflow-hidden rounded-full bg-on-surface-brand/15"
          >
            <div className="h-full rounded-full bg-tertiary transition-all duration-500 ease-in-out" style={{ width: `${progressPercent}%` }} />
          </div>
        </div>
      </header>

      <details className="rounded-card border border-outline-variant bg-surface-container-low lg:hidden">
        <summary className="flex min-h-12 cursor-pointer list-none items-center gap-2 px-4 text-label-lg text-primary [&::-webkit-details-marker]:hidden">
          <ListOrdered className="size-4" aria-hidden="true" /> Sommaire du cours
        </summary>
        <div className="border-t border-outline-variant">{sommaire}</div>
      </details>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[320px_minmax(0,1fr)] lg:items-start">
        <aside aria-label="Sommaire du cours" className="hidden rounded-card border border-outline-variant bg-surface-container-low lg:block">
          <h2 className="border-b border-outline-variant p-4 font-urbanist text-label-sm font-bold uppercase tracking-[0.1em] text-primary">Sommaire du cours</h2>
          {sommaire}
        </aside>
        <div className="min-w-0 overflow-hidden rounded-card border border-outline-variant">{children}</div>
      </div>
    </div>
  );
}
