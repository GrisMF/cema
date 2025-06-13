// app/page.tsx  – Página principal completa
"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function Home() {
  /* ¿El usuario ya inició sesión? */
  const { isAuthenticated } = useAuth();

  /* Destino dinámico para ambos CTA */
  const cotizadorHref = useMemo(
    () => (isAuthenticated ? "/cotizador" : "/login"),
    [isAuthenticated]
  );

  return (
    <div className="min-h-screen flex flex-col">
      {/* ───────────────────────── Hero ───────────────────────── */}
      <div className="relative h-screen flex items-center">
        {/* Imagen de fondo */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/fresh-strawberries.png"
            alt="Fresas frescas"
            fill
            className="object-cover"
            priority
            quality={100}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-green-900/90" />
        </div>

        {/* Logo */}
        <div className="absolute top-4 left-8 z-10">
          <Image
            src="/images/cema-logo.png"
            alt="CEMA - Organismo de Certificación"
            width={240}
            height={95}
            className="drop-shadow-lg"
          />
        </div>

        {/* Texto principal */}
        <div className="container mx-auto px-4 z-10">
          <div className="max-w-3xl mt-32">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg">
              PROPUESTA DE CERTIFICACIÓN
            </h1>
            <h2 className="text-3xl md:text-4xl text-white/90 font-medium mb-8 drop-shadow-md">
              para el programa <span className="font-bold">PRIMUS GFS</span>
            </h2>
            <p className="text-xl text-white/80 mb-12 max-w-2xl drop-shadow-md">
              Garantizamos la calidad e inocuidad de sus productos agrícolas con nuestros servicios de certificación
              reconocidos internacionalmente.
            </p>

            {/* Botón dinámico */}
            <Link href={cotizadorHref}>
              <Button
                size="lg"
                className="bg-green-600 hover:bg-green-700 text-white text-lg px-8 py-6 rounded-lg transition-all transform hover:scale-105 shadow-lg"
              >
                Acceder al Cotizador <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* ───────────────────────── Beneficios ───────────────────────── */}
      <div className="bg-white py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
            Beneficios de la Certificación PRIMUS GFS
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Beneficio 1 */}
            <div className="bg-green-50 p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mb-4 text-white text-2xl font-bold">
                1
              </div>
              <h3 className="text-xl font-bold mb-3 text-green-800">Acceso a Mercados Globales</h3>
              <p className="text-gray-700">
                Abra las puertas a mercados internacionales con una certificación reconocida por la Iniciativa Global de
                Seguridad Alimentaria (GFSI).
              </p>
            </div>

            {/* Beneficio 2 */}
            <div className="bg-green-50 p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mb-4 text-white text-2xl font-bold">
                2
              </div>
              <h3 className="text-xl font-bold mb-3 text-green-800">Mejora Continua</h3>
              <p className="text-gray-700">
                Implemente sistemas de gestión que promuevan la mejora continua en sus procesos de producción y manejo
                de alimentos.
              </p>
            </div>

            {/* Beneficio 3 */}
            <div className="bg-green-50 p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mb-4 text-white text-2xl font-bold">
                3
              </div>
              <h3 className="text-xl font-bold mb-3 text-green-800">Confianza del Consumidor</h3>
              <p className="text-gray-700">
                Genere mayor confianza en sus clientes y consumidores al demostrar su compromiso con la inocuidad
                alimentaria.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ───────────────────────── Llamado a la acción ───────────────────────── */}
      <div className="bg-blue-700 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            ¿Listo para comenzar su proceso de certificación?
          </h2>
          <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
            Utilice nuestro cotizador en línea para obtener una estimación de costos personalizada para su operación.
          </p>

          {/* Botón dinámico */}
          <Link href={cotizadorHref}>
            <Button
              size="lg"
              className="bg-white text-blue-700 hover:bg-blue-50 text-lg px-8 py-6 rounded-lg transition-all transform hover:scale-105 shadow-lg"
            >
              Ir al Cotizador <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>

      {/* ───────────────────────── Footer ───────────────────────── */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <Image
                src="/images/cema-logo.png"
                alt="CEMA - Organismo de Certificación"
                width={150}
                height={60}
                className="opacity-80"
              />
            </div>
            <div className="text-center md:text-right">
              <p className="text-gray-400">© {new Date().getFullYear()} CEMA. Todos los derechos reservados.</p>
              <p className="text-gray-500 text-sm mt-2">Organismo de Certificación</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
