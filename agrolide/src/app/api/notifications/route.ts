import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function PUT(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: "Non autorisé." }, { status: 401 })
    }
    const token = authHeader.split(' ')[1]

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
    const supabase = createClient(supabaseUrl, supabaseKey)

    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    if (authError || !user) {
      return NextResponse.json({ error: "Session invalide." }, { status: 401 })
    }

    // Tout marquer comme lu
    const { error } = await supabase
      .from('notifications')
      .update({ lu: true })
      .eq('user_id', user.id)
      .eq('lu', false)

    if (error) throw error

    return NextResponse.json({ success: true })

  } catch (error: any) {
    console.error("API Notifications Error:", error)
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 })
  }
}
