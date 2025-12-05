import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Protect registration verification routes - only require login
  if (pathname.startsWith('/registration')) {
    const loginVerified = request.cookies.get('login_verified')?.value
    
    // For /registration/email and /registration/text: requires login only
    if (pathname === '/registration/email' || pathname === '/registration/text') {
      if (!loginVerified || loginVerified !== 'true') {
        const url = request.nextUrl.clone()
        url.pathname = '/'
        return NextResponse.redirect(url)
      }
    }
    
    // Block access to /registration page (removed from flow)
    if (pathname === '/registration' || pathname === '/registration/') {
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

