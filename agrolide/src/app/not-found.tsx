import { Button } from '@/components/ui/Button'
import { EmblemEclate } from '@/components/brand'

/** 404 : l'emblème éclaté entier (soleil dans le ciel du dôme) sous le texte, jamais coupé. */
export default function NotFound() {
  return (
    <section className="flex min-h-[70vh] flex-col items-center justify-center px-4 py-12 text-center md:py-16">
      <EmblemEclate variante="soleil" className="mb-8 w-48 text-primary md:w-60" />
      <p className="mb-2 text-label-md uppercase tracking-[0.12em] text-primary">Erreur 404</p>
      <h1 className="mb-4 text-headline-md text-on-surface md:text-display-md">Page introuvable</h1>
      <p className="mx-auto mb-8 max-w-md text-body-lg text-on-surface-variant">
        La page que vous recherchez n'existe pas ou a été déplacée. Vérifiez l'URL ou retournez à la page d'accueil pour continuer votre navigation.
      </p>
      <Button href="/" variant="primary">
        Retour à l'accueil
      </Button>
    </section>
  )
}
