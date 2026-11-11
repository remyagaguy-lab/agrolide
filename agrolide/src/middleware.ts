import { NextResponse, type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

/**
 * Protège /membres et /admin avec Supabase Auth.
 * - Visiteur non connecté  -> redirection vers /login?next=<page demandée>
 * - Le contrôle fin du rôle admin se fait dans app/admin/layout.tsx (D1 + app_metadata).
 * IMPORTANT : ne pas entourer ce code d'un try/catch global qui avalerait les redirections.
 */

const PROTECTED_PREFIXES = ['/membres', '/admin']

export async function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl

  const { getResponse, claims } = await updateSession(request)
  const isProtected = PROTECTED_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`))

  if (isProtected && !claims) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    url.search = `?next=${encodeURIComponent(pathname + search)}`
    return NextResponse.redirect(url)
  }

  return getResponse()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|avif|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest|pdf|txt|xml)).*)',
  ],
}
