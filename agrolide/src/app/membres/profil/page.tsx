import { redirect } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { User, MapPin, Briefcase, Mail, Phone, Edit } from "lucide-react"
import { auth } from "@clerk/nextjs/server"
import { db } from "@/db"
import { users } from "@/db/schema"
import { eq } from "drizzle-orm"
export const metadata = { title: "Mon Profil" }

export default async function ProfilPage() {
  const { userId } = await auth()
  if (!userId) redirect("/login")

  const userRows = await db.select({
    id: users.id,
    email: users.email,
    prenom: users.prenom,
    nom: users.nom,
    photo_url: users.photo_url,
    specialite: users.specialite,
    categorie: users.categorie,
    ville: users.ville,
    pays: users.pays,
    organisation: users.organisation,
    biographie: users.biographie
  })
  .from(users)
  .where(eq(users.id, userId))
  .limit(1)

  const profile = userRows[0] || null

  if (!profile) redirect("/login")

  return (
    <div className="max-w-[1200px] mx-auto px-2 md:px-4 py-6 space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl md:text-2xl font-bold text-[#1a1a1a] font-heading">Mon Profil</h1>
        <Link 
          href="/membres/profil/modifier" 
          className="flex items-center gap-1.5 px-4 py-2 bg-[#1b5e38] text-white text-sm font-bold rounded-lg hover:bg-[#144a2c] transition-colors shadow-sm"
        >
          <Edit size={14} /> Modifier
        </Link>
      </div>

      {/* En-tête du profil avec photo de couverture */}
      <div className="bg-white rounded-2xl shadow-sm border border-[#e8e8e4] overflow-hidden relative">
        <div className="h-32 w-full bg-gradient-to-r from-[#1b5e38] to-[#0c361e] relative">
           <div className="absolute inset-0 bg-black/10"></div>
        </div>
        
        <div className="px-6 pb-8 relative">
          <div className="absolute -top-12 left-6 w-24 h-24 bg-white rounded-xl p-1 shadow-sm border border-[#e8e8e4]">
            <div className="w-full h-full bg-gray-50 rounded-lg overflow-hidden flex items-center justify-center relative">
              {profile.photo_url ? (
                <Image src={profile.photo_url} alt="Avatar" fill sizes="96px" className="object-cover" />
              ) : (
                <User size={32} className="text-gray-300" strokeWidth={1.5} />
              )}
            </div>
          </div>
          
          <div className="ml-32 pt-2 flex flex-col md:flex-row md:justify-between md:items-end gap-2">
            <div>
              <h2 className="text-lg md:text-xl font-heading font-bold text-[#1a1a1a] tracking-tight">{profile.prenom} {profile.nom}</h2>
              <p className="text-xs text-gray-500 font-bold capitalize mt-0.5 flex items-center gap-2">
                 <span>{profile.specialite}</span>
                 <span className="w-1 h-1 rounded-full bg-[#c3dec4]"></span>
                 <span className="text-[#1b5e38]">Membre {profile.categorie}</span>
              </p>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Informations Personnelles */}
            <div className="space-y-4">
              <h3 className="font-heading font-bold text-sm text-[#1a1a1a] flex items-center gap-2 border-b border-[#e8e8e4] pb-2">
                 <User size={14} className="text-gray-400" />
                 Informations Personnelles
              </h3>
              
              <div className="space-y-3">
                <div className="flex items-start gap-3 bg-gray-50 p-3 rounded-xl border border-[#e8e8e4]">
                  <div className="mt-0.5 text-gray-400">
                    <Mail size={14} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-0.5">Email</p>
                    <p className="text-xs font-bold text-[#1a1a1a]">{profile.email}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 bg-gray-50 p-3 rounded-xl border border-[#e8e8e4]">
                  <div className="mt-0.5 text-gray-400">
                    <MapPin size={14} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-0.5">Localisation</p>
                    <p className="text-xs font-bold text-[#1a1a1a]">
                      {profile.ville ? `${profile.ville}, ` : ''}{profile.pays || 'Non renseignée'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Informations Professionnelles */}
            <div className="space-y-4">
              <h3 className="font-heading font-bold text-sm text-[#1a1a1a] flex items-center gap-2 border-b border-[#e8e8e4] pb-2">
                 <Briefcase size={14} className="text-gray-400" />
                 Informations Professionnelles
              </h3>
              
              <div className="space-y-3">
                {profile.organisation && (
                  <div className="flex items-start gap-3 bg-gray-50 p-3 rounded-xl border border-[#e8e8e4]">
                    <div className="mt-0.5 text-[#1b5e38]">
                      <Briefcase size={14} />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-0.5">Entreprise / Organisation</p>
                      <p className="text-xs font-bold text-[#1a1a1a]">{profile.organisation}</p>
                    </div>
                  </div>
                )}

                <div className="bg-gray-50 p-3 rounded-xl border border-[#e8e8e4]">
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Spécialité Principale</p>
                  <span className="inline-block px-2 py-0.5 bg-[#f0f7f0] text-[#1b5e38] border border-[#c3dec4] rounded text-[10px] font-bold uppercase tracking-wider">
                    {profile.specialite}
                  </span>
                </div>
                
                {profile.biographie && (
                  <div className="bg-gray-50 p-3 rounded-xl border border-[#e8e8e4]">
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">À propos</p>
                    <p className="text-[11px] text-gray-600 leading-relaxed font-medium">
                      {profile.biographie}
                    </p>
                  </div>
                )}
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  )
}
