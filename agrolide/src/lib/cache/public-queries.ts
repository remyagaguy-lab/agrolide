import { unstable_cache } from "next/cache"
import { desc, eq } from "drizzle-orm"
import { db } from "@/db"
import {
  articles,
  campagnes_financement,
  contributions as contributionsTable,
} from "@/db/schema"

/**
 * Requêtes publiques mises en cache (Data Cache de Next, partagé entre requêtes).
 * Chaque appel D1 passe par l'API REST Cloudflare (150 à 400 ms) : on évite de la
 * refaire à chaque visite, y compris sur les pages rendues à la demande
 * (searchParams). Invalidation : revalidateTag(<tag>) depuis les actions admin.
 */
export const CACHE_TAGS = {
  articles: "articles",
  formations: "formations",
  campagne: "campagne",
} as const

const ONE_HOUR = 3600

export const getPublishedArticles = unstable_cache(
  async () =>
    db.query.articles.findMany({
      where: eq(articles.statut, "publie"),
      orderBy: [desc(articles.published_at)],
      with: { auteur: true },
    }),
  ["published-articles"],
  { revalidate: ONE_HOUR, tags: [CACHE_TAGS.articles] }
)

export const getAllFormations = unstable_cache(
  async () =>
    db.query.formations.findMany({
      orderBy: (formations, { desc }) => [desc(formations.created_at)],
    }),
  ["all-formations"],
  { revalidate: ONE_HOUR, tags: [CACHE_TAGS.formations] }
)

export const getCampagneData = unstable_cache(
  async () => {
    // Les deux requêtes sont indépendantes : en parallèle.
    const [campagne, contributions] = await Promise.all([
      db
        .select()
        .from(campagnes_financement)
        .where(eq(campagnes_financement.active, true))
        .orderBy(desc(campagnes_financement.created_at))
        .limit(1)
        .then((r) => r[0] ?? null),
      db
        .select({
          montant_fcfa: contributionsTable.montant_fcfa,
          prenom: contributionsTable.prenom,
          anonyme: contributionsTable.anonyme,
          created_at: contributionsTable.created_at,
        })
        .from(contributionsTable)
        .where(eq(contributionsTable.statut, "valide")),
    ])
    return { campagne, contributions }
  },
  ["campagne-data"],
  { revalidate: 1800, tags: [CACHE_TAGS.campagne] }
)
