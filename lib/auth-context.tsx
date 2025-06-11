"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { User } from "./models"
import { useSupabase } from "./supabase/client"
import { useRouter } from "next/navigation"

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>
  register: (email: string, password: string, name: string) => Promise<{ success: boolean; message?: string }>
  logout: () => Promise<void>
  isAdmin: boolean
  isSuperuser: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const supabase = useSupabase()
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        setIsLoading(true)

        // Verificar si hay una sesión activa
        const {
          data: { session },
        } = await supabase.auth.getSession()

        if (session) {
          // Obtener datos del usuario desde la tabla users
          const { data: userData, error } = await supabase.from("users").select("*").eq("id", session.user.id).single()

          if (userData) {
            setUser({
              id: userData.id,
              email: userData.email,
              name: userData.name || "",
              role: userData.role as "admin" | "user",
              isSuperuser: userData.is_superuser || false,
            })
          } else if (session.user) {
            // Si no hay datos en la tabla users pero hay sesión, crear un usuario básico
            setUser({
              id: session.user.id,
              email: session.user.email || "",
              name: session.user.user_metadata.name || "",
              role: "user", // Por defecto, asignar rol de usuario
              isSuperuser: false,
            })
          }
        }
      } catch (error) {
        console.error("Error checking authentication:", error)
      } finally {
        setIsLoading(false)
      }
    }

    // Suscribirse a cambios en la autenticación
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN" && session) {
        // Obtener datos del usuario desde la tabla users
        const { data: userData } = await supabase.from("users").select("*").eq("id", session.user.id).single()

        if (userData) {
          setUser({
            id: userData.id,
            email: userData.email,
            name: userData.name || "",
            role: userData.role as "admin" | "user",
            isSuperuser: userData.is_superuser || false,
          })
        } else if (session.user) {
          // Si no hay datos en la tabla users, crear un usuario básico
          setUser({
            id: session.user.id,
            email: session.user.email || "",
            name: session.user.user_metadata.name || "",
            role: "user",
            isSuperuser: false,
          })
        }
      } else if (event === "SIGNED_OUT") {
        setUser(null)
      }
    })

    checkAuth()

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase])

  const login = async (email: string, password: string): Promise<{ success: boolean; message?: string }> => {
    try {
      setIsLoading(true)

      console.log("Intentando iniciar sesión con:", email)

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        console.error("Error de inicio de sesión:", error.message)
        return {
          success: false,
          message: `Error: ${error.message}`,
        }
      }

      if (!data.session) {
        console.error("No se creó sesión")
        return {
          success: false,
          message: "No se pudo crear la sesión",
        }
      }

      console.log("Inicio de sesión exitoso, usuario:", data.user?.id)
      router.refresh()
      return { success: true }
    } catch (error: any) {
      console.error("Error inesperado en inicio de sesión:", error)
      return {
        success: false,
        message: `Error inesperado: ${error?.message || "Desconocido"}`,
      }
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (
    email: string,
    password: string,
    name: string,
  ): Promise<{ success: boolean; message?: string }> => {
    try {
      setIsLoading(true)

      console.log("Intentando registrar usuario:", email)

      // 1. Registrar usuario en Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name },
        },
      })

      if (authError) {
        console.error("Error en registro de autenticación:", authError.message)
        return {
          success: false,
          message: `Error de registro: ${authError.message}`,
        }
      }

      if (!authData.user) {
        console.error("No se creó el usuario")
        return {
          success: false,
          message: "No se pudo crear el usuario",
        }
      }

      console.log("Usuario registrado con ID:", authData.user.id)

      // 2. Crear entrada en la tabla users
      const { error: dbError } = await supabase.from("users").insert({
        id: authData.user.id,
        email,
        name,
        role: "user",
        is_superuser: false,
      })

      if (dbError) {
        console.error("Error al crear registro en base de datos:", dbError.message)
        return {
          success: false,
          message: `Error al crear perfil: ${dbError.message}`,
        }
      }

      console.log("Perfil de usuario creado correctamente")

      // Si la confirmación de email está activada, informamos al usuario
      if (authData.session === null) {
        console.log("Se requiere confirmación de email")
        return {
          success: true,
          message: "Registro exitoso. Por favor, verifica tu email para activar tu cuenta.",
        }
      }

      // Si no se requiere confirmación, iniciamos sesión automáticamente
      console.log("Registro e inicio de sesión exitosos")
      router.refresh()
      return { success: true }
    } catch (error: any) {
      console.error("Error inesperado en registro:", error)
      return {
        success: false,
        message: `Error inesperado: ${error?.message || "Desconocido"}`,
      }
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    try {
      await supabase.auth.signOut()
      router.refresh()
      router.push("/login")
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  const isAuthenticated = !!user
  const isAdmin = user?.role === "admin"
  const isSuperuser = user?.isSuperuser || false

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated,
        login,
        register,
        logout,
        isAdmin,
        isSuperuser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
