import * as React from "react"
import { cn } from "@/lib/utils/formatters"
import Link from "next/link"
import { Clock, User } from "lucide-react"
import Image from "next/image"

export interface ArticleCardProps {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  author: string;
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
  date,
  readTime,
  imageUrl,
  className
}: ArticleCardProps) {
  // Determine badge color based on category
  const getBadgeColor = (cat: string) => {
    switch(cat.toLowerCase()) {
      case 'réseau & communauté': return 'bg-blue-100 text-blue-800';
      case 'formation & savoirs': return 'bg-green-100 text-[var(--color-vert-principal)]';
      case 'entrepreneuriat agricole': return 'bg-orange-100 text-[var(--color-orange-accent)]';
      case 'recherche & vulgarisation': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Link href={`/blog/${slug}`} className={cn("group flex flex-col bg-white rounded-xl overflow-hidden shadow-sm border border-[var(--color-gris-clair)] transition-shadow hover:shadow-md", className)}>
      <div className="relative h-48 w-full bg-gray-200">
        {imageUrl ? (
          <Image src={imageUrl} alt={title} fill className="object-cover transition-transform group-hover:scale-105" />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-gray-400 bg-gray-100">
            <span className="text-sm">Pas d'image</span>
          </div>
        )}
        <div className="absolute top-4 left-4">
          <span className={cn("px-3 py-1 rounded-full text-xs font-semibold", getBadgeColor(category))}>
            {category}
          </span>
        </div>
      </div>
      <div className="p-5 flex flex-col flex-grow">
        <h3 className="text-lg font-heading font-bold text-[var(--color-vert-principal)] mb-2 line-clamp-2 group-hover:text-[var(--color-orange-accent)] transition-colors">
          {title}
        </h3>
        <p className="text-[var(--color-gris-texte)] text-sm mb-4 line-clamp-3 flex-grow">
          {excerpt}
        </p>
        <div className="flex items-center justify-between text-xs text-gray-500 mt-auto pt-4 border-t border-gray-100">
          <div className="flex items-center gap-1.5">
            <User size={14} />
            <span className="font-medium truncate max-w-[100px]">{author}</span>
          </div>
          <div className="flex items-center gap-3">
            <span>{new Date(date).toLocaleDateString('fr-FR')}</span>
            <div className="flex items-center gap-1">
              <Clock size={14} />
              <span>{readTime}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
