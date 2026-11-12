import { FormationDetailView } from "@/components/modules/formations/FormationDetailView";

// Un membre connecté qui ouvre cette URL est redirigé vers /membres/formations/[id] par le middleware.
export default async function FormationPublicPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <FormationDetailView id={id} mode="public" />;
}
