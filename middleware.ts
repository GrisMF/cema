// middleware.ts
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import type { Database } from "@/lib/supabase/database.types";

export async function middleware(req: NextRequest) {
  const res       = NextResponse.next();
  const pathname  = req.nextUrl.pathname;

  if (pathname === "/login" || pathname === "/") return res;

  const supabase = createMiddlewareClient<Database>({ req, res });
  const { data: { session } } = await supabase.auth.getSession();

  if (pathname.startsWith("/cotizador") || pathname.startsWith("/admin")) {
    if (!session) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    if (pathname.startsWith("/admin")) {
      const { data } = await supabase
        .from("users")
        .select("role")
        .eq("id", session.user.id)
        .single();
      if (data?.role !== "admin") {
        return NextResponse.redirect(new URL("/cotizador", req.url));
      }
    }
  }
  return res;
}

export const config = {
  matcher: ["/cotizador/:path*", "/admin/:path*"],
};
