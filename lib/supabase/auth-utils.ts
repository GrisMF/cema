"use client"

import { AuthError } from "@supabase/supabase-js"

export function getAuthErrorMessage(error: AuthError | Error | unknown): string {
  if (!error) return "Ocurrió un error desconocido"

  if (error instanceof AuthError) {
    // Manejar errores específicos de Supabase Auth
    switch (error.message) {
      case "Invalid login credentials":
        return "Credenciales de inicio de sesión inválidas"
      case "Email not confirmed":
        return "Por favor, confirma tu correo electrónico antes de iniciar sesión"
      case "Email already in use":
        return "Este correo electrónico ya está registrado"
      case "Password should be at least 6 characters":
        return "La contraseña debe tener al menos 6 caracteres"
      default:
        return error.message || "Error de autenticación"
    }
  }

  // Para otros tipos de errores
  if (error instanceof Error) {
    return error.message
  }

  return "Ocurrió un error desconocido"
}
