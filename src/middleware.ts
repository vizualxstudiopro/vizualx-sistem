import { type NextRequest, NextResponse } from 'next/server'
import { updateSession } from '@/lib/supabase'

export async function middleware(request: NextRequest) {
  try {
    return await updateSession(request)
  } catch {
    return NextResponse.next({ request })
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - portfolio/ (portfolio images)
     * - Static file extensions (.png, .jpg, .svg, .ico, .webp, .gif, .mp4, .pdf, .apk, .html)
     */
    '/((?!_next/static|_next/image|favicon\\.ico|portfolio/|.*\\.(?:png|jpg|jpeg|svg|ico|webp|gif|mp4|pdf|apk|html)$).*)',
  ],
}
