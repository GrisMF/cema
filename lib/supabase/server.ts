import { createServerClient as createClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import type { Database } from "./database.types"

export function createServerClient() {
  const cookieStore = cookies()

  return createClient<Database>(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    cookies: {
       get(name) {
        
        return cookieStore.get(name)?.value
      },
      set(name, value, options) {
      
        cookieStore.set({ name, value, ...options })
      },
       remove(name, options) {
        
        cookieStore.set({ name, value: "", ...options })
      },
    },
  })
}
