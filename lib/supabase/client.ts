"use client"

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import type { Database } from "./database.types"

// Creamos un singleton para el cliente de Supabase en el lado del cliente
let clientSingleton: ReturnType<typeof createClientComponentClient<Database>>

export const createClient = () => {
  if (clientSingleton) return clientSingleton

  clientSingleton = createClientComponentClient<Database>()
  return clientSingleton
}

// Hook para usar Supabase en componentes del cliente
export function useSupabase() {
  const client = createClient()
  return client
}
