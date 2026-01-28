import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyToken } from './lib/auth'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Public paths that don't require authentication
  if (pathname === '/login' || pathname.startsWith('/api/auth/login')) {
    return NextResponse.next()
  }

  // Get token from cookie
  const token = request.cookies.get('auth-token')

  // Redirect to login if no token
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Verify token
  const verified = await verifyToken(token.value)
  
  if (!verified) {
    const response = NextResponse.redirect(new URL('/login', request.url))
    response.cookies.delete('auth-token')
    return response
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/api/contracts/:path*',
    '/api/stats/:path*',
  ],
}
