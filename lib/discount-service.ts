import type { DiscountCode } from "./models"
import { browserStorage } from "./browser-storage"

// En una implementación real, esto se conectaría a una base de datos
// Para este ejemplo, usaremos localStorage

const STORAGE_KEY = "discount_codes"

// Función para inicializar los códigos de descuento (solo se ejecuta en el cliente)
const getInitialDiscountCodes = (): DiscountCode[] => {
  return [
    {
      id: "1",
      code: "WELCOME10",
      description: "Código de bienvenida 10% de descuento",
      discountPercentage: 10,
      validUntil: new Date(new Date().setMonth(new Date().getMonth() + 1)),
      maxUses: 100,
      currentUses: 0,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: "2",
      code: "PREMIUM20",
      description: "Descuento premium 20%",
      discountPercentage: 20,
      validUntil: null,
      maxUses: null,
      currentUses: 0,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]
}

// Obtener todos los códigos de descuento
export const getAllDiscountCodes = (): DiscountCode[] => {
  const codes = browserStorage.getItem(STORAGE_KEY)

  if (!codes) {
    // Si no hay códigos almacenados y estamos en el cliente, inicializar
    const initialCodes = getInitialDiscountCodes()
    if (typeof window !== "undefined") {
      browserStorage.setItem(STORAGE_KEY, JSON.stringify(initialCodes))
    }
    return initialCodes
  }

  return JSON.parse(codes)
}

// Obtener un código de descuento por su código
export const getDiscountCodeByCode = (code: string): DiscountCode | null => {
  const codes = getAllDiscountCodes()
  return codes.find((c) => c.code.toLowerCase() === code.toLowerCase()) || null
}

// Crear un nuevo código de descuento
export const createDiscountCode = (
  discountCode: Omit<DiscountCode, "id" | "createdAt" | "updatedAt" | "currentUses">,
): DiscountCode => {
  if (typeof window === "undefined") {
    throw new Error("Esta función solo está disponible en el navegador")
  }

  const codes = getAllDiscountCodes()

  // Verificar si el código ya existe
  if (codes.some((c) => c.code.toLowerCase() === discountCode.code.toLowerCase())) {
    throw new Error("El código de descuento ya existe")
  }

  const newCode: DiscountCode = {
    ...discountCode,
    id: Date.now().toString(),
    currentUses: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  codes.push(newCode)
  browserStorage.setItem(STORAGE_KEY, JSON.stringify(codes))

  return newCode
}

// Actualizar un código de descuento
export const updateDiscountCode = (
  id: string,
  updates: Partial<Omit<DiscountCode, "id" | "createdAt" | "updatedAt">>,
): DiscountCode => {
  if (typeof window === "undefined") {
    throw new Error("Esta función solo está disponible en el navegador")
  }

  const codes = getAllDiscountCodes()
  const index = codes.findIndex((c) => c.id === id)

  if (index === -1) {
    throw new Error("Código de descuento no encontrado")
  }

  // Si se está actualizando el código, verificar que no exista ya
  if (updates.code && codes.some((c) => c.id !== id && c.code.toLowerCase() === updates.code!.toLowerCase())) {
    throw new Error("El código de descuento ya existe")
  }

  const updatedCode = {
    ...codes[index],
    ...updates,
    updatedAt: new Date(),
  }

  codes[index] = updatedCode
  browserStorage.setItem(STORAGE_KEY, JSON.stringify(codes))

  return updatedCode
}

// Eliminar un código de descuento
export const deleteDiscountCode = (id: string): boolean => {
  if (typeof window === "undefined") return false

  const codes = getAllDiscountCodes()
  const filteredCodes = codes.filter((c) => c.id !== id)

  if (filteredCodes.length === codes.length) {
    return false
  }

  browserStorage.setItem(STORAGE_KEY, JSON.stringify(filteredCodes))
  return true
}

// Validar y aplicar un código de descuento
export const validateDiscountCode = (
  code: string,
): { valid: boolean; discountPercentage?: number; message?: string } => {
  const discountCode = getDiscountCodeByCode(code)

  if (!discountCode) {
    return { valid: false, message: "Código de descuento no encontrado" }
  }

  if (!discountCode.isActive) {
    return { valid: false, message: "Código de descuento inactivo" }
  }

  if (discountCode.validUntil && new Date(discountCode.validUntil) < new Date()) {
    return { valid: false, message: "Código de descuento expirado" }
  }

  if (discountCode.maxUses !== null && discountCode.currentUses >= discountCode.maxUses) {
    return { valid: false, message: "Código de descuento ha alcanzado el máximo de usos" }
  }

  return {
    valid: true,
    discountPercentage: discountCode.discountPercentage,
  }
}

// Registrar el uso de un código de descuento
export const useDiscountCode = (code: string): boolean => {
  if (typeof window === "undefined") return false

  const codes = getAllDiscountCodes()
  const index = codes.findIndex((c) => c.code.toLowerCase() === code.toLowerCase())

  if (index === -1) {
    return false
  }

  codes[index].currentUses += 1
  browserStorage.setItem(STORAGE_KEY, JSON.stringify(codes))

  return true
}
