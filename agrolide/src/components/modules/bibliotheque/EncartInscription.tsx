import Link from 'next/link'
import { Unlock, UserPlus } from "@/components/ui/icons"
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
      <div className="w-full max-w-[720px] mx-auto rounded-xl border border-success/30 bg-success-container px-4 py-3 flex items-center justify-between gap-3 text-sm">
        <span className="text-on-success-container">
          Lisez sans interruption : c&apos;est gratuit !
        </span>
        <Link href={href} className="shrink-0 rounded-lg bg-success px-3 py-1.5 text-xs font-semibold text-on-primary hover:bg-primary/90">
          Créer mon compte
        </Link>
      </div>
    )
  }
  return (
    <aside
      aria-label="Invitation à créer un compte"
      className="w-full max-w-[720px] mx-auto rounded-2xl border-2 border-dashed border-success/30 bg-gradient-to-br from-primary-container to-warning-container p-5 sm:p-6 text-center"
    >
      <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-surface-container-lowest text-success shadow-sm">
        <Unlock className="size-5" />
      </div>
      <p className="text-label-sm uppercase tracking-[0.2em] text-on-surface-muted mb-1">Un petit message</p>
      <h3 className="text-lg font-bold text-on-surface">Envie de lire sans pub ni interruption&nbsp;?</h3>
      <p className="mt-1 text-sm text-on-surface-variant">
        Créez votre compte agrolide en 1&nbsp;minute : c&apos;est gratuit, et toute la bibliothèque s&apos;ouvre à vous.
      </p>
      <div className="mt-4 flex flex-col sm:flex-row items-center justify-center gap-2">
        <Link href={href} className="inline-flex items-center gap-2 rounded-lg bg-success px-5 py-2.5 text-sm font-semibold text-on-primary hover:bg-primary/90">
          <UserPlus className="size-4" /> Je crée mon compte gratuit
        </Link>
        <Link href={`/login?next=${encodeURIComponent(next)}`} className="text-sm font-medium text-on-success-container hover:underline">
          J&apos;ai déjà un compte
        </Link>
      </div>
    </aside>
  )
}
