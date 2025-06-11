"use server"

import { createServerClient } from "@/lib/supabase/server"

// Función para verificar si existe algún administrador
export async function checkAdminExists() {
  try {
    const supabase = createServerClient()

    // Consultar si hay algún usuario con rol de administrador
    const { data, error, count } = await supabase.from("users").select("*", { count: "exact" }).eq("role", "admin")

    if (error) {
      console.error("Error al verificar administradores:", error.message)
      return { exists: false, error: error.message }
    }

    return { exists: count && count > 0, admins: data }
  } catch (error) {
    console.error("Error al verificar administradores:", error)
    return { exists: false, error: String(error) }
  }
}

// Función para crear un administrador
export async function createAdminUser(name: string, email: string, password: string) {
  try {
    // Verificar si ya existe un administrador
    const { exists, error: checkError } = await checkAdminExists()

    if (checkError) {
      return { success: false, error: checkError }
    }

    // Si ya existe un administrador, no permitir crear otro desde esta función
    if (exists) {
      return { success: false, error: "Ya existe un administrador en el sistema" }
    }

    const supabase = createServerClient()

    // Crear usuario en Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          role: "admin",
        },
      },
    })

    if (authError || !authData.user) {
      return { success: false, error: authError?.message || "Error al crear el usuario" }
    }

    // Insertar en la tabla users
    const { error: insertError } = await supabase.from("users").insert({
      id: authData.user.id,
      email,
      name,
      role: "admin",
      is_superuser: true, // El primer administrador es superusuario
    })

    if (insertError) {
      return { success: false, error: insertError.message }
    }

    return { success: true }
  } catch (error) {
    console.error("Error al crear administrador:", error)
    return { success: false, error: String(error) }
  }
}

// Alias para mantener compatibilidad con código existente
export const createAdmin = createAdminUser

// Función para verificar si un usuario es superusuario
export async function checkSuperUser(userId: string) {
  try {
    const supabase = createServerClient()

    const { data, error } = await supabase.from("users").select("is_superuser").eq("id", userId).single()

    if (error) {
      console.error("Error al verificar superusuario:", error.message)
      return { isSuperUser: false, error: error.message }
    }

    return { isSuperUser: data?.is_superuser === true, error: null }
  } catch (error) {
    console.error("Error al verificar superusuario:", error)
    return { isSuperUser: false, error: String(error) }
  }
}
