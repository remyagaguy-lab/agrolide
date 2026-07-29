import * as React from "react"
import { cn } from "@/lib/utils/formatters"
import Link from "next/link"
import Image from "next/image"

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
        "group flex flex-col bg-white rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl border border-transparent hover:border-gray-100", 
        className
      )}
    >
      <div className="relative w-full aspect-[16/10] overflow-hidden bg-gray-100 rounded-t-2xl">
        {imageUrl ? (
          <Image 
            src={imageUrl} 
            alt={title} 
            fill 
            className="object-cover transition-transform duration-700 group-hover:scale-105" 
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-gray-400">
            <span className="text-sm font-medium">Sans image</span>
          </div>
        )}
      </div>
      <div className="p-6 md:p-8 flex flex-col flex-grow">
        <div className="flex items-center gap-3 text-sm mb-3">
          <span className="font-bold text-[#1b5e38] uppercase tracking-wider text-xs">
            {category}
          </span>
          <span className="text-gray-300">•</span>
          <span className="text-gray-500 text-xs font-medium">
            {new Date(date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}
          </span>
        </div>
        <h3 className="text-xl font-heading font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-[#1b5e38] transition-colors leading-tight">
          {title}
        </h3>
        <p className="text-gray-600 text-sm line-clamp-3 mb-4 flex-grow">
          {excerpt}
        </p>
        <div className="mt-auto flex items-center text-sm font-bold text-[#1b5e38] group-hover:translate-x-1 transition-transform duration-300">
          Lire l'article 
          <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
        </div>
      </div>
    </Link>
  )
}
