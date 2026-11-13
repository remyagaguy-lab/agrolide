"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, CheckCircle2, Lock } from "@/components/ui/icons";

const ETAPES = ["Conditions", "Code", "Confirmation", "Accès"] as const;

const principal =
  "inline-flex w-full items-center justify-center rounded-lg bg-tertiary px-[28px] py-[12px] font-heading text-body-md font-bold text-on-tertiary transition-colors hover:bg-accent-sun min-h-[48px] disabled:opacity-70";
const secondaire =
  "inline-flex w-full items-center justify-center rounded-lg border border-outline px-[28px] py-[12px] font-heading text-body-md font-bold text-on-surface transition-colors hover:bg-surface-container-low min-h-[48px] disabled:opacity-70";

/**
 * Inscription à une formation Agrolide, en quatre étapes : conditions, code d'accès, confirmation, accès.
 * Le code n'est consommé qu'à la confirmation (étape 3) ; la vérification de l'étape 2 ne le consomme pas.
 * Tout contrôle réel est refait côté serveur par /api/formations/[id]/enroll.
 */
export function ParcoursInscription({
  formationId,
  titre,
  resume,
  firstLeconId,
}: {
  formationId: string;
  titre: string;
  /** Ex. « 6 modules · 24 leçons · 8 h ». */
  resume: string;
  firstLeconId?: string;
}) {
  const router = useRouter();
  const [etape, setEtape] = useState(0);
  const [accepte, setAccepte] = useState(false);
  const [code, setCode] = useState("");
  const [erreur, setErreur] = useState("");
  const [occupe, setOccupe] = useState(false);

  const appeler = async (verifier: boolean): Promise<boolean> => {
    setErreur("");
    setOccupe(true);
    try {
      const res = await fetch(`/api/formations/${formationId}/enroll`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, verifier }),
      });
      if (res.ok) return true;
      const corps = (await res.json().catch(() => ({}))) as { error?: string };
      setErreur(corps.error || "Inscription impossible pour le moment. Réessayez dans un instant.");
      return false;
    } catch {
      setErreur("Connexion impossible. Vérifiez votre réseau et réessayez.");
      return false;
    } finally {
      setOccupe(false);
    }
  };

  const ouvrir = () => {
    if (firstLeconId) router.push(`/membres/formations/${formationId}/suivre/${firstLeconId}`);
    else router.refresh();
  };

  return (
    <div className="space-y-4">
      <ol className="flex items-center gap-2" aria-label="Étapes de l'inscription">
        {ETAPES.map((nom, i) => (
          <li key={nom} className="flex flex-1 flex-col gap-1" aria-current={i === etape ? "step" : undefined}>
            <span className={`h-1.5 rounded-full ${i <= etape ? "bg-primary" : "bg-surface-container-high"}`} />
            <span className={`text-label-md ${i === etape ? "font-bold text-on-surface" : "text-on-surface-variant"}`}>{nom}</span>
          </li>
        ))}
      </ol>

      {etape === 0 && (
        <div className="space-y-3">
          <p className="text-body-md font-bold text-on-surface">Avant de commencer</p>
          <p className="text-body-sm text-on-surface-variant">{titre} · {resume}</p>
          <ul className="list-disc space-y-1 pl-5 text-body-sm text-on-surface-variant">
            <li>L&apos;accès se fait sur invitation, avec un code remis par l&apos;équipe Agrolide.</li>
            <li>Le code est personnel et à usage unique : il ne peut servir qu&apos;à une seule personne.</li>
            <li>Une fois utilisé, le code ne peut plus être réutilisé ni transmis.</li>
            <li>L&apos;examen final et le certificat sont réservés aux personnes inscrites.</li>
          </ul>
          <label className="flex min-h-11 cursor-pointer items-start gap-3 text-body-sm text-on-surface">
            <input
              type="checkbox"
              checked={accepte}
              onChange={(e) => setAccepte(e.target.checked)}
              className="mt-0.5 size-5 shrink-0 accent-primary"
            />
            J&apos;ai lu ces conditions et je les accepte.
          </label>
          <button type="button" disabled={!accepte} onClick={() => setEtape(1)} className={principal}>
            Continuer
          </button>
        </div>
      )}

      {etape === 1 && (
        <form
          className="space-y-3"
          noValidate
          onSubmit={async (e) => {
            e.preventDefault();
            if (occupe) return;
            if (await appeler(true)) setEtape(2);
          }}
        >
          <label htmlFor={`code-${formationId}`} className="flex items-center gap-2 text-label-lg font-bold text-on-surface">
            <Lock className="size-4 text-on-surface-variant" aria-hidden />
            Code d&apos;accès
          </label>
          <input
            id={`code-${formationId}`}
            value={code}
            onChange={(e) => {
              setCode(e.target.value.toUpperCase());
              setErreur("");
            }}
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
            Saisissez le code reçu. Il n&apos;est pas encore utilisé à cette étape : seule la confirmation l&apos;utilise.
          </p>
          <button type="submit" disabled={occupe || code.trim().length < 6} className={principal}>
            {occupe && <Loader2 className="mr-2 size-4 animate-spin" aria-hidden />}
            {occupe ? "Vérification du code…" : "Vérifier le code"}
          </button>
          <button type="button" onClick={() => { setErreur(""); setEtape(0); }} className={secondaire}>Retour</button>
        </form>
      )}

      {etape === 2 && (
        <div className="space-y-3">
          <p className="text-body-md font-bold text-on-surface">Confirmer votre inscription</p>
          <p className="text-body-sm text-on-surface-variant">
            Le code <span className="font-mono font-bold text-on-surface">{code}</span> est valable. En confirmant, il sera utilisé définitivement pour vous inscrire à « {titre} ».
          </p>
          {erreur ? <p role="alert" className="text-body-sm text-error">{erreur}</p> : null}
          <button
            type="button"
            disabled={occupe}
            onClick={async () => {
              if (occupe) return;
              if (await appeler(false)) {
                setEtape(3);
                router.refresh();
              }
            }}
            className={principal}
          >
            {occupe && <Loader2 className="mr-2 size-4 animate-spin" aria-hidden />}
            {occupe ? "Inscription en cours…" : "Confirmer mon inscription"}
          </button>
          <button type="button" disabled={occupe} onClick={() => { setErreur(""); setEtape(1); }} className={secondaire}>Retour</button>
        </div>
      )}

      {etape === 3 && (
        <div className="space-y-4" role="status">
          <p className="flex items-start gap-3 text-body-md font-bold text-on-surface">
            <CheckCircle2 className="mt-0.5 size-6 shrink-0 text-primary" aria-hidden />
            Inscription confirmée. Bienvenue dans la formation !
          </p>
          <p className="text-body-sm text-on-surface-variant">Une notification de confirmation vous a été envoyée.</p>
          <button type="button" onClick={ouvrir} className={principal}>Commencer la formation</button>
        </div>
      )}
    </div>
  );
}
