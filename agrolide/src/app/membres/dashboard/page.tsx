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
import { NetworkActivityChart, ProfileCompletionChart } from "./DashboardCharts"

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
      <div className="max-w-[1600px] mx-auto space-y-6 px-2 md:px-4 py-6">
        
        {/* Header / Welcome Area */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-heading font-bold text-[#1a1a1a] tracking-tight">
              Tableau de bord
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Bonjour {profile.prenom || "Membre"}, voici votre résumé d'activité.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 bg-white px-4 py-2 rounded-lg border border-[#e8e8e4] shadow-sm text-xs font-medium text-gray-600">
              <CalendarIcon size={14} className="text-gray-400" />
              <span>{new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
            </div>
            <Link href="/membres/profil/modifier" className="inline-flex items-center gap-2 px-4 py-2 bg-[#1b5e38] text-white text-xs font-bold rounded-lg hover:bg-[#144a2c] shadow-sm transition-all">
              <span>Mettre à jour le profil</span>
            </Link>
          </div>
        </div>

        {/* MAIN GRID */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          
          {/* ================= COLONNE GAUCHE (Main Content) - 8/12 ================= */}
          <div className="xl:col-span-8 space-y-6">
            
            {/* 1. TOP METRICS (4 Cards) */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Card 1: Adhésion */}
              <div className="bg-white p-4 rounded-2xl border border-[#e8e8e4] shadow-sm flex flex-col justify-between h-28">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2 text-gray-500">
                    <CreditCard size={14} />
                    <span className="text-xs font-semibold">Adhésion</span>
                  </div>
                  {dateFinCotisation ? (
                    <span className="text-[9px] font-bold text-green-700 bg-green-50 px-2 py-0.5 rounded uppercase">Actif</span>
                  ) : (
                    <span className="text-[9px] font-bold text-red-700 bg-red-50 px-2 py-0.5 rounded uppercase">Inactif</span>
                  )}
                </div>
                <div>
                  <div className="text-2xl font-bold font-heading text-[#1a1a1a] leading-none mb-1">
                    {joursRestants} <span className="text-xs font-normal text-gray-400">Jours</span>
                  </div>
                </div>
              </div>

              {/* Card 2: Formations */}
              <div className="bg-white p-4 rounded-2xl border border-[#e8e8e4] shadow-sm flex flex-col justify-between h-28">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2 text-gray-500">
                    <BookOpen size={14} />
                    <span className="text-xs font-semibold">Formations</span>
                  </div>
                  <span className="text-[9px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded uppercase">New</span>
                </div>
                <div>
                  <div className="text-2xl font-bold font-heading text-[#1a1a1a] leading-none mb-1">
                    {profile.categorie === "junior" ? (userFormations?.length || 0) : 0}
                  </div>
                  <p className="text-[10px] text-gray-400">Recommandées</p>
                </div>
              </div>

              {/* Card 3: Opportunités */}
              <div className="bg-white p-4 rounded-2xl border border-[#e8e8e4] shadow-sm flex flex-col justify-between h-28">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2 text-gray-500">
                    <Briefcase size={14} />
                    <span className="text-xs font-semibold">Opportunités</span>
                  </div>
                  <span className="text-[9px] font-bold text-[#f99e1d] bg-orange-50 px-2 py-0.5 rounded uppercase">Hiring</span>
                </div>
                <div>
                  <div className="text-2xl font-bold font-heading text-[#1a1a1a] leading-none mb-1">
                    {profile.categorie === "professionnel" ? (userOpportunites?.length || 0) : 0}
                  </div>
                  <p className="text-[10px] text-gray-400">Offres disponibles</p>
                </div>
              </div>

              {/* Card 4: Articles */}
              <div className="bg-white p-4 rounded-2xl border border-[#e8e8e4] shadow-sm flex flex-col justify-between h-28">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2 text-gray-500">
                    <Library size={14} />
                    <span className="text-xs font-semibold">Ressources</span>
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-bold font-heading text-[#1a1a1a] leading-none mb-1">
                    {mappedArticles?.length || 0}
                  </div>
                  <p className="text-[10px] text-gray-400">Actualités du réseau</p>
                </div>
              </div>
            </div>

            {/* 2. MAIN CHART (Activité) */}
            <div className="bg-white p-6 rounded-2xl border border-[#e8e8e4] shadow-sm">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-sm font-bold text-[#1a1a1a] font-heading">Activité du profil</h3>
                <div className="flex gap-3 text-[10px] font-medium text-gray-500">
                  <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-[#1b5e38]"></span> Vues</span>
                  <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-[#878e2c]"></span> Interactions</span>
                </div>
              </div>
              <NetworkActivityChart />
            </div>

            {/* 3. RECENT TRANSACTIONS / ACTUALITES */}
            <div className="bg-white rounded-2xl border border-[#e8e8e4] shadow-sm p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-sm font-bold text-[#1a1a1a] font-heading">Actualités Récentes</h3>
                <Link href="/blog" className="text-xs font-medium text-gray-500 hover:text-gray-900 border border-[#e8e8e4] px-3 py-1.5 rounded-md hover:bg-gray-50 transition-colors">Voir tout</Link>
              </div>
              {mappedArticles && mappedArticles.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-gray-100 text-[10px] uppercase tracking-wider text-gray-400">
                        <th className="pb-3 font-semibold w-1/2">Sujet</th>
                        <th className="pb-3 font-semibold px-4">Date</th>
                        <th className="pb-3 font-semibold text-right">Statut</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mappedArticles.map((article: any) => {
                        const pubDate = article.published_at ? new Date(article.published_at) : null
                        const isPubDateValid = pubDate && !isNaN(pubDate.getTime())
                        return (
                          <tr key={article.slug} className="border-b border-gray-50 last:border-0 hover:bg-[#f8f8f6] transition-colors group">
                            <td className="py-3">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center shrink-0 border border-[#e8e8e4] text-[#1b5e38]">
                                  <BookOpen size={12} />
                                </div>
                                <div>
                                  <Link href={`/blog/${article.slug}`} className="font-bold text-xs text-[#1a1a1a] line-clamp-1 group-hover:text-[#1b5e38] transition-colors">
                                    {article.title}
                                  </Link>
                                  <p className="text-[10px] text-gray-500 mt-0.5">{article.category || "Général"}</p>
                                </div>
                              </div>
                            </td>
                            <td className="py-3 px-4 text-[11px] font-medium text-gray-500">
                              {isPubDateValid ? pubDate.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' }) : "Récemment"}
                            </td>
                            <td className="py-3 text-right">
                              <span className="text-[9px] font-bold text-green-700 bg-green-50 px-2 py-1 rounded uppercase">Publié</span>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-xs text-gray-400 text-center py-6">Aucune actualité.</p>
              )}
            </div>

          </div>

          {/* ================= COLONNE DROITE (Sidebar) - 4/12 ================= */}
          <div className="xl:col-span-4 space-y-6">
            
            {/* 1. PIE CHART & SCORE */}
            <div className="bg-white p-6 rounded-2xl border border-[#e8e8e4] shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-bold text-[#1a1a1a] font-heading">Complétion du Profil</h3>
              </div>
              <ProfileCompletionChart />
              <div className="mt-4 flex flex-col gap-2 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 flex items-center gap-2"><span className="w-2.5 h-2.5 rounded bg-[#50a853]"></span> Infos Renseignées</span>
                  <span className="font-bold text-gray-800">85%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 flex items-center gap-2"><span className="w-2.5 h-2.5 rounded bg-[#f0f7f0] border border-[#e8e8e4]"></span> Infos Manquantes</span>
                  <span className="font-bold text-gray-800">15%</span>
                </div>
              </div>
            </div>

            {/* 2. PROCHAIN EVENEMENT (Styled like Balance) */}
            <div className="bg-[#1b5e38] p-6 rounded-2xl shadow-sm text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl -mr-10 -mt-10"></div>
              <div className="relative z-10 flex flex-col h-full justify-between gap-6">
                <div className="flex justify-between items-start">
                  <span className="text-xs text-white/70 font-medium">Prochain Événement</span>
                  <CalendarIcon size={16} className="text-white/50" />
                </div>
                
                {evtsData && evtsData.length > 0 ? (
                  <div>
                    <h4 className="text-lg font-bold font-heading leading-snug mb-1.5">{evtsData[0].titre}</h4>
                    <p className="text-xs text-white/80">{new Date(evtsData[0].date_debut).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
                  </div>
                ) : (
                  <div>
                    <h4 className="text-sm font-bold font-heading mb-1.5">Aucun événement prévu</h4>
                    <p className="text-xs text-white/80">Restez à l'écoute</p>
                  </div>
                )}
              </div>
            </div>

            {/* 3. SAVING PLANS (Formations en cours) */}
            <div className="bg-white p-6 rounded-2xl border border-[#e8e8e4] shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-sm font-bold text-[#1a1a1a] font-heading">Parcours</h3>
                <Link href="/membres/formations" className="text-[10px] font-bold text-[#1b5e38] bg-[#f0f7f0] hover:bg-[#e3f0e3] transition-colors px-2 py-1 rounded">Continuer</Link>
              </div>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-[11px] font-medium mb-1.5">
                    <span className="text-gray-800">Agroécologie Pratique</span>
                    <span className="text-gray-500">60%</span>
                  </div>
                  <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-[#50a853] rounded-full" style={{ width: '60%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-[11px] font-medium mb-1.5">
                    <span className="text-gray-800">Gestion financière</span>
                    <span className="text-gray-500">25%</span>
                  </div>
                  <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-[#1b5e38] rounded-full" style={{ width: '25%' }}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* 4. RECENT ACTIVITIES (Timeline) */}
            <div className="bg-white p-6 rounded-2xl border border-[#e8e8e4] shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-sm font-bold text-[#1a1a1a] font-heading">Notifications</h3>
                <span className="w-1.5 h-1.5 rounded-full bg-[#f99e1d]"></span>
              </div>
              {notifsData && notifsData.length > 0 ? (
                <div className="relative pl-3.5 border-l border-gray-100 space-y-5">
                  {notifsData.map((notif: any) => (
                    <div key={notif.id} className="relative">
                      <div className="absolute -left-[19px] top-0.5 w-2.5 h-2.5 bg-white border-[2.5px] border-[#1b5e38] rounded-full"></div>
                      <div>
                        <p className="text-[11px] font-medium text-gray-800 leading-snug">{notif.contenu}</p>
                        <p className="text-[9px] text-gray-400 mt-1 uppercase tracking-wider">{new Date(notif.created_at).toLocaleDateString('fr-FR')}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-gray-400 text-center py-4">Rien à signaler.</p>
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
