"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, XCircle, ChevronRight, Loader2 } from "@/components/ui/icons"

const cn = (...classes: (string | undefined | null | false)[]) => classes.filter(Boolean).join(" ");

/** Question envoyée par le serveur : jamais de bonne réponse ni d'explication à ce stade. */
type Question = { id: number; question: string; options: string[] };

type Detail = { id: number; choix: number; correctAnswer: number; juste: boolean; explanation: string };
type Resultat = { details: Detail[]; bonnes: number; total: number; pourcent: number; reussi: boolean; seuil: number };

const boutonPrimaire = "inline-flex items-center justify-center bg-primary hover:bg-primary/90 text-on-primary font-urbanist font-bold text-body-md px-[28px] min-h-[48px] rounded-lg transition-colors disabled:bg-surface-container disabled:text-on-surface/38 disabled:cursor-not-allowed";
const boutonSecondaire = "inline-flex items-center justify-center bg-transparent border-[1.5px] border-outline-variant hover:border-primary hover:bg-primary-container text-on-surface font-urbanist font-semibold text-body-md px-[28px] min-h-[48px] rounded-lg transition-all";

export function Quiz({
  questions: questionsInitiales,
  seuil,
  formationId,
  leconId,
  isCompleted,
}: {
  questions: Question[];
  seuil: number;
  formationId: string;
  leconId: string;
  isCompleted: boolean;
}) {
  const router = useRouter();
  const base = `/api/formations/${formationId}/lecons/${leconId}`;
  const [questions, setQuestions] = useState(questionsInitiales);
  const [index, setIndex] = useState(0);
  const [choix, setChoix] = useState<Record<number, number>>({});
  const [resultat, setResultat] = useState<Resultat | null>(null);
  const [envoi, setEnvoi] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);

  const question = questions[index];
  const derniere = index === questions.length - 1;
  const choisi = choix[question?.id];

  const envoyer = async () => {
    setEnvoi(true);
    setErreur(null);
    try {
      const res = await fetch(`${base}/quiz`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reponses: questions.map((q) => ({ id: q.id, choix: choix[q.id] })) }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error ?? "Erreur");
      setResultat(data);
      if (data.reussi) router.refresh();
    } catch {
      setErreur("La correction n’a pas pu être faite. Vérifiez votre connexion et réessayez.");
    } finally {
      setEnvoi(false);
    }
  };

  const recommencer = async () => {
    setEnvoi(true);
    setErreur(null);
    try {
      const res = await fetch(`${base}/quiz`);
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error ?? "Erreur");
      setQuestions(data.questions);
      setChoix({});
      setIndex(0);
      setResultat(null);
    } catch {
      setErreur("Impossible de charger une nouvelle tentative. Réessayez.");
    } finally {
      setEnvoi(false);
    }
  };

  if (resultat) {
    return (
      <div className="space-y-6">
        <div className={cn("p-8 rounded-xl text-center space-y-3 border", resultat.reussi ? "bg-success-container border-accent-leaf" : "bg-surface-container-low border-outline-variant")}>
          <h3 className="text-2xl font-bold font-urbanist">
            {resultat.reussi ? "Leçon validée" : "Seuil non atteint"}
          </h3>
          <p className="text-on-surface">
            Votre score : <strong>{resultat.bonnes} / {resultat.total}</strong> ({resultat.pourcent} %). Seuil de réussite : {resultat.seuil} %.
          </p>
          {resultat.reussi ? (
            <p className="text-primary font-urbanist font-bold flex items-center justify-center">
              <CheckCircle2 className="size-5 mr-2" /> Vous pouvez passer à la leçon suivante.
            </p>
          ) : (
            <p className="text-on-surface-variant">
              Relisez la leçon avec les corrections ci-dessous, puis recommencez : de nouvelles questions peuvent être tirées, et le nombre de tentatives est illimité.
            </p>
          )}
          {!resultat.reussi && (
            <button onClick={recommencer} disabled={envoi} className={boutonPrimaire}>
              {envoi ? <Loader2 className="size-4 mr-2 animate-spin" /> : null}
              Recommencer le quiz
            </button>
          )}
          {resultat.reussi && (
            <button onClick={recommencer} disabled={envoi} className={boutonSecondaire}>
              Refaire le quiz pour s’entraîner
            </button>
          )}
          {erreur && <p className="text-error text-sm">{erreur}</p>}
        </div>

        <ol className="space-y-4">
          {resultat.details.map((d, n) => {
            const q = questions.find((x) => x.id === d.id);
            if (!q) return null;
            return (
              <li key={d.id} className="border border-outline-variant rounded-xl p-5 bg-surface-container-lowest space-y-2">
                <p className="font-urbanist font-semibold text-on-surface flex gap-2">
                  {d.juste ? <CheckCircle2 className="size-5 shrink-0 text-primary mt-0.5" /> : <XCircle className="size-5 shrink-0 text-error mt-0.5" />}
                  <span>{n + 1}. {q.question}</span>
                </p>
                {!d.juste && (
                  <p className="text-sm text-error">Votre réponse : {q.options[d.choix] ?? "—"}</p>
                )}
                <p className="text-sm text-primary">Bonne réponse : {q.options[d.correctAnswer]}</p>
                {d.explanation && <p className="text-sm text-on-surface-variant">{d.explanation}</p>}
              </li>
            );
          })}
        </ol>
      </div>
    );
  }

  return (
    <div className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden shadow-none">
      <div className="bg-surface-container-low p-5 border-b border-outline-variant flex justify-between items-center text-sm font-urbanist font-semibold text-on-surface-variant uppercase tracking-wide">
        <span>Question {index + 1} sur {questions.length}</span>
        <span className="text-primary normal-case">Seuil de réussite : {seuil} %{isCompleted ? " · déjà validée" : ""}</span>
      </div>

      <div className="p-8 md:p-10 space-y-8">
        <h3 className="text-xl font-urbanist font-semibold text-on-surface">{question.question}</h3>

        <div className="space-y-3">
          {question.options.map((option, i) => {
            const isSelected = choisi === i;
            return (
              <button
                key={i}
                className={cn(
                  "w-full justify-start text-left h-auto whitespace-normal py-4 px-6 text-base border-2 font-urbanist rounded-xl transition-all",
                  isSelected ? "border-accent-leaf bg-primary-container" : "border-outline-variant hover:border-primary hover:bg-surface-container-low bg-surface-container-lowest",
                )}
                onClick={() => setChoix({ ...choix, [question.id]: i })}
              >
                <div className="flex items-center gap-4 w-full">
                  <div className={cn(
                    "flex-shrink-0 w-7 h-7 rounded-full border-2 flex items-center justify-center transition-colors",
                    isSelected ? "border-accent-leaf bg-accent-leaf text-on-accent" : "border-outline text-on-surface-muted",
                  )}>
                    <span className="text-xs font-bold">{String.fromCharCode(65 + i)}</span>
                  </div>
                  <span className="flex-1 font-medium">{option}</span>
                </div>
              </button>
            );
          })}
        </div>

        {erreur && <p className="text-error text-sm">{erreur}</p>}

        <div className="pt-6 flex justify-between border-t border-outline-variant mt-10">
          <button onClick={() => setIndex(index - 1)} disabled={index === 0 || envoi} className={cn(boutonSecondaire, index === 0 && "invisible")}>
            Précédente
          </button>
          {derniere ? (
            <button
              onClick={envoyer}
              disabled={envoi || questions.some((q) => choix[q.id] === undefined)}
              className={boutonPrimaire}
              title={questions.some((q) => choix[q.id] === undefined) ? "Répondez à toutes les questions" : undefined}
            >
              {envoi ? <Loader2 className="size-4 mr-2 animate-spin" /> : null}
              Envoyer mes réponses
            </button>
          ) : (
            <button onClick={() => setIndex(index + 1)} disabled={choisi === undefined} className={boutonPrimaire}>
              Question suivante <ChevronRight className="ml-2 size-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/** Leçon sans quiz : validation par un simple bouton (route /complete, refusée côté serveur si la leçon a un quiz). */
export function ValiderLecon({ formationId, leconId, isCompleted }: { formationId: string; leconId: string; isCompleted: boolean }) {
  const router = useRouter();
  const [envoi, setEnvoi] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);

  if (isCompleted) {
    return (
      <p className="text-primary font-urbanist font-bold flex items-center">
        <CheckCircle2 className="size-5 mr-2" /> Leçon validée.
      </p>
    );
  }

  const valider = async () => {
    setEnvoi(true);
    setErreur(null);
    try {
      const res = await fetch(`/api/formations/${formationId}/lecons/${leconId}/complete`, { method: "POST" });
      if (!res.ok) throw new Error();
      router.refresh();
    } catch {
      setErreur("La validation a échoué. Réessayez.");
    } finally {
      setEnvoi(false);
    }
  };

  return (
    <div className="space-y-3">
      <button onClick={valider} disabled={envoi} className={boutonPrimaire}>
        {envoi ? <Loader2 className="size-4 mr-2 animate-spin" /> : <CheckCircle2 className="size-5 mr-2" />}
        J’ai terminé cette leçon
      </button>
      {erreur && <p className="text-error text-sm">{erreur}</p>}
    </div>
  );
}
