import { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Textarea } from "@/components/ui/Textarea"
import { Briefcase, LineChart, FileText, ArrowRight } from "lucide-react"

export const metadata: Metadata = {
  title: "Agrobusiness & Consulting | agrolide",
  description: "Conseil, accompagnement stratégique et incubation pour les projets agricoles en Afrique.",
}

export default function AgrobusinessPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero */}
      <section className="bg-[var(--color-vert-principal)] py-20 text-white text-center">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-heading font-bold mb-6">
            Agrobusiness & Consulting
          </h1>
          <p className="text-xl max-w-2xl mx-auto text-white/90">
            De l'idée au marché : nous accompagnons vos projets agricoles pour les transformer en entreprises viables et durables.
          </p>
        </div>
      </section>

      {/* Services */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-heading font-bold text-[var(--color-vert-principal)] mb-4">
              Nos services d'accompagnement
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Service 1 */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-[var(--color-gris-clair)] flex flex-col h-full">
              <div className="w-14 h-14 bg-orange-50 rounded-lg flex items-center justify-center text-[var(--color-orange-accent)] mb-6">
                <FileText size={28} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Études & Business Plans</h3>
              <p className="text-[var(--color-gris-texte)] mb-6 flex-grow">
                Études de faisabilité, études de marché et rédaction de business plans bancables pour sécuriser vos financements.
              </p>
            </div>

            {/* Service 2 */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-[var(--color-gris-clair)] flex flex-col h-full">
              <div className="w-14 h-14 bg-green-50 rounded-lg flex items-center justify-center text-[var(--color-vert-principal)] mb-6">
                <LineChart size={28} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Conseil Stratégique</h3>
              <p className="text-[var(--color-gris-texte)] mb-6 flex-grow">
                Appui technique aux exploitations, optimisation des processus de production et structuration de chaînes de valeur.
              </p>
            </div>

            {/* Service 3 */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border-2 border-[var(--color-vert-principal)] flex flex-col h-full relative">
              <div className="absolute -top-4 right-6 bg-[var(--color-orange-accent)] text-white text-xs font-bold px-3 py-1 rounded-full">
                Programme Phare
              </div>
              <div className="w-14 h-14 bg-purple-50 rounded-lg flex items-center justify-center text-purple-600 mb-6">
                <Briefcase size={28} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Incubation & Accélération</h3>
              <p className="text-[var(--color-gris-texte)] mb-6 flex-grow">
                Programmes complets pour les agripreneurs : mentorat, préparation au pitch investisseurs et mise en réseau.
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
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-heading font-bold text-[var(--color-vert-principal)] mb-4">
              Demander un accompagnement
            </h2>
            <p className="text-[var(--color-gris-texte)]">
              Remplissez ce formulaire pour nous faire part de vos besoins. Un de nos experts vous contactera sous 48h.
            </p>
          </div>

          <div className="bg-gray-50 p-8 md:p-10 rounded-2xl border border-[var(--color-gris-clair)] shadow-sm">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700" htmlFor="prenom">Prénom</label>
                  <Input id="prenom" placeholder="Votre prénom" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700" htmlFor="nom">Nom</label>
                  <Input id="nom" placeholder="Votre nom" />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700" htmlFor="email">Email</label>
                  <Input id="email" type="email" placeholder="votre@email.com" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700" htmlFor="telephone">Téléphone</label>
                  <Input id="telephone" type="tel" placeholder="+228..." />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700" htmlFor="service">Type d'accompagnement souhaité</label>
                <select id="service" className="w-full h-12 px-4 rounded-md border border-[var(--color-gris-clair)] bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-vert-principal)] text-gray-700">
                  <option value="">Sélectionnez un service...</option>
                  <option value="business-plan">Étude & Business Plan</option>
                  <option value="conseil">Conseil Stratégique / Appui technique</option>
                  <option value="autre">Autre demande</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700" htmlFor="projet">Description de votre projet ou de votre besoin</label>
                <Textarea 
                  id="projet" 
                  placeholder="Décrivez brièvement votre projet, vos objectifs et vos attentes..."
                  className="min-h-[150px]"
                />
              </div>

              <Button type="button" variant="primary" className="w-full text-lg h-14">
                Envoyer ma demande
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
