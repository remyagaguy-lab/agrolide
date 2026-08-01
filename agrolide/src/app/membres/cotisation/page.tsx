import { redirect } from "next/navigation"
import { auth } from "@clerk/nextjs/server"
import { db } from "@/db"
import { users, cotisations as cotisationsTable } from "@/db/schema"
import { eq, desc } from "drizzle-orm"
import { CreditCard, Smartphone, CheckCircle, Clock, AlertTriangle } from "lucide-react"
import { PaiementBoutons } from "./PaiementBoutons"

export const metadata = { title: "Ma Cotisation" }

export default async function CotisationPage() {
  const { userId } = await auth()
  if (!userId) redirect("/login")

  const userRows = await db.select({
    id: users.id,
    statut_adhesion: users.statut_adhesion,
    categorie: users.categorie
  })
  .from(users)
  .where(eq(users.id, userId))
  .limit(1)

  const profile = userRows[0] || null

  if (!profile) redirect("/login")

  // Fetch cotisations
  const cotisations = await db.query.cotisations.findMany({
    where: eq(cotisationsTable.membre_id, userId),
    orderBy: [desc(cotisationsTable.created_at)]
  })

  const cotisationActive = cotisations?.find(c => c.statut === 'valide')
  
  const showPaymentBlock = profile.statut_adhesion === 'en_attente_paiement' || profile.statut_adhesion === 'expire'

  const montantFCFA = profile.categorie === 'junior' ? "5 000" : profile.categorie === 'professionnel' ? "15 000" : "Sur devis"

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-heading font-bold text-gray-900 mb-2 tracking-tight">Ma Cotisation</h1>
        <p className="text-gray-500">Gérez votre abonnement et accédez à votre historique de paiement.</p>
      </div>

      {showPaymentBlock && (
        <div className="bg-white/90 backdrop-blur-xl rounded-[32px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-orange-200 overflow-hidden relative">
          <div className="bg-gradient-to-r from-orange-50 to-orange-100/50 p-8 border-b border-orange-100 flex items-start gap-4">
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center shrink-0">
               <AlertTriangle className="text-[var(--color-orange-accent)]" size={24} strokeWidth={2.5} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Finaliser votre adhésion {profile.categorie}
              </h2>
              <p className="text-gray-600 mt-2 leading-relaxed">
                Pour profiter pleinement de tous les avantages du réseau, veuillez régler votre cotisation annuelle de <strong className="text-[var(--color-orange-accent)] text-lg bg-orange-100 px-2 py-0.5 rounded-lg">{montantFCFA} FCFA</strong>.
              </p>
            </div>
          </div>
          
          <div className="p-8">
            <h3 className="font-bold text-gray-900 mb-8 text-center text-lg">Choisissez votre mode de paiement</h3>
            
            {/* Composant Client pour gérer les appels API de paiement */}
            <PaiementBoutons 
              categorie={profile.categorie ?? ''} 
            />
            
            <div className="mt-8 flex items-center justify-center gap-2 text-sm text-gray-400 font-medium">
              <CheckCircle size={16} className="text-green-500" /> Paiements 100% sécurisés
            </div>
          </div>
        </div>
      )}

      {!showPaymentBlock && cotisationActive && (
        <div className="bg-white/90 backdrop-blur-xl rounded-[32px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-[var(--color-vert-clair)] rounded-full flex items-center justify-center text-[var(--color-vert-profond)] shrink-0 shadow-sm">
              <CheckCircle size={32} strokeWidth={2.5} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-1">Adhésion active</h2>
              <p className="text-gray-500">Valable jusqu'au <strong className="text-gray-900 bg-gray-100 px-2 py-0.5 rounded-md">{cotisationActive.date_fin ? new Date(cotisationActive.date_fin).toLocaleDateString('fr-FR') : 'N/A'}</strong></p>
            </div>
          </div>
          <div className="text-right bg-gray-50 p-4 rounded-2xl border border-gray-100">
            <span className="inline-block px-4 py-1.5 bg-white shadow-sm rounded-full text-sm font-bold text-gray-700 mb-2">
              Méthode: {cotisationActive.methode === 'stripe' ? 'Carte Bancaire' : 'Mobile Money'}
            </span>
            <p className="text-sm text-gray-500 font-medium">Montant payé: <span className="text-gray-900 font-bold">{cotisationActive.montant_fcfa} FCFA</span></p>
          </div>
        </div>
      )}

      {/* Historique */}
      <div className="bg-white/90 backdrop-blur-xl rounded-[32px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white overflow-hidden p-2">
        <div className="px-6 py-6 flex items-center gap-3">
          <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
             <Clock size={18} className="text-[var(--color-vert-principal)]" />
          </div>
          <h3 className="font-heading font-bold text-lg text-gray-900">
            Historique de paiements
          </h3>
        </div>
        
        <div className="overflow-x-auto pb-4 px-2">
          <table className="w-full text-left text-sm text-gray-600">
            <thead>
              <tr className="text-gray-400 uppercase tracking-wider text-[11px] font-bold">
                <th className="px-6 py-4 border-b border-gray-100/50">Date</th>
                <th className="px-6 py-4 border-b border-gray-100/50">Montant</th>
                <th className="px-6 py-4 border-b border-gray-100/50">Méthode</th>
                <th className="px-6 py-4 border-b border-gray-100/50">Statut</th>
                <th className="px-6 py-4 border-b border-gray-100/50">Période de validité</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100/50">
              {cotisations && cotisations.length > 0 ? (
                cotisations.map((cotis: any) => (
                  <tr key={cotis.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-5 font-medium">{new Date(cotis.created_at).toLocaleDateString('fr-FR')}</td>
                    <td className="px-6 py-5 font-bold text-gray-900">{cotis.montant_fcfa} FCFA</td>
                    <td className="px-6 py-5 capitalize">
                       <span className="bg-gray-100 px-3 py-1 rounded-lg text-xs font-semibold">{cotis.methode}</span>
                    </td>
                    <td className="px-6 py-5">
                      <span className={`px-3 py-1.5 rounded-xl text-xs font-bold ${
                        cotis.statut === 'valide' ? 'bg-[var(--color-vert-clair)] text-[var(--color-vert-profond)]' : 'bg-red-100 text-red-700'
                      }`}>
                        {cotis.statut}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-xs text-gray-500 font-medium">
                      {new Date(cotis.date_debut).toLocaleDateString('fr-FR')} - {new Date(cotis.date_fin).toLocaleDateString('fr-FR')}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-400">
                    <div className="flex flex-col items-center justify-center gap-2">
                       <Clock size={32} className="opacity-20" />
                       <p>Aucun historique de paiement trouvé.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
