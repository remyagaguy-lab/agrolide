import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import { db } from '@/db'
import { documents } from '@/db/schema'
import { eq } from 'drizzle-orm'

// Initialize OpenRouter via OpenAI SDK
const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY || "dummy",
})

export async function POST(request: NextRequest) {
  try {
    const { documentId, r2Key, titre, resume } = await request.json()

    if (!documentId && !r2Key) {
      return NextResponse.json({ error: 'Missing documentId or r2Key' }, { status: 400 })
    }

    if (!process.env.OPENROUTER_API_KEY) {
      console.warn("OPENROUTER_API_KEY is not set. Skipping AI validation.")
      return NextResponse.json({ success: true, warning: 'AI validation skipped (no API key)' })
    }

    // NOTE: L'extraction du texte brut du PDF a été retirée car les librairies d'extraction
    // (comme pdf-parse) requièrent des bindings C++ ou le DOM (Canvas/DOMMatrix) non disponibles
    // dans l'environnement Vercel Serverless.
    // L'IA se basera uniquement sur le "titre" et le "resume" fournis par l'utilisateur, ce qui 
    // est suffisant pour juger de la pertinence (Agriculture) et vérifier les doublons.
    const extractedText = "(Texte intégral non extrait - L'analyse se base sur le résumé)"

    // 2. Fetch existing documents to check duplicates
    const existingDocs = await db.query.documents.findMany({
      columns: { titre: true, resume: true },
      where: eq(documents.statut, 'publie'),
      limit: 100
    })

    const existingDocsContext = existingDocs?.map(d => `- Titre: ${d.titre}\n  Résumé: ${d.resume}`).join('\n') || "Aucun document existant."

    // 3. AI Validation via OpenRouter
    const systemPrompt = `Tu es un expert agronome et modérateur pour Agrolide, une bibliothèque agricole panafricaine.
Ta mission est d'analyser un nouveau document soumis et de décider s'il doit être publié.

Règles de validation :
1. PERTINENCE : Le document DOIT concerner l'agriculture, l'agronomie, l'élevage, l'agroécologie ou l'agrobusiness en Afrique.
2. DOUBLON : Le document ne doit PAS être un doublon exact ou quasi-exact d'un document existant dans la base.

Réponds STRICTEMENT en format JSON avec cette structure :
{
  "is_valid": boolean,
  "reason": "Explication courte en français de la décision",
  "is_agriculture": boolean,
  "is_duplicate": boolean
}`

    const userPrompt = `NOUVEAU DOCUMENT À VALIDER :
Titre : ${titre}
Résumé : ${resume}
Extrait du texte : ${extractedText}

DOCUMENTS EXISTANTS DANS LA BASE :
${existingDocsContext}`

    const completion = await openai.chat.completions.create({
      model: "google/gemini-flash-1.5", // Un modèle rapide et pas cher sur OpenRouter, modifiable au besoin
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      response_format: { type: "json_object" }
    })

    const aiResponseText = completion.choices[0].message.content || "{}"
    const aiResult = JSON.parse(aiResponseText)

    // 4. Update Document Status if valid
    if (aiResult.is_valid) {
      if (documentId) {
        await db.update(documents).set({ statut: 'publie' }).where(eq(documents.id, documentId))
      } else {
        await db.update(documents).set({ statut: 'publie' }).where(eq(documents.fichier_r2_key, r2Key))
      }
      
      return NextResponse.json({ success: true, result: aiResult, action: 'published' })
    } else {
      // Rejeté par l'IA (reste 'en_attente_validation' ou passe en 'rejete')
      if (documentId) {
        await db.update(documents).set({ statut: 'rejete' }).where(eq(documents.id, documentId))
      } else {
        await db.update(documents).set({ statut: 'rejete' }).where(eq(documents.fichier_r2_key, r2Key))
      }
      
      return NextResponse.json({ success: false, result: aiResult, action: 'rejected' })
    }

  } catch (error) {
    console.error('AI Validation Error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
