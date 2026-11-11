import { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Textarea } from "@/components/ui/Textarea"
import { Briefcase, LineChart, FileText, ArrowRight } from "lucide-react"
import DemandeServiceForm from "@/components/modules/agrobusiness/DemandeServiceForm"

export const metadata: Metadata = {
  title: "Agrobusiness & Consulting - Accompagnement",
  description: "Conseil stratégique et incubation pour les projets agricoles en Afrique. Notre réseau agricole vous accompagne de l'idée au marché pour bâtir des entreprises viables.",
  alternates: { canonical: '/agrobusiness' }
}

export default function AgrobusinessPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero */}
      <section className="bg-surface-brand py-20 text-on-surface-brand text-center">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-heading font-bold mb-6">
            Agrobusiness & Consulting
          </h1>
          <p className="text-xl max-w-2xl mx-auto text-on-surface-brand/90">
            De l'idée au marché : nous accompagnons vos projets agricoles pour les transformer en entreprises viables et durables.
          </p>
        </div>
      </section>

      {/* Services */}
      <section className="py-24 bg-surface-container-low">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-heading font-bold text-primary mb-4">
              Nos services d'accompagnement
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Service 1 */}
            <div className="bg-surface-container-lowest p-8 rounded-2xl shadow-sm border border-outline-variant flex flex-col h-full">
              <div className="w-14 h-14 bg-tertiary-container rounded-lg flex items-center justify-center text-on-tertiary-container mb-6">
                <FileText size={28} />
              </div>
              <h3 className="text-xl font-bold text-on-surface mb-4">Études & Business Plans</h3>
              <p className="text-on-surface-variant mb-6 flex-grow">
                Études de faisabilité, études de marché et rédaction de business plans bancables pour sécuriser vos financements.
              </p>
            </div>

            {/* Service 2 */}
            <div className="bg-surface-container-lowest p-8 rounded-2xl shadow-sm border border-outline-variant flex flex-col h-full">
              <div className="w-14 h-14 bg-success-container rounded-lg flex items-center justify-center text-primary mb-6">
                <LineChart size={28} />
              </div>
              <h3 className="text-xl font-bold text-on-surface mb-4">Conseil Stratégique</h3>
              <p className="text-on-surface-variant mb-6 flex-grow">
                Appui technique aux exploitations, optimisation des processus de production et structuration de chaînes de valeur.
              </p>
            </div>

            {/* Service 3 */}
            <div className="bg-surface-container-lowest p-8 rounded-2xl shadow-sm border-2 border-primary flex flex-col h-full relative">
              <div className="w-14 h-14 bg-info-container rounded-lg flex items-center justify-center text-info mb-6">
                <Briefcase size={28} />
              </div>
              <h3 className="text-xl font-bold text-on-surface mb-4">Incubation & Accélération</h3>
              <p className="text-on-surface-variant mb-6 flex-grow">
                Programmes complets pour les agripreneurs : mentorat, coaching au pitch et préparation du dossier de financement.
              </p>
              <Link href="/agrobusiness/incubation" className="mt-auto">
                <Button className="w-full flex items-center justify-center gap-2">
                  Découvrir le programme <ArrowRight size={16} />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Formulaire de demande */}
      <section className="py-24 bg-surface-container-lowest">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-heading font-bold text-primary mb-4">
              Demander un accompagnement
            </h2>
            <p className="text-on-surface-variant">
              Remplissez ce formulaire pour nous faire part de vos besoins. Un de nos experts vous recontacte rapidement, 72 h au maximum.
            </p>
          </div>

          <DemandeServiceForm />
        </div>
      </section>
    </div>
  )
}
