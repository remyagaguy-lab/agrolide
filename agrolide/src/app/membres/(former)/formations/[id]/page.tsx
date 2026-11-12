import { db } from "@/db";
import { formations } from "@/db/schema";
import { eq } from "drizzle-orm";
import { FormationDetailView } from "@/components/modules/formations/FormationDetailView";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const f = await db.query.formations.findFirst({ columns: { titre: true }, where: eq(formations.id, id) });
  return { title: f?.titre ?? "Formation" };
}

export default async function FormationMembrePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <FormationDetailView id={id} mode="membre" />;
}
