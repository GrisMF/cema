"use client"

import { useState, useEffect } from "react"
import { updateProfile } from "../actions/profile-actions"
import { useActionState } from "react"

interface ProfileFormProps {
  user: {
    name: string
    email: string
  }
}

// Asegurarnos de que el formulario maneje correctamente la actualización
export default function ProfileForm({ user }: ProfileFormProps) {
  const [state, formAction, isPending] = useActionState(updateProfile, null)
  const [isEditing, setIsEditing] = useState(false)
  const [userName, setUserName] = useState(user.name)

  // Actualizar el estado local cuando cambia el usuario
  useEffect(() => {
    setUserName(user.name)
  }, [user.name])

  // Manejar la respuesta exitosa
  useEffect(() => {
    if (state?.success) {
      setIsEditing(false)
    }
  }, [state])

  return (
    <div>
      {isEditing ? (
        <form action={formAction} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Nombre
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Correo Electrónico
            </label>
            <input
              type="email"
              id="email"
              value={user.email}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50"
              disabled
            />
            <p className="mt-1 text-sm text-gray-500">El correo electrónico no se puede cambiar.</p>
          </div>

          {state && (
            <div
              className={`p-3 rounded-md ${state.success ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"}`}
            >
              {state.message}
            </div>
          )}

          <div className="flex space-x-4">
            <button
              type="submit"
              disabled={isPending}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
            >
              {isPending ? "Guardando..." : "Guardar Cambios"}
            </button>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Cancelar
            </button>
          </div>
        </form>
      ) : (
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-500">Nombre</p>
            <p className="font-medium">{userName}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Correo Electrónico</p>
            <p className="font-medium">{user.email}</p>
          </div>

          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Editar Perfil
          </button>
        </div>
      )}
    </div>
  )
}
