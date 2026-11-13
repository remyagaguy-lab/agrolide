"use client"

import React, { useState, useEffect } from "react"
import Image from "next/image"
import { Plus, AlertCircle } from "lucide-react"
import { useActualites } from "@/hooks/useActualites"
import { SkeletonGrid } from "@/components/ui/Skeleton"
import { Button } from "@/components/ui/Button"
import { EmptyState } from "@/components/ui/EmptyState"
import { PageHero } from "@/components/ui/PageHero"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs"
import EventCard from "@/components/modules/evenements/EventCard"
import OpportunityCard from "@/components/modules/opportunites/OpportunityCard"
import InscriptionModal from "@/components/modules/evenements/InscriptionModal"
import SubmitOpportunityModal from "@/components/modules/opportunites/SubmitOpportunityModal"

export type AgendaMode = "evenements" | "webinaires" | "opportunites"

const MODES: Record<AgendaMode, { title: string; subtitle: string; empty: string; options: { value: string; label: string }[] }> = {
  evenements: {
    title: "Événements",
    subtitle: "Ateliers, conférences et rencontres du réseau agricole.",
    empty: "Aucun événement ne correspond à vos critères pour le moment.",
    options: [
      { value: "tous", label: "Tous les types" },
      { value: "atelier", label: "Ateliers" },
      { value: "conference", label: "Conférences" },
      { value: "rencontre_locale", label: "Rencontres locales" },
      { value: "webinaire", label: "Webinaires" },
    ],
  },
  webinaires: {
    title: "Webinaires",
    subtitle: "Échangez sur les thématiques agricoles avec la communauté du réseau.",
    empty: "Aucun webinaire n'est programmé pour le moment. Revenez bientôt.",
    options: [],
  },
  opportunites: {
    title: "Opportunités",
    subtitle: "Bourses d'études, appels à projets et offres d'emploi pour les acteurs de l'agriculture.",
    empty: "Aucune opportunité ne correspond à vos critères pour le moment.",
    options: [
      { value: "tous", label: "Toutes les opportunités" },
      { value: "bourse", label: "Bourses d'études" },
      { value: "appel", label: "Appels à projets" },
      { value: "emploi", label: "Offres d'emploi" },
    ],
  },
}

export default function AgendaClient({ mode, initialItems }: { mode: AgendaMode; initialItems?: any[] }) {
  const { loading, error, items, fetchData } = useActualites(initialItems)
  const cfg = MODES[mode]
  const [filter, setFilter] = useState("tous")

  const [selectedEvent, setSelectedEvent] = useState<any | null>(null)
  const [isEventModalOpen, setIsEventModalOpen] = useState(false)
  const [isOppModalOpen, setIsOppModalOpen] = useState(false)

  const handleInscrireClick = (event: any) => {
    if (event.lien_inscription) {
      window.open(event.lien_inscription, "_blank", "noopener,noreferrer")
    } else {
      setSelectedEvent(event)
      setIsEventModalOpen(true)
    }
  }

  const isEvt = mode !== "opportunites"
  const visible = items.filter((item) => {
    if (mode === "opportunites") return item._itemType === "opportunite" && (filter === "tous" || item.type_opp === filter)
    if (item._itemType !== "evenement") return false
    if (mode === "webinaires") return item.type_evt === "webinaire"
    return filter === "tous" || item.type_evt === filter
  })
  const now = Date.now()
  const time = (e: any) => new Date(e.date_debut).getTime()
  const upcoming = isEvt ? visible.filter((e) => time(e) >= now).sort((a, b) => time(a) - time(b)) : visible
  const past = isEvt ? visible.filter((e) => time(e) < now).sort((a, b) => time(b) - time(a)) : []

  const renderItem = (item: any) =>
    item._itemType === "evenement" ? (
      <EventCard key={`evt-${item.id}`} event={item} onInscrireClick={handleInscrireClick} onDetailsClick={(evt) => setSelectedEvent(evt)} />
    ) : (
      <OpportunityCard key={`opp-${item.id}`} opp={item} />
    )

  const results = loading ? (
    <div className="py-2">
      <SkeletonGrid count={6} />
    </div>
  ) : error ? (
    <EmptyState
      arche
      icon={<AlertCircle />}
      title="Impossible de charger cette page"
      description={error}
      action={<Button variant="outline" onClick={fetchData}>Réessayer</Button>}
    />
  ) : upcoming.length === 0 && past.length === 0 ? (
    <EmptyState arche title={cfg.empty} />
  ) : (
    <div className="space-y-12">
      {upcoming.length > 0 && (
        <div>
          {isEvt && <h2 className="mb-4 text-title-lg text-on-surface">À venir</h2>}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">{upcoming.map(renderItem)}</div>
        </div>
      )}
      {past.length > 0 && (
        <div>
          <h2 className="mb-4 text-title-lg text-on-surface">{mode === "webinaires" ? "Webinaires passés" : "Événements passés"}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">{past.map(renderItem)}</div>
        </div>
      )}
    </div>
  )

  return (
    <div className="min-h-screen bg-surface-container-low">
      <PageHero
        nextTone="low"
        label={mode === "opportunites" ? "Bourses, appels et emplois" : "Agenda du réseau"}
        title={cfg.title}
        description={cfg.subtitle}
        actions={
          mode === "opportunites" ? (
            <Button variant="ghost-dark" onClick={() => setIsOppModalOpen(true)}>
              <Plus className="size-4" aria-hidden="true" /> Proposer une opportunité
            </Button>
          ) : undefined
        }
      />

      <div className="container pb-16">
        {cfg.options.length > 0 ? (
          <Tabs value={filter} onValueChange={setFilter}>
            <TabsList aria-label={mode === "opportunites" ? "Filtrer par type d'opportunité" : "Filtrer par type d'événement"}>
              {cfg.options.map((o) => (
                <TabsTrigger key={o.value} value={o.value}>{o.label}</TabsTrigger>
              ))}
            </TabsList>
            <TabsContent value={filter}>{results}</TabsContent>
          </Tabs>
        ) : (
          results
        )}
      </div>

      <InscriptionModal
        isOpen={isEventModalOpen}
        onClose={() => setIsEventModalOpen(false)}
        event={selectedEvent}
      />

      <SubmitOpportunityModal
        isOpen={isOppModalOpen}
        onClose={() => setIsOppModalOpen(false)}
        onSuccess={fetchData}
      />

      {/* Détails d'un événement (fenêtre) */}
      {selectedEvent && selectedEvent._itemType === "evenement" && !isEventModalOpen && (
        <EventDetailsModal
          isOpen={!!selectedEvent}
          onClose={() => setSelectedEvent(null)}
          event={selectedEvent}
          onInscrire={() => {
            setSelectedEvent(null)
            handleInscrireClick(selectedEvent)
          }}
        />
      )}
    </div>
  )
}

function EventDetailsModal({ isOpen, onClose, event, onInscrire }: { isOpen: boolean; onClose: () => void; event: any; onInscrire: () => void }) {
  const [marked, setMarked] = useState<any>(null)

  useEffect(() => {
    import("marked").then((m) => setMarked(m))
  }, [])

  // Échap ferme la fenêtre
  useEffect(() => {
    if (!isOpen) return
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose()
    document.addEventListener("keydown", onKey)
    return () => document.removeEventListener("keydown", onKey)
  }, [isOpen, onClose])

  if (!isOpen || !event) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div role="dialog" aria-modal="true" aria-labelledby="event-modal-title" className="bg-surface-container-lowest rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-xl flex flex-col">
        <div className="sticky top-0 bg-surface-container-lowest border-b border-outline-variant p-4 flex justify-between items-center z-10">
          <h2 id="event-modal-title" className="text-xl font-bold text-on-surface pr-8">{event.titre}</h2>
          <button aria-label="Fermer les détails" onClick={onClose} className="p-2 min-h-11 min-w-11 bg-surface-container hover:bg-surface-container-high rounded-full transition-colors text-on-surface-variant">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
          </button>
        </div>

        <div className="p-6 flex-grow">
          {event.image_url && (
            <div className="mb-6 rounded-xl overflow-hidden bg-surface-container relative w-full h-[400px]">
              <Image src={event.image_url} alt={`Affiche : ${event.titre}`} fill sizes="(max-width: 768px) 100vw, 800px" className="object-contain" />
            </div>
          )}

          <div className="prose prose-green max-w-none text-on-surface-variant">
            {event.description ? (
              marked ? (
                <div dangerouslySetInnerHTML={{ __html: marked.parse(event.description) }} />
              ) : (
                <p>Chargement de la description...</p>
              )
            ) : (
              <p className="italic text-on-surface-muted">Aucune description disponible pour cet événement.</p>
            )}
          </div>
        </div>

        <div className="sticky bottom-0 bg-surface-container-lowest border-t border-outline-variant p-4 flex justify-end gap-3">
          <button onClick={onClose} className="px-6 py-2 min-h-11 bg-surface-container hover:bg-surface-container-high text-on-surface-variant font-medium rounded-xl transition-colors">
            Fermer
          </button>

          {new Date(event.date_debut) >= new Date() && (
            <button
              onClick={onInscrire}
              className="px-6 py-2 min-h-11 bg-primary hover:bg-primary/90 text-on-primary font-medium rounded-xl transition-colors shadow-sm"
            >
              S'inscrire à l'événement
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
