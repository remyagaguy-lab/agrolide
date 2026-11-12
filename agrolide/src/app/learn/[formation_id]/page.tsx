import { redirect } from "next/navigation";

/** Ancienne URL du lecteur : le cours se suit désormais dans l'espace membre. */
export default async function LearnRootRedirect({ params }: { params: Promise<{ formation_id: string }> }) {
  const { formation_id } = await params;
  redirect(`/membres/formations/${formation_id}/suivre`);
}
