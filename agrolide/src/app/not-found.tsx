import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
      <h1 className="text-6xl font-bold text-on-surface mb-4 font-baskerville">404</h1>
      <h2 className="text-2xl font-semibold text-on-surface mb-6 font-urbanist">Page introuvable</h2>
      <p className="text-on-surface-variant max-w-md mb-8">
        La page que vous recherchez n'existe pas ou a été déplacée. 
        Vérifiez l'URL ou retournez à la page d'accueil pour continuer votre navigation.
      </p>
      <Button href="/" variant="primary">
        Retour à l'accueil
      </Button>
    </div>
  );
}
