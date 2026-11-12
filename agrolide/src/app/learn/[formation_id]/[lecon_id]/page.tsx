import { redirect } from "next/navigation";

/** Ancienne URL d'une leçon : le cours se suit désormais dans l'espace membre. */
export default async function LearnLeconRedirect({ params }: { params: Promise<{ formation_id: string; lecon_id: string }> }) {
  const { formation_id, lecon_id } = await params;
  redirect(`/membres/formations/${formation_id}/suivre/${lecon_id}`);
}
