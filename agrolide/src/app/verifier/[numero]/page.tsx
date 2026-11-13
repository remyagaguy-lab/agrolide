import Link from "next/link";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { certificats_formation, formations, users } from "@/db/schema";

export const metadata = { title: "Vérification d’un certificat", robots: { index: false, follow: false } };

const NIVEAUX: Record<string, string> = { participation: "Participation", reussite: "Réussite" };

/** Page publique : confirme qu'un numéro de certificat existe et à qui il a été délivré. Aucune autre donnée personnelle. */
export default async function VerifierPage({ params }: { params: Promise<{ numero: string }> }) {
  const { numero: brut } = await params;
  const numero = decodeURIComponent(brut).trim().toUpperCase();
  const cert = /^[A-Z0-9-]{8,40}$/.test(numero)
    ? await db.query.certificats_formation.findFirst({ where: eq(certificats_formation.numero, numero) })
    : undefined;
  const [membre, formation] = cert
    ? await Promise.all([
        db.query.users.findFirst({ where: eq(users.id, cert.membre_id), columns: { nom: true, prenom: true } }),
        db.query.formations.findFirst({ where: eq(formations.id, cert.formation_id), columns: { titre: true } }),
      ])
    : [undefined, undefined];

  return (
    <main className="mx-auto w-full max-w-xl px-6 py-16">
      <h1 className="mb-6 font-urbanist text-headline-md text-on-surface">Vérification d’un certificat</h1>
      {cert ? (
        <div className="space-y-2 rounded-xl border border-accent-leaf bg-success-container p-6">
          <p className="font-bold text-primary">Certificat authentique</p>
          <p>Numéro : <strong>{cert.numero}</strong></p>
          <p>Délivré à : <strong>{[membre?.prenom, membre?.nom].filter(Boolean).join(" ") || "—"}</strong></p>
          <p>Formation : <strong>{formation?.titre ?? "—"}</strong></p>
          <p>Niveau : <strong>{NIVEAUX[cert.niveau] ?? cert.niveau}</strong></p>
          <p>Date : <strong>{new Date(cert.delivre_le).toLocaleDateString("fr-FR")}</strong></p>
        </div>
      ) : (
        <div className="rounded-xl border border-outline-variant p-6">
          <p className="font-bold">Aucun certificat ne porte ce numéro.</p>
          <p className="mt-2 text-on-surface-variant">Vérifiez le numéro (par exemple AGR-BPA-2026-7K3Q9X) et réessayez.</p>
        </div>
      )}
      <p className="mt-8 text-sm"><Link href="/" className="text-primary">Retour à l’accueil Agrolide</Link></p>
    </main>
  );
}
