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
  Bell
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
    { name: "Opportunités", href: "/membres/opportunites", icon: Briefcase },
    { name: "Formations", href: "/formations", icon: BookOpen },
  ]

  const navPersonal = [
    { name: "Mon Réseau", href: "/membres/reseau", icon: Users, badge: pendingRequestsCount },
    { name: "Messages", href: "/membres/messages", icon: Mail },
    { name: "Mes Formations", href: "/membres/formations", icon: BookOpen },
    { name: "Mon Profil", href: "/membres/profil", icon: User },
  ]

  const mobileNavItems = [
    { name: "Accueil", href: "/membres/dashboard", icon: LayoutDashboard },
    { name: "Annuaire", href: "/membres/annuaire", icon: Users },
    { name: "Réseau", href: "/membres/reseau", icon: Users, badge: pendingRequestsCount },
    { name: "Biblio", href: "/membres/bibliotheque", icon: Library },
    { name: "Formations", href: "/formations", icon: BookOpen },
    { name: "Mes Formations", href: "/membres/formations", icon: BookOpen },
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
        
        {/* Mobile Header Only (Hidden on Desktop) */}
        <header className="lg:hidden h-14 bg-white border-b border-[#e8e8e4] z-20 flex items-center justify-between px-4 shrink-0">
          <Link href="/membres/dashboard" className="flex items-center flex-shrink-0">
            <Image
              src="/agrolide-png.png"
              alt="agrolide"
              width={160}
              height={50}
              className="h-8 w-auto object-contain scale-[1.8] origin-left"
              priority
            />
          </Link>

          <div className="flex items-center gap-2">
            <Link href="/membres/reseau" className="w-9 h-9 rounded-lg flex items-center justify-center text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors relative">
              <Bell size={18} strokeWidth={2} />
              {pendingRequestsCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 border-2 border-white"></span>
              )}
            </Link>
            <Link href="/membres/profil" className="w-8 h-8 rounded-lg bg-gray-100 overflow-hidden relative border border-[#e8e8e4] shrink-0">
              {profile?.avatar_url ? (
                <Image src={profile.avatar_url} alt="Avatar" fill sizes="32px" className="object-cover" />
              ) : (
                <User size={16} className="m-auto h-full text-gray-400" />
              )}
            </Link>
          </div>
        </header>

        {/* SCROLLABLE PAGE CONTENT */}
        <main className="flex-1 min-h-0 overflow-y-auto custom-scrollbar p-3 md:p-5 lg:p-6 pb-24 md:pb-6 relative">
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
