"use server"

import { z } from "zod"

const subscribeSchema = z.object({
  email: z.string().email("Veuillez entrer une adresse e-mail valide."),
})

export async function addEmailToBrevo(email: string) {
  const apiKey = process.env.BREVO_API_KEY
  const listId = process.env.BREVO_NEWSLETTER_LIST_ID

  if (!apiKey || !listId) {
    console.error("Configuration Brevo manquante (BREVO_API_KEY ou BREVO_NEWSLETTER_LIST_ID)")
    return { success: false, error: "Configuration manquante" }
  }

  const response = await fetch("https://api.brevo.com/v3/contacts", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "api-key": apiKey,
    },
    body: JSON.stringify({
      email: email,
      listIds: [parseInt(listId, 10)],
      updateEnabled: true,
    }),
  })

  if (!response.ok) {
    const errorData = await response.json()
    console.error("Erreur API Brevo:", errorData)
    return { success: false, error: "Erreur API" }
  }

  return { success: true }
}

export async function subscribeToNewsletter(prevState: any, formData: FormData) {
  try {
    const rawData = {
      email: formData.get("email"),
    }

    const result = subscribeSchema.safeParse(rawData)
    if (!result.success) {
      return {
        error: result.error.errors[0].message,
        success: false,
      }
    }

    const { email } = result.data

    const brevoResult = await addEmailToBrevo(email)
    if (!brevoResult.success) {
      return {
        error: "Une erreur est survenue lors de l'inscription. Veuillez réessayer.",
        success: false,
      }
    }

    return {
      success: true,
      message: "Merci ! Vous êtes maintenant inscrit(e) à notre newsletter.",
    }
  } catch (error) {
    console.error("Erreur inattendue Newsletter:", error)
    return {
      error: "Une erreur inattendue est survenue.",
      success: false,
    }
  }
}
