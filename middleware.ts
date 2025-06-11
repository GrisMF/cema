import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import type { Database } from "@/lib/supabase/database.types"

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const pathname = req.nextUrl.pathname

  // Crear cliente de Supabase para el middleware
  const supabase = createMiddlewareClient<Database>({ req, res })

  // Verificar la sesión
  const {
    data: { session },
  } = await supabase.auth.getSession()

  // IMPORTANTE: Excluir explícitamente la ruta de perfil del middleware
  if (pathname === "/perfil" || pathname.startsWith("/perfil/")) {
    return res
  }

  // Rutas que requieren autenticación
  const protectedRoutes = ["/cotizador", "/admin"]

  // Rutas especiales que no deben ser redirigidas
  const specialRoutes = ["/verificar-superusuario"]

  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route))
  const isSpecialRoute = specialRoutes.some((route) => pathname === route)

  // No aplicar redirección a rutas especiales
  if (isSpecialRoute) {
    return res
  }

  // Redirigir a login si no hay sesión y la ruta está protegida
  if (!session && isProtectedRoute) {
    const redirectUrl = new URL("/login", req.url)
    return NextResponse.redirect(redirectUrl)
  }

  // Redirigir a cotizador si hay sesión y está en login
  if (session && pathname === "/login") {
    const redirectUrl = new URL("/cotizador", req.url)
    return NextResponse.redirect(redirectUrl)
  }

  // Verificar permisos de admin para rutas de admin
  if (pathname.startsWith("/admin")) {
    // Obtener el rol del usuario desde la base de datos
    const { data: userData } = await supabase.from("users").select("role").eq("id", session?.user.id).single()

    if (!userData || userData.role !== "admin") {
      // Redirigir a cotizador si no es admin
      const redirectUrl = new URL("/cotizador", req.url)
      return NextResponse.redirect(redirectUrl)
    }
  }

  return res
}

export const config = {
  matcher: [
    // Rutas protegidas
    "/cotizador/:path*",
    "/admin/:path*",
    "/login",
  ],
}
