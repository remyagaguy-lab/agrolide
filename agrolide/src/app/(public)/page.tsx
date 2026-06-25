import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/Button"
import { StatCard } from "@/components/ui/StatCard"
import { LatestArticles } from "@/components/modules/LatestArticles"
import { Users, BookOpen, UserPlus, Network, GraduationCap, Briefcase } from "lucide-react"
import { createClient } from "@/lib/supabase/server"

export const revalidate = 3600 // ISR 1h

async function getStats() {
  const supabase = await createClient()
  
  const stats = {
    membres: 0,
    pays: 0,
    documents: 0,
    formations: 0
  }

  try {
    const { count: membresCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true })
    if (membresCount) stats.membres = membresCount

    // Note: Assuming these tables exist or will exist for the real MVP
    const { count: paysCount } = await supabase.from('countries').select('*', { count: 'exact', head: true })
    if (paysCount) stats.pays = paysCount

    const { count: docsCount } = await supabase.from('documents').select('*', { count: 'exact', head: true })
    if (docsCount) stats.documents = docsCount

    const { count: formsCount } = await supabase.from('formations').select('*', { count: 'exact', head: true })
    if (formsCount) stats.formations = formsCount
  } catch (error) {
    // Fail silently, defaults remain 0
  }

  return stats
}

export default async function HomePage() {
  const stats = await getStats()

  return (
    <div className="flex flex-col min-h-screen">
      {/* Section 1 - Hero */}
      <section className="relative w-full h-[900px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0 bg-gradient-to-br from-[#0f3b21] via-[#1b5e38] to-[#0a2e16]">
          {/* Subtle overlay pattern */}
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }} />
        </div>
        
        <div className="container relative z-20 mx-auto px-4 text-center max-w-4xl text-white">
          <h1 className="text-5xl md:text-7xl font-heading font-bold mb-6 leading-tight text-white">
            Fédérer la chaîne agricole, pour conquérir la souveraineté alimentaire
          </h1>
          <p className="text-xl md:text-2xl mb-10 text-gray-200">
            Le réseau continental des acteurs de l'agriculture africaine — agronomes, chercheurs, agripreneurs, partenaires.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/rejoindre">
              <Button variant="accent" className="w-full sm:w-auto text-lg px-8 py-4 h-auto">
                Rejoindre le réseau
              </Button>
            </Link>
            <Link href="#actions">
              <Button variant="outline" className="w-full sm:w-auto text-lg px-8 py-4 h-auto border-white text-white hover:bg-white hover:text-[var(--color-vert-principal)]">
                Découvrir nos actions
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Section 2 - Les 4 freins */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-[var(--color-vert-principal)] mb-6">
              L'agriculture africaine face à 4 freins structurels
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
            <div className="bg-white p-8 rounded-xl shadow-sm border border-[var(--color-gris-clair)]">
              <div className="text-[var(--color-orange-accent)] mb-4">
                <Network size={40} />
              </div>
              <h3 className="text-xl font-bold mb-3">Isolement professionnel</h3>
              <p className="text-[var(--color-gris-texte)]">Peu de réseaux solides existent pour les agronomes africains.</p>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-sm border border-[var(--color-gris-clair)]">
              <div className="text-[var(--color-orange-accent)] mb-4">
                <BookOpen size={40} />
              </div>
              <h3 className="text-xl font-bold mb-3">Documentation inadaptée</h3>
              <p className="text-[var(--color-gris-texte)]">La quasi-totalité des ressources techniques ignorent les réalités africaines.</p>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-sm border border-[var(--color-gris-clair)]">
              <div className="text-[var(--color-orange-accent)] mb-4">
                <UserPlus size={40} />
              </div>
              <h3 className="text-xl font-bold mb-3">Déficit d'accompagnement</h3>
              <p className="text-[var(--color-gris-texte)]">Trop d'agripreneurs avancent sans mentor, sans accès au financement.</p>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-sm border border-[var(--color-gris-clair)]">
              <div className="text-[var(--color-orange-accent)] mb-4">
                <GraduationCap size={40} />
              </div>
              <h3 className="text-xl font-bold mb-3">Recherche sous-valorisée</h3>
              <p className="text-[var(--color-gris-texte)]">Des milliers de thèses africaines restent inaccessibles aux praticiens.</p>
            </div>
          </div>
          
          <div className="mt-16 text-center">
            <p className="text-xl font-medium text-[var(--color-vert-principal)]">
              <strong className="font-bold">agrolide</strong> a été fondé pour briser ces quatre freins à la fois.
            </p>
          </div>
        </div>
      </section>

      {/* Section 3 - Les 3 DAS */}
      <section id="actions" className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-[var(--color-vert-principal)] mb-6">
              Notre réponse : un écosystème intégré en 3 domaines
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Link href="/annuaire" className="group">
              <div className="h-full bg-gray-50 p-8 rounded-xl border border-[var(--color-gris-clair)] transition-all hover:shadow-md hover:border-[var(--color-vert-principal)]">
                <div className="w-14 h-14 bg-white rounded-lg flex items-center justify-center text-[var(--color-vert-principal)] mb-6 shadow-sm group-hover:bg-[var(--color-vert-principal)] group-hover:text-white transition-colors">
                  <Network size={28} />
                </div>
                <h3 className="text-xl font-heading font-bold mb-3 group-hover:text-[var(--color-vert-principal)] transition-colors">
                  Mobilisation & Réseautage
                </h3>
                <p className="text-[var(--color-gris-texte)]">
                  Un espace pour fédérer les compétences. Connectez-vous avec vos pairs et développez votre réseau.
                </p>
              </div>
            </Link>
            
            <Link href="/formations" className="group">
              <div className="h-full bg-gray-50 p-8 rounded-xl border border-[var(--color-gris-clair)] transition-all hover:shadow-md hover:border-[var(--color-vert-principal)]">
                <div className="w-14 h-14 bg-white rounded-lg flex items-center justify-center text-[var(--color-vert-principal)] mb-6 shadow-sm group-hover:bg-[var(--color-vert-principal)] group-hover:text-white transition-colors">
                  <GraduationCap size={28} />
                </div>
                <h3 className="text-xl font-heading font-bold mb-3 group-hover:text-[var(--color-vert-principal)] transition-colors">
                  Formation & Insertion
                </h3>
                <p className="text-[var(--color-gris-texte)]">
                  Renforcez vos capacités techniques et managériales. Des formations pratiques ancrées dans les réalités du terrain.
                </p>
              </div>
            </Link>
            
            <Link href="/agrobusiness" className="group">
              <div className="h-full bg-gray-50 p-8 rounded-xl border border-[var(--color-gris-clair)] transition-all hover:shadow-md hover:border-[var(--color-vert-principal)]">
                <div className="w-14 h-14 bg-white rounded-lg flex items-center justify-center text-[var(--color-vert-principal)] mb-6 shadow-sm group-hover:bg-[var(--color-vert-principal)] group-hover:text-white transition-colors">
                  <Briefcase size={28} />
                </div>
                <h3 className="text-xl font-heading font-bold mb-3 group-hover:text-[var(--color-vert-principal)] transition-colors">
                  Agrobusiness & Consulting
                </h3>
                <p className="text-[var(--color-gris-texte)]">
                  Accompagnement de projets et accès aux marchés. Transformez vos idées en entreprises viables et durables.
                </p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Section 4 - Chiffres clés */}
      <section className="py-20 bg-[var(--color-vert-principal)] text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
            <StatCard title="Membres actifs" value={stats.membres || "0+"} className="bg-transparent border-white/20 text-white [&>span:first-child]:text-white [&>span:last-child]:text-white/80" />
            <StatCard title="Pays représentés" value={stats.pays || "0+"} className="bg-transparent border-white/20 text-white [&>span:first-child]:text-white [&>span:last-child]:text-white/80" />
            <StatCard title="Documents bibliothèque" value={stats.documents || "0+"} className="bg-transparent border-white/20 text-white [&>span:first-child]:text-white [&>span:last-child]:text-white/80" />
            <StatCard title="Formations disponibles" value={stats.formations || "0+"} className="bg-transparent border-white/20 text-white [&>span:first-child]:text-white [&>span:last-child]:text-white/80" />
          </div>
        </div>
      </section>

      {/* Section 5 - Témoignages */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-[var(--color-vert-principal)] mb-6">
              Ils témoignent de l'impact du réseau
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white p-8 rounded-xl shadow-sm border border-[var(--color-gris-clair)]">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-full bg-gray-200 relative overflow-hidden">
                    <Image src={`https://placehold.co/150x150/e2e8f0/64748b?text=U${i}`} alt="Avatar" fill className="object-cover" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">Prénom Nom</h4>
                    <p className="text-sm text-gray-500">Catégorie • Pays</p>
                  </div>
                </div>
                <blockquote className="text-[var(--color-gris-texte)] italic">
                  "Agrolide m'a permis de structurer mon approche et de trouver des partenaires solides. L'accès aux ressources adaptées à notre continent change véritablement la donne pour les agripreneurs."
                </blockquote>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 6 - Derniers articles */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-[var(--color-vert-principal)] mb-4">
                Derniers articles
              </h2>
              <p className="text-[var(--color-gris-texte)] max-w-2xl">
                Restez informés des dernières innovations, analyses et actualités du secteur agricole africain.
              </p>
            </div>
            <Link href="/blog" className="mt-6 md:mt-0">
              <Button variant="outline">Tous les articles</Button>
            </Link>
          </div>
          
          <LatestArticles />
        </div>
      </section>

      {/* Section 7 - CTA final */}
      <section className="py-24 bg-[var(--color-vert-principal)] text-center text-white">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-4xl md:text-5xl font-heading font-bold mb-8 text-white">
            Rejoignez le réseau continental de l'agriculture africaine.
          </h2>
          <Link href="/rejoindre">
            <Button variant="accent" className="text-lg px-10 py-5 h-auto">
              Devenir membre
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
