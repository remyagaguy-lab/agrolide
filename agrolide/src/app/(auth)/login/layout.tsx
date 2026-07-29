import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Se connecter',
}

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
