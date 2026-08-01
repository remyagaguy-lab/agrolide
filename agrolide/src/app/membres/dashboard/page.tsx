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
      <div className="max-w-[1600px] mx-auto space-y-8 px-2 md:px-4 py-6">
        
        {/* Header / Welcome Area */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-heading font-bold text-[#1a1a1a] tracking-tight">
              Bonjour, {profile.prenom || "Membre"}
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Bienvenue sur votre espace personnel Agrolide.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 bg-white px-4 py-2.5 rounded-lg border border-[#e8e8e4] shadow-sm text-sm font-medium text-gray-600">
              <CalendarIcon size={16} className="text-gray-400" />
              <span>{new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
            </div>
            <Link href="/membres/profil/modifier" className="inline-flex items-center gap-2 px-5 py-2.5 bg-white border border-[#e8e8e4] text-gray-700 text-sm font-bold rounded-lg hover:bg-gray-50 shadow-sm transition-all">
              <span>Mettre à jour mon profil</span>
            </Link>
          </div>
        </div>

        {/* 12-Column Advanced Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* ================= ROW 1 ================= */}
          
          {/* COL 1: Adhésion & Stats (3/12) */}
          <div className="lg:col-span-3 space-y-6 flex flex-col">
            {/* Adhésion "Credit Card" */}
            <div className="bg-gradient-to-br from-[#1b5e38] to-[#0c361e] p-6 rounded-2xl shadow-lg text-white relative overflow-hidden flex flex-col justify-between min-h-[220px]">
              <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full blur-2xl -mr-12 -mt-12"></div>
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full blur-xl -ml-10 -mb-10"></div>
              
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-white/80 text-xs font-semibold uppercase tracking-wider mb-1">
                      Adhésion
                    </h3>
                    {dateFinCotisation ? (
                      <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-[10px] font-bold">
                        Actif • Premium
                      </span>
                    ) : (
                      <span className="inline-block px-3 py-1 bg-red-500/80 backdrop-blur-sm rounded-full text-[10px] font-bold text-white">
                        À renouveler
                      </span>
                    )}
                  </div>
                  <CreditCard className="text-white/60 opacity-80" size={24} />
                </div>

                <div>
                  <div className="text-3xl font-bold font-heading mb-1 tracking-tight">
                    {joursRestants} <span className="text-base font-normal text-white/80">jours</span>
                  </div>
                  {dateFinCotisation ? (
                    <p className="text-white/60 text-[11px] font-medium tracking-wide">Expire le {dateFinCotisation.toLocaleDateString('fr-FR')}</p>
                  ) : (
                    <Link href="/membres/cotisation" className="inline-block mt-2 text-xs font-bold text-[#fcb726] hover:text-white transition-colors">
                      Régler ma cotisation →
                    </Link>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Stats Block */}
            <div className="bg-white rounded-2xl shadow-sm border border-[#e8e8e4] p-6 flex-1 flex flex-col justify-center">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Mon Profil</h3>
              <div className="flex items-end justify-between">
                <div className="text-xl font-bold text-[#1a1a1a] capitalize">{profile.categorie}</div>
                <div className="px-2.5 py-1 bg-[#f0f7f0] text-[#1b5e38] text-[10px] font-bold rounded-md border border-[#c3dec4]">
                  Vérifié
                </div>
              </div>
            </div>
          </div>

          {/* COL 2: Featured Feed (Formations / Opportunités) (6/12) */}
          <div className="lg:col-span-6 bg-white rounded-2xl shadow-sm border border-[#e8e8e4] p-6 flex flex-col relative overflow-hidden">
            {/* Background Graphic Hint */}
            <div className="absolute right-0 bottom-0 w-64 h-64 bg-[#f0f7f0]/50 rounded-full blur-3xl -mr-20 -mb-20 pointer-events-none"></div>

            <div className="flex justify-between items-center mb-6 relative z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#f0f7f0] text-[#1b5e38] flex items-center justify-center">
                  {profile.categorie === "junior" ? <BookOpen size={18} /> : <Briefcase size={18} />}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 font-heading">
                    {profile.categorie === "junior" ? "Formations Recommandées" : "Opportunités du Secteur"}
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">Sélectionnées pour vous</p>
                </div>
              </div>
              <Link href={profile.categorie === "junior" ? "/membres/formations" : "/membres/opportunites"} className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-500 hover:bg-[var(--color-vert-profond)] hover:text-white transition-all shadow-sm">
                <ChevronRight size={16} />
              </Link>
            </div>
            
            <div className="flex-1 flex flex-col gap-4 justify-center relative z-10">
              {profile.categorie === "junior" && userFormations && userFormations.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {userFormations.slice(0, 4).map((f: any) => (
                    <Link href={`/membres/formations/${f.id}`} key={f.id} className="flex flex-col p-4 rounded-[20px] bg-[#f8faf8] hover:bg-[var(--color-vert-clair)]/50 transition-colors group">
                      <span className="text-[10px] font-bold text-[var(--color-orange-accent)] uppercase mb-2">{f.niveau || "Tous niveaux"}</span>
                      <h4 className="font-bold text-gray-900 text-sm leading-snug group-hover:text-[var(--color-vert-profond)] transition-colors line-clamp-2 mb-3">{f.titre}</h4>
                      <div className="mt-auto flex items-center gap-1.5 text-[11px] text-gray-500 font-medium">
                        <Clock size={12} />
                        <span>{f.duree || "Auto-formation"}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : profile.categorie === "professionnel" && userOpportunites && userOpportunites.length > 0 ? (
                <div className="space-y-3">
                  {userOpportunites.slice(0, 3).map((o: any) => (
                    <Link href={`/membres/opportunites/${o.id}`} key={o.id} className="flex items-center gap-4 p-4 rounded-[20px] bg-[#f8faf8] hover:bg-gray-50 transition-colors group border border-transparent hover:border-gray-200">
                      <div className="w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center shrink-0">
                        <Briefcase size={20} className="text-gray-400 group-hover:text-[var(--color-orange-accent)] transition-colors" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-gray-900 text-sm truncate group-hover:text-[var(--color-orange-accent)] transition-colors">{o.titre}</h4>
                        <p className="text-xs text-gray-500 mt-1">{o.entreprise}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="block text-[11px] font-bold text-gray-900 bg-white px-2 py-1 rounded-md shadow-sm border border-gray-100">{o.type_contrat || "CDI"}</span>
                        <span className="block text-[10px] text-gray-400 mt-1 truncate max-w-[80px]">{o.localisation || "A distance"}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10">
                  <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3">
                    <BookOpen size={24} className="text-gray-300" />
                  </div>
                  <p className="text-sm text-gray-400">Aucune nouveauté pour le moment.</p>
                </div>
              )}
            </div>
          </div>

          {/* COL 3: Agenda & Raccourcis (3/12) */}
          <div className="lg:col-span-3 space-y-6 flex flex-col">
            
            {/* Events Widget */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#e8e8e4] flex-1">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-base font-bold text-[#1a1a1a] font-heading">Agenda</h3>
                <Link href="/membres/evenements" className="text-[10px] font-bold text-[#1b5e38] uppercase tracking-wider bg-[#f0f7f0] px-2 py-1 rounded-md">Voir tout</Link>
              </div>

              {evtsData && evtsData.length > 0 ? (
                <div className="space-y-4">
                  {evtsData.slice(0, 3).map((evt: any) => {
                    const evtDate = evt.date_debut ? new Date(evt.date_debut) : null
                    const day = evtDate ? evtDate.getDate() : ""
                    const month = evtDate ? evtDate.toLocaleDateString('fr-FR', { month: 'short' }) : ""
                    return (
                      <Link href="/membres/evenements" key={evt.id} className="flex gap-4 items-center group">
                        <div className="w-12 h-12 bg-[#f8f8f6] border border-[#e8e8e4] rounded-xl flex flex-col items-center justify-center shrink-0 group-hover:bg-[#1b5e38] group-hover:text-white group-hover:border-[#1b5e38] transition-colors">
                          <span className="text-sm font-extrabold leading-none">{day}</span>
                          <span className="text-[9px] font-bold uppercase mt-1 leading-none opacity-80">{month}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-[#1a1a1a] text-sm truncate leading-tight group-hover:text-[#1b5e38] transition-colors">{evt.titre}</p>
                          <p className="text-[11px] text-gray-400 mt-1 truncate">{evt.type_evt || "Événement"}</p>
                        </div>
                      </Link>
                    )
                  })}
                </div>
              ) : (
                <div className="text-center py-6">
                  <p className="text-xs text-gray-400 italic">Aucun événement prévu.</p>
                </div>
              )}
            </div>

            {/* Floating Shortcuts */}
            <div className="bg-[#f8f8f6] border border-[#e8e8e4] rounded-2xl p-6 flex items-center justify-between relative overflow-hidden">
              <Link href="/membres/annuaire" className="w-12 h-12 rounded-xl bg-white border border-[#e8e8e4] text-[#1b5e38] hover:bg-[#1b5e38] hover:text-white hover:border-[#1b5e38] flex items-center justify-center transition-all shadow-sm" title="Annuaire">
                <Users size={20} />
              </Link>
              <Link href="/membres/bibliotheque" className="w-12 h-12 rounded-xl bg-white border border-[#e8e8e4] text-[#1b5e38] hover:bg-[#1b5e38] hover:text-white hover:border-[#1b5e38] flex items-center justify-center transition-all shadow-sm" title="Bibliothèque">
                <Library size={20} />
              </Link>
              <Link href="/membres/forum" className="w-12 h-12 rounded-xl bg-white border border-[#e8e8e4] text-[#1b5e38] hover:bg-[#1b5e38] hover:text-white hover:border-[#1b5e38] flex items-center justify-center transition-all shadow-sm" title="Forum">
                <MessageSquare size={20} />
              </Link>
            </div>

          </div>

          {/* ================= ROW 2 ================= */}

          {/* COL 1: Articles Table (8/12) */}
          <div className="lg:col-span-8 bg-white rounded-2xl shadow-sm border border-[#e8e8e4] p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-[#1a1a1a] font-heading">Actualités du réseau</h3>
              <Link href="/blog" className="text-xs font-bold text-gray-500 hover:text-gray-900 border border-[#e8e8e4] px-3 py-1.5 rounded-md flex items-center gap-1 transition-colors bg-white hover:bg-gray-50">
                Voir toutes <ChevronRight size={14} />
              </Link>
            </div>

            {mappedArticles && mappedArticles.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gray-100 text-[10px] uppercase tracking-wider text-gray-400">
                      <th className="pb-3 font-semibold w-2/5">Titre</th>
                      <th className="pb-3 font-semibold px-4 w-1/4">Catégorie</th>
                      <th className="pb-3 font-semibold px-4 w-1/5">Date</th>
                      <th className="pb-3 font-semibold text-right w-32">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mappedArticles.map((article: any, idx: number) => {
                      const pubDate = article.published_at ? new Date(article.published_at) : null
                      const isPubDateValid = pubDate && !isNaN(pubDate.getTime())
                      return (
                        <tr key={article.slug} className="group border-b border-gray-50 last:border-0 hover:bg-[#f8faf8] transition-colors">
                          <td className="py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-lg bg-[#f0f7f0] flex items-center justify-center shrink-0">
                                <BookOpen size={14} className="text-[#1b5e38]" />
                              </div>
                              <span className="font-bold text-[#1a1a1a] text-sm line-clamp-1 group-hover:text-[#1b5e38] transition-colors">
                                {article.title}
                              </span>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <span className="text-[10px] font-bold text-gray-600 bg-[#f8f8f6] px-2.5 py-1 rounded-md border border-[#e8e8e4]">
                              {article.category || "Général"}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-xs font-medium text-gray-500">
                            {isPubDateValid ? pubDate.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' }) : "Récemment"}
                          </td>
                          <td className="py-4 text-right">
                            <Link href={`/blog/${article.slug}`} className="inline-block text-[11px] font-bold text-[#1b5e38] hover:bg-[#f0f7f0] px-3 py-1.5 rounded-md transition-colors border border-transparent hover:border-[#c3dec4]">
                              Lire l'article
                            </Link>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-sm text-gray-400 text-center py-10">Aucune publication récente.</p>
            )}
          </div>

          {/* COL 2: Notifications (4/12) */}
          <div className="lg:col-span-4 bg-white p-6 rounded-2xl shadow-sm border border-[#e8e8e4]">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-base font-bold text-[#1a1a1a] font-heading">Activité récente</h3>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#f99e1d] animate-pulse"></span>
                <span className="text-xs font-medium text-gray-500">{notifsData?.length || 0} nouvelles</span>
              </div>
            </div>
            
            {notifsData && notifsData.length > 0 ? (
              <div className="space-y-4">
                {notifsData.map((notif: any) => (
                  <div key={notif.id} className="flex gap-4 items-start p-3 rounded-xl hover:bg-[#f8f8f6] transition-colors border border-transparent hover:border-[#e8e8e4]">
                    <div className="w-10 h-10 rounded-lg bg-[#fff8e6] text-[#f99e1d] flex items-center justify-center shrink-0 border border-[#fef3e2]">
                      <Bell size={16} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-800 leading-snug">{notif.contenu}</p>
                      <p className="text-[10px] font-bold text-gray-400 mt-1 uppercase tracking-wider">{new Date(notif.created_at).toLocaleDateString('fr-FR')}</p>
                    </div>
                  </div>
                ))}
                <Link href="/membres/notifications" className="block w-full py-2.5 text-center text-xs font-bold text-[#1a1a1a] bg-white border border-[#e8e8e4] rounded-lg hover:bg-[#f8f8f6] transition-colors mt-2">
                  Gérer les notifications
                </Link>
              </div>
            ) : (
              <div className="text-center py-10">
                 <Bell size={24} className="mx-auto text-gray-200 mb-2" />
                 <p className="text-xs text-gray-400">Aucune notification.</p>
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
