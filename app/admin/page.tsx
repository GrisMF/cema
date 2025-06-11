"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useSupabase } from "@/lib/supabase/client"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, Settings, FileText, Database, BarChart } from "lucide-react"

export default function AdminPage() {
  const router = useRouter()
  const supabase = useSupabase()
  const [isSuperUser, setIsSuperUser] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [cotizacionesPendientes, setCotizacionesPendientes] = useState(0)

  useEffect(() => {
    async function checkSuperUser() {
      try {
        setIsLoading(true)
        const {
          data: { session },
        } = await supabase.auth.getSession()

        if (!session) {
          router.push("/login")
          return
        }

        const { data: userData, error } = await supabase
          .from("users")
          .select("is_superuser")
          .eq("id", session.user.id)
          .single()

        if (error) {
          console.error("Error al verificar superusuario:", error)
          router.push("/")
          return
        }

        setIsSuperUser(userData.is_superuser)

        // Obtener conteo de cotizaciones pendientes
        const { count, error: countError } = await supabase
          .from("cotizaciones")
          .select("*", { count: "exact", head: true })
          .eq("estado", "en proceso")

        if (!countError) {
          setCotizacionesPendientes(count || 0)
        }
      } catch (error) {
        console.error("Error:", error)
      } finally {
        setIsLoading(false)
      }
    }

    checkSuperUser()
  }, [supabase, router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando panel de administración...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Panel de Administración</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Tarjeta de Gestión de Usuarios */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              <span>Gestión de Usuarios</span>
            </CardTitle>
            <CardDescription>Administra los usuarios del sistema</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500">
              Crea, edita y elimina usuarios. Asigna roles y permisos según sea necesario.
            </p>
          </CardContent>
          <CardFooter>
            <Link href="/admin/usuarios" className="w-full">
              <Button className="w-full">Gestionar Usuarios</Button>
            </Link>
          </CardFooter>
        </Card>

        {/* Tarjeta de Configuración del Sistema */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              <span>Configuración</span>
            </CardTitle>
            <CardDescription>Configura parámetros del sistema</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500">
              Ajusta la configuración global, como tasas de IVA, tipos de cambio y otros parámetros.
            </p>
          </CardContent>
          <CardFooter>
            <Link href="/admin/configuracion" className="w-full">
              <Button className="w-full">Configurar Sistema</Button>
            </Link>
          </CardFooter>
        </Card>

        {/* Nueva Tarjeta de Gestión de Cotizaciones */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              <span>Solicitudes de Cotización</span>
            </CardTitle>
            <CardDescription>Gestiona las solicitudes de cotización</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500">
              Revisa, acepta o rechaza las solicitudes de cotización de los clientes.
            </p>
            {cotizacionesPendientes > 0 && (
              <div className="mt-2 bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm inline-flex items-center">
                <span className="font-medium">{cotizacionesPendientes}</span>
                <span className="ml-1">pendientes</span>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Link href="/admin/cotizaciones" className="w-full">
              <Button className="w-full">Ver Solicitudes</Button>
            </Link>
          </CardFooter>
        </Card>

        {/* Tarjeta de Base de Datos */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              <span>Base de Datos</span>
            </CardTitle>
            <CardDescription>Gestiona la información almacenada</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500">
              Realiza copias de seguridad, restaura datos y gestiona la información del sistema.
            </p>
          </CardContent>
          <CardFooter>
            <Button className="w-full" onClick={() => alert("Funcionalidad en desarrollo")}>
              Gestionar Datos
            </Button>
          </CardFooter>
        </Card>

        {/* Tarjeta de Estadísticas */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart className="h-5 w-5" />
              <span>Estadísticas</span>
            </CardTitle>
            <CardDescription>Visualiza métricas y reportes</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500">
              Consulta estadísticas de uso, cotizaciones generadas y otros indicadores clave.
            </p>
          </CardContent>
          <CardFooter>
            <Link href="/admin/estadisticas" className="w-full">
              <Button className="w-full">Ver Estadísticas</Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
