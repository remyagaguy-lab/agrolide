import React from 'react';
import { db } from '@/db';
import { user_connections, users } from '@/db/schema';
import { auth } from '@clerk/nextjs/server';
import { eq, or, and } from 'drizzle-orm';
import Image from 'next/image';
import Link from 'next/link';
import { Check, X, User } from 'lucide-react';
import { acceptConnectionRequest, rejectConnectionRequest } from '@/app/actions/connections';

export default async function ReseauPage() {
  const { userId } = await auth();
  if (!userId) return null;

  // Retrieve connections for the current user
  const connections = await db.query.user_connections.findMany({
    where: or(
      eq(user_connections.requester_id, userId),
      eq(user_connections.receiver_id, userId)
    ),
  });

  // Collect all unique user IDs involved in connections
  const userIds = new Set<string>();
  connections.forEach(c => {
    if (c.requester_id !== userId) userIds.add(c.requester_id);
    if (c.receiver_id !== userId) userIds.add(c.receiver_id);
  });

  // Fetch user profiles for these IDs
  let relatedUsers: any[] = [];
  if (userIds.size > 0) {
    relatedUsers = await db.query.users.findMany({
      where: (u, { inArray }) => inArray(u.id, Array.from(userIds)),
      columns: { id: true, prenom: true, nom: true, photo_url: true, specialite: true },
    });
  }

  const userMap = new Map(relatedUsers.map(u => [u.id, u]));

  const pendingReceived = connections.filter(c => c.receiver_id === userId && c.status === 'pending');
  const pendingSent = connections.filter(c => c.requester_id === userId && c.status === 'pending');
  const acceptedConnections = connections.filter(c => c.status === 'accepted');

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="bg-gradient-to-br from-[#1b5e38] to-[#0c361e] rounded-2xl p-6 text-white shadow-sm relative overflow-hidden">
        <h1 className="text-2xl font-bold mb-2 relative z-10">Mon Réseau</h1>
        <p className="text-white/80 text-sm relative z-10">Gérez vos relations et invitations sur Agrolide.</p>
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl -mr-8 -mt-8"></div>
      </div>

      <div className="space-y-6">
        {pendingReceived.length > 0 && (
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Invitations reçues ({pendingReceived.length})</h2>
            <div className="grid gap-4">
              {pendingReceived.map(conn => {
                const u = userMap.get(conn.requester_id);
                if (!u) return null;
                return (
                  <div key={conn.id} className="flex items-center justify-between p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors">
                    <Link href={`/annuaire/${u.id}`} className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden relative">
                        {u.photo_url ? (
                          <Image src={u.photo_url} alt={`${u.prenom} ${u.nom}`} fill className="object-cover" />
                        ) : (
                          <User className="w-6 h-6 text-gray-400" />
                        )}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">{u.prenom} {u.nom}</div>
                        <div className="text-sm text-gray-500">{u.specialite || 'Membre'}</div>
                      </div>
                    </Link>
                    <div className="flex gap-2">
                      <form action={async () => {
                        'use server';
                        await acceptConnectionRequest(conn.id);
                      }}>
                        <button type="submit" className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100">
                          <Check className="w-5 h-5" />
                        </button>
                      </form>
                      <form action={async () => {
                        'use server';
                        await rejectConnectionRequest(conn.id);
                      }}>
                        <button type="submit" className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100">
                          <X className="w-5 h-5" />
                        </button>
                      </form>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Mes Relations ({acceptedConnections.length})</h2>
          {acceptedConnections.length === 0 ? (
            <p className="text-gray-500 text-sm">Vous n'avez pas encore de relations. Parcourez l'annuaire pour vous connecter avec d'autres acteurs.</p>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {acceptedConnections.map(conn => {
                const otherId = conn.requester_id === userId ? conn.receiver_id : conn.requester_id;
                const u = userMap.get(otherId);
                if (!u) return null;
                return (
                  <Link key={conn.id} href={`/annuaire/${u.id}`} className="flex items-center gap-4 p-4 border border-gray-100 rounded-xl hover:border-[#1b5e38]/30 transition-colors">
                    <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden relative">
                      {u.photo_url ? (
                        <Image src={u.photo_url} alt={`${u.prenom} ${u.nom}`} fill className="object-cover" />
                      ) : (
                        <User className="w-6 h-6 text-gray-400" />
                      )}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">{u.prenom} {u.nom}</div>
                      <div className="text-sm text-gray-500">{u.specialite || 'Membre'}</div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
