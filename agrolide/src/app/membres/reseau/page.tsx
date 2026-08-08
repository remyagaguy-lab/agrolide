import React from 'react'
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { db } from '@/db'
import { users, user_connections } from '@/db/schema'
import { eq, or, and, inArray } from 'drizzle-orm'
import Link from 'next/link'
import Image from 'next/image'
import { User, Check, X, MessageCircle } from 'lucide-react'
import NetworkActions from './NetworkActions' // We'll create this client component

export const metadata = {
  title: 'Mon Réseau - Agrolide',
}

export default async function NetworkPage() {
  const { userId } = await auth()
  
  if (!userId) {
    redirect('/login')
  }

  // 1. Invitations reçues (en attente)
  const pendingRequests = await db.select({
    id: user_connections.id,
    status: user_connections.status,
    created_at: user_connections.created_at,
    requester: {
      id: users.id,
      prenom: users.prenom,
      nom: users.nom,
      avatar_url: users.photo_url,
      specialite: users.specialite,
      categorie: users.categorie
    }
  }).from(user_connections)
  .innerJoin(users, eq(user_connections.requester_id, users.id))
  .where(and(
    eq(user_connections.receiver_id, userId),
    eq(user_connections.status, 'pending')
  ))

  // 2. Mes relations (acceptées)
  // On doit chercher les relations où l'utilisateur est soit requester, soit receiver
  const connectionsRows = await db.select({
    id: user_connections.id,
    requester_id: user_connections.requester_id,
    receiver_id: user_connections.receiver_id,
    created_at: user_connections.created_at,
    requester: {
      id: users.id,
      prenom: users.prenom,
      nom: users.nom,
      avatar_url: users.photo_url,
      specialite: users.specialite,
      categorie: users.categorie
    },
    // On doit faire un alias avec l'ORMs mais drizzle sqlite ne supporte pas facilement les alias complexes dans un select simple avec join si on n'a pas setup de relation. 
    // On va faire ça en deux requêtes simples pour la MVP.
  }).from(user_connections)
  .leftJoin(users, eq(user_connections.requester_id, users.id))
  .where(and(
    eq(user_connections.status, 'accepted'),
    or(eq(user_connections.receiver_id, userId), eq(user_connections.requester_id, userId))
  ))

  // Pour les relations acceptées, il faut charger l'AUTRE utilisateur
  // Drizzle SQLite n'ayant pas un leftJoin puissant sans relation schema explicite pour 2 fois la même table,
  // on récupère tous les IDs des relations, et on fait un IN
  const relationUserIds = connectionsRows.map(row => 
    row.requester_id === userId ? row.receiver_id : row.requester_id
  );

  let activeConnections: any[] = [];
  if (relationUserIds.length > 0) {
    // Drizzle inArray
    // Pour simplifier, itérons.
    activeConnections = await db.select({
        id: users.id,
        prenom: users.prenom,
        nom: users.nom,
        avatar_url: users.photo_url,
        specialite: users.specialite,
        categorie: users.categorie
    }).from(users).where(inArray(users.id, relationUserIds))
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Mon Réseau</h1>
        <p className="text-gray-500 mt-1">Gérez vos invitations et vos relations professionnelles</p>
      </div>

      {/* Invitations reçues */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          Invitations en attente
          {pendingRequests.length > 0 && (
            <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
              {pendingRequests.length}
            </span>
          )}
        </h2>

        {pendingRequests.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            Aucune invitation en attente pour le moment.
          </div>
        ) : (
          <div className="space-y-4">
            {pendingRequests.map((req) => (
              <div key={req.id} className="flex flex-col sm:flex-row items-center justify-between p-4 border border-gray-100 rounded-xl hover:border-gray-200 transition-colors gap-4">
                <Link href={`/annuaire/${req.requester.id}`} className="flex items-center gap-4 group">
                  <div className="w-14 h-14 rounded-full overflow-hidden bg-gray-100 shrink-0">
                    {req.requester.avatar_url ? (
                      <Image src={req.requester.avatar_url} alt="Avatar" width={56} height={56} className="object-cover w-full h-full" />
                    ) : (
                      <User className="m-auto h-full w-8 text-gray-400" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 group-hover:text-[#1b5e38] transition-colors">
                      {req.requester.prenom} {req.requester.nom}
                    </h3>
                    <p className="text-sm text-gray-500">{req.requester.specialite || req.requester.categorie}</p>
                  </div>
                </Link>
                
                <NetworkActions requestId={req.id} />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Relations actives */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          Mes relations ({activeConnections.length})
        </h2>

        {activeConnections.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            Vous n'avez pas encore de relations. Parcourez l'annuaire pour vous connecter avec d'autres membres !
            <div className="mt-4">
              <Link href="/annuaire" className="inline-block bg-[#1b5e38] text-white px-6 py-2.5 rounded-xl font-medium hover:bg-[#14472a] transition-colors">
                Explorer l'annuaire
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeConnections.map((user) => (
              <div key={user.id} className="flex flex-col sm:flex-row items-center justify-between p-4 border border-gray-100 rounded-xl hover:border-[#1b5e38]/20 transition-colors gap-4 bg-gray-50/50">
                <Link href={`/annuaire/${user.id}`} className="flex items-center gap-3 w-full">
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-white shrink-0 shadow-sm">
                    {user.avatar_url ? (
                      <Image src={user.avatar_url} alt="Avatar" width={48} height={48} className="object-cover w-full h-full" />
                    ) : (
                      <User className="m-auto h-full w-6 text-gray-400" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-900 truncate">
                      {user.prenom} {user.nom}
                    </h3>
                    <p className="text-xs text-gray-500 truncate">{user.specialite || user.categorie}</p>
                  </div>
                </Link>
                
                <Link href={`/membres/messages?user=${user.id}`} className="p-2.5 text-gray-500 hover:text-[#1b5e38] hover:bg-[#dff0e0] rounded-xl transition-colors shrink-0" title="Envoyer un message">
                  <MessageCircle size={20} />
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
