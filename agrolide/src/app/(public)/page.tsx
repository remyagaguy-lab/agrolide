import Link from "next/link"

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
        {/* Ligne accent dorée verticale */}
        <div className="absolute left-0 top-0 h-full w-[3px] bg-[#fcb726]" />

        <div className="max-w-[1100px] mx-auto px-6 pt-[80px] pb-0 md:pt-[120px]">
          <div className="max-w-[700px]">
            <p className="text-[10px] font-[700] tracking-[0.22em] text-[rgba(255,255,255,0.45)] uppercase mb-8">
              Réseau professionnel · Agriculture africaine
            </p>
            <h1 className="font-heading font-[800] text-[40px] md:text-[64px] text-white leading-[1.08] tracking-[-0.03em] mb-8">
              Fédérer la chaîne agricole,{" "}
              <br className="hidden md:block" />
              pour conquérir la{" "}
              <span className="text-[#fcb726]">souveraineté alimentaire</span>
            </h1>
            <p className="font-sans text-[16px] text-[rgba(255,255,255,0.62)] max-w-[480px] leading-[1.8] mb-10">
              Le réseau continental des acteurs de l'agriculture africaine — agronomes, chercheurs, agripreneurs, partenaires institutionnels.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/rejoindre"
                className="bg-white text-[#1b5e38] font-heading font-[700] px-[28px] py-[13px] text-[14px] hover:bg-[#f0f7f0] transition-colors"
              >
                Rejoindre le réseau
              </Link>
              <Link
                href="#actions"
                className="border border-[rgba(255,255,255,0.28)] text-white font-heading font-[600] px-[28px] py-[13px] text-[14px] hover:bg-white/8 transition-colors"
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
                <div className="font-heading font-[800] text-[20px] text-white leading-none mb-1">12 pays</div>
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
                <div className="font-heading font-[800] text-[20px] text-white leading-none mb-1">80+ ressources</div>
                <div className="text-[10px] text-[rgba(255,255,255,0.4)] uppercase tracking-[0.15em]">Techniques</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS ÉDITORIALES ────────────────────── */}
      <section className="bg-white border-b border-[#e8e8e4]">
        <div className="max-w-[1100px] mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-[#e8e8e4]">
            {[
              { val: "500+", label: "Membres actifs" },
              { val: "12",   label: "Pays couverts" },
              { val: "80+",  label: "Documents" },
              { val: "15",   label: "Formations" },
            ].map((s) => (
              <div key={s.label} className="py-10 flex flex-col items-center justify-center text-center px-4">
                <div className="font-heading font-[800] text-[44px] leading-none text-[#1b5e38]">{s.val}</div>
                <div className="font-heading font-[500] text-[10px] text-[#aaa] uppercase tracking-[0.12em] mt-2">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── RAISON D'ÊTRE ────────────────────────── */}
      <section className="bg-[#f8f8f6] py-[80px] md:py-[120px]">
        <div className="max-w-[1100px] mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-16 items-start">
            {/* Colonne gauche — étiquette + accroches */}
            <div className="md:col-span-4">
              <div className="text-[10px] font-[700] text-[#1b5e38] tracking-[0.2em] uppercase mb-4">Notre raison d'être</div>
              <div className="w-8 h-[2px] bg-[#fcb726]" />
            </div>
            {/* Colonne droite — contenu éditorial */}
            <div className="md:col-span-8">
              <h2 className="font-heading font-[800] text-[32px] md:text-[42px] text-[#1a1a1a] leading-[1.15] tracking-[-0.02em] mb-8">
                Transformer la fragmentation en cohésion continentale.
              </h2>
              <p className="font-sans text-[16px] text-[#666] leading-[1.85] mb-5">
                L'agriculture représente jusqu'à 40 % du PIB africain et emploie la majorité de notre population active. Pourtant, les acteurs de la chaîne de valeur évoluent souvent de manière fragmentée, sans cadre de collaboration pérenne.
              </p>
              <p className="font-sans text-[16px] text-[#666] leading-[1.85] mb-10">
                agrolide est né d'une ambition collective : doter l'Afrique d'un écosystème professionnel intégré, capable de mobiliser les ressources, renforcer les compétences et incuber les projets qui feront notre souveraineté alimentaire.
              </p>
              <Link
                href="/qui-sommes-nous"
                className="inline-flex items-center gap-2 text-[#1b5e38] font-heading font-[700] text-[14px] group"
              >
                Découvrir notre histoire
                <span className="transition-transform group-hover:translate-x-1">
                  <IconArrowRight />
                </span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── LES 4 FREINS ─────────────────────────── */}
      <section className="bg-white py-[80px] md:py-[120px]">
        <div className="max-w-[1100px] mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-16 mb-16">
            <div className="md:col-span-4">
              <div className="text-[10px] font-[700] text-[#1b5e38] tracking-[0.2em] uppercase mb-4">Constat</div>
              <div className="w-8 h-[2px] bg-[#fcb726] mb-6" />
              <h2 className="font-heading font-[800] text-[28px] md:text-[36px] text-[#1a1a1a] leading-[1.2]">
                L'agriculture africaine face à 4 freins
              </h2>
            </div>
            <div className="md:col-span-8 flex flex-col divide-y divide-[#e8e8e4]">
              {[
                { num: "01", title: "Isolement professionnel", desc: "Peu de réseaux solides permettent aux agronomes et praticiens d'échanger et de collaborer efficacement sur le continent." },
                { num: "02", title: "Documentation inadaptée", desc: "La quasi-totalité des ressources techniques ignore les réalités climatiques et pédologiques africaines." },
                { num: "03", title: "Déficit d'accompagnement", desc: "Trop d'agripreneurs avancent sans mentorat, sans accès aux marchés et sans financement structuré." },
                { num: "04", title: "Recherche sous-valorisée", desc: "Des milliers de thèses africaines restent inaccessibles et non appliquées sur le terrain." },
              ].map((f) => (
                <div key={f.num} className="py-8 flex gap-8">
                  <div className="font-heading font-[700] text-[11px] text-[#ccc] tracking-[0.08em] pt-1 min-w-[28px]">
                    {f.num}
                  </div>
                  <div>
                    <h3 className="font-heading font-[700] text-[17px] text-[#1a1a1a] mb-2">{f.title}</h3>
                    <p className="font-sans text-[14px] text-[#777] leading-[1.7]">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-[#e8e8e4] pt-8">
            <p className="font-heading font-[700] text-[17px] text-[#1b5e38]">
              agrolide a été fondé pour briser ces quatre freins simultanément.
            </p>
          </div>
        </div>
      </section>

      {/* ── 3 DOMAINES ───────────────────────────── */}
      <section id="actions" className="bg-[#f8f8f6] py-[80px] md:py-[120px]">
        <div className="max-w-[1100px] mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-16 mb-12">
            <div className="md:col-span-4">
              <div className="text-[10px] font-[700] text-[#1b5e38] tracking-[0.2em] uppercase mb-4">Notre approche</div>
              <div className="w-8 h-[2px] bg-[#fcb726] mb-6" />
              <h2 className="font-heading font-[800] text-[28px] md:text-[36px] text-[#1a1a1a] leading-[1.2]">
                Un écosystème intégré en 3 domaines
              </h2>
            </div>
            <div className="md:col-span-8 flex flex-col divide-y divide-[#ddd]">
              {[
                {
                  icon: <IconNetwork className="text-[#1b5e38]" />,
                  num: "01",
                  title: "Mobilisation & Réseautage",
                  desc: "Un annuaire exclusif pour fédérer les compétences, connecter les pairs et développer des synergies panafricaines.",
                  link: "/annuaire",
                },
                {
                  icon: <IconGraduation className="text-[#1b5e38]" />,
                  num: "02",
                  title: "Formation & Insertion",
                  desc: "Des programmes de renforcement de capacités techniques et managériales, ancrés dans les réalités du terrain africain.",
                  link: "/formations",
                },
                {
                  icon: <IconBriefcase className="text-[#1b5e38]" />,
                  num: "03",
                  title: "Agrobusiness & Consulting",
                  desc: "Un accompagnement stratégique pour structurer vos projets, accéder aux financements et conquérir les marchés.",
                  link: "/agrobusiness",
                },
              ].map((d) => (
                <Link
                  href={d.link}
                  key={d.num}
                  className="py-8 flex items-start gap-6 group"
                >
                  <div className="mt-1 flex-shrink-0 opacity-60 group-hover:opacity-100 transition-opacity">
                    {d.icon}
                  </div>
                  <div className="flex-1">
                    <div className="font-heading font-[800] text-[11px] text-[#bbb] tracking-[0.1em] mb-2">{d.num}</div>
                    <h3 className="font-heading font-[700] text-[19px] text-[#1a1a1a] mb-2 group-hover:text-[#1b5e38] transition-colors">
                      {d.title}
                    </h3>
                    <p className="font-sans text-[14px] text-[#777] leading-[1.7] max-w-[500px]">{d.desc}</p>
                  </div>
                  <div className="hidden md:flex items-center gap-1 text-[#1b5e38] font-heading font-[600] text-[13px] pt-1 opacity-0 group-hover:opacity-100 translate-x-[-8px] group-hover:translate-x-0 transition-all flex-shrink-0">
                    Découvrir <IconArrowRight />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── TÉMOIGNAGES ──────────────────────────── */}
      <section className="bg-white py-[80px] md:py-[120px]">
        <div className="max-w-[1100px] mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-16 mb-16">
            <div className="md:col-span-4">
              <div className="text-[10px] font-[700] text-[#1b5e38] tracking-[0.2em] uppercase mb-4">Impact</div>
              <div className="w-8 h-[2px] bg-[#fcb726] mb-6" />
              <h2 className="font-heading font-[800] text-[28px] md:text-[36px] text-[#1a1a1a] leading-[1.2]">
                La voix du réseau
              </h2>
            </div>
            <div className="md:col-span-8 grid grid-cols-1 gap-0 divide-y divide-[#e8e8e4]">
              {[
                { initials: "KA", name: "Kouamé A.", role: "Agronome", country: "Côte d'Ivoire" },
                { initials: "FD", name: "Fatou D.",  role: "Chercheuse", country: "Sénégal" },
                { initials: "EM", name: "Emmanuel M.", role: "Agripreneur", country: "Cameroun" },
              ].map((t) => (
                <div key={t.initials} className="py-8 flex gap-6">
                  <div className="text-[#e0ede4] flex-shrink-0 mt-1">
                    <IconQuote />
                  </div>
                  <div>
                    <p className="font-sans italic text-[15px] text-[#444] leading-[1.85] mb-5">
                      agrolide m'a permis de structurer mon approche et de trouver des partenaires solides. L'accès aux ressources adaptées à notre continent change véritablement la donne pour les acteurs de terrain.
                    </p>
                    <div className="flex items-center gap-3">
                      <div className="w-[36px] h-[36px] bg-[#e8f5e9] text-[#1b5e38] flex items-center justify-center font-heading font-[700] text-[12px]">
                        {t.initials}
                      </div>
                      <div>
                        <div className="font-heading font-[600] text-[14px] text-[#1a1a1a]">{t.name}</div>
                        <div className="font-sans text-[12px] text-[#999]">{t.role} · {t.country}</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── BLOG ─────────────────────────────────── */}
      <section className="bg-[#f8f8f6] py-[80px] md:py-[120px]">
        <div className="max-w-[1100px] mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div>
              <div className="text-[10px] font-[700] text-[#1b5e38] tracking-[0.2em] uppercase mb-4">Ressources</div>
              <div className="w-8 h-[2px] bg-[#fcb726] mb-6" />
              <h2 className="font-heading font-[800] text-[28px] md:text-[36px] text-[#1a1a1a] leading-[1.2]">
                Derniers articles
              </h2>
            </div>
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-[#1b5e38] font-heading font-[600] text-[14px] group flex-shrink-0"
            >
              Tous les articles
              <span className="transition-transform group-hover:translate-x-1"><IconArrowRight /></span>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-[1px] bg-[#e8e8e4]">
            {[1, 2, 3].map((item) => (
              <div key={item} className="bg-[#f8f8f6] p-[28px] flex flex-col opacity-50">
                <div className="h-[160px] bg-[#e8e8e4] w-full mb-6" />
                <div className="text-[10px] font-[700] text-[#1b5e38] tracking-[0.15em] uppercase mb-3">
                  Bientôt disponible
                </div>
                <h3 className="font-heading font-[700] text-[16px] text-[#1a1a1a] mb-3 leading-snug">
                  Articles en cours de préparation
                </h3>
                <p className="font-sans text-[13px] text-[#888] leading-[1.6] flex-1">
                  Notre équipe éditoriale prépare une série de contenus techniques pour les acteurs de la chaîne agricole.
                </p>
                <div className="border-t border-[#e8e8e4] pt-4 mt-5 font-sans text-[11px] text-[#bbb]">
                  À venir
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA FINAL ────────────────────────────── */}
      <section className="bg-[#1b5e38] relative overflow-hidden py-[100px]">
        <div className="absolute left-0 top-0 h-full w-[3px] bg-[#fcb726]" />
        <div className="max-w-[1100px] mx-auto px-6">
          <div className="max-w-[600px]">
            <p className="text-[10px] font-[700] tracking-[0.22em] text-[rgba(255,255,255,0.4)] uppercase mb-6">
              Rejoindre le réseau
            </p>
            <h2 className="font-heading font-[800] text-[32px] md:text-[46px] text-white leading-[1.1] tracking-[-0.02em] mb-6">
              Prêt à participer à la conquête de la souveraineté alimentaire ?
            </h2>
            <p className="font-sans text-[15px] text-[rgba(255,255,255,0.55)] mb-10 leading-[1.7]">
              Annuaire · Formations · Agrobusiness · Bibliothèque · Événements
            </p>
            <Link
              href="/rejoindre"
              className="inline-block bg-[#fcb726] text-[#1a1a1a] font-heading font-[800] text-[15px] px-[36px] py-[15px] hover:bg-[#f99e1d] transition-colors"
            >
              Rejoindre le réseau
            </Link>
          </div>
        </div>
      </section>

    </div>
  )
}
