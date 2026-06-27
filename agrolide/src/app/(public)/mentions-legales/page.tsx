import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Mentions légales | agrolide",
  description: "Mentions légales du site agrolide.",
}

export default function MentionsLegalesPage() {
  return (
    <div className="bg-[#f8f8f6] min-h-screen pb-[80px] pt-[40px] md:pt-[80px] font-urbanist">
      <div className="max-w-[800px] mx-auto px-6">
        <div className="bg-white rounded-2xl p-8 md:p-12 shadow-sm border border-[#e8e8e4]">
          <h1 className="font-[900] text-[32px] md:text-[40px] text-[#1a1a1a] tracking-[-0.02em] mb-[8px]">
            Mentions Légales
          </h1>
          <p className="text-[14px] text-[#9a9a96] mb-[32px]">
            En vigueur au 1er Janvier 2026
          </p>

          <div className="text-[15px] text-[#4a4a4a] leading-[1.8] space-y-6">
            <section>
              <h2 className="text-[20px] font-[800] text-[#1a1a1a] mb-[12px] text-[#1b5e38]">1. Éditeur du site</h2>
              <p>
                Le site <strong>agrolide.org</strong> est édité par l'organisation <strong>agrolide</strong>.<br />
                Siège social : [Adresse à compléter]<br />
                Email : <a href="mailto:contact@agrolide.org" className="text-[#50a853] hover:underline font-[600]">contact@agrolide.org</a><br />
                Téléphone : [Numéro à compléter]
              </p>
            </section>

            <section>
              <h2 className="text-[20px] font-[800] text-[#1a1a1a] mb-[12px] text-[#1b5e38]">2. Directeur de la publication</h2>
              <p>
                Le directeur de la publication est <strong>Remy Gaguy</strong>, en qualité de Fondateur & CEO du réseau agrolide.
              </p>
            </section>

            <section>
              <h2 className="text-[20px] font-[800] text-[#1a1a1a] mb-[12px] text-[#1b5e38]">3. Hébergement</h2>
              <p>
                Le site est hébergé par <strong>[Nom de l'hébergeur]</strong>.<br />
                Adresse de l'hébergeur : [Adresse de l'hébergeur]<br />
                Site web : [Site de l'hébergeur]
              </p>
            </section>

            <section>
              <h2 className="text-[20px] font-[800] text-[#1a1a1a] mb-[12px] text-[#1b5e38]">4. Propriété intellectuelle</h2>
              <p>
                L'ensemble de ce site relève de la législation internationale sur le droit d'auteur et la propriété intellectuelle. Tous les droits de reproduction sont réservés, y compris pour les documents téléchargeables et les représentations iconographiques et photographiques.
              </p>
              <p className="mt-2">
                La reproduction de tout ou partie de ce site sur un support électronique quel qu'il soit est formellement interdite sauf autorisation expresse du directeur de la publication.
              </p>
            </section>

            <section>
              <h2 className="text-[20px] font-[800] text-[#1a1a1a] mb-[12px] text-[#1b5e38]">5. Responsabilité</h2>
              <p>
                L'éditeur s'efforce de fournir sur le site agrolide.org des informations aussi précises que possible. Toutefois, il ne pourra être tenue responsable des omissions, des inexactitudes et des carences dans la mise à jour, qu'elles soient de son fait ou du fait des tiers partenaires qui lui fournissent ces informations.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
