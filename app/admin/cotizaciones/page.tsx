"use client"

import { useEffect, useState } from "react"
import { useSupabase } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { Loader2, ChevronDown } from "lucide-react"

// Actualizar la interfaz para incluir todos los campos relevantes
interface Cotizacion {
  id: number
  created_at: string
  user_id: string
  empresa: string
  contacto: string
  email: string
  telefono: string
  esquemas: string[]
  subtotal: number
  descuento_porcentaje: number
  descuento_monto: number
  tasa_iva: number
  iva: number
  total: number
  moneda: string
  estado: "pendiente" | "aceptada" | "rechazada"
  motivo_rechazo?: string
  user?: {
    email: string
    name: string
  }
  datos_generales?: {
    nombreEmpresa: string
    nombreContacto: string
    email: string
    telefono: string
  }
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

export default function AdminCotizacionesPage() {
  const supabase = useSupabase()
  const router = useRouter()
  const { toast } = useToast()
  const [cotizaciones, setCotizaciones] = useState<Cotizacion[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isUpdating, setIsUpdating] = useState<number | null>(null)
  const [filtro, setFiltro] = useState<"todas" | "pendiente" | "aceptada" | "rechazada">("todas")
  const [motivoRechazo, setMotivoRechazo] = useState<{ [key: string]: string }>({})
  const [cotizacionSeleccionada, setCotizacionSeleccionada] = useState<number | null>(null)
  const [mostrarModal, setMostrarModal] = useState<boolean>(false)
  const [mensajeModal, setMensajeModal] = useState<{ titulo: string; mensaje: string; tipo: "exito" | "error" }>({
    titulo: "",
    mensaje: "",
    tipo: "exito",
  })
  const [tarjetasColapsadas, setTarjetasColapsadas] = useState<{ [key: number]: boolean }>({})

  useEffect(() => {
    cargarCotizaciones()
  }, [filtro])

  // Añadir este nuevo useEffect para inicializar las tarjetas como colapsadas
  useEffect(() => {
    if (cotizaciones.length > 0) {
      const estadoInicial = cotizaciones.reduce(
        (acc, cotizacion) => {
          acc[cotizacion.id] = true // true = colapsado
          return acc
        },
        {} as { [key: number]: boolean },
      )

      setTarjetasColapsadas(estadoInicial)
    }
  }, [cotizaciones])

  // Función para cargar cotizaciones
  async function cargarCotizaciones() {
    try {
      setIsLoading(true)

      // Verificar si hay una sesión activa
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!session) {
        router.push("/login")
        return
      }

      // Obtener todas las cotizaciones
      let query = supabase.from("cotizaciones").select("*").order("created_at", { ascending: false })

      // Aplicar filtro si es necesario
      if (filtro !== "todas") {
        query = query.eq("estado", filtro)
      }

      const { data: cotizacionesData, error: cotizacionesError } = await query

      if (cotizacionesError) {
        console.error("Error al obtener cotizaciones:", cotizacionesError)
        mostrarMensajeModal("Error", "No se pudieron cargar las cotizaciones. Intente nuevamente.", "error")
        return
      }

      // Obtener información de usuarios para cada cotización
      const cotizacionesConUsuarios = await Promise.all(
        (cotizacionesData || []).map(async (cotizacion: Cotizacion) => {
          if (cotizacion.user_id) {
            const { data: userData, error: userError } = await supabase
              .from("users")
              .select("email, name")
              .eq("id", cotizacion.user_id)
              .single()

            if (!userError && userData) {
              return {
                ...cotizacion,
                user: userData,
              }
            }
          }
          return cotizacion
        }),
      )

      setCotizaciones(cotizacionesConUsuarios)
    } catch (error) {
      console.error("Error:", error)
      mostrarMensajeModal("Error", "Ocurrió un error inesperado. Intente nuevamente.", "error")
    } finally {
      setIsLoading(false)
    }
  }

  // Función para mostrar modal con mensaje
  function mostrarMensajeModal(titulo: string, mensaje: string, tipo: "exito" | "error") {
    setMensajeModal({
      titulo,
      mensaje,
      tipo,
    })
    setMostrarModal(true)
  }

  // Función para aceptar una cotización
  async function aceptarCotizacion(id: number) {
    try {
      setIsUpdating(id)

      // Actualizar en la base de datos usando la función RPC
      const { data, error } = await supabase.rpc("actualizar_estado_cotizacion", {
        cotizacion_id: id,
        nuevo_estado: "aceptada",
        motivo: null,
      })

      if (error) {
        console.error("Error al aceptar cotización:", error)

        // Intentar con el método directo si falla el RPC
        const { error: directError } = await supabase
          .from("cotizaciones")
          .update({
            estado: "aceptada",
            updated_at: new Date().toISOString(),
          })
          .eq("id", id)

        if (directError) {
          mostrarMensajeModal("Error", "No se pudo actualizar el estado de la cotización.", "error")
          return
        }
      }

      // Actualizar el estado local
      setCotizaciones((prev) => prev.map((cot) => (cot.id === id ? { ...cot, estado: "aceptada" } : cot)))

      // Mostrar mensaje de éxito
      mostrarMensajeModal(
        "¡Cotización aceptada!",
        "El estado se ha actualizado correctamente en la base de datos.",
        "exito",
      )

      // Recargar los datos para asegurar sincronización (solo una vez)
      await cargarCotizaciones()
    } catch (error) {
      console.error("Error al aceptar cotización:", error)
      mostrarMensajeModal("Error", "Ocurrió un error inesperado. Intente nuevamente.", "error")
    } finally {
      setIsUpdating(null)
    }
  }

  // Función para rechazar una cotización
  async function rechazarCotizacion(id: number) {
    try {
      if (!motivoRechazo[id] || motivoRechazo[id].trim() === "") {
        mostrarMensajeModal("Atención", "Debe proporcionar un motivo de rechazo.", "error")
        return
      }

      setIsUpdating(id)

      // Actualizar en la base de datos usando la función RPC
      const { data, error } = await supabase.rpc("actualizar_estado_cotizacion", {
        cotizacion_id: id,
        nuevo_estado: "rechazada",
        motivo: motivoRechazo[id],
      })

      if (error) {
        console.error("Error al rechazar cotización:", error)

        // Intentar con el método directo si falla el RPC
        const { error: directError } = await supabase
          .from("cotizaciones")
          .update({
            estado: "rechazada",
            motivo_rechazo: motivoRechazo[id],
            updated_at: new Date().toISOString(),
          })
          .eq("id", id)

        if (directError) {
          mostrarMensajeModal("Error", "No se pudo actualizar el estado de la cotización.", "error")
          return
        }
      }

      // Actualizar el estado local
      setCotizaciones((prev) =>
        prev.map((cot) =>
          cot.id === id
            ? {
                ...cot,
                estado: "rechazada",
                motivo_rechazo: motivoRechazo[id],
              }
            : cot,
        ),
      )

      // Limpiar el motivo y cerrar el modal
      setMotivoRechazo((prev) => ({ ...prev, [id]: "" }))
      setCotizacionSeleccionada(null)

      // Mostrar mensaje de éxito
      mostrarMensajeModal(
        "¡Cotización rechazada!",
        "El estado se ha actualizado correctamente en la base de datos.",
        "exito",
      )

      // Recargar los datos para asegurar sincronización (solo una vez)
      await cargarCotizaciones()
    } catch (error) {
      console.error("Error al rechazar cotización:", error)
      mostrarMensajeModal("Error", "Ocurrió un error inesperado. Intente nuevamente.", "error")
    } finally {
      setIsUpdating(null)
    }
  }

  // Función para mostrar el modal de rechazo
  function mostrarModalRechazo(id: number) {
    setCotizacionSeleccionada(id)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
          <p className="mt-4 text-gray-600">Cargando solicitudes de cotización...</p>
        </div>
      </div>
    )
  }

  // Obtener el nombre de la empresa y contacto
  function getNombreEmpresa(cotizacion: Cotizacion) {
    return cotizacion.empresa || cotizacion.datos_generales?.nombreEmpresa || "Empresa sin nombre"
  }

  function getNombreContacto(cotizacion: Cotizacion) {
    return cotizacion.contacto || cotizacion.datos_generales?.nombreContacto || "Contacto sin nombre"
  }

  function getEmail(cotizacion: Cotizacion) {
    return cotizacion.email || cotizacion.datos_generales?.email || "Email no disponible"
  }

  function getTelefono(cotizacion: Cotizacion) {
    return cotizacion.telefono || cotizacion.datos_generales?.telefono || "Teléfono no disponible"
  }

  function toggleColapso(id: number) {
    setTarjetasColapsadas((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Gestión de Solicitudes de Cotización</h1>
      </div>

      {/* Filtros */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold mb-4">Filtrar por estado</h2>
        <div className="flex flex-wrap gap-2">
          <Button variant={filtro === "todas" ? "default" : "outline"} onClick={() => setFiltro("todas")}>
            Todas
          </Button>
          <Button
            variant={filtro === "pendiente" ? "default" : "outline"}
            className={filtro === "pendiente" ? "bg-yellow-500 hover:bg-yellow-600" : ""}
            onClick={() => setFiltro("pendiente")}
          >
            En proceso
          </Button>
          <Button
            variant={filtro === "aceptada" ? "default" : "outline"}
            className={filtro === "aceptada" ? "bg-green-500 hover:bg-green-600" : ""}
            onClick={() => setFiltro("aceptada")}
          >
            Aceptadas
          </Button>
          <Button
            variant={filtro === "rechazada" ? "default" : "outline"}
            className={filtro === "rechazada" ? "bg-red-500 hover:bg-red-600" : ""}
            onClick={() => setFiltro("rechazada")}
          >
            Rechazadas
          </Button>
        </div>
      </div>

      {/* Lista de cotizaciones */}
      <div className="space-y-6">
        {cotizaciones.length === 0 ? (
          <div className="bg-white p-8 rounded-lg shadow-md text-center">
            <p className="text-gray-500 text-lg">
              No hay solicitudes de cotización {filtro !== "todas" ? `con estado "${filtro}"` : ""}
            </p>
          </div>
        ) : (
          cotizaciones.map((cotizacion) => (
            <div key={cotizacion.id} className="bg-white p-6 rounded-lg shadow-md relative">
              {/* Indicador de actualización */}
              {isUpdating === cotizacion.id && (
                <div className="absolute inset-0 bg-black bg-opacity-10 flex items-center justify-center rounded-lg z-10">
                  <div className="bg-white p-4 rounded-lg shadow-lg">
                    <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
                    <p className="mt-2 text-sm text-gray-600">Actualizando estado en la base de datos...</p>
                  </div>
                </div>
              )}

              <div className="flex flex-col md:flex-row justify-between mb-4">
                <div>
                  <div className="flex items-center">
                    <h3 className="text-xl font-semibold">{getNombreEmpresa(cotizacion)}</h3>
                    <button
                      onClick={() => toggleColapso(cotizacion.id)}
                      className="ml-2 p-1 rounded-full hover:bg-gray-100 transition-all duration-200"
                      aria-label={tarjetasColapsadas[cotizacion.id] ? "Expandir" : "Colapsar"}
                    >
                      <ChevronDown
                        className={`h-5 w-5 text-gray-500 transition-transform duration-200 ${
                          tarjetasColapsadas[cotizacion.id] ? "" : "rotate-180"
                        }`}
                      />
                    </button>
                  </div>
                  <p className="text-gray-600">
                    Solicitado por: {cotizacion.user?.name || getNombreContacto(cotizacion)} (
                    {cotizacion.user?.email || getEmail(cotizacion)})
                  </p>
                  <p className="text-gray-600">
                    Fecha:{" "}
                    {new Date(cotizacion.created_at).toLocaleDateString("es-ES", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
                <div className="mt-2 md:mt-0">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
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
                </div>
              </div>

              {/* Contenido colapsable */}
              <div
                className={`transition-all duration-300 overflow-hidden ${
                  tarjetasColapsadas[cotizacion.id] ? "max-h-0 opacity-0" : "max-h-[1000px] opacity-100"
                }`}
              >
                <div className="mb-4">
                  <h4 className="font-medium mb-2">Detalles de contacto:</h4>
                  <p>Contacto: {getNombreContacto(cotizacion)}</p>
                  <p>Email: {getEmail(cotizacion)}</p>
                  <p>Teléfono: {getTelefono(cotizacion)}</p>
                </div>

                <div className="mb-4">
                  <h4 className="font-medium mb-2">Esquemas solicitados:</h4>
                  <ul className="list-disc list-inside">
                    {cotizacion.esquemas && cotizacion.esquemas.map((esquema, index) => <li key={index}>{esquema}</li>)}
                  </ul>
                </div>

                <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium mb-2">Detalles financieros:</h4>
                    <p>Subtotal: {formatCurrency(cotizacion.subtotal || 0, cotizacion.moneda || "USD")}</p>
                    {cotizacion.descuento_porcentaje > 0 && (
                      <p>
                        Descuento: {cotizacion.descuento_porcentaje}% (
                        {formatCurrency(cotizacion.descuento_monto || 0, cotizacion.moneda || "USD")})
                      </p>
                    )}
                    {cotizacion.iva > 0 && (
                      <p>
                        IVA ({cotizacion.tasa_iva}%): {formatCurrency(cotizacion.iva || 0, cotizacion.moneda || "USD")}
                      </p>
                    )}
                    <p className="font-semibold">
                      Total: {formatCurrency(cotizacion.total || 0, cotizacion.moneda || "USD")}
                    </p>
                  </div>
                </div>

                {cotizacion.estado === "rechazada" && cotizacion.motivo_rechazo && (
                  <div className="mb-4 p-3 bg-red-50 rounded-md">
                    <h4 className="font-medium text-red-800">Motivo de rechazo:</h4>
                    <p className="text-red-700">{cotizacion.motivo_rechazo}</p>
                  </div>
                )}

                {cotizacion.estado === "pendiente" && (
                  <div className="flex gap-2 mt-4">
                    <Button
                      className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                      onClick={() => aceptarCotizacion(cotizacion.id)}
                      disabled={isUpdating !== null}
                    >
                      {isUpdating === cotizacion.id ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Procesando...
                        </>
                      ) : (
                        "Aceptar Cotización"
                      )}
                    </Button>
                    <Button
                      className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                      onClick={() => mostrarModalRechazo(cotizacion.id)}
                      disabled={isUpdating !== null}
                    >
                      Rechazar Cotización
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal de rechazo */}
      {cotizacionSeleccionada !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-semibold mb-4">Motivo de rechazo</h3>
            <p className="mb-4 text-gray-600">
              Por favor, proporcione un motivo para rechazar esta cotización. Este mensaje será visible para el usuario.
            </p>
            <Textarea
              placeholder="Escriba el motivo del rechazo..."
              className="mb-4"
              rows={4}
              value={motivoRechazo[cotizacionSeleccionada] || ""}
              onChange={(e) =>
                setMotivoRechazo((prev) => ({
                  ...prev,
                  [cotizacionSeleccionada]: e.target.value,
                }))
              }
            />
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setCotizacionSeleccionada(null)}>
                Cancelar
              </Button>
              <Button
                className="bg-red-600 hover:bg-red-700"
                onClick={() => rechazarCotizacion(cotizacionSeleccionada)}
                disabled={isUpdating !== null}
              >
                {isUpdating === cotizacionSeleccionada ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Procesando...
                  </>
                ) : (
                  "Confirmar Rechazo"
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de mensaje */}
      {mostrarModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3
              className={`text-xl font-semibold mb-4 ${mensajeModal.tipo === "exito" ? "text-green-600" : "text-red-600"}`}
            >
              {mensajeModal.titulo}
            </h3>
            <p className="mb-6 text-gray-700">{mensajeModal.mensaje}</p>
            <div className="flex justify-end">
              <Button
                className={
                  mensajeModal.tipo === "exito" ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"
                }
                onClick={() => setMostrarModal(false)}
              >
                Aceptar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
