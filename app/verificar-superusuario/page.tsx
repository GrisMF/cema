"use client"

import { useEffect, useState } from "react"
import { useSupabase } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function VerificarSuperusuario() {
  const supabase = useSupabase()
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [isSuperuser, setIsSuperuser] = useState<boolean | null>(null)
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isUpdating, setIsUpdating] = useState(false)
  const [message, setMessage] = useState("")

  useEffect(() => {
    async function checkAuth() {
      try {
        setIsLoading(true)

        // Verificar si hay una sesión activa
        const {
          data: { session },
        } = await supabase.auth.getSession()

        if (!session) {
          setMessage("No has iniciado sesión. Por favor, inicia sesión primero.")
          setIsLoading(false)
          return
        }

        // Obtener datos del usuario
        const { data: userData, error } = await supabase.from("users").select("*").eq("id", session.user.id).single()

        if (error) {
          console.error("Error al obtener datos del usuario:", error)
          setMessage("Error al obtener datos del usuario: " + error.message)
          setIsLoading(false)
          return
        }

        setUser({
          id: userData.id,
          email: userData.email,
          name: userData.name,
          role: userData.role,
        })

        setIsAdmin(userData.role === "admin")
        setIsSuperuser(userData.is_superuser === true)
      } catch (error) {
        console.error("Error:", error)
        setMessage("Error al verificar la autenticación")
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [supabase])

  const hacerseSuperusuario = async () => {
    if (!user) return

    try {
      setIsUpdating(true)
      setMessage("Actualizando...")

      const { error } = await supabase.from("users").update({ is_superuser: true }).eq("id", user.id)

      if (error) {
        console.error("Error al actualizar:", error)
        setMessage("Error al actualizar: " + error.message)
        return
      }

      setIsSuperuser(true)
      setMessage("¡Ahora eres superusuario! Puedes acceder al panel de administración de usuarios.")
    } catch (error) {
      console.error("Error:", error)
      setMessage("Error al actualizar")
    } finally {
      setIsUpdating(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Verificar Superusuario</h1>

        {!user ? (
          <div className="text-center">
            <p className="mb-4">No has iniciado sesión. Por favor, inicia sesión primero.</p>
            <Link href="/login">
              <Button className="w-full">Ir a Login</Button>
            </Link>
          </div>
        ) : (
          <>
            <div className="mb-6 p-4 bg-gray-100 rounded-lg">
              <p className="font-medium">Usuario actual:</p>
              <p>Nombre: {user?.name}</p>
              <p>Email: {user?.email}</p>
              <p>Rol: {user?.role}</p>
              <p>Superusuario: {isSuperuser === null ? "Verificando..." : isSuperuser ? "Sí" : "No"}</p>
            </div>

            {message && (
              <div
                className={`mb-6 p-4 rounded-lg ${
                  message.includes("Error") ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
                }`}
              >
                {message}
              </div>
            )}

            {isAdmin && !isSuperuser && (
              <Button onClick={hacerseSuperusuario} disabled={isUpdating} className="w-full">
                {isUpdating ? "Actualizando..." : "Hacerme Superusuario"}
              </Button>
            )}

            <div className="mt-4 flex justify-between">
              {isAdmin && (
                <Button variant="outline" onClick={() => router.push("/admin")} className="w-1/2 mr-2">
                  Panel Admin
                </Button>
              )}
              <Button
                variant="outline"
                onClick={() => router.push("/cotizador")}
                className={isAdmin ? "w-1/2 ml-2" : "w-full"}
              >
                Cotizador
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
