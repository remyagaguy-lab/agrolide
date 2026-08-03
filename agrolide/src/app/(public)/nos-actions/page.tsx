import Link from "next/link"
import { Metadata } from "next"
import { SectionLabel } from "@/components/ui/SectionLabel"
import { Card } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Users, BookOpen, TrendingUp, Calendar, BookMarked, Briefcase, ArrowRight } from "lucide-react"

export const metadata: Metadata = {
  title: "Nos actions",
  description: "Découvrez les 3 piliers d'action du réseau Agrolide : Mobilisation, Formation et Agrobusiness."
,
  alternates: { canonical: '/nos-actions' }
}

export default function NosActionsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      
      {/* ── HERO ─────────────────────────────────── */}
      <section className="bg-gris-fond border-b border-gris-border !pt-[60px] !pb-[60px] md:!pt-[96px] md:!pb-[80px]">
        <div className="container">
          <div className="max-w-[800px] mx-auto text-center">
            <SectionLabel className="mx-auto flex justify-center text-center">Notre approche</SectionLabel>
            <h1 className="font-heading font-[800] text-[40px] md:text-[56px] text-gris-titre leading-[1.1] tracking-[-0.02em] mb-6">
              Un écosystème intégré en <span className="text-vert-profond">3 piliers d'action</span>
            </h1>
            <p className="font-sans text-[17px] text-gris-texte leading-[1.7] max-w-[650px] mx-auto">
              Le réseau Agrolide déploie une stratégie d'accompagnement complète pour :
            </p>
            <ul className="font-sans text-[17px] text-gris-texte leading-[1.7] max-w-[650px] mx-auto text-left list-disc list-inside space-y-2 mt-4 px-4 sm:px-12 md:px-24">
              <li>Briser l'isolement des professionnels de l'agriculture</li>
              <li>Renforcer les compétences techniques et managériales</li>
              <li>Catalyser la réussite des projets agricoles africains</li>
            </ul>
          </div>
        </div>
      </section>

      {/* ── PILIER 1 : MOBILISATION ─────────────────────────────────── */}
      <section className="bg-blanc">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-[64px] items-center">
            <div className="order-2 md:order-1">
              <div className="w-[64px] h-[64px] rounded-[16px] bg-[#f0f7f0] flex items-center justify-center mb-6">
                <Users size={32} strokeWidth={1.5} color="#1b5e38" />
              </div>
              <h2 className="text-h2 text-gris-titre mb-4">
                1. Mobilisation & Réseautage
              </h2>
              <div className="text-body-lg mb-6 space-y-3">
                <p>L'isolement professionnel est le premier frein au développement. Nous avons conçu un environnement collaboratif pour :</p>
                <ul className="list-disc list-outside pl-5 space-y-2 text-[15px] text-gris-texte">
                  <li>Fédérer les agronomes, chercheurs et investisseurs</li>
                  <li>Faciliter les synergies et le partage d'opportunités</li>
                </ul>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                <Card className="!p-5 bg-gris-fond border-none shadow-none hover:shadow-none hover:border-transparent">
                  <div className="flex items-center gap-3 mb-3">
                    <Users size={20} className="text-vert-principal" />
                    <h3 className="font-heading font-[700] text-[16px]">Annuaire</h3>
                  </div>
                  <p className="text-[14px] text-gris-texte">Cartographie des acteurs par pays et spécialité pour faciliter la mise en relation.</p>
                </Card>
                <Card className="!p-5 bg-gris-fond border-none shadow-none hover:shadow-none hover:border-transparent">
                  <div className="flex items-center gap-3 mb-3">
                    <Calendar size={20} className="text-vert-principal" />
                    <h3 className="font-heading font-[700] text-[16px]">Événements</h3>
                  </div>
                  <p className="text-[14px] text-gris-texte">Meetups, webinaires et opportunités pour animer notre communauté dynamique.</p>
                </Card>
              </div>

              <Link href="/annuaire" className="btn-secondary">
                Découvrir l'Annuaire
              </Link>
            </div>
            <div className="order-1 md:order-2 bg-gris-fond rounded-[24px] aspect-square md:aspect-[4/3] flex items-center justify-center relative overflow-hidden border border-gris-border">
                <div className="absolute inset-0 bg-gradient-to-tr from-[#f0f7f0] to-[#ffffff]"></div>
                <Users size={120} strokeWidth={0.5} className="text-vert-principal/20 relative z-10" />
            </div>
          </div>
        </div>
      </section>

      {/* ── PILIER 2 : FORMATION ─────────────────────────────────── */}
      <section className="bg-gris-fond border-y border-gris-border">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-[64px] items-center">
            <div className="bg-blanc rounded-[24px] aspect-square md:aspect-[4/3] flex items-center justify-center relative overflow-hidden border border-gris-border shadow-sm">
                <div className="absolute inset-0 bg-gradient-to-tr from-[#ffffff] to-[#f8f8f6]"></div>
                <BookOpen size={120} strokeWidth={0.5} className="text-vert-principal/20 relative z-10" />
            </div>
            <div>
              <div className="w-[64px] h-[64px] rounded-[16px] bg-[#f0f7f0] flex items-center justify-center mb-6">
                <BookOpen size={32} strokeWidth={1.5} color="#1b5e38" />
              </div>
              <h2 className="text-h2 text-gris-titre mb-4">
                2. Formation & Insertion
              </h2>
              <div className="text-body-lg mb-6 space-y-3">
                <p>Pour faire face au manque de documentation adaptée et aux défis de l'insertion, nous avons mis en place :</p>
                <ul className="list-disc list-outside pl-5 space-y-2 text-[15px] text-gris-texte">
                  <li>Une centralisation de la connaissance agronomique africaine</li>
                  <li>Des parcours de montée en compétences et de certification</li>
                </ul>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                <Card className="!p-5 bg-blanc border-gris-border shadow-sm">
                  <div className="flex items-center gap-3 mb-3">
                    <BookMarked size={20} className="text-vert-principal" />
                    <h3 className="font-heading font-[700] text-[16px]">Bibliothèque</h3>
                  </div>
                  <p className="text-[14px] text-gris-texte">Le répertoire de thèses, mémoires et fiches techniques adaptées à l'Afrique.</p>
                </Card>
                <Card className="!p-5 bg-blanc border-gris-border shadow-sm">
                  <div className="flex items-center gap-3 mb-3">
                    <BookOpen size={20} className="text-vert-principal" />
                    <h3 className="font-heading font-[700] text-[16px]">Formations</h3>
                  </div>
                  <p className="text-[14px] text-gris-texte">Catalogue de montées en compétences techniques et webinaires exclusifs.</p>
                </Card>
              </div>

              <div className="flex flex-wrap gap-4">
                <Link href="/bibliotheque" className="btn-secondary">
                  Bibliothèque
                </Link>
                <Link href="/formations" className="btn-outline">
                  Voir nos formations
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── PILIER 3 : AGROBUSINESS ─────────────────────────────────── */}
      <section className="bg-blanc">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-[64px] items-center">
            <div className="order-2 md:order-1">
              <div className="w-[64px] h-[64px] rounded-[16px] bg-[#fdf5e6] flex items-center justify-center mb-6">
                <TrendingUp size={32} strokeWidth={1.5} color="#f99e1d" />
              </div>
              <h2 className="text-h2 text-gris-titre mb-4">
                3. Agrobusiness & Consulting
              </h2>
              <div className="text-body-lg mb-6 space-y-3">
                <p>Grâce à une expertise sectorielle pointue, nous soutenons le développement de projets pérennes :</p>
                <ul className="list-disc list-outside pl-5 space-y-2 text-[15px] text-gris-texte">
                  <li>Transformation des idées novatrices en entreprises viables</li>
                  <li>Accompagnement opérationnel pour la croissance des structures existantes</li>
                </ul>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                <Card className="!p-5 bg-gris-fond border-none shadow-none hover:shadow-none hover:border-transparent">
                  <div className="flex items-center gap-3 mb-3">
                    <Briefcase size={20} className="text-orange-accent" />
                    <h3 className="font-heading font-[700] text-[16px]">Consulting</h3>
                  </div>
                  <p className="text-[14px] text-gris-texte">Études de faisabilité, business plans et accompagnement technique sur mesure.</p>
                </Card>
                <Card className="!p-5 bg-gris-fond border-none shadow-none hover:shadow-none hover:border-transparent">
                  <div className="flex items-center gap-3 mb-3">
                    <TrendingUp size={20} className="text-orange-accent" />
                    <h3 className="font-heading font-[700] text-[16px]">Incubation</h3>
                  </div>
                  <p className="text-[14px] text-gris-texte">Un programme complet pour propulser les agripreneurs vers le succès commercial.</p>
                </Card>
              </div>

              <Link href="/agrobusiness" className="btn-primary">
                Découvrir nos services
              </Link>
            </div>
            <div className="order-1 md:order-2 bg-[#fcf8f2] rounded-[24px] aspect-square md:aspect-[4/3] flex items-center justify-center relative overflow-hidden border border-[#f5ead6]">
                <div className="absolute inset-0 bg-gradient-to-tr from-[#fcf8f2] to-[#ffffff]"></div>
                <TrendingUp size={120} strokeWidth={0.5} className="text-orange-accent/20 relative z-10" />
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA FINAL ────────────────────────────── */}
      <section className="bg-vert-clair py-[96px] text-center">
        <div className="container flex flex-col items-center">
          <h2 className="font-heading font-[900] text-[clamp(24px,4vw,36px)] text-vert-profond leading-[1.2] max-w-[700px] mx-auto mb-4">
            Prêt à bénéficier de tout notre écosystème&nbsp;?
          </h2>
          <p className="font-sans font-[400] text-[14px] text-gris-texte mb-[28px]">
            Rejoignez des centaines de professionnels engagés pour la souveraineté alimentaire africaine.
          </p>
          <Link href="/rejoindre" className="btn-primary inline-flex items-center">
            Rejoindre le réseau <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </div>
      </section>

    </div>
  )
}
