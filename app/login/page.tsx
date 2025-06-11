"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Clock, CheckCircle, Loader2 } from "lucide-react"
import Image from "next/image"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [error, setError] = useState("")
  const [successMessage, setSuccessMessage] = useState("")
  const [isLoggingIn, setIsLoggingIn] = useState(false)
  const [isRegistering, setIsRegistering] = useState(false)
  const [cooldownTime, setCooldownTime] = useState(0)
  const [activeTab, setActiveTab] = useState("login")
  const [registrationSuccess, setRegistrationSuccess] = useState(false)
  const { login, register } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()

  // Verificar si hay mensajes de éxito en los parámetros de la URL
  useEffect(() => {
    const accountDeleted = searchParams.get("accountDeleted")
    const registered = searchParams.get("registered")

    if (accountDeleted === "true") {
      setSuccessMessage("Tu cuenta ha sido eliminada correctamente.")
    } else if (registered === "true") {
      setSuccessMessage("Te has registrado correctamente. Ahora puedes iniciar sesión.")
    }
  }, [searchParams])

  // Temporizador para el cooldown
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null

    if (cooldownTime > 0) {
      timer = setInterval(() => {
        setCooldownTime((prev) => {
          if (prev <= 1) {
            if (timer) clearInterval(timer)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }

    return () => {
      if (timer) clearInterval(timer)
    }
  }, [cooldownTime])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccessMessage("")
    setIsLoggingIn(true)

    try {
      console.log("Iniciando proceso de login para:", email)
      const result = await login(email, password)

      if (result.success) {
        console.log("Login exitoso, redirigiendo...")
        router.push("/cotizador")
      } else {
        console.log("Login fallido:", result.message)
        setError(result.message || "Credenciales incorrectas. Por favor, inténtalo de nuevo.")
      }
    } catch (err: any) {
      console.error("Error inesperado en login:", err)
      setError(`Error al iniciar sesión: ${err?.message || "Ocurrió un error desconocido"}`)
    } finally {
      setIsLoggingIn(false)
    }
  }

  const extractWaitTime = (errorMessage: string): number => {
    // Buscar patrones como "after X seconds" o "después de X segundos"
    const matches =
      errorMessage.match(/after\s+(\d+)\s+seconds/i) ||
      errorMessage.match(/después\s+de\s+(\d+)\s+segundos/i) ||
      errorMessage.match(/(\d+)\s+seconds/i) ||
      errorMessage.match(/(\d+)\s+segundos/i)

    if (matches && matches[1]) {
      const seconds = Number.parseInt(matches[1], 10)
      return isNaN(seconds) ? 30 : seconds
    }

    return 30 // Valor predeterminado si no podemos extraer el tiempo
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccessMessage("")

    // No permitir registro durante el cooldown
    if (cooldownTime > 0) {
      setError(`Por favor, espera ${cooldownTime} segundos antes de intentar registrarte de nuevo.`)
      return
    }

    setIsRegistering(true)

    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.")
      setIsRegistering(false)
      return
    }

    try {
      console.log("Iniciando proceso de registro para:", email)
      const result = await register(email, password, name)

      if (result.success) {
        if (result.message) {
          // Si hay un mensaje pero fue exitoso, probablemente necesita verificación
          setRegistrationSuccess(true)
          setSuccessMessage(result.message)
          setActiveTab("login") // Cambiar a la pestaña de login
        } else {
          // Registro e inicio de sesión automático exitosos
          console.log("Registro exitoso, redirigiendo...")
          router.push("/cotizador")
        }
      } else {
        console.log("Registro fallido:", result.message)
        setError(result.message || "No se pudo completar el registro. Por favor, inténtalo de nuevo.")
      }
    } catch (err: any) {
      console.error("Error inesperado en registro:", err)

      // Convertir el error a string para facilitar la búsqueda de patrones
      const errorMessage = err?.message || err?.toString() || "Error desconocido"

      // Verificar si es un error de cooldown
      if (
        errorMessage.includes("security purposes") ||
        errorMessage.includes("seconds") ||
        errorMessage.toLowerCase().includes("seguridad") ||
        errorMessage.toLowerCase().includes("segundos")
      ) {
        // Extraer el tiempo de espera
        const waitTime = extractWaitTime(errorMessage)

        // Establecer el cooldown
        setCooldownTime(waitTime)
        setError(`Por razones de seguridad, debes esperar ${waitTime} segundos antes de intentar registrarte de nuevo.`)
      } else {
        setError(`Error al registrarse: ${errorMessage}`)
      }
    } finally {
      setIsRegistering(false)
    }
  }

  const handleTabChange = (value: string) => {
    setActiveTab(value)
    setError("") // Limpiar errores al cambiar de pestaña
    setSuccessMessage("") // Limpiar mensajes de éxito al cambiar de pestaña
    setRegistrationSuccess(false) // Resetear el estado de registro exitoso
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 pt-16 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Image
            src="/images/cema-logo.png"
            alt="CEMA - Organismo de Certificación"
            width={200}
            height={80}
            className="mx-auto"
          />
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Bienvenido</h2>
          <p className="mt-2 text-sm text-gray-600">Accede a tu cuenta para utilizar el cotizador</p>
        </div>

        {successMessage && (
          <Alert className="mb-6 bg-green-50 border-green-200">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">{successMessage}</AlertDescription>
          </Alert>
        )}

        {registrationSuccess && (
          <Alert className="mb-6 bg-green-50 border-green-200">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              ¡Registro exitoso! Ahora puedes iniciar sesión con tus credenciales.
            </AlertDescription>
          </Alert>
        )}

        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Iniciar Sesión</TabsTrigger>
            <TabsTrigger value="register">Registrarse</TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <Card>
              <CardContent className="pt-6">
                {error && (
                  <Alert variant="destructive" className="mb-6">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <form onSubmit={handleLogin} className="space-y-6">
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

                  <div className="space-y-2">
                    <Label htmlFor="password">Contraseña</Label>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>

                  <Button type="submit" className="w-full" disabled={isLoggingIn}>
                    {isLoggingIn ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Iniciando sesión...
                      </>
                    ) : (
                      "Iniciar sesión"
                    )}
                  </Button>

                  <div className="mt-4 text-center">
                    <Link href="/recuperar-password" className="text-sm text-blue-600 hover:text-blue-800">
                      ¿Olvidaste tu contraseña?
                    </Link>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="register">
            <Card>
              <CardContent className="pt-6">
                {error && cooldownTime > 0 ? (
                  <Alert className="mb-6 bg-yellow-50 border-yellow-200">
                    <Clock className="h-4 w-4 text-yellow-600" />
                    <AlertDescription className="text-yellow-800">{error}</AlertDescription>
                  </Alert>
                ) : error ? (
                  <Alert variant="destructive" className="mb-6">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                ) : null}

                {cooldownTime > 0 && !error && (
                  <Alert className="mb-6 bg-yellow-50 border-yellow-200">
                    <Clock className="h-4 w-4 text-yellow-600" />
                    <AlertDescription className="text-yellow-800">
                      Por favor espera {cooldownTime} segundos antes de intentar registrarte de nuevo.
                    </AlertDescription>
                  </Alert>
                )}

                <form onSubmit={handleRegister} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="register-name">Nombre</Label>
                    <Input
                      id="register-name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      placeholder="Tu nombre"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="register-email">Correo electrónico</Label>
                    <Input
                      id="register-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder="correo@ejemplo.com"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="register-password">Contraseña</Label>
                    <Input
                      id="register-password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={6}
                    />
                    <p className="text-xs text-gray-500">La contraseña debe tener al menos 6 caracteres</p>
                  </div>

                  <Button type="submit" className="w-full" disabled={isRegistering || cooldownTime > 0}>
                    {isRegistering ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Registrando...
                      </>
                    ) : cooldownTime > 0 ? (
                      `Espera ${cooldownTime}s`
                    ) : (
                      "Registrarse"
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
