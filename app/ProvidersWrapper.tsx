// app/ProvidersWrapper.tsx
"use client"

import { ReactNode } from "react"
import { ThemeProvider } from "next-themes"
import { SessionContextProvider } from "@supabase/auth-helpers-react"
import { createPagesBrowserClient } from "@supabase/auth-helpers-nextjs"
import { AuthProvider } from "@/lib/auth-context"      // <--- tu AuthProvider
import { Header } from "@/components/header"
import { Toaster } from "@/components/ui/toaster"

export default function ProvidersWrapper({ children }: { children: ReactNode }) {
  // Inicializamos supabase en el cliente
  const supabase = createPagesBrowserClient()

  return (
    <SessionContextProvider supabaseClient={supabase}>
      { /* Ahora metemos dentro al AuthProvider */ }
      <AuthProvider>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          <Header />
          <main className="pt-10">{children}</main>
          <Toaster />
        </ThemeProvider>
      </AuthProvider>
    </SessionContextProvider>
  )
}
