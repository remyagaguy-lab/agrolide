import { redirect, notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { formations, progression_lecons } from "@/db/schema";
import { auth } from "@/lib/auth/server";

/** « Reprendre » : ouvre la première leçon non validée (ou la première, si tout est validé ou rien n'est commencé). */
export default async function SuivreRacinePage({ params }: { params: Promise<{ id: string }> }) {
  const { id: formationId } = await params;
  const { userId } = await auth();
  if (!userId) redirect(`/login?next=${encodeURIComponent(`/membres/formations/${formationId}/suivre`)}`);

  const [formation, faites] = await Promise.all([
    db.query.formations.findFirst({
      where: eq(formations.id, formationId),
      columns: { id: true },
      with: {
        modules: {
          columns: { id: true },
          orderBy: (modules, { asc }) => [asc(modules.ordre)],
          with: {
            lecons: { columns: { id: true }, orderBy: (lecons, { asc }) => [asc(lecons.ordre)] },
          },
        },
      },
    }),
    db.select({ leconId: progression_lecons.lecon_id }).from(progression_lecons).where(eq(progression_lecons.membre_id, userId)),
  ]);

  if (!formation) notFound();

  const lecons = formation.modules.flatMap((m) => m.lecons);
  if (lecons.length === 0) redirect(`/membres/formations/${formationId}`);

  const validees = new Set(faites.map((f) => f.leconId));
  const cible = lecons.find((l) => !validees.has(l.id)) ?? lecons[0];
  redirect(`/membres/formations/${formationId}/suivre/${cible.id}`);
}
