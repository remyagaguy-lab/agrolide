import { redirect } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { 
  Bell, 
  Calendar as CalendarIcon, 
  Briefcase, 
  BookOpen, 
  Clock, 
  Library, 
  CreditCard,
  User as UserIcon,
  ChevronRight,
  TrendingUp,
  MapPin
} from "lucide-react"
import { auth } from "@clerk/nextjs/server"
import { db } from "@/db"
import { users, notifications, evenements, articles, opportunites, cotisations } from "@/db/schema"
import { eq, desc, gte } from "drizzle-orm"

export const metadata = { title: "Tableau de bord" }

export default async function DashboardPage() {
  try {
    const { userId } = await auth()
    if (!userId) redirect("/login")

    // Fetch Profile
    const userRows = await db.select({
      id: users.id,
      prenom: users.prenom,
      nom: users.nom,
      photo_url: users.photo_url,
      categorie: users.categorie,
      specialite: users.specialite,
      organisation: users.organisation,
      ville: users.ville,
      pays: users.pays
    })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1)

    const profile = userRows[0] || null
    if (!profile) redirect("/login")

    // Fetch Cotisation
    const userCotisation = await db.query.cotisations.findFirst({
      where: eq(cotisations.membre_id, userId),
      orderBy: [desc(cotisations.created_at)]
    })
    const dateFinRaw = userCotisation?.date_fin ? new Date(userCotisation.date_fin) : null
    const dateFinCotisation = (dateFinRaw && !isNaN(dateFinRaw.getTime())) ? dateFinRaw : null
    const joursRestants = dateFinCotisation 
      ? Math.max(0, Math.ceil((dateFinCotisation.getTime() - new Date().getTime()) / (1000 * 3600 * 24)))
      : 0

    // Fetch Events
    const evtsData = await db.query.evenements.findMany({
      where: gte(evenements.date_debut, new Date().toISOString()),
      orderBy: (evts, { asc }) => [asc(evts.date_debut)],
      limit: 1
    })
    const prochainEvt = evtsData[0] || null

    // Fetch Opportunites
    const oppsData = await db.query.opportunites.findMany({
      orderBy: [desc(opportunites.created_at)],
      limit: 4
    })

    // Fetch Articles
    const artsData = await db.query.articles.findMany({
      where: eq(articles.statut, "publie"),
      orderBy: [desc(articles.published_at)],
      limit: 4
    })

    // Fetch Notifications
    const notifsData = await db.query.notifications.findMany({
      where: eq(notifications.user_id, userId),
      orderBy: [desc(notifications.created_at)],
      limit: 5
    })

    return (
      <div className="h-full flex flex-col space-y-4">
        
        {/* HEADER */}
        <div className="flex justify-between items-end shrink-0">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-[#1a1a1a] font-heading leading-tight" style={{ textWrap: 'balance' }}>
              Tableau de bord
            </h1>
            <p className="text-[11px] text-gris-muted font-medium mt-0.5">
              Aperçu de vos activités et opportunités Agrolide.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="hidden md:flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-lg shadow-[0_1px_3px_rgba(0,0,0,0.04),0_1px_2px_rgba(0,0,0,0.06)] text-[11px] font-bold text-gray-600 uppercase tracking-wider tabular-nums">
              <CalendarIcon size={12} className="text-gray-400" />
              <span>{new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
            </div>
          </div>
        </div>

        {/* MAIN GRID - 2 COLUMNS FOR COINEST STYLE */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 flex-1 min-h-0">
          
          {/* ================= LEFT MAIN AREA (8/12) ================= */}
          <div className="xl:col-span-8 flex flex-col gap-4 min-h-0">
            
            {/* TOP WIDGETS ROW: Profile + 3 KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 shrink-0">
              
              {/* Adhésion Status (takes 1 col, but more prominent) */}
              <div className="bg-[#1b5e38] rounded-2xl shadow-sm p-4 text-white relative overflow-hidden flex flex-col justify-between h-28">
                <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full blur-xl -mr-8 -mt-8"></div>
                <div className="relative z-10 flex justify-between items-start">
                  <div className="flex items-center gap-1.5 text-white/80">
                    <CreditCard size={12} strokeWidth={1.5} />
                    <span className="text-[11px] font-bold uppercase tracking-wider">Adhésion</span>
                  </div>
                  {dateFinCotisation ? (
                    <span className="text-[9px] font-bold bg-white/20 px-1.5 py-0.5 rounded-md text-white">Actif</span>
                  ) : (
                    <span className="text-[9px] font-bold bg-red-500/20 px-1.5 py-0.5 rounded-md text-red-200">Inactif</span>
                  )}
                </div>
                <div className="relative z-10 flex items-end justify-between mt-auto">
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold font-heading leading-none tabular-nums">{joursRestants}</span>
                    <span className="text-[11px] text-white/60 font-medium">Jours restants</span>
                  </div>
                  <Link href="/membres/cotisation" className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/40 active:scale-[0.96] transition-[background-color,transform]">
                    <ChevronRight size={14} className="text-white" />
                  </Link>
                </div>
              </div>

              {/* KPI 1 */}
              <div className="bg-white p-4 rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.04),0_1px_2px_rgba(0,0,0,0.06)] hover:shadow-[0_2px_8px_rgba(0,0,0,0.08)] transition-shadow flex flex-col justify-between h-28">
                <div className="flex justify-between items-start">
                  <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Formations</span>
                  <div className="w-6 h-6 rounded-lg bg-blue-50 flex items-center justify-center">
                    <BookOpen size={12} strokeWidth={1.5} className="text-blue-600" />
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-bold font-heading text-[#1a1a1a] leading-none tabular-nums">5</div>
                  <div className="text-[11px] text-gray-500 mt-1 font-medium">En cours ou terminées</div>
                </div>
              </div>

              {/* KPI 2 */}
              <div className="bg-white p-4 rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.04),0_1px_2px_rgba(0,0,0,0.06)] hover:shadow-[0_2px_8px_rgba(0,0,0,0.08)] transition-shadow flex flex-col justify-between h-28">
                <div className="flex justify-between items-start">
                  <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Opportunités</span>
                  <div className="w-6 h-6 rounded-lg bg-orange-50 flex items-center justify-center">
                    <Briefcase size={12} strokeWidth={1.5} className="text-orange-600" />
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-bold font-heading text-[#1a1a1a] leading-none tabular-nums">{oppsData.length}</div>
                  <div className="text-[11px] text-gray-500 mt-1 font-medium">Postes & Missions</div>
                </div>
              </div>

              {/* KPI 3 */}
              <div className="bg-white p-4 rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.04),0_1px_2px_rgba(0,0,0,0.06)] hover:shadow-[0_2px_8px_rgba(0,0,0,0.08)] transition-shadow flex flex-col justify-between h-28">
                <div className="flex justify-between items-start">
                  <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Actualités</span>
                  <div className="w-6 h-6 rounded-lg bg-[#f0f7f0] flex items-center justify-center">
                    <Library size={12} strokeWidth={1.5} className="text-[#1b5e38]" />
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-bold font-heading text-[#1a1a1a] leading-none tabular-nums">{artsData.length}</div>
                  <div className="text-[11px] text-gray-500 mt-1 font-medium">Ressources publiées</div>
                </div>
              </div>

            </div>

            {/* Opportunités Table */}
            <div className="bg-white rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.04),0_1px_2px_rgba(0,0,0,0.06)] flex flex-col flex-1 min-h-0 overflow-hidden">
              <div className="p-4 border-b border-gris-border flex justify-between items-center shrink-0">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#1b5e38]"></div>
                  <h3 className="text-xs font-bold text-[#1a1a1a] uppercase tracking-wider">Dernières Opportunités</h3>
                </div>
                <div className="flex gap-2">
                  <Link href="/membres/opportunites" className="text-[11px] px-2.5 py-1 bg-gray-50 border border-gris-border rounded-lg font-bold text-gray-500 hover:text-[#1b5e38] transition-[color]">Tout voir</Link>
                </div>
              </div>
              <div className="overflow-y-auto custom-scrollbar p-2 flex-1">
                <table className="w-full text-left">
                  <thead className="bg-[#fcfdfc] sticky top-0 z-10">
                    <tr className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                      <th className="px-4 py-3 border-b border-[#e8e8e4]">Titre & Entreprise</th>
                      <th className="px-4 py-3 border-b border-[#e8e8e4]">Localisation</th>
                      <th className="px-4 py-3 border-b border-[#e8e8e4]">Date</th>
                      <th className="px-4 py-3 border-b border-[#e8e8e4] text-right">Statut</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#e8e8e4]">
                    {oppsData.map((opp: any) => (
                      <tr key={opp.id} className="hover:bg-gray-50 transition-[background-color] group">
                        <td className="px-4 py-3">
                          <Link href="/membres/opportunites" className="block">
                            <p className="text-xs font-bold text-[#1a1a1a] line-clamp-1 group-hover:text-[#1b5e38] transition-colors">{opp.titre}</p>
                            <p className="text-[10px] text-gray-500 mt-1 flex items-center gap-1 font-medium">
                              <Briefcase size={10} /> {opp.entreprise}
                            </p>
                          </Link>
                        </td>
                        <td className="px-4 py-3 text-[11px] text-gray-500 font-medium">
                          {opp.localisation}
                        </td>
                        <td className="px-4 py-3 text-[10px] text-gray-400 font-bold uppercase">
                          {new Date(opp.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <span className="inline-block px-2 py-1 bg-[#dff0e0] text-[#1b5e38] rounded-md text-[9px] font-bold uppercase tracking-wider">
                            {opp.type}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>

          {/* ================= RIGHT SIDEBAR AREA (4/12) ================= */}
          <div className="xl:col-span-4 flex flex-col gap-4 min-h-0">
            
            {/* Prochain Evenement */}
            <div className="bg-[#1a1a1a] rounded-2xl shadow-sm p-5 text-white shrink-0 relative overflow-hidden">
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#1b5e38]/30 rounded-full blur-2xl"></div>
              <div className="relative z-10">
                <div className="flex justify-between items-center mb-5">
                  <div className="flex items-center gap-2 text-gray-400">
                    <CalendarIcon size={14} />
                    <span className="text-[10px] font-bold uppercase tracking-wider">Événement à venir</span>
                  </div>
                  <div className="w-1.5 h-1.5 rounded-full bg-[#50a853] animate-pulse will-change-[opacity]"></div>
                </div>
                {prochainEvt ? (
                  <>
                    <h4 className="text-base font-bold font-heading leading-snug mb-2">{prochainEvt.titre}</h4>
                    <p className="text-xs text-gray-300 mb-5 font-medium">{new Date(prochainEvt.date_debut).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', hour: '2-digit', minute:'2-digit' })}</p>
                    <Link href="/membres/evenements" className="inline-flex items-center justify-center w-full py-2 bg-[#1b5e38] hover:bg-[#144a2c] text-white rounded-xl text-[11px] font-bold transition-colors">
                      Voir les détails
                    </Link>
                  </>
                ) : (
                  <>
                    <h4 className="text-sm font-bold text-gray-300 mb-1">Aucun événement prévu</h4>
                    <p className="text-[10px] text-gray-500">Restez à l'écoute pour les prochaines annonces.</p>
                  </>
                )}
              </div>
            </div>

            {/* Notifications Timeline */}
            <div className="bg-white rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.04),0_1px_2px_rgba(0,0,0,0.06)] p-4 flex-1 flex flex-col min-h-0 overflow-hidden">
              <div className="flex justify-between items-center mb-4 shrink-0">
                <h3 className="text-[11px] font-bold text-[#1a1a1a] uppercase tracking-wider">Activités Récentes</h3>
                <Link href="/membres/notifications" className="text-gray-400 hover:text-[#1b5e38]"><ChevronRight size={14}/></Link>
              </div>
              <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 relative">
                <div className="absolute left-[7px] top-2 bottom-2 w-px bg-[#e8e8e4]"></div>
                <div className="space-y-4 py-1">
                  {notifsData && notifsData.length > 0 ? (
                    notifsData.map((notif: any) => (
                      <div key={notif.id} className="relative pl-6">
                        <div className="absolute left-0 top-1.5 w-[15px] h-[15px] bg-[#dff0e0] border-2 border-white rounded-full flex items-center justify-center">
                          <div className="w-1.5 h-1.5 bg-[#1b5e38] rounded-full"></div>
                        </div>
                        <p className="text-[11px] font-bold text-[#1a1a1a] leading-snug">{notif.titre}</p>
                        <p className="text-[10px] font-medium text-gray-500 mt-0.5 line-clamp-1">{notif.contenu}</p>
                        <p className="text-[9px] text-gray-400 mt-1 font-bold tracking-wider">{new Date(notif.created_at).toLocaleDateString('fr-FR')}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-[10px] text-gray-400 text-center py-4">Rien à signaler.</p>
                  )}
                </div>
              </div>
            </div>

            {/* Articles Récents */}
            <div className="bg-white rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.04),0_1px_2px_rgba(0,0,0,0.06)] flex flex-col shrink-0">
              <div className="px-4 py-3 border-b border-gris-border flex justify-between items-center shrink-0 bg-[#fcfdfc] rounded-t-2xl">
                <h3 className="text-[11px] font-bold text-[#1a1a1a] uppercase tracking-wider">Dernières Ressources</h3>
              </div>
              <div className="p-2 flex flex-col gap-1">
                {artsData.map((art: any) => (
                  <Link key={art.id} href="/membres/bibliotheque" className="flex items-center gap-3 p-2 hover:bg-gris-fond rounded-xl transition-[background-color]">
                    <div className="w-8 h-8 rounded-lg bg-[#f4f8f4] flex items-center justify-center shrink-0">
                      <BookOpen size={12} className="text-[#1b5e38]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] font-bold text-[#1a1a1a] truncate">{art.titre}</p>
                      <p className="text-[9px] text-gray-500 uppercase tracking-wider font-bold mt-0.5">{art.categorie || "Article"}</p>
                    </div>
                  </Link>
                ))}
              </div>
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
