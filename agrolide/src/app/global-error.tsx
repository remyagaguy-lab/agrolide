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
        <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4 text-center font-sans">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">Oups !</h1>
          <h2 className="text-xl font-semibold text-gray-800 mb-6">
            Une erreur critique est survenue.
          </h2>
          <p className="text-gray-600 max-w-md mb-8">
            L'application a rencontré un problème inattendu. Notre équipe technique a été notifiée.
          </p>
          <button
            onClick={() => reset()}
            className="px-6 py-3 bg-green-600 text-white font-medium rounded-xl hover:bg-green-700 transition-colors"
          >
            Recharger l'application
          </button>
        </div>
      </body>
    </html>
  )
}
