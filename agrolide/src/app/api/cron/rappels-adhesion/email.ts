import { formaterDate, formaterFcfa, libelleCategorie, tarifAnnuel } from "@/lib/adhesion"

/**
 * Textes des rappels d'adhésion (e-mail et notification de la cloche), partagés par la tâche planifiée et le rappel manuel.
 * Les couleurs sont en ligne (un e-mail n'a pas de feuille de style) : ce dossier est dans la liste blanche de `ds:check`.
 */

export type TypeRappel = "j30" | "j7" | "j0"

export interface ContexteRappel {
  prenom: string | null
  categorie: string | null
  type: TypeRappel
  /** Jours restants avant l'échéance (0 le jour même). */
  jours: number
  /** AAAA-MM-JJ */
  echeance: string
  /** « gratuite » : fin de l'année gratuite ; « payante » : fin d'une cotisation payée. */
  origine: "gratuite" | "payante"
  /** Le paiement est-il ouvert ? Sinon on ne demande rien. */
  paiementOuvert: boolean
}

export interface TexteRappel {
  sujet: string
  html: string
  notification: string
}

const echapper = (v: string) => v.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;")

export const urlSite = () => (process.env.NEXT_PUBLIC_SITE_URL || "https://agrolide.org").replace(/\/$/, "")

export function construireRappel(c: ContexteRappel): TexteRappel {
  const date = formaterDate(c.echeance)
  const delai = c.jours <= 0 ? "aujourd'hui" : c.jours === 1 ? "demain" : `dans ${c.jours} jours`
  const tarif = tarifAnnuel(c.categorie)
  const profil = libelleCategorie(c.categorie)
  const bonjour = c.prenom ? `Bonjour ${echapper(c.prenom)},` : "Bonjour,"

  let sujet: string
  let paragraphes: string[]
  let notification: string
  let bouton: string

  if (c.origine === "gratuite" && !c.paiementOuvert) {
    // Année gratuite, paiement fermé : on informe, on ne demande rien.
    sujet = c.jours <= 0 ? "Votre année gratuite sur agrolide se termine aujourd'hui" : `Votre année gratuite sur agrolide se termine le ${date}`
    paragraphes = [
      `Votre adhésion gratuite au réseau <strong>agrolide</strong> se termine <strong>${delai}</strong>, le ${date}.`,
      "Vous n'avez rien à payer pour le moment : nous vous écrirons pour vous présenter la suite avant cette date.",
      tarif ? `À titre indicatif, le tarif annuel du profil ${echapper(profil)} sera de ${formaterFcfa(tarif)}.` : "",
    ]
    notification = `Votre année d'adhésion gratuite se termine ${delai} (${date}). Rien à payer pour le moment.`
    bouton = "Voir mon adhésion"
  } else if (c.origine === "gratuite") {
    sujet = c.jours <= 0 ? "Votre année gratuite sur agrolide se termine aujourd'hui" : `Votre année gratuite sur agrolide se termine ${delai}`
    paragraphes = [
      `Votre adhésion gratuite au réseau <strong>agrolide</strong> se termine <strong>${delai}</strong>, le ${date}.`,
      "Pour continuer à profiter de tous les services (bibliothèque, forum, annuaire, formations…), réglez votre cotisation avant cette date.",
      tarif ? `Le tarif annuel du profil ${echapper(profil)} est de ${formaterFcfa(tarif)}.` : "",
    ]
    notification = `Votre année d'adhésion gratuite se termine ${delai} (${date}). Réglez votre cotisation pour continuer.`
    bouton = "Régler ma cotisation"
  } else {
    sujet = c.jours <= 0 ? "Votre adhésion agrolide expire aujourd'hui" : `Votre adhésion agrolide expire ${delai}`
    paragraphes = [
      `Votre adhésion au réseau <strong>agrolide</strong> expire <strong>${delai}</strong>, le ${date}.`,
      "Pour continuer à profiter de tous les services (bibliothèque, forum, annuaire, formations…), renouvelez votre cotisation avant l'échéance.",
    ]
    notification = `Votre adhésion expire ${delai} (${date}). Pensez à renouveler votre cotisation.`
    bouton = "Renouveler mon adhésion"
  }

  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 32px;">
      <img src="https://agrolide.org/agrolide-png.png" alt="agrolide" style="height: 40px; margin-bottom: 24px;" />
      <h2 style="color: #1b5e38; margin-bottom: 16px;">${bonjour}</h2>
      ${paragraphes.filter(Boolean).map((p) => `<p style="color: #374151; line-height: 1.6;">${p}</p>`).join("\n      ")}
      <div style="text-align: center; margin: 32px 0;">
        <a href="${urlSite()}/membres/cotisation"
           style="background-color: #1b5e38; color: white; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 15px;">
          ${bouton}
        </a>
      </div>
      <p style="color: #6b7280; font-size: 13px;">
        Si vous avez des questions, contactez-nous à <a href="mailto:contact@agrolide.org">contact@agrolide.org</a>
      </p>
      <p style="color: #6b7280; font-size: 12px; margin-top: 24px;">
        L'équipe agrolide, Réseau africain de l'agriculture
      </p>
    </div>
  `
  return { sujet, html, notification }
}
