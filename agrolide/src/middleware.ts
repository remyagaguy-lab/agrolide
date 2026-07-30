import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

const isMembreRoute = createRouteMatcher(['/membres(.*)'])
const isAdminRoute = createRouteMatcher(['/admin(.*)'])

export default clerkMiddleware(async (auth, request) => {
  const { userId, sessionClaims } = await auth()

  // Rediriger vers le login si non connecté pour routes protégées
  if ((isMembreRoute(request) || isAdminRoute(request)) && !userId) {
    const { redirectToSignIn } = await auth()
    return redirectToSignIn()
  }

  // Vérifier le rôle admin pour les routes admin
  if (isAdminRoute(request) && userId) {
    const role = (sessionClaims?.metadata as any)?.role
    if (role !== 'super_admin' && role !== 'admin_content') {
      const url = request.nextUrl.clone()
      url.pathname = '/membres/dashboard'
      return NextResponse.redirect(url)
    }
  }
})

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for Clerk's auto-proxy path
    '/__clerk/:path*',
    '/(api|trpc)(.*)',
  ],
}
