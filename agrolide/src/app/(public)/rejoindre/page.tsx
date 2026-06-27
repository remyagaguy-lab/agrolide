import { Metadata } from "next"
import Link from "next/link"
import { Check, X, User, GraduationCap, Building2, Star, ArrowRight } from "lucide-react"

export const metadata: Metadata = {
  title: "Rejoindre le réseau | agrolide",
  description: "Rejoignez le réseau continental de l'agriculture africaine et accédez à des ressources, des formations et des opportunités.",
}

export default function RejoindrePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* ── HERO ─────────────────────────────────── */}
      <section className="relative overflow-hidden pt-[100px] pb-[60px] md:pt-[140px] md:pb-[80px] bg-[#1a1a1a]">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[140%] bg-[#1b5e38]/20 rounded-full blur-[120px] pointer-events-none" />
          <div className="absolute bottom-[-20%] right-[-10%] w-[40%] h-[120%] bg-[#fcb726]/10 rounded-full blur-[100px] pointer-events-none" />
        </div>
        
        <div className="max-w-[900px] mx-auto px-6 relative z-10 text-center">
          <div className="inline-block px-4 py-2 rounded-full border border-white/10 text-[#fcb726] font-heading font-[700] text-[11px] tracking-[0.2em] uppercase mb-6">
            Adhésion au réseau
          </div>
          <h1 className="font-heading font-[800] text-[40px] md:text-[64px] text-white leading-[1.1] tracking-[-0.02em] mb-8">
            Votre réseau continental vous attend.
          </h1>
          <p className="font-sans text-[16px] md:text-[20px] text-[rgba(255,255,255,0.7)] max-w-[700px] mx-auto leading-[1.7]">
            Choisissez la catégorie qui correspond à votre profil et rejoignez des milliers d'acteurs engagés pour la souveraineté alimentaire de l'Afrique.
          </p>
        </div>
      </section>

      {/* ── PROFILS ──────────────────────────────── */}
      <section className="py-[40px] md:py-[80px] bg-[#f8f8f6]">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Junior */}
            <div className="bg-white rounded-3xl p-8 border border-[#eaeaea] shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300 flex flex-col">
              <div className="w-14 h-14 bg-[#f0f7f0] rounded-2xl flex items-center justify-center text-[#1b5e38] mb-6">
                <GraduationCap size={28} />
              </div>
              <h3 className="font-heading font-[800] text-[24px] text-[#1a1a1a] mb-2">Junior</h3>
              <div className="text-[13px] font-[700] text-[#1b5e38] uppercase tracking-wider mb-4 px-3 py-1 bg-[#1b5e38]/10 rounded-full inline-block w-fit">
                5 000 FCFA / an
              </div>
              <p className="font-sans text-[15px] text-[#666] leading-[1.6] mb-8 flex-grow">
                Étudiants en agronomie et jeunes diplômés en insertion.
              </p>
              <Link
                href="/inscription?categorie=junior"
                className="w-full text-center py-3 rounded-xl border border-[#eaeaea] text-[#1a1a1a] font-heading font-[700] hover:bg-[#1a1a1a] hover:text-white hover:border-[#1a1a1a] transition-all duration-300"
              >
                S'inscrire
              </Link>
            </div>

            {/* Professionnel */}
            <div className="bg-gradient-to-b from-[#1b5e38] to-[#124026] rounded-3xl p-8 shadow-[0_20px_40px_rgba(27,94,56,0.15)] hover:-translate-y-1 transition-all duration-300 flex flex-col relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl pointer-events-none" />
              
              <div className="absolute top-6 right-6 px-3 py-1 bg-[#fcb726] text-[#1a1a1a] text-[10px] font-heading font-[800] uppercase tracking-wider rounded-full">
                Populaire
              </div>
              
              <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center text-white mb-6">
                <User size={28} />
              </div>
              <h3 className="font-heading font-[800] text-[24px] text-white mb-2">Professionnel</h3>
              <div className="text-[13px] font-[700] text-[#fcb726] uppercase tracking-wider mb-4 px-3 py-1 bg-[#fcb726]/10 rounded-full inline-block w-fit">
                15 000 FCFA / an
              </div>
              <p className="font-sans text-[15px] text-white/70 leading-[1.6] mb-8 flex-grow">
                Agronomes, chercheurs, consultants et entrepreneurs actifs.
              </p>
              <Link
                href="/inscription?categorie=professionnel"
                className="w-full text-center py-3 rounded-xl bg-[#fcb726] text-[#1a1a1a] font-heading font-[700] hover:bg-white hover:shadow-[0_0_20px_rgba(252,183,38,0.3)] transition-all duration-300"
              >
                S'inscrire
              </Link>
            </div>

            {/* Partenaire */}
            <div className="bg-white rounded-3xl p-8 border border-[#eaeaea] shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300 flex flex-col">
              <div className="w-14 h-14 bg-[#fcb726]/10 rounded-2xl flex items-center justify-center text-[#d9970c] mb-6">
                <Building2 size={28} />
              </div>
              <h3 className="font-heading font-[800] text-[24px] text-[#1a1a1a] mb-2">Partenaire</h3>
              <div className="text-[13px] font-[700] text-[#d9970c] uppercase tracking-wider mb-4 px-3 py-1 bg-[#fcb726]/10 rounded-full inline-block w-fit">
                50 000 FCFA / an
              </div>
              <p className="font-sans text-[15px] text-[#666] leading-[1.6] mb-8 flex-grow">
                Entreprises, coopératives et institutions agricoles.
              </p>
              <Link
                href="/contact"
                className="w-full text-center py-3 rounded-xl border border-[#eaeaea] text-[#1a1a1a] font-heading font-[700] hover:border-[#fcb726] hover:bg-[#fcb726]/5 hover:text-[#d9970c] transition-all duration-300"
              >
                Nous contacter
              </Link>
            </div>

            {/* Sénior */}
            <div className="bg-white rounded-3xl p-8 border border-[#eaeaea] shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300 flex flex-col">
              <div className="w-14 h-14 bg-[#1a1a1a]/5 rounded-2xl flex items-center justify-center text-[#1a1a1a] mb-6">
                <Star size={28} />
              </div>
              <h3 className="font-heading font-[800] text-[24px] text-[#1a1a1a] mb-2">Sénior</h3>
              <div className="text-[13px] font-[700] text-[#1a1a1a] uppercase tracking-wider mb-4 px-3 py-1 bg-[#1a1a1a]/5 rounded-full inline-block w-fit">
                Gratuit
              </div>
              <p className="font-sans text-[15px] text-[#666] leading-[1.6] mb-8 flex-grow">
                Experts mentors et chercheurs émérites bénévoles.
              </p>
              <Link
                href="/candidature"
                className="w-full text-center py-3 rounded-xl border border-[#eaeaea] text-[#1a1a1a] font-heading font-[700] hover:bg-[#1a1a1a] hover:text-white hover:border-[#1a1a1a] transition-all duration-300"
              >
                Candidater
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* ── TABLEAU COMPARATIF ─────────────────────── */}
      <section className="py-[40px] md:py-[80px] bg-white">
        <div className="max-w-[1000px] mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="font-heading font-[800] text-[32px] md:text-[44px] text-[#1a1a1a] mb-4">
              Comparez les avantages
            </h2>
            <p className="font-sans text-[16px] text-[#666]">
              Découvrez ce que chaque catégorie vous offre au sein du réseau.
            </p>
          </div>

          <div className="overflow-x-auto rounded-3xl border border-[#f0f0f0] shadow-[0_10px_40px_rgba(0,0,0,0.03)]">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr>
                  <th className="py-6 px-6 bg-[#f8f8f6] border-b border-[#eaeaea] font-heading font-[800] text-[#1a1a1a] w-1/3">Avantages</th>
                  <th className="py-6 px-4 bg-white border-b border-[#eaeaea] font-heading font-[800] text-center text-[#1a1a1a]">Junior</th>
                  <th className="py-6 px-4 bg-[#f0f7f0] border-b border-[#1b5e38]/10 font-heading font-[800] text-center text-[#1b5e38]">Pro</th>
                  <th className="py-6 px-4 bg-white border-b border-[#eaeaea] font-heading font-[800] text-center text-[#1a1a1a]">Partenaire</th>
                  <th className="py-6 px-4 bg-white border-b border-[#eaeaea] font-heading font-[800] text-center text-[#1a1a1a]">Sénior</th>
                </tr>
              </thead>
              <tbody className="font-sans text-[15px] text-[#555]">
                <tr className="border-b border-[#f4f4f4] hover:bg-[#f8f8f6]/50 transition-colors">
                  <td className="py-5 px-6 font-[600] text-[#1a1a1a]">Accès à l'Annuaire</td>
                  <td className="py-5 px-4 text-center"><Check className="inline text-[#1b5e38]" size={20} /></td>
                  <td className="py-5 px-4 text-center bg-[#f0f7f0]/50"><Check className="inline text-[#1b5e38]" size={20} /></td>
                  <td className="py-5 px-4 text-center"><Check className="inline text-[#1b5e38]" size={20} /></td>
                  <td className="py-5 px-4 text-center"><Check className="inline text-[#1b5e38]" size={20} /></td>
                </tr>
                <tr className="border-b border-[#f4f4f4] hover:bg-[#f8f8f6]/50 transition-colors">
                  <td className="py-5 px-6 font-[600] text-[#1a1a1a]">Bibliothèque Numérique</td>
                  <td className="py-5 px-4 text-center"><Check className="inline text-[#1b5e38]" size={20} /></td>
                  <td className="py-5 px-4 text-center bg-[#f0f7f0]/50"><Check className="inline text-[#1b5e38]" size={20} /></td>
                  <td className="py-5 px-4 text-center"><Check className="inline text-[#1b5e38]" size={20} /></td>
                  <td className="py-5 px-4 text-center"><Check className="inline text-[#1b5e38]" size={20} /></td>
                </tr>
                <tr className="border-b border-[#f4f4f4] hover:bg-[#f8f8f6]/50 transition-colors">
                  <td className="py-5 px-6 font-[600] text-[#1a1a1a]">Accès aux Formations</td>
                  <td className="py-5 px-4 text-center text-[13px] text-[#666]">Tarif réduit</td>
                  <td className="py-5 px-4 text-center text-[13px] font-[600] text-[#1b5e38] bg-[#f0f7f0]/50">Tarif préférentiel</td>
                  <td className="py-5 px-4 text-center text-[13px] text-[#666]">Accès illimité</td>
                  <td className="py-5 px-4 text-center text-[13px] text-[#666]">Intervenant</td>
                </tr>
                <tr className="border-b border-[#f4f4f4] hover:bg-[#f8f8f6]/50 transition-colors">
                  <td className="py-5 px-6 font-[600] text-[#1a1a1a]">Accès au Forum</td>
                  <td className="py-5 px-4 text-center"><Check className="inline text-[#1b5e38]" size={20} /></td>
                  <td className="py-5 px-4 text-center bg-[#f0f7f0]/50"><Check className="inline text-[#1b5e38]" size={20} /></td>
                  <td className="py-5 px-4 text-center"><Check className="inline text-[#1b5e38]" size={20} /></td>
                  <td className="py-5 px-4 text-center"><Check className="inline text-[#1b5e38]" size={20} /></td>
                </tr>
                <tr className="border-b border-[#f4f4f4] hover:bg-[#f8f8f6]/50 transition-colors">
                  <td className="py-5 px-6 font-[600] text-[#1a1a1a]">Messagerie Privée</td>
                  <td className="py-5 px-4 text-center"><X className="inline text-[#ccc]" size={20} /></td>
                  <td className="py-5 px-4 text-center bg-[#f0f7f0]/50"><Check className="inline text-[#1b5e38]" size={20} /></td>
                  <td className="py-5 px-4 text-center"><Check className="inline text-[#1b5e38]" size={20} /></td>
                  <td className="py-5 px-4 text-center"><Check className="inline text-[#1b5e38]" size={20} /></td>
                </tr>
                <tr className="hover:bg-[#f8f8f6]/50 transition-colors">
                  <td className="py-5 px-6 font-[600] text-[#1a1a1a]">Opportunités</td>
                  <td className="py-5 px-4 text-center text-[13px] text-[#666]">Stages / Emplois</td>
                  <td className="py-5 px-4 text-center text-[13px] font-[600] text-[#1b5e38] bg-[#f0f7f0]/50">Marchés / Financements</td>
                  <td className="py-5 px-4 text-center text-[13px] text-[#666]">Visibilité / B2B</td>
                  <td className="py-5 px-4 text-center text-[13px] text-[#666]">Mentorat</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────── */}
      <section className="py-[40px] md:py-[80px] bg-[#f8f8f6]">
        <div className="max-w-[800px] mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-[#1b5e38]/10 text-[#1b5e38] font-heading font-[700] text-[11px] tracking-[0.15em] uppercase mb-6">
              Assistance
            </div>
            <h2 className="font-heading font-[800] text-[32px] md:text-[44px] text-[#1a1a1a] mb-4">
              Questions fréquentes
            </h2>
          </div>

          <div className="space-y-4">
            {[
              { q: "Comment se déroule le processus d'adhésion ?", a: "Une fois que vous avez sélectionné votre catégorie, vous remplirez un formulaire avec vos informations professionnelles. Après validation de votre profil par l'équipe (24-48h), vous recevrez un lien pour régler votre cotisation annuelle et accéder à la plateforme." },
              { q: "Puis-je changer de catégorie en cours d'année ?", a: "Oui, il est possible de passer de la catégorie Junior à Professionnel une fois que vous avez obtenu votre diplôme et commencé votre carrière. Le prorata de la cotisation sera appliqué." },
              { q: "Quelles méthodes de paiement acceptez-vous ?", a: "Nous acceptons les paiements par carte bancaire (Visa, Mastercard) ainsi que le Mobile Money dans plusieurs pays d'Afrique de l'Ouest et Centrale." },
              { q: "La catégorie Sénior est-elle ouverte à tous ?", a: "La catégorie Sénior est réservée aux experts justifiant d'une expérience significative dans le domaine agricole. L'adhésion se fait uniquement sur dossier de candidature ou par cooptation." },
              { q: "Les formations sont-elles incluses dans l'adhésion ?", a: "L'adhésion vous donne accès gratuitement à certains webinaires et masterclasses. Pour les formations certifiantes longues, vous bénéficiez d'un tarif préférentiel exclusif aux membres." },
            ].map((faq, i) => (
              <div key={i} className="bg-white p-6 md:p-8 rounded-2xl border border-[#eaeaea] shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
                <h3 className="font-heading font-[800] text-[18px] text-[#1a1a1a] mb-3">{faq.q}</h3>
                <p className="font-sans text-[15px] text-[#666] leading-[1.7]">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
