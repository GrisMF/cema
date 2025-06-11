import { createServerClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET() {
  const supabase = createServerClient()

  try {
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json({ isSuperUser: false })
    }

    const { data: userData, error } = await supabase
      .from("users")
      .select("is_superuser")
      .eq("id", session.user.id)
      .single()

    if (error || !userData) {
      return NextResponse.json({ isSuperUser: false })
    }

    return NextResponse.json({ isSuperUser: userData.is_superuser === true })
  } catch (error) {
    console.error("Error al verificar superusuario:", error)
    return NextResponse.json({ isSuperUser: false })
  }
}
