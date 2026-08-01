"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
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
    // { name: "Opportunités", href: "/membres/opportunites", icon: Briefcase }, // Remplacement
  ]

  return (
    <div className="flex min-h-[calc(100vh-64px)] bg-[#f4f7f6] p-4 gap-6">
      
      {/* Sidebar Desktop - Floating Pill Style */}
      <aside className="hidden md:flex flex-col w-[260px] bg-white rounded-[32px] shadow-sm sticky top-[80px] h-[calc(100vh-100px)] z-30 overflow-hidden">
        <div className="p-8 pb-4 flex flex-col items-center text-center mt-4">
          <div className="w-20 h-20 bg-gray-100 rounded-full mb-4 overflow-hidden relative shadow-sm ring-4 ring-gray-50">
            {profile?.avatar_url ? (
              <Image src={profile.avatar_url} alt="Avatar" fill sizes="80px" className="object-cover" />
            ) : (
              <User size={40} className="m-auto h-full text-gray-400" />
            )}
          </div>
          <h3 className="font-heading font-bold text-gray-900 truncate w-full text-lg">{profile?.prenom} {profile?.nom}</h3>
          <span className="text-[10px] font-bold px-3 py-1 bg-[var(--color-vert-clair)] text-[var(--color-vert-profond)] rounded-full mt-2 uppercase tracking-wider">
            {profile?.categorie}
          </span>
        </div>

        <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1.5 custom-scrollbar">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`)
            return (
              <Link 
                key={item.name} 
                href={item.href}
                className={`flex items-center gap-4 px-4 py-3.5 rounded-[16px] text-sm font-semibold transition-all duration-200 ${
                  isActive 
                    ? "bg-[var(--color-vert-profond)] text-white shadow-md shadow-green-900/20" 
                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <item.icon size={20} className={isActive ? "text-white" : "text-gray-400"} />
                {item.name}
              </Link>
            )
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 w-full pb-20 md:pb-0 overflow-x-hidden pt-2">
        {children}
      </main>

      {/* Bottom Navigation Mobile */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full bg-white border-t border-gray-100 z-50 px-2 pb-safe shadow-[0_-10px_40px_rgba(0,0,0,0.05)] rounded-t-[24px]">
        <div className="flex justify-around items-center h-20 px-2">
          {mobileNavItems.map((item) => {
            const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`)
            return (
              <Link 
                key={item.name} 
                href={item.href}
                className={`flex flex-col items-center justify-center w-16 h-16 rounded-[16px] space-y-1.5 transition-all ${
                  isActive 
                    ? "bg-[var(--color-vert-clair)] text-[var(--color-vert-profond)] font-bold" 
                    : "text-gray-400 hover:text-gray-900 font-medium"
                }`}
              >
                <item.icon size={22} className={isActive ? "text-[var(--color-vert-profond)]" : ""} />
                <span className="text-[10px]">{item.name}</span>
              </Link>
            )
          })}
        </div>
      </nav>

    </div>
  )
}
