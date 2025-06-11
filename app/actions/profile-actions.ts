"use server"

import { createServerClient } from "@/lib/supabase/server"
import { createClient } from "@supabase/supabase-js"
import { revalidatePath } from "next/cache"
import { z } from "zod"

// Cliente de Supabase con la clave de servicio para operaciones administrativas
const supabaseAdmin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

// Esquema de validación para actualizar el perfil
const updateProfileSchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres").max(100),
})

// Esquema de validación para cambiar la contraseña
const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(6, "La contraseña actual debe tener al menos 6 caracteres"),
    newPassword: z.string().min(8, "La nueva contraseña debe tener al menos 8 caracteres"),
    confirmPassword: z.string().min(8, "La confirmación debe tener al menos 8 caracteres"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  })

// Modificar la función updateProfile para actualizar el campo name en la tabla users
export async function updateProfile(formData: FormData) {
  try {
    const supabase = createServerClient()

    // Obtener la sesión actual
    const {
      data: { session },
    } = await supabase.auth.getSession()
    if (!session) {
      return {
        success: false,
        message: "No has iniciado sesión",
      }
    }

    // Validar los datos del formulario
    const name = formData.get("name") as string

    try {
      updateProfileSchema.parse({ name })
    } catch (error) {
      if (error instanceof z.ZodError) {
        return {
          success: false,
          message: error.errors[0].message,
        }
      }
      return {
        success: false,
        message: "Error de validación",
      }
    }

    // Actualizar el nombre en la tabla users
    const { error: dbError } = await supabase.from("users").update({ name: name }).eq("id", session.user.id)

    if (dbError) {
      console.error("Error al actualizar el nombre en la tabla users:", dbError)
      throw dbError
    }

    // También actualizar los metadatos del usuario en Auth
    const { error: authError } = await supabase.auth.updateUser({
      data: { name: name },
    })

    if (authError) {
      console.error("Error al actualizar los metadatos del usuario:", authError)
      throw authError
    }

    revalidatePath("/perfil")

    return {
      success: true,
      message: "Perfil actualizado correctamente",
    }
  } catch (error: any) {
    console.error("Error al actualizar el perfil:", error)
    return {
      success: false,
      message: error.message || "Error al actualizar el perfil",
    }
  }
}

// Cambiar la contraseña del usuario
export async function changePassword(formData: FormData) {
  try {
    const supabase = createServerClient()

    // Obtener la sesión actual
    const {
      data: { session },
    } = await supabase.auth.getSession()
    if (!session) {
      return {
        success: false,
        message: "No has iniciado sesión",
      }
    }

    // Validar los datos del formulario
    const currentPassword = formData.get("currentPassword") as string
    const newPassword = formData.get("newPassword") as string
    const confirmPassword = formData.get("confirmPassword") as string

    try {
      changePasswordSchema.parse({ currentPassword, newPassword, confirmPassword })
    } catch (error) {
      if (error instanceof z.ZodError) {
        return {
          success: false,
          message: error.errors[0].message,
        }
      }
      return {
        success: false,
        message: "Error de validación",
      }
    }

    // Verificar la contraseña actual
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: session.user.email!,
      password: currentPassword,
    })

    if (signInError) {
      return {
        success: false,
        message: "La contraseña actual es incorrecta",
      }
    }

    // Cambiar la contraseña
    const { error: updateError } = await supabase.auth.updateUser({
      password: newPassword,
    })

    if (updateError) {
      throw updateError
    }

    // Cerrar sesión después de cambiar la contraseña
    await supabase.auth.signOut()

    // En lugar de usar redirect, devolvemos un indicador para que el cliente maneje la redirección
    return {
      success: true,
      message: "Contraseña actualizada correctamente",
      action: "redirect_to_login",
    }
  } catch (error: any) {
    console.error("Error al cambiar la contraseña:", error)
    return {
      success: false,
      message: error.message || "Error al cambiar la contraseña",
    }
  }
}

// Eliminar la cuenta del usuario
export async function deleteAccount(userId: string) {
  try {
    const supabase = createServerClient()

    // Obtener la sesión actual
    const {
      data: { session },
    } = await supabase.auth.getSession()
    if (!session) {
      return {
        success: false,
        message: "No has iniciado sesión",
      }
    }

    // Verificar que el usuario está eliminando su propia cuenta
    if (session.user.id !== userId) {
      return {
        success: false,
        message: "No tienes permiso para eliminar esta cuenta",
      }
    }

    // Eliminar el usuario de Auth
    const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(userId)

    if (authError) {
      throw authError
    }

    // Cerrar sesión después de eliminar la cuenta
    await supabase.auth.signOut()

    // En lugar de usar redirect, devolvemos un indicador para que el cliente maneje la redirección
    return {
      success: true,
      message: "Cuenta eliminada correctamente",
      action: "redirect_to_login",
      params: "account_deleted=true",
    }
  } catch (error: any) {
    console.error("Error al eliminar la cuenta:", error)
    return {
      success: false,
      message: error.message || "Error al eliminar la cuenta",
    }
  }
}
