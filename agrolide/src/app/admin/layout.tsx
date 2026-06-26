import { redirect } from "next/navigation"
import Link from "next/link"
import { headers } from "next/headers"
import { createClient } from "@/lib/supabase/server"
import { 
  LayoutDashboard, Users, FileText, FolderOpen, BookOpen, Calendar, 
  CreditCard, ExternalLink, Globe, Star, Handshake, Sprout, MessageSquare,
  ChevronDown
} from "lucide-react"

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) redirect("/login")

  const { data: profile } = await supabase
    .from("profiles").select("role_plateforme").eq("id", session.user.id).single()

  if (!profile || !["admin_content", "super_admin"].includes(profile.role_plateforme)) {
    redirect("/membres/dashboard")
  }

  const headersList = await headers()
  const pathname = headersList.get("x-pathname") || ""

  const isActive = (href: string) => pathname.startsWith(href)

  const navLink = (href: string, label: string, Icon: React.ElementType) => (
    <Link
      key={href}
      href={href}
      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
        isActive(href) 
          ? "bg-green-700/30 text-green-300" 
          : "text-gray-300 hover:bg-gray-800 hover:text-white"
      }`}
    >
      <Icon size={18} />
      {label}
    </Link>
  )

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <aside className="w-[240px] bg-gray-900 text-white flex flex-col shrink-0 overflow-y-auto">
        <div className="h-16 flex items-center px-6 border-b border-gray-800 shrink-0">
          <span className="font-heading font-bold text-xl text-[#4ade80]">
            agrolide <span className="text-white text-sm font-normal">ADMIN</span>
          </span>
        </div>
        
        <nav className="flex-1 py-4 px-3 space-y-0.5">
          {navLink("/admin/dashboard", "Dashboard", LayoutDashboard)}
          
          <div className="pt-4 pb-1 px-3">
            <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-widest">Membres</p>
          </div>
          {navLink("/admin/membres", "Gestion membres", Users)}
          {navLink("/admin/paiements", "Paiements", CreditCard)}

          <div className="pt-4 pb-1 px-3">
            <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-widest">Contenu</p>
          </div>
          {navLink("/admin/contenus/articles", "Articles (Blog)", FileText)}
          {navLink("/admin/contenus/documents", "Documents", FolderOpen)}
          {navLink("/admin/contenus/formations", "Formations", BookOpen)}
          {navLink("/admin/contenus/evenements", "Événements", Calendar)}
          {navLink("/admin/contenus/opportunites", "Opportunités", MessageSquare)}
          {navLink("/admin/forum", "Forum", MessageSquare)}
          
          <div className="pt-4 pb-1 px-3">
            <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-widest">Vitrine</p>
          </div>
          {navLink("/admin/contenus/partenaires", "Partenaires", Handshake)}
          {navLink("/admin/contenus/agripreneurs", "Agripreneurs", Sprout)}
          {navLink("/admin/contenus/temoignages", "Témoignages", Star)}

          <div className="pt-4 pb-1 px-3">
            <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-widest">Site</p>
          </div>
          {navLink("/admin/pages", "Pages statiques", Globe)}
          {navLink("/admin/agrobusiness", "Agrobusiness", FolderOpen)}
          {navLink("/admin/analytics", "Analytiques", LayoutDashboard)}
        </nav>
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 shrink-0">
          <h2 className="font-semibold text-gray-800">Panneau d'administration</h2>
          <Link 
            href="/" target="_blank"
            className="flex items-center gap-2 text-sm font-medium text-green-700 hover:text-green-800 transition-colors bg-green-50 px-3 py-1.5 rounded-md"
          >
            Voir le site <ExternalLink size={16} />
          </Link>
        </header>
        <main className="flex-1 overflow-y-auto p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
