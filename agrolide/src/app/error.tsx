'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/Button';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service like Sentry if needed
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
      <h1 className="text-5xl font-bold text-gray-900 mb-4 font-baskerville">Oups !</h1>
      <h2 className="text-xl font-semibold text-gray-800 mb-6 font-urbanist">
        Une erreur inattendue s'est produite.
      </h2>
      <p className="text-gray-600 max-w-md mb-8">
        Notre équipe technique a été notifiée. Veuillez réessayer ou retourner à l'accueil si le problème persiste.
      </p>
      {error && (
        <div className="bg-red-50 text-red-800 p-4 rounded-lg mb-8 max-w-lg text-left overflow-auto font-mono text-xs w-full max-h-96 border border-red-200">
          <strong>Message:</strong> {error.message || 'No message'} <br />
          <strong>Digest:</strong> {error.digest || 'No digest'} <br />
          {error.stack && (
            <pre className="mt-2 whitespace-pre-wrap">{error.stack}</pre>
          )}
        </div>
      )}
      <div className="flex gap-4">
        <Button onClick={() => reset()} variant="primary">
          Réessayer
        </Button>
        <Button href="/" variant="outline">
          Retour à l'accueil
        </Button>
      </div>
    </div>
  );
}
