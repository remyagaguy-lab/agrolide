import { Button } from '@/components/ui/Button'
import { PlanSoleil } from '@/components/brand'

/** 404 « soleil couchant » : le soleil (un écho orange) se pose sur le bord bas, sous le texte. */
export default function NotFound() {
  return (
    <section className="relative flex min-h-[70vh] flex-col items-center justify-start overflow-hidden px-4 py-0 pt-20 text-center [--r:clamp(8rem,24vw,17rem)] md:pt-28">
      <PlanSoleil x="50%" y="100%" rayon="var(--r)" echos={1} ton="soleil" fond="surface" />
      <div className="relative z-10 pb-[calc(var(--r)*1.16+2.5rem)]">
        <p className="mb-2 text-label-md uppercase tracking-[0.12em] text-primary">Erreur 404</p>
        <h1 className="mb-4 text-display-md text-on-surface">Page introuvable</h1>
        <p className="mx-auto mb-8 max-w-md text-body-lg text-on-surface-variant">
          La page que vous recherchez n'existe pas ou a été déplacée. Vérifiez l'URL ou retournez à la page d'accueil pour continuer votre navigation.
        </p>
        <Button href="/" variant="primary">
          Retour à l'accueil
        </Button>
      </div>
    </section>
  )
}
