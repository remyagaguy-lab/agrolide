import 'server-only'
import { after } from 'next/server'

/**
 * Lance des envois d'e-mails APRÈS l'envoi de la réponse au visiteur : il n'attend plus les serveurs
 * du fournisseur d'e-mails (quelques centaines de millisecondes par envoi). Les envois partent ensemble.
 *
 * Un envoi raté est écrit dans les journaux, jamais renvoyé au visiteur : sa demande est déjà enregistrée
 * en base, une erreur d'e-mail ne doit pas lui faire croire qu'elle a échoué.
 * `envois` : fonctions qui renvoient la promesse de `resend.emails.send(...)`.
 */
export function envoyerApresLaReponse(nom: string, ...envois: Array<() => Promise<unknown>>) {
  after(async () => {
    const resultats = await Promise.allSettled(envois.map((envoyer) => envoyer()))
    for (const r of resultats) {
      if (r.status === 'rejected') {
        console.error(`E-mail « ${nom} » non envoyé :`, r.reason)
      } else {
        // Resend ne lève pas d'exception : il renvoie { data, error }.
        const erreur = (r.value as { error?: { message?: string } | null } | undefined)?.error
        if (erreur) console.error(`E-mail « ${nom} » refusé par Resend :`, erreur.message ?? erreur)
      }
    }
  })
}
