import * as React from "react"
import { createClient } from "@/lib/supabase/server"
import { ArticleCard } from "@/components/ui/ArticleCard"

export async function LatestArticles() {
  const supabase = await createClient()

  // On tente de récupérer les 3 derniers articles.
  // Si la table n'existe pas, supabase renverra une erreur, on gère silencieusement pour le MVP.
  const { data: articles, error } = await supabase
    .from("articles")
    .select("*")
    .eq('status', 'published')
    .order('published_at', { ascending: false })
    .limit(3)

  const hasArticles = articles && articles.length > 0 && !error;

  return (
    <div className="w-full">
      {!hasArticles ? (
        <div className="text-center p-12 bg-gray-50 rounded-xl border border-dashed border-gray-300">
          <p className="text-[var(--color-gris-texte)] font-medium">Articles bientôt disponibles</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {articles.map((article) => (
            <ArticleCard
              key={article.id}
              slug={article.slug}
              title={article.title}
              excerpt={article.excerpt || ""}
              category={article.category || "Général"}
              author={article.author_name || "Équipe Agrolide"}
              date={article.published_at}
              readTime={article.read_time ? `${article.read_time} min` : "5 min"}
              imageUrl={article.image_url}
            />
          ))}
        </div>
      )}
    </div>
  )
}
