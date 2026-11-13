import { useState, useEffect } from 'react'

export type FilterType = 'tous' | 'evenements' | 'emploi' | 'bourse' | 'appel'

/**
 * `initialItems` : liste déjà lue par la page côté serveur. Elle est affichée tout de suite, sans nouvel appel
 * au chargement ; l'appel à l'action ne sert plus qu'au rafraîchissement (« Réessayer », après un envoi).
 * Sans `initialItems` (lecture serveur en échec), le hook charge la liste lui-même comme avant.
 */
export function useActualites(initialItems?: any[]) {
  const [filter, setFilter] = useState<FilterType>('tous')
  const [items, setItems] = useState<any[]>(initialItems ?? [])
  const [loading, setLoading] = useState(initialItems === undefined)
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
    if (initialItems !== undefined) return
    fetchData()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const filteredItems = items.filter(item => {
    if (filter === 'evenements' && item._itemType !== 'evenement') return false
    if (filter === 'emploi' && (item._itemType !== 'opportunite' || item.type_opp !== 'emploi')) return false
    if (filter === 'bourse' && (item._itemType !== 'opportunite' || item.type_opp !== 'bourse')) return false
    if (filter === 'appel' && (item._itemType !== 'opportunite' || item.type_opp !== 'appel')) return false
    return true
  })

  return { items, loading, error, filter, setFilter, filteredItems, fetchData }
}
