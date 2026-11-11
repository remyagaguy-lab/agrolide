'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { Filter } from 'lucide-react'

export default function BlogFilter({ 
  currentCategory, 
  categories 
}: { 
  currentCategory: string | undefined, 
  categories: string[] 
}) {
  const router = useRouter()

  return (
    <div className="flex items-center gap-2 bg-surface-container-lowest p-2 rounded-xl shadow-sm border border-outline-variant max-w-sm">
      <Filter className="w-5 h-5 text-on-surface-muted ml-2 shrink-0" />
      <select 
        value={currentCategory || 'tous'}
        onChange={(e) => {
          const val = e.target.value
          if (val === 'tous') {
            router.push('/blog')
          } else {
            router.push(`/blog?category=${encodeURIComponent(val)}`)
          }
        }}
        className="border-none outline-none focus:ring-0 bg-transparent text-on-surface-variant font-medium cursor-pointer py-1 pr-4 w-full truncate"
      >
        <option value="tous">Tous les articles</option>
        {categories.map((cat) => (
          <option key={cat} value={cat}>{cat}</option>
        ))}
      </select>
    </div>
  )
}
