import { createClient } from "@supabase/supabase-js"
import type { Database } from "./database.types"

// Cliente de Supabase con la clave de servicio para operaciones administrativas
const supabaseAdmin = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
)

export async function createAdminUser(email: string, password: string, name: string) {
  try {
    // 1. Crear el usuario en Auth
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Confirmar el email automáticamente
    })

    if (authError) throw authError

    // 2. Verificar si hay administradores existentes
    const { data: existingAdmins, error: queryError } = await supabaseAdmin
      .from("users")
      .select("id")
      .eq("role", "admin")
      .limit(1)

    if (queryError) throw queryError

    // 3. Determinar si este será el superusuario (primer administrador)
    const isSuperuser = !existingAdmins || existingAdmins.length === 0

    // 4. Insertar en la tabla users con el rol de administrador
    const { error: insertError } = await supabaseAdmin.from("users").insert({
      id: authData.user.id,
      email,
      name,
      role: "admin",
      is_superuser: isSuperuser,
    })

    if (insertError) throw insertError

    return {
      success: true,
      user: authData.user,
      isSuperuser,
    }
  } catch (error) {
    console.error("Error al crear usuario administrador:", error)
    throw error
  }
}
