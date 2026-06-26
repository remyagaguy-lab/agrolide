import { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/Button"
import { ArrowLeft, Rocket } from "lucide-react"
import { createClient } from "@supabase/supabase-js"
import AgripreneurCard from "@/components/modules/agrobusiness/AgripreneurCard"

export const metadata: Metadata = {
  title: "Nos Agripreneurs | agrolide",
  description: "Découvrez les success stories des agripreneurs incubés par le réseau agrolide.",
}

export const revalidate = 3600 // ISR toutes les heures

export default async function AgripreneursPage() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
  const supabase = createClient(supabaseUrl, supabaseKey)

  const { data: agripreneurs } = await supabase
    .from('agripreneurs')
    .select('*')
    .eq('statut', 'actif')
    .order('created_at', { ascending: false })

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-[var(--color-vert-principal)] py-16 text-white text-center">
        <div className="container mx-auto px-4">
          <Link href="/agrobusiness" className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors mb-6 text-sm">
            <ArrowLeft size={16} /> Retour à l'Agrobusiness
          </Link>
          <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">
            Nos Agripreneurs
          </h1>
          <p className="text-xl max-w-2xl mx-auto text-white/90">
            Les startups et projets qui transforment l'agriculture africaine, accompagnés par l'incubateur agrolide.
          </p>
        </div>
      </section>

      {/* Grille */}
      <section className="py-24">
        <div className="container mx-auto px-4 max-w-7xl">
          {agripreneurs && agripreneurs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {agripreneurs.map((a) => (
                <AgripreneurCard key={a.id} agripreneur={a} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-dashed border-[var(--color-orange-accent)] p-16 text-center max-w-4xl mx-auto shadow-sm">
              <div className="w-24 h-24 bg-orange-50 rounded-full flex items-center justify-center mx-auto text-[var(--color-orange-accent)] mb-6">
                <Rocket size={48} />
              </div>
              <h2 className="text-3xl font-heading font-bold text-gray-900 mb-4">
                Success stories à venir !
              </h2>
              <p className="text-[var(--color-gris-texte)] text-lg mb-8 max-w-xl mx-auto">
                La première cohorte d'incubation est en cours de sélection. Revenez bientôt pour découvrir les profils de nos brillants agripreneurs et suivre leur évolution.
              </p>
              <div className="flex justify-center gap-4">
                <Link href="/agrobusiness/incubation">
                  <Button variant="primary">Faire partie de la 1ère cohorte</Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
