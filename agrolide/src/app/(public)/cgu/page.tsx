import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Conditions Générales",
  description: "Conditions Générales d'Utilisation et de Vente (CGU/CGV) du réseau agrolide.",
  alternates: { canonical: '/cgu' }
}

export default function CguPage() {
  return (
    <div className="bg-[#f8f8f6] min-h-screen pb-[80px] pt-[40px] md:pt-[80px] font-urbanist">
      <div className="max-w-[800px] mx-auto px-6">
        <div className="bg-white rounded-2xl p-8 md:p-12 shadow-sm border border-[#e8e8e4]">
          <h1 className="font-[900] text-[32px] md:text-[40px] text-[#1a1a1a] tracking-[-0.02em] mb-[8px]">
            Conditions Générales d'Utilisation et de Vente (CGU / CGV)
          </h1>
          <p className="text-[14px] text-[#9a9a96] mb-[32px]">
            Dernière mise à jour : 1er Janvier 2026
          </p>

          <div className="text-[15px] text-[#4a4a4a] leading-[1.8] flex flex-col gap-8">
            <div>
              <p className="font-[600] text-[#1a1a1a]">
                Les présentes Conditions Générales régissent l'accès, l'utilisation de la plateforme agrolide.org et les conditions de souscription aux abonnements (adhésions) proposés par le réseau. En naviguant sur ce site ou en devenant membre, vous acceptez pleinement et sans réserve les présentes conditions.
              </p>
            </div>

            <div>
              <h2 className="text-[20px] font-[800] mb-[12px] text-[#1b5e38]">1. Objet</h2>
              <p>
                Le réseau agrolide est une plateforme professionnelle (annuaire, forum, ressources) destinée à fédérer les acteurs de la chaîne de valeur agricole en Afrique. Les présentes CGU/CGV définissent les droits et obligations des utilisateurs et de l'éditeur du site dans le cadre de son utilisation et de la vente de cotisations de membre.
              </p>
            </div>

            <div>
              <h2 className="text-[20px] font-[800] mb-[12px] text-[#1b5e38]">2. Accès aux services</h2>
              <p>
                Certaines sections du site (comme l'annuaire complet ou la bibliothèque technique avancée) sont réservées aux membres inscrits et à jour de leur cotisation. L'utilisateur est responsable de la confidentialité de ses identifiants de connexion.
              </p>
            </div>

            <div>
              <h2 className="text-[20px] font-[800] mb-[12px] text-[#1b5e38]">3. Adhésions et Paiements (CGV)</h2>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li><strong>Tarification :</strong> Les tarifs des adhésions (Junior, Professionnel, etc.) sont indiqués en FCFA ou en Euros toutes taxes comprises lors du parcours de souscription.</li>
                <li><strong>Paiement sécurisé :</strong> Le règlement s'effectue en ligne via nos partenaires certifiés (Stripe pour les cartes bancaires, CinetPay pour le Mobile Money). Le site agrolide ne stocke aucune donnée bancaire.</li>
                <li><strong>Validation :</strong> L'accès aux services premium est activé dès la confirmation de la transaction par l'opérateur de paiement.</li>
                <li><strong>Remboursement et Rétractation :</strong> Conformément à la législation sur les services numériques, le droit de rétractation ne s'applique pas une fois le service pleinement activé. Toutefois, toute demande légitime peut être adressée à l'équipe de support.</li>
              </ul>
            </div>

            <div>
              <h2 className="text-[20px] font-[800] mb-[12px] text-[#1b5e38]">4. Obligations de l'utilisateur</h2>
              <p>
                En tant que membre d'un réseau professionnel, vous vous engagez à :
              </p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>Fournir des informations véridiques sur votre profil.</li>
                <li>Ne pas publier de contenus offensants, diffamatoires ou contraires aux lois en vigueur sur les espaces d'échange.</li>
                <li>Ne pas utiliser les données de l'annuaire pour du démarchage abusif (spam).</li>
              </ul>
              <p className="mt-2">L'éditeur se réserve le droit de suspendre sans préavis ni remboursement le compte d'un utilisateur en cas de violation de ces règles.</p>
            </div>

            <div>
              <h2 className="text-[20px] font-[800] mb-[12px] text-[#1b5e38]">5. Propriété intellectuelle</h2>
              <p>
                Tous les éléments présents sur le site (textes, images, logos, architecture, documents de la bibliothèque) sont la propriété exclusive d'agrolide ou de ses partenaires. Toute reproduction non autorisée est strictement interdite.
              </p>
            </div>

            <div>
              <h2 className="text-[20px] font-[800] mb-[12px] text-[#1b5e38]">6. Modification des conditions</h2>
              <p>
                agrolide se réserve le droit de modifier les présentes CGU/CGV à tout moment. Les utilisateurs seront informés des modifications majeures. L'utilisation continue de la plateforme vaut acceptation des nouvelles conditions.
              </p>
            </div>

            <div>
              <h2 className="text-[20px] font-[800] mb-[12px] text-[#1b5e38]">7. Litiges et Droit applicable</h2>
              <p>
                Les présentes conditions sont soumises à la législation en vigueur au Togo, siège de l'organisation. En cas de litige, une solution amiable sera privilégiée avant toute action en justice.
              </p>
              <p className="mt-2">
                Pour toute question relative à ces conditions, contactez-nous à : <a href="mailto:contact@agrolide.org" className="text-[#50a853] hover:underline font-[600]">contact@agrolide.org</a>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
