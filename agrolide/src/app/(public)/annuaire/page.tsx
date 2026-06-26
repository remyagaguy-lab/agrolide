import React from 'react'
import { createClient } from '@supabase/supabase-js'
import Link from 'next/link'
import { MapPin, Briefcase } from 'lucide-react'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Annuaire des Membres | Agrolide',
  description: 'Rejoignez le réseau professionnel de la transition agroécologique en Afrique.',
}

export const revalidate = 3600 // ISR toutes les heures

export default async function AnnuairePublicPage() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
  const supabase = createClient(supabaseUrl, supabaseKey)

  // On compte les membres visibles
  const { count } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })
    .eq('annuaire_visible', true)

  const nbMembres = count || 250 // Fallback

  const fauxMembres = [
    { nom: 'Kwame A.', role: 'Agronome', pays: 'Ghana', domaine: 'Productions végétales', bgColor: 'bg-green-100', txtColor: 'text-green-700' },
    { nom: 'Fatou D.', role: 'Chercheuse', pays: 'Sénégal', domaine: 'Agritech', bgColor: 'bg-blue-100', txtColor: 'text-blue-700' },
    { nom: 'Jean-Baptiste M.', role: 'Consultant', pays: 'Cameroun', domaine: 'Agroéconomie', bgColor: 'bg-orange-100', txtColor: 'text-orange-700' },
    { nom: 'Aminata S.', role: 'Ingénieure agricole', pays: "Côte d'Ivoire", domaine: 'Élevage', bgColor: 'bg-purple-100', txtColor: 'text-purple-700' },
    { nom: 'Ibrahim T.', role: 'Entrepreneur', pays: 'Mali', domaine: 'Transformation', bgColor: 'bg-yellow-100', txtColor: 'text-yellow-700' },
    { nom: 'Grace N.', role: 'Chercheuse', pays: 'Togo', domaine: 'Productions végétales', bgColor: 'bg-teal-100', txtColor: 'text-teal-700' },
  ]

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 tracking-tight">
            Le réseau des acteurs de <span className="text-primary-600">l'agroécologie</span>
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Connectez-vous avec <strong>{nbMembres} experts, chercheurs et entrepreneurs</strong> à travers toute l'Afrique. Partagez vos expériences, trouvez des partenaires et accélérez la transition.
          </p>
        </div>

        {/* Africa Map & Preview Section */}
        <div className="grid md:grid-cols-2 gap-12 items-center mb-24">
          
          {/* Abstract Africa Map SVG */}
          <div className="relative aspect-square max-w-md mx-auto w-full opacity-80">
            <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-xl" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Silhouette simplifiée Afrique */}
              <path d="M50,70 C40,75 30,90 25,110 C20,130 35,160 55,180 C75,200 110,195 130,170 C150,145 160,110 170,80 C180,50 150,30 120,25 C90,20 60,65 50,70 Z" fill="#E5E7EB"/>
              
              {/* Dots representing members */}
              <circle cx="50" cy="110" r="4" fill="#166534" className="animate-pulse" />
              <circle cx="80" cy="80" r="5" fill="#166534" className="animate-pulse" style={{ animationDelay: '0.5s' }} />
              <circle cx="120" cy="140" r="3" fill="#166534" className="animate-pulse" style={{ animationDelay: '1s' }} />
              <circle cx="70" cy="150" r="4" fill="#166534" className="animate-pulse" style={{ animationDelay: '0.2s' }} />
              <circle cx="140" cy="90" r="6" fill="#166534" className="animate-pulse" style={{ animationDelay: '1.5s' }} />
              <circle cx="90" cy="120" r="4" fill="#166534" className="animate-pulse" style={{ animationDelay: '0.8s' }} />
              <circle cx="100" cy="60" r="3" fill="#166534" className="animate-pulse" style={{ animationDelay: '1.2s' }} />
              
              {/* Connections */}
              <path d="M50,110 L80,80 M80,80 L140,90 M80,80 L90,120 M90,120 L70,150 M90,120 L120,140 M140,90 L100,60" stroke="#166534" strokeWidth="0.5" strokeDasharray="2 2" className="opacity-30" />
            </svg>
          </div>

          {/* Value Proposition */}
          <div className="space-y-8">
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center shrink-0">
                <Briefcase className="w-6 h-6 text-primary-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Des profils qualifiés</h3>
                <p className="text-gray-600">Recherchez par spécialité, pays ou compétence pour trouver exactement l'expertise dont vous avez besoin.</p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center shrink-0">
                <MapPin className="w-6 h-6 text-primary-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Un ancrage local</h3>
                <p className="text-gray-600">Identifiez les acteurs proches de chez vous ou dans les régions qui vous intéressent pour des collaborations terrains.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Directory Preview Section (Blurred) */}
        <div className="relative mt-20">
          <h2 className="text-2xl font-bold text-center mb-8 text-gray-900">Ils font partie du réseau</h2>
          
          <div className="relative">
            {/* Overlay */}
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-gray-50/60 backdrop-blur-[5px] rounded-3xl border border-gray-200/50">
              <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center border border-gray-100">
                <div className="w-16 h-16 bg-primary-50 text-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Contenu réservé aux membres</h3>
                <p className="text-gray-600 mb-6">Rejoignez Agrolide pour accéder à l'annuaire complet de {nbMembres} membres et entrer en contact direct avec eux.</p>
                <Link href="/inscription" className="block w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-4 rounded-xl transition-colors shadow-sm">
                  Devenir membre
                </Link>
                <div className="mt-4 text-sm text-gray-500">
                  Déjà membre ? <Link href="/connexion" className="text-primary-600 hover:underline font-medium">Se connecter</Link>
                </div>
              </div>
            </div>

            {/* Faux profils (derrière l'overlay flouté par l'overlay lui-même, mais on peut aussi leur mettre un petit blur pour être sûr) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 opacity-80 filter blur-[2px] pointer-events-none select-none">
              {fauxMembres.map((m, i) => (
                <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
                  <div className={`w-14 h-14 rounded-full flex items-center justify-center font-bold text-xl shrink-0 ${m.bgColor} ${m.txtColor}`}>
                    {m.nom.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-gray-900 truncate">{m.nom}</div>
                    <div className="text-sm font-medium text-gray-700 truncate">{m.role}</div>
                    <div className="text-xs text-gray-500 mt-1 flex items-center gap-2">
                      <span>🌍 {m.pays}</span>
                      <span>•</span>
                      <span className="truncate">{m.domaine}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
