import { redirect } from "next/navigation"
import Link from "next/link"
import { Bell, Calendar as CalendarIcon, FileText, Briefcase, BookOpen, ChevronRight, Clock, Users, Library, MessageSquare } from "lucide-react"
import { auth } from "@clerk/nextjs/server"
import { db } from "@/db"
import { users, notifications, evenements, articles, formations, opportunites, cotisations } from "@/db/schema"
import { eq, desc, gte } from "drizzle-orm"

export const metadata = { title: "Tableau de bord" }

export default async function DashboardPage() {
  try {
    const { userId } = await auth()
    if (!userId) redirect("/login")

    // Fetch Profile safely without JSON columns
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

    const profile = userRows[0] || null

    if (!profile) redirect("/login")

  // Fetch notifications
  let notifsData: any[] = []
  try {
    notifsData = await db.query.notifications.findMany({
      where: eq(notifications.user_id, userId),
      orderBy: [desc(notifications.created_at)],
      limit: 3
    })
  } catch (e) {
    console.error("Error fetching notifications:", e)
  }

  // Fetch prochains événements
  let evtsData: any[] = []
  try {
    evtsData = await db.query.evenements.findMany({
      where: gte(evenements.date_debut, new Date().toISOString()),
      orderBy: (evts, { asc }) => [asc(evts.date_debut)],
      limit: 2
    })
  } catch (e) {
    console.error("Error fetching events:", e)
  }

  // Fetch latest articles
  let mappedArticles: any[] = []
  try {
    const artsData = await db.select({
      slug: articles.slug,
      titre: articles.titre,
      published_at: articles.published_at,
      categorie: articles.categorie
    })
    .from(articles)
    .where(eq(articles.statut, "publie"))
    .orderBy(desc(articles.published_at))
    .limit(2)
    
    mappedArticles = artsData.map(a => ({
      slug: a.slug,
      title: a.titre,
      published_at: a.published_at,
      category: a.categorie
    }))
  } catch (e) {
    console.error("Error fetching articles:", e)
  }

  // Données spécifiques catégorie
  let userFormations: any[] = []
  let userOpportunites: any[] = []
  
  try {
    if (profile.categorie === "junior") {
      userFormations = await db.query.formations.findMany({ limit: 2 })
    }

    if (profile.categorie === "professionnel") {
      userOpportunites = await db.query.opportunites.findMany({ limit: 2 })
    }
  } catch (e) {
    console.error("Error fetching category-specific data:", e)
  }

  // Calcul date de fin de cotisation
  let cotisation: any = null
  try {
    cotisation = await db.query.cotisations.findFirst({
      where: eq(cotisations.membre_id, userId),
      orderBy: [desc(cotisations.created_at)]
    })
  } catch (e) {
    console.error("Error fetching cotisation:", e)
  }
    
  const dateFinRaw = cotisation?.date_fin ? new Date(cotisation.date_fin) : null
  const dateFinCotisation = (dateFinRaw && !isNaN(dateFinRaw.getTime())) ? dateFinRaw : null
  const joursRestants = dateFinCotisation 
    ? Math.max(0, Math.ceil((dateFinCotisation.getTime() - new Date().getTime()) / (1000 * 3600 * 24)))
    : 0

  return (
    <div className="space-y-6">
      {/* Bandeau bienvenue */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-[var(--color-gris-clair)] flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-heading font-bold text-gray-900">
            Bonjour {profile.prenom} 👋
          </h1>
          <p className="text-[var(--color-gris-texte)]">
            Bienvenue sur votre espace membre agrolide.
          </p>
        </div>
        <div className="flex gap-3">
          <Link href="/membres/profil" className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg transition-colors">
            Mon profil
          </Link>
          <Link href="/membres/annuaire" className="px-4 py-2 bg-[var(--color-vert-principal)] hover:bg-green-800 text-white text-sm font-medium rounded-lg transition-colors">
            Explorer le réseau
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Colonne Principale (Left) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Carte Statut Cotisation */}
          <div className="bg-[#E8F3EB] p-6 rounded-2xl border border-green-200 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-green-200 rounded-full blur-3xl opacity-50 -mr-10 -mt-10"></div>
            <h3 className="font-bold text-gray-900 mb-2">Statut de votre adhésion</h3>
            {dateFinCotisation ? (
              <div>
                <p className="text-[var(--color-vert-principal)] font-medium text-lg mb-4">
                  Valide jusqu'au {dateFinCotisation.toLocaleDateString('fr-FR')}
                </p>
                <div className="w-full bg-green-200 rounded-full h-2.5 mb-2">
                  <div className="bg-[var(--color-vert-principal)] h-2.5 rounded-full" style={{ width: `${Math.min(100, (joursRestants / 365) * 100)}%` }}></div>
                </div>
                <p className="text-sm text-green-800">{joursRestants} jours restants</p>
              </div>
            ) : (
              <div>
                <p className="text-[var(--color-orange-accent)] font-medium mb-4">
                  En attente de paiement
                </p>
                <Link href="/membres/cotisation" className="inline-block px-4 py-2 bg-[var(--color-vert-principal)] text-white text-sm font-medium rounded-lg">
                  Régler ma cotisation
                </Link>
              </div>
            )}
          </div>

          {/* Raccourcis */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link href="/membres/annuaire" className="bg-white p-4 rounded-xl border border-[var(--color-gris-clair)] shadow-sm hover:shadow-md transition-shadow flex flex-col items-center justify-center text-center gap-2 group">
              <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Users size={20} />
              </div>
              <span className="text-sm font-medium text-gray-700">Annuaire</span>
            </Link>
            
            <Link href="/membres/bibliotheque" className="bg-white p-4 rounded-xl border border-[var(--color-gris-clair)] shadow-sm hover:shadow-md transition-shadow flex flex-col items-center justify-center text-center gap-2 group">
              <div className="w-10 h-10 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Library size={20} />
              </div>
              <span className="text-sm font-medium text-gray-700">Bibliothèque</span>
            </Link>

            <Link href="/membres/forum" className="bg-white p-4 rounded-xl border border-[var(--color-gris-clair)] shadow-sm hover:shadow-md transition-shadow flex flex-col items-center justify-center text-center gap-2 group">
              <div className="w-10 h-10 rounded-full bg-orange-50 text-[var(--color-orange-accent)] flex items-center justify-center group-hover:scale-110 transition-transform">
                <MessageSquare size={20} />
              </div>
              <span className="text-sm font-medium text-gray-700">Forum</span>
            </Link>

            <Link href="/membres/evenements" className="bg-white p-4 rounded-xl border border-[var(--color-gris-clair)] shadow-sm hover:shadow-md transition-shadow flex flex-col items-center justify-center text-center gap-2 group">
              <div className="w-10 h-10 rounded-full bg-green-50 text-[var(--color-vert-principal)] flex items-center justify-center group-hover:scale-110 transition-transform">
                <CalendarIcon size={20} />
              </div>
              <span className="text-sm font-medium text-gray-700">Événements</span>
            </Link>
          </div>

          {/* Actualités Récentes */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-[var(--color-gris-clair)]">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-gray-900 text-lg">Actualités récentes</h3>
              <Link href="/blog" className="text-sm text-[var(--color-vert-principal)] font-medium hover:underline">
                Voir tout le blog
              </Link>
            </div>
            
            {mappedArticles && mappedArticles.length > 0 ? (
              <div className="space-y-4">
                {mappedArticles.map((article: any) => {
                  const pubDate = article.published_at ? new Date(article.published_at) : null
                  const isPubDateValid = pubDate && !isNaN(pubDate.getTime())
                  return (
                    <Link href={`/blog/${article.slug}`} key={article.slug} className="block group">
                      <div className="flex items-start gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-200">
                        <div className="flex-1">
                          <span className="text-xs font-semibold text-[var(--color-orange-accent)] uppercase tracking-wider">{article.category}</span>
                          <h4 className="font-bold text-gray-900 mt-1 group-hover:text-[var(--color-vert-principal)] transition-colors line-clamp-1">{article.title}</h4>
                          <div className="flex items-center text-xs text-gray-500 mt-2 gap-2">
                            <Clock size={12} />
                            <span>{isPubDateValid ? pubDate.toLocaleDateString('fr-FR') : ''}</span>
                          </div>
                        </div>
                        <ChevronRight size={20} className="text-gray-400 group-hover:text-[var(--color-vert-principal)]" />
                      </div>
                    </Link>
                  )
                })}
              </div>
            ) : (
              <p className="text-sm text-gray-500 italic">Aucun article récent.</p>
            )}
          </div>
        </div>

        {/* Colonne Latérale (Right) */}
        <div className="space-y-6">
          
          {/* Notifications */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-[var(--color-gris-clair)]">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-gray-900 flex items-center gap-2">
                <Bell size={18} className="text-[var(--color-vert-principal)]" />
                Notifications
              </h3>
            </div>
            {notifsData && notifsData.length > 0 ? (
              <div className="space-y-3">
                {notifsData.map((notif: any) => (
                  <div key={notif.id} className="p-3 bg-blue-50/50 rounded-lg text-sm border border-blue-100">
                    <p className="text-gray-800">{notif.contenu}</p>
                    <span className="text-xs text-gray-500 mt-1 block">{new Date(notif.created_at).toLocaleDateString()}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 italic text-center py-4">Vous n'avez aucune nouvelle notification.</p>
            )}
          </div>

          {/* Prochains événements */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-[var(--color-gris-clair)]">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <CalendarIcon size={18} className="text-[var(--color-vert-principal)]" />
              Prochains événements
            </h3>
            {evtsData && evtsData.length > 0 ? (
              <div className="space-y-3">
                {evtsData.map((evt: any) => (
                  <div key={evt.id} className="p-3 border border-gray-100 rounded-lg text-sm">
                    <p className="font-semibold text-gray-900">{evt.titre}</p>
                    <span className="text-xs text-[var(--color-vert-principal)] mt-1 block font-medium">
                      {new Date(evt.date_debut).toLocaleDateString('fr-FR')} • {evt.type_evt}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 italic text-center py-4">Aucun événement à venir.</p>
            )}
            <Link href="/membres/evenements" className="block text-center mt-4 text-sm font-medium text-[var(--color-vert-principal)] hover:underline">
              Voir l'agenda complet
            </Link>
          </div>

          {/* Widgets spécifiques selon la catégorie */}
          {profile.categorie === "junior" && (
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-[var(--color-gris-clair)]">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <BookOpen size={18} className="text-[var(--color-orange-accent)]" />
                Mes formations
              </h3>
              {userFormations.length > 0 ? (
                <div className="space-y-3">
                  {/* Render formations */}
                </div>
              ) : (
                <p className="text-sm text-gray-500 italic text-center py-4">Vous n'êtes inscrit à aucune formation.</p>
              )}
            </div>
          )}

          {profile.categorie === "professionnel" && (
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-[var(--color-gris-clair)]">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Briefcase size={18} className="text-blue-600" />
                Opportunités récentes
              </h3>
              {userOpportunites.length > 0 ? (
                <div className="space-y-3">
                  {/* Render opportunités */}
                </div>
              ) : (
                <p className="text-sm text-gray-500 italic text-center py-4">Aucune opportunité récente dans votre secteur.</p>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  )
  } catch (err: any) {
    if (err.digest !== 'NEXT_REDIRECT' && !err.message?.includes('NEXT_REDIRECT')) {
      (globalThis as any).lastError = {
        message: err.message,
        stack: err.stack,
        digest: err.digest,
        location: 'dashboard'
      };
    }
    throw err;
  }
}
