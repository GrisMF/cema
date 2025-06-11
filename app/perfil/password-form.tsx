"use client"

import { useState } from "react"
import { useActionState } from "react"
import { changePassword } from "@/app/actions/profile-actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, CheckCircle } from "lucide-react"

export default function PasswordForm() {
  const [showForm, setShowForm] = useState(false)
  const [state, action, isPending] = useActionState(changePassword, null)

  // Manejar la redirección después de cambiar la contraseña
  if (state?.success && state?.action === "redirect_to_login") {
    // Usar window.location para una recarga completa de la página
    window.location.href = "/login?password_changed=true"
    return null
  }

  return (
    <div className="mt-6">
      <h2 className="text-xl font-semibold mb-4">Cambiar Contraseña</h2>

      {!showForm ? (
        <Button onClick={() => setShowForm(true)} variant="outline">
          Cambiar Contraseña
        </Button>
      ) : (
        <div className="bg-gray-50 p-4 rounded-lg border">
          {state?.success && !state?.action && (
            <Alert className="mb-4 bg-green-50 border-green-200">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">{state.message}</AlertDescription>
            </Alert>
          )}

          {state?.success === false && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{state.message}</AlertDescription>
            </Alert>
          )}

          <form action={action} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Contraseña Actual</Label>
              <Input
                id="currentPassword"
                name="currentPassword"
                type="password"
                required
                minLength={6}
                disabled={isPending}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="newPassword">Nueva Contraseña</Label>
              <Input id="newPassword" name="newPassword" type="password" required minLength={8} disabled={isPending} />
              <p className="text-xs text-gray-500">La contraseña debe tener al menos 8 caracteres</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmar Nueva Contraseña</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                minLength={8}
                disabled={isPending}
              />
            </div>

            <div className="flex space-x-2">
              <Button type="submit" disabled={isPending}>
                {isPending ? "Cambiando..." : "Cambiar Contraseña"}
              </Button>
              <Button type="button" variant="outline" onClick={() => setShowForm(false)} disabled={isPending}>
                Cancelar
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
