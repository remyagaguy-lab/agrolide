import { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/Button"
import { Check, X, User, GraduationCap, Building2, Star } from "lucide-react"

export const metadata: Metadata = {
  title: "Rejoindre le réseau | agrolide",
  description: "Rejoignez le réseau continental de l'agriculture africaine et accédez à des ressources, des formations et des opportunités.",
}

export default function RejoindrePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <section className="bg-[var(--color-vert-principal)] py-20 text-white text-center">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-heading font-bold mb-6">
            Votre réseau continental vous attend.
          </h1>
          <p className="text-xl max-w-2xl mx-auto text-white/90">
            Choisissez la catégorie qui correspond à votre profil et rejoignez des milliers d'acteurs engagés.
          </p>
        </div>
      </section>

      {/* 4 Cartes Profils */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
            {/* Junior */}
            <div className="bg-white rounded-2xl shadow-sm border border-[var(--color-gris-clair)] overflow-hidden flex flex-col transition-transform hover:-translate-y-1">
              <div className="p-6 bg-blue-50 border-b border-blue-100 flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-blue-600 mb-4 shadow-sm">
                  <GraduationCap size={32} />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-1">Junior</h3>
                <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-sm font-semibold rounded-full mb-4">
                  5 000 FCFA / an
                </span>
                <p className="text-sm text-gray-600 h-10">
                  Étudiants en agronomie et jeunes diplômés en insertion.
                </p>
              </div>
              <div className="p-6 flex-grow flex flex-col justify-end">
                <Link href="/inscription?categorie=junior" className="w-full">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">S'inscrire</Button>
                </Link>
              </div>
            </div>

            {/* Professionnel */}
            <div className="bg-white rounded-2xl shadow-md border-2 border-[var(--color-vert-principal)] overflow-hidden flex flex-col relative transition-transform hover:-translate-y-1">
              <div className="absolute top-0 left-0 right-0 bg-[var(--color-vert-principal)] text-white text-xs font-bold text-center py-1 uppercase tracking-wider">
                Plus populaire
              </div>
              <div className="p-6 pt-10 bg-[#E8F3EB] border-b border-green-100 flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-[var(--color-vert-principal)] mb-4 shadow-sm">
                  <User size={32} />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-1">Professionnel</h3>
                <span className="inline-block px-3 py-1 bg-green-200 text-[var(--color-vert-principal)] text-sm font-semibold rounded-full mb-4">
                  15 000 FCFA / an
                </span>
                <p className="text-sm text-gray-600 h-10">
                  Agronomes, chercheurs, consultants et entrepreneurs actifs.
                </p>
              </div>
              <div className="p-6 flex-grow flex flex-col justify-end">
                <Link href="/inscription?categorie=professionnel" className="w-full">
                  <Button variant="primary" className="w-full">S'inscrire</Button>
                </Link>
              </div>
            </div>

            {/* Partenaire */}
            <div className="bg-white rounded-2xl shadow-sm border border-[var(--color-gris-clair)] overflow-hidden flex flex-col transition-transform hover:-translate-y-1">
              <div className="p-6 bg-orange-50 border-b border-orange-100 flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-[var(--color-orange-accent)] mb-4 shadow-sm">
                  <Building2 size={32} />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-1">Partenaire</h3>
                <span className="inline-block px-3 py-1 bg-orange-100 text-[var(--color-orange-accent)] text-sm font-semibold rounded-full mb-4">
                  50 000 FCFA / an
                </span>
                <p className="text-sm text-gray-600 h-10">
                  Entreprises, coopératives et institutions agricoles.
                </p>
              </div>
              <div className="p-6 flex-grow flex flex-col justify-end">
                {/* Formulaire Modal placeholder for MVP */}
                <Button variant="outline" className="w-full border-[var(--color-orange-accent)] text-[var(--color-orange-accent)] hover:bg-[var(--color-orange-accent)] hover:text-white">
                  Nous contacter
                </Button>
              </div>
            </div>

            {/* Sénior */}
            <div className="bg-white rounded-2xl shadow-sm border border-[var(--color-gris-clair)] overflow-hidden flex flex-col transition-transform hover:-translate-y-1">
              <div className="p-6 bg-purple-50 border-b border-purple-100 flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-purple-600 mb-4 shadow-sm">
                  <Star size={32} />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-1">Sénior</h3>
                <span className="inline-block px-3 py-1 bg-purple-100 text-purple-800 text-sm font-semibold rounded-full mb-4">
                  Gratuit
                </span>
                <p className="text-sm text-gray-600 h-10">
                  Experts mentors et chercheurs émérites bénévoles.
                </p>
              </div>
              <div className="p-6 flex-grow flex flex-col justify-end">
                {/* Formulaire Modal placeholder for MVP */}
                <Button variant="outline" className="w-full border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white">
                  Candidater
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tableau comparatif */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-heading font-bold text-[var(--color-vert-principal)] mb-4">
              Comparez les avantages
            </h2>
            <p className="text-[var(--color-gris-texte)]">Découvrez ce que chaque catégorie vous offre.</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr>
                  <th className="py-4 px-6 bg-gray-50 border-b border-[var(--color-gris-clair)] font-bold text-gray-900 w-1/3">Avantages</th>
                  <th className="py-4 px-4 bg-blue-50 border-b border-blue-100 font-bold text-center text-blue-900">Junior</th>
                  <th className="py-4 px-4 bg-[#E8F3EB] border-b border-green-200 font-bold text-center text-[var(--color-vert-principal)]">Pro</th>
                  <th className="py-4 px-4 bg-orange-50 border-b border-orange-100 font-bold text-center text-orange-900">Partenaire</th>
                  <th className="py-4 px-4 bg-purple-50 border-b border-purple-100 font-bold text-center text-purple-900">Sénior</th>
                </tr>
              </thead>
              <tbody className="text-[var(--color-gris-texte)]">
                <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-6 font-medium text-gray-900">Accès à l'Annuaire</td>
                  <td className="py-4 px-4 text-center"><Check className="inline text-green-500" size={20} /></td>
                  <td className="py-4 px-4 text-center"><Check className="inline text-green-500" size={20} /></td>
                  <td className="py-4 px-4 text-center"><Check className="inline text-green-500" size={20} /></td>
                  <td className="py-4 px-4 text-center"><Check className="inline text-green-500" size={20} /></td>
                </tr>
                <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-6 font-medium text-gray-900">Bibliothèque Numérique</td>
                  <td className="py-4 px-4 text-center"><Check className="inline text-green-500" size={20} /></td>
                  <td className="py-4 px-4 text-center"><Check className="inline text-green-500" size={20} /></td>
                  <td className="py-4 px-4 text-center"><Check className="inline text-green-500" size={20} /></td>
                  <td className="py-4 px-4 text-center"><Check className="inline text-green-500" size={20} /></td>
                </tr>
                <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-6 font-medium text-gray-900">Accès aux Formations</td>
                  <td className="py-4 px-4 text-center text-sm">Tarif réduit</td>
                  <td className="py-4 px-4 text-center text-sm">Tarif préférentiel</td>
                  <td className="py-4 px-4 text-center text-sm">Accès illimité</td>
                  <td className="py-4 px-4 text-center text-sm">Intervenant</td>
                </tr>
                <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-6 font-medium text-gray-900">Accès au Forum</td>
                  <td className="py-4 px-4 text-center"><Check className="inline text-green-500" size={20} /></td>
                  <td className="py-4 px-4 text-center"><Check className="inline text-green-500" size={20} /></td>
                  <td className="py-4 px-4 text-center"><Check className="inline text-green-500" size={20} /></td>
                  <td className="py-4 px-4 text-center"><Check className="inline text-green-500" size={20} /></td>
                </tr>
                <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-6 font-medium text-gray-900">Messagerie Privée</td>
                  <td className="py-4 px-4 text-center"><X className="inline text-gray-300" size={20} /></td>
                  <td className="py-4 px-4 text-center"><Check className="inline text-green-500" size={20} /></td>
                  <td className="py-4 px-4 text-center"><Check className="inline text-green-500" size={20} /></td>
                  <td className="py-4 px-4 text-center"><Check className="inline text-green-500" size={20} /></td>
                </tr>
                <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-6 font-medium text-gray-900">Accès aux Opportunités</td>
                  <td className="py-4 px-4 text-center text-sm">Stages / Emplois</td>
                  <td className="py-4 px-4 text-center text-sm">Marchés / Financements</td>
                  <td className="py-4 px-4 text-center text-sm">Visibilité / B2B</td>
                  <td className="py-4 px-4 text-center text-sm">Mentorat</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-heading font-bold text-[var(--color-vert-principal)] mb-4">
              Questions fréquentes
            </h2>
          </div>

          <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-[var(--color-gris-clair)]">
              <h3 className="text-lg font-bold text-gray-900 mb-2">Comment se déroule le processus d'adhésion ?</h3>
              <p className="text-[var(--color-gris-texte)]">Une fois que vous avez sélectionné votre catégorie, vous remplirez un formulaire avec vos informations professionnelles. Après validation de votre profil par l'équipe (24-48h), vous recevrez un lien pour régler votre cotisation annuelle et accéder à la plateforme.</p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm border border-[var(--color-gris-clair)]">
              <h3 className="text-lg font-bold text-gray-900 mb-2">Puis-je changer de catégorie en cours d'année ?</h3>
              <p className="text-[var(--color-gris-texte)]">Oui, il est possible de passer de la catégorie Junior à Professionnel une fois que vous avez obtenu votre diplôme et commencé votre carrière. Le prorata de la cotisation sera appliqué.</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-[var(--color-gris-clair)]">
              <h3 className="text-lg font-bold text-gray-900 mb-2">Quelles méthodes de paiement acceptez-vous ?</h3>
              <p className="text-[var(--color-gris-texte)]">Nous acceptons les paiements par carte bancaire (Visa, Mastercard) ainsi que le Mobile Money dans plusieurs pays d'Afrique de l'Ouest et Centrale.</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-[var(--color-gris-clair)]">
              <h3 className="text-lg font-bold text-gray-900 mb-2">La catégorie Sénior est-elle ouverte à tous ?</h3>
              <p className="text-[var(--color-gris-texte)]">La catégorie Sénior est réservée aux experts justifiant d'une expérience significative dans le domaine agricole. L'adhésion se fait uniquement sur dossier de candidature ou par cooptation.</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-[var(--color-gris-clair)]">
              <h3 className="text-lg font-bold text-gray-900 mb-2">Les formations sont-elles incluses dans l'adhésion ?</h3>
              <p className="text-[var(--color-gris-texte)]">L'adhésion vous donne accès gratuitement à certains webinaires et masterclasses. Pour les formations certifiantes longues, vous bénéficiez d'un tarif préférentiel exclusif aux membres.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
