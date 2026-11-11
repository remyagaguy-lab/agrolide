'use client'
 
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html lang="fr">
      <body>
        <div className="min-h-screen bg-surface-container-lowest flex flex-col items-center justify-center px-4 text-center font-sans">
          <h1 className="text-5xl font-bold text-on-surface mb-4">Oups !</h1>
          <h2 className="text-xl font-semibold text-on-surface mb-6">
            Une erreur critique est survenue.
          </h2>
          <p className="text-on-surface-variant max-w-md mb-8">
            L'application a rencontré un problème inattendu. Notre équipe technique a été notifiée.
          </p>
          <button
            onClick={() => reset()}
            className="px-6 py-3 bg-success text-white font-medium rounded-xl hover:bg-success transition-colors"
          >
            Recharger l'application
          </button>
        </div>
      </body>
    </html>
  )
}
