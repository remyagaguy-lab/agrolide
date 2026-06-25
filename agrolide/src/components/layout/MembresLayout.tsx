"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
  LayoutDashboard, 
  User, 
  Users, 
  Library, 
  BookOpen, 
  Calendar, 
  MessageSquare, 
  Briefcase, 
  Mail, 
  CreditCard 
} from "lucide-react"

interface MembresLayoutProps {
  children: React.ReactNode
  profile: any
}

export function MembresLayout({ children, profile }: MembresLayoutProps) {
  const pathname = usePathname()

  const navItems = [
    { name: "Dashboard", href: "/membres/dashboard", icon: LayoutDashboard },
    { name: "Mon profil", href: "/membres/profil", icon: User },
    { name: "Annuaire", href: "/membres/annuaire", icon: Users },
    { name: "Bibliothèque", href: "/membres/bibliotheque", icon: Library },
    { name: "Formations", href: "/membres/formations", icon: BookOpen },
    { name: "Événements", href: "/membres/evenements", icon: Calendar },
    { name: "Forum", href: "/membres/forum", icon: MessageSquare },
    { name: "Opportunités", href: "/membres/opportunites", icon: Briefcase },
    { name: "Messages", href: "/membres/messages", icon: Mail },
    { name: "Ma cotisation", href: "/membres/cotisation", icon: CreditCard },
  ]

  // Pour le mobile: on ne garde que 5 items principaux
  const mobileNavItems = [
    { name: "Accueil", href: "/membres/dashboard", icon: LayoutDashboard },
    { name: "Annuaire", href: "/membres/annuaire", icon: Users },
    { name: "Biblio", href: "/membres/bibliotheque", icon: Library },
    { name: "Forum", href: "/membres/forum", icon: MessageSquare },
    { name: "Profil", href: "/membres/profil", icon: User },
  ]

  return (
    <div className="flex min-h-[calc(100vh-64px)] bg-gray-50 relative">
      
      {/* Sidebar Desktop */}
      <aside className="hidden md:flex flex-col w-[240px] bg-white border-r border-gray-200 sticky top-16 h-[calc(100vh-64px)] z-30">
        <div className="p-6 border-b border-gray-100 flex flex-col items-center text-center">
          <div className="w-20 h-20 bg-gray-200 rounded-full mb-3 overflow-hidden">
            {profile?.avatar_url ? (
              <img src={profile.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <User size={40} className="m-auto h-full text-gray-400" />
            )}
          </div>
          <h3 className="font-bold text-gray-900 truncate w-full">{profile?.prenom} {profile?.nom}</h3>
          <span className="text-xs font-medium px-2 py-1 bg-green-100 text-[var(--color-vert-principal)] rounded-full mt-2 capitalize">
            {profile?.categorie}
          </span>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`)
            return (
              <Link 
                key={item.name} 
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive 
                    ? "bg-[var(--color-vert-principal)] text-white" 
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }`}
              >
                <item.icon size={20} />
                {item.name}
              </Link>
            )
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 w-full pb-20 md:pb-0 overflow-x-hidden">
        {children}
      </main>

      {/* Bottom Navigation Mobile */}
      <nav className="md:hidden fixed bottom-0 w-full bg-white border-t border-gray-200 z-50 px-2 pb-safe">
        <div className="flex justify-between items-center h-16">
          {mobileNavItems.map((item) => {
            const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`)
            return (
              <Link 
                key={item.name} 
                href={item.href}
                className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${
                  isActive ? "text-[var(--color-vert-principal)]" : "text-gray-500 hover:text-gray-900"
                }`}
              >
                <item.icon size={24} />
                <span className="text-[10px] font-medium">{item.name}</span>
              </Link>
            )
          })}
        </div>
      </nav>

    </div>
  )
}
