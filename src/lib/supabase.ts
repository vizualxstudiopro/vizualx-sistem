import { createBrowserClient, createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
export const ADMIN_EMAIL = 'vizualxstudio@gmail.com'

// Use cookie-based SSR client in browser (for middleware compat), vanilla client on server
export const supabase =
  typeof window !== 'undefined'
    ? createBrowserClient(supabaseUrl, supabaseKey)
    : createClient(supabaseUrl, supabaseKey)

export const createBrowserSupabaseClient = () =>
  createBrowserClient(supabaseUrl, supabaseKey)

export async function updateSession(request: NextRequest) {
  const supabaseResponse = NextResponse.next({
    request,
  })

  const supabaseClient = createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options)
        )
      },
    },
  })

  // Get the current user session
  const {
    data: { user },
  } = await supabaseClient.auth.getUser()

  const pathname = request.nextUrl.pathname
  const userEmail = user?.email?.toLowerCase()
  const protectedPaths = [
    '/dashboard',
    '/clients',
    '/invoices',
    '/domains',
    '/projects',
    '/board',
    '/assets',
    '/social',
    '/analytics',
    '/te-dhenat',
    '/portfolio-manager',
    '/web-settings',
    '/settings',
    '/admin',
  ]
  const isProtectedPath = protectedPaths.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`)
  )

  if (!user && isProtectedPath) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    url.searchParams.set('redirectTo', pathname)
    return NextResponse.redirect(url)
  }

  if (user && isProtectedPath && userEmail !== ADMIN_EMAIL) {
    await supabaseClient.auth.signOut()
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    url.searchParams.set('error', 'unauthorized')
    return NextResponse.redirect(url)
  }

  // Redirect authenticated users away from the login page.
  if (user && pathname === '/login' && userEmail === ADMIN_EMAIL) {
    const url = request.nextUrl.clone()
    url.pathname = request.nextUrl.searchParams.get('redirectTo') || '/dashboard'
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}

export async function getSystemSettings() {
  try {
    const { data } = await supabase
      .from('system_settings')
      .select('*')
      .single()
    return data || { primary_color: '#FFD700', maintenance_mode: false }
  } catch {
    return { primary_color: '#FFD700', maintenance_mode: false }
  }
}

export async function updateSystemSettings(updates: Record<string, unknown>) {
  try {
    const { data } = await supabase
      .from('system_settings')
      .update(updates)
      .eq('id', 1)
      .select()
    return data?.[0]
  } catch {
  }
}

export async function clearOldAnalytics() {
  try {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    await supabase
      .from('analytics')
      .delete()
      .lt('created_at', thirtyDaysAgo.toISOString())
  } catch {
  }
}

export async function logoutAllDevices() {
  try {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  } catch {
  }
}