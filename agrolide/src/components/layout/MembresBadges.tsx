"use client"

import * as React from "react"

/** Compteurs calculés une fois par le layout serveur, lus par la barre latérale et par les onglets de rubrique. */
export interface MembresBadgesValeurs {
  invitations: number
  messages: number
}

const MembresBadgesContext = React.createContext<MembresBadgesValeurs>({ invitations: 0, messages: 0 })

export function MembresBadgesProvider({ valeurs, children }: { valeurs: MembresBadgesValeurs; children: React.ReactNode }) {
  return <MembresBadgesContext.Provider value={valeurs}>{children}</MembresBadgesContext.Provider>
}

export function useMembresBadges() {
  return React.useContext(MembresBadgesContext)
}
