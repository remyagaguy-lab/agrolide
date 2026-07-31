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
      <div className="max-w-[1400px] mx-auto space-y-6 px-1">
        {/* Top welcome banner on mobile/tablet */}
        <div className="block lg:hidden bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
          <h1 className="text-xl font-heading font-bold text-gray-900">
            Bonjour, {profile.prenom || "Membre"} 👋
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Ravi de vous revoir sur votre espace agrolide.
          </p>
        </div>

        {/* Grid Layout: Main Feed & Right Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          
          {/* CENTER COLUMN: Welcome, Quick Links & Feeds (Takes 2/3 of desktop width) */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Welcome banner on Desktop */}
            <div className="hidden lg:block bg-white p-6 rounded-2xl border border-gray-150 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-full blur-3xl opacity-60 -mr-8 -mt-8"></div>
              <h1 className="text-2xl font-heading font-bold text-gray-900">
                Bonjour, {profile.prenom || "Membre"} 👋
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Voici un aperçu de l'activité du réseau agrolide aujourd'hui.
              </p>
            </div>

            {/* Quick Links / Shortcuts Grid */}
            <div className="bg-white p-5 rounded-2xl border border-gray-150 shadow-sm space-y-4">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Raccourcis rapides</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <Link href="/membres/annuaire" className="p-3 bg-blue-50/40 rounded-xl border border-blue-100/60 hover:bg-blue-50 transition-all flex flex-col items-center justify-center text-center gap-2 group">
                  <div className="w-9 h-9 rounded-lg bg-blue-500 text-white flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
                    <Users size={18} />
                  </div>
                  <span className="text-xs font-semibold text-gray-800">Annuaire</span>
                </Link>
                
                <Link href="/membres/bibliotheque" className="p-3 bg-purple-50/40 rounded-xl border border-purple-100/60 hover:bg-purple-50 transition-all flex flex-col items-center justify-center text-center gap-2 group">
                  <div className="w-9 h-9 rounded-lg bg-purple-500 text-white flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
                    <Library size={18} />
                  </div>
                  <span className="text-xs font-semibold text-gray-800">Bibliothèque</span>
                </Link>

                <Link href="/membres/forum" className="p-3 bg-amber-50/40 rounded-xl border border-amber-100/60 hover:bg-amber-50 transition-all flex flex-col items-center justify-center text-center gap-2 group">
                  <div className="w-9 h-9 rounded-lg bg-amber-500 text-white flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
                    <MessageSquare size={18} />
                  </div>
                  <span className="text-xs font-semibold text-gray-800">Forum</span>
                </Link>

                <Link href="/membres/evenements" className="p-3 bg-emerald-50/40 rounded-xl border border-emerald-100/60 hover:bg-emerald-50 transition-all flex flex-col items-center justify-center text-center gap-2 group">
                  <div className="w-9 h-9 rounded-lg bg-emerald-600 text-white flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
                    <CalendarIcon size={18} />
                  </div>
                  <span className="text-xs font-semibold text-gray-800">Événements</span>
                </Link>
              </div>
            </div>

            {/* Category Custom Section */}
            {profile.categorie === "junior" && (
              <div className="bg-white p-5 rounded-2xl border border-gray-150 shadow-sm space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                    <BookOpen size={16} className="text-purple-600" />
                    Mes Formations Recommandées
                  </h3>
                  <Link href="/membres/formations" className="text-xs font-bold text-emerald-600 hover:underline">
                    Tout voir
                  </Link>
                </div>
                
                {userFormations && userFormations.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {userFormations.map((f: any) => (
                      <Link href={`/membres/formations/${f.id}`} key={f.id} className="block group p-3.5 border border-gray-100 rounded-xl hover:border-emerald-200 hover:shadow-sm transition-all">
                        <span className="text-[10px] font-bold text-purple-600 uppercase tracking-wider">{f.niveau || "Tous niveaux"}</span>
                        <h4 className="font-heading font-bold text-gray-900 mt-1 text-sm group-hover:text-emerald-700 line-clamp-2 leading-snug">
                          {f.titre}
                        </h4>
                        <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-3">
                          <Clock size={12} />
                          <span>{f.duree || "Auto-formation"}</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 bg-gray-50/50 border border-dashed border-gray-200 rounded-xl">
                    <p className="text-xs text-gray-500 italic">Aucune formation recommandée pour l'instant.</p>
                  </div>
                )}
              </div>
            )}

            {profile.categorie === "professionnel" && (
              <div className="bg-white p-5 rounded-2xl border border-gray-150 shadow-sm space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                    <Briefcase size={16} className="text-blue-600" />
                    Opportunités récentes
                  </h3>
                  <Link href="/membres/opportunites" className="text-xs font-bold text-emerald-600 hover:underline">
                    Tout voir
                  </Link>
                </div>
                
                {userOpportunites && userOpportunites.length > 0 ? (
                  <div className="space-y-3">
                    {userOpportunites.map((o: any) => (
                      <Link href={`/membres/opportunites/${o.id}`} key={o.id} className="block group p-3.5 border border-gray-100 rounded-xl hover:border-emerald-200 hover:shadow-sm transition-all">
                        <div className="flex justify-between items-start gap-4">
                          <div>
                            <h4 className="font-heading font-bold text-gray-900 text-sm group-hover:text-emerald-700 leading-snug">
                              {o.titre}
                            </h4>
                            <p className="text-xs text-gray-500 mt-1">{o.entreprise} • {o.type_contrat || "CDI/CDD"}</p>
                          </div>
                          <span className="text-[10px] font-bold bg-blue-50 text-blue-800 px-2 py-0.5 rounded border border-blue-100 shrink-0">
                            {o.localisation || "A distance"}
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 bg-gray-50/50 border border-dashed border-gray-200 rounded-xl">
                    <p className="text-xs text-gray-500 italic">Aucune opportunité récente disponible dans votre secteur.</p>
                  </div>
                )}
              </div>
            )}

            {/* Articles feed */}
            <div className="bg-white p-5 rounded-2xl border border-gray-150 shadow-sm space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Publications & Actualités récentes</h3>
                <Link href="/blog" className="text-xs font-bold text-emerald-600 hover:underline">
                  Tout lire
                </Link>
              </div>

              {mappedArticles && mappedArticles.length > 0 ? (
                <div className="divide-y divide-gray-100">
                  {mappedArticles.map((article: any) => {
                    const pubDate = article.published_at ? new Date(article.published_at) : null
                    const isPubDateValid = pubDate && !isNaN(pubDate.getTime())
                    return (
                      <Link href={`/blog/${article.slug}`} key={article.slug} className="block py-4 first:pt-0 last:pb-0 group">
                        <div className="flex justify-between gap-4 items-start">
                          <div className="space-y-1">
                            <span className="text-[10px] font-bold text-amber-600 uppercase tracking-wider">{article.category}</span>
                            <h4 className="font-heading font-bold text-gray-900 text-sm sm:text-base leading-snug group-hover:text-emerald-700 transition-colors line-clamp-2">
                              {article.title}
                            </h4>
                            <div className="flex items-center text-[11px] text-gray-500 gap-3 pt-1">
                              <span className="flex items-center gap-1">
                                <Clock size={12} />
                                <span>{isPubDateValid ? pubDate.toLocaleDateString('fr-FR') : "Récemment"}</span>
                              </span>
                            </div>
                          </div>
                          <div className="p-2 border border-gray-100 rounded-lg group-hover:border-emerald-200 group-hover:bg-emerald-50/30 transition-colors shrink-0">
                            <ChevronRight size={16} className="text-gray-400 group-hover:text-emerald-700" />
                          </div>
                        </div>
                      </Link>
                    )
                  })}
                </div>
              ) : (
                <p className="text-xs text-gray-500 italic text-center py-4">Aucune publication récente.</p>
              )}
            </div>

          </div>

          {/* RIGHT COLUMN: Utility Widgets (Adhésion, Notifications & Events) */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* Membership/Cotisation integrated card */}
            <div className="bg-white rounded-2xl border border-gray-150 shadow-sm p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Adhésion</h3>
                {dateFinCotisation ? (
                  <span className="px-2 py-0.5 text-[10px] font-bold bg-green-50 text-green-700 rounded-full border border-green-200">
                    Active
                  </span>
                ) : (
                  <span className="px-2 py-0.5 text-[10px] font-bold bg-amber-50 text-amber-700 rounded-full border border-amber-200">
                    À régler
                  </span>
                )}
              </div>

              {dateFinCotisation ? (
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-gray-500">Date d'expiration</p>
                    <p className="font-semibold text-gray-900 text-sm mt-0.5">
                      {dateFinCotisation.toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div 
                      className="bg-emerald-600 h-2 rounded-full transition-all" 
                      style={{ width: `${Math.min(100, (joursRestants / 365) * 100)}%` }}
                    ></div>
                  </div>
                  <p className="text-[11px] text-gray-500 flex items-center gap-1.5">
                    <Clock size={12} className="text-emerald-600" />
                    <span>{joursRestants} jours restants</span>
                  </p>
                </div>
              ) : (
                <div className="space-y-3 text-center lg:text-left">
                  <p className="text-xs text-gray-600">
                    Veuillez régler votre cotisation annuelle pour bénéficier de l'ensemble des services.
                  </p>
                  <Link 
                    href="/membres/cotisation" 
                    className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-lg transition-colors"
                  >
                    <CreditCard size={14} />
                    <span>Régler ma cotisation</span>
                  </Link>
                </div>
              )}
            </div>
            
            {/* Notifications Widget */}
            <div className="bg-white p-5 rounded-2xl border border-gray-150 shadow-sm space-y-4">
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                <Bell size={15} className="text-emerald-600" />
                Notifications
              </h3>
              
              {notifsData && notifsData.length > 0 ? (
                <div className="space-y-3">
                  {notifsData.map((notif: any) => (
                    <div key={notif.id} className="p-3 bg-blue-50/30 border border-blue-100/50 rounded-xl text-xs relative flex flex-col gap-1">
                      <p className="text-gray-800 leading-normal">{notif.contenu}</p>
                      <span className="text-[10px] text-gray-400">
                        {new Date(notif.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  ))}
                  <Link href="/membres/notifications" className="block text-center text-xs font-bold text-emerald-600 hover:underline pt-2">
                    Voir toutes les notifications
                  </Link>
                </div>
              ) : (
                <div className="text-center py-6">
                  <p className="text-xs text-gray-400 italic">Aucune nouvelle notification.</p>
                </div>
              )}
            </div>

            {/* Events Widget */}
            <div className="bg-white p-5 rounded-2xl border border-gray-150 shadow-sm space-y-4">
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                <CalendarIcon size={15} className="text-emerald-600" />
                Agenda à venir
              </h3>

              {evtsData && evtsData.length > 0 ? (
                <div className="space-y-3">
                  {evtsData.map((evt: any) => {
                    const evtDate = evt.date_debut ? new Date(evt.date_debut) : null
                    const day = evtDate ? evtDate.getDate() : ""
                    const month = evtDate ? evtDate.toLocaleDateString('fr-FR', { month: 'short' }) : ""
                    return (
                      <div key={evt.id} className="flex gap-3 items-center p-2.5 border border-gray-50 rounded-xl hover:bg-gray-50/50 transition-colors">
                        <div className="w-11 h-11 bg-emerald-50 rounded-lg flex flex-col items-center justify-center shrink-0 border border-emerald-100/40">
                          <span className="text-xs font-extrabold text-emerald-800 leading-none">{day}</span>
                          <span className="text-[9px] font-bold text-emerald-600 uppercase mt-0.5 leading-none">{month}</span>
                        </div>
                        <div className="min-w-0">
                          <p className="font-heading font-bold text-gray-900 text-xs truncate leading-tight">{evt.titre}</p>
                          <span className="text-[10px] text-gray-500 block mt-0.5">{evt.type_evt || "Événement"}</span>
                        </div>
                      </div>
                    )
                  })}
                  <Link href="/membres/evenements" className="block text-center text-xs font-bold text-emerald-600 hover:underline pt-2">
                    Voir l'agenda complet
                  </Link>
                </div>
              ) : (
                <div className="text-center py-6">
                  <p className="text-xs text-gray-400 italic">Aucun événement prévu.</p>
                </div>
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
