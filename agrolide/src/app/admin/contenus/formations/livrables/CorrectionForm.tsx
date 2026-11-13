"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function CorrectionForm({ id, noteInitiale, commentaireInitial }: { id: string; noteInitiale: number | null; commentaireInitial: string }) {
  const router = useRouter();
  const [note, setNote] = useState(noteInitiale != null ? String(noteInitiale) : "");
  const [commentaire, setCommentaire] = useState(commentaireInitial);
  const [msg, setMsg] = useState<string | null>(null);
  const [envoi, setEnvoi] = useState(false);

  const envoyer = async (decision: "valide" | "a_revoir") => {
    setEnvoi(true);
    setMsg(null);
    try {
      const res = await fetch(`/api/admin/livrables/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ decision, note: Number(note), commentaire }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error ?? "Erreur");
      router.refresh();
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "Échec");
    } finally {
      setEnvoi(false);
    }
  };

  return (
    <div className="mt-3 space-y-2">
      <div className="flex flex-wrap items-center gap-3">
        <label className="text-sm">Note /20{" "}
          <input type="number" min={0} max={20} value={note} onChange={(e) => setNote(e.target.value)} className="ml-1 w-20 rounded border border-outline-variant px-2 py-1" />
        </label>
      </div>
      <textarea value={commentaire} onChange={(e) => setCommentaire(e.target.value)} placeholder="Commentaire pour le membre (obligatoire si « à revoir »)" className="min-h-20 w-full rounded border border-outline-variant p-2 text-sm" />
      <div className="flex flex-wrap items-center gap-3">
        <button disabled={envoi || note === ""} onClick={() => envoyer("valide")} className="rounded-lg bg-primary px-4 py-2 text-sm font-bold text-on-primary disabled:opacity-50">Valider</button>
        <button disabled={envoi || note === ""} onClick={() => envoyer("a_revoir")} className="rounded-lg border border-outline-variant px-4 py-2 text-sm font-bold disabled:opacity-50">À revoir</button>
        {msg && <span className="text-sm text-error">{msg}</span>}
      </div>
    </div>
  );
}
