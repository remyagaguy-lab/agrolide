"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, XCircle, Loader2 } from "@/components/ui/icons";

type Question = { id: number; question: string; options: string[] };
type Detail = { id: number; choix: number; correctAnswer: number; juste: boolean; explanation: string };
type Resultat = { details: Detail[]; bonnes: number; total: number; pourcent: number; reussi: boolean; seuil: number; certificat: string | null };

const bouton = "inline-flex items-center justify-center bg-primary hover:bg-primary/90 text-on-primary font-urbanist font-bold text-body-md px-[28px] min-h-[48px] rounded-lg transition-colors disabled:bg-surface-container disabled:text-on-surface/38 disabled:cursor-not-allowed";

export function ExamenClient({ formationId, seuil }: { formationId: string; seuil: number }) {
  const router = useRouter();
  const api = `/api/formations/${formationId}/examen`;
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
      if (!res.ok) throw new Error(data?.error ?? "Erreur");
      setQuestions(data.questions);
      setChoix({});
      setResultat(null);
    } catch (e) {
      setErreur(e instanceof Error && e.message !== "Failed to fetch" ? e.message : "Impossible d’ouvrir l’examen. Réessayez.");
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
      if (!res.ok) throw new Error(data?.error ?? "Erreur");
      setResultat(data);
      window.scrollTo({ top: 0, behavior: "smooth" });
      router.refresh();
    } catch {
      setErreur("La correction n’a pas pu être faite. Vos réponses sont conservées : réessayez.");
    } finally {
      setEnvoi(false);
    }
  };

  if (resultat && questions) {
    return (
      <div className="space-y-6">
        <div className={`space-y-3 rounded-xl border p-8 text-center ${resultat.reussi ? "border-accent-leaf bg-success-container" : "border-outline-variant bg-surface-container-low"}`}>
          <h2 className="font-urbanist text-2xl font-bold">{resultat.reussi ? "Examen réussi" : "Seuil non atteint"}</h2>
          <p>Votre score : <strong>{resultat.bonnes} / {resultat.total}</strong> ({resultat.pourcent} %). Seuil : {resultat.seuil} %.</p>
          {resultat.reussi ? (
            resultat.certificat ? (
              <p className="font-bold text-primary">Votre certificat de réussite est disponible dans « Mon parcours ». N° {resultat.certificat}</p>
            ) : (
              <p className="font-bold text-primary">
                Examen réussi. Pour obtenir le certificat de réussite, il reste à faire valider votre business plan complet (livrable du module 6) : remettez-le dans « Livrables ». Le certificat vous sera délivré dès sa validation.
              </p>
            )
          ) : (
            <p className="text-on-surface-variant">Relisez les corrections ci-dessous : une nouvelle tentative tire de nouvelles questions.</p>
          )}
          <button className={bouton} onClick={() => { setQuestions(null); setResultat(null); }}>Retour</button>
        </div>
        <ol className="space-y-4">
          {resultat.details.map((d, n) => {
            const q = questions.find((x) => x.id === d.id);
            if (!q) return null;
            return (
              <li key={d.id} className="space-y-2 rounded-xl border border-outline-variant bg-surface-container-lowest p-5">
                <p className="flex gap-2 font-urbanist font-semibold">
                  {d.juste ? <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-primary" /> : <XCircle className="mt-0.5 size-5 shrink-0 text-error" />}
                  <span>{n + 1}. {q.question}</span>
                </p>
                {!d.juste && <p className="text-sm text-error">Votre réponse : {q.options[d.choix] ?? "—"}</p>}
                <p className="text-sm text-primary">Bonne réponse : {q.options[d.correctAnswer]}</p>
                {d.explanation && <p className="text-sm text-on-surface-variant">{d.explanation}</p>}
              </li>
            );
          })}
        </ol>
      </div>
    );
  }

  if (!questions) {
    return (
      <div className="space-y-3">
        <button className={bouton} onClick={ouvrir} disabled={envoi}>
          {envoi ? <Loader2 className="mr-2 size-4 animate-spin" /> : null}Commencer l’examen
        </button>
        {erreur && <p className="text-sm text-error">{erreur}</p>}
      </div>
    );
  }

  const repondues = questions.filter((q) => choix[q.id] !== undefined).length;
  return (
    <div className="space-y-8">
      <p className="sticky top-0 z-10 rounded-lg bg-surface-container-low px-4 py-2 text-sm font-semibold">
        {repondues} / {questions.length} réponses · seuil de réussite {seuil} %
      </p>
      {questions.map((q, n) => (
        <fieldset key={q.id} className="space-y-3 rounded-xl border border-outline-variant bg-surface-container-lowest p-5">
          <legend className="px-1 font-urbanist font-semibold">{n + 1}. {q.question}</legend>
          {q.options.map((o, i) => (
            <label key={i} className={`flex cursor-pointer items-start gap-3 rounded-lg border-2 p-3 ${choix[q.id] === i ? "border-accent-leaf bg-primary-container" : "border-outline-variant"}`}>
              <input type="radio" name={`q${q.id}`} className="mt-1" checked={choix[q.id] === i} onChange={() => setChoix({ ...choix, [q.id]: i })} />
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
