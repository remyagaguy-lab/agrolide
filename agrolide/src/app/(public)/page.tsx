import Link from "next/link"
import Image from "next/image"

import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Accueil",
  description: "Fédérer la chaîne agricole africaine pour conquérir la souveraineté alimentaire."
}

export const revalidate = 3600

// --- Icônes SVG inline ---

function IconGlobe({ className = "" }: { className?: string }) {
  return (
    <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/>
      <path d="M2 12h20"/>
    </svg>
  )
}

function IconUsers({ className = "" }: { className?: string }) {
  return (
    <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
      <circle cx="9" cy="7" r="4"/>
      <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
      <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  )
}

function IconLibrary({ className = "" }: { className?: string }) {
  return (
    <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/>
    </svg>
  )
}

function IconArrowRight({ className = "" }: { className?: string }) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
    </svg>
  )
}

function IconNetwork({ className = "" }: { className?: string }) {
  return (
    <svg className={className} width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect width="6" height="6" x="9" y="3" rx="1"/>
      <rect width="6" height="6" x="3" y="15" rx="1"/>
      <rect width="6" height="6" x="15" y="15" rx="1"/>
      <path d="M12 9v3m-3 3H6m12 0h-3M12 12l-3 3m6-3-3 3"/>
    </svg>
  )
}

function IconGraduation({ className = "" }: { className?: string }) {
  return (
    <svg className={className} width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
      <path d="M6 12v5c3 3 9 3 12 0v-5"/>
    </svg>
  )
}

function IconBriefcase({ className = "" }: { className?: string }) {
  return (
    <svg className={className} width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="14" x="2" y="7" rx="2"/>
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
    </svg>
  )
}

function IconQuote({ className = "" }: { className?: string }) {
  return (
    <svg className={className} width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
      <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"/>
      <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"/>
    </svg>
  )
}

// --- Page ---

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">

      {/* ── HERO ─────────────────────────────────── */}
      <section className="bg-[#1b5e38] relative overflow-hidden">
        {/* Image de fond avec dégradé */}
        <div className="absolute top-0 right-0 w-full md:w-1/2 h-full pointer-events-none z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-[#1b5e38] via-[#1b5e38]/80 to-[#1b5e38]/60 md:via-[#1b5e38]/40 md:to-transparent z-10" />
          <Image
            src="/hero-background.jpg"
            alt="Agriculture africaine"
            fill
            priority
            className="object-cover object-[center_80%] opacity-100"
          />
        </div>

        <div className="max-w-[1100px] mx-auto px-6 pt-[40px] pb-0 md:pt-[60px] relative z-20">
          <div className="max-w-[900px]">
            <h1 className="font-heading font-[800] text-[40px] md:text-[64px] text-white leading-[1.08] tracking-[-0.03em] mb-8">
              Fédérer la chaîne<br />
              agricole, pour conquérir<br />
              <span className="text-[#fcb726]">la souveraineté alimentaire</span>
            </h1>
            <p className="font-sans text-[16px] text-white max-w-[600px] leading-[1.8] mb-10">
              Rejoignez le mouvement qui connecte, forme et propulse les acteurs de l'agriculture africaine.{" "}
              <strong className="text-[#878e2c] font-[700]">Étudiants en agronomie</strong>, <strong className="text-[#878e2c] font-[700]">Ingénieurs Agronomes</strong>, <strong className="text-[#878e2c] font-[700]">Chercheurs</strong>, <strong className="text-[#878e2c] font-[700]">Entreprises Agricoles</strong>, <strong className="text-[#878e2c] font-[700]">Investisseurs</strong> construisons... ensemble l'agriculture africaine que nous voulons.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/rejoindre"
                className="bg-white text-[#1b5e38] font-heading font-[700] px-[28px] py-[13px] text-[14px] rounded-md hover:bg-[#f0f7f0] transition-colors"
              >
                Rejoindre le réseau
              </Link>
              <Link
                href="#actions"
                className="border border-[rgba(255,255,255,0.28)] text-white font-heading font-[600] px-[28px] py-[13px] text-[14px] rounded-md hover:bg-white/10 transition-colors"
              >
                Nos actions
              </Link>
            </div>
          </div>

          {/* Strip de stats au bas du hero */}
          <div className="mt-16 border-t border-[rgba(255,255,255,0.12)] grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-[rgba(255,255,255,0.12)]">
            <div className="py-6 flex items-center gap-4 sm:pr-8">
              <div className="text-[rgba(255,255,255,0.35)]">
                <IconGlobe />
              </div>
              <div>
                <div className="font-heading font-[800] text-[20px] text-white leading-none mb-1">5 pays</div>
                <div className="text-[10px] text-[rgba(255,255,255,0.4)] uppercase tracking-[0.15em]">Présence continentale</div>
              </div>
            </div>
            <div className="py-6 flex items-center gap-4 sm:px-8">
              <div className="text-[rgba(255,255,255,0.35)]">
                <IconUsers />
              </div>
              <div>
                <div className="font-heading font-[800] text-[20px] text-white leading-none mb-1">500+ membres</div>
                <div className="text-[10px] text-[rgba(255,255,255,0.4)] uppercase tracking-[0.15em]">Actifs</div>
              </div>
            </div>
            <div className="py-6 flex items-center gap-4 sm:pl-8">
              <div className="text-[rgba(255,255,255,0.35)]">
                <IconLibrary />
              </div>
              <div>
                <div className="font-heading font-[800] text-[20px] text-white leading-none mb-1">+ 700 ressources</div>
                <div className="text-[10px] text-[rgba(255,255,255,0.4)] uppercase tracking-[0.15em]">Techniques</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── RAISON D'ÊTRE ────────────────────────── */}
      <section className="bg-gradient-to-br from-[#f8f8f6] to-white py-[60px] md:py-[100px] relative overflow-hidden">
        {/* Subtle background decoration */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#fcb726]/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="max-w-[1100px] mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-16 items-center">
            <div className="md:col-span-5">
              <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-[#1b5e38]/10 text-[#1b5e38] font-heading font-[700] text-[11px] tracking-[0.15em] uppercase mb-8">
                <span className="w-2 h-2 rounded-full bg-[#fcb726]" />
                Notre raison d'être
              </div>
              <h2 className="font-heading font-[800] text-[36px] md:text-[48px] text-[#1a1a1a] leading-[1.15] tracking-[-0.02em] mb-6">
                Transformer la fragmentation en <span className="text-[#1b5e38]">cohésion continentale.</span>
              </h2>
            </div>
            <div className="md:col-span-7 md:pl-10">
              <p className="font-sans text-[17px] text-[#555] leading-[1.8] mb-6">
                L'agriculture représente jusqu'à 40 % du PIB africain et emploie la majorité de notre population active. Pourtant, les acteurs de la chaîne de valeur évoluent souvent de manière fragmentée, sans cadre de collaboration pérenne.
              </p>
              <p className="font-sans text-[17px] text-[#555] leading-[1.8] mb-10">
                agrolide est né d'une ambition collective : doter l'Afrique d'un écosystème professionnel intégré, capable de mobiliser les ressources, renforcer les compétences et incuber les projets qui feront notre souveraineté alimentaire.
              </p>
              <Link
                href="/qui-sommes-nous"
                className="inline-flex items-center gap-3 text-white bg-[#1a1a1a] font-heading font-[700] text-[14px] px-8 py-4 rounded-full group hover:bg-[#1b5e38] hover:shadow-[0_8px_30px_rgba(27,94,56,0.3)] transition-all duration-300"
              >
                Découvrir notre histoire
                <span className="transition-transform duration-300 group-hover:translate-x-1">
                  <IconArrowRight />
                </span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── LES 4 FREINS ─────────────────────────── */}
      <section className="bg-white py-[60px] md:py-[100px] relative">
        <div className="max-w-[1100px] mx-auto px-6">
          <div className="text-center max-w-[700px] mx-auto mb-20">
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-[#fcb726]/10 text-[#d9970c] font-heading font-[700] text-[11px] tracking-[0.15em] uppercase mb-6">
              Constat
            </div>
            <h2 className="font-heading font-[800] text-[32px] md:text-[44px] text-[#1a1a1a] leading-[1.15] mb-6">
              L'agriculture africaine face à 4 freins majeurs
            </h2>
            <p className="font-sans text-[16px] text-[#666] leading-[1.7]">
              agrolide a été fondé pour briser ces quatre barrières simultanément et débloquer le potentiel de notre continent.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              { num: "01", title: "Isolement professionnel", desc: "Peu de réseaux solides permettent aux agronomes et praticiens d'échanger et de collaborer efficacement sur le continent." },
              { num: "02", title: "Documentation inadaptée", desc: "La quasi-totalité des ressources techniques ignore les réalités climatiques et pédologiques africaines." },
              { num: "03", title: "Déficit d'accompagnement", desc: "Trop d'agripreneurs avancent sans mentorat, sans accès aux marchés et sans financement structuré." },
              { num: "04", title: "Recherche sous-valorisée", desc: "Des milliers de thèses africaines restent inaccessibles et non appliquées sur le terrain." },
            ].map((f) => (
              <div key={f.num} className="group relative bg-white rounded-2xl p-10 border border-[#f0f0f0] shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_40px_rgba(27,94,56,0.08)] hover:-translate-y-2 transition-all duration-300 overflow-hidden">
                <div className="absolute -right-4 -top-8 font-heading font-[800] text-[120px] text-[#f8f8f8] group-hover:text-[#f0f7f0] transition-colors duration-300 z-0 select-none pointer-events-none">
                  {f.num}
                </div>
                <div className="relative z-10">
                  <div className="w-12 h-12 bg-[#f0f7f0] group-hover:bg-[#1b5e38] rounded-xl flex items-center justify-center text-[#1b5e38] group-hover:text-white transition-colors duration-300 mb-6 font-heading font-[800] text-[16px]">
                    {f.num}
                  </div>
                  <h3 className="font-heading font-[800] text-[20px] text-[#1a1a1a] mb-4">{f.title}</h3>
                  <p className="font-sans text-[15px] text-[#666] leading-[1.7]">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 3 DOMAINES ───────────────────────────── */}
      <section id="actions" className="bg-gradient-to-br from-[#1b5e38] to-[#124026] py-[60px] md:py-[100px] text-white">
        <div className="max-w-[1100px] mx-auto px-6">
          <div className="mb-20 flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="max-w-[600px]">
              <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/10 text-[#fcb726] font-heading font-[700] text-[11px] tracking-[0.15em] uppercase mb-6">
                <span className="w-2 h-2 rounded-full bg-[#fcb726]" />
                Notre approche
              </div>
              <h2 className="font-heading font-[800] text-[32px] md:text-[44px] leading-[1.15]">
                Un écosystème intégré en 3 piliers d'action
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: <IconNetwork />,
                num: "01",
                title: "Mobilisation & Réseautage",
                desc: "Un annuaire exclusif pour fédérer les compétences, connecter les pairs et développer des synergies panafricaines.",
                link: "/annuaire",
                color: "group-hover:border-[#fcb726]"
              },
              {
                icon: <IconGraduation />,
                num: "02",
                title: "Formation & Insertion",
                desc: "Des programmes de renforcement de capacités techniques et managériales, ancrés dans les réalités du terrain africain.",
                link: "/formations",
                color: "group-hover:border-[#fcb726]"
              },
              {
                icon: <IconBriefcase />,
                num: "03",
                title: "Agrobusiness & Consulting",
                desc: "Un accompagnement stratégique pour structurer vos projets, accéder aux financements et conquérir les marchés.",
                link: "/agrobusiness",
                color: "group-hover:border-[#fcb726]"
              },
            ].map((d) => (
              <Link
                href={d.link}
                key={d.num}
                className={`group block bg-white/5 border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all duration-300 ${d.color} hover:-translate-y-1`}
              >
                <div className="w-14 h-14 bg-white/10 rounded-full flex items-center justify-center text-white mb-8 group-hover:scale-110 transition-transform duration-300 group-hover:bg-[#fcb726] group-hover:text-[#1a1a1a]">
                  {d.icon}
                </div>
                <div className="font-heading font-[800] text-[12px] text-white/50 tracking-[0.1em] mb-3">{d.num}</div>
                <h3 className="font-heading font-[800] text-[22px] text-white mb-4 group-hover:text-[#fcb726] transition-colors">
                  {d.title}
                </h3>
                <p className="font-sans text-[15px] text-white/70 leading-[1.7] mb-8">
                  {d.desc}
                </p>
                <div className="flex items-center gap-2 text-white font-heading font-[700] text-[13px] opacity-70 group-hover:opacity-100 group-hover:translate-x-2 transition-all duration-300">
                  Découvrir <IconArrowRight />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── TÉMOIGNAGES ──────────────────────────── */}
      <section className="bg-gradient-to-b from-white to-[#f8f8f6] py-[60px] md:py-[100px]">
        <div className="max-w-[1100px] mx-auto px-6">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-[#1b5e38]/10 text-[#1b5e38] font-heading font-[700] text-[11px] tracking-[0.15em] uppercase mb-6">
              <span className="w-2 h-2 rounded-full bg-[#1b5e38]" />
              Impact
            </div>
            <h2 className="font-heading font-[800] text-[32px] md:text-[44px] text-[#1a1a1a] leading-[1.15]">
              La voix du réseau
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { initials: "KA", name: "Kouamé A.", role: "Agronome", country: "Côte d'Ivoire", delay: "md:mt-0" },
              { initials: "FD", name: "Fatou D.",  role: "Chercheuse", country: "Sénégal", delay: "md:mt-12" },
              { initials: "EM", name: "Emmanuel M.", role: "Agripreneur", country: "Cameroun", delay: "md:mt-24" },
            ].map((t) => (
              <div key={t.initials} className={`bg-white rounded-2xl p-8 border border-[#eaeaea] shadow-[0_10px_30px_rgba(0,0,0,0.02)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.06)] transition-shadow duration-300 ${t.delay}`}>
                <div className="text-[#fcb726] mb-6">
                  <IconQuote />
                </div>
                <p className="font-sans italic text-[16px] text-[#444] leading-[1.8] mb-8">
                  "agrolide m'a permis de structurer mon approche et de trouver des partenaires solides. L'accès aux ressources adaptées à notre continent change véritablement la donne."
                </p>
                <div className="flex items-center gap-4 pt-6 border-t border-[#f0f0f0]">
                  <div className="w-[44px] h-[44px] rounded-full bg-gradient-to-br from-[#1b5e38] to-[#124026] text-white flex items-center justify-center font-heading font-[700] text-[14px] shadow-[0_4px_10px_rgba(27,94,56,0.3)]">
                    {t.initials}
                  </div>
                  <div>
                    <div className="font-heading font-[700] text-[15px] text-[#1a1a1a]">{t.name}</div>
                    <div className="font-sans text-[13px] text-[#888]">{t.role} · {t.country}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BLOG ─────────────────────────────────── */}
      <section className="bg-white py-[60px] md:py-[100px]">
        <div className="max-w-[1100px] mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div>
              <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-[#1b5e38]/10 text-[#1b5e38] font-heading font-[700] text-[11px] tracking-[0.15em] uppercase mb-6">
                <span className="w-2 h-2 rounded-full bg-[#1b5e38]" />
                Ressources
              </div>
              <h2 className="font-heading font-[800] text-[32px] md:text-[44px] text-[#1a1a1a] leading-[1.15]">
                Derniers articles
              </h2>
            </div>
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-white bg-[#1b5e38] font-heading font-[600] text-[14px] px-6 py-3 rounded-full group hover:bg-[#124026] hover:shadow-lg transition-all duration-300 flex-shrink-0"
            >
              Tous les articles
              <span className="transition-transform duration-300 group-hover:translate-x-1"><IconArrowRight /></span>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((item) => (
              <div key={item} className="group cursor-pointer">
                <div className="relative h-[220px] bg-[#f4f4f4] rounded-2xl mb-6 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent -translate-x-full group-hover:translate-x-[200%] transition-transform duration-1000 ease-in-out" />
                  <div className="absolute top-4 left-4 bg-white/80 backdrop-blur-sm px-3 py-1 rounded-full font-heading font-[700] text-[10px] text-[#1b5e38] tracking-[0.1em] uppercase shadow-sm">
                    Bientôt disponible
                  </div>
                </div>
                <h3 className="font-heading font-[800] text-[20px] text-[#1a1a1a] mb-3 leading-[1.4] group-hover:text-[#1b5e38] transition-colors">
                  Articles en cours de préparation pour la communauté
                </h3>
                <p className="font-sans text-[15px] text-[#666] leading-[1.7] mb-4">
                  Notre équipe éditoriale prépare une série de contenus techniques de haute valeur pour les acteurs de la chaîne agricole.
                </p>
                <div className="font-sans text-[13px] font-[600] text-[#fcb726]">
                  À venir très prochainement
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA FINAL ────────────────────────────── */}
      <section className="relative overflow-hidden py-[80px] md:py-[120px] bg-[#1a1a1a]">
        {/* Dynamic Abstract Background */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[140%] bg-[#1b5e38]/20 rounded-full blur-[120px] pointer-events-none" />
          <div className="absolute bottom-[-20%] right-[-10%] w-[40%] h-[120%] bg-[#fcb726]/10 rounded-full blur-[100px] pointer-events-none" />
        </div>

        <div className="max-w-[800px] mx-auto px-6 relative z-10 text-center">
          <div className="inline-block px-4 py-2 rounded-full border border-white/10 text-[#fcb726] font-heading font-[700] text-[11px] tracking-[0.2em] uppercase mb-8">
            Rejoindre le réseau
          </div>
          <h2 className="font-heading font-[800] text-[36px] md:text-[56px] text-white leading-[1.1] tracking-[-0.02em] mb-8">
            Prêt à participer à la conquête de la souveraineté alimentaire ?
          </h2>
          <p className="font-sans text-[16px] md:text-[18px] text-[rgba(255,255,255,0.7)] mb-12 leading-[1.7]">
            Annuaire · Formations · Agrobusiness · Bibliothèque · Événements
          </p>
          <Link
            href="/rejoindre"
            className="inline-flex items-center gap-3 bg-[#fcb726] text-[#1a1a1a] font-heading font-[800] text-[16px] px-[40px] py-[18px] rounded-full hover:bg-white hover:shadow-[0_0_40px_rgba(252,183,38,0.4)] transition-all duration-300 hover:-translate-y-1"
          >
            Rejoindre le réseau maintenant
            <IconArrowRight />
          </Link>
        </div>
      </section>

    </div>
  )
}
