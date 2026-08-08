import { redirect } from "next/navigation"
import Link from "next/link"
import { auth, currentUser } from "@clerk/nextjs/server"
import { db } from "@/db"
import { users } from "@/db/schema"
import { eq, and } from "drizzle-orm"
import { LogoutButton } from "@/components/ui/LogoutButton"
import { MembresLayout } from "@/components/layout/MembresLayout"
import { AlertCircle } from "lucide-react"
import { user_connections } from "@/db/schema"

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
      console.error("[MOUCHARD] Erreur lors de la récupération initiale du profil:", error)
    }

    // FALLBACK SI LE WEBHOOK N'A PAS FONCTIONNÉ (ex: en dev local avec Google OAuth)
    if (!profile) {
      console.warn(`[CLERK FALLBACK] Profil introuvable pour ${userId}. Création automatique depuis Clerk...`);
      try {
        const user = await currentUser();
        if (user) {
          const primaryEmail = user.emailAddresses[0]?.emailAddress;
          if (primaryEmail) {
            // Vérifier si un compte existe déjà avec cet email (ex: ancien compte NextAuth)
            const existingUserRows = await db.select({
              id: users.id,
              email: users.email,
              image: users.image,
              photo_url: users.photo_url
            })
            .from(users)
            .where(eq(users.email, primaryEmail))
            .limit(1)

            const existingUser = existingUserRows[0] || null

            if (existingUser) {
              console.warn(`[CLERK FALLBACK] Email ${primaryEmail} existant. Mise à jour de l'ID vers Clerk ID...`);
              await db.update(users).set({ 
                id: userId,
                image: user.imageUrl || existingUser.image,
                photo_url: user.imageUrl || existingUser.photo_url
              }).where(eq(users.email, primaryEmail));
            } else {
              console.warn(`[CLERK FALLBACK] Nouvel utilisateur. Insertion en base...`);
              await db.insert(users).values({
                id: userId,
                email: primaryEmail,
                name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || null,
                prenom: user.firstName || null,
                nom: user.lastName || null,
                image: user.imageUrl || null,
                photo_url: user.imageUrl || null,
                role_plateforme: 'membre',
                statut_adhesion: 'gratuit',
                annuaire_visible: true,
                newsletter_brevo: true,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
              }).onConflictDoNothing();
            }
            
            // Recharger le profil fraîchement inséré ou mis à jour
            const finalUserRows = await db.select({
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

            profile = finalUserRows[0] || null
          }
        }
      } catch (error) {
        console.error("[CLERK FALLBACK] Erreur critique lors de la tentative de fallback Clerk:", error)
      }
    }

    console.log(`[MOUCHARD] Vérification d'accès à /membres. Session Clerk ID: ${userId} | Profil en base de données trouvé: ${profile ? 'OUI' : 'NON'}`);

    if (!profile) {
      console.error(`[MOUCHARD] AVERTISSEMENT: Impossible de trouver ou créer le profil BDD pour l'utilisateur Clerk (${userId}). Redirection vers login.`);
      redirect(`/login?error=Profil+introuvable`)
    }

    // 3. Redirection onboarding si pas de catégorie (ex: login via Google sans passer par le formulaire)
    if (!profile.categorie) {
      redirect("/onboarding")
    }

    // 4. Gestion des statuts d'adhésion (RG-007, RG-008)
    const statut = profile?.statut_adhesion || "gratuit"

    // 5. Récupération des demandes de connexion en attente
    let pendingRequestsCount = 0;
    try {
      const pendingRows = await db.select({ id: user_connections.id })
        .from(user_connections)
        .where(and(
          eq(user_connections.receiver_id, userId),
          eq(user_connections.status, 'pending')
        ));
      pendingRequestsCount = pendingRows.length;
    } catch (e) {
      console.error("[MOUCHARD] Erreur recup pending requests:", e);
    }

    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        {/* Header moved to MembresLayout for client-side routing state */}

        {/* Traitement des statuts */}
        {statut === "en_attente_paiement" && (
          <div className="bg-[#fef9ee] border-b border-[#fed7aa] text-[#8a4e00] px-4 py-3 text-center text-xs sm:text-sm font-medium flex items-center justify-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#e65100] animate-pulse shrink-0" />
            <span>Votre compte est en attente de paiement de cotisation.</span>
            <Link href="/membres/cotisation" className="font-bold underline ml-1 hover:text-[#5c3400] transition-colors inline-flex items-center gap-0.5">
              Régler ma cotisation &rarr;
            </Link>
          </div>
        )}

        {statut === "suspendu" && (
          <div className="flex-1 flex items-center justify-center p-4">
            <div className="bg-white p-8 rounded-xl border border-red-200 shadow-sm max-w-md text-center">
              <AlertCircle className="mx-auto text-red-500 mb-4" size={48} />
              <h2 className="text-xl font-bold text-red-700 mb-2">Compte suspendu</h2>
              <p className="text-gray-600 mb-6">Votre compte a été suspendu par un administrateur. Veuillez nous contacter pour plus d'informations.</p>
              <a href="mailto:contact@agrolide.org" className="inline-block bg-red-50 text-red-700 font-medium px-4 py-2 rounded hover:bg-red-100">
                Contacter le support
              </a>
            </div>
          </div>
        )}

        {/* Si le compte est expiré, on affiche une bannière non fermable */}
        {statut === "expire" && (
          <div className="bg-red-600 text-white p-4 text-center font-bold flex items-center justify-center gap-2">
            <AlertCircle size={20} />
            Votre adhésion a expiré. Pour continuer à profiter du réseau, veuillez renouveler votre cotisation.
            <Link href="/membres/cotisation" className="underline ml-2 hover:text-red-100">
              Renouveler maintenant
            </Link>
          </div>
        )}

        {/* Si le compte est suspendu, on n'affiche pas le layout complet */}
        {statut !== "suspendu" && (
          <MembresLayout profile={profile} pendingRequestsCount={pendingRequestsCount}>
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
