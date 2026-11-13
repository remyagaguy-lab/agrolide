import Link from "next/link";
import { asc, desc, eq, inArray } from "drizzle-orm";
import { db } from "@/db";
import { livrables_formation, users } from "@/db/schema";
import { CorrectionForm } from "./CorrectionForm";

export const dynamic = "force-dynamic";
export const metadata = { title: "Livrables à corriger", robots: { index: false, follow: false } };

const MODULES = ["", "Fiche synoptique", "Étude de marché", "Plan de production", "Stratégie commerciale", "Modèle financier", "Dossier complet et pitch"];
const FILTRES = [
  { cle: "soumis", libelle: "À corriger" },
  { cle: "a_revoir", libelle: "À revoir" },
  { cle: "valide", libelle: "Validés" },
];

const estLien = (t: string) => /^https?:\/\/\S+$/.test(t.trim());

export default async function LivrablesAdminPage({ searchParams }: { searchParams: Promise<{ statut?: string }> }) {
  const { statut: brut } = await searchParams;
  const statut = FILTRES.some((f) => f.cle === brut) ? (brut as string) : "soumis";

  let lignes: (typeof livrables_formation.$inferSelect)[] = [];
  let noms = new Map<string, string>();
  let erreur = false;
  try {
    lignes = await db.select().from(livrables_formation).where(eq(livrables_formation.statut, statut))
      .orderBy(statut === "soumis" ? asc(livrables_formation.soumis_le) : desc(livrables_formation.soumis_le)).limit(100);
    const ids = [...new Set(lignes.map((l) => l.membre_id))];
    if (ids.length) {
      const us = await db.select({ id: users.id, nom: users.nom, prenom: users.prenom }).from(users).where(inArray(users.id, ids));
      noms = new Map(us.map((u) => [u.id, [u.prenom, u.nom].filter(Boolean).join(" ") || "Membre"]));
    }
  } catch (e) {
    console.error("[admin] livrables illisibles :", e);
    erreur = true;
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <header className="space-y-1">
        <h1 className="text-headline-md text-on-surface">Livrables à corriger</h1>
        <p className="text-body-md text-on-surface-variant">
          Un livrable par module et par membre. Notez sur 20, puis validez ou demandez une révision : le membre est prévenu par notification.
          Barème conseillé : 12/20 pour valider. Seul le module 6 (business plan complet) conditionne le certificat « Réussite », avec l’examen : sa validation délivre le certificat si l’examen est réussi.
        </p>
      </header>
      <nav className="flex gap-2">
        {FILTRES.map((f) => (
          <Link key={f.cle} href={`?statut=${f.cle}`} className={`rounded-full border px-4 py-1.5 text-sm ${statut === f.cle ? "border-primary bg-primary-container font-bold" : "border-outline-variant"}`}>
            {f.libelle}
          </Link>
        ))}
      </nav>
      {erreur ? (
        <p className="rounded-xl border border-outline-variant p-5">Impossible de lire les livrables pour le moment.</p>
      ) : lignes.length === 0 ? (
        <p className="rounded-xl border border-outline-variant p-5">Aucun livrable dans cette liste.</p>
      ) : (
        <ul className="space-y-5">
          {lignes.map((l) => (
            <li key={l.id} className="rounded-xl border border-outline-variant bg-surface-container-lowest p-5">
              <p className="font-urbanist font-semibold">
                {noms.get(l.membre_id) ?? "Membre"} · Module {l.module_ordre} ({MODULES[l.module_ordre] ?? ""})
              </p>
              <p className="text-sm text-on-surface-variant">Remis le {new Date(l.soumis_le).toLocaleString("fr-FR")}</p>
              <div className="mt-3 max-h-72 overflow-auto whitespace-pre-wrap rounded bg-surface-container-low p-3 text-sm">
                {estLien(l.contenu) ? <a href={l.contenu.trim()} target="_blank" rel="noopener noreferrer nofollow" className="text-primary underline">{l.contenu.trim()}</a> : l.contenu}
              </div>
              <CorrectionForm id={l.id} noteInitiale={l.note} commentaireInitial={l.commentaire ?? ""} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
