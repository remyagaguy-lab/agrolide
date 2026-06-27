import React from 'react'
import { createClient } from '@supabase/supabase-js'
import Link from 'next/link'
import { MapPin, Briefcase, Users, Globe } from 'lucide-react'
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
    <div className="min-h-screen" style={{ color: '#1a1a1a' }}>

      {/* ── Hero Section ── */}
      <section className="bg-[#0d3520] pt-32 pb-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <span className="inline-block mb-5 px-4 py-1.5 rounded-full text-sm font-heading font-bold" style={{ backgroundColor: '#fcb726', color: '#1a1a1a' }}>
            Réseau Agrolide
          </span>
          <h1 className="font-heading font-bold text-4xl md:text-5xl lg:text-6xl text-white mb-6 leading-tight tracking-tight">
            Annuaire du réseau
          </h1>
          <p className="text-lg md:text-xl text-white/80 font-sans max-w-2xl mx-auto leading-relaxed">
            Connectez-vous avec <strong className="text-white">{nbMembres} experts, chercheurs et entrepreneurs</strong> à travers toute l'Afrique. Partagez vos expériences, trouvez des partenaires et accélérez la transition agroécologique.
          </p>
        </div>
      </section>

      {/* ── Stats / Features Section ── */}
      <section className="bg-white py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: '#e8f5e9' }}>
                <Users className="w-7 h-7" style={{ color: '#1b5e38' }} />
              </div>
              <div className="font-heading font-bold text-4xl mb-1" style={{ color: '#1b5e38' }}>{nbMembres}+</div>
              <div className="font-sans text-sm" style={{ color: '#666' }}>Membres actifs</div>
            </div>
            <div className="text-center p-6">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: '#e8f5e9' }}>
                <Globe className="w-7 h-7" style={{ color: '#1b5e38' }} />
              </div>
              <div className="font-heading font-bold text-4xl mb-1" style={{ color: '#1b5e38' }}>20+</div>
              <div className="font-sans text-sm" style={{ color: '#666' }}>Pays représentés</div>
            </div>
            <div className="text-center p-6">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: '#e8f5e9' }}>
                <Briefcase className="w-7 h-7" style={{ color: '#1b5e38' }} />
              </div>
              <div className="font-heading font-bold text-4xl mb-1" style={{ color: '#1b5e38' }}>10+</div>
              <div className="font-sans text-sm" style={{ color: '#666' }}>Domaines d'expertise</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Map + Value Proposition Section ── */}
      <section className="bg-[#f8f8f6] py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">

            {/* Abstract Africa Map SVG */}
            <div className="relative aspect-square max-w-md mx-auto w-full opacity-90">
              <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-xl" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Silhouette simplifiée Afrique */}
                <path d="M50,70 C40,75 30,90 25,110 C20,130 35,160 55,180 C75,200 110,195 130,170 C150,145 160,110 170,80 C180,50 150,30 120,25 C90,20 60,65 50,70 Z" fill="#d4e8da"/>

                {/* Dots representing members — alternating green / amber */}
                <circle cx="50" cy="110" r="4" fill="#1b5e38" className="animate-pulse" />
                <circle cx="80" cy="80" r="5" fill="#fcb726" className="animate-pulse" style={{ animationDelay: '0.5s' }} />
                <circle cx="120" cy="140" r="3" fill="#1b5e38" className="animate-pulse" style={{ animationDelay: '1s' }} />
                <circle cx="70" cy="150" r="4" fill="#fcb726" className="animate-pulse" style={{ animationDelay: '0.2s' }} />
                <circle cx="140" cy="90" r="6" fill="#1b5e38" className="animate-pulse" style={{ animationDelay: '1.5s' }} />
                <circle cx="90" cy="120" r="4" fill="#fcb726" className="animate-pulse" style={{ animationDelay: '0.8s' }} />
                <circle cx="100" cy="60" r="3" fill="#1b5e38" className="animate-pulse" style={{ animationDelay: '1.2s' }} />

                {/* Connections */}
                <path d="M50,110 L80,80 M80,80 L140,90 M80,80 L90,120 M90,120 L70,150 M90,120 L120,140 M140,90 L100,60" stroke="#1b5e38" strokeWidth="0.5" strokeDasharray="2 2" className="opacity-40" />
              </svg>
            </div>

            {/* Value Proposition */}
            <div className="space-y-10">
              <div>
                <span className="inline-block mb-4 px-3 py-1 rounded-full text-xs font-heading font-bold" style={{ backgroundColor: '#fcb726', color: '#1a1a1a' }}>
                  Pourquoi rejoindre ?
                </span>
                <h2 className="font-heading font-bold text-3xl md:text-4xl leading-tight" style={{ color: '#1a1a1a' }}>
                  Le réseau des acteurs de l'<span style={{ color: '#1b5e38' }}>agroécologie</span>
                </h2>
              </div>

              <div className="flex gap-5">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: '#e8f5e9' }}>
                  <Briefcase className="w-6 h-6" style={{ color: '#1b5e38' }} />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-lg mb-1" style={{ color: '#1a1a1a' }}>Des profils qualifiés</h3>
                  <p className="font-sans leading-relaxed" style={{ color: '#666' }}>Recherchez par spécialité, pays ou compétence pour trouver exactement l'expertise dont vous avez besoin.</p>
                </div>
              </div>

              <div className="flex gap-5">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: '#e8f5e9' }}>
                  <MapPin className="w-6 h-6" style={{ color: '#1b5e38' }} />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-lg mb-1" style={{ color: '#1a1a1a' }}>Un ancrage local</h3>
                  <p className="font-sans leading-relaxed" style={{ color: '#666' }}>Identifiez les acteurs proches de chez vous ou dans les régions qui vous intéressent pour des collaborations terrains.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Directory Preview Section (Blurred) ── */}
      <section className="bg-white py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-heading font-bold text-2xl md:text-3xl text-center mb-10" style={{ color: '#1a1a1a' }}>
            Ils font partie du réseau
          </h2>

          <div className="relative">
            {/* Overlay */}
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center rounded-3xl border border-gray-200/50 backdrop-blur-[5px]" style={{ backgroundColor: 'rgba(248,248,246,0.65)' }}>
              <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center border border-gray-100">
                <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: '#e8f5e9', color: '#1b5e38' }}>
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="font-heading font-bold text-xl mb-3" style={{ color: '#1a1a1a' }}>Contenu réservé aux membres</h3>
                <p className="font-sans mb-6" style={{ color: '#666' }}>
                  Rejoignez Agrolide pour accéder à l'annuaire complet de {nbMembres} membres et entrer en contact direct avec eux.
                </p>
                <Link
                  href="/inscription"
                  className="block w-full font-heading font-bold py-3 px-4 rounded-xl transition-colors shadow-sm text-center"
                  style={{ backgroundColor: '#fcb726', color: '#1a1a1a' }}
                >
                  Devenir membre
                </Link>
                <div className="mt-4 text-sm font-sans" style={{ color: '#666' }}>
                  Déjà membre ?{' '}
                  <Link href="/connexion" className="font-medium hover:underline" style={{ color: '#1b5e38' }}>
                    Se connecter
                  </Link>
                </div>
              </div>
            </div>

            {/* Faux profils (derrière l'overlay flouté) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 opacity-80 filter blur-[2px] pointer-events-none select-none">
              {fauxMembres.map((m, i) => (
                <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
                  <div className={`w-14 h-14 rounded-full flex items-center justify-center font-bold text-xl shrink-0 ${m.bgColor} ${m.txtColor}`}>
                    {m.nom.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-heading font-bold truncate" style={{ color: '#1a1a1a' }}>{m.nom}</div>
                    <div className="text-sm font-medium truncate" style={{ color: '#444' }}>{m.role}</div>
                    <div className="text-xs mt-1 flex items-center gap-2 font-sans" style={{ color: '#666' }}>
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
      </section>

      {/* ── Bottom CTA Card ── */}
      <section className="bg-[#f8f8f6] py-20 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="rounded-3xl p-10 md:p-14 text-center" style={{ background: 'linear-gradient(135deg, #fcb726 0%, #f5a800 100%)' }}>
            <h2 className="font-heading font-bold text-3xl md:text-4xl mb-4" style={{ color: '#1a1a1a' }}>
              Rejoignez le réseau dès aujourd'hui
            </h2>
            <p className="font-sans text-lg mb-8 max-w-xl mx-auto" style={{ color: '#3a3a3a' }}>
              Accédez à l'annuaire complet, connectez-vous avec des pairs et contribuez à la transition agroécologique en Afrique.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/inscription"
                className="inline-block font-heading font-bold py-3.5 px-8 rounded-xl transition-colors shadow-md"
                style={{ backgroundColor: '#1b5e38', color: '#ffffff' }}
              >
                Devenir membre
              </Link>
              <Link
                href="/connexion"
                className="inline-block font-heading font-bold py-3.5 px-8 rounded-xl transition-colors border-2"
                style={{ borderColor: '#1b5e38', color: '#1b5e38', backgroundColor: 'transparent' }}
              >
                Se connecter
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}
