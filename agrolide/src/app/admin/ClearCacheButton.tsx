"use client"

import { useState } from "react"
import { RefreshCw, Check } from "lucide-react"
import { revalidateEverything } from "@/app/actions/revalidate"
import { useRouter } from "next/navigation"

export function ClearCacheButton() {
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const router = useRouter()

  const handleClear = async () => {
    setLoading(true)
    try {
      await revalidateEverything()
      router.refresh()
      setDone(true)
      setTimeout(() => setDone(false), 3000)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleClear}
      disabled={loading}
      className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-md disabled:opacity-50"
    >
      {done ? (
        <>
          <Check size={16} className="text-green-600" />
          <span className="text-green-700">Cache vidé</span>
        </>
      ) : (
        <>
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
          <span>{loading ? "Vidage..." : "Actualiser le site"}</span>
        </>
      )}
    </button>
  )
}
