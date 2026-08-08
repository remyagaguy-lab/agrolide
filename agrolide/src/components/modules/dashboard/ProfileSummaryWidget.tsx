import React from "react"
import Link from "next/link"
import Image from "next/image"
import { User, CheckCircle, ArrowRight, ShieldCheck } from "lucide-react"

interface ProfileSummaryWidgetProps {
  prenom?: string | null
  nom?: string | null
  photo_url?: string | null
  specialite?: string | null
  organisation?: string | null
  pays?: string | null
  ville?: string | null
  categorie?: string | null
}

export function ProfileSummaryWidget({
  prenom,
  nom,
  photo_url,
  specialite,
  organisation,
  pays,
  ville,
  categorie
}: ProfileSummaryWidgetProps) {
  const displayName = prenom ? `${prenom}${nom ? ` ${nom}` : ""}` : "Membre"
  const isProfileComplete = Boolean(specialite && organisation && pays)

  return (
    <div className="bg-white rounded-2xl border border-gris-border shadow-[0_1px_3px_rgba(0,0,0,0.04),0_1px_2px_rgba(0,0,0,0.06)] p-5 flex flex-col shrink-0">
      <div className="flex items-center gap-3 mb-3.5">
        {/* Avatar */}
        <div className="w-12 h-12 rounded-xl bg-[#f0f7f0] border border-[#c3dec4] flex items-center justify-center text-[#1b5e38] shrink-0 relative overflow-hidden">
          {photo_url ? (
            <Image src={photo_url} alt={displayName} fill sizes="48px" className="object-cover" />
          ) : (
            <User size={22} strokeWidth={1.5} className="text-[#1b5e38]" />
          )}
        </div>

        {/* Name & Speciality */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <h4 className="text-xs sm:text-sm font-bold text-[#1a1a1a] font-heading truncate">
              {displayName}
            </h4>
            <ShieldCheck size={14} className="text-[#50a853] shrink-0" />
          </div>
          <p className="text-[11px] text-gris-muted truncate">
            {specialite || organisation || "Expertise agricole"}
          </p>
        </div>
      </div>

      {/* Visibility Status Banner */}
      <div className="bg-[#f8f8f6] border border-gris-border rounded-xl p-3 mb-3.5 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#50a853]" />
          <span className="text-gray-700 font-semibold">Annuaire des pairs</span>
        </div>
        <span className="text-[10px] font-bold text-[#1b5e38] bg-[#e8f5e9] px-2 py-0.5 rounded-md">
          {isProfileComplete ? "Profil vérifié" : "Visibilité active"}
        </span>
      </div>

      {/* Link to Profile */}
      <Link
        href="/membres/profil"
        className="inline-flex items-center justify-center gap-1.5 w-full py-2 bg-[#f0f7f0] hover:bg-[#e2f3e3] active:scale-[0.98] border border-[#c3dec4] text-[#1b5e38] rounded-xl text-xs font-bold transition-all duration-150"
      >
        <span>Gérer ma fiche membre</span>
        <ArrowRight size={12} strokeWidth={2} />
      </Link>
    </div>
  )
}
