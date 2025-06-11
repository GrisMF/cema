import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { browserStorage } from "./browser-storage"

// Definición de tipos para la configuración
export interface PreciosConfig {
  precioBase: number
  precioHectarea: number
  precioModulo: number
  descuentoPorcentaje: number
}

export interface SystemConfig {
  defaultCurrency: string
  defaultExchangeRate: number
  defaultIVA: number
  includeIVAByDefault: boolean
}

// Función para obtener configuración (versión cliente)
export async function obtenerConfiguracionCliente<T>(tipo: string): Promise<T | null> {
  try {
    const supabase = createClientComponentClient()
    const { data, error } = await supabase.from("configuracion").select("valores").eq("tipo", tipo).single()

    if (error) {
      console.error(`Error al obtener configuración ${tipo}:`, error)
      return null
    }

    return data?.valores as T
  } catch (error) {
    console.error(`Error al obtener configuración ${tipo}:`, error)
    return null
  }
}

// Función para guardar configuración (versión cliente)
export async function guardarConfiguracionCliente<T>(tipo: string, valores: T): Promise<boolean> {
  try {
    const supabase = createClientComponentClient()
    const { error } = await supabase.from("configuracion").upsert(
      {
        tipo,
        valores,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "tipo" },
    )

    if (error) {
      console.error(`Error al guardar configuración ${tipo}:`, error)
      return false
    }

    return true
  } catch (error) {
    console.error(`Error al guardar configuración ${tipo}:`, error)
    return false
  }
}

// Función específica para obtener precios (versión cliente)
export async function obtenerPreciosCliente(): Promise<PreciosConfig> {
  const preciosDefault: PreciosConfig = {
    precioBase: 500,
    precioHectarea: 50,
    precioModulo: 200,
    descuentoPorcentaje: 10,
  }

  const precios = await obtenerConfiguracionCliente<PreciosConfig>("precios")
  return precios || preciosDefault
}

// Funciones de compatibilidad para mantener el código existente funcionando

const CONFIG_KEY = "system_config"

// Función para obtener la configuración inicial
const getDefaultConfig = (): SystemConfig => {
  return {
    defaultCurrency: "USD",
    defaultExchangeRate: 17.5,
    defaultIVA: 16,
    includeIVAByDefault: true,
  }
}

// Obtener la configuración del sistema (versión antigua para compatibilidad)
export const getSystemConfig = (): SystemConfig => {
  const config = browserStorage.getItem(CONFIG_KEY)

  if (!config) {
    // Si no hay configuración almacenada y estamos en el cliente, inicializar
    const defaultConfig = getDefaultConfig()
    if (typeof window !== "undefined") {
      browserStorage.setItem(CONFIG_KEY, JSON.stringify(defaultConfig))
    }
    return defaultConfig
  }

  return JSON.parse(config)
}

// Actualizar la configuración del sistema (versión antigua para compatibilidad)
export const updateSystemConfig = (updates: Partial<SystemConfig>): SystemConfig => {
  if (typeof window === "undefined") {
    throw new Error("Esta función solo está disponible en el navegador")
  }

  const currentConfig = getSystemConfig()
  const updatedConfig = {
    ...currentConfig,
    ...updates,
  }

  browserStorage.setItem(CONFIG_KEY, JSON.stringify(updatedConfig))
  return updatedConfig
}
