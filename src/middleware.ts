import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value
  const { pathname } = request.nextUrl

  // Public routes (no auth required)
  const publicPaths = ['/', '/authentication/login', '/authentication/signup', '/admin/login']
  const isPublicPath = publicPaths.includes(pathname)

  // If there's no token and trying to access protected route, redirect to login
  if (!token && !isPublicPath) {
    if (pathname.startsWith('/admin')) {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
    return NextResponse.redirect(new URL('/authentication/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/admin/:path*',
    '/authentication/login',
    '/authentication/signup',
  ],
}