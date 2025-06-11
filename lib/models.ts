// Tipos para la autenticación y usuarios
export type UserRole = "admin" | "user"

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  isSuperuser?: boolean
}

// Tipos para códigos de descuento
export interface DiscountCode {
  id: string
  code: string
  description: string
  discountPercentage: number
  validUntil: Date | null
  maxUses: number | null
  currentUses: number
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

// Configuración global del sistema
export interface SystemConfig {
  defaultCurrency: "USD" | "MXN"
  defaultExchangeRate: number
  defaultIVA: number
  includeIVAByDefault: boolean
}
