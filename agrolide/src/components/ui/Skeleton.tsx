import React from 'react'

export function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 flex flex-col h-full animate-pulse shadow-sm">
      <div className="flex justify-between items-start mb-4">
        <div className="h-6 bg-gray-200 rounded-full w-24"></div>
        <div className="h-6 bg-gray-200 rounded-full w-16"></div>
      </div>
      <div className="w-full h-40 bg-gray-200 rounded-xl mb-4"></div>
      <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-full mb-4"></div>
      <div className="space-y-2 mt-auto">
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        <div className="h-4 bg-gray-200 rounded w-2/3"></div>
      </div>
    </div>
  )
}

export function SkeletonGrid({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  )
}

export function SkeletonList({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-4 w-full">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-white rounded-xl border border-gray-100 p-4 flex gap-4 animate-pulse">
          <div className="w-12 h-12 bg-gray-200 rounded-full shrink-0"></div>
          <div className="flex-1 space-y-3 py-1">
            <div className="h-5 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      ))}
    </div>
  )
}
