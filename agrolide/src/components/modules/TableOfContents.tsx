"use client"

import * as React from "react"
import { ChevronDown } from "lucide-react"

export function TableOfContents() {
  const [headings, setHeadings] = React.useState<{ id: string; text: string; level: number }[]>([])
  const [isOpen, setIsOpen] = React.useState(false)

  React.useEffect(() => {
    // On trouve tous les h2 et h3 dans le contenu de l'article
    const elements = Array.from(document.querySelectorAll('.article-content h2, .article-content h3'))
    
    const items = elements.map((elem, index) => {
      // S'assurer que l'élément a un id
      if (!elem.id) {
        elem.id = `heading-${index}`
      }
      return {
        id: elem.id,
        text: elem.textContent || '',
        level: elem.tagName.toLowerCase() === 'h2' ? 2 : 3
      }
    })

    setHeadings(items)
    
    // Auto-open on desktop
    if (window.innerWidth >= 1024) {
      setIsOpen(true)
    }
  }, [])

  if (headings.length === 0) return null

  return (
    <div className="bg-gray-50 rounded-xl border border-[var(--color-gris-clair)] overflow-hidden">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-5 lg:cursor-default"
      >
        <h3 className="font-heading font-bold text-lg text-gray-900">Sommaire</h3>
        <ChevronDown size={20} className={`text-gray-500 lg:hidden transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      <div className={`px-5 pb-5 transition-all duration-300 ${isOpen ? 'block' : 'hidden lg:block'}`}>
        <ul className="space-y-3 border-t border-gray-200 pt-4">
          {headings.map((heading) => (
            <li 
              key={heading.id} 
              className={`${heading.level === 3 ? 'ml-4 text-sm' : 'font-medium'} text-[var(--color-gris-texte)]`}
            >
              <a 
                href={`#${heading.id}`}
                className="hover:text-[var(--color-vert-principal)] transition-colors inline-block w-full"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById(heading.id)?.scrollIntoView({ behavior: 'smooth' });
                  // On mobile, close TOC after clicking a link
                  if (window.innerWidth < 1024) {
                    setIsOpen(false);
                  }
                }}
              >
                {heading.text}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
