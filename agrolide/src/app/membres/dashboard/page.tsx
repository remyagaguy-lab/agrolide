import { redirect } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { 
  Bell, 
  Calendar as CalendarIcon, 
  Briefcase, 
  BookOpen, 
  ChevronRight, 
  Clock, 
  Users, 
  Library, 
  MessageSquare, 
  MapPin, 
  Award, 
  CreditCard, 
  User as UserIcon,
  ShieldAlert
} from "lucide-react"
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
      updated_at: users.updated_at,
      organisation: users.organisation
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
      <div className="max-w-[1400px] mx-auto space-y-8 px-2 md:px-6 py-6">
        
        {/* Header / Welcome Area */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-heading font-bold text-gray-900 tracking-tight">
              Bonjour, {profile.prenom || "Membre"}
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Bienvenue sur votre espace personnel Agrolide.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 bg-white px-4 py-2.5 rounded-full border border-gray-100 shadow-sm text-sm font-medium text-gray-600">
              <CalendarIcon size={16} className="text-gray-400" />
              <span>{new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
            </div>
            <Link href="/membres/profil/modifier" className="inline-flex items-center gap-2 px-5 py-2.5 bg-[var(--color-vert-profond)] text-white text-sm font-bold rounded-full hover:bg-[var(--color-vert-principal)] shadow-[0_4px_20px_rgba(27,94,56,0.3)] transition-all">
              <span>Mettre à jour mon profil</span>
            </Link>
          </div>
        </div>

        {/* Top Widgets Grid (Shortcuts + Membership Card) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Adhésion "Credit Card" Style (Takes 1 column) */}
          <div className="lg:col-span-1 bg-gradient-to-br from-[var(--color-vert-profond)] to-[#0c361e] p-6 rounded-[28px] shadow-lg shadow-[var(--color-vert-profond)]/20 text-white relative overflow-hidden flex flex-col justify-between min-h-[200px]">
            {/* Decorative background shapes */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full blur-2xl -mr-12 -mt-12"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full blur-xl -ml-10 -mb-10"></div>
            
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-white/80 text-xs font-semibold uppercase tracking-wider mb-1">
                    Statut Adhésion
                  </h3>
                  {dateFinCotisation ? (
                    <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-bold">
                      Actif • Premium
                    </span>
                  ) : (
                    <span className="inline-block px-3 py-1 bg-red-500/80 backdrop-blur-sm rounded-full text-xs font-bold text-white">
                      À renouveler
                    </span>
                  )}
                </div>
                <CreditCard className="text-white/60 opacity-80" size={28} />
              </div>

              <div>
                <div className="text-3xl font-bold font-heading mb-1 tracking-tight">
                  {joursRestants} <span className="text-lg font-normal text-white/80">jours restants</span>
                </div>
                {dateFinCotisation ? (
                  <p className="text-white/60 text-xs font-medium">Expire le {dateFinCotisation.toLocaleDateString('fr-FR')}</p>
                ) : (
                  <Link href="/membres/cotisation" className="inline-block mt-2 text-xs font-bold text-[#fcb726] hover:text-white transition-colors">
                    Régler ma cotisation maintenant →
                  </Link>
                )}
              </div>
            </div>
          </div>

          {/* Raccourcis Rapides (Takes 2 columns) */}
          <div className="lg:col-span-2 bg-white rounded-[28px] shadow-sm p-6 flex flex-col justify-center">
            <h3 className="text-sm font-bold text-gray-800 mb-6 flex items-center justify-between">
              <span>Accès rapides</span>
              <span className="text-[10px] text-gray-400 font-medium uppercase tracking-wider bg-gray-50 px-2 py-1 rounded-md">Vos outils</span>
            </h3>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Link href="/membres/annuaire" className="flex flex-col items-center p-4 rounded-[20px] bg-[#f8faf8] hover:bg-[var(--color-vert-clair)] transition-colors group">
                <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center text-[var(--color-vert-profond)] group-hover:scale-110 transition-transform mb-3">
                  <Users size={20} />
                </div>
                <span className="text-sm font-bold text-gray-700">Annuaire</span>
              </Link>
              
              <Link href="/membres/bibliotheque" className="flex flex-col items-center p-4 rounded-[20px] bg-[#f8faf8] hover:bg-[var(--color-vert-clair)] transition-colors group">
                <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center text-[var(--color-vert-profond)] group-hover:scale-110 transition-transform mb-3">
                  <Library size={20} />
                </div>
                <span className="text-sm font-bold text-gray-700">Ressources</span>
              </Link>

              <Link href="/membres/forum" className="flex flex-col items-center p-4 rounded-[20px] bg-[#f8faf8] hover:bg-[var(--color-vert-clair)] transition-colors group">
                <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center text-[var(--color-vert-profond)] group-hover:scale-110 transition-transform mb-3">
                  <MessageSquare size={20} />
                </div>
                <span className="text-sm font-bold text-gray-700">Discussions</span>
              </Link>

              <Link href="/membres/evenements" className="flex flex-col items-center p-4 rounded-[20px] bg-[#f8faf8] hover:bg-[var(--color-vert-clair)] transition-colors group">
                <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center text-[var(--color-vert-profond)] group-hover:scale-110 transition-transform mb-3">
                  <CalendarIcon size={20} />
                </div>
                <span className="text-sm font-bold text-gray-700">Agenda</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Main Content Grid (Feeds) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main Feed (Takes 2/3) */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Category Custom Feed (Formations / Opportunités) */}
            {(profile.categorie === "junior" || profile.categorie === "professionnel") && (
              <div className="bg-white rounded-[28px] shadow-sm p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-bold text-gray-900 font-heading">
                    {profile.categorie === "junior" ? "Formations recommandées" : "Opportunités récentes"}
                  </h3>
                  <Link href={profile.categorie === "junior" ? "/membres/formations" : "/membres/opportunites"} className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-500 hover:bg-[var(--color-vert-clair)] hover:text-[var(--color-vert-profond)] transition-colors">
                    <ChevronRight size={18} />
                  </Link>
                </div>
                
                <div className="space-y-4">
                  {profile.categorie === "junior" && userFormations && userFormations.length > 0 ? (
                    userFormations.map((f: any) => (
                      <Link href={`/membres/formations/${f.id}`} key={f.id} className="flex items-center gap-4 p-4 rounded-[20px] border border-gray-100 hover:border-[var(--color-vert-principal)] hover:shadow-sm transition-all group bg-white">
                        <div className="w-14 h-14 rounded-2xl bg-[var(--color-vert-clair)] text-[var(--color-vert-profond)] flex items-center justify-center shrink-0">
                          <BookOpen size={24} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-gray-900 truncate group-hover:text-[var(--color-vert-profond)] transition-colors">{f.titre}</h4>
                          <p className="text-sm text-gray-500 flex items-center gap-2 mt-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-orange-accent)]"></span>
                            {f.niveau || "Tous niveaux"} • {f.duree || "Auto-formation"}
                          </p>
                        </div>
                      </Link>
                    ))
                  ) : profile.categorie === "professionnel" && userOpportunites && userOpportunites.length > 0 ? (
                    userOpportunites.map((o: any) => (
                      <Link href={`/membres/opportunites/${o.id}`} key={o.id} className="flex items-center gap-4 p-4 rounded-[20px] border border-gray-100 hover:border-[var(--color-vert-principal)] hover:shadow-sm transition-all group bg-white">
                        <div className="w-14 h-14 rounded-2xl bg-[#fff8e6] text-[var(--color-orange-accent)] flex items-center justify-center shrink-0">
                          <Briefcase size={24} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-gray-900 truncate group-hover:text-[var(--color-orange-accent)] transition-colors">{o.titre}</h4>
                          <p className="text-sm text-gray-500 flex items-center gap-2 mt-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                            {o.entreprise} • {o.localisation || "A distance"}
                          </p>
                        </div>
                        <div className="hidden sm:block">
                          <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-bold rounded-full">
                            {o.type_contrat || "CDI"}
                          </span>
                        </div>
                      </Link>
                    ))
                  ) : (
                    <div className="text-center py-8 bg-gray-50 rounded-[20px]">
                      <p className="text-sm text-gray-400">Aucune nouveauté pour le moment.</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Articles feed - Styled like a clean list */}
            <div className="bg-white rounded-[28px] shadow-sm p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-gray-900 font-heading">Actualités du réseau</h3>
                <Link href="/blog" className="text-xs font-bold text-[var(--color-vert-profond)] hover:underline">
                  Tout lire
                </Link>
              </div>

              {mappedArticles && mappedArticles.length > 0 ? (
                <div className="space-y-0">
                  {mappedArticles.map((article: any, idx: number) => {
                    const pubDate = article.published_at ? new Date(article.published_at) : null
                    const isPubDateValid = pubDate && !isNaN(pubDate.getTime())
                    return (
                      <Link href={`/blog/${article.slug}`} key={article.slug} className={`flex items-start gap-4 p-4 rounded-[16px] hover:bg-[#f8faf8] transition-colors group ${idx !== mappedArticles.length - 1 ? 'border-b border-gray-50' : ''}`}>
                        <div className="w-2 h-2 rounded-full bg-[var(--color-vert-principal)] mt-2 shrink-0"></div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start gap-4">
                            <h4 className="font-bold text-gray-900 text-base leading-snug group-hover:text-[var(--color-vert-profond)] transition-colors">
                              {article.title}
                            </h4>
                            <span className="text-xs font-medium text-gray-400 whitespace-nowrap hidden sm:block">
                              {isPubDateValid ? pubDate.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }) : ""}
                            </span>
                          </div>
                          <span className="text-xs font-bold text-[var(--color-orange-accent)] uppercase mt-2 block">
                            {article.category || "Général"}
                          </span>
                        </div>
                      </Link>
                    )
                  })}
                </div>
              ) : (
                <p className="text-sm text-gray-400 text-center py-6">Aucune publication récente.</p>
              )}
            </div>

          </div>

          {/* Sidebar Feed (Notifications & Events) */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* Notifications */}
            <div className="bg-white p-6 rounded-[28px] shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-base font-bold text-gray-900 font-heading">Notifications</h3>
                <span className="w-6 h-6 rounded-full bg-red-100 text-red-600 text-xs font-bold flex items-center justify-center">
                  {notifsData?.length || 0}
                </span>
              </div>
              
              {notifsData && notifsData.length > 0 ? (
                <div className="space-y-4">
                  {notifsData.map((notif: any) => (
                    <div key={notif.id} className="flex gap-3 items-start">
                      <div className="w-8 h-8 rounded-full bg-[var(--color-vert-clair)] text-[var(--color-vert-profond)] flex items-center justify-center shrink-0 mt-0.5">
                        <Bell size={14} />
                      </div>
                      <div>
                        <p className="text-sm text-gray-700 leading-snug">{notif.contenu}</p>
                        <p className="text-[10px] text-gray-400 mt-1">{new Date(notif.created_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                  ))}
                  <Link href="/membres/notifications" className="block w-full py-2.5 text-center text-xs font-bold text-gray-600 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors mt-2">
                    Voir toutes
                  </Link>
                </div>
              ) : (
                <p className="text-xs text-gray-400 text-center py-4">Aucune notification.</p>
              )}
            </div>

            {/* Events Widget */}
            <div className="bg-white p-6 rounded-[28px] shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-base font-bold text-gray-900 font-heading">À venir</h3>
              </div>

              {evtsData && evtsData.length > 0 ? (
                <div className="space-y-4">
                  {evtsData.map((evt: any) => {
                    const evtDate = evt.date_debut ? new Date(evt.date_debut) : null
                    const day = evtDate ? evtDate.getDate() : ""
                    const month = evtDate ? evtDate.toLocaleDateString('fr-FR', { month: 'short' }) : ""
                    return (
                      <Link href="/membres/evenements" key={evt.id} className="flex gap-4 items-center group">
                        <div className="w-12 h-12 bg-gray-50 rounded-xl flex flex-col items-center justify-center shrink-0 border border-gray-100 group-hover:bg-[var(--color-vert-clair)] group-hover:border-[var(--color-vert-principal)] transition-colors">
                          <span className="text-sm font-extrabold text-gray-900 group-hover:text-[var(--color-vert-profond)] leading-none">{day}</span>
                          <span className="text-[9px] font-bold text-gray-500 uppercase mt-1 leading-none">{month}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-gray-900 text-sm truncate leading-tight group-hover:text-[var(--color-vert-profond)]">{evt.titre}</p>
                          <p className="text-xs text-gray-500 mt-1">{evt.type_evt || "Événement"}</p>
                        </div>
                      </Link>
                    )
                  })}
                </div>
              ) : (
                <p className="text-xs text-gray-400 text-center py-4">Aucun événement prévu.</p>
              )}
            </div>

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
