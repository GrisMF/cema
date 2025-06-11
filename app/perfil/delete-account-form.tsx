"use client"

import { useState } from "react"
import { useActionState } from "react"
import { deleteAccount } from "@/app/actions/profile-actions"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { useAuth } from "@/lib/auth-context"

export default function DeleteAccountForm() {
  const [showConfirmation, setShowConfirmation] = useState(false)
  const { user } = useAuth()
  const [state, action, isPending] = useActionState(async () => {
    if (!user?.id) return { success: false, message: "No se pudo identificar al usuario" }
    return deleteAccount(user.id)
  }, null)

  // Manejar la redirección después de eliminar la cuenta
  if (state?.success && state?.action === "redirect_to_login") {
    // Usar window.location para una recarga completa de la página
    const params = state.params || ""
    window.location.href = `/login?${params}`
    return null
  }

  return (
    <div className="mt-10 border-t pt-6">
      <h2 className="text-xl font-semibold mb-4 text-red-600">Zona de Peligro</h2>

      {state?.success === false && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{state.message}</AlertDescription>
        </Alert>
      )}

      {!showConfirmation ? (
        <Button onClick={() => setShowConfirmation(true)} variant="destructive">
          Eliminar mi cuenta
        </Button>
      ) : (
        <div className="bg-red-50 p-4 rounded-lg border border-red-200">
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Esta acción es irreversible. Se eliminarán todos tus datos y no podrás recuperarlos.
            </AlertDescription>
          </Alert>

          <p className="mb-4 text-sm">
            ¿Estás seguro de que deseas eliminar tu cuenta? Esta acción no se puede deshacer.
          </p>

          <div className="flex space-x-2">
            <Button onClick={() => action()} variant="destructive" disabled={isPending}>
              {isPending ? "Eliminando..." : "Sí, eliminar mi cuenta"}
            </Button>
            <Button type="button" variant="outline" onClick={() => setShowConfirmation(false)} disabled={isPending}>
              Cancelar
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
