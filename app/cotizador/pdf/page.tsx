"use client"

import { useEffect, useState, useCallback } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { CotizacionPDF } from "@/components/cotizacion-pdf"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default function PDFPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isLoading, setIsLoading] = useState(true)
  const [data, setData] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  // Memoizar la función handleBack para evitar recreaciones en cada renderizado
  const handleBack = useCallback(() => {
    router.back()
  }, [router])

  // Usar useEffect con una función memoizada para procesar los datos
  useEffect(() => {
    const processData = () => {
      try {
        // Obtener los datos de la URL de forma segura
        const esquemas = JSON.parse(searchParams.get("esquemas") || '["primusgfs"]')
        const datosGenerales = JSON.parse(searchParams.get("datosGenerales") || "{}")
        const datosPrimusGFS = JSON.parse(searchParams.get("datosPrimusGFS") || "{}")
        const datosGlobalGAP = JSON.parse(searchParams.get("datosGlobalGAP") || "{}")
        const moneda = searchParams.get("moneda") || "USD"
        const tipoCambioStr = searchParams.get("tipoCambio") || "17.5"
        const incluirIVA = searchParams.get("incluirIVA") === "true"
        const tasaIVAStr = searchParams.get("tasaIVA") || "16"
        const discountPercentageStr = searchParams.get("discountPercentage") || "0"

        // Convertir strings a números de forma segura
        const tipoCambio = isNaN(Number.parseFloat(tipoCambioStr)) ? 17.5 : Number.parseFloat(tipoCambioStr)
        const tasaIVA = isNaN(Number.parseFloat(tasaIVAStr)) ? 16 : Number.parseFloat(tasaIVAStr)
        const discountPercentage = isNaN(Number.parseFloat(discountPercentageStr))
          ? 0
          : Number.parseFloat(discountPercentageStr)

        // Calcular fees para GLOBALG.A.P. de forma segura
        let feesGlobalGAP = 0
        if (esquemas.includes("globalgap") && datosGlobalGAP && datosGlobalGAP.sitios) {
          const sitiosLength = Array.isArray(datosGlobalGAP.sitios) ? datosGlobalGAP.sitios.length : 1
          feesGlobalGAP = 150 * sitiosLength
        }

        // Crear objeto de datos inmutable
        const processedData = {
          esquemas,
          datosGenerales,
          operaciones: datosPrimusGFS.operaciones || [],
          feesAzzule: esquemas.includes("primusgfs") ? 150 : 0,
          emisionCertificado: 1138.33,
          moneda,
          tipoCambio,
          incluirIVA,
          tasaIVA,
          datosGlobalGAP,
          feesGlobalGAP,
          discountPercentage,
        }

        // Actualizar el estado una sola vez con todos los datos procesados
        setData(processedData)
      } catch (err) {
        console.error("Error al procesar los datos:", err)
        setError("Ocurrió un error al procesar los datos. Por favor, intente nuevamente.")
      } finally {
        setIsLoading(false)
      }
    }

    // Procesar los datos solo una vez cuando los searchParams estén disponibles
    processData()
  }, []) // Eliminar searchParams de las dependencias para evitar el bucle infinito

  // Renderizado condicional basado en el estado
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-16">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-lg">Generando PDF...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-16">
        <div className="text-center max-w-md p-6 bg-white rounded-lg shadow-lg">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold mb-4">Error</h2>
          <p className="mb-6">{error}</p>
          <Button onClick={handleBack} className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" /> Volver al cotizador
          </Button>
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-16">
        <div className="text-center max-w-md p-6 bg-white rounded-lg shadow-lg">
          <h2 className="text-xl font-bold mb-4">No se encontraron datos</h2>
          <p className="mb-6">No se pudieron cargar los datos para generar el PDF.</p>
          <Button onClick={handleBack} className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" /> Volver al cotizador
          </Button>
        </div>
      </div>
    )
  }

  // Solo renderizar el componente CotizacionPDF cuando los datos estén listos
  return (
    <div className="container mx-auto py-4 px-2 md:py-8 md:px-4 min-h-screen pt-20 md:pt-16">
      <CotizacionPDF {...data} onBack={handleBack} />
    </div>
  )
}
