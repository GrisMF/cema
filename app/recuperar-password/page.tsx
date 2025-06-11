"use client"

import type React from "react"

import { useState } from "react"
import { useSupabase } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, CheckCircle, ArrowLeft } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function RecuperarPasswordPage() {
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const supabase = useSupabase()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess(false)
    setIsSubmitting(true)

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/actualizar-password`,
      })

      if (error) {
        setError(error.message)
      } else {
        setSuccess(true)
      }
    } catch (err: any) {
      setError(err.message || "Ocurrió un error al enviar el correo de recuperación")
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
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Recuperar contraseña</h2>
          <p className="mt-2 text-sm text-gray-600">
            Te enviaremos un correo electrónico con instrucciones para restablecer tu contraseña
          </p>
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
                  Hemos enviado un correo electrónico con instrucciones para restablecer tu contraseña. Por favor,
                  revisa tu bandeja de entrada.
                </AlertDescription>
              </Alert>
            )}

            {!success ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email">Correo electrónico</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="correo@ejemplo.com"
                  />
                </div>

                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? "Enviando..." : "Enviar instrucciones"}
                </Button>
              </form>
            ) : (
              <div className="text-center">
                <Button variant="outline" className="mt-4" asChild>
                  <Link href="/login">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Volver a iniciar sesión
                  </Link>
                </Button>
              </div>
            )}

            {!success && (
              <div className="mt-6 text-center">
                <Link
                  href="/login"
                  className="text-sm text-blue-600 hover:text-blue-800 flex items-center justify-center"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Volver a iniciar sesión
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
