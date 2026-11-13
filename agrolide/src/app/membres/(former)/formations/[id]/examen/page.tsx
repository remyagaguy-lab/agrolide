import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth/server";
import { peutSuivre } from "@/lib/formations/acces.server";
import { etatExamen, formationAUnExamen, NB_QUESTIONS_EXAMEN, ECHECS_AVANT_ATTENTE, DELAI_ATTENTE_H } from "@/lib/formations/examen.server";
import { ArrowLeft } from "@/components/ui/icons";
import { ExamenClient } from "./ExamenClient";

export const metadata = { title: "Examen final" };

export default async function ExamenPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!formationAUnExamen(id)) notFound();
  const { userId } = await auth();
  if (!userId) redirect(`/login?next=${encodeURIComponent(`/membres/formations/${id}/examen`)}`);
  if (!(await peutSuivre(id)).autorise) redirect(`/membres/formations/${id}`);
  const etat = await etatExamen(userId, id);

  return (
    <div className="mx-auto w-full max-w-3xl px-6 py-10 md:py-14">
      <Link href={`/membres/formations/${id}`} className="mb-6 inline-flex items-center gap-2 text-sm text-primary">
        <ArrowLeft className="size-4" /> Retour à la formation
      </Link>
      <h1 className="mb-3 font-urbanist text-headline-md text-on-surface">Examen final</h1>
      <p className="mb-6 text-on-surface-variant">
        {NB_QUESTIONS_EXAMEN} questions tirées au hasard dans une banque de 150, dont des calculs (5 par module). Seuil de réussite : {etat.seuil} %.
        Le certificat « Participation » s’obtient dès que toutes les leçons sont validées. Le certificat « Réussite » demande deux choses : réussir cet examen et faire valider votre business plan complet (livrable du module 6).
        Le nombre de tentatives est illimité ; après {ECHECS_AVANT_ATTENTE} échecs d’affilée, une attente de {DELAI_ATTENTE_H} h est demandée pour relire le cours.
      </p>
      {etat.tentatives > 0 && (
        <p className="mb-6 text-sm">Tentatives : {etat.tentatives} · meilleur score : {etat.meilleur} %{etat.reussi ? " · réussi" : ""}</p>
      )}
      {!etat.parcoursComplet ? (
        <p className="rounded-xl border border-outline-variant p-5">Validez d’abord toutes les leçons de la formation pour passer l’examen.</p>
      ) : etat.attenteJusqua ? (
        <p className="rounded-xl border border-outline-variant p-5">
          Trois échecs d’affilée : relisez le cours, vous pourrez recommencer à partir du {new Date(etat.attenteJusqua).toLocaleString("fr-FR")}.
        </p>
      ) : (
        <ExamenClient formationId={id} seuil={etat.seuil} />
      )}
      <p className="mt-10 text-sm"><Link className="text-primary" href={`/membres/formations/${id}/livrables`}>Remettre mon business plan complet et mes livrables</Link></p>
    </div>
  );
}
