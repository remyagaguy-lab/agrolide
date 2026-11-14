/** Calculs purs du bilan de « Mon parcours » (testés dans bilan.test.ts). Aucune donnée inventée : tout vient des lignes reçues. */

export interface TentativeExamen {
  fin_le: string | null
  pourcent: number | null
  reussi: boolean | null
}

export interface ResumeExamens {
  /** Tentatives terminées (une tentative ouverte et abandonnée ne compte pas). */
  passes: number
  /** Meilleur score en pourcentage, ou null s'il n'y a aucune tentative terminée. */
  meilleur: number | null
  reussis: number
}

export function resumerExamens(tentatives: TentativeExamen[]): ResumeExamens {
  const finies = tentatives.filter((t) => t.fin_le && typeof t.pourcent === 'number')
  return {
    passes: finies.length,
    meilleur: finies.length ? Math.max(...finies.map((t) => t.pourcent as number)) : null,
    reussis: finies.filter((t) => t.reussi).length,
  }
}

export interface LivrableLigne {
  statut: string
  note: number | null
}

export interface ResumeLivrables {
  remis: number
  valides: number
  aRevoir: number
  enAttente: number
  /** Moyenne des notes attribuées (une décimale), ou null si aucune note. */
  moyenne: number | null
}

export function resumerLivrables(livrables: LivrableLigne[]): ResumeLivrables {
  const notes = livrables.map((l) => l.note).filter((n): n is number => typeof n === 'number')
  return {
    remis: livrables.length,
    valides: livrables.filter((l) => l.statut === 'valide').length,
    aRevoir: livrables.filter((l) => l.statut === 'a_revoir').length,
    enAttente: livrables.filter((l) => l.statut === 'soumis').length,
    moyenne: notes.length ? Math.round((notes.reduce((a, b) => a + b, 0) / notes.length) * 10) / 10 : null,
  }
}

export interface EvenementInscrit {
  id: string
  titre: string
  type_evt: string
  date_debut: string
}

/** Sépare les événements où le membre est inscrit en à venir (les plus proches d'abord) et passés. */
export function repartirEvenements(inscrits: EvenementInscrit[], maintenant: Date = new Date()) {
  const t = maintenant.toISOString()
  const uniques = inscrits.filter((e, i, tous) => tous.findIndex((x) => x.id === e.id) === i)
  return {
    aVenir: uniques.filter((e) => e.date_debut >= t).sort((a, b) => a.date_debut.localeCompare(b.date_debut)),
    passes: uniques.filter((e) => e.date_debut < t).length,
  }
}
