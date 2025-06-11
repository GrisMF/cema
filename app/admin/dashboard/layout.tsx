import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Panel de Administración | CEMA",
  description: "Panel de administración para gestionar usuarios y configuraciones del sistema",
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="py-4">{children}</div>
    </div>
  )
}
