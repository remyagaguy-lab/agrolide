import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Politique de confidentialité | agrolide",
  description: "Politique de confidentialité et de protection des données du réseau agrolide.",
}

export default function ConfidentialitePage() {
  return (
    <div className="bg-[#f8f8f6] min-h-screen pb-[80px] pt-[40px] md:pt-[80px] font-urbanist">
      <div className="max-w-[800px] mx-auto px-6">
        <div className="bg-white rounded-2xl p-8 md:p-12 shadow-sm border border-[#e8e8e4]">
          <h1 className="font-[900] text-[32px] md:text-[40px] text-[#1a1a1a] tracking-[-0.02em] mb-[8px]">
            Politique de Confidentialité
          </h1>
          <p className="text-[14px] text-[#9a9a96] mb-[32px]">
            Dernière mise à jour : 1er Janvier 2026
          </p>

          <div className="text-[15px] text-[#4a4a4a] leading-[1.8] space-y-6">
            <section>
              <p className="font-[600] text-[#1a1a1a]">
                La protection de vos données personnelles est une priorité pour le réseau agrolide. Cette politique de confidentialité explique comment nous collectons, utilisons et protégeons vos informations.
              </p>
            </section>

            <section>
              <h2 className="text-[20px] font-[800] text-[#1a1a1a] mb-[12px] text-[#1b5e38]">1. Données collectées</h2>
              <p>
                Nous collectons uniquement les données nécessaires à votre inscription et à l'utilisation optimale de nos services :
              </p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>Informations d'identité (nom, prénom)</li>
                <li>Coordonnées (adresse e-mail, numéro de téléphone)</li>
                <li>Informations professionnelles (profession, domaine d'activité, pays)</li>
                <li>Données de navigation et d'utilisation de la plateforme</li>
              </ul>
            </section>

            <section>
              <h2 className="text-[20px] font-[800] text-[#1a1a1a] mb-[12px] text-[#1b5e38]">2. Utilisation des données</h2>
              <p>
                Vos données sont utilisées dans le but de :
              </p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>Gérer votre compte membre et vos accès (Junior, Professionnel, Partenaire, Sénior).</li>
                <li>Vous envoyer notre newsletter et des notifications importantes.</li>
                <li>Faciliter la mise en relation via l'annuaire des membres.</li>
                <li>Améliorer en continu l'expérience sur notre plateforme.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-[20px] font-[800] text-[#1a1a1a] mb-[12px] text-[#1b5e38]">3. Partage des données</h2>
              <p>
                Vos données <strong>ne sont en aucun cas vendues à des tiers</strong>. Elles peuvent être partagées exclusivement avec nos prestataires techniques (hébergement, solution d'envoi d'emails, prestataires de paiement sécurisé) dans le seul but d'assurer le fonctionnement de la plateforme.
              </p>
            </section>

            <section>
              <h2 className="text-[20px] font-[800] text-[#1a1a1a] mb-[12px] text-[#1b5e38]">4. Vos droits</h2>
              <p>
                Conformément aux réglementations en vigueur sur la protection des données personnelles, vous disposez d'un droit d'accès, de rectification, de portabilité et de suppression de vos données.
              </p>
              <p className="mt-2">
                Pour exercer ce droit, vous pouvez nous contacter à l'adresse suivante : <a href="mailto:contact@agrolide.org" className="text-[#50a853] hover:underline font-[600]">contact@agrolide.org</a>.
              </p>
            </section>

            <section>
              <h2 className="text-[20px] font-[800] text-[#1a1a1a] mb-[12px] text-[#1b5e38]">5. Sécurité</h2>
              <p>
                Nous mettons en œuvre toutes les mesures techniques et organisationnelles nécessaires pour garantir la sécurité de vos données personnelles et prévenir toute perte, altération ou accès non autorisé.
              </p>
            </section>

            <section>
              <h2 className="text-[20px] font-[800] text-[#1a1a1a] mb-[12px] text-[#1b5e38]">6. Cookies</h2>
              <p>
                Notre site utilise des cookies essentiels au fonctionnement de la plateforme (session utilisateur) et des cookies analytiques anonymes pour mesurer notre audience. Vous pouvez à tout moment configurer votre navigateur pour refuser ces cookies.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
