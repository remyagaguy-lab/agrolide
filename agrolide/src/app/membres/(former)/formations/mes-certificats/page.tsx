import { redirect } from 'next/navigation'

/** Les certificats vivent désormais dans « Mon parcours » ; l'ancienne URL (liens de notifications) y renvoie. */
export default function MesCertificatsPage() {
  redirect('/membres/formations#certificats')
}
