import * as React from "react"
import { db } from "@/db"
import { articles as articlesTable, users } from "@/db/schema"
import { eq, desc } from "drizzle-orm"
import { ArticleCard } from "@/components/ui/ArticleCard"

export async function LatestArticles() {
  const articles = await db.query.articles.findMany({
    where: eq(articlesTable.statut, 'publie'),
    orderBy: [desc(articlesTable.published_at)],
    limit: 3
  })

  // Pour les auteurs, on pourrait faire un map ou le charger via relations, on va simplifier pour le MVP.
  // On gère manuellement la récupération des noms.
  const articlesWithAuthors = await Promise.all(articles.map(async (article) => {
    let authorName = "Équipe Agrolide"
    if (article.auteur_id) {
      const user = await db.query.users.findFirst({
        where: eq(users.id, article.auteur_id),
        columns: { prenom: true, nom: true }
      })
      if (user) authorName = `${user.prenom} ${user.nom}`
    } else if (article.auteur_externe) {
      authorName = article.auteur_externe
    }
    return { ...article, authorName }
  }))

  const hasArticles = articlesWithAuthors.length > 0;

  return (
    <div className="w-full">
      {!hasArticles ? (
        <div className="text-center p-12 bg-gray-50 rounded-xl border border-dashed border-gray-300">
          <p className="text-[var(--color-gris-texte)] font-medium">Articles bientôt disponibles</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {articlesWithAuthors.map((article) => (
            <ArticleCard
              key={article.id}
              slug={article.slug}
              title={article.titre}
              excerpt={article.extrait || ""}
              category={article.categorie || "Général"}
              author={article.authorName}
              date={article.published_at || new Date().toISOString()}
              readTime="5 min"
              imageUrl={article.image_une_url || ""}
            />
          ))}
        </div>
      )}
    </div>
  )
}
