import Link from 'next/link'
import { Sparkles, BookOpenCheck } from 'lucide-react'

/**
 * Encart affiché aux visiteurs non connectés dans le lecteur (à l'endroit où une publicité
 * pourra être placée plus tard). « Lire sans publicité » = créer un compte gratuit.
 */
export function EncartInscription({
  next,
  variant = 'page',
}: {
  next: string
  variant?: 'page' | 'compact'
}) {
  const href = `/inscription?next=${encodeURIComponent(next)}`
  if (variant === 'compact') {
    return (
      <div className="w-full max-w-[720px] mx-auto rounded-xl border border-green-200 bg-green-50 px-4 py-3 flex items-center justify-between gap-3 text-sm">
        <span className="text-green-900">
          <span aria-hidden>✨ </span>Lisez sans interruption : c&apos;est gratuit !
        </span>
        <Link href={href} className="shrink-0 rounded-lg bg-green-700 px-3 py-1.5 text-xs font-semibold text-white hover:bg-green-800">
          Créer mon compte
        </Link>
      </div>
    )
  }
  return (
    <aside
      aria-label="Invitation à créer un compte"
      className="w-full max-w-[720px] mx-auto rounded-2xl border-2 border-dashed border-green-300 bg-gradient-to-br from-green-50 to-amber-50 p-5 sm:p-6 text-center"
    >
      <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-white text-green-700 shadow-sm">
        <Sparkles className="h-5 w-5" />
      </div>
      <p className="text-[11px] uppercase tracking-[0.2em] text-gray-400 mb-1">Un petit message</p>
      <h3 className="text-lg font-bold text-gray-900">Envie de lire sans pub ni interruption&nbsp;?</h3>
      <p className="mt-1 text-sm text-gray-600">
        Créez votre compte Agrolide en 1&nbsp;minute : c&apos;est gratuit, et toute la bibliothèque s&apos;ouvre à vous.
      </p>
      <div className="mt-4 flex flex-col sm:flex-row items-center justify-center gap-2">
        <Link href={href} className="inline-flex items-center gap-2 rounded-lg bg-green-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-green-800">
          <BookOpenCheck className="h-4 w-4" /> Je crée mon compte gratuit
        </Link>
        <Link href={`/login?next=${encodeURIComponent(next)}`} className="text-sm font-medium text-green-800 hover:underline">
          J&apos;ai déjà un compte
        </Link>
      </div>
    </aside>
  )
}
