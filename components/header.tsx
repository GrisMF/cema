"use client"

import { useAuth } from "@/lib/auth-context"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { LogOut, Settings, LogIn, Menu, X, User } from "lucide-react"
import { useState, useEffect } from "react"
import { useMobile } from "@/hooks/use-mobile"
import { useRouter } from "next/navigation"

export function Header() {
  const { isAuthenticated, isAdmin, logout, user } = useAuth()
  const [scrolled, setScrolled] = useState(false)
  const [visible, setVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { isMobile } = useMobile()
  const router = useRouter()

  // Detectar scroll para cambiar la apariencia del header y ocultarlo/mostrarlo
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY

      // Determinar si se ha scrolleado suficiente para cambiar la apariencia
      const isScrolled = currentScrollY > 10
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled)
      }

      // Determinar si se debe mostrar u ocultar el header
      if (currentScrollY > lastScrollY && currentScrollY > 80) {
        // Scrolling down & past threshold - hide header
        setVisible(false)
      } else {
        // Scrolling up or at top - show header
        setVisible(true)
      }

      // Actualizar lastScrollY solo si ha cambiado significativamente para evitar actualizaciones infinitas
      if (Math.abs(currentScrollY - lastScrollY) > 5) {
        setLastScrollY(currentScrollY)
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [scrolled, lastScrollY])

  // Cerrar el menú móvil cuando se cambia a vista de escritorio
  useEffect(() => {
    if (!isMobile && mobileMenuOpen) {
      setMobileMenuOpen(false)
    }
  }, [isMobile, mobileMenuOpen])

  // Añadir este efecto para verificar la sesión en cada cambio de ruta
  useEffect(() => {
    // Verificar si estamos en la página de login después de cambiar la contraseña
    const checkSessionAfterPasswordChange = async () => {
      if (window.location.pathname === "/login" && window.location.search.includes("password_changed=true")) {
        // Si estamos en login después de cambiar contraseña, cerrar sesión
        await logout()
      }
    }

    checkSessionAfterPasswordChange()
  }, [logout])

  // Función para navegar al perfil
  const navigateToProfile = (e) => {
    if (e) e.preventDefault()
    // Usar una navegación directa para evitar problemas con el middleware
    window.location.href = "/perfil"
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled ? "bg-white/90 backdrop-blur-sm shadow-sm py-1" : "bg-white/50 py-2"
      } ${visible ? "translate-y-0" : "-translate-y-full"}`}
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center">
          <Link href="/" className="flex items-center">
            <Image
              src="/images/cema-logo.png"
              alt="CEMA - Organismo de Certificación"
              width={120}
              height={48}
              className="mr-2"
            />
          </Link>
        </div>

        {isMobile ? (
          <>
            <Button variant="ghost" size="sm" className="p-1" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </Button>

            {/* Mobile menu overlay */}
            {mobileMenuOpen && (
              <div className="fixed inset-0 bg-black/20 z-40" onClick={() => setMobileMenuOpen(false)} />
            )}

            {/* Mobile menu */}
            <div
              className={`fixed right-0 top-[42px] bg-white shadow-lg rounded-bl-lg z-50 transition-transform duration-300 transform ${
                mobileMenuOpen ? "translate-x-0" : "translate-x-full"
              }`}
            >
              <div className="flex flex-col p-4 space-y-2 min-w-[180px]">
                {isAuthenticated ? (
                  <>
                    <Link href="/cotizador" onClick={() => setMobileMenuOpen(false)}>
                      <Button variant="ghost" size="sm" className="w-full justify-start">
                        Cotizador
                      </Button>
                    </Link>
                    <a
                      href="/perfil"
                      onClick={(e) => {
                        navigateToProfile(e)
                        setMobileMenuOpen(false)
                      }}
                    >
                      <Button variant="ghost" size="sm" className="w-full justify-start">
                        <User className="h-4 w-4 mr-2" />
                        Mi Perfil
                      </Button>
                    </a>
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
                      onClick={() => {
                        logout()
                        setMobileMenuOpen(false)
                      }}
                      className="w-full justify-start"
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
                <a href="/perfil" onClick={navigateToProfile}>
                  <Button variant="ghost" size="sm" className="flex items-center gap-1 text-xs">
                    <User className="h-3 w-3" />
                    <span>{user?.name || "Perfil"}</span>
                  </Button>
                </a>
                {isAdmin && (
                  <Link href="/admin">
                    <Button variant="ghost" size="sm" className="flex items-center gap-1 text-xs">
                      <Settings className="h-3 w-3" />
                      <span>Admin</span>
                    </Button>
                  </Link>
                )}
                <Button variant="ghost" size="sm" onClick={logout} className="flex items-center gap-1 text-xs">
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
