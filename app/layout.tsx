// app/layout.tsx
import type { Metadata } from "next"
import { Inter, Outfit } from "next/font/google"
import ProvidersWrapper from "./ProvidersWrapper"  // <- tu nuevo cliente
import "./globals.css"

export const metadata: Metadata = {
  title: "CEMA - Cotizador de Certificaciones",
  description: "Cotizador de certificaciones PrimusGFS y GLOBALG.A.P.",
}

const inter = Inter({ subsets: ["latin"], display: "swap", variable: "--font-inter" })
const outfit = Outfit({
  subsets: ["latin"],
  weight: ["300","400","500","600","700"],
  display: "swap",
  variable: "--font-outfit",
})

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${inter.variable} ${outfit.variable}light`}suppressHydrationWarning>
      <body className={outfit.className}>
        {/*
          Todo lo que necesite acceso a window, cookies, theme o auth,
          va dentro de ProvidersWrapper, que SÍ será client.
        */}
        <ProvidersWrapper>
          {children}
        </ProvidersWrapper>
      </body>
    </html>
  )
}
