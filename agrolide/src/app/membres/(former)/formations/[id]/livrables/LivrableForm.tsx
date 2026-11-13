"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function LivrableForm({ formationId, module, initial, statut, bloque }: { formationId: string; module: number; initial: string; statut: string | null; bloque: boolean }) {
  const router = useRouter();
  const [texte, setTexte] = useState(initial);
  const [msg, setMsg] = useState<string | null>(null);
  const [envoi, setEnvoi] = useState(false);

  const envoyer = async () => {
    setEnvoi(true);
    setMsg(null);
    try {
      const res = await fetch(`/api/formations/${formationId}/livrables`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ module, contenu: texte }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error ?? "Erreur");
      setMsg("Livrable enregistré.");
      router.refresh();
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "Échec de l’envoi.");
    } finally {
      setEnvoi(false);
    }
  };

  return (
    <div className="space-y-2">
      <textarea
        className="min-h-32 w-full rounded-lg border border-outline-variant bg-surface-container-lowest p-3"
        placeholder="Collez votre texte, ou le lien de votre fichier (Drive, OneDrive…)"
        value={texte}
        onChange={(e) => setTexte(e.target.value)}
        disabled={bloque}
      />
      <div className="flex items-center gap-3">
        <button onClick={envoyer} disabled={envoi || bloque || texte.trim().length < 20} className="rounded-lg bg-primary px-5 py-2 font-bold text-on-primary disabled:opacity-50">
          {statut ? "Remplacer ma remise" : "Remettre"}
        </button>
        {msg && <span className="text-sm">{msg}</span>}
      </div>
    </div>
  );
}
