"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, ExternalLink, CheckCircle2, Lock } from "@/components/ui/icons"
export function EnrollButton({ 
  formationId, 
  firstLeconId, 
  isEnrolled,
  isLoggedIn,
  isExternal = false,
  lienExterne = "",
  className = "",
  mode = "public"
}: { 
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
  const [code, setCode] = useState("");
  const [erreur, setErreur] = useState("");
  const [confirme, setConfirme] = useState(false);

  const btn = `inline-flex items-center justify-center bg-tertiary hover:bg-accent-sun text-on-tertiary font-heading font-bold text-body-md px-[28px] py-[12px] rounded-lg transition-colors min-h-[48px] disabled:opacity-70 ${className || ""}`;

  // Formation Agrolide : l'inscription passe par un code d'accès (challenge), puis une confirmation, puis le cours.
  const inscrireAvecCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setErreur("");
    setLoading(true);
    try {
      const res = await fetch(`/api/formations/${formationId}/enroll`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
      if (res.ok) {
        setConfirme(true);
      } else {
        const corps = (await res.json().catch(() => ({}))) as { error?: string };
        setErreur(corps.error || "Inscription impossible pour le moment. Réessayez dans un instant.");
      }
    } catch {
      setErreur("Connexion impossible. Vérifiez votre réseau et réessayez.");
    } finally {
      setLoading(false);
    }
  };

  if (!isExternal && isLoggedIn && confirme) {
    return (
      <div className="space-y-4" role="status">
        <p className="flex items-start gap-3 text-body-md font-bold text-on-surface">
          <CheckCircle2 className="mt-0.5 size-6 shrink-0 text-primary" aria-hidden />
          Inscription confirmée. Bienvenue dans la formation !
        </p>
        <button
          onClick={() => { if (firstLeconId) router.push(lecteur(firstLeconId)); else router.refresh(); }}
          className={btn}
        >
          Commencer la formation
        </button>
      </div>
    );
  }

  if (!isExternal && isLoggedIn && !isEnrolled) {
    return (
      <form onSubmit={inscrireAvecCode} className="space-y-3" noValidate>
        <label htmlFor={`code-${formationId}`} className="flex items-center gap-2 text-label-lg font-bold text-on-surface">
          <Lock className="size-4 text-on-surface-variant" aria-hidden />
          Code d&apos;accès
        </label>
        <input
          id={`code-${formationId}`}
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          placeholder="AGRO-XXXX-XXXX"
          autoComplete="off"
          autoCapitalize="characters"
          spellCheck={false}
          aria-invalid={!!erreur}
          aria-describedby={`aide-${formationId}`}
          className="min-h-12 w-full rounded-lg border border-outline bg-surface-container-lowest px-4 font-mono text-body-md tracking-wider text-on-surface placeholder:text-on-surface-variant focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
        />
        {erreur ? <p role="alert" className="text-body-sm text-error">{erreur}</p> : null}
        <p id={`aide-${formationId}`} className="text-body-sm text-on-surface-variant">
          L&apos;accès à cette formation se fait sur invitation : le code est remis aux participants sélectionnés lors des challenges Agrolide.
        </p>
        <button type="submit" disabled={loading || code.trim().length < 6} className={btn}>
          {loading && <Loader2 className="size-4 mr-2 animate-spin" />}
          {loading ? "Vérification du code…" : "S'inscrire à la formation"}
        </button>
      </form>
    );
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

