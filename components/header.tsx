// components/header.tsx
"use client";

import { useAuth } from "@/lib/auth-context";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  LogOut,
  Settings,
  LogIn,
  Menu,
  X,
  User as UserIcon,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useMobile } from "@/hooks/use-mobile";

export function Header() {
  const { isAuthenticated, isAdmin, logout, user } = useAuth();
  const [scrolled, setScrolled]         = useState(false);
  const [visible, setVisible]           = useState(true);
  const [lastScrollY, setLastScrollY]   = useState(0);
  const [mobileMenuOpen, setMobileMenu] = useState(false);
  const { isMobile } = useMobile();

  /* scroll */
  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;
      const sc = y > 10;
      setScrolled(sc);
      if (y > lastScrollY && y > 80) setVisible(false);
      else setVisible(true);
      if (Math.abs(y - lastScrollY) > 5) setLastScrollY(y);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  /* cierra menú al pasar a desktop */
  useEffect(() => {
    if (!isMobile && mobileMenuOpen) setMobileMenu(false);
  }, [isMobile, mobileMenuOpen]);

  /* helpers */
  const handleLogout = async () => {
    await logout(); // espera a que termine antes de re-render
  };
  const closeAndLogout = async () => {
    await logout();
    setMobileMenu(false);
  };

  return (
    <header
      className={`
        fixed inset-x-0 top-0 z-40 transition-all duration-300
        ${scrolled ? "bg-white/90 backdrop-blur-sm shadow-sm py-1" : "bg-white/50 py-2"}
        ${visible  ? "translate-y-0" : "-translate-y-full"}
      `}
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        {/* logo */}
        <Link href="/" className="flex items-center">
          <Image
            src="/images/cema-logo.png"
            alt="CEMA - Organismo de Certificación"
            width={120}
            height={48}
            priority
          />
        </Link>

        {/* MÓVIL */}
        {isMobile ? (
          <>
            <Button
              variant="ghost"
              size="sm"
              className="p-1"
              onClick={() => setMobileMenu((o) => !o)}
            >
              {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </Button>

            {mobileMenuOpen && (
              <div
                className="fixed inset-0 bg-black/20 z-40"
                onClick={() => setMobileMenu(false)}
              />
            )}

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
                    <Link href="/cotizador" onClick={() => setMobileMenu(false)}>
                      <Button variant="ghost" size="sm" className="w-full justify-start">
                        Cotizador
                      </Button>
                    </Link>
                    <Link href="/perfil" onClick={() => setMobileMenu(false)}>
                      <Button variant="ghost" size="sm" className="w-full justify-start">
                        <UserIcon className="h-4 w-4 mr-2" />
                        Mi Perfil
                      </Button>
                    </Link>
                    {isAdmin && (
                      <Link href="/admin" onClick={() => setMobileMenu(false)}>
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
                      onClick={closeAndLogout}
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Cerrar sesión
                    </Button>
                  </>
                ) : (
                  <Link href="/login" onClick={() => setMobileMenu(false)}>
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
          /* DESKTOP */
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
                  onClick={handleLogout}
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
  );
}
