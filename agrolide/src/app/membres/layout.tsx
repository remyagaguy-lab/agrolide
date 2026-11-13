import { redirect } from "next/navigation"
import Link from "next/link"
import { auth } from "@/lib/auth/server"
import { db } from "@/db"
import { users } from "@/db/schema"
import { eq } from "drizzle-orm"
import { LogoutButton } from "@/components/ui/LogoutButton"
import { MembresLayout } from "@/components/layout/MembresLayout"
import { AlertCircle } from "lucide-react"
import { compterInvitations, compterMessagesNonLus } from "@/lib/membres/compteurs.server"
import { paiementOuvert } from "@/lib/adhesion"

export default async function MembresRootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  try {
    const { userId } = await auth()

    if (!userId) {
      redirect("/login?message=Veuillez+vous+connecter")
    }

    // Pastilles de la barre latérale (invitations en attente, messages non lus) : deux COUNT qui ne dépendent que de
    // userId. Lancés en même temps que le profil : chaque appel D1 passe par l'API REST (≈ 150 à 400 ms), les
    // enchaîner coûtait un aller-retour de plus à chaque chargement de l'espace membre.
    const pastilles = Promise.all([
      compterInvitations(userId).catch((e) => {
        console.error("[membres] Erreur comptage invitations:", e)
        return 0
      }),
      compterMessagesNonLus(userId).catch((e) => {
        console.error("[membres] Erreur comptage messages non lus:", e)
        return 0
      }),
    ])

    // 2. Récupération du profil utilisateur
    let profile: any = null
    try {
      const userRows = await db.select({
        id: users.id,
        email: users.email,
        name: users.name,
        prenom: users.prenom,
        nom: users.nom,
        image: users.image,
        photo_url: users.photo_url,
        role_plateforme: users.role_plateforme,
        statut_adhesion: users.statut_adhesion,
        categorie: users.categorie,
        specialite: users.specialite,
        biographie: users.biographie,
        ville: users.ville,
        pays: users.pays,
        created_at: users.created_at,
        updated_at: users.updated_at
      })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1)

      profile = userRows[0] || null
    } catch (error) {
      console.error("[membres] Erreur lors de la récupération initiale du profil:", error)
    }

    // Premier passage (ou compte non encore lié) : /auth/callback crée ou lie le profil D1.
    if (!profile) {
      redirect("/auth/callback?next=/membres/dashboard")
    }

    // 3. Redirection onboarding si pas de catégorie (ex: login via Google sans passer par le formulaire)
    if (!profile.categorie) {
      redirect("/onboarding")
    }

    // 4. Gestion des statuts d'adhésion (RG-007, RG-008)
    const statut = profile?.statut_adhesion || "gratuit"

    // 5-6. Pastilles de la barre latérale (déjà en route depuis le début).
    const [pendingRequestsCount, unreadMessagesCount] = await pastilles

    return (
      <div className="min-h-screen bg-surface-container-low flex flex-col">
        {/* Header moved to MembresLayout for client-side routing state */}

        {/* Traitement des statuts */}

        {statut === "suspendu" && (
          <div className="flex-1 flex items-center justify-center p-4">
            <div className="bg-surface-container-lowest p-8 rounded-xl border border-error/30 shadow-sm max-w-md text-center">
              <AlertCircle className="mx-auto text-error mb-4" size={48} />
              <h2 className="text-xl font-bold text-error mb-2">Compte suspendu</h2>
              <p className="text-on-surface-variant mb-6">Votre compte a été suspendu par un administrateur. Veuillez nous contacter pour plus d'informations.</p>
              <a href="mailto:contact@agrolide.org" className="inline-block bg-error-container text-error font-medium px-4 py-2 rounded hover:bg-error-container">
                Contacter le support
              </a>
            </div>
          </div>
        )}

        {/* Si le compte est expiré, on affiche une bannière non fermable */}
        {statut === "expire" && paiementOuvert() && (
          <div className="bg-error text-on-error p-4 text-center font-bold flex items-center justify-center gap-2">
            <AlertCircle size={20} />
            Votre adhésion a expiré. Pour continuer à profiter du réseau, veuillez renouveler votre cotisation.
            <Link href="/membres/cotisation" className="underline ml-2 hover:text-error-container">
              Renouveler maintenant
            </Link>
          </div>
        )}

        {/* Si le compte est suspendu, on n'affiche pas le layout complet */}
        {statut !== "suspendu" && (
          <MembresLayout profile={profile} pendingRequestsCount={pendingRequestsCount} unreadMessagesCount={unreadMessagesCount}>
            <div className="container mx-auto px-4 py-8">
              {children}
            </div>
          </MembresLayout>
        )}
      </div>
    )
  } catch (err: any) {
    if (err.digest !== 'NEXT_REDIRECT' && !err.message?.includes('NEXT_REDIRECT')) {
      (globalThis as any).lastError = {
        message: err.message,
        stack: err.stack,
        digest: err.digest,
        location: 'layout'
      };
    }
    throw err;
  }
}
