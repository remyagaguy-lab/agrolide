import React from 'react'
import { Metadata } from 'next'
import AnnuaireClient from '@/components/modules/annuaire/AnnuaireClient'
import Link from 'next/link'

export const metadata: Metadata = {
  title: "Annuaire des Acteurs Agricoles",
  description: "Trouvez et connectez-vous avec les experts, ingénieurs et partenaires du premier réseau agricole africain. Rejoignez notre annuaire pour accélérer la transition agroécologique.",
}

export const revalidate = 3600 // ISR toutes les heures

export default async function AnnuairePublicPage() {
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
            Connectez-vous avec des experts, chercheurs et entrepreneurs à travers toute l'Afrique. Partagez vos expériences, trouvez des partenaires et accélérez la transition agroécologique.
          </p>
        </div>
      </section>

      <div className="max-w-[1600px] mx-auto px-4 py-12">
        <AnnuaireClient />
      </div>

      {/* CTA Section */}
      <section className="bg-[#f8f8f6] py-20 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="rounded-3xl p-10 md:p-14 text-center" style={{ background: 'linear-gradient(135deg, #fcb726 0%, #f5a800 100%)' }}>
            <h2 className="font-heading font-bold text-3xl md:text-4xl mb-4" style={{ color: '#1a1a1a' }}>
              Vous souhaitez apparaître dans l'annuaire ?
            </h2>
            <p className="font-sans text-lg mb-8 max-w-xl mx-auto" style={{ color: '#3a3a3a' }}>
              S'enregistrer dans l'annuaire est le meilleur moyen de vous connecter avec des pairs et de contribuer à la transition agroécologique en Afrique.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/inscription"
                className="inline-block font-heading font-bold py-3.5 px-8 rounded-xl transition-colors shadow-md"
                style={{ backgroundColor: '#1b5e38', color: '#ffffff' }}
              >
                S'enregistrer
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
