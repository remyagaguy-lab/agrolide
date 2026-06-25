import { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Textarea } from "@/components/ui/Textarea"
import { Rocket, Target, Users, BookOpen } from "lucide-react"

export const metadata: Metadata = {
  title: "Incubation agrolide | Accélérateur de projets agricoles",
  description: "Rejoignez le programme d'incubation d'agrolide pour transformer votre idée en entreprise agricole florissante.",
}

export default function IncubationPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero */}
      <section className="bg-[var(--color-vert-principal)] py-20 text-white text-center">
        <div className="container mx-auto px-4">
          <div className="inline-block bg-[var(--color-orange-accent)] text-white px-4 py-1 rounded-full text-sm font-bold tracking-wider mb-6">
            PROGRAMME PHARE
          </div>
          <h1 className="text-4xl md:text-5xl font-heading font-bold mb-6">
            Programme d'Incubation
          </h1>
          <p className="text-xl max-w-2xl mx-auto text-white/90">
            Un accompagnement intensif de 6 mois pour lancer et pérenniser votre startup agricole avec le soutien de mentors experts.
          </p>
        </div>
      </section>

      {/* Le programme */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-heading font-bold text-[var(--color-vert-principal)] mb-6">
                Pourquoi rejoindre l'incubateur agrolide ?
              </h2>
              <p className="text-[var(--color-gris-texte)] text-lg mb-6 leading-relaxed">
                Le secteur agricole africain regorge d'opportunités, mais le passage de l'idée au marché nécessite structure, réseau et financement. Notre programme est conçu pour pallier le déficit d'accompagnement entrepreneurial sur le continent.
              </p>
              
              <div className="space-y-6 mt-8">
                <div className="flex gap-4">
                  <div className="mt-1 w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex flex-shrink-0 items-center justify-center">
                    <BookOpen size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">Formations pratiques</h4>
                    <p className="text-[var(--color-gris-texte)] text-sm mt-1">Acquérez les compétences essentielles en gestion financière, marketing agricole et structuration juridique.</p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="mt-1 w-10 h-10 rounded-full bg-purple-50 text-purple-600 flex flex-shrink-0 items-center justify-center">
                    <Users size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">Mentorat personnalisé</h4>
                    <p className="text-[var(--color-gris-texte)] text-sm mt-1">Soyez suivi par un expert de votre filière qui vous guidera dans vos choix stratégiques.</p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="mt-1 w-10 h-10 rounded-full bg-orange-50 text-[var(--color-orange-accent)] flex flex-shrink-0 items-center justify-center">
                    <Target size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">Préparation aux investisseurs</h4>
                    <p className="text-[var(--color-gris-texte)] text-sm mt-1">Apprenez à pitcher votre projet et accédez à notre réseau de business angels et fonds d'investissement partenaires.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 p-8 rounded-2xl border border-[var(--color-gris-clair)] relative">
              <div className="absolute -top-6 -right-6 text-[var(--color-orange-accent)] opacity-20">
                <Rocket size={120} />
              </div>
              <h3 className="text-xl font-heading font-bold text-gray-900 mb-6 relative z-10">Critères d'éligibilité</h3>
              <ul className="space-y-4 relative z-10 text-[var(--color-gris-texte)]">
                <li className="flex items-start gap-3">
                  <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[var(--color-vert-principal)] flex-shrink-0"></div>
                  <span>Projet basé en Afrique, ciblant une problématique de la chaîne de valeur agricole.</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[var(--color-vert-principal)] flex-shrink-0"></div>
                  <span>Projet au stade de l'idéation validée, du prototype ou en amorçage (early stage).</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[var(--color-vert-principal)] flex-shrink-0"></div>
                  <span>L'équipe doit comprendre au moins un membre dédié à temps plein au projet.</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[var(--color-vert-principal)] flex-shrink-0"></div>
                  <span>Avoir une proposition de valeur innovante et un modèle économique potentiellement viable.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Formulaire de candidature */}
      <section className="py-24 bg-gray-50 border-t border-gray-200" id="postuler">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-heading font-bold text-[var(--color-vert-principal)] mb-4">
              Dépôt de candidature
            </h2>
            <p className="text-[var(--color-gris-texte)]">
              La prochaine cohorte débute bientôt. Soumettez votre projet pour évaluation par notre comité de sélection.
            </p>
          </div>

          <div className="bg-white p-8 md:p-10 rounded-2xl border border-[var(--color-gris-clair)] shadow-sm">
            <div className="space-y-6">
              <div className="space-y-4">
                <h3 className="font-bold text-lg text-gray-900 border-b pb-2">1. Porteur du projet</h3>
                
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
                  <label className="text-sm font-semibold text-gray-700" htmlFor="pays">Pays de résidence</label>
                  <Input id="pays" placeholder="Ex: Togo, Sénégal, Côte d'Ivoire..." />
                </div>
              </div>

              <div className="space-y-4 pt-4">
                <h3 className="font-bold text-lg text-gray-900 border-b pb-2">2. Le Projet</h3>
                
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700" htmlFor="nomProjet">Nom du projet / de la startup</label>
                  <Input id="nomProjet" placeholder="Nom de votre entreprise" />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700" htmlFor="stade">Stade d'avancement</label>
                  <select id="stade" className="w-full h-12 px-4 rounded-md border border-[var(--color-gris-clair)] bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-vert-principal)] text-gray-700">
                    <option value="">Sélectionnez un stade...</option>
                    <option value="idee">Idée (Concept validé)</option>
                    <option value="prototype">Prototype / POC</option>
                    <option value="lancement">Phase de lancement (Premières ventes)</option>
                    <option value="croissance">En croissance (Recherche de fonds)</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700" htmlFor="pitch">Pitch du projet (Problème résolu, solution, marché)</label>
                  <Textarea 
                    id="pitch" 
                    placeholder="Expliquez brièvement votre projet. Quel problème de l'agriculture africaine résolvez-vous et comment ?"
                    className="min-h-[150px]"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700" htmlFor="equipe">Présentation de l'équipe</label>
                  <Textarea 
                    id="equipe" 
                    placeholder="Qui sont les fondateurs et quelles sont leurs compétences clés ?"
                    className="min-h-[100px]"
                  />
                </div>
              </div>

              <div className="pt-6">
                <Button type="button" variant="primary" className="w-full text-lg h-14">
                  Soumettre ma candidature
                </Button>
                <p className="text-center text-xs text-gray-500 mt-4">
                  Vos données sont traitées de manière confidentielle et ne seront pas partagées avec des tiers sans votre accord.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
