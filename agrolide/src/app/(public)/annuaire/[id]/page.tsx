import React from 'react'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { MapPin, Briefcase, MessageCircle, ExternalLink, Globe, FileText, ArrowLeft, Lock } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/EmptyState'
import { Metadata } from 'next'
import { db } from '@/db'
import { users, documents } from '@/db/schema'
import { eq, and, desc } from 'drizzle-orm'
import ConnectButton from '@/components/modules/annuaire/ConnectButton'
import { auth } from '@/lib/auth/server'
import { user_connections } from '@/db/schema'

function parseSafeArray(val: string | null | any): string[] {
  if (!val) return [];
  if (Array.isArray(val)) return val;
  if (typeof val !== 'string') return [];
  const trimmed = val.trim();
  if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
    try {
      const parsed = JSON.parse(trimmed);
      if (Array.isArray(parsed)) return parsed;
    } catch (e) {
      // fallback
    }
  }
  return trimmed.split(',').map(s => s.trim()).filter(Boolean);
}

/** N'accepte que des liens http(s) : un `javascript:` stocké en base ne devient jamais un lien actif. */
function safeExternalUrl(raw: string | null | undefined): string | null {
  if (!raw) return null
  try {
    const url = new URL(raw.trim())
    return url.protocol === 'https:' || url.protocol === 'http:' ? url.toString() : null
  } catch {
    return null
  }
}

// Fiche réservée aux membres connectés : aucune donnée de profil n'est lue ni affichée pour un visiteur,
// et le titre de la page ne révèle pas le nom (pas d'énumération, pas d'indexation).
export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Profil membre | Agrolide',
    robots: { index: false, follow: false },
  }
}

export default async function FicheProfilPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const { userId } = await auth();

  if (!userId) {
    return (
      <div className="container max-w-2xl py-16 md:py-24">
        <EmptyState
          icon={<Lock />}
          title="Ce profil est réservé aux membres"
          description="Connectez-vous pour consulter les profils du réseau agrolide, vous connecter aux autres membres et échanger avec eux."
          action={
            <div className="flex flex-wrap justify-center gap-3">
              <Button variant="secondary" href={`/login?next=${encodeURIComponent(`/annuaire/${id}`)}`}>
                Se connecter
              </Button>
              <Button variant="outline" href="/inscription">
                Rejoindre le réseau
              </Button>
            </div>
          }
        />
      </div>
    )
  }

  // Fetch du profil
  const member = await db.select().from(users).where(eq(users.id, id)).limit(1).then(r => r[0])

  if (!member) notFound()

  // Un membre qui a quitté l'annuaire n'est consultable que par lui-même.
  if (member.annuaire_visible === false && userId !== id) notFound()

  // Fetch connection status
  let connectionStatus: 'accepted' | 'pending_sent' | 'pending_received' | null = null;
  if (userId && userId !== id) {
    const conn = await db.query.user_connections.findFirst({
      where: (connections, { or, and, eq }) => 
        or(
          and(eq(connections.requester_id, userId), eq(connections.receiver_id, id)),
          and(eq(connections.receiver_id, userId), eq(connections.requester_id, id))
        )
    });
    if (conn) {
      if (conn.status === 'accepted') connectionStatus = 'accepted';
      else if (conn.status === 'pending') {
        connectionStatus = conn.requester_id === userId ? 'pending_sent' : 'pending_received';
      }
    }
  }

  // Fetch de ses contributions à la bibliothèque
  const docs = await db.select({
    id: documents.id,
    titre: documents.titre,
    type_doc: documents.type_doc
  })
  .from(documents)
  .where(and(
    eq(documents.depose_par, id),
    eq(documents.statut, 'publie')
  ))
  .orderBy(desc(documents.created_at))
  .limit(5)

  // Déterminer la couleur du badge
  const getBadgeClass = (cat: string) => {
    switch(cat?.toLowerCase()) {
      case 'senior': return 'bg-info-container text-on-info-container border-info/40'
      case 'professionnel': return 'bg-info-container text-info border-info/30'
      case 'partenaire': return 'bg-warning-container text-on-warning-container border-warning/40'
      case 'junior': return 'bg-success-container text-success border-success/30'
      default: return 'bg-surface-container text-on-surface-variant border-outline-variant'
    }
  }

  const displayName = `${member.prenom} ${member.nom}`
  const sectors = parseSafeArray(member.secteurs_expertise)
  const languages = parseSafeArray(member.langues)
  const linkedinUrl = safeExternalUrl(member.linkedin_url)
  const siteWebUrl = safeExternalUrl(member.site_web_url)

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      <Link href="/membres/annuaire" className="inline-flex items-center gap-2 text-sm font-medium text-on-surface-muted hover:text-on-surface transition-colors">
        <ArrowLeft className="w-4 h-4" /> Retour à l'annuaire
      </Link>

      <div className="bg-surface-container-lowest rounded-3xl shadow-sm border border-outline-variant overflow-hidden">
        {/* Couverture */}
        <div className="h-32 bg-surface-brand"></div>
        
        {/* Header Profil */}
        <div className="px-8 pb-8 relative">
          <div className="flex flex-col md:flex-row justify-between items-start gap-6">
            <div className="flex flex-col md:flex-row gap-6 -mt-12">
              <div className="w-32 h-32 rounded-2xl bg-surface-container-lowest p-1.5 shadow-sm shrink-0">
                <div className="w-full h-full rounded-xl bg-primary-container text-primary flex items-center justify-center text-4xl font-bold overflow-hidden border border-outline-variant relative">
                  {member.photo_url ? (
                    <Image src={member.photo_url} alt={displayName} fill sizes="128px" className="object-cover" />
                  ) : (
                    member.prenom?.charAt(0) || '?'
                  )}
                </div>
              </div>
              <div className="mt-2 md:mt-14 space-y-1">
                <div className="flex items-center gap-3">
                  <h1 className="text-3xl font-bold text-on-surface">{displayName}</h1>
                  {member.categorie && (
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold capitalize border ${getBadgeClass(member.categorie)}`}>
                      {member.categorie}
                    </span>
                  )}
                </div>
                
                <div className="flex items-center gap-4 text-sm text-on-surface-variant font-medium">
                  {member.specialite && (
                    <div className="flex items-center gap-1.5">
                      <Briefcase className="w-4 h-4" /> {member.specialite}
                      {member.organisation && <span>chez {member.organisation}</span>}
                    </div>
                  )}
                  {member.pays && (
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-4 h-4" /> {member.ville ? `${member.ville}, ` : ''}{member.pays}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-4 md:mt-8 flex gap-3 w-full md:w-auto">
              {userId === id ? (
                <Link 
                  href="/parametres/profil"
                  className="flex-1 md:flex-none bg-surface-container-lowest text-on-surface-variant px-5 py-2.5 rounded-xl font-medium transition-colors flex items-center justify-center gap-2 shadow-sm border border-outline-variant hover:bg-surface-container-low"
                >
                  Modifier mon profil
                </Link>
              ) : member.ouvert_contact ? (
                <ConnectButton memberId={member.id} status={connectionStatus} />
              ) : (
                <div className="px-5 py-2.5 rounded-xl bg-surface-container-low text-on-surface-muted font-medium text-sm border border-outline-variant">
                  N'accepte pas les messages
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Colonne Principale */}
        <div className="md:col-span-2 space-y-8">
                 {/* Biographie */}
          <div className="bg-surface-container-lowest p-8 rounded-3xl shadow-sm border border-outline-variant">
            <h2 className="text-xl font-bold text-on-surface mb-4">À propos</h2>
            {member.biographie ? (
              <p className="text-on-surface-variant leading-relaxed whitespace-pre-wrap">{member.biographie}</p>
            ) : (
              <p className="text-on-surface-muted italic">Aucune biographie renseignée.</p>
            )}
          </div>

          {/* Contributions */}
          {docs && docs.length > 0 && (
            <div className="bg-surface-container-lowest p-8 rounded-3xl shadow-sm border border-outline-variant">
              <h2 className="text-xl font-bold text-on-surface mb-6 flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                Contributions à la bibliothèque
              </h2>
              <div className="space-y-3">
                {docs.map((doc: any) => (
                  <Link 
                    key={doc.id} 
                    href={`/bibliotheque/${doc.id}`}
                    className="block p-4 rounded-xl border border-outline-variant hover:border-outline-variant hover:bg-primary-container/50 transition-colors group"
                  >
                    <div className="font-bold text-on-surface group-hover:text-primary transition-colors">{doc.titre}</div>
                    <div className="text-sm text-on-surface-muted capitalize mt-1">{doc.type_doc?.replace('_', ' ')}</div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Colonne Latérale */}
        <div className="space-y-8">
          
          {/* Tags */}
          <div className="bg-surface-container-lowest p-6 rounded-3xl shadow-sm border border-outline-variant space-y-6">
            
            {sectors && sectors.length > 0 && (
              <div>
                <h3 className="text-sm font-bold text-on-surface uppercase tracking-wider mb-3">Expertise</h3>
                <div className="flex flex-wrap gap-2">
                  {sectors.map((s: string, i: number) => (
                    <span key={i} className="bg-primary-container text-primary px-3 py-1.5 rounded-lg text-sm font-medium">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {languages && languages.length > 0 && (
              <div>
                <h3 className="text-sm font-bold text-on-surface uppercase tracking-wider mb-3">Langues</h3>
                <div className="flex flex-wrap gap-2">
                  {languages.map((l: string, i: number) => (
                    <span key={i} className="bg-surface-container-low text-on-surface-variant px-3 py-1.5 rounded-lg text-sm font-medium border border-outline-variant">
                      {l}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            {/* Liens Web */}
            {(linkedinUrl || siteWebUrl) && (
              <div>
                <h3 className="text-sm font-bold text-on-surface uppercase tracking-wider mb-3">Sur le web</h3>
                <div className="space-y-2 text-sm font-medium">
                  {linkedinUrl && (
                    <a href={linkedinUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-info hover:underline p-2 rounded-lg hover:bg-info-container transition-colors">
                      <ExternalLink className="w-4 h-4" /> Profil LinkedIn
                    </a>
                  )}
                  {siteWebUrl && (
                    <a href={siteWebUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-on-surface-variant hover:text-on-surface hover:underline p-2 rounded-lg hover:bg-surface-container-low transition-colors">
                      <Globe className="w-4 h-4" /> Site internet
                    </a>
                  )}
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  )
}
