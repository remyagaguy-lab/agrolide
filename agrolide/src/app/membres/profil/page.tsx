import { redirect } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { 
  User, MapPin, Briefcase, Mail, Edit,
  GraduationCap, Globe, Linkedin, ShieldCheck,
  Languages, BookOpen, Star, AlertCircle
} from "lucide-react"
import { auth } from "@clerk/nextjs/server"
import { db } from "@/db"
import { users } from "@/db/schema"
import { eq } from "drizzle-orm"

export const metadata = { title: "Mon Profil" }

function getProfileCompletion(profile: any) {
  const fields = ['prenom', 'nom', 'email', 'ville', 'pays', 'specialite', 'organisation', 'biographie', 'linkedin_url', 'site_web_url', 'langues', 'niveau_etudes', 'secteurs_expertise', 'photo_url'];
  const filled = fields.filter(f => profile[f] && String(profile[f]).trim() !== '').length;
  return Math.round((filled / fields.length) * 100);
}

export default async function ProfilPage() {
  const { userId } = await auth()
  if (!userId) redirect("/login")

  const userRows = await db.select().from(users).where(eq(users.id, userId)).limit(1)
  const profile = userRows[0] || null

  if (!profile) redirect("/login")

  const completion = getProfileCompletion(profile);

  return (
    <div className="max-w-[1000px] mx-auto space-y-4 h-full flex flex-col">
      <div className="flex justify-between items-center shrink-0">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-[#1a1a1a] font-heading leading-tight">Mon Profil</h1>
          <p className="text-[11px] text-gray-500 font-medium mt-0.5">
            Gérez vos informations personnelles et professionnelles.
          </p>
        </div>
        <Link 
          href="/membres/profil/modifier" 
          className="flex items-center gap-1.5 px-4 py-2 bg-[#1b5e38] text-white text-[11px] font-bold rounded-lg hover:bg-[#144a2c] transition-colors shadow-sm"
        >
          <Edit size={14} /> Modifier
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar pb-10 min-h-0">
        
        {/* En-tête du profil */}
        <div className="bg-white rounded-2xl shadow-sm border border-[#e8e8e4] overflow-hidden relative mb-6">
          <div className="h-32 w-full bg-gradient-to-r from-[#1b5e38] via-[#217346] to-[#0c361e] relative overflow-hidden">
             <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_1px_1px,white_1px,transparent_0)] [background-size:20px_20px]"></div>
          </div>
          
          <div className="px-6 pb-6 relative">
            <div className="absolute -top-12 left-6 w-24 h-24 bg-white rounded-2xl p-1 shadow-sm border border-[#e8e8e4]">
              <div className="w-full h-full bg-gray-50 rounded-xl overflow-hidden flex items-center justify-center relative">
                {profile.photo_url ? (
                  <Image src={profile.photo_url} alt="Avatar" fill sizes="96px" className="object-cover" />
                ) : (
                  <User size={32} className="text-gray-300" strokeWidth={1.5} />
                )}
              </div>
            </div>
            
            <div className="ml-28 pt-2 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h2 className="text-xl font-heading font-bold text-[#1a1a1a] tracking-tight flex items-center gap-2">
                  {profile.prenom} {profile.nom}
                  {profile.statut_adhesion === 'payant' && (
                    <ShieldCheck size={16} className="text-[#1b5e38]" />
                  )}
                </h2>
                <div className="text-xs text-gray-500 font-bold mt-1 flex flex-wrap items-center gap-2">
                   {profile.specialite && (
                     <span className="uppercase tracking-wider">{profile.specialite}</span>
                   )}
                   {profile.specialite && <span className="w-1 h-1 rounded-full bg-gray-300"></span>}
                   <span className="text-[#1b5e38]">Membre {profile.categorie}</span>
                   <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                   <span className="capitalize">{profile.statut_adhesion}</span>
                </div>
              </div>
              
              {/* Jauge de complétion */}
              <div className="bg-gray-50 border border-[#e8e8e4] rounded-xl p-3 w-full md:w-48 shrink-0">
                <div className="flex justify-between items-end mb-1.5">
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Complétion</span>
                  <span className="text-xs font-bold text-[#1a1a1a]">{completion}%</span>
                </div>
                <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-[#1b5e38] rounded-full transition-all duration-500" style={{ width: `${completion}%` }}></div>
                </div>
                {completion < 100 && (
                  <p className="text-[9px] text-orange-600 mt-1.5 font-medium flex items-center gap-1">
                    <AlertCircle size={10} /> Complétez votre profil
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* COLONNE GAUCHE (Infos principales) */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Bio */}
            {profile.biographie && (
              <div className="bg-white rounded-2xl shadow-sm border border-[#e8e8e4] p-5">
                <h3 className="font-heading font-bold text-sm text-[#1a1a1a] flex items-center gap-2 mb-3">
                   <BookOpen size={14} className="text-[#1b5e38]" /> À propos
                </h3>
                <p className="text-[11px] text-gray-600 leading-relaxed font-medium">
                  {profile.biographie}
                </p>
              </div>
            )}

            {/* Expérience & Compétences */}
            <div className="bg-white rounded-2xl shadow-sm border border-[#e8e8e4] p-5">
              <h3 className="font-heading font-bold text-sm text-[#1a1a1a] flex items-center gap-2 mb-4">
                 <Star size={14} className="text-[#1b5e38]" /> Expertise & Parcours
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Spécialité */}
                <div className="bg-[#fcfdfc] p-3 rounded-xl border border-[#e8e8e4]">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Spécialité Principale</p>
                  <span className="inline-block px-2.5 py-1 bg-[#dff0e0] text-[#1b5e38] rounded-md text-[10px] font-bold uppercase tracking-wider">
                    {profile.specialite || 'Non renseignée'}
                  </span>
                </div>
                
                {/* Niveau d'études */}
                <div className="bg-[#fcfdfc] p-3 rounded-xl border border-[#e8e8e4]">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Niveau d'études</p>
                  <p className="text-xs font-bold text-[#1a1a1a] flex items-center gap-1.5">
                    <GraduationCap size={14} className="text-gray-400" />
                    {profile.niveau_etudes || 'Non renseigné'}
                  </p>
                </div>
                
                {/* Secteurs d'expertise */}
                <div className="md:col-span-2 bg-[#fcfdfc] p-3 rounded-xl border border-[#e8e8e4]">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Domaines d'expertise</p>
                  <p className="text-[11px] font-medium text-gray-600">
                    {profile.secteurs_expertise || 'Aucun domaine spécifié.'}
                  </p>
                </div>
                
                {/* Langues */}
                <div className="md:col-span-2 bg-[#fcfdfc] p-3 rounded-xl border border-[#e8e8e4]">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Langues parlées</p>
                  <p className="text-[11px] font-medium text-[#1a1a1a] flex items-center gap-1.5">
                    <Languages size={14} className="text-gray-400" />
                    {profile.langues || 'Non renseigné'}
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {/* COLONNE DROITE (Contact & Organisation) */}
          <div className="space-y-6">
            
            {/* Contact */}
            <div className="bg-white rounded-2xl shadow-sm border border-[#e8e8e4] p-5">
              <h3 className="font-heading font-bold text-sm text-[#1a1a1a] flex items-center gap-2 mb-4">
                 <User size={14} className="text-[#1b5e38]" /> Contact
              </h3>
              
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 text-gray-400 bg-gray-50 p-1.5 rounded-lg border border-[#e8e8e4]">
                    <Mail size={12} />
                  </div>
                  <div>
                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Email</p>
                    <p className="text-[11px] font-bold text-[#1a1a1a] break-all">{profile.email}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 text-gray-400 bg-gray-50 p-1.5 rounded-lg border border-[#e8e8e4]">
                    <MapPin size={12} />
                  </div>
                  <div>
                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Localisation</p>
                    <p className="text-[11px] font-bold text-[#1a1a1a]">
                      {profile.ville ? `${profile.ville}, ` : ''}{profile.pays || 'Non renseignée'}
                    </p>
                  </div>
                </div>

                {profile.site_web_url && (
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 text-blue-500 bg-blue-50 p-1.5 rounded-lg border border-blue-100">
                      <Globe size={12} />
                    </div>
                    <div>
                      <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Site Web</p>
                      <a href={profile.site_web_url} target="_blank" rel="noreferrer" className="text-[11px] font-bold text-blue-600 hover:underline break-all">
                        {profile.site_web_url}
                      </a>
                    </div>
                  </div>
                )}
                
                {profile.linkedin_url && (
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 text-[#0a66c2] bg-[#f0f7ff] p-1.5 rounded-lg border border-[#d6e8ff]">
                      <Linkedin size={12} />
                    </div>
                    <div>
                      <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">LinkedIn</p>
                      <a href={profile.linkedin_url} target="_blank" rel="noreferrer" className="text-[11px] font-bold text-[#0a66c2] hover:underline break-all">
                        Voir le profil
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Organisation */}
            <div className="bg-white rounded-2xl shadow-sm border border-[#e8e8e4] p-5">
              <h3 className="font-heading font-bold text-sm text-[#1a1a1a] flex items-center gap-2 mb-4">
                 <Briefcase size={14} className="text-[#1b5e38]" /> Organisation
              </h3>
              
              {profile.organisation ? (
                <div className="bg-[#fcfdfc] p-3 rounded-xl border border-[#e8e8e4] flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center border border-[#e8e8e4]">
                    <Briefcase size={16} className="text-gray-400" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#1a1a1a]">{profile.organisation}</p>
                    <p className="text-[10px] text-gray-500 mt-0.5 font-medium">Entreprise / Association</p>
                  </div>
                </div>
              ) : (
                <p className="text-[11px] text-gray-500 text-center py-4 italic">
                  Aucune organisation renseignée.
                </p>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}
