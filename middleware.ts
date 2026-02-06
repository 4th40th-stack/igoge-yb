import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Protect registration routes - require login for all (method picker + verification code pages)
  if (pathname.startsWith('/registration')) {
    const loginVerified = request.cookies.get('login_verified')?.value
    const isRegistrationRoute = pathname === '/registration' || pathname === '/registration/' || pathname === '/registration/email' || pathname === '/registration/text'

    if (isRegistrationRoute && (!loginVerified || loginVerified !== 'true')) {
      const url = request.nextUrl.clone()
      url.pathname = '/'
      return NextResponse.redirect(url)
    }
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/registration',
    '/registration/:path*',
  ],
}
