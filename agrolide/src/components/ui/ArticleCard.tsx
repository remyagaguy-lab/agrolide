import * as React from "react"
import { cn } from "@/lib/utils/formatters"
import Link from "next/link"
import Image from "next/image"
import { Feuille } from "@/components/brand"

export interface ArticleCardProps {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  author: string;
  authorId?: string;
  date: string;
  readTime: string;
  imageUrl?: string;
  className?: string;
}

export function ArticleCard({
  slug,
  title,
  excerpt,
  category,
  author,
  authorId,
  date,
  readTime,
  imageUrl,
  className
}: ArticleCardProps) {
  return (
    <Link 
      href={`/blog/${slug}`} 
      className={cn(
        "group flex flex-col bg-surface-container-lowest rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl border border-transparent hover:border-outline-variant", 
        className
      )}
    >
      <div className="relative w-full aspect-[16/10] overflow-hidden bg-surface-container rounded-t-2xl">
        {imageUrl ? (
          <Image 
            src={imageUrl} 
            alt={title} 
            fill 
            className="object-cover transition-transform duration-700 group-hover:scale-105" 
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-on-surface-muted">
            <span className="text-sm font-medium">Sans image</span>
          </div>
        )}
      </div>
      <div className="p-6 md:p-8 flex flex-col flex-grow">
        <div className="flex items-center gap-3 text-sm mb-3">
          <span className="inline-flex items-center gap-1.5 font-bold text-primary uppercase tracking-wider text-xs">
            <Feuille className="w-3 text-accent-leaf" />
            {category}
          </span>
          <span className="text-outline">•</span>
          <span className="text-on-surface-muted text-xs font-medium">
            {new Date(date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}
          </span>
        </div>
        <h3 className="text-xl font-heading font-bold text-on-surface mb-3 line-clamp-2 group-hover:text-primary transition-colors leading-tight">
          {title}
        </h3>
        <p className="text-on-surface-variant text-sm line-clamp-3 mb-4 flex-grow">
          {excerpt}
        </p>
        <div className="mt-auto flex items-center justify-between border-t border-outline-variant pt-4">
          <span className="text-xs text-on-surface-muted font-medium truncate max-w-[140px]">
            Par {author}
          </span>
          <div className="flex items-center text-sm font-bold text-primary group-hover:translate-x-1 transition-transform duration-300">
            Lire l'article 
            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
          </div>
        </div>
      </div>
    </Link>
  )
}
