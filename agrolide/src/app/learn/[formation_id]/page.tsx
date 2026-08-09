import { db } from "@/db";
import { formations } from "@/db/schema";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";

export default async function LearnRootPage({
  params,
}: {
  params: Promise<{ formation_id: string }>;
}) {
  const { formation_id: formationId } = await params;

  const formation = await db.query.formations.findFirst({
    where: eq(formations.id, formationId),
    with: {
      modules: {
        orderBy: (modules, { asc }) => [asc(modules.ordre)],
        with: {
          lecons: {
            orderBy: (lecons, { asc }) => [asc(lecons.ordre)],
          },
        },
      },
    },
  });

  if (!formation || formation.modules.length === 0 || formation.modules[0].lecons.length === 0) {
    redirect(`/formations/${formationId}`);
  }

  const firstLecon = formation.modules[0].lecons[0];
  redirect(`/learn/${formationId}/${firstLecon.id}`);
}
