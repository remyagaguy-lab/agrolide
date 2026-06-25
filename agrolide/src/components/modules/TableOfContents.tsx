"use client"

import * as React from "react"

export function TableOfContents() {
  const [headings, setHeadings] = React.useState<{ id: string; text: string; level: number }[]>([])

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
  }, [])

  if (headings.length === 0) return null

  return (
    <div className="bg-gray-50 p-6 rounded-xl border border-[var(--color-gris-clair)] sticky top-24">
      <h3 className="font-heading font-bold text-lg mb-4 text-gray-900 border-b pb-2">Sommaire</h3>
      <ul className="space-y-3">
        {headings.map((heading) => (
          <li 
            key={heading.id} 
            className={`${heading.level === 3 ? 'ml-4 text-sm' : 'font-medium'} text-[var(--color-gris-texte)]`}
          >
            <a 
              href={`#${heading.id}`}
              className="hover:text-[var(--color-vert-principal)] transition-colors"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById(heading.id)?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}
