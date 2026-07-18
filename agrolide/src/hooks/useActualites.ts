import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

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
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
      const supabase = createClient(supabaseUrl, supabaseKey)

      // On récupère les événements publiés
      const { data: eventsData, error: eventsError } = await supabase
        .from('evenements')
        .select('*')
        .eq('publie', true)

      if (eventsError) throw eventsError

      // On récupère les opportunités publiées
      const { data: oppsData, error: oppsError } = await supabase
        .from('opportunites')
        .select('*')
        .eq('statut', 'publie')

      if (oppsError) throw oppsError

      const events = (eventsData || []).map(e => ({ ...e, _itemType: 'evenement' }))
      const opps = (oppsData || []).map(o => ({ ...o, _itemType: 'opportunite' }))

      const combined = [...events, ...opps]
      // Tri par date : date_debut pour les événements, created_at pour les opportunités
      // Du plus récent au plus ancien
      combined.sort((a, b) => {
        const dateA = a._itemType === 'evenement' ? new Date(a.date_debut).getTime() : new Date(a.created_at).getTime()
        const dateB = b._itemType === 'evenement' ? new Date(b.date_debut).getTime() : new Date(b.created_at).getTime()
        return dateB - dateA
      })

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
