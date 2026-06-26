import { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/Button"
import { ValueCard } from "@/components/ui/ValueCard"
import { Users, Crown, Star, Lightbulb, Target } from "lucide-react"

export const metadata: Metadata = {
  title: "Qui sommes-nous",
  description: "Découvrez l'histoire, la mission et les valeurs fondatrices du réseau agrolide, le réseau continental de l'agriculture africaine.",
}

export default function QuiSommesNousPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Section 1 - Hero */}
      <section className="bg-[var(--color-vert-principal)] py-20 text-white text-center">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-heading font-bold mb-6">
            Qui sommes-nous
          </h1>
          <p className="text-xl max-w-2xl mx-auto text-white/90">
            Découvrez l'histoire, la mission et les valeurs qui animent le réseau agrolide.
          </p>
        </div>
      </section>

      {/* Section 2 - Histoire du réseau */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-3xl font-heading font-bold text-[var(--color-vert-principal)] mb-8">
            Notre Histoire
          </h2>
          <div className="prose prose-lg text-[var(--color-gris-texte)] max-w-none">
            <p>
              L'agriculture constitue le pilier fondamental du développement économique en Afrique. Elle représente en moyenne 30 à 40 % du produit intérieur brut des pays africains et emploie plus de 60 % de la population active, jouant un rôle déterminant dans la sécurité alimentaire, la création d'emplois et la réduction de la pauvreté. Pourtant, malgré l'immensité de ce potentiel, les acteurs du secteur — agronomes, étudiants, entrepreneurs et producteurs — évoluent souvent de manière fragmentée, en dehors de tout cadre de collaboration structuré et pérenne.
            </p>
            <p className="mt-4">
              Le réseau <strong>agrolide</strong> est né d'une ambition collective : transformer cette fragmentation en cohésion, et doter la chaîne agricole africaine d'un écosystème professionnel intégré capable de mobiliser les ressources, renforcer les compétences et incuber les projets entrepreneuriaux qui feront de l'agriculture africaine un véritable moteur de souveraineté alimentaire.
            </p>
            <p className="mt-4">
              Une analyse approfondie conduite à travers des débats participatifs, des sondages communautaires et des recherches documentaires a permis d'identifier quatre freins structurels majeurs qui bloquent l'émergence d'une agriculture africaine forte et compétitive : l'isolement professionnel, le manque de documentation adaptée aux réalités locales, le déficit d'accompagnement entrepreneurial et de visibilité, ainsi que la sous-valorisation des connaissances scientifiques.
            </p>
            <p className="mt-4 text-[var(--color-orange-accent)] font-medium">
              C'est précisément pour briser ces quatre freins structurels qu'agrolide a été fondé.
            </p>
          </div>
        </div>
      </section>

      {/* Section 3 - Mission + Vision + Slogan encadrés */}
      <section className="py-20 bg-gray-50 border-y border-gray-200">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center mb-12">
            <div className="inline-block px-6 py-3 bg-[var(--color-vert-principal)] text-white rounded-full font-heading font-bold text-lg md:text-xl shadow-md mb-8">
              « Fédérer la chaîne agricole, pour conquérir la souveraineté alimentaire »
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-10 rounded-2xl shadow-sm border border-[var(--color-gris-clair)]">
              <h3 className="text-2xl font-heading font-bold text-[var(--color-vert-principal)] mb-4 flex items-center gap-3">
                <Target size={28} className="text-[var(--color-orange-accent)]" />
                Notre Mission
              </h3>
              <p className="text-[var(--color-gris-texte)] text-lg leading-relaxed">
                Fédérer et valoriser les acteurs de la chaîne agricole africaine par la mutualisation des ressources, le renforcement des compétences, l'incubation entrepreneuriale et le développement de leur visibilité, pour contribuer activement à la conquête de la souveraineté alimentaire africaine.
              </p>
            </div>
            
            <div className="bg-white p-10 rounded-2xl shadow-sm border border-[var(--color-gris-clair)]">
              <h3 className="text-2xl font-heading font-bold text-[var(--color-vert-principal)] mb-4 flex items-center gap-3">
                <Lightbulb size={28} className="text-[var(--color-orange-accent)]" />
                Notre Vision
              </h3>
              <p className="text-[var(--color-gris-texte)] text-lg leading-relaxed">
                Être le réseau continental où chaque acteur de la chaîne agricole africaine trouve les ressources, les opportunités et les connexions nécessaires pour participer activement à la conquête de la souveraineté alimentaire.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 4 - 5 Cartes Valeurs */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-[var(--color-vert-principal)] mb-6">
              Nos valeurs fondatrices
            </h2>
            <p className="text-lg text-[var(--color-gris-texte)] max-w-2xl mx-auto">
              Ces principes guident chacune de nos actions et unissent tous les membres du réseau à travers le continent.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <ValueCard 
              icon={Users} 
              title="Solidarité" 
              description="Le réseau est notre première ressource. La réussite de chacun passe par la force du collectif et la mutualisation des compétences entre membres."
            />
            <ValueCard 
              icon={Crown} 
              title="Leadership" 
              description="agrolide forge des leaders agricoles. Chaque acteur accompagné est un futur moteur de la chaîne agricole et de la souveraineté alimentaire africaine."
            />
            <ValueCard 
              icon={Star} 
              title="Excellence" 
              description="Rigueur et professionnalisme dans chaque formation, chaque accompagnement et chaque service proposé aux membres."
            />
            <ValueCard 
              icon={Lightbulb} 
              title="Innovation africaine" 
              description="Des solutions pensées pour et par les réalités africaines — adaptées aux terroirs, aux marchés et aux contraintes du continent."
            />
            <ValueCard 
              icon={Target} 
              title="Impact" 
              description="Chaque action est évaluée à l'aune de sa contribution concrète à la souveraineté alimentaire africaine."
            />
          </div>
        </div>
      </section>

      {/* Section 5 - CTA */}
      <section className="py-24 bg-gray-50 border-t border-gray-200 text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-heading font-bold text-[var(--color-vert-principal)] mb-8">
            Prêt à faire partie de l'histoire ?
          </h2>
          <Link href="/rejoindre">
            <Button variant="primary" className="text-lg px-8 py-4 h-auto">
              Rejoindre le réseau
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
