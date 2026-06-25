import { redirect } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { Bell, Calendar as CalendarIcon, FileText, Briefcase, BookOpen, ChevronRight, Clock, Users, Library, MessageSquare } from "lucide-react"

export default async function DashboardPage() {
  const supabase = await createClient()

  const { data: { session } } = await supabase.auth.getSession()
  if (!session) redirect("/login")

  // Fetch Profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", session.user.id)
    .single()

  if (!profile) redirect("/login")

  // Fetch notifications (mock fallback if table doesn't exist)
  const { data: notifications } = await supabase
    .from("notifications")
    .select("*")
    .eq("user_id", session.user.id)
    .eq("read", false)
    .order("created_at", { ascending: false })
    .limit(3)
    

  // Fetch prochains événements (mock fallback)
  const { data: evenements } = await supabase
    .from("evenements")
    .select("*")
    .gte("date_debut", new Date().toISOString())
    .order("date_debut", { ascending: true })
    .limit(2)
    

  // Fetch latest articles (fallback)
  const { data: articles } = await supabase
    .from("articles")
    .select("slug, title, published_at, category")
    .eq("status", "published")
    .order("published_at", { ascending: false })
    .limit(2)
    

  // Données spécifiques catégorie
  let formations = []
  let opportunites = []
  
  if (profile.categorie === "junior") {
    const { data } = await supabase.from("formations").select("*").limit(2)
    formations = data || []
  }

  if (profile.categorie === "professionnel") {
    const { data } = await supabase.from("opportunites").select("*").limit(2)
    opportunites = data || []
  }

  // Calcul date de fin de cotisation (simulée ici pour le MVP si non présente dans profil)
  // Dans le flow réel, on récupère de la table cotisations.
  let { data: cotisation } = await supabase
    .from("cotisations")
    .select("date_fin")
    .eq("membre_id", session.user.id)
    .eq("statut", "valide")
    .order("created_at", { ascending: false })
    .limit(1)
    .single()
    
  if (!cotisation) cotisation = null
  const dateFinCotisation = cotisation?.date_fin ? new Date(cotisation.date_fin) : null
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
            
            {articles && articles.length > 0 ? (
              <div className="space-y-4">
                {articles.map((article: any) => (
                  <Link href={`/blog/${article.slug}`} key={article.slug} className="block group">
                    <div className="flex items-start gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-200">
                      <div className="flex-1">
                        <span className="text-xs font-semibold text-[var(--color-orange-accent)] uppercase tracking-wider">{article.category}</span>
                        <h4 className="font-bold text-gray-900 mt-1 group-hover:text-[var(--color-vert-principal)] transition-colors line-clamp-1">{article.title}</h4>
                        <div className="flex items-center text-xs text-gray-500 mt-2 gap-2">
                          <Clock size={12} />
                          <span>{new Date(article.published_at).toLocaleDateString('fr-FR')}</span>
                        </div>
                      </div>
                      <ChevronRight size={20} className="text-gray-400 group-hover:text-[var(--color-vert-principal)]" />
                    </div>
                  </Link>
                ))}
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
            {notifications && notifications.length > 0 ? (
              <div className="space-y-3">
                {notifications.map((notif: any) => (
                  <div key={notif.id} className="p-3 bg-blue-50/50 rounded-lg text-sm border border-blue-100">
                    <p className="text-gray-800">{notif.content}</p>
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
            {evenements && evenements.length > 0 ? (
              <div className="space-y-3">
                {evenements.map((evt: any) => (
                  <div key={evt.id} className="p-3 border border-gray-100 rounded-lg text-sm">
                    <p className="font-semibold text-gray-900">{evt.titre}</p>
                    <span className="text-xs text-[var(--color-vert-principal)] mt-1 block font-medium">
                      {new Date(evt.date_debut).toLocaleDateString('fr-FR')} • {evt.type}
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
              {formations.length > 0 ? (
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
              {opportunites.length > 0 ? (
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
}
