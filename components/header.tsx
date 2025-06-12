// components/header.tsx
"use client"

import { useAuth } from "@/lib/auth-context"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { LogOut, Settings, LogIn, Menu, X, User as UserIcon } from "lucide-react"
import { useState, useEffect } from "react"
import { useMobile } from "@/hooks/use-mobile"

export function Header() {
  const { isAuthenticated, isAdmin, logout, user } = useAuth()
  const [scrolled, setScrolled] = useState(false)
  const [visible, setVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { isMobile } = useMobile()

  // Detectar scroll para cambiar la apariencia del header y ocultarlo/mostrarlo
  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY
      const isNowScrolled = currentY > 10
      setScrolled(isNowScrolled)

      if (currentY > lastScrollY && currentY > 80) setVisible(false)
      else setVisible(true)

      if (Math.abs(currentY - lastScrollY) > 5) {
        setLastScrollY(currentY)
      }
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [lastScrollY])

  // Cerrar menú móvil al pasar a desktop
  useEffect(() => {
    if (!isMobile && mobileMenuOpen) setMobileMenuOpen(false)
  }, [isMobile, mobileMenuOpen])

  return (
    <header
      className={`
        fixed top-0 left-0 right-0 z-40 transition-all duration-300
        ${scrolled ? "bg-white/90 backdrop-blur-sm shadow-sm py-1" : "bg-white/50 py-2"}
        ${visible ? "translate-y-0" : "-translate-y-full"}
      `}
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <Image
            src="/images/cema-logo.png"
            alt="CEMA - Organismo de Certificación"
            width={120}
            height={48}
            priority
          />
        </Link>

        {isMobile ? (
          <>
            {/* Botón para abrir/cerrar menú móvil */}
            <Button variant="ghost" size="sm" className="p-1" onClick={() => setMobileMenuOpen((o) => !o)}>
              {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </Button>

            {/* Overlay trasero */}
            {mobileMenuOpen && (
              <div
                className="fixed inset-0 bg-black/20 z-40"
                onClick={() => setMobileMenuOpen(false)}
              />
            )}

            {/* Menú deslizable */}
            <div
              className={`
                fixed right-0 top-[42px] bg-white shadow-lg rounded-bl-lg z-50
                transition-transform duration-300 transform
                ${mobileMenuOpen ? "translate-x-0" : "translate-x-full"}
              `}
            >
              <div className="flex flex-col p-4 space-y-2 min-w-[180px]">
                {isAuthenticated ? (
                  <>
                    <Link href="/cotizador" onClick={() => setMobileMenuOpen(false)}>
                      <Button variant="ghost" size="sm" className="w-full justify-start">
                        Cotizador
                      </Button>
                    </Link>

                    <Link href="/perfil" onClick={() => setMobileMenuOpen(false)}>
                      <Button variant="ghost" size="sm" className="w-full justify-start">
                        <UserIcon className="h-4 w-4 mr-2" />
                        Mi Perfil
                      </Button>
                    </Link>

                    {isAdmin && (
                      <Link href="/admin" onClick={() => setMobileMenuOpen(false)}>
                        <Button variant="ghost" size="sm" className="w-full justify-start">
                          <Settings className="h-4 w-4 mr-2" />
                          Panel Admin
                        </Button>
                      </Link>
                    )}

                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start"
                      onClick={() => {
                        logout()
                        setMobileMenuOpen(false)
                      }}
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Cerrar sesión
                    </Button>
                  </>
                ) : (
                  <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="ghost" size="sm" className="w-full justify-start">
                      <LogIn className="h-4 w-4 mr-2" />
                      Iniciar sesión
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </>
        ) : (
          <div className="flex items-center space-x-1">
            {isAuthenticated ? (
              <>
                <Link href="/cotizador">
                  <Button variant="ghost" size="sm" className="text-xs">
                    Cotizador
                  </Button>
                </Link>

                <Link href="/perfil">
                  <Button variant="ghost" size="sm" className="flex items-center gap-1 text-xs">
                    <UserIcon className="h-3 w-3" />
                    <span>{user?.name ?? "Perfil"}</span>
                  </Button>
                </Link>

                {isAdmin && (
                  <Link href="/admin">
                    <Button variant="ghost" size="sm" className="flex items-center gap-1 text-xs">
                      <Settings className="h-3 w-3" />
                      <span>Admin</span>
                    </Button>
                  </Link>
                )}

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => logout()}
                  className="flex items-center gap-1 text-xs"
                >
                  <LogOut className="h-3 w-3" />
                  <span>Salir</span>
                </Button>
              </>
            ) : (
              <Link href="/login">
                <Button variant="ghost" size="sm" className="flex items-center gap-1 text-xs">
                  <LogIn className="h-3 w-3" />
                  <span>Iniciar</span>
                </Button>
              </Link>
            )}
          </div>
        )}
      </div>
    </header>
  )
}
