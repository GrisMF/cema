"use client"

import { useState, useEffect } from "react"

export function useMobile() {
  const [isMobile, setIsMobile] = useState(false)
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    // Función para verificar si es un dispositivo móvil
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
      setIsReady(true)
    }

    // Verificar al cargar
    checkMobile()

    // Agregar listener para cambios de tamaño
    window.addEventListener("resize", checkMobile)

    // Limpiar listener
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  return { isMobile, isReady }
}

// Añadir esta exportación para compatibilidad
export const useIsMobile = useMobile
