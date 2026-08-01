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
      limit: 3
    })

    // Fetch Notifications
    const notifsData = await db.query.notifications.findMany({
      where: eq(notifications.user_id, userId),
      orderBy: [desc(notifications.created_at)],
      limit: 4
    })

    return (
      <div className="h-[calc(100vh-80px)] max-h-screen overflow-hidden max-w-[1400px] mx-auto flex flex-col px-2 md:px-4 py-4 space-y-4">
        
        {/* HEADER */}
        <div className="flex justify-between items-end shrink-0">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-[#1a1a1a] font-heading leading-tight">
              Tableau de bord
            </h1>
            <p className="text-[11px] text-gray-500 font-medium mt-0.5">
              Bienvenue sur votre espace Agrolide, {profile.prenom || "Membre"}.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="hidden md:flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-lg border border-[#e8e8e4] shadow-sm text-[10px] font-bold text-gray-600 uppercase tracking-wider">
              <CalendarIcon size={12} className="text-gray-400" />
              <span>{new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
            </div>
          </div>
        </div>

        {/* MAIN GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 flex-1 min-h-0">
          
          {/* ================= COLONNE GAUCHE (3/12) ================= */}
          <div className="lg:col-span-3 flex flex-col gap-4 min-h-0">
            
            {/* Profil Info */}
            <div className="bg-white rounded-2xl border border-[#e8e8e4] shadow-sm p-4 flex flex-col items-center text-center shrink-0">
              <div className="w-16 h-16 rounded-full bg-[#f0f7f0] border-2 border-white shadow-sm flex items-center justify-center overflow-hidden mb-3 ring-1 ring-[#c3dec4]">
                {profile.photo_url ? (
                  <Image src={profile.photo_url} alt="Avatar" width={64} height={64} className="object-cover w-full h-full" />
                ) : (
                  <UserIcon size={24} className="text-[#1b5e38]" />
                )}
              </div>
              <h2 className="text-sm font-bold text-[#1a1a1a]">{profile.prenom} {profile.nom}</h2>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mt-0.5">{profile.specialite || "Non spécifié"}</p>
              <div className="mt-2 inline-flex px-2 py-0.5 bg-[#f0f7f0] text-[#1b5e38] rounded text-[9px] font-bold uppercase border border-[#c3dec4]">
                Membre {profile.categorie}
              </div>
            </div>

            {/* Adhésion Status */}
            <div className="bg-[#1b5e38] rounded-2xl shadow-sm p-4 text-white shrink-0 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full blur-xl -mr-8 -mt-8"></div>
              <div className="relative z-10">
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center gap-1.5 text-white/80">
                    <CreditCard size={12} />
                    <span className="text-[10px] font-bold uppercase tracking-wider">Adhésion</span>
                  </div>
                  {dateFinCotisation ? (
                    <span className="text-[9px] font-bold bg-white/20 px-1.5 py-0.5 rounded text-white">Actif</span>
                  ) : (
                    <span className="text-[9px] font-bold bg-red-500/20 px-1.5 py-0.5 rounded text-red-200">Inactif</span>
                  )}
                </div>
                <div className="flex items-baseline gap-1 mb-3">
                  <span className="text-2xl font-bold font-heading">{joursRestants}</span>
                  <span className="text-[10px] text-white/60 font-medium">Jours restants</span>
                </div>
                <Link href="/membres/cotisation" className="block w-full py-1.5 bg-white text-[#1b5e38] text-center rounded-lg text-[10px] font-bold hover:bg-gray-50 transition-colors shadow-sm">
                  Gérer ma cotisation
                </Link>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl border border-[#e8e8e4] shadow-sm p-3 flex-1 flex flex-col justify-center gap-2">
              <Link href="/membres/profil/modifier" className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg transition-colors border border-transparent hover:border-[#e8e8e4]">
                <div className="flex items-center gap-2 text-gray-600">
                  <UserIcon size={14} className="text-gray-400" />
                  <span className="text-[11px] font-bold">Modifier mon profil</span>
                </div>
                <ChevronRight size={14} className="text-gray-300" />
              </Link>
              <Link href="/membres/annuaire" className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg transition-colors border border-transparent hover:border-[#e8e8e4]">
                <div className="flex items-center gap-2 text-gray-600">
                  <Library size={14} className="text-gray-400" />
                  <span className="text-[11px] font-bold">Annuaire des membres</span>
                </div>
                <ChevronRight size={14} className="text-gray-300" />
              </Link>
            </div>
          </div>

          {/* ================= COLONNE CENTRE (6/12) ================= */}
          <div className="lg:col-span-6 flex flex-col gap-4 min-h-0">
            
            {/* KPI Cards */}
            <div className="grid grid-cols-3 gap-3 shrink-0">
              <div className="bg-white p-3 rounded-2xl border border-[#e8e8e4] shadow-sm flex flex-col justify-between h-20">
                <div className="flex justify-between items-center">
                  <BookOpen size={12} className="text-gray-400" />
                  <span className="text-[8px] font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded uppercase border border-blue-100">Formations</span>
                </div>
                <div>
                  <div className="text-sm font-bold text-[#1a1a1a]">5 En cours</div>
                </div>
              </div>
              <div className="bg-white p-3 rounded-2xl border border-[#e8e8e4] shadow-sm flex flex-col justify-between h-20">
                <div className="flex justify-between items-center">
                  <Briefcase size={12} className="text-gray-400" />
                  <span className="text-[8px] font-bold text-orange-600 bg-orange-50 px-1.5 py-0.5 rounded uppercase border border-orange-100">Jobs</span>
                </div>
                <div>
                  <div className="text-sm font-bold text-[#1a1a1a]">{oppsData.length} Dispos</div>
                </div>
              </div>
              <div className="bg-white p-3 rounded-2xl border border-[#e8e8e4] shadow-sm flex flex-col justify-between h-20">
                <div className="flex justify-between items-center">
                  <Library size={12} className="text-gray-400" />
                  <span className="text-[8px] font-bold text-[#1b5e38] bg-[#f0f7f0] px-1.5 py-0.5 rounded uppercase border border-[#c3dec4]">News</span>
                </div>
                <div>
                  <div className="text-sm font-bold text-[#1a1a1a]">{artsData.length} Récents</div>
                </div>
              </div>
            </div>

            {/* Opportunités Table */}
            <div className="bg-white rounded-2xl border border-[#e8e8e4] shadow-sm flex flex-col flex-1 min-h-0 overflow-hidden">
              <div className="p-3 border-b border-[#e8e8e4] flex justify-between items-center shrink-0">
                <h3 className="text-[11px] font-bold text-[#1a1a1a] uppercase tracking-wider">Dernières Opportunités</h3>
                <Link href="/membres/opportunites" className="text-[10px] font-bold text-gray-500 hover:text-[#1b5e38]">Voir tout &rarr;</Link>
              </div>
              <div className="overflow-y-auto custom-scrollbar p-1 flex-1">
                <table className="w-full text-left">
                  <thead className="bg-[#f8faf8] sticky top-0 z-10">
                    <tr className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">
                      <th className="px-3 py-2 border-b border-[#e8e8e4]">Titre & Entreprise</th>
                      <th className="px-3 py-2 border-b border-[#e8e8e4]">Localisation</th>
                      <th className="px-3 py-2 border-b border-[#e8e8e4] text-right">Type</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#e8e8e4]">
                    {oppsData.map((opp: any) => (
                      <tr key={opp.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-3 py-2.5">
                          <Link href="/membres/opportunites" className="block">
                            <p className="text-[11px] font-bold text-[#1a1a1a] line-clamp-1">{opp.titre}</p>
                            <p className="text-[9px] text-gray-500 mt-0.5 flex items-center gap-1">
                              <Briefcase size={8} /> {opp.entreprise}
                            </p>
                          </Link>
                        </td>
                        <td className="px-3 py-2.5 text-[10px] text-gray-500">
                          {opp.localisation}
                        </td>
                        <td className="px-3 py-2.5 text-right">
                          <span className="inline-block px-1.5 py-0.5 bg-[#f0f7f0] border border-[#c3dec4] text-[#1b5e38] rounded text-[8px] font-bold uppercase">
                            {opp.type}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Articles Récents */}
            <div className="bg-white rounded-2xl border border-[#e8e8e4] shadow-sm flex flex-col h-40 shrink-0">
              <div className="px-3 py-2 border-b border-[#e8e8e4] flex justify-between items-center shrink-0">
                <h3 className="text-[11px] font-bold text-[#1a1a1a] uppercase tracking-wider">Bibliothèque & Ressources</h3>
              </div>
              <div className="flex-1 overflow-y-auto custom-scrollbar p-2 flex flex-col gap-2">
                {artsData.map((art: any) => (
                  <Link key={art.id} href="/membres/bibliotheque" className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg border border-transparent hover:border-[#e8e8e4] transition-all">
                    <div className="w-8 h-8 rounded bg-gray-100 flex items-center justify-center shrink-0 text-gray-400">
                      <BookOpen size={12} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] font-bold text-[#1a1a1a] truncate">{art.titre}</p>
                      <p className="text-[9px] text-gray-500 uppercase tracking-wider font-bold">{art.categorie || "Article"}</p>
                    </div>
                    <ChevronRight size={12} className="text-gray-300" />
                  </Link>
                ))}
              </div>
            </div>

          </div>

          {/* ================= COLONNE DROITE (3/12) ================= */}
          <div className="lg:col-span-3 flex flex-col gap-4 min-h-0">
            
            {/* Prochain Evenement */}
            <div className="bg-[#1a1a1a] rounded-2xl shadow-sm p-4 text-white shrink-0 relative overflow-hidden">
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#1b5e38]/30 rounded-full blur-xl"></div>
              <div className="relative z-10">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-1.5 text-gray-400">
                    <CalendarIcon size={12} />
                    <span className="text-[9px] font-bold uppercase tracking-wider">Prochain événement</span>
                  </div>
                </div>
                {prochainEvt ? (
                  <>
                    <h4 className="text-sm font-bold font-heading leading-snug mb-1">{prochainEvt.titre}</h4>
                    <p className="text-[10px] text-gray-300 mb-4">{new Date(prochainEvt.date_debut).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', hour: '2-digit', minute:'2-digit' })}</p>
                    <Link href="/membres/evenements" className="inline-flex items-center justify-center w-full py-1.5 bg-[#1b5e38] hover:bg-[#144a2c] text-white rounded-lg text-[10px] font-bold transition-colors">
                      Détails
                    </Link>
                  </>
                ) : (
                  <>
                    <h4 className="text-xs font-bold text-gray-300 mb-1">Aucun événement prévu</h4>
                    <p className="text-[9px] text-gray-500">Restez à l'écoute</p>
                  </>
                )}
              </div>
            </div>

            {/* Notifications Timeline */}
            <div className="bg-white rounded-2xl border border-[#e8e8e4] shadow-sm p-4 flex-1 flex flex-col min-h-0 overflow-hidden">
              <div className="flex justify-between items-center mb-3 shrink-0">
                <h3 className="text-[11px] font-bold text-[#1a1a1a] uppercase tracking-wider">Notifications</h3>
                <span className="w-1.5 h-1.5 rounded-full bg-[#1b5e38]"></span>
              </div>
              <div className="flex-1 overflow-y-auto custom-scrollbar pr-1 relative">
                <div className="absolute left-1.5 top-2 bottom-2 w-px bg-[#e8e8e4]"></div>
                <div className="space-y-4 py-1">
                  {notifsData && notifsData.length > 0 ? (
                    notifsData.map((notif: any) => (
                      <div key={notif.id} className="relative pl-5">
                        <div className="absolute left-[3px] top-1.5 w-1.5 h-1.5 bg-[#1b5e38] rounded-full shadow-[0_0_0_3px_white]"></div>
                        <p className="text-[10px] font-bold text-[#1a1a1a] leading-snug">{notif.titre}</p>
                        <p className="text-[9px] font-medium text-gray-500 mt-0.5 line-clamp-1">{notif.contenu}</p>
                        <p className="text-[8px] text-gray-400 mt-1 uppercase font-bold tracking-wider">{new Date(notif.created_at).toLocaleDateString('fr-FR')}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-[10px] text-gray-400 text-center py-4">Rien à signaler.</p>
                  )}
                </div>
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
