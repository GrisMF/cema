"use server"

import { createClient } from "@supabase/supabase-js"
import { createServerClient } from "@/lib/supabase/server"
import type { Database } from "@/lib/supabase/database.types"

// Cliente de Supabase con la clave de servicio para operaciones administrativas
const supabaseAdmin = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
)

// Verificar si el usuario actual es superusuario
async function isSuperUser() {
  const supabase = createServerClient()

  try {
    const {
      data: { session },
    } = await supabase.auth.getSession()
    if (!session) return false

    const { data: userData, error } = await supabase
      .from("users")
      .select("is_superuser")
      .eq("id", session.user.id)
      .single()

    if (error || !userData) return false

    return userData.is_superuser === true
  } catch (error) {
    console.error("Error al verificar superusuario:", error)
    return false
  }
}

// Obtener todos los usuarios
export async function getAllUsers() {
  try {
    // Verificar si el usuario actual es superusuario
    const superuser = await isSuperUser()
    if (!superuser) {
      return {
        success: false,
        message: "No tienes permisos para realizar esta acción",
        users: [],
      }
    }

    // Obtener todos los usuarios
    const { data: users, error } = await supabaseAdmin
      .from("users")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) throw error

    return {
      success: true,
      users: users || [],
    }
  } catch (error: any) {
    console.error("Error al obtener usuarios:", error)
    return {
      success: false,
      message: error.message || "Error al obtener usuarios",
      users: [],
    }
  }
}

// Cambiar el rol de un usuario
export async function changeUserRole(userId: string, newRole: "user" | "admin") {
  try {
    // Verificar si el usuario actual es superusuario
    const superuser = await isSuperUser()
    if (!superuser) {
      return {
        success: false,
        message: "No tienes permisos para realizar esta acción",
      }
    }

    // Actualizar el rol del usuario
    const { error } = await supabaseAdmin.from("users").update({ role: newRole }).eq("id", userId)

    if (error) throw error

    return {
      success: true,
      message: `Rol actualizado correctamente a ${newRole}`,
    }
  } catch (error: any) {
    console.error("Error al cambiar rol de usuario:", error)
    return {
      success: false,
      message: error.message || "Error al cambiar rol de usuario",
    }
  }
}

// Eliminar un usuario
export async function deleteUser(userId: string) {
  try {
    // Verificar si el usuario actual es superusuario
    const superuser = await isSuperUser()
    if (!superuser) {
      return {
        success: false,
        message: "No tienes permisos para realizar esta acción",
      }
    }

    // Eliminar el usuario de Auth
    const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(userId)

    if (authError) throw authError

    return {
      success: true,
      message: "Usuario eliminado correctamente",
    }
  } catch (error: any) {
    console.error("Error al eliminar usuario:", error)
    return {
      success: false,
      message: error.message || "Error al eliminar usuario",
    }
  }
}
