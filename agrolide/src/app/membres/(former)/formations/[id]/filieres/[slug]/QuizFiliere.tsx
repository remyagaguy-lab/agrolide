"use client";

import { useState } from "react";
import { CheckCircle2, XCircle, Loader2 } from "@/components/ui/icons";

type Question = { id: number; question: string; options: string[] };
type Detail = { id: number; choix: number; correctAnswer: number; juste: boolean; explanation: string };
type Resultat = { details: Detail[]; bonnes: number; total: number; pourcent: number; reussi: boolean; seuil: number };

const bouton = "inline-flex items-center justify-center bg-primary hover:bg-primary/90 text-on-primary font-urbanist font-bold px-6 min-h-[44px] rounded-lg disabled:bg-surface-container disabled:text-on-surface/38 disabled:cursor-not-allowed";

/** Auto-évaluation d'une leçon de module par filière : corrigée côté serveur, non enregistrée. */
export function QuizFiliere({ formationId, slug, leconId }: { formationId: string; slug: string; leconId: string }) {
  const api = `/api/formations/${formationId}/filieres/${slug}/${leconId}/quiz`;
  const [questions, setQuestions] = useState<Question[] | null>(null);
  const [choix, setChoix] = useState<Record<number, number>>({});
  const [resultat, setResultat] = useState<Resultat | null>(null);
  const [envoi, setEnvoi] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);

  const ouvrir = async () => {
    setEnvoi(true);
    setErreur(null);
    try {
      const res = await fetch(api);
      const data = await res.json();
      if (!res.ok) throw new Error();
      setQuestions(data.questions);
      setChoix({});
      setResultat(null);
    } catch {
      setErreur("Impossible de charger le quiz. Réessayez.");
    } finally {
      setEnvoi(false);
    }
  };

  const envoyer = async () => {
    if (!questions) return;
    setEnvoi(true);
    setErreur(null);
    try {
      const res = await fetch(api, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reponses: questions.map((q) => ({ id: q.id, choix: choix[q.id] })) }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error();
      setResultat(data);
    } catch {
      setErreur("La correction n’a pas pu être faite. Réessayez.");
    } finally {
      setEnvoi(false);
    }
  };

  if (!questions) {
    return (
      <div className="mt-6 space-y-2 rounded-xl border border-outline-variant p-5">
        <p className="font-urbanist font-semibold">Auto-évaluation</p>
        <p className="text-sm text-on-surface-variant">4 questions tirées au hasard. Elles ne comptent ni dans votre progression ni dans votre certificat.</p>
        <button className={bouton} onClick={ouvrir} disabled={envoi}>
          {envoi ? <Loader2 className="mr-2 size-4 animate-spin" /> : null}Tester mes connaissances
        </button>
        {erreur && <p className="text-sm text-error">{erreur}</p>}
      </div>
    );
  }

  if (resultat) {
    return (
      <div className="mt-6 space-y-4 rounded-xl border border-outline-variant p-5">
        <p className="font-urbanist text-lg font-bold">
          Score : {resultat.bonnes} / {resultat.total} ({resultat.pourcent} %) {resultat.reussi ? "· bravo" : "· relisez la leçon et réessayez"}
        </p>
        <ol className="space-y-3">
          {resultat.details.map((d, n) => {
            const q = questions.find((x) => x.id === d.id);
            if (!q) return null;
            return (
              <li key={d.id} className="space-y-1 text-sm">
                <p className="flex gap-2 font-semibold">
                  {d.juste ? <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" /> : <XCircle className="mt-0.5 size-4 shrink-0 text-error" />}
                  <span>{n + 1}. {q.question}</span>
                </p>
                {!d.juste && <p className="text-error">Votre réponse : {q.options[d.choix] ?? "Aucune réponse"}</p>}
                <p className="text-primary">Bonne réponse : {q.options[d.correctAnswer]}</p>
                {d.explanation && <p className="text-on-surface-variant">{d.explanation}</p>}
              </li>
            );
          })}
        </ol>
        <button className={bouton} onClick={ouvrir} disabled={envoi}>Refaire avec de nouvelles questions</button>
      </div>
    );
  }

  const repondues = questions.filter((q) => choix[q.id] !== undefined).length;
  return (
    <div className="mt-6 space-y-5 rounded-xl border border-outline-variant p-5">
      {questions.map((q, n) => (
        <fieldset key={q.id} className="space-y-2">
          <legend className="font-urbanist font-semibold">{n + 1}. {q.question}</legend>
          {q.options.map((o, i) => (
            <label key={i} className={`flex cursor-pointer items-start gap-3 rounded-lg border-2 p-3 text-sm ${choix[q.id] === i ? "border-accent-leaf bg-primary-container" : "border-outline-variant"}`}>
              <input type="radio" name={`${leconId}-${q.id}`} className="mt-1" checked={choix[q.id] === i} onChange={() => setChoix({ ...choix, [q.id]: i })} />
              <span><strong>{String.fromCharCode(65 + i)}.</strong> {o}</span>
            </label>
          ))}
        </fieldset>
      ))}
      {erreur && <p className="text-sm text-error">{erreur}</p>}
      <button className={bouton} onClick={envoyer} disabled={envoi || repondues < questions.length}>
        {envoi ? <Loader2 className="mr-2 size-4 animate-spin" /> : null}Envoyer mes réponses
      </button>
    </div>
  );
}
