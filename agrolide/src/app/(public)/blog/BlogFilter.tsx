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
    <div className="flex items-center gap-2 bg-white p-2 rounded-xl shadow-sm border border-gray-100 max-w-sm">
      <Filter className="w-5 h-5 text-gray-400 ml-2 shrink-0" />
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
        className="border-none outline-none focus:ring-0 bg-transparent text-gray-700 font-medium cursor-pointer py-1 pr-4 w-full truncate"
      >
        <option value="tous">Tous les articles</option>
        {categories.map((cat) => (
          <option key={cat} value={cat}>{cat}</option>
        ))}
      </select>
    </div>
  )
}
