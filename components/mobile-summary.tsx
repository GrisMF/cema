"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { DollarSign, ChevronUp, ChevronDown, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

type MobileSummaryProps = {
  total: number
  moneda: string
  onContinue: () => void
  isLastStep: boolean
  subtotal?: number
  fees?: number
  iva?: number
  incluirIVA?: boolean
  tasaIVA?: number
  operaciones?: Array<{
    tipo: string
    cantidad: number
    tarifa: number
    hectareas?: number
  }>
  esquemas?: string[]
}

export function MobileSummary({
  total: initialTotal,
  moneda,
  onContinue,
  isLastStep,
  subtotal = 0,
  fees: initialFees = 0,
  iva: initialIva = 0,
  incluirIVA = false,
  tasaIVA = 16,
  operaciones = [],
  esquemas = ["primusgfs"],
}: MobileSummaryProps) {
  const [isExpanded, setIsExpanded] = useState(false)

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
  const iva = incluirIVA ? totalSinIVA * (tasaIVA / 100) : 0
  const total = totalSinIVA + iva

  // Formatear montos según la moneda
  const formatMonto = (monto: number) => {
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: moneda,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(monto)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed bottom-0 left-0 right-0 z-50"
    >
      <div className="bg-white border-t border-gray-200 shadow-lg rounded-t-xl overflow-hidden">
        <div
          className="flex items-center justify-between p-4 cursor-pointer"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
              <DollarSign className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <div className="text-sm text-gray-500">Total estimado:</div>
              <div className="text-lg font-bold">{formatMonto(total)}</div>
            </div>
          </div>
          <div className="flex items-center">
            {isExpanded ? (
              <ChevronDown className="h-5 w-5 text-gray-400" />
            ) : (
              <ChevronUp className="h-5 w-5 text-gray-400" />
            )}
          </div>
        </div>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              {subtotal > 0 && (
                <div className="px-4 py-2 border-t border-gray-100">
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
                        <span className="font-medium">{formatMonto(iva)}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
              <div className="p-4 pt-0 border-t border-gray-100">
                <Button onClick={onContinue} className="w-full bg-blue-600 hover:bg-blue-700 text-white h-12 text-base">
                  {isLastStep ? "Generar PDF" : "Continuar"}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}
