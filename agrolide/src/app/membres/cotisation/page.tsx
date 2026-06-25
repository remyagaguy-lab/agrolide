import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { CreditCard, Smartphone, CheckCircle, Clock, AlertTriangle } from "lucide-react"
import { PaiementBoutons } from "./PaiementBoutons"

export default async function CotisationPage() {
  const supabase = await createClient()

  const { data: { session } } = await supabase.auth.getSession()
  if (!session) redirect("/login")

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", session.user.id)
    .single()

  if (!profile) redirect("/login")

  // Fetch cotisations
  let { data: cotisations } = await supabase
    .from("cotisations")
    .select("*")
    .eq("membre_id", session.user.id)
    .order("created_at", { ascending: false })
    
  if (!cotisations) cotisations = []

  const cotisationActive = cotisations?.find(c => c.statut === 'valide')
  
  const showPaymentBlock = profile.statut_adhesion === 'en_attente_paiement' || profile.statut_adhesion === 'expire'

  const montantFCFA = profile.categorie === 'junior' ? "5 000" : profile.categorie === 'professionnel' ? "15 000" : "Sur devis"

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-heading font-bold text-gray-900 mb-2">Ma Cotisation</h1>
        <p className="text-[var(--color-gris-texte)]">Gérez votre abonnement et accédez à votre historique de paiement.</p>
      </div>

      {showPaymentBlock && (
        <div className="bg-white rounded-2xl shadow-sm border-2 border-[var(--color-orange-accent)] overflow-hidden">
          <div className="bg-orange-50 p-6 border-b border-orange-100 flex items-start gap-4">
            <AlertTriangle className="text-[var(--color-orange-accent)] shrink-0 mt-1" size={24} />
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Finaliser votre adhésion {profile.categorie}
              </h2>
              <p className="text-gray-700 mt-1">
                Pour profiter pleinement de tous les avantages du réseau, veuillez régler votre cotisation annuelle de <strong className="text-[var(--color-orange-accent)]">{montantFCFA} FCFA</strong>.
              </p>
            </div>
          </div>
          
          <div className="p-8">
            <h3 className="font-bold text-gray-900 mb-6 text-center">Choisissez votre mode de paiement</h3>
            
            {/* Composant Client pour gérer les appels API de paiement */}
            <PaiementBoutons 
              sessionToken={session.access_token} 
              categorie={profile.categorie} 
            />
            
            <div className="mt-6 flex items-center justify-center gap-2 text-sm text-gray-500">
              <CheckCircle size={16} className="text-green-500" /> Paiements 100% sécurisés
            </div>
          </div>
        </div>
      )}

      {!showPaymentBlock && cotisationActive && (
        <div className="bg-white rounded-2xl shadow-sm border border-[var(--color-gris-clair)] p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center text-[var(--color-vert-principal)] shrink-0">
              <CheckCircle size={32} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Adhésion active</h2>
              <p className="text-[var(--color-gris-texte)]">Valable jusqu'au <strong className="text-gray-900">{new Date(cotisationActive.date_fin).toLocaleDateString('fr-FR')}</strong></p>
            </div>
          </div>
          <div className="text-right">
            <span className="inline-block px-3 py-1 bg-gray-100 rounded-full text-sm font-medium text-gray-700 mb-2">
              Méthode: {cotisationActive.methode_paiement === 'stripe' ? 'Carte Bancaire' : 'Mobile Money'}
            </span>
            <p className="text-sm text-gray-500">Montant payé: {cotisationActive.montant} {cotisationActive.devise}</p>
          </div>
        </div>
      )}

      {/* Historique */}
      <div className="bg-white rounded-2xl shadow-sm border border-[var(--color-gris-clair)] overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="font-bold text-gray-900 flex items-center gap-2">
            <Clock size={18} className="text-[var(--color-vert-principal)]" />
            Historique de paiements
          </h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 text-gray-700">
              <tr>
                <th className="px-6 py-3 font-semibold">Date</th>
                <th className="px-6 py-3 font-semibold">Montant</th>
                <th className="px-6 py-3 font-semibold">Méthode</th>
                <th className="px-6 py-3 font-semibold">Statut</th>
                <th className="px-6 py-3 font-semibold">Période de validité</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {cotisations && cotisations.length > 0 ? (
                cotisations.map((cotis: any) => (
                  <tr key={cotis.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">{new Date(cotis.created_at).toLocaleDateString('fr-FR')}</td>
                    <td className="px-6 py-4 font-medium text-gray-900">{cotis.montant} {cotis.devise}</td>
                    <td className="px-6 py-4 capitalize">{cotis.methode_paiement}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        cotis.statut === 'valide' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {cotis.statut}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs">
                      {new Date(cotis.date_debut).toLocaleDateString('fr-FR')} - {new Date(cotis.date_fin).toLocaleDateString('fr-FR')}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500 italic">
                    Aucun historique de paiement trouvé.
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
