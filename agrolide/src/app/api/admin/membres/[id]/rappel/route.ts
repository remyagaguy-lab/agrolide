import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"
import { NextRequest } from "next/server"
import { Resend } from "resend"

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient()
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) return NextResponse.json({ error: "Non autorisé" }, { status: 401 })

  const { data: profile } = await supabase.from("profiles")
    .select("role_plateforme").eq("id", session.user.id).single()
  if (!profile || !["admin_content", "super_admin"].includes(profile.role_plateforme)) {
    return NextResponse.json({ error: "Accès refusé" }, { status: 403 })
  }

  const { email, nom } = await request.json()
  if (!email || !nom) return NextResponse.json({ error: "Email et nom requis" }, { status: 400 })

  try {
    const resend = new Resend(process.env.RESEND_API_KEY)
    await resend.emails.send({
      from: "agrolide <noreply@agrolide.org>",
      to: email,
      subject: "⚠️ Votre adhésion agrolide expire bientôt",
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 32px;">
          <img src="https://agrolide.org/agrolide-png.png" alt="agrolide" style="height: 40px; margin-bottom: 24px;" />
          <h2 style="color: #1b5e38; margin-bottom: 16px;">Bonjour ${nom},</h2>
          <p style="color: #374151; line-height: 1.6;">
            Votre adhésion au réseau <strong>agrolide</strong> expire dans <strong>moins de 30 jours</strong>.
          </p>
          <p style="color: #374151; line-height: 1.6;">
            Pour continuer à bénéficier de tous les avantages du réseau (bibliothèque, forum, annuaire, formations…), 
            pensez à renouveler votre cotisation avant l'expiration.
          </p>
          <div style="text-align: center; margin: 32px 0;">
            <a href="https://agrolide.org/membres/cotisation" 
               style="background-color: #1b5e38; color: white; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 15px;">
              Renouveler mon adhésion
            </a>
          </div>
          <p style="color: #9ca3af; font-size: 13px;">
            Si vous avez des questions, contactez-nous à <a href="mailto:contact@agrolide.org">contact@agrolide.org</a>
          </p>
          <p style="color: #9ca3af; font-size: 12px; margin-top: 24px;">
            L'équipe agrolide — Réseau africain de l'agriculture
          </p>
        </div>
      `,
    })
    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
