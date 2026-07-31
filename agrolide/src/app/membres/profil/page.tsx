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

      <div className="bg-white rounded-2xl shadow-sm border border-[var(--color-gris-clair)] overflow-hidden">
        
        {/* Header Profil */}
        <div className="h-32 bg-[var(--color-vert-principal)] relative"></div>
        <div className="px-8 pb-8 relative">
          <div className="absolute -top-16 left-8 w-32 h-32 bg-white rounded-full p-1 shadow-md">
            <div className="w-full h-full bg-gray-200 rounded-full overflow-hidden flex items-center justify-center relative">
              {profile.photo_url ? (
                <Image src={profile.photo_url} alt="Avatar" fill sizes="128px" className="object-cover" />
              ) : (
                <User size={64} className="text-gray-400" />
              )}
            </div>
          </div>
          
          <div className="ml-36 pt-4 flex flex-col md:flex-row md:justify-between md:items-end gap-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{profile.prenom} {profile.nom}</h2>
              <p className="text-[var(--color-gris-texte)] font-medium capitalize">{profile.specialite} • Membre {profile.categorie}</p>
            </div>
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Informations Personnelles */}
            <div className="space-y-6">
              <h3 className="font-bold text-gray-900 border-b pb-2">Informations Personnelles</h3>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-gray-600">
                  <Mail className="text-[var(--color-vert-principal)]" size={20} />
                  <div>
                    <p className="text-xs text-gray-500">Email</p>
                    <p className="font-medium text-gray-900">{profile.email}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 text-gray-600">
                  <MapPin className="text-[var(--color-vert-principal)]" size={20} />
                  <div>
                    <p className="text-xs text-gray-500">Localisation</p>
                    <p className="font-medium text-gray-900">
                      {profile.ville ? `${profile.ville}, ` : ''}{profile.pays}
                    </p>
                  </div>
                </div>
                

              </div>
            </div>

            {/* Informations Professionnelles */}
            <div className="space-y-6">
              <h3 className="font-bold text-gray-900 border-b pb-2">Informations Professionnelles</h3>
              
              <div className="space-y-4">
                {profile.organisation && (
                  <div className="flex items-center gap-3 text-gray-600">
                    <Briefcase className="text-[var(--color-orange-accent)]" size={20} />
                    <div>
                      <p className="text-xs text-gray-500">Entreprise / Organisation</p>
                      <p className="font-medium text-gray-900">{profile.organisation}</p>
                    </div>
                  </div>
                )}

                <div>
                  <p className="text-xs text-gray-500 mb-1">Spécialité</p>
                  <span className="px-3 py-1 bg-orange-100 text-[var(--color-orange-accent)] rounded-full text-sm font-medium">
                    {profile.specialite}
                  </span>
                </div>
                
                {profile.biographie && (
                  <div>
                    <p className="text-xs text-gray-500 mb-1">À propos</p>
                    <p className="text-sm text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-lg">
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
