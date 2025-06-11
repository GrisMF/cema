import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import type { Database } from "@/lib/supabase/database.types"

export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    const supabase = createRouteHandlerClient<Database>({ cookies })

    // Intentar confirmar el email manualmente
    // Nota: Esto requiere permisos de servicio en Supabase
    const { error } = await supabase.auth.admin.updateUserById(
      "id", // Este valor se reemplazará en el cliente
      { email_confirm: true },
    )

    if (error) {
      console.error("Error confirming email:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Error in confirm-email route:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
