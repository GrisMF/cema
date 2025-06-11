"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { DollarSign, ChevronUp, ChevronDown } from "lucide-react"

type ResumenFlotanteProps = {
  subtotal: number
  fees: number
  iva: number
  total: number
  moneda: string
  incluirIVA: boolean
  tasaIVA: number
  operaciones?: Array<{
    tipo: string
    cantidad: number
    tarifa: number
    hectareas?: number
  }>
  esquemas?: string[]
}

export function ResumenFlotante({
  subtotal,
  fees: initialFees,
  iva,
  total: initialTotal,
  moneda,
  incluirIVA,
  tasaIVA,
  operaciones = [],
  esquemas = ["primusgfs"],
}: ResumenFlotanteProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  // Mostrar el resumen después de un breve retraso para evitar que aparezca inmediatamente
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, 1000)
    return () => clearTimeout(timer)
  }, [])

  // Calcular Fees Azzule
  const calcularFeesAzzule = () => {
    if (!esquemas.includes("primusgfs") || !operaciones.length) return initialFees

    let totalFees = 0

    // $50 USD por registrar una organización (solo una vez)
    totalFees += 50

    // $40 USD por registro de auditoría por operación
    operaciones.forEach((op) => {
      totalFees += 40 * op.cantidad
    })

    return totalFees
  }

  // Calcular emisión de certificado
  const calcularEmisionCertificado = () => {
    if (!esquemas.includes("primusgfs") || !operaciones.length) return 0

    let totalEmision = 0

    operaciones.forEach((op) => {
      // $27 USD por certificación de operación de campo
      if (["granja", "invernadero", "cuadrilla_cosecha"].includes(op.tipo)) {
        totalEmision += 27 * op.cantidad
      }
      // $30 USD por certificación de operación de instalación
      else {
        totalEmision += 30 * op.cantidad
      }
    })

    return totalEmision
  }

  // Recalcular fees y total si tenemos operaciones
  const fees = operaciones.length > 0 ? calcularFeesAzzule() : initialFees
  const emisionCertificado = operaciones.length > 0 ? calcularEmisionCertificado() : 0
  const totalSinIVA = subtotal + fees + emisionCertificado
  const ivaCalculado = incluirIVA ? totalSinIVA * (tasaIVA / 100) : 0
  const total = totalSinIVA + ivaCalculado

  // Formatear montos según la moneda
  const formatMonto = (monto: number) => {
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: moneda,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(monto)
  }

  if (!isVisible) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        className="fixed bottom-4 left-0 right-0 z-50 mx-auto w-full max-w-md px-4 md:right-4 md:left-auto md:mx-0 md:px-0"
      >
        <motion.div
          className="rounded-xl bg-white shadow-xl border border-gray-200 overflow-hidden"
          animate={{ height: isCollapsed ? "60px" : "auto" }}
        >
          {/* Cabecera siempre visible */}
          <div
            className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white cursor-pointer"
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              <span className="font-semibold">Total Estimado</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-lg font-bold">{formatMonto(total)}</span>
              {isCollapsed ? (
                <ChevronUp className="h-5 w-5 text-white/80" />
              ) : (
                <ChevronDown className="h-5 w-5 text-white/80" />
              )}
            </div>
          </div>

          {/* Detalles colapsables */}
          <div className={`p-4 bg-blue-50 ${isCollapsed ? "hidden" : "block"}`}>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">{formatMonto(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Fees</span>
                <span className="font-medium">{formatMonto(fees)}</span>
              </div>
              {operaciones.length > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Emisión de certificado</span>
                  <span className="font-medium">{formatMonto(emisionCertificado)}</span>
                </div>
              )}
              {incluirIVA && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">IVA ({tasaIVA}%)</span>
                  <span className="font-medium">{formatMonto(ivaCalculado)}</span>
                </div>
              )}
              <div className="pt-2 mt-2 border-t border-gray-200 flex justify-between">
                <span className="font-semibold">Total</span>
                <span className="font-bold text-blue-700">{formatMonto(total)}</span>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
