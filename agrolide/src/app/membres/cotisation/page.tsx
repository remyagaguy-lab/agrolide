import { redirect } from "next/navigation"
import { auth } from "@/lib/auth/server"
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
    <div className="max-w-[1200px] mx-auto px-2 md:px-4 py-6 space-y-6">
      <div>
        <h1 className="text-xl md:text-2xl font-bold text-on-surface font-heading mb-1">Ma Cotisation</h1>
        <p className="text-xs text-on-surface-muted">Gérez votre abonnement et accédez à votre historique de paiement.</p>
      </div>

      {showPaymentBlock && (
        <div className="bg-surface-container-lowest rounded-2xl shadow-sm border border-orange-200 overflow-hidden relative">
          <div className="bg-gradient-to-r from-orange-50 to-orange-100/50 p-6 border-b border-orange-100 flex items-start gap-4">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center shrink-0 border border-orange-200">
               <AlertTriangle className="text-orange-600 w-5 h-5" strokeWidth={2.5} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-on-surface">
                Finaliser votre adhésion {profile.categorie}
              </h2>
              <p className="text-xs text-on-surface-variant mt-1.5 leading-relaxed">
                Pour profiter pleinement de tous les avantages du réseau, veuillez régler votre cotisation annuelle de <strong className="text-orange-600 text-sm bg-orange-100 border border-orange-200 px-2 py-0.5 rounded ml-1">{montantFCFA} FCFA</strong>.
              </p>
            </div>
          </div>
          
          <div className="p-6">
            <h3 className="font-bold text-on-surface mb-6 text-center text-sm">Choisissez votre mode de paiement</h3>
            
            {/* Composant Client pour gérer les appels API de paiement */}
            <PaiementBoutons 
              categorie={profile.categorie ?? ''} 
            />
            
            <div className="mt-6 flex items-center justify-center gap-1.5 text-[11px] text-on-surface-muted font-bold uppercase tracking-wider">
              <CheckCircle size={14} className="text-success" /> Paiements 100% sécurisés
            </div>
          </div>
        </div>
      )}

      {!showPaymentBlock && cotisationActive && (
        <div className="bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant p-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-primary-container border border-outline-variant rounded-full flex items-center justify-center text-primary shrink-0 shadow-sm">
              <CheckCircle size={24} strokeWidth={2.5} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-on-surface mb-0.5">Adhésion active</h2>
              <p className="text-xs text-on-surface-muted">Valable jusqu'au <strong className="text-on-surface bg-surface-container-low border border-outline-variant px-1.5 py-0.5 rounded">{cotisationActive.date_fin ? new Date(cotisationActive.date_fin).toLocaleDateString('fr-FR') : 'N/A'}</strong></p>
            </div>
          </div>
          <div className="text-right bg-surface-container-low p-3 rounded-xl border border-outline-variant">
            <span className="inline-block px-3 py-1 bg-surface-container-lowest shadow-sm border border-outline-variant rounded text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-2">
              Méthode: {cotisationActive.methode === 'stripe' ? 'Carte Bancaire' : 'Mobile Money'}
            </span>
            <p className="text-[11px] text-on-surface-muted font-bold uppercase tracking-wider">Montant payé: <span className="text-on-surface">{cotisationActive.montant_fcfa} FCFA</span></p>
          </div>
        </div>
      )}

      {/* Historique */}
      <div className="bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant overflow-hidden">
        <div className="px-5 py-4 border-b border-outline-variant flex items-center gap-2.5">
          <div className="w-8 h-8 bg-surface-container-low border border-outline-variant rounded-lg flex items-center justify-center">
             <Clock size={16} className="text-primary" />
          </div>
          <h3 className="font-heading font-bold text-sm text-on-surface">
            Historique de paiements
          </h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[11px]">
            <thead className="bg-surface-container-low">
              <tr className="text-on-surface-muted uppercase tracking-wider font-bold">
                <th className="px-4 py-3 border-b border-outline-variant">Date</th>
                <th className="px-4 py-3 border-b border-outline-variant">Montant</th>
                <th className="px-4 py-3 border-b border-outline-variant">Méthode</th>
                <th className="px-4 py-3 border-b border-outline-variant">Statut</th>
                <th className="px-4 py-3 border-b border-outline-variant">Période de validité</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant">
              {cotisations && cotisations.length > 0 ? (
                cotisations.map((cotis: any) => (
                  <tr key={cotis.id} className="hover:bg-surface-container-low transition-colors">
                    <td className="px-4 py-3 font-medium text-on-surface-variant">{new Date(cotis.created_at).toLocaleDateString('fr-FR')}</td>
                    <td className="px-4 py-3 font-bold text-on-surface">{cotis.montant_fcfa} FCFA</td>
                    <td className="px-4 py-3 capitalize">
                       <span className="bg-surface-container-low border border-outline-variant px-2 py-0.5 rounded text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">{cotis.methode}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${
                        cotis.statut === 'valide' ? 'bg-primary-container text-primary border-outline-variant' : 'bg-error-container text-error border-error/30'
                      }`}>
                        {cotis.statut}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-on-surface-muted font-medium">
                      {new Date(cotis.date_debut).toLocaleDateString('fr-FR')} - {new Date(cotis.date_fin).toLocaleDateString('fr-FR')}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center text-on-surface-muted">
                    <div className="flex flex-col items-center justify-center gap-2">
                       <Clock size={24} className="opacity-20" />
                       <p className="font-medium text-xs">Aucun historique de paiement trouvé.</p>
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
