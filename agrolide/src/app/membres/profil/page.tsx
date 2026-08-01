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
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-heading font-bold text-gray-900">Mon Profil</h1>
        <Link 
          href="/membres/profil/modifier" 
          className="flex items-center gap-2 px-4 py-2 bg-[var(--color-vert-principal)] text-white text-sm font-medium rounded-lg hover:bg-green-800 transition-colors"
        >
          <Edit size={16} /> Modifier
        </Link>
      </div>

      {/* En-tête du profil avec photo de couverture */}
      <div className="bg-white rounded-2xl shadow-sm border border-[#e8e8e4] overflow-hidden relative">
        <div className="h-48 w-full bg-gradient-to-r from-[var(--color-vert-profond)] to-emerald-900 relative">
           <div className="absolute inset-0 bg-black/10"></div>
        </div>
        
        <div className="px-10 pb-12 relative">
          <div className="absolute -top-16 left-10 w-32 h-32 bg-white rounded-full p-1.5 shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
            <div className="w-full h-full bg-gray-50 rounded-full overflow-hidden flex items-center justify-center relative ring-1 ring-gray-100">
              {profile.photo_url ? (
                <Image src={profile.photo_url} alt="Avatar" fill sizes="128px" className="object-cover" />
              ) : (
                <User size={48} className="text-gray-300" strokeWidth={1.5} />
              )}
            </div>
          </div>
          
          <div className="ml-40 pt-4 flex flex-col md:flex-row md:justify-between md:items-end gap-4">
            <div>
              <h2 className="text-3xl font-heading font-bold text-gray-900 tracking-tight">{profile.prenom} {profile.nom}</h2>
              <p className="text-gray-500 font-medium capitalize mt-1 flex items-center gap-2">
                 <span>{profile.specialite}</span>
                 <span className="w-1.5 h-1.5 rounded-full bg-gray-300"></span>
                 <span className="text-[var(--color-vert-principal)]">Membre {profile.categorie}</span>
              </p>
            </div>
          </div>

          <div className="mt-14 grid grid-cols-1 md:grid-cols-2 gap-12">
            
            {/* Informations Personnelles */}
            <div className="space-y-8">
              <h3 className="font-heading font-bold text-lg text-gray-900 flex items-center gap-3">
                 <span className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                    <User size={16} className="text-gray-600" />
                 </span>
                 Informations Personnelles
              </h3>
              
              <div className="space-y-6 bg-gray-50/50 rounded-2xl p-6 border border-gray-100/50">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-gray-500">
                    <Mail size={18} />
                  </div>
                  <div>
                    <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Email</p>
                    <p className="font-semibold text-gray-800">{profile.email}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-gray-500">
                    <MapPin size={18} />
                  </div>
                  <div>
                    <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Localisation</p>
                    <p className="font-semibold text-gray-800">
                      {profile.ville ? `${profile.ville}, ` : ''}{profile.pays || 'Non renseignée'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Informations Professionnelles */}
            <div className="space-y-8">
              <h3 className="font-heading font-bold text-lg text-gray-900 flex items-center gap-3">
                 <span className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                    <Briefcase size={16} className="text-gray-600" />
                 </span>
                 Informations Professionnelles
              </h3>
              
              <div className="space-y-6 bg-gray-50/50 rounded-2xl p-6 border border-gray-100/50">
                {profile.organisation && (
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-[var(--color-orange-accent)]">
                      <Briefcase size={18} />
                    </div>
                    <div>
                      <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Entreprise / Organisation</p>
                      <p className="font-semibold text-gray-800">{profile.organisation}</p>
                    </div>
                  </div>
                )}

                <div>
                  <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-3">Spécialité Principale</p>
                  <span className="px-4 py-2 bg-[var(--color-vert-clair)] text-[var(--color-vert-profond)] rounded-xl text-sm font-bold shadow-sm">
                    {profile.specialite}
                  </span>
                </div>
                
                {profile.biographie && (
                  <div className="pt-2">
                    <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">À propos</p>
                    <p className="text-sm text-gray-600 leading-relaxed">
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
