"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { obtenerConfiguracionCliente, guardarConfiguracionCliente, type PreciosConfig } from "@/lib/config-service"
import { toast } from "@/components/ui/use-toast"
import { ArrowLeft, Save, Loader2 } from "lucide-react"
import Link from "next/link"

export default function ConfiguracionPage() {
  const [activeTab, setActiveTab] = useState("precios")
  const [isLoading, setIsLoading] = useState(false)
  const [precios, setPrecios] = useState<PreciosConfig>({
    precioBase: 500,
    precioHectarea: 50,
    precioModulo: 200,
    descuentoPorcentaje: 10,
  })

  useEffect(() => {
    async function cargarConfiguracion() {
      setIsLoading(true)
      try {
        const preciosConfig = await obtenerConfiguracionCliente<PreciosConfig>("precios")
        if (preciosConfig) {
          setPrecios(preciosConfig)
        }
      } catch (error) {
        console.error("Error al cargar la configuración:", error)
        toast({
          title: "Error",
          description: "No se pudo cargar la configuración",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    cargarConfiguracion()
  }, [])

  const handlePreciosChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setPrecios((prev) => ({
      ...prev,
      [name]: Number.parseFloat(value) || 0,
    }))
  }

  const handleGuardarPrecios = async () => {
    setIsLoading(true)
    try {
      const resultado = await guardarConfiguracionCliente("precios", precios)
      if (resultado) {
        toast({
          title: "Configuración guardada",
          description: "Los precios se han actualizado correctamente",
        })
      } else {
        throw new Error("No se pudo guardar la configuración")
      }
    } catch (error) {
      console.error("Error al guardar la configuración:", error)
      toast({
        title: "Error",
        description: "No se pudo guardar la configuración",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex items-center mb-6">
        <Link href="/admin" className="mr-4">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">Configuración del Sistema</h1>
      </div>

      <Tabs defaultValue="precios" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="precios">Precios</TabsTrigger>
          <TabsTrigger value="sistema">Sistema</TabsTrigger>
          <TabsTrigger value="email">Email</TabsTrigger>
        </TabsList>

        <TabsContent value="precios">
          <Card>
            <CardHeader>
              <CardTitle>Configuración de Precios</CardTitle>
              <CardDescription>Configura los precios base y tarifas para las cotizaciones</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="precioBase">Precio Base (MXN/USD)</Label>
                  <Input
                    id="precioBase"
                    name="precioBase"
                    type="number"
                    value={precios.precioBase}
                    onChange={handlePreciosChange}
                    disabled={isLoading}
                  />
                  <p className="text-sm text-gray-500">Precio base para todas las cotizaciones</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="precioHectarea">Precio por Hectárea (MXN/USD)</Label>
                  <Input
                    id="precioHectarea"
                    name="precioHectarea"
                    type="number"
                    value={precios.precioHectarea}
                    onChange={handlePreciosChange}
                    disabled={isLoading}
                  />
                  <p className="text-sm text-gray-500">Precio adicional por hectárea</p>
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="precioModulo">Precio por Módulo (MXN/USD)</Label>
                  <Input
                    id="precioModulo"
                    name="precioModulo"
                    type="number"
                    value={precios.precioModulo}
                    onChange={handlePreciosChange}
                    disabled={isLoading}
                  />
                  <p className="text-sm text-gray-500">Precio por cada módulo adicional</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="descuentoPorcentaje">Descuento Máximo (%)</Label>
                  <Input
                    id="descuentoPorcentaje"
                    name="descuentoPorcentaje"
                    type="number"
                    min="0"
                    max="100"
                    value={precios.descuentoPorcentaje}
                    onChange={handlePreciosChange}
                    disabled={isLoading}
                  />
                  <p className="text-sm text-gray-500">Porcentaje máximo de descuento permitido</p>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleGuardarPrecios} disabled={isLoading} className="ml-auto">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Guardando...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Guardar Cambios
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="sistema">
          <Card>
            <CardHeader>
              <CardTitle>Configuración del Sistema</CardTitle>
              <CardDescription>Configura parámetros generales del sistema</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500">
                Esta sección está en desarrollo. Próximamente podrás configurar parámetros como:
              </p>
              <ul className="list-disc list-inside mt-2 space-y-1 text-gray-500">
                <li>Tasa de IVA por defecto</li>
                <li>Tipo de cambio USD/MXN</li>
                <li>Moneda predeterminada</li>
                <li>Opciones de redondeo</li>
              </ul>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="email">
          <Card>
            <CardHeader>
              <CardTitle>Configuración de Email</CardTitle>
              <CardDescription>Configura las notificaciones por email</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500">Esta sección está en desarrollo. Próximamente podrás configurar:</p>
              <ul className="list-disc list-inside mt-2 space-y-1 text-gray-500">
                <li>Plantillas de email</li>
                <li>Destinatarios de notificaciones</li>
                <li>Programación de envíos</li>
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
