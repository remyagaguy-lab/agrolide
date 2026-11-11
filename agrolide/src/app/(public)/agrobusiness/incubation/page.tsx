import { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Textarea } from "@/components/ui/Textarea"
import { Rocket, Target, Users, BookOpen } from "lucide-react"
import IncubationForm from "@/components/modules/agrobusiness/IncubationForm"

export const metadata: Metadata = {
  title: "Programme d'Incubation",
  description: "Rejoignez le programme d'incubation d'agrolide pour transformer votre idée en entreprise agricole florissante.",
  alternates: { canonical: '/agrobusiness/incubation' }
}

export default function IncubationPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero */}
      <section className="bg-surface-brand py-20 text-on-surface-brand text-center">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-heading font-bold mb-6">
            Programme d'Incubation
          </h1>
          <p className="text-xl max-w-2xl mx-auto text-on-surface-brand/90">
            Un programme d'accompagnement intensif pour lancer et pérenniser votre projet agricole, avec le soutien de mentors experts.
          </p>
        </div>
      </section>

      {/* Le programme */}
      <section className="py-24 bg-surface-container-lowest">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-heading font-bold text-primary mb-6">
                Pourquoi rejoindre l'incubateur agrolide ?
              </h2>
              <p className="text-on-surface-variant text-lg mb-6 leading-relaxed">
                Le secteur agricole africain regorge d'opportunités, mais le passage de l'idée au marché nécessite structure, réseau et financement. Notre programme est conçu pour pallier le déficit d'accompagnement entrepreneurial sur le continent.
              </p>
              
              <div className="space-y-6 mt-8">
                <div className="flex gap-4">
                  <div className="mt-1 w-10 h-10 rounded-full bg-info-container text-info flex flex-shrink-0 items-center justify-center">
                    <BookOpen size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-on-surface">Formations pratiques</h4>
                    <p className="text-on-surface-variant text-sm mt-1">Acquérez les compétences essentielles en gestion financière, marketing agricole et structuration juridique.</p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="mt-1 w-10 h-10 rounded-full bg-info-container text-info flex flex-shrink-0 items-center justify-center">
                    <Users size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-on-surface">Mentorat personnalisé</h4>
                    <p className="text-on-surface-variant text-sm mt-1">Soyez suivi par un expert de votre filière qui vous guidera dans vos choix stratégiques.</p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="mt-1 w-10 h-10 rounded-full bg-tertiary-container text-on-tertiary-container flex flex-shrink-0 items-center justify-center">
                    <Target size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-on-surface">Préparation aux investisseurs</h4>
                    <p className="text-on-surface-variant text-sm mt-1">Apprenez à présenter votre projet et à préparer votre dossier de financement, avec un coaching dédié au pitch et aux appels à projets.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-surface-container-low p-8 rounded-2xl border border-outline-variant relative">
              <div className="absolute -top-6 -right-6 text-on-tertiary-container opacity-20">
                <Rocket size={120} />
              </div>
              <h3 className="text-xl font-heading font-bold text-on-surface mb-6 relative z-10">Critères d'éligibilité</h3>
              <ul className="space-y-4 relative z-10 text-on-surface-variant">
                <li className="flex items-start gap-3">
                  <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-accent-leaf flex-shrink-0"></div>
                  <span>Projet basé en Afrique, ciblant une problématique de la chaîne de valeur agricole.</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-accent-leaf flex-shrink-0"></div>
                  <span>Projet au stade de l'idéation validée, du prototype ou en amorçage (early stage).</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-accent-leaf flex-shrink-0"></div>
                  <span>L'équipe doit comprendre au moins un membre dédié à temps plein au projet.</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-accent-leaf flex-shrink-0"></div>
                  <span>Avoir une proposition de valeur innovante et un modèle économique potentiellement viable.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Formulaire de candidature */}
      <section className="py-24 bg-surface-container-low border-t border-outline-variant" id="postuler">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-heading font-bold text-primary mb-4">
              Dépôt de candidature
            </h2>
            <p className="text-on-surface-variant">
              La première cohorte n'a pas encore démarré. Déposez votre candidature : elle sera étudiée par notre comité de sélection et nous vous informerons de l'ouverture de la sélection.
            </p>
          </div>

          <IncubationForm />
        </div>
      </section>
    </div>
  )
}
