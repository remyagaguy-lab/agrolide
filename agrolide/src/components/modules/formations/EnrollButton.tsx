"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, ExternalLink } from "@/components/ui/icons"
import { ParcoursInscription } from "./ParcoursInscription"
export function EnrollButton({ 
  formationId, 
  firstLeconId, 
  isEnrolled,
  isLoggedIn,
  isExternal = false,
  lienExterne = "",
  className = "",
  mode = "public",
  titre = "",
  resume = ""
}: {
  /** Formation Agrolide : titre et résumé affichés dans le parcours d'inscription. */
  titre?: string;
  resume?: string; 
  formationId: string; 
  firstLeconId?: string;
  isEnrolled: boolean;
  isLoggedIn: boolean;
  isExternal?: boolean;
  lienExterne?: string;
  className?: string;
  /** « membre » : le lecteur s'ouvre dans l'espace membre ; « public » : le visiteur doit d'abord se connecter. */
  mode?: "membre" | "public";
}) {
  const router = useRouter();
  const lecteur = (leconId: string) => `/membres/formations/${formationId}/suivre/${leconId}`;
  const [loading, setLoading] = useState(false);

  const btn = `inline-flex items-center justify-center bg-tertiary hover:bg-accent-sun text-on-tertiary font-heading font-bold text-body-md px-[28px] py-[12px] rounded-lg transition-colors min-h-[48px] disabled:opacity-70 ${className || ""}`;

  // Formation Agrolide : parcours en étapes (conditions, code d'accès, confirmation, accès).
  if (!isExternal && isLoggedIn && !isEnrolled) {
    return <ParcoursInscription formationId={formationId} titre={titre} resume={resume} firstLeconId={firstLeconId} />;
  }

  const handleEnroll = async () => {
    if (!isLoggedIn) {
      router.push(`/login?next=${encodeURIComponent(`/formations/${formationId}`)}`);
      return;
    }

    if (isEnrolled) {
      if (isExternal && lienExterne) {
        // Ouverture immédiate (sinon le navigateur bloque la fenêtre) ; le premier accès est enregistré en parallèle.
        window.open(lienExterne, "_blank", "noopener,noreferrer");
        fetch(`/api/formations/${formationId}/acces`, { method: "POST", keepalive: true })
          .then(() => router.refresh())
          .catch(() => {});
      } else if (firstLeconId) {
        router.push(lecteur(firstLeconId));
      }
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/formations/${formationId}/enroll`, {
        method: "POST",
      });
      if (res.ok) {
        if (isExternal) {
          // Formation externe : l'inscription Agrolide d'abord ; le bouton devient « Accéder au cours ».
          router.refresh();
        } else if (firstLeconId) {
          router.push(lecteur(firstLeconId));
          router.refresh();
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button 
      onClick={handleEnroll}
      disabled={loading}
      className={btn}
    >
      {loading && <Loader2 className="size-4 mr-2 animate-spin" />}
      {!isLoggedIn 
        ? (isExternal ? "Se connecter pour s'inscrire" : "Se connecter pour commencer")
        : isEnrolled 
          ? (isExternal ? "Accéder au cours" : "Reprendre la formation")
          : (isExternal ? "S'inscrire au cours" : "S'inscrire et commencer")}
      
      {isExternal && isEnrolled && <ExternalLink className="ml-2 size-5 inline" />}
    </button>
  );
}

