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
  Search,
  Settings
} from "lucide-react"

interface MembresLayoutProps {
  children: React.ReactNode
  profile: any
  pendingRequestsCount?: number
}

export function MembresLayout({ children, profile, pendingRequestsCount = 0 }: MembresLayoutProps) {
  const pathname = usePathname()
  const { signOut } = useClerk()

  const handleLogout = async () => {
    await signOut({ redirectUrl: "/" })
  }

  // --- Sidebar Navigation ---
  const navMain = [
    { name: "Dashboard", href: "/membres/dashboard", icon: LayoutDashboard },
    { name: "Annuaire", href: "/membres/annuaire", icon: Users },
    { name: "Bibliothèque", href: "/membres/bibliotheque", icon: Library },
    // { name: "Forum", href: "/membres/forum", icon: MessageSquare },
    { name: "Événements", href: "/membres/evenements", icon: Calendar },
    { name: profile?.categorie === "junior" ? "Formations" : "Opportunités", href: profile?.categorie === "junior" ? "/membres/formations" : "/membres/opportunites", icon: profile?.categorie === "junior" ? BookOpen : Briefcase },
  ]

  const navPersonal = [
    { name: "Mon Réseau", href: "/membres/reseau", icon: Users, badge: pendingRequestsCount },
    { name: "Messages", href: "/membres/messages", icon: Mail },
    // { name: "Cotisation", href: "/membres/cotisation", icon: CreditCard },
    { name: "Mon Profil", href: "/membres/profil", icon: User },
  ]

  const mobileNavItems = [
    { name: "Accueil", href: "/membres/dashboard", icon: LayoutDashboard },
    { name: "Annuaire", href: "/membres/annuaire", icon: Users },
    { name: "Réseau", href: "/membres/reseau", icon: Users, badge: pendingRequestsCount },
    { name: "Biblio", href: "/membres/bibliotheque", icon: Library },
    { name: "Profil", href: "/membres/profil", icon: User },
  ]

  return (
    <div className="h-screen bg-[#f8f9fa] flex font-sans overflow-hidden">
      
      <style dangerouslySetInnerHTML={{__html: `
        .fusion-active::before {
          content: "";
          position: absolute;
          right: 0;
          top: -24px;
          width: 24px;
          height: 24px;
          border-bottom-right-radius: 24px;
          box-shadow: 12px 12px 0 12px #f8f9fa;
          pointer-events: none;
        }
        .fusion-active::after {
          content: "";
          position: absolute;
          right: 0;
          bottom: -24px;
          width: 24px;
          height: 24px;
          border-top-right-radius: 24px;
          box-shadow: 12px -12px 0 12px #f8f9fa;
          pointer-events: none;
        }
      `}} />
      {/* ================= VERTICAL SIDEBAR (DESKTOP) ================= */}
      <aside className="hidden lg:flex flex-col w-[260px] shrink-0 h-full bg-[#f4f8f4] z-30 relative">
        {/* Logo */}
        <div className="h-20 flex items-center px-6 shrink-0">
          <Link href="/membres/dashboard" className="flex items-center flex-shrink-0">
            <Image
              src="/agrolide-png.png"
              alt="agrolide"
              width={240}
              height={80}
              className="h-12 w-auto object-contain scale-[2.2] origin-left"
              priority
            />
          </Link>
        </div>

        {/* Navigation Area */}
        <div className="flex-1 pl-4 py-4 flex flex-col gap-6 relative z-10">
          
          {/* Main Menu */}
          <div>
            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-3 px-2">Menu Principal</div>
            <nav className="flex flex-col gap-1">
              {navMain.map((item) => {
                const isActive = pathname === item.href || (item.href !== "/membres/dashboard" && pathname?.startsWith(`${item.href}/`))
                return (
                  <Link 
                    key={item.name}
                    href={item.href}
                    className={`relative flex items-center gap-3 px-4 py-3 transition-[background-color,color] rounded-l-2xl ${
                      isActive 
                        ? 'bg-[#f8f9fa] text-[#1b5e38] font-bold fusion-active z-20' 
                        : 'text-gray-500 hover:bg-gray-100/50 hover:text-gray-900 font-medium mr-4'
                    }`}
                  >
                    <item.icon size={18} strokeWidth={isActive ? 2.5 : 2} className={isActive ? "text-[#1b5e38]" : "text-gray-400"} />
                    <span className="text-sm">{item.name}</span>
                  </Link>
                )
              })}
            </nav>
          </div>

          {/* Personal Utilities */}
          <div>
            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-3 px-2">Personnel</div>
            <nav className="flex flex-col gap-1">
              {navPersonal.map((item) => {
                const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`)
                return (
                  <Link 
                    key={item.name}
                    href={item.href}
                    className={`relative flex items-center gap-3 px-4 py-3 transition-[background-color,color] rounded-l-2xl ${
                      isActive 
                        ? 'bg-[#f8f9fa] text-[#1b5e38] font-bold fusion-active z-20' 
                        : 'text-gray-500 hover:bg-gray-100/50 hover:text-gray-900 font-medium mr-4'
                    }`}
                  >
                    <item.icon size={18} strokeWidth={isActive ? 2.5 : 2} className={isActive ? "text-[#1b5e38]" : "text-gray-400"} />
                    <span className="text-sm">{item.name}</span>
                    {item.badge ? (
                      <span className="ml-auto bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                        {item.badge}
                      </span>
                    ) : null}
                  </Link>
                )
              })}
            </nav>
          </div>

        </div>

        {/* Logout Bottom Area */}
        <div className="p-4 mt-auto shrink-0">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 w-full rounded-xl text-gray-500 hover:bg-red-50 hover:text-red-600 transition-all font-medium"
          >
            <LogOut size={18} strokeWidth={2} />
            <span className="text-sm">Déconnexion</span>
          </button>
        </div>
      </aside>

      {/* ================= MAIN CONTENT AREA ================= */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        
        {/* HEADER */}
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-[#e8e8e4] z-20 flex items-center justify-between px-4 md:px-6 shrink-0">
          
          {/* Mobile Logo */}
          <Link href="/membres/dashboard" className="lg:hidden flex items-center flex-shrink-0">
            <Image
              src="/agrolide-png.png"
              alt="agrolide"
              width={240}
              height={80}
              className="h-10 w-auto object-contain scale-[2.0] origin-left"
              priority
            />
          </Link>

          {/* Search (Desktop) */}
          <div className="hidden lg:flex items-center bg-gray-50 border border-[#e8e8e4] rounded-xl px-3 py-2 w-96 transition-colors focus-within:bg-white focus-within:border-[#1b5e38] focus-within:ring-1 focus-within:ring-[#1b5e38]/20">
            <Search size={16} className="text-gray-400 min-w-4" />
            <input 
              type="text" 
              placeholder="Rechercher..." 
              className="bg-transparent border-none outline-none text-sm text-gray-700 ml-2 w-full placeholder-gray-400"
            />
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2 lg:gap-4">
             <button className="hidden md:flex w-10 h-10 rounded-xl items-center justify-center text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors border border-transparent hover:border-[#e8e8e4]">
               <Settings size={20} strokeWidth={2} />
             </button>
             <Link href="/membres/reseau" className="w-10 h-10 rounded-xl flex items-center justify-center text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors border border-transparent hover:border-[#e8e8e4] relative">
               <Bell size={20} strokeWidth={2} />
               {pendingRequestsCount > 0 && (
                 <span className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full bg-red-500 border-2 border-white"></span>
               )}
             </Link>
             
             {/* Profile Avatar Trigger */}
             <Link href="/membres/profil" className="flex items-center gap-3 pl-2 lg:pl-4 lg:border-l border-[#e8e8e4]">
                <div className="hidden lg:flex flex-col items-end">
                  <span className="text-sm font-bold text-[#1a1a1a] leading-tight">{profile?.prenom} {profile?.nom}</span>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{profile?.categorie}</span>
                </div>
                <div className="w-10 h-10 rounded-xl bg-gray-100 overflow-hidden relative border border-[#e8e8e4] hover:border-[#1b5e38] transition-colors shrink-0">
                  {profile?.avatar_url ? (
                    <Image src={profile.avatar_url} alt="Avatar" fill sizes="40px" className="object-cover" />
                  ) : (
                    <User size={20} className="m-auto h-full text-gray-400" />
                  )}
                </div>
             </Link>
          </div>
        </header>

        {/* SCROLLABLE PAGE CONTENT */}
        <main className="flex-1 min-h-0 overflow-y-auto custom-scrollbar p-2 md:p-4 lg:p-6 pb-24 md:pb-6 relative">
          <div className="max-w-[1400px] mx-auto h-full">
            {children}
          </div>
        </main>
      </div>

      {/* ================= BOTTOM NAVIGATION (MOBILE) ================= */}
      <nav className="lg:hidden fixed bottom-0 left-0 w-full bg-white border-t border-gray-100 z-50 px-2 pb-safe shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
        <div className="flex justify-around items-center h-20 px-2">
          {mobileNavItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/membres/dashboard" && pathname?.startsWith(`${item.href}/`))
            return (
              <Link 
                key={item.name} 
                href={item.href}
                className={`relative flex flex-col items-center justify-center w-16 h-16 rounded-[16px] space-y-1.5 transition-all ${
                  isActive 
                    ? "bg-[#dff0e0] text-[#1b5e38] font-bold shadow-sm" 
                    : "text-gray-400 hover:text-gray-900 font-medium"
                }`}
              >
                <div className="relative">
                  <item.icon size={22} strokeWidth={isActive ? 2.5 : 2} className={isActive ? "text-[#1b5e38]" : ""} />
                  {item.badge ? (
                    <span className="absolute -top-1 -right-2 w-2.5 h-2.5 rounded-full bg-red-500 border-2 border-white"></span>
                  ) : null}
                </div>
                <span className="text-[10px]">{item.name}</span>
              </Link>
            )
          })}
        </div>
      </nav>

    </div>
  )
}
