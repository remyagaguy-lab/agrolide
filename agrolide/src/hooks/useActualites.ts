import { useState, useEffect } from 'react'

export type FilterType = 'tous' | 'evenements' | 'emploi' | 'bourse' | 'appel'

export function useActualites() {
  const [filter, setFilter] = useState<FilterType>('tous')
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = async () => {
    setLoading(true)
    setError(null)
    try {
      const { getActualites } = await import('@/app/actions/actualites')
      const combined = await getActualites()
      setItems(combined)
    } catch (err: any) {
      console.error("Erreur lors de la récupération des actualités:", err)
      setError(err.message || "Une erreur est survenue lors de la récupération des actualités.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const filteredItems = items.filter(item => {
    if (filter === 'evenements' && item._itemType !== 'evenement') return false
    if (filter === 'emploi' && (item._itemType !== 'opportunite' || item.type_opp !== 'emploi')) return false
    if (filter === 'bourse' && (item._itemType !== 'opportunite' || item.type_opp !== 'bourse')) return false
    if (filter === 'appel' && (item._itemType !== 'opportunite' || item.type_opp !== 'appel')) return false
    return true
  })

  return { items, loading, error, filter, setFilter, filteredItems, fetchData }
}
