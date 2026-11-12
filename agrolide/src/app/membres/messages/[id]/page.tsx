import { redirect } from 'next/navigation'

/** Les notifications de messages pointent vers `/membres/messages/<id>` : on les envoie vers la messagerie avec le contact ouvert. */
export default async function MessageContactRedirect({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  redirect(`/membres/messages?user=${encodeURIComponent(id)}`)
}
