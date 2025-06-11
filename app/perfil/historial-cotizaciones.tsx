"use client"

import { useEffect, useState } from "react"
import { useSupabase } from "@/lib/supabase/client"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { DocumentModal } from "@/components/document-modal"

interface Cotizacion {
  id: number
  created_at: string
  empresa: string
  esquemas: string[]
  total: number
  moneda: string
  estado: "pendiente" | "aceptada" | "rechazada"
  motivo_rechazo?: string
  datos_generales?: any
  datos_primusgfs?: any
  datos_globalgap?: any
}

export default function HistorialCotizaciones() {
  const supabase = useSupabase()
  const [cotizaciones, setCotizaciones] = useState<Cotizacion[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showDocumentModal, setShowDocumentModal] = useState(false)
  const [selectedCotizacion, setSelectedCotizacion] = useState<Cotizacion | null>(null)

  useEffect(() => {
    async function cargarCotizaciones() {
      try {
        setIsLoading(true)
        const {
          data: { session },
        } = await supabase.auth.getSession()

        if (!session) return

        const { data, error } = await supabase
          .from("cotizaciones")
          .select("*")
          .eq("user_id", session.user.id)
          .order("created_at", { ascending: false })

        if (error) {
          console.error("Error al cargar cotizaciones:", error)
          return
        }

        setCotizaciones(data || [])
      } catch (error) {
        console.error("Error:", error)
      } finally {
        setIsLoading(false)
      }
    }

    cargarCotizaciones()
  }, [supabase])

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  if (cotizaciones.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 mb-4">No tienes cotizaciones guardadas</p>
        <Link href="/cotizador">
          <Button>Crear una cotización</Button>
        </Link>
      </div>
    )
  }

  // Función para formatear montos según la moneda
  function formatCurrency(amount: number, currency = "USD") {
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount)
  }

  // Función para abrir el modal de documentos
  const handleOrdenarClick = async (cotizacion: Cotizacion) => {
  try {
    let fullCotizacion = cotizacion

    // Si aún no cargaste datos_generales, tráelos desde la BD
    if (!cotizacion.datos_generales) {
      const { data, error } = await supabase
        .from("cotizaciones")
        .select("*")
        .eq("id", cotizacion.id)
        .single()

      if (error) {
        console.error("Error al obtener detalles de la cotización:", error)
        return
      }
      // Usa la nueva referencia que vino de la base
      fullCotizacion = data
    }

    // **Importante**: aquí sí pasas el objeto completo, 
    // sin mutar el que vino de tu array original.
    setSelectedCotizacion(fullCotizacion)
    setShowDocumentModal(true)
  } catch (error) {
    console.error("Error al preparar documentos:", error)
  }
}

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Historial de Cotizaciones</h3>
      <div className="space-y-4">
        {cotizaciones.map((cotizacion) => (
          <div key={cotizacion.id} className="bg-white p-4 rounded-lg shadow">
            <div className="flex flex-col md:flex-row justify-between mb-2">
              <div>
                <h4 className="font-medium">{cotizacion.empresa || "Empresa no especificada"}</h4>
                <p className="text-sm text-gray-500">Fecha: {new Date(cotizacion.created_at).toLocaleDateString()}</p>
              </div>
              <div className="mt-2 md:mt-0 flex items-center gap-2">
                <span
                  className={`inline-block px-3 py-1 rounded-full text-xs font-medium mr-2 ${
                    cotizacion.estado === "pendiente"
                      ? "bg-yellow-100 text-yellow-800"
                      : cotizacion.estado === "aceptada"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                  }`}
                >
                  {cotizacion.estado === "pendiente"
                    ? "Pendiente"
                    : cotizacion.estado === "aceptada"
                      ? "Aceptada"
                      : "Rechazada"}
                </span>
                <Button variant="default" size="sm" onClick={() => handleOrdenarClick(cotizacion)}>
                  ORDENAR
                </Button>
                <Link href={`/cotizador/pdf?id=${cotizacion.id}`}>
                  <Button variant="outline" size="sm">
                    Ver PDF
                  </Button>
                </Link>
              </div>
            </div>
            <Separator className="my-2" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <div>
                <p className="text-sm">
                  <span className="font-medium">Esquemas:</span>{" "}
                  {cotizacion.esquemas ? cotizacion.esquemas.join(", ") : "N/A"}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm">
                  <span className="font-medium">Total:</span>{" "}
                  {formatCurrency(cotizacion.total, cotizacion.moneda || "USD")}
                </p>
              </div>
            </div>
            {cotizacion.estado === "rechazada" && cotizacion.motivo_rechazo && (
              <div className="mt-2 p-2 bg-red-50 rounded text-sm">
                <span className="font-medium text-red-800">Motivo de rechazo:</span>{" "}
                <span className="text-red-700">{cotizacion.motivo_rechazo}</span>
              </div>
            )}
          </div>
        ))}
      </div>
      {selectedCotizacion && (
        <DocumentModal
          isOpen={showDocumentModal}
          onClose={() => setShowDocumentModal(false)}
          documents={{
            serviceContract: `CONTRATO DE SERVICIOS PARA ${
              selectedCotizacion.datos_generales?.nombreEmpresa || selectedCotizacion.empresa || "Cliente"
            }`,
            auditAgreement: `ACUERDO DE AUDITORÍA PARA ${
              selectedCotizacion.datos_generales?.nombreEmpresa || selectedCotizacion.empresa || "Cliente"
            }`,
            certificationRequest: `SOLICITUD DE CERTIFICACIÓN PARA ${
              selectedCotizacion.datos_generales?.nombreEmpresa || selectedCotizacion.empresa || "Cliente"
            }`,
          }}
          datosGenerales={
            selectedCotizacion.datos_generales || {
              nombreEmpresa: selectedCotizacion.empresa || "Cliente",
              representanteLegal: "",
              direccionFiscal: "",
              pais: "",
              codigoPostal: "",
              rfc: "",
              correo: "",
              telefono: "",
            }
          }
          esquemas={selectedCotizacion.esquemas || []}
          datosPrimusGFS={selectedCotizacion.datos_primusgfs || null}
          datosGlobalGAP={selectedCotizacion.datos_globalgap || null}
        />
      )}
    </div>
  )
}
