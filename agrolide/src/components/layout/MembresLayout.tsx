"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { useClerk } from "@clerk/nextjs"
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
  CreditCard,
  LogOut,
  Bell,
  Search
} from "lucide-react"

interface MembresLayoutProps {
  children: React.ReactNode
  profile: any
}

export function MembresLayout({ children, profile }: MembresLayoutProps) {
  const pathname = usePathname()
  const { signOut } = useClerk()

  const handleLogout = async () => {
    await signOut({ redirectUrl: "/" })
  }

  // --- Horizontal Navigation (Modules du réseau) ---
  const horizontalNav = [
    { name: "Dashboard", href: "/membres/dashboard" }, // Optional, could be just the logo
    { name: "Annuaire", href: "/membres/annuaire" },
    { name: "Bibliothèque", href: "/membres/bibliotheque" },
    { name: "Forum", href: "/membres/forum" },
    { name: "Événements", href: "/membres/evenements" },
    { name: profile?.categorie === "junior" ? "Formations" : "Opportunités", href: profile?.categorie === "junior" ? "/membres/formations" : "/membres/opportunites" },
  ]

  // --- Vertical Navigation (Outils personnels / Sidebar) ---
  const pill1 = [
    { name: "Accueil", href: "/membres/dashboard", icon: LayoutDashboard },
    { name: "Mon Profil", href: "/membres/profil", icon: User },
  ]
  const pill2 = [
    { name: "Messages", href: "/membres/messages", icon: Mail },
    { name: "Cotisation", href: "/membres/cotisation", icon: CreditCard },
  ]

  // --- Mobile Navigation ---
  const mobileNavItems = [
    { name: "Accueil", href: "/membres/dashboard", icon: LayoutDashboard },
    { name: "Annuaire", href: "/membres/annuaire", icon: Users },
    { name: "Biblio", href: "/membres/bibliotheque", icon: Library },
    { name: "Forum", href: "/membres/forum", icon: MessageSquare },
    { name: "Profil", href: "/membres/profil", icon: User },
  ]

  return (
    <div className="min-h-screen bg-[#f4f7f6] flex flex-col font-sans">
      
      {/* ================= HEADER HORIZONTAL (Style Quixotic) ================= */}
      <header className="sticky top-0 z-40 w-full px-4 pt-4 pb-2">
        <div className="max-w-[1600px] mx-auto flex items-center justify-between gap-4">
          
          {/* Logo Pill */}
          <Link href="/membres/dashboard" className="bg-white h-14 px-6 rounded-full shadow-sm flex items-center gap-2 hover:shadow-md transition-shadow">
            <span className="font-heading font-bold text-xl text-[var(--color-vert-principal)]">
              agrolide
            </span>
          </Link>
          
          {/* Navigation Pill (Horizontal) - Hidden on Mobile */}
          <nav className="hidden lg:flex bg-white h-14 rounded-full shadow-sm px-2 items-center gap-1">
            {horizontalNav.map(item => {
              const isActive = pathname === item.href || (item.href !== "/membres/dashboard" && pathname?.startsWith(`${item.href}/`))
              return (
                <Link 
                  key={item.name}
                  href={item.href} 
                  className={`px-4 py-2 rounded-full text-[13px] font-bold transition-colors ${
                    isActive 
                      ? 'bg-[var(--color-vert-clair)] text-[var(--color-vert-profond)]' 
                      : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  {item.name}
                </Link>
              )
            })}
          </nav>

          {/* Profile & Notifications Pill */}
          <div className="bg-white h-14 rounded-full shadow-sm pr-2 pl-4 flex items-center gap-3">
             <button className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-700 transition-colors">
               <Search size={18} />
             </button>
             <button className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-700 transition-colors relative">
               <Bell size={18} />
               <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[var(--color-orange-accent)] border-2 border-white"></span>
             </button>
             
             {/* Profile Avatar Trigger */}
             <Link href="/membres/profil" className="ml-1 w-10 h-10 rounded-full bg-gray-100 overflow-hidden relative shadow-sm ring-2 ring-transparent hover:ring-[var(--color-vert-principal)] transition-all">
                {profile?.avatar_url ? (
                  <Image src={profile.avatar_url} alt="Avatar" fill sizes="40px" className="object-cover" />
                ) : (
                  <User size={20} className="m-auto h-full text-gray-400" />
                )}
             </Link>
          </div>
          
        </div>
      </header>

      {/* ================= MAIN LAYOUT ================= */}
      <div className="max-w-[1600px] w-full mx-auto px-4 flex gap-6 mt-4 flex-1">
         
         {/* Vertical Sidebar (Floating Icons) - Hidden on Mobile */}
         <aside className="hidden md:flex flex-col gap-4 w-16 sticky top-[88px] h-[calc(100vh-100px)] z-30 pb-4">
            
            {/* Pill 1: Accueil & Profil */}
            <nav className="bg-white rounded-full shadow-sm py-3 px-2 flex flex-col gap-3 items-center">
               {pill1.map((item) => {
                  const isActive = pathname === item.href
                  return (
                    <Link 
                      key={item.name}
                      href={item.href}
                      title={item.name}
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                        isActive 
                          ? 'bg-[var(--color-vert-profond)] text-white shadow-md shadow-green-900/20' 
                          : 'text-gray-400 hover:text-gray-900 hover:bg-gray-50'
                      }`}
                    >
                      <item.icon size={20} />
                    </Link>
                  )
               })}
            </nav>

            {/* Pill 2: Utilities (Messages, Cotisation) */}
            <nav className="bg-white rounded-full shadow-sm py-3 px-2 flex flex-col gap-3 items-center">
               {pill2.map((item) => {
                  const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`)
                  return (
                    <Link 
                      key={item.name}
                      href={item.href}
                      title={item.name}
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                        isActive 
                          ? 'bg-[var(--color-vert-profond)] text-white shadow-md shadow-green-900/20' 
                          : 'text-gray-400 hover:text-gray-900 hover:bg-gray-50'
                      }`}
                    >
                      <item.icon size={20} />
                    </Link>
                  )
               })}
            </nav>

            {/* Pill 3: Logout */}
            <div className="bg-white rounded-full shadow-sm py-3 px-2 flex flex-col gap-3 items-center mt-auto">
               <button 
                  onClick={handleLogout}
                  title="Se déconnecter"
                  className="w-10 h-10 rounded-full flex items-center justify-center text-red-400 hover:text-white hover:bg-red-500 transition-all"
                >
                  <LogOut size={20} />
               </button>
            </div>
         </aside>

         {/* Content Area */}
         <main className="flex-1 min-w-0 pb-24 md:pb-8">
            {children}
         </main>
      </div>

      {/* ================= BOTTOM NAVIGATION (MOBILE) ================= */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full bg-white border-t border-gray-100 z-50 px-2 pb-safe shadow-[0_-10px_40px_rgba(0,0,0,0.05)] rounded-t-[24px]">
        <div className="flex justify-around items-center h-20 px-2">
          {mobileNavItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/membres/dashboard" && pathname?.startsWith(`${item.href}/`))
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

