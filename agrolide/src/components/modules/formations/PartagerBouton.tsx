"use client";

import { useState } from "react";
import { Check, Share2 } from "lucide-react";
import { Button } from "@/components/ui/Button";

/** Partage la formation : feuille de partage du système si elle existe, sinon copie du lien. */
export function PartagerBouton({ titre }: { titre: string }) {
  const [copie, setCopie] = useState(false);

  const partager = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: titre, url });
        return;
      }
      await navigator.clipboard.writeText(url);
      setCopie(true);
      window.setTimeout(() => setCopie(false), 2500);
    } catch {
      /* partage annulé : rien à faire */
    }
  };

  return (
    <Button type="button" variant="outline" fullWidth onClick={partager}>
      {copie ? <Check className="size-4" aria-hidden /> : <Share2 className="size-4" aria-hidden />}
      {copie ? "Lien copié" : "Partager cette formation"}
    </Button>
  );
}
