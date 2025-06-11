"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { getSystemConfig, updateSystemConfig } from "@/lib/config-service"
import type { SystemConfig } from "@/lib/models"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getExchangeRate } from "@/lib/exchange-rate"
import { Loader2, RefreshCw } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { ToastAction } from "@/components/ui/toast"

export function AdminSystemConfig() {
  const [config, setConfig] = useState<SystemConfig>({
    defaultCurrency: "USD",
    defaultExchangeRate: 17.5,
    defaultIVA: 16,
    includeIVAByDefault: true,
  })
  const [isLoading, setIsLoading] = useState(false)
  const [isUpdatingRate, setIsUpdatingRate] = useState(false)

  useEffect(() => {
    loadConfig()
  }, [])

  const loadConfig = () => {
    const systemConfig = getSystemConfig()
    setConfig(systemConfig)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target

    if (type === "number") {
      setConfig({
        ...config,
        [name]: value === "" ? "" : Number.parseFloat(value),
      })
    } else {
      setConfig({
        ...config,
        [name]: value,
      })
    }
  }

  const handleSwitchChange = (checked: boolean) => {
    setConfig({
      ...config,
      includeIVAByDefault: checked,
    })
  }

  const handleCurrencyChange = (value: string) => {
    setConfig({
      ...config,
      defaultCurrency: value as "USD" | "MXN",
    })
  }

  const handleUpdateExchangeRate = async () => {
    setIsUpdatingRate(true)
    try {
      const rate = await getExchangeRate()
      setConfig({
        ...config,
        defaultExchangeRate: rate,
      })
      toast({
        title: "Tipo de cambio actualizado",
        description: `Se ha actualizado el tipo de cambio a ${rate} MXN por USD.`,
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error al actualizar tipo de cambio",
        description: "No se pudo obtener el tipo de cambio actual.",
        action: <ToastAction altText="Intentar de nuevo">Intentar de nuevo</ToastAction>,
      })
    } finally {
      setIsUpdatingRate(false)
    }
  }

  const handleSaveConfig = () => {
    setIsLoading(true)
    try {
      updateSystemConfig(config)
      toast({
        title: "Configuración guardada",
        description: "La configuración del sistema ha sido actualizada correctamente.",
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error al guardar",
        description: "No se pudo guardar la configuración del sistema.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Configuración del Sistema</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="defaultCurrency">Moneda por Defecto</Label>
              <Select value={config.defaultCurrency} onValueChange={handleCurrencyChange}>
                <SelectTrigger id="defaultCurrency">
                  <SelectValue placeholder="Seleccione moneda" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">USD - Dólar Americano</SelectItem>
                  <SelectItem value="MXN">MXN - Peso Mexicano</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="defaultExchangeRate">Tipo de Cambio (USD a MXN)</Label>
              <div className="flex space-x-2">
                <Input
                  id="defaultExchangeRate"
                  name="defaultExchangeRate"
                  type="number"
                  min="1"
                  step="0.01"
                  value={config.defaultExchangeRate}
                  onChange={handleInputChange}
                  className="flex-1"
                />
                <Button variant="outline" onClick={handleUpdateExchangeRate} disabled={isUpdatingRate}>
                  {isUpdatingRate ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
                </Button>
              </div>
              <p className="text-xs text-gray-500">Tipo de cambio utilizado para conversiones de moneda.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="defaultIVA">Tasa de IVA por Defecto (%)</Label>
              <Input
                id="defaultIVA"
                name="defaultIVA"
                type="number"
                min="0"
                max="100"
                step="0.01"
                value={config.defaultIVA}
                onChange={handleInputChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="includeIVAByDefault">Incluir IVA por Defecto</Label>
              <div className="flex items-center space-x-2 pt-2">
                <Switch
                  id="includeIVAByDefault"
                  checked={config.includeIVAByDefault}
                  onCheckedChange={handleSwitchChange}
                />
                <Label htmlFor="includeIVAByDefault">{config.includeIVAByDefault ? "Sí" : "No"}</Label>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <Button onClick={handleSaveConfig} disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Guardando...
                </>
              ) : (
                "Guardar Configuración"
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
