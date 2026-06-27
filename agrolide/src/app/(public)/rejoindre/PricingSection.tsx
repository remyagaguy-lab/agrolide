"use client"

import { useState } from "react"
import Link from "next/link"
import { Check, X, UserPlus, ArrowRight, GraduationCap, Briefcase, Building2, Award, Lock } from "lucide-react"

export default function PricingSection() {
  const [isAnnual, setIsAnnual] = useState(true)

  const formatPrice = (p: number) => p.toLocaleString('fr-FR').replace(/\s/g, ' ')

  const PriceBlock = ({ annualPrice, monthlyPrice }: { annualPrice: number, monthlyPrice: number }) => {
    const monthlyEquivalent = Math.round(annualPrice / 12)
    return (
      <>
        <div className="flex items-baseline gap-[3px] mb-[4px]">
          <span className="font-[700] text-[13px] text-[#1b5e38]">FCFA</span>
          <span className="font-[900] text-[26px] text-[#1b5e38] leading-none">
            {isAnnual ? formatPrice(annualPrice) : formatPrice(monthlyPrice)}
          </span>
        </div>
        <div className="text-[11px] text-[#9a9a96] mb-[14px] min-h-[32px]">
          {isAnnual ? (
            <>par an · soit <span className="text-[#50a853] font-[600]">{formatPrice(monthlyEquivalent)} FCFA/mois</span></>
          ) : (
            <>par mois, sans engagement<br/><span className="text-[#50a853] font-[600]">soit {formatPrice(annualPrice)} FCFA/an en annuel</span></>
          )}
        </div>
      </>
    )
  }

  const periodeParam = isAnnual ? "annuel" : "mensuel"

  return (
    <div className="bg-[#ffffff] min-h-screen pb-[64px] pt-[32px] md:pt-[64px] font-urbanist">
      <div className="max-w-[840px] mx-auto px-6">
        
        {/* Header */}
        <div className="text-center mb-[8px]">
          <span className="text-[11px] font-[700] tracking-[0.1em] uppercase text-[#50a853]">Adhésion</span>
        </div>
        <h1 className="font-[900] text-[28px] md:text-[36px] text-center text-[#1a1a1a] tracking-[-0.02em] mb-[6px]">
          Choisissez votre profil dans le réseau
        </h1>
        <div className="text-[13px] text-[#9a9a96] text-center mb-[32px]">
          Rejoignez gratuitement ou accédez aux avantages complets selon votre parcours.
        </div>

        {/* Toggle */}
        <div className="flex flex-col items-center justify-center mb-[40px]">
          <div className="inline-flex bg-[#f0f0ee] p-1 rounded-full relative">
            <button
              onClick={() => setIsAnnual(false)}
              className={`relative z-10 w-[110px] py-[8px] text-[13px] font-[700] rounded-full transition-colors ${!isAnnual ? 'text-white' : 'text-[#9a9a96] hover:text-[#1a1a1a]'}`}
            >
              Mensuel
            </button>
            <button
              onClick={() => setIsAnnual(true)}
              className={`relative z-10 w-[110px] py-[8px] text-[13px] font-[700] rounded-full transition-colors ${isAnnual ? 'text-white' : 'text-[#9a9a96] hover:text-[#1a1a1a]'}`}
            >
              Annuel
              <span className="absolute -top-[12px] -right-[15px] bg-[#fcb726] text-[#1a1a1a] text-[10px] font-[800] px-[8px] py-[3px] rounded-full whitespace-nowrap shadow-sm">
                2 mois offerts
              </span>
            </button>
            <div
              className={`absolute top-1 bottom-1 w-[110px] bg-[#1b5e38] rounded-full transition-transform duration-300 ease-out ${isAnnual ? 'translate-x-[110px]' : 'translate-x-0'}`}
            ></div>
          </div>
        </div>

        {/* Passionné Card */}
        <div className="border border-[#e8e8e4] rounded-xl p-6 md:p-7 grid grid-cols-1 md:grid-cols-2 gap-6 bg-white mb-8">
          <div>
            <div className="inline-flex items-center gap-[6px] bg-[#e8f5e9] rounded-[5px] px-[12px] py-[4px] mb-[12px]">
              <span className="text-[11px] font-[700] text-[#1b5e38] tracking-[0.05em]">Gratuit · Sans engagement</span>
            </div>
            <h3 className="font-[800] text-[17px] text-[#1a1a1a] mb-[4px]">Passionné du domaine agricole</h3>
            <p className="text-[12px] text-[#9a9a96] leading-[1.6] mb-[16px]">
              Pour les curieux, les étudiants en exploration et toute personne attachée à l'agriculture africaine sans exercer professionnellement.
            </p>
            <div className="font-[900] text-[28px] text-[#1b5e38] mb-[4px] leading-none">0 FCFA</div>
            <div className="text-[11px] text-[#9a9a96]">Accès gratuit, pour toujours</div>
            <div className="flex items-center flex-wrap gap-[12px] mt-[16px]">
              <Link href="/inscription?categorie=passionne" className="inline-flex items-center gap-[6px] bg-[#1b5e38] text-white text-[13px] font-[700] px-[20px] py-[10px] rounded-[7px] hover:bg-[#145030] transition-colors">
                <UserPlus size={14} /> Rejoindre gratuitement
              </Link>
              <button className="inline-flex items-center gap-[6px] text-[#1b5e38] text-[13px] font-[600] underline decoration-transparent hover:decoration-[#1b5e38] transition-colors">
                Voir les avantages <ArrowRight size={13} />
              </button>
            </div>
          </div>
          <div className="flex flex-col justify-center gap-[8px]">
            {[
              { text: "Lecture du blog et des actualités agrolide", included: true },
              { text: "Newsletter mensuelle du réseau", included: true },
              { text: "Accès aux webinaires publics gratuits", included: true },
              { text: "Calendrier des événements publics", included: true },
              { text: "Annuaire professionnel (membres uniquement)", included: false },
              { text: "Bibliothèque numérique", included: false },
              { text: "Forum et messagerie membres", included: false },
              { text: "Opportunités d'emploi et appels à projets", included: false },
            ].map((feat, i) => (
              <div key={i} className="flex items-start gap-[8px] text-[12px]">
                <div className="mt-[2px] flex-shrink-0">
                  {feat.included ? <Check size={14} className="text-[#50a853]" /> : <X size={14} className="text-[#d0d0d0]" />}
                </div>
                <span className={feat.included ? "text-[#1a1a1a]" : "text-[#9a9a96]"}>{feat.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Separator */}
        <div className="flex items-center gap-[12px] mb-[24px]">
          <div className="flex-1 h-[1px] bg-[#e8e8e4]"></div>
          <div className="text-[11px] font-[700] text-[#9a9a96] uppercase tracking-[0.06em]">Profils membres avec accès complet</div>
          <div className="flex-1 h-[1px] bg-[#e8e8e4]"></div>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-[14px]">
          
          {/* Junior */}
          <div className="border border-[#e8e8e4] rounded-xl p-[20px] flex flex-col bg-white">
            <div className="w-[36px] h-[36px] rounded-[8px] flex items-center justify-center mb-[10px] bg-[#e8f5e9] text-[#1b5e38]">
              <GraduationCap size={18} />
            </div>
            <div className="font-[800] text-[15px] text-[#1a1a1a] mb-[3px]">Junior</div>
            <div className="text-[11px] text-[#9a9a96] leading-[1.5] mb-[12px]">Étudiants en agronomie, jeunes diplômés et passionnés en phase d'insertion.</div>
            
            <PriceBlock annualPrice={10000} monthlyPrice={1000} />
            
            <Link href={`/inscription?categorie=junior&periode=${periodeParam}`} className="block w-full py-[10px] rounded-[7px] font-[700] text-[13px] text-center transition-colors bg-transparent border-[1.5px] border-[#e8e8e4] text-[#1a1a1a] hover:border-[#1b5e38] hover:text-[#1b5e38] hover:bg-[#f0f7f0] mb-[14px]">
              S'inscrire comme Junior
            </Link>
            <hr className="border-t border-[#f0f0ee] mb-[12px]" />
            <div className="text-[10px] font-[700] text-[#9a9a96] uppercase tracking-[0.07em] mb-[8px]">Inclus dans Junior :</div>
            <div className="flex flex-col gap-[6px] flex-1">
              {[
                { text: "Profil dans l'annuaire continental", included: true },
                { text: <>Bibliothèque numérique <span className="text-[#50a853] font-[600]">(20 docs/mois)</span></>, included: true },
                { text: "Webinaires publics et privés", included: true },
                { text: "Forum communautaire", included: true },
                { text: "Opportunités d'emploi et stages", included: true },
                { text: "Messagerie interne membres", included: false },
                { text: "Dépôt de documents bibliothèque", included: false },
              ].map((feat, i) => (
                <div key={i} className="flex items-start gap-[7px] text-[11px] leading-[1.45]">
                  <div className="mt-[1px] flex-shrink-0">
                    {feat.included ? <Check size={13} className="text-[#50a853]" /> : <X size={13} className="text-[#d0d0d0]" />}
                  </div>
                  <span className={feat.included ? "text-[#1a1a1a]" : "text-[#9a9a96]"}>{feat.text}</span>
                </div>
              ))}
            </div>
            <div className="text-[11px] font-[600] text-[#1b5e38] mt-[14px] flex items-center gap-[4px] cursor-pointer hover:underline">
              Voir tous les avantages <ArrowRight size={12} />
            </div>
          </div>

          {/* Professionnel */}
          <div className="border-[2px] border-[#1b5e38] rounded-xl p-[20px] flex flex-col bg-white relative mt-[12px] md:mt-0">
            <div className="absolute -top-[12px] left-1/2 -translate-x-1/2 bg-[#1b5e38] text-white text-[10px] font-[800] px-[12px] py-[3px] rounded-full whitespace-nowrap tracking-[0.04em]">
              Le plus populaire
            </div>
            <div className="w-[36px] h-[36px] rounded-[8px] flex items-center justify-center mb-[10px] bg-[#1b5e38] text-white">
              <Briefcase size={18} />
            </div>
            <div className="font-[800] text-[15px] text-[#1a1a1a] mb-[3px]">Professionnel</div>
            <div className="text-[11px] text-[#9a9a96] leading-[1.5] mb-[12px]">Agronomes, ingénieurs, chercheurs, consultants et entrepreneurs actifs.</div>
            
            <PriceBlock annualPrice={25000} monthlyPrice={2500} />

            <Link href={`/inscription?categorie=professionnel&periode=${periodeParam}`} className="block w-full py-[10px] rounded-[7px] font-[700] text-[13px] text-center transition-colors bg-[#1b5e38] text-white hover:bg-[#145030] mb-[14px]">
              S'inscrire comme Professionnel
            </Link>
            <hr className="border-t border-[#f0f0ee] mb-[12px]" />
            <div className="text-[10px] font-[700] text-[#9a9a96] uppercase tracking-[0.07em] mb-[8px]">Tout Junior, plus :</div>
            <div className="flex flex-col gap-[6px] flex-1">
              {[
                { text: <>Bibliothèque numérique <span className="text-[#50a853] font-[600]">illimitée</span></> },
                { text: "Messagerie interne membres" },
                { text: "Dépôt de documents (thèses, guides...)" },
                { text: "Sessions techniques privées" },
                { text: "Appels à projets et partenariats" },
                { text: "Certificats de formation téléchargeables" },
                { text: "Visibilité dans l'annuaire complet" },
              ].map((feat, i) => (
                <div key={i} className="flex items-start gap-[7px] text-[11px] leading-[1.45] text-[#1a1a1a]">
                  <div className="mt-[1px] flex-shrink-0">
                    <Check size={13} className="text-[#50a853]" />
                  </div>
                  <span>{feat.text}</span>
                </div>
              ))}
            </div>
            <div className="text-[11px] font-[600] text-[#1b5e38] mt-[14px] flex items-center gap-[4px] cursor-pointer hover:underline">
              Voir tous les avantages <ArrowRight size={12} />
            </div>
          </div>

          {/* Partenaire */}
          <div className="border border-[#e8e8e4] rounded-xl p-[20px] flex flex-col bg-white mt-[6px] md:mt-0">
            <div className="w-[36px] h-[36px] rounded-[8px] flex items-center justify-center mb-[10px] bg-[#f0f7f0] text-[#1b5e38]">
              <Building2 size={18} />
            </div>
            <div className="font-[800] text-[15px] text-[#1a1a1a] mb-[3px]">Partenaire</div>
            <div className="text-[11px] text-[#9a9a96] leading-[1.5] mb-[12px]">Entreprises agricoles, coopératives, ONG, agritech et institutions de recherche.</div>
            
            <PriceBlock annualPrice={70000} monthlyPrice={7000} />

            <Link href={`/contact?periode=${periodeParam}`} className="block w-full py-[10px] rounded-[7px] font-[700] text-[13px] text-center transition-colors bg-transparent border-[1.5px] border-[#e8e8e4] text-[#1a1a1a] hover:border-[#1b5e38] hover:text-[#1b5e38] hover:bg-[#f0f7f0] mb-[14px]">
              Nous contacter
            </Link>
            <hr className="border-t border-[#f0f0ee] mb-[12px]" />
            <div className="text-[10px] font-[700] text-[#9a9a96] uppercase tracking-[0.07em] mb-[8px]">Tout Professionnel, plus :</div>
            <div className="flex flex-col gap-[6px] flex-1">
              {[
                "Vitrine entreprise dans l'annuaire",
                "Accès au vivier de talents agrolide",
                "Publication d'offres d'emploi prioritaires",
                "Co-organisation d'événements réseau",
                "Logo dans l'espace partenaires",
                "Montage d'appels à projets collectifs",
                "Paiement par virement sur facture",
              ].map((text, i) => (
                <div key={i} className="flex items-start gap-[7px] text-[11px] leading-[1.45] text-[#1a1a1a]">
                  <div className="mt-[1px] flex-shrink-0">
                    <Check size={13} className="text-[#50a853]" />
                  </div>
                  <span>{text}</span>
                </div>
              ))}
            </div>
            <div className="text-[11px] font-[600] text-[#1b5e38] mt-[14px] flex items-center gap-[4px] cursor-pointer hover:underline">
              Voir tous les avantages <ArrowRight size={12} />
            </div>
          </div>

          {/* Sénior */}
          <div className="border border-[#e8e8e4] rounded-xl p-[20px] flex flex-col bg-white mt-[6px] md:mt-0">
            <div className="w-[36px] h-[36px] rounded-[8px] flex items-center justify-center mb-[10px] bg-[#fef3e2] text-[#8a4e00]">
              <Award size={18} />
            </div>
            <div className="font-[800] text-[15px] text-[#1a1a1a] mb-[3px]">Sénior</div>
            <div className="text-[11px] text-[#9a9a96] leading-[1.5] mb-[12px]">Experts, chercheurs émérites, mentors et investisseurs qui contribuent bénévolement.</div>
            
            <PriceBlock annualPrice={45000} monthlyPrice={4500} />

            <Link href={`/inscription?categorie=senior&periode=${periodeParam}`} className="block w-full py-[10px] rounded-[7px] font-[700] text-[13px] text-center transition-colors bg-[#f99e1d] text-white hover:bg-[#fcb726] mb-[14px]">
              S'inscrire comme Sénior
            </Link>
            <hr className="border-t border-[#f0f0ee] mb-[12px]" />
            <div className="text-[10px] font-[700] text-[#9a9a96] uppercase tracking-[0.07em] mb-[8px]">Tout Professionnel, plus :</div>
            <div className="flex flex-col gap-[6px] flex-1">
              {[
                "Espace mentorat dédié",
                "Animation de webinaires réseau",
                "Badge \"Expert\" visible dans l'annuaire",
                "Accès illimité à toutes les ressources",
                "Participation aux décisions du réseau",
                "Valorisation de votre expertise africaine",
                "Profil prioritaire dans les résultats",
              ].map((text, i) => (
                <div key={i} className="flex items-start gap-[7px] text-[11px] leading-[1.45] text-[#1a1a1a]">
                  <div className="mt-[1px] flex-shrink-0">
                    <Check size={13} className="text-[#50a853]" />
                  </div>
                  <span>{text}</span>
                </div>
              ))}
            </div>
            <div className="text-[11px] font-[600] text-[#1b5e38] mt-[14px] flex items-center gap-[4px] cursor-pointer hover:underline">
              Voir les critères de sélection <ArrowRight size={12} />
            </div>
          </div>

        </div>

        {/* Payment Note */}
        <div className="flex items-center justify-center gap-[6px] text-center mt-[32px] text-[11px] text-[#9a9a96]">
          <Lock size={14} className="flex-shrink-0" />
          <span>Paiement sécurisé par Mobile Money (Orange, MTN, Moov, Wave) ou carte bancaire · Engagement annuel résiliable</span>
        </div>

      </div>
    </div>
  )
}
