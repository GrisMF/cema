import type React from "react"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/lib/auth-context"
import { Toaster } from "@/components/ui/toaster"
import type { Metadata } from "next"
import { Inter, Outfit } from "next/font/google"
import { Header } from "@/components/header"

// Configurar la fuente Inter
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
})

// Configurar la fuente Outfit
const outfit = Outfit({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
  variable: "--font-outfit",
})

export const metadata: Metadata = {
  title: "CEMA - Cotizador de Certificaciones",
  description: "Cotizador de certificaciones PrimusGFS y GLOBALG.A.P.",
    generator: 'v0.dev'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" suppressHydrationWarning className={`${inter.variable} ${outfit.variable}`}>
      <body className={outfit.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          <AuthProvider>
            <>
              <Header />
              <main className="pt-10">{children}</main>
            </>
            <Toaster />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
