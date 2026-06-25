import { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/Button"
import { PartyPopper } from "lucide-react"

export const metadata: Metadata = {
  title: "Bienvenue | agrolide",
  description: "Votre inscription est validée. Bienvenue dans le réseau agrolide.",
}

export default function SuccesInscriptionPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-sm border border-[var(--color-gris-clair)] text-center">
        <div className="mx-auto w-24 h-24 bg-green-50 rounded-full flex items-center justify-center text-[var(--color-vert-principal)] mb-6 shadow-sm">
          <PartyPopper size={48} />
        </div>
        
        <h2 className="text-3xl font-heading font-extrabold text-gray-900">
          Félicitations !
        </h2>
        
        <p className="text-lg text-[var(--color-gris-texte)] mb-8">
          Votre compte est désormais actif et votre cotisation a bien été prise en compte. Bienvenue au sein du réseau agrolide !
        </p>

        <div className="bg-[#E8F3EB] rounded-xl p-6 mb-8 text-left border border-green-100 text-[var(--color-vert-principal)] text-sm space-y-2">
          <p><strong>Prochaines étapes recommandées :</strong></p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Complétez votre profil dans l'annuaire</li>
            <li>Rejoignez les groupes de votre spécialité</li>
            <li>Explorez les opportunités du marché</li>
          </ul>
        </div>

        <Link href="/membres/dashboard" className="block w-full">
          <Button variant="primary" className="w-full text-lg h-14">
            Accéder à mon tableau de bord
          </Button>
        </Link>
      </div>
    </div>
  )
}
