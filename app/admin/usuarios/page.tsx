"use client"

import { useEffect, useState } from "react"
import { useSupabase } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export default function GestionUsuarios() {
  const supabase = useSupabase()
  const router = useRouter()
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [users, setUsers] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSuperuser, setIsSuperuser] = useState(false)
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
          router.push("/login")
          return
        }

        // Obtener datos del usuario actual
        const { data: userData, error } = await supabase.from("users").select("*").eq("id", session.user.id).single()

        if (error) {
          console.error("Error al obtener datos del usuario:", error)
          return
        }

        setCurrentUser(userData)
        setIsSuperuser(userData.is_superuser === true)

        // Si no es superusuario, redirigir
        if (!userData.is_superuser) {
          router.push("/admin")
          return
        }

        // Obtener todos los usuarios
        const { data: allUsers, error: usersError } = await supabase
          .from("users")
          .select("*")
          .order("created_at", { ascending: false })

        if (usersError) {
          console.error("Error al obtener usuarios:", usersError)
          return
        }

        setUsers(allUsers || [])
      } catch (error) {
        console.error("Error:", error)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [supabase, router])

  const toggleAdminRole = async (userId: string, currentRole: string) => {
    try {
      const newRole = currentRole === "admin" ? "user" : "admin"

      const { error } = await supabase.from("users").update({ role: newRole }).eq("id", userId)

      if (error) {
        setMessage(`Error al actualizar rol: ${error.message}`)
        return
      }

      // Actualizar la lista de usuarios
      setUsers(users.map((user) => (user.id === userId ? { ...user, role: newRole } : user)))

      setMessage(`Usuario actualizado correctamente`)
    } catch (error) {
      console.error("Error:", error)
      setMessage("Error al actualizar usuario")
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

  if (!isSuperuser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
          <h1 className="text-2xl font-bold mb-6 text-center">Acceso Denegado</h1>
          <p className="text-center mb-6">Solo los superusuarios pueden acceder a esta página.</p>
          <Button onClick={() => router.push("/admin")} className="w-full">
            Volver al Panel de Administración
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Gestión de Usuarios</h1>

      {message && (
        <div
          className={`mb-6 p-4 rounded-lg ${
            message.includes("Error") ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
          }`}
        >
          {message}
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rol</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Superusuario
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{user.name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{user.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      user.role === "admin" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      user.is_superuser ? "bg-purple-100 text-purple-800" : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {user.is_superuser ? "Sí" : "No"}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  {user.id !== currentUser.id && !user.is_superuser && (
                    <Button
                      onClick={() => toggleAdminRole(user.id, user.role)}
                      variant="outline"
                      size="sm"
                      className="mr-2"
                    >
                      {user.role === "admin" ? "Quitar Admin" : "Hacer Admin"}
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6">
        <Button onClick={() => router.push("/admin")} variant="outline">
          Volver al Panel de Administración
        </Button>
      </div>
    </div>
  )
}
