"use client"
import * as React from "react"
import Link from "next/link"
import Image from "next/image"

function IconLinkedIn() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
      <rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/>
    </svg>
  )
}

function IconFacebook() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
    </svg>
  )
}

function IconWhatsApp() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
    </svg>
  )
}

function IconInstagram() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
    </svg>
  )
}

function IconTiktok() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 15.68a6.34 6.34 0 0 0 6.26 6.32 6.32 6.32 0 0 0 6.26-6.32V8.9a8.27 8.27 0 0 0 4 1V6.62a5 5 0 0 1-1.93-.33z"/>
    </svg>
  )
}

function IconYoutube() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/>
      <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="#0d3520"/>
    </svg>
  )
}

function IconMapPin() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>
    </svg>
  )
}

function IconMail() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
    </svg>
  )
}

function IconPhone() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.41 2 2 0 0 1 3.6 1.27h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.91a16 16 0 0 0 6 6l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
    </svg>
  )
}

function IconArrowRight() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
    </svg>
  )
}

export function Footer() {
  return (
    <>
      {/* ── CTA PRÉ-FOOTER ── */}
      <div className="bg-[#f7f8f3] py-16 px-6">
        <div className="max-w-[860px] mx-auto">
          <div
            className="relative rounded-3xl overflow-hidden px-8 py-14 md:px-16 text-center"
            style={{ background: "linear-gradient(135deg, #1b5e38 0%, #1e7042 40%, #2d5a1b 70%, #1a4a2e 100%)" }}
          >
            <div className="absolute top-[-60px] left-[-60px] w-[280px] h-[280px] rounded-full opacity-30 pointer-events-none"
              style={{ background: "radial-gradient(circle, #fcb726 0%, transparent 70%)" }} />
            <div className="absolute bottom-[-80px] right-[-40px] w-[320px] h-[320px] rounded-full opacity-20 pointer-events-none"
              style={{ background: "radial-gradient(circle, #4ade80 0%, transparent 70%)" }} />
            <div className="relative z-10">
              <span className="inline-block border border-white/20 text-white/80 font-heading font-[600] text-[11px] tracking-[0.2em] uppercase px-4 py-1.5 rounded-full mb-6">
                Rejoindre le réseau
              </span>
              <h2 className="font-heading font-[800] text-[28px] md:text-[42px] text-white leading-[1.2] tracking-[-0.02em] mb-4">
                Rejoignez des professionnels qui<br className="hidden md:block" /> bâtissent l'agriculture africaine
              </h2>
              <p className="font-sans text-[15px] text-white/60 mb-10 max-w-[500px] mx-auto leading-[1.7]">
                Accédez à l'annuaire, aux formations, aux ressources et à la communauté agrolide dès aujourd'hui.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 max-w-[480px] mx-auto">
                <div className="flex-1 flex items-center gap-3 bg-white/10 border border-white/20 rounded-xl px-4 py-3 backdrop-blur-sm">
                  <IconMail />
                  <input
                    type="email"
                    placeholder="Votre adresse email"
                    className="bg-transparent text-white placeholder-white/40 font-sans text-[14px] flex-1 outline-none"
                  />
                </div>
                <Link
                  href="/rejoindre"
                  className="inline-flex items-center justify-center gap-2 bg-[#fcb726] text-[#1a1a1a] font-heading font-[700] text-[14px] px-6 py-3 rounded-xl hover:bg-white transition-colors whitespace-nowrap"
                >
                  Nous rejoindre <IconArrowRight />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── FOOTER 4 COLONNES ── */}
      <footer
        className="relative overflow-hidden pt-[60px] pb-[36px]"
        style={{ background: "linear-gradient(160deg, #0d3520 0%, #0f2d1a 35%, #091a0f 70%, #060f08 100%)" }}
      >
        {/* Glows */}
        <div className="absolute top-0 left-[-10%] w-[500px] h-[400px] rounded-full opacity-25 pointer-events-none"
          style={{ background: "radial-gradient(circle, #1b5e38 0%, transparent 65%)" }} />
        <div className="absolute bottom-0 right-[-5%] w-[400px] h-[350px] rounded-full opacity-15 pointer-events-none"
          style={{ background: "radial-gradient(circle, #fcb726 0%, transparent 65%)" }} />

        <div className="max-w-[1100px] mx-auto px-6 relative z-10">

          {/* Grille 4 colonnes */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-10 mb-14 items-start">

            {/* ── Col 1 : Marque ── */}
            <div className="flex flex-col gap-4 items-start">
              {/* PNG 6250×6250 carré : logo à 40%-58.7% en hauteur.
                  marginTop:-88px remonte l'image pour afficher le logo en y=0. */}
              <div className="overflow-hidden" style={{ height: '60px', marginBottom: '-10px' }}>
                <div style={{ marginTop: '-88px', marginLeft: '-29px' }}>
                  <Image
                    src="/agrolide-png.png"
                    alt="agrolide"
                    width={220}
                    height={220}
                    sizes="220px"
                    style={{ width: '220px', height: '220px', display: 'block' }}
                    className="brightness-0 invert"
                  />
                </div>
              </div>

              <p className="font-sans text-[14px] leading-[1.75] text-white/40 max-w-[220px]">
                Fédérer la chaîne agricole africaine pour conquérir la souveraineté alimentaire.
              </p>

              {/* Réseaux sociaux */}
              <div className="flex items-center gap-2 flex-wrap">
                {[
                  { href: "https://www.linkedin.com/company/réseau-bifera", icon: <IconLinkedIn />, label: "LinkedIn" },
                  { href: "https://www.facebook.com/bibliotheque.ifera", icon: <IconFacebook />, label: "Facebook" },
                  { href: "https://www.instagram.com/bibliotheque.ifera", icon: <IconInstagram />, label: "Instagram" },
                  { href: "https://tiktok.com/@rseau.bifera", icon: <IconTiktok />, label: "TikTok" },
                  { href: "https://youtube.com/@agrolide", icon: <IconYoutube />, label: "YouTube" },
                ].map((s) => (
                  <Link
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:bg-[#fcb726]/10 hover:text-[#fcb726] hover:border-[#fcb726]/30 transition-all duration-200"
                  >
                    {s.icon}
                  </Link>
                ))}
              </div>
            </div>

            {/* ── Col 2 : À propos ── */}
            <div className="flex flex-col gap-3">
              <h4 className="font-heading font-[700] text-[11px] text-white/60 uppercase tracking-[0.18em] mb-3">
                À propos de nous
              </h4>
              {[
                { href: "/qui-sommes-nous",         label: "Notre histoire" },
                { href: "/#actions",                label: "Nos activités" },
                { href: "/qui-sommes-nous#equipe",  label: "Notre équipe" },
                { href: "mailto:contact@agrolide.org", label: "Contactez-nous" },
              ].map((l) => (
                <Link key={l.href} href={l.href}
                  className="font-sans text-[14px] text-white/40 hover:text-white transition-colors"
                >
                  {l.label}
                </Link>
              ))}
            </div>

            {/* ── Col 3 : Navigation ── */}
            <div className="flex flex-col gap-3">
              <h4 className="font-heading font-[700] text-[11px] text-white/60 uppercase tracking-[0.18em] mb-3">
                Navigation
              </h4>
              {[
                { href: "/",             label: "Accueil" },
                { href: "/annuaire",     label: "Annuaire" },
                { href: "/blog",         label: "Blog" },
                { href: "/bibliotheque", label: "Bibliothèque" },
              ].map((l) => (
                <Link key={l.href} href={l.href}
                  className="font-sans text-[14px] text-white/40 hover:text-white transition-colors"
                >
                  {l.label}
                </Link>
              ))}
            </div>

            {/* ── Col 4 : Contact ── */}
            <div className="flex flex-col gap-3">
              <h4 className="font-heading font-[700] text-[11px] text-white/60 uppercase tracking-[0.18em] mb-3">
                Contact
              </h4>

              <div className="flex items-start gap-2 text-white/40">
                <span className="mt-0.5 flex-shrink-0"><IconMapPin /></span>
                <span className="font-sans text-[14px] leading-snug">Lomé, Togo</span>
              </div>

              <div className="flex items-start gap-2 text-white/40">
                <span className="mt-0.5 flex-shrink-0"><IconPhone /></span>
                <a href="tel:+22891016724" className="font-sans text-[14px] hover:text-white transition-colors">
                  +228 91 01 67 24
                </a>
              </div>

              <div className="flex items-start gap-2 text-white/40">
                <span className="mt-0.5 flex-shrink-0"><IconMail /></span>
                <a href="mailto:contact@agrolide.org"
                  className="font-sans text-[14px] hover:text-white transition-colors break-all"
                >
                  contact@agrolide.org
                </a>
              </div>

              {/* Bouton WhatsApp */}
              <Link
                href="https://whatsapp.com/channel/0029VbBd42p8V0tgiDJwzU2T"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex items-center gap-2 bg-[#25D366]/10 border border-[#25D366]/25 text-[#25D366] font-heading font-[600] text-[13px] px-4 py-2.5 rounded-lg hover:bg-[#25D366]/20 transition-colors w-fit"
              >
                <IconWhatsApp />
                Rejoindre la chaîne WhatsApp
              </Link>
            </div>
          </div>

          {/* Séparateur dégradé */}
          <div className="h-px mb-8"
            style={{ background: "linear-gradient(to right, transparent, rgba(255,255,255,0.08) 30%, rgba(255,255,255,0.08) 70%, transparent)" }}
          />

          {/* Bas de footer */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="font-sans text-[12px] text-white/20">
              © 2025 agrolide. Tous droits réservés.
            </p>
            <div className="flex gap-6">
              <Link href="/mentions-legales" className="font-sans text-[12px] text-white/20 hover:text-white/50 transition-colors">
                Mentions légales
              </Link>
              <Link href="/confidentialite" className="font-sans text-[12px] text-white/20 hover:text-white/50 transition-colors">
                Confidentialité
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </>
  )
}
