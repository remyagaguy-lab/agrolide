import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'S\'inscrire',
}

export default function InscriptionLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
