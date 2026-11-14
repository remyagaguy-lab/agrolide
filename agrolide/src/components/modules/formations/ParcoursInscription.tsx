"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, CheckCircle2, Lock } from "@/components/ui/icons";
import { DOMAINES, LONGUEUR_MAX, PROJETS, validerReponses } from "@/lib/formations/questionnaire";

const ETAPES = ["Conditions", "Code", "Profil", "Confirmation", "Accès"] as const;

const champ =
  "w-full min-h-12 rounded-lg border border-outline bg-surface-container-lowest px-3 text-body-md text-on-surface focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary";
const principal =
  "inline-flex w-full items-center justify-center rounded-lg bg-tertiary px-[28px] py-[12px] font-heading text-body-md font-bold text-on-tertiary transition-colors hover:bg-accent-sun min-h-[48px] disabled:opacity-70";
const secondaire =
  "inline-flex w-full items-center justify-center rounded-lg border border-outline px-[28px] py-[12px] font-heading text-body-md font-bold text-on-surface transition-colors hover:bg-surface-container-low min-h-[48px] disabled:opacity-70";

/**
 * Inscription à une formation Agrolide, en cinq étapes : conditions, code d'accès, questionnaire, confirmation, accès.
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
  const [reponses, setReponses] = useState({ projet: "", domaine: "", objectif: "", attentes: "" });
  const [erreur, setErreur] = useState("");
  const [occupe, setOccupe] = useState(false);

  const appeler = async (verifier: boolean): Promise<boolean> => {
    setErreur("");
    setOccupe(true);
    try {
      const res = await fetch(`/api/formations/${formationId}/enroll`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, verifier, reponses }),
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
            <li>L&apos;accès se fait sur invitation, avec un code remis par l&apos;équipe agrolide.</li>
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
            Saisissez le code reçu. Il n&apos;est pas encore utilisé à cette étape : seule la confirmation finale l&apos;utilise.
          </p>
          <button type="submit" disabled={occupe || code.trim().length < 6} className={principal}>
            {occupe && <Loader2 className="mr-2 size-4 animate-spin" aria-hidden />}
            {occupe ? "Vérification du code…" : "Vérifier le code"}
          </button>
          <button type="button" onClick={() => { setErreur(""); setEtape(0); }} className={secondaire}>Retour</button>
        </form>
      )}

      {etape === 2 && (
        <form
          className="space-y-3"
          noValidate
          onSubmit={(e) => {
            e.preventDefault();
            const v = validerReponses(reponses);
            if (!v.ok) return setErreur(v.erreur);
            setReponses(v.reponses);
            setErreur("");
            setEtape(3);
          }}
        >
          <p className="text-body-md font-bold text-on-surface">Parlez-nous de votre projet</p>
          <p className="text-body-sm text-on-surface-variant">Quelques questions pour adapter votre accompagnement. Toutes sont obligatoires.</p>
          <div className="space-y-1">
            <label htmlFor={`projet-${formationId}`} className="text-label-lg font-bold text-on-surface">Avez-vous un projet agricole ?</label>
            <select id={`projet-${formationId}`} value={reponses.projet} onChange={(e) => setReponses({ ...reponses, projet: e.target.value })} className={champ}>
              <option value="">Choisir…</option>
              {PROJETS.map((p) => <option key={p.valeur} value={p.valeur}>{p.libelle}</option>)}
            </select>
          </div>
          <div className="space-y-1">
            <label htmlFor={`domaine-${formationId}`} className="text-label-lg font-bold text-on-surface">Dans quel domaine ?</label>
            <select id={`domaine-${formationId}`} value={reponses.domaine} onChange={(e) => setReponses({ ...reponses, domaine: e.target.value })} className={champ}>
              <option value="">Choisir…</option>
              {DOMAINES.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
          <div className="space-y-1">
            <label htmlFor={`objectif-${formationId}`} className="text-label-lg font-bold text-on-surface">Quel est votre objectif avec cette formation ?</label>
            <textarea id={`objectif-${formationId}`} rows={3} maxLength={LONGUEUR_MAX} value={reponses.objectif} onChange={(e) => setReponses({ ...reponses, objectif: e.target.value })} className={`${champ} py-2`} />
          </div>
          <div className="space-y-1">
            <label htmlFor={`attentes-${formationId}`} className="text-label-lg font-bold text-on-surface">Qu&apos;attendez-vous à la fin de la formation ?</label>
            <textarea id={`attentes-${formationId}`} rows={3} maxLength={LONGUEUR_MAX} value={reponses.attentes} onChange={(e) => setReponses({ ...reponses, attentes: e.target.value })} className={`${champ} py-2`} />
          </div>
          {erreur ? <p role="alert" className="text-body-sm text-error">{erreur}</p> : null}
          <button type="submit" className={principal}>Continuer</button>
          <button type="button" onClick={() => { setErreur(""); setEtape(1); }} className={secondaire}>Retour</button>
        </form>
      )}

      {etape === 3 && (
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
                setEtape(4);
                router.refresh();
              }
            }}
            className={principal}
          >
            {occupe && <Loader2 className="mr-2 size-4 animate-spin" aria-hidden />}
            {occupe ? "Inscription en cours…" : "Confirmer mon inscription"}
          </button>
          <button type="button" disabled={occupe} onClick={() => { setErreur(""); setEtape(2); }} className={secondaire}>Retour</button>
        </div>
      )}

      {etape === 4 && (
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
