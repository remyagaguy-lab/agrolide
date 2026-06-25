import { redirect } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  FolderOpen, 
  BookOpen, 
  Calendar, 
  CreditCard,
  ExternalLink
} from "lucide-react"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()

  // 1. Vérification session
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) redirect("/login")

  // 2. Vérification rôle admin
  const { data: profile } = await supabase
    .from("profiles")
    .select("role_plateforme")
    .eq("id", session.user.id)
    .single()

  if (!profile || (profile.role_plateforme !== 'admin_content' && profile.role_plateforme !== 'super_admin')) {
    redirect("/membres/dashboard")
  }

  const navItems = [
    { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    { name: "Membres", href: "/admin/membres", icon: Users },
    { name: "Articles (Blog)", href: "/admin/contenus/articles", icon: FileText },
    { name: "Documents", href: "/admin/contenus/documents", icon: FolderOpen },
    { name: "Formations", href: "/admin/formations", icon: BookOpen },
    { name: "Événements", href: "/admin/evenements", icon: Calendar },
    { name: "Paiements", href: "/admin/paiements", icon: CreditCard },
  ]

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar Admin */}
      <aside className="w-[240px] bg-gray-900 text-white flex flex-col shrink-0">
        <div className="h-16 flex items-center px-6 border-b border-gray-800 shrink-0">
          <span className="font-heading font-bold text-xl text-[var(--color-vert-principal)]">
            agrolide <span className="text-white text-sm">ADMIN</span>
          </span>
        </div>
        
        <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-1">
          {navItems.map((item) => (
            <Link 
              key={item.name} 
              href={item.href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
            >
              <item.icon size={20} />
              {item.name}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header Admin */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 shrink-0">
          <h2 className="font-semibold text-gray-800">Panneau d'administration</h2>
          <Link 
            href="/" 
            target="_blank"
            className="flex items-center gap-2 text-sm font-medium text-[var(--color-vert-principal)] hover:text-green-800 transition-colors bg-green-50 px-3 py-1.5 rounded-md"
          >
            Voir le site <ExternalLink size={16} />
          </Link>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
