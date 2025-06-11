"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import ProfileForm from "./profile-form"
import PasswordForm from "./password-form"
import DeleteAccountForm from "./delete-account-form"
import HistorialCotizaciones from "./historial-cotizaciones"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { User, AlertTriangle } from "lucide-react"

export default function PerfilPage() {
  const { user, isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("info")
  const [showProfileForm, setShowProfileForm] = useState(false)
  const [showPasswordForm, setShowPasswordForm] = useState(false)
  const [showHistorial, setShowHistorial] = useState(false)

  // Verificar autenticación
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      console.log("No autenticado, redirigiendo a login")
      router.push("/login")
    }
  }, [isLoading, isAuthenticated, router])

  // Si está cargando, mostrar un mensaje de carga
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-24 flex justify-center items-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Cargando perfil...</h1>
          <p>Por favor espera mientras cargamos tu información.</p>
        </div>
      </div>
    )
  }

  // Si no está autenticado, no mostrar nada (la redirección se manejará en el useEffect)
  if (!isAuthenticated || !user) {
    return null
  }

  // Formatear la fecha de creación
  /*const createdAt = user.created_at
    ? new Date(user.created_at).toLocaleDateString("es-ES", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Fecha desconocida"*/

  return (
    <div className="container mx-auto px-4 py-24">
      <h1 className="text-3xl font-bold mb-8 text-center">Mi Perfil</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Información del perfil */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Información Personal
            </CardTitle>
            <CardDescription>Aquí puedes ver y editar tu información personal</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Nombre</h3>
                  <p className="text-lg">{user.name || "No especificado"}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Correo electrónico</h3>
                  <p className="text-lg">{user.email}</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mt-6">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowProfileForm(!showProfileForm)
                    setShowPasswordForm(false)
                    setShowHistorial(false)
                  }}
                >
                  {showProfileForm ? "Cancelar" : "Editar Perfil"}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowPasswordForm(!showPasswordForm)
                    setShowProfileForm(false)
                    setShowHistorial(false)
                  }}
                >
                  {showPasswordForm ? "Cancelar" : "Cambiar Contraseña"}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowHistorial(!showHistorial)
                    setShowProfileForm(false)
                    setShowPasswordForm(false)
                  }}
                >
                  {showHistorial ? "Ocultar Historial" : "Historial de mis Cotizaciones"}
                </Button>
              </div>

              {showProfileForm && <ProfileForm user={user} onSuccess={() => setShowProfileForm(false)} />}
              {showPasswordForm && <PasswordForm onSuccess={() => setShowPasswordForm(false)} />}
              {showHistorial && <HistorialCotizaciones userId={user.id} />}
            </div>
          </CardContent>
        </Card>

        {/* Zona de peligro */}
        <Card className="border-red-200">
          <CardHeader className="border-b border-red-200">
            <CardTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="h-5 w-5" />
              Zona de Peligro
            </CardTitle>
            <CardDescription>Acciones que pueden afectar permanentemente tu cuenta</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <DeleteAccountForm />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
