"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { createAdmin, checkAdminExists } from "../actions/admin-actions"
import { useRouter } from "next/navigation"

export default function SetupAdminPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [secretKey, setSecretKey] = useState("")
  const [message, setMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [adminExists, setAdminExists] = useState(false)
  const [isCheckingAdmin, setIsCheckingAdmin] = useState(true)
  const router = useRouter()

  useEffect(() => {
    async function checkAdmin() {
      setIsCheckingAdmin(true)
      const result = await checkAdminExists()
      setAdminExists(result.exists)
      setIsCheckingAdmin(false)

      // Si ya existe un administrador, redirigir al login
      if (result.exists) {
        router.push("/login")
      }
    }

    checkAdmin()
  }, [router])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsLoading(true)
    setMessage("")

    try {
      const formData = new FormData()
      formData.append("email", email)
      formData.append("password", password)
      formData.append("name", name)
      formData.append("secretKey", secretKey)

      const result = await createAdmin(formData)

      if (result.success) {
        setMessage(`✅ ${result.message}`)
        // Limpiar el formulario
        setEmail("")
        setPassword("")
        setName("")
        setSecretKey("")

        // Redirigir al login después de 2 segundos
        setTimeout(() => {
          router.push("/login")
        }, 2000)
      } else {
        setMessage(`❌ ${result.message}`)
      }
    } catch (error: any) {
      setMessage(`❌ Error: ${error.message || "Ocurrió un error desconocido"}`)
    } finally {
      setIsLoading(false)
    }
  }

  if (isCheckingAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
          <div className="text-center">
            <h1 className="text-2xl font-bold">Verificando configuración...</h1>
            <div className="mt-4">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (adminExists) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
          <div className="text-center">
            <h1 className="text-2xl font-bold">Configuración completada</h1>
            <p className="mt-2 text-gray-600">
              Ya existe un usuario administrador. Redirigiendo al inicio de sesión...
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Configuración inicial</h1>
          <p className="mt-2 text-gray-600">Crea el primer usuario administrador para tu aplicación</p>
        </div>

        {message && (
          <div
            className={`p-4 rounded-md ${
              message.startsWith("✅") ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"
            }`}
          >
            {message}
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div className="mb-4">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Nombre completo
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Nombre completo"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Correo electrónico
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Correo electrónico"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Contraseña
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Contraseña"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="secretKey" className="block text-sm font-medium text-gray-700 mb-1">
                Clave secreta
              </label>
              <input
                id="secretKey"
                name="secretKey"
                type="password"
                required
                value={secretKey}
                onChange={(e) => setSecretKey(e.target.value)}
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Clave secreta"
              />
              <p className="mt-1 text-xs text-gray-500">Usa la clave: cema-admin-setup-2023</p>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {isLoading ? "Creando administrador..." : "Crear administrador"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
