"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useSupabase } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, CheckCircle, ArrowLeft } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function ActualizarPasswordPage() {
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const supabase = useSupabase()
  const router = useRouter()

  useEffect(() => {
    // Verificar si hay un hash en la URL (indicando que venimos de un enlace de restablecimiento)
    const checkSession = async () => {
      const { data, error } = await supabase.auth.getSession()
      if (error || !data.session) {
        setError("No se ha encontrado una sesión válida. Por favor, solicita un nuevo enlace de restablecimiento.")
      }
    }

    checkSession()
  }, [supabase])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess(false)
    setIsSubmitting(true)

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden")
      setIsSubmitting(false)
      return
    }

    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres")
      setIsSubmitting(false)
      return
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password,
      })

      if (error) {
        setError(error.message)
      } else {
        setSuccess(true)
        // Redirigir después de 3 segundos
        setTimeout(() => {
          router.push("/login")
        }, 3000)
      }
    } catch (err: any) {
      setError(err.message || "Ocurrió un error al actualizar la contraseña")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 pt-16 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Image
            src="/images/logo-cema.png"
            alt="CEMA - Organismo de Certificación"
            width={180}
            height={70}
            className="mx-auto"
          />
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Actualizar contraseña</h2>
          <p className="mt-2 text-sm text-gray-600">Crea una nueva contraseña para tu cuenta</p>
        </div>

        <Card>
          <CardContent className="pt-6">
            {error && (
              <Alert variant="destructive" className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert className="mb-6 bg-green-50 border-green-200">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  Tu contraseña ha sido actualizada correctamente. Serás redirigido a la página de inicio de sesión en
                  unos segundos.
                </AlertDescription>
              </Alert>
            )}

            {!success && (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="password">Nueva contraseña</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                  />
                  <p className="text-xs text-gray-500">La contraseña debe tener al menos 6 caracteres</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirmar contraseña</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>

                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? "Actualizando..." : "Actualizar contraseña"}
                </Button>

                <div className="mt-4 text-center">
                  <Link
                    href="/login"
                    className="text-sm text-blue-600 hover:text-blue-800 flex items-center justify-center"
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Volver a iniciar sesión
                  </Link>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
