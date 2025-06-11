"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AnimatedTabsContent } from "@/components/ui/animated-tabs"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { FancyCard } from "@/components/ui/fancy-card"
import { DecorativeBackground } from "@/components/ui/decorative-background"
import { DiscountCodeInput } from "@/components/discount-code-input"
import { useAuth } from "@/lib/auth-context"
import {
  Printer,
  Plus,
  Trash2,
  CheckCircle,
  DollarSign,
  FileText,
  Settings,
  Building,
  User,
  Mail,
  Phone,
  MapPin,
  CreditCard,
  BarChart4,
  CheckSquare,
  Award,
  Sparkles,
  Percent,
  ArrowRight,
  Save,
} from "lucide-react"
import { tarifasPrimusGFS, tarifasGlobalGAP, feesAzzule, feesGlobalGAP as tarifasFeesGlobalGAP } from "@/lib/tarifas"
import { CotizacionPDF } from "@/components/cotizacion-pdf"
import { getExchangeRate } from "@/lib/exchange-rate"
import { useSupabase } from "@/lib/supabase/client"
import { generateAllDocuments } from "@/lib/document-generator"
import { DocumentModal } from "@/components/document-modal"

// Tipo para los datos del formulario general
type DatosGenerales = {
  nombreEmpresa: string
  representanteLegal: string
  direccionFiscal: string
  pais: string
  codigoPostal: string
  rfc: string
  correo: string
  telefono: string
  personaContacto: string
  celular: string
  cargo: string
  paginaWeb: string
  redesSociales: string
}

// Tipo para los datos de PrimusGFS
type DatosPrimusGFS = {
  operaciones: Array<{
    tipo: string
    cantidad: number
    tarifa: number
  }>
}

// Tipo para los datos de GLOBALG.A.P.
type DatosGlobalGAP = {
  opcionCertificacion: string
  alcances: string[]
  addons: string[]
  sitios: Array<{
    tipo: string
    cantidad: number
    tarifa: number
    hectareas: number
  }>
}

export function Cotizador() {
  // Añadir estos hooks al inicio del componente
  const supabase = useSupabase()
  const { user, isAdmin } = useAuth()

  // Estado para manejar el guardado de cotizaciones
  const [isSaving, setIsSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [showConfirmationModal, setShowConfirmationModal] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)

  // Estado para el modal de documentos
  const [showDocumentModal, setShowDocumentModal] = useState(false)
  const [generatedDocuments, setGeneratedDocuments] = useState<any>(null)

  // Estado para controlar qué esquemas están seleccionados
  const [esquemas, setEsquemas] = useState<string[]>([])

  // Estado para los datos generales
  const [datosGenerales, setDatosGenerales] = useState<DatosGenerales>({
    nombreEmpresa: "",
    representanteLegal: "",
    direccionFiscal: "",
    pais: "",
    codigoPostal: "",
    rfc: "",
    correo: "",
    telefono: "",
    personaContacto: "",
    celular: "",
    cargo: "",
    paginaWeb: "",
    redesSociales: "",
  })

  // Estado para los datos de PrimusGFS
  const [datosPrimusGFS, setDatosPrimusGFS] = useState<DatosPrimusGFS>({
    operaciones: [{ tipo: "granja", cantidad: 1, tarifa: tarifasPrimusGFS["granja"] }],
  })

  // Estado para los datos de GLOBALG.A.P.
  const [datosGlobalGAP, setDatosGlobalGAP] = useState<DatosGlobalGAP>({
    opcionCertificacion: "opcion1_individual",
    alcances: ["frutas_vegetales"],
    addons: [],
    sitios: [{ tipo: "granja", cantidad: 1, tarifa: tarifasGlobalGAP["granja"], hectareas: 1 }],
  })

  // Estado para configuración de la cotización
  const [tasaIVA, setTasaIVA] = useState<number>(16)
  const [moneda, setMoneda] = useState<string>("USD")
  const [incluirIVA, setIncluirIVA] = useState<boolean>(true)
  const [tipoCambio, setTipoCambio] = useState<number>(17.5)
  const [discountPercentage, setDiscountPercentage] = useState<number>(0)

  // Estado para controlar la pestaña activa
  const [pestanaActiva, setPestanaActiva] = useState<string>("general")

  // Estado para animaciones
  const [isLoaded, setIsLoaded] = useState(false)

  // Estado para controlar la carga del tipo de cambio
  const [isLoadingExchangeRate, setIsLoadingExchangeRate] = useState(false)

  // Obtener el tipo de cambio actual cuando se selecciona MXN como moneda
  useEffect(() => {
    if (moneda === "MXN" && !isLoadingExchangeRate) {
      setIsLoadingExchangeRate(true)
      getExchangeRate()
        .then((rate) => {
          setTipoCambio(rate)
        })
        .finally(() => {
          setIsLoadingExchangeRate(false)
        })
    }
  }, [moneda, isLoadingExchangeRate])

  // Efecto para animación inicial
  useEffect(() => {
    setIsLoaded(true)
  }, [])

  // Manejador para cambiar los esquemas seleccionados
  const manejarCambioEsquemas = (esquema: string) => {
    if (esquemas.includes(esquema)) {
      setEsquemas(esquemas.filter((e) => e !== esquema))
    } else {
      setEsquemas([...esquemas, esquema])
    }
  }

  // Manejador para actualizar datos generales
  const actualizarDatosGenerales = (campo: keyof DatosGenerales, valor: string) => {
    setDatosGenerales({
      ...datosGenerales,
      [campo]: valor,
    })
  }

  // Manejadores para PrimusGFS
  const agregarOperacionPrimusGFS = () => {
    setDatosPrimusGFS({
      ...datosPrimusGFS,
      operaciones: [...datosPrimusGFS.operaciones, { tipo: "granja", cantidad: 1, tarifa: tarifasPrimusGFS["granja"] }],
    })
  }

  const eliminarOperacionPrimusGFS = (index: number) => {
    const nuevasOperaciones = [...datosPrimusGFS.operaciones]
    nuevasOperaciones.splice(index, 1)
    setDatosPrimusGFS({
      ...datosPrimusGFS,
      operaciones: nuevasOperaciones,
    })
  }

  const actualizarOperacionPrimusGFS = (index: number, campo: string, valor: any) => {
    const nuevasOperaciones = [...datosPrimusGFS.operaciones]

    if (campo === "tipo") {
      // Definir tarifas específicas según el tipo de operación
      const tarifasEspecificas = {
        granja: 1200,
        invernadero: 1200,
        cuadrilla_cosecha: 200,
        empaque: 1500,
        cuarto_frio: 1200,
        procesadora: 2000,
        centro_distribucion: 1300,
      }

      nuevasOperaciones[index] = {
        ...nuevasOperaciones[index],
        tipo: valor,
        tarifa: tarifasEspecificas[valor] || tarifasPrimusGFS[valor],
      }
    } else if (campo === "tarifa" && isAdmin) {
      // Solo los administradores pueden cambiar la tarifa manualmente
      nuevasOperaciones[index] = {
        ...nuevasOperaciones[index],
        tarifa: Number.parseFloat(valor),
      }
    } else {
      nuevasOperaciones[index] = {
        ...nuevasOperaciones[index],
        [campo]: valor,
      }
    }

    setDatosPrimusGFS({
      ...datosPrimusGFS,
      operaciones: nuevasOperaciones,
    })
  }

  // Manejadores para GLOBALG.A.P.
  const actualizarOpcionCertificacionGlobalGAP = (valor: string) => {
    setDatosGlobalGAP({
      ...datosGlobalGAP,
      opcionCertificacion: valor,
    })
  }

  const actualizarAlcancesGlobalGAP = (valor: string) => {
    if (datosGlobalGAP.alcances.includes(valor)) {
      setDatosGlobalGAP({
        ...datosGlobalGAP,
        alcances: datosGlobalGAP.alcances.filter((a) => a !== valor),
      })
    } else {
      setDatosGlobalGAP({
        ...datosGlobalGAP,
        alcances: [...datosGlobalGAP.alcances, valor],
      })
    }
  }

  const actualizarAddonsGlobalGAP = (valor: string) => {
    if (datosGlobalGAP.addons.includes(valor)) {
      setDatosGlobalGAP({
        ...datosGlobalGAP,
        addons: datosGlobalGAP.addons.filter((a) => a !== valor),
      })
    } else {
      setDatosGlobalGAP({
        ...datosGlobalGAP,
        addons: [...datosGlobalGAP.addons, valor],
      })
    }
  }

  const agregarSitioGlobalGAP = () => {
    setDatosGlobalGAP({
      ...datosGlobalGAP,
      sitios: [
        ...datosGlobalGAP.sitios,
        { tipo: "granja", cantidad: 1, tarifa: tarifasGlobalGAP["granja"], hectareas: 1 },
      ],
    })
  }

  const eliminarSitioGlobalGAP = (index: number) => {
    const nuevosSitios = [...datosGlobalGAP.sitios]
    nuevosSitios.splice(index, 1)
    setDatosGlobalGAP({
      ...datosGlobalGAP,
      sitios: nuevosSitios,
    })
  }

  const actualizarSitioGlobalGAP = (index: number, campo: string, valor: any) => {
    const nuevosSitios = [...datosGlobalGAP.sitios]

    if (campo === "tipo") {
      nuevosSitios[index] = {
        ...nuevosSitios[index],
        tipo: valor,
        tarifa: tarifasGlobalGAP[valor],
      }
    } else if (campo === "tarifa") {
      nuevosSitios[index] = {
        ...nuevosSitios[index],
        tarifa: Number.parseFloat(valor),
      }
    } else {
      nuevosSitios[index] = {
        ...nuevosSitios[index],
        [campo]: valor,
      }
    }

    setDatosGlobalGAP({
      ...datosGlobalGAP,
      sitios: nuevosSitios,
    })
  }

  // Cálculos para PrimusGFS
  const calcularSubtotalPrimusGFS = () => {
    return datosPrimusGFS.operaciones.reduce((total, op) => total + op.tarifa * op.cantidad, 0)
  }

  const calcularFeesAzzule = () => {
    if (!esquemas.includes("primusgfs")) return 0

    let totalFees = 0

    // $50 USD por registrar una organización (solo una vez)
    totalFees += feesAzzule.registroOrganizacion

    // Sumar fees por cada operación
    datosPrimusGFS.operaciones.forEach((op) => {
      // $40 USD por registro de auditoría por operación
      totalFees += feesAzzule.registroAuditoria * op.cantidad

      // Fees por certificación según tipo de operación
      if (["granja", "invernadero", "cuadrilla_cosecha"].includes(op.tipo)) {
        // $27 USD por certificación de operación de campo
        totalFees += feesAzzule.certificacionCampo * op.cantidad
      } else {
        // $30 USD por certificación de operación de instalación
        totalFees += feesAzzule.certificacionInstalacion * op.cantidad
      }
    })

    return totalFees
  }

  // Cálculos para GLOBALG.A.P.
  const calcularSubtotalGlobalGAP = () => {
    let subtotal = datosGlobalGAP.sitios.reduce((total, sitio) => {
      // Calcular el costo por sitio considerando hectáreas
      const costoSitio = sitio.tarifa * sitio.cantidad * sitio.hectareas
      return total + costoSitio
    }, 0)

    // Añadir costos de addons si están seleccionados
    datosGlobalGAP.addons.forEach((addon) => {
      subtotal += 200 // Valor ejemplo para addons
    })

    return subtotal
  }

  const calcularFeesGlobalGAP = () => {
    if (!esquemas.includes("globalgap")) return 0

    let totalFees = 0

    // Calcular fees basados en la opción de certificación
    switch (datosGlobalGAP.opcionCertificacion) {
      case "opcion1_individual":
        totalFees += tarifasFeesGlobalGAP.opcion1_individual
        break
      case "opcion1_multisitio_sgc":
        totalFees += tarifasFeesGlobalGAP.opcion1_multisitio_sgc
        break
      case "opcion1_multisitio_sin_sgc":
        totalFees += tarifasFeesGlobalGAP.opcion1_multisitio_sin_sgc
        break
      case "opcion2_grupo":
        totalFees += tarifasFeesGlobalGAP.opcion2_grupo
        break
      case "cadena_custodia":
        totalFees += tarifasFeesGlobalGAP.cadena_custodia
        break
      default:
        totalFees += 0
    }

    // Sumar fees por cada sitio
    datosGlobalGAP.sitios.forEach((sitio) => {
      totalFees += tarifasFeesGlobalGAP.inspeccion_sitio * sitio.cantidad
    })

    // Sumar fees por cada add-on
    datosGlobalGAP.addons.forEach((addon) => {
      totalFees += tarifasFeesGlobalGAP.addon
    })

    return totalFees
  }

  // Cálculos totales
  const subtotalPrimusGFS = esquemas.includes("primusgfs") ? calcularSubtotalPrimusGFS() : 0
  const feesPrimusGFS = calcularFeesAzzule()

  const subtotalGlobalGAP = esquemas.includes("globalgap") ? calcularSubtotalGlobalGAP() : 0
  const feesGlobalGAP = calcularFeesGlobalGAP()

  const subtotalGeneral = subtotalPrimusGFS + subtotalGlobalGAP
  const feesTotal = feesPrimusGFS + feesGlobalGAP
  const totalSinIVA = subtotalGeneral + feesTotal

  // Aplicar descuento si hay un código de descuento válido
  const montoDescuento = discountPercentage > 0 ? totalSinIVA * (discountPercentage / 100) : 0
  const totalConDescuento = totalSinIVA - montoDescuento

  const iva = incluirIVA ? totalConDescuento * (tasaIVA / 100) : 0
  const total = totalConDescuento + iva

  // Manejador para aplicar descuento
  const handleApplyDiscount = (percentage: number) => {
    setDiscountPercentage(percentage)
  }

  // Conversión de moneda
  const convertirMoneda = (valor: number) => {
    return moneda === "MXN" ? valor * tipoCambio : valor
  }

  const formatoMoneda = (valor: number) => {
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: moneda,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(convertirMoneda(valor))
  }

  // Función para guardar la cotización en la base de datos
  const guardarCotizacion = async () => {
    if (!user) {
      setSaveError("Debes iniciar sesión para guardar una cotización")
      return
    }

    try {
      setIsSaving(true)
      setSaveError(null)
      setSaveSuccess(false)

      // Crear objeto con los datos de la cotización
      const cotizacion = {
        user_id: user.id,
        fecha: new Date().toISOString(),
        datos_generales: datosGenerales,
        esquemas: esquemas,
        datos_primusgfs: esquemas.includes("primusgfs") ? datosPrimusGFS : null,
        datos_globalgap: esquemas.includes("globalgap") ? datosGlobalGAP : null,
        moneda: moneda,
        tipo_cambio: tipoCambio,
        incluir_iva: incluirIVA,
        tasa_iva: tasaIVA,
        subtotal: totalSinIVA,
        descuento_porcentaje: discountPercentage,
        descuento_monto: montoDescuento,
        iva: iva,
        total: total,
      }

      // Guardar en la base de datos
      const { data, error } = await supabase.from("cotizaciones").insert([cotizacion])

      if (error) {
        console.error("Error al guardar la cotización:", error)
        setSaveError(`Error al guardar: ${error.message}`)
        return
      }

      console.log("Cotización guardada con éxito:", data)
      setSaveSuccess(true)
      setShowConfirmationModal(true) // Mostrar el modal de confirmación
    } catch (error) {
      console.error("Error al guardar la cotización:", error)
      setSaveError(`Error inesperado: ${error instanceof Error ? error.message : "Desconocido"}`)
    } finally {
      setIsSaving(false)
    }
  }

  // Función para generar los documentos
  const generarDocumentos = () => {
    const documents = generateAllDocuments({
      datosGenerales,
      esquemas,
      datosPrimusGFS,
      datosGlobalGAP,
      moneda,
      tipoCambio,
      incluirIVA,
      tasaIVA,
      discountPercentage,
      total,
      subtotalGeneral,
      iva,
    })

    setGeneratedDocuments(documents)
    setShowDocumentModal(true)
  }

  // Función para manejar la navegación entre pestañas
  const handleContinuar = () => {
    if (pestanaActiva === "general") {
      // Si hay esquemas seleccionados, ir a la primera pestaña de esquema
      if (esquemas.includes("primusgfs")) {
        setPestanaActiva("primusgfs")
      } else if (esquemas.includes("globalgap")) {
        setPestanaActiva("globalgap")
      } else {
        // Si no hay esquemas, ir a configuración
        setPestanaActiva("configuracion")
      }
    } else if (pestanaActiva === "primusgfs") {
      // Si también está seleccionado GLOBALG.A.P., ir a esa pestaña
      if (esquemas.includes("globalgap")) {
        setPestanaActiva("globalgap")
      } else {
        // Si no, ir a configuración
        setPestanaActiva("configuracion")
      }
    } else if (pestanaActiva === "globalgap" || pestanaActiva === "configuracion") {
      // De GLOBALG.A.P. o configuración, ir a resumen
      setPestanaActiva("resumen")
    }
  }

  const imprimirCotizacion = () => {
    window.print()
  }

  // Función para generar PDF
  const generarPDF = () => {
    setPestanaActiva("pdf")
  }

  // Variantes para animaciones
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 10, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 70 },
    },
  }

  // Determinar el texto y la acción del botón principal según la pestaña activa
  const renderBotonPrincipal = () => {
    if (pestanaActiva === "resumen") {
      return (
        <>
          <Button
            className="w-full sm:w-auto gradient-bg hover:opacity-90 transition-opacity shadow-lg"
            onClick={guardarCotizacion}
            disabled={isSaving}
          >
            {isSaving ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                Guardando...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" /> Cotizar
              </>
            )}
          </Button>
          <ConfirmationModal />
        </>
      )
    } else if (pestanaActiva === "pdf") {
      return (
        <Button
          className="w-full sm:w-auto gradient-bg hover:opacity-90 transition-opacity shadow-lg"
          onClick={() => setPestanaActiva("resumen")}
        >
          <ArrowRight className="mr-2 h-4 w-4" /> Volver al Resumen
        </Button>
      )
    } else {
      return (
        <Button
          className="w-full sm:w-auto gradient-bg hover:opacity-90 transition-opacity shadow-lg"
          onClick={handleContinuar}
        >
          <ArrowRight className="mr-2 h-4 w-4" /> Continuar
        </Button>
      )
    }
  }

  // Renderizar el modal de confirmación
  const ConfirmationModal = () => {
    if (!showConfirmationModal) return null

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4 animate-fade-in">
          <div className="text-center mb-4">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-800">¡Cotización enviada con éxito!</h3>
            <p className="text-gray-600 mt-2">
              Espere su aprobación por parte de CEMA. Un representante revisará su solicitud y se pondrá en contacto con
              usted.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 mt-6">
            <Button
              className="w-full bg-blue-600 hover:bg-blue-700"
              onClick={() => {
                setShowConfirmationModal(false)
                setPestanaActiva("pdf")
              }}
            >
              <FileText className="mr-2 h-4 w-4" /> Ver PDF
            </Button>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => {
                setShowConfirmationModal(false)
                imprimirCotizacion()
              }}
            >
              <Printer className="mr-2 h-4 w-4" /> Imprimir
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <DecorativeBackground />
      <div className="grid gap-6 relative z-10" initial="hidden" animate={isLoaded ? "visible" : "hidden"}>
        <div>
          <Card className="overflow-hidden border-none shadow-2xl">
            <CardHeader className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white p-8">
              <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                <div className="absolute top-0 left-0 w-full h-full pattern-dots"></div>
              </div>
              <div className="relative z-10 flex items-center justify-between">
                <div>
                  <CardTitle className="text-3xl md:text-4xl font-bold flex items-center gap-3">
                    <Award className="h-8 w-8" />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-blue-100">
                      Cotizador de Certificaciones
                    </span>
                  </CardTitle>
                  <CardDescription className="text-white/90 text-lg mt-2">
                    Calcule el costo de sus certificaciones con nuestra herramienta interactiva
                  </CardDescription>
                </div>
                <div className="hidden md:block bg-white/90 p-2 rounded-lg">
                  <img src="/images/cema-logo.png" alt="CEMA - Organismo de Certificación" className="h-12 w-auto" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="p-6 md:p-8 space-y-8">
                <div className="animate-float">
                  <FancyCard variant="gradient" className="shimmer">
                    <h3 className="text-xl font-bold mb-6 gradient-text flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-blue-500" />
                      Seleccione los esquemas de certificación
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div
                        className={`flex items-center gap-4 p-5 rounded-xl transition-all cursor-pointer hover:shadow-lg ${
                          esquemas.includes("primusgfs")
                            ? "bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200"
                            : "bg-white/70 border border-gray-100"
                        }`}
                        onClick={() => manejarCambioEsquemas("primusgfs")}
                      >
                        <div
                          className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                            esquemas.includes("primusgfs") ? "bg-blue-600 text-white" : "bg-blue-100 text-blue-600"
                          }`}
                        >
                          <CheckSquare className="h-6 w-6" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-lg">PrimusGFS v3.2</h4>
                          <p className="text-sm text-gray-500">Estándar reconocido por GFSI</p>
                        </div>
                        <Checkbox
                          id="primusgfs"
                          checked={esquemas.includes("primusgfs")}
                          onCheckedChange={() => manejarCambioEsquemas("primusgfs")}
                          className="ml-auto data-[state=checked]:bg-blue-600"
                        />
                      </div>

                      <div
                        className={`flex items-center gap-4 p-5 rounded-xl transition-all cursor-pointer hover:shadow-lg ${
                          esquemas.includes("globalgap")
                            ? "bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200"
                            : "bg-white/70 border border-gray-100"
                        }`}
                        onClick={() => manejarCambioEsquemas("globalgap")}
                      >
                        <div
                          className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                            esquemas.includes("globalgap")
                              ? "bg-purple-600 text-white"
                              : "bg-purple-100 text-purple-600"
                          }`}
                        >
                          <Award className="h-6 w-6" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-lg">GLOBALG.A.P.</h4>
                          <p className="text-sm text-gray-500">Estándar global de buenas prácticas</p>
                        </div>
                        <Checkbox
                          id="globalgap"
                          checked={esquemas.includes("globalgap")}
                          onCheckedChange={() => manejarCambioEsquemas("globalgap")}
                          className="ml-auto data-[state=checked]:bg-purple-600"
                        />
                      </div>
                    </div>
                  </FancyCard>
                </div>

                <Separator className="bg-gradient-to-r from-transparent via-gray-300 to-transparent" />

                <Tabs value={pestanaActiva} onValueChange={setPestanaActiva} className="w-full">
                  <TabsList className="w-full mb-6 flex flex-wrap justify-start gap-2 bg-white/50 p-2 overflow-x-auto rounded-xl shadow-inner">
                    <TabsTrigger
                      value="general"
                      className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-blue-600 data-[state=active]:text-white transition-all duration-300"
                    >
                      <FileText className="h-4 w-4" />
                      <span className="hidden sm:inline">Información General</span>
                      <span className="sm:hidden">General</span>
                    </TabsTrigger>
                    {esquemas.includes("primusgfs") && (
                      <TabsTrigger
                        value="primusgfs"
                        className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-blue-600 data-[state=active]:text-white transition-all duration-300"
                      >
                        <span className="hidden sm:inline">PrimusGFS</span>
                        <span className="sm:hidden">PrimusGFS</span>
                      </TabsTrigger>
                    )}
                    {esquemas.includes("globalgap") && (
                      <TabsTrigger
                        value="globalgap"
                        className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-purple-600 data-[state=active]:text-white transition-all duration-300"
                      >
                        <span className="hidden sm:inline">GLOBALG.A.P.</span>
                        <span className="sm:hidden">GLOBALG.A.P.</span>
                      </TabsTrigger>
                    )}
                    <TabsTrigger
                      value="configuracion"
                      className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-gray-500 data-[state=active]:to-gray-600 data-[state=active]:text-white transition-all duration-300"
                    >
                      <Settings className="h-4 w-4" />
                      <span className="hidden sm:inline">Configuración</span>
                      <span className="sm:hidden">Config</span>
                    </TabsTrigger>
                    <TabsTrigger
                      value="resumen"
                      className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-green-600 data-[state=active]:text-white transition-all duration-300"
                    >
                      <DollarSign className="h-4 w-4" />
                      <span className="hidden sm:inline">Resumen</span>
                      <span className="sm:hidden">Resumen</span>
                    </TabsTrigger>
                    <TabsTrigger
                      value="pdf"
                      className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-500 data-[state=active]:to-red-600 data-[state=active]:text-white transition-all duration-300"
                    >
                      <FileText className="h-4 w-4" />
                      <span className="hidden sm:inline">PDF</span>
                      <span className="sm:hidden">PDF</span>
                    </TabsTrigger>
                  </TabsList>

                  {/* Pestaña de Información General */}
                  <AnimatedTabsContent value="general" activeTab={pestanaActiva}>
                    <FancyCard variant="glass" className="animate-fade-in">
                      <h3 className="text-xl font-bold mb-6 gradient-text-teal flex items-center gap-2">
                        <Building className="h-5 w-5 text-teal-500" />
                        Información General de la Empresa
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="nombreEmpresa" className="text-gray-700 flex items-center gap-2">
                              <Building className="h-4 w-4 text-blue-500" />
                              Nombre del productor o empresa
                            </Label>
                            <Input
                              id="nombreEmpresa"
                              value={datosGenerales.nombreEmpresa}
                              onChange={(e) => actualizarDatosGenerales("nombreEmpresa", e.target.value)}
                              className="bg-white/80 focus:bg-white transition-colors border-blue-100 focus:border-blue-300"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="representanteLegal" className="text-gray-700 flex items-center gap-2">
                              <User className="h-4 w-4 text-blue-500" />
                              Nombre del representante legal
                            </Label>
                            <Input
                              id="representanteLegal"
                              value={datosGenerales.representanteLegal}
                              onChange={(e) => actualizarDatosGenerales("representanteLegal", e.target.value)}
                              className="bg-white/80 focus:bg-white transition-colors border-blue-100 focus:border-blue-300"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="direccionFiscal" className="text-gray-700 flex items-center gap-2">
                              <MapPin className="h-4 w-4 text-blue-500" />
                              Dirección fiscal
                            </Label>
                            <Input
                              id="direccionFiscal"
                              value={datosGenerales.direccionFiscal}
                              onChange={(e) => actualizarDatosGenerales("direccionFiscal", e.target.value)}
                              className="bg-white/80 focus:bg-white transition-colors border-blue-100 focus:border-blue-300"
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="pais" className="text-gray-700">
                                País
                              </Label>
                              <Input
                                id="pais"
                                value={datosGenerales.pais}
                                onChange={(e) => actualizarDatosGenerales("pais", e.target.value)}
                                className="bg-white/80 focus:bg-white transition-colors border-blue-100 focus:border-blue-300"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="codigoPostal" className="text-gray-700">
                                C.P.
                              </Label>
                              <Input
                                id="codigoPostal"
                                value={datosGenerales.codigoPostal}
                                onChange={(e) => actualizarDatosGenerales("codigoPostal", e.target.value)}
                                className="bg-white/80 focus:bg-white transition-colors border-blue-100 focus:border-blue-300"
                              />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="rfc" className="text-gray-700 flex items-center gap-2">
                              <CreditCard className="h-4 w-4 text-blue-500" />
                              RFC/RUT/CIF-NIF
                            </Label>
                            <Input
                              id="rfc"
                              value={datosGenerales.rfc}
                              onChange={(e) => actualizarDatosGenerales("rfc", e.target.value)}
                              className="bg-white/80 focus:bg-white transition-colors border-blue-100 focus:border-blue-300"
                            />
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="correo" className="text-gray-700 flex items-center gap-2">
                              <Mail className="h-4 w-4 text-purple-500" />
                              Correo electrónico
                            </Label>
                            <Input
                              id="correo"
                              type="email"
                              value={datosGenerales.correo}
                              onChange={(e) => actualizarDatosGenerales("correo", e.target.value)}
                              className="bg-white/80 focus:bg-white transition-colors border-purple-100 focus:border-purple-300"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="telefono" className="text-gray-700 flex items-center gap-2">
                              <Phone className="h-4 w-4 text-purple-500" />
                              Teléfono
                            </Label>
                            <Input
                              id="telefono"
                              value={datosGenerales.telefono}
                              onChange={(e) => actualizarDatosGenerales("telefono", e.target.value)}
                              className="bg-white/80 focus:bg-white transition-colors border-purple-100 focus:border-purple-300"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="personaContacto" className="text-gray-700 flex items-center gap-2">
                              <User className="h-4 w-4 text-purple-500" />
                              Persona de contacto
                            </Label>
                            <Input
                              id="personaContacto"
                              value={datosGenerales.personaContacto}
                              onChange={(e) => actualizarDatosGenerales("personaContacto", e.target.value)}
                              className="bg-white/80 focus:bg-white transition-colors border-purple-100 focus:border-purple-300"
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="celular" className="text-gray-700">
                                Celular
                              </Label>
                              <Input
                                id="celular"
                                value={datosGenerales.celular}
                                onChange={(e) => actualizarDatosGenerales("celular", e.target.value)}
                                className="bg-white/80 focus:bg-white transition-colors border-purple-100 focus:border-purple-300"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="cargo" className="text-gray-700">
                                Cargo o función
                              </Label>
                              <Input
                                id="cargo"
                                value={datosGenerales.cargo}
                                onChange={(e) => actualizarDatosGenerales("cargo", e.target.value)}
                                className="bg-white/80 focus:bg-white transition-colors border-purple-100 focus:border-purple-300"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="paginaWeb" className="text-gray-700">
                                Página web
                              </Label>
                              <Input
                                id="paginaWeb"
                                value={datosGenerales.paginaWeb}
                                onChange={(e) => actualizarDatosGenerales("paginaWeb", e.target.value)}
                                className="bg-white/80 focus:bg-white transition-colors border-purple-100 focus:border-purple-300"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="redesSociales" className="text-gray-700">
                                Redes sociales
                              </Label>
                              <Input
                                id="redesSociales"
                                value={datosGenerales.redesSociales}
                                onChange={(e) => actualizarDatosGenerales("redesSociales", e.target.value)}
                                className="bg-white/80 focus:bg-white transition-colors border-purple-100 focus:border-purple-300"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </FancyCard>
                  </AnimatedTabsContent>

                  {/* Pestaña de PrimusGFS */}
                  <AnimatedTabsContent value="primusgfs" activeTab={pestanaActiva}>
                    <FancyCard variant="glass" className="animate-fade-in">
                      <h3 className="text-xl font-bold mb-6 gradient-text flex items-center gap-2">
                        <BarChart4 className="h-5 w-5 text-blue-500" />
                        Configuración PrimusGFS v3.2
                      </h3>

                      <div className="space-y-6">
                        <h4 className="font-semibold text-lg text-blue-700 flex items-center gap-2">
                          <CheckSquare className="h-4 w-4" />
                          Operaciones a evaluar
                        </h4>
                        <div className="space-y-4">
                          {datosPrimusGFS.operaciones.map((op, index) => (
                            <div
                              key={index}
                              className="bg-gradient-to-r from-blue-50 to-white p-5 rounded-xl shadow-sm border border-blue-100 hover-lift"
                            >
                              <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-end">
                                <div className="sm:col-span-5">
                                  <Label htmlFor={`tipo-${index}`} className="text-gray-700 font-medium">
                                    Tipo de Operación
                                  </Label>
                                  <Select
                                    value={op.tipo}
                                    onValueChange={(valor) => actualizarOperacionPrimusGFS(index, "tipo", valor)}
                                  >
                                    <SelectTrigger id={`tipo-${index}`} className="bg-white border-blue-200">
                                      <SelectValue placeholder="Seleccione tipo" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="granja">Granja</SelectItem>
                                      <SelectItem value="invernadero">Invernadero</SelectItem>
                                      <SelectItem value="cuadrilla_cosecha">Cuadrilla de Cosecha</SelectItem>
                                      <SelectItem value="empaque">Empaque</SelectItem>
                                      <SelectItem value="cuarto_frio">Cuarto Frío</SelectItem>
                                      <SelectItem value="procesadora">Procesadora</SelectItem>
                                      <SelectItem value="centro_distribucion">Centro de Distribución</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>

                                <div className="sm:col-span-2">
                                  <Label htmlFor={`cantidad-${index}`} className="text-gray-700 font-medium">
                                    Cantidad
                                  </Label>
                                  <Input
                                    id={`cantidad-${index}`}
                                    type="number"
                                    min="1"
                                    value={op.cantidad}
                                    onChange={(e) =>
                                      actualizarOperacionPrimusGFS(
                                        index,
                                        "cantidad",
                                        Number.parseInt(e.target.value) || 1,
                                      )
                                    }
                                    className="bg-white border-blue-200"
                                  />
                                </div>

                                <div className="sm:col-span-3">
                                  <Label htmlFor={`tarifa-${index}`} className="text-gray-700 font-medium">
                                    Tarifa (USD)
                                  </Label>
                                  <Input
                                    id={`tarifa-${index}`}
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={op.tarifa}
                                    onChange={(e) =>
                                      actualizarOperacionPrimusGFS(
                                        index,
                                        "tarifa",
                                        Number.parseFloat(e.target.value) || 0,
                                      )
                                    }
                                    className={`bg-white border-blue-200 ${!isAdmin ? "opacity-75" : ""}`}
                                    readOnly={!isAdmin}
                                  />
                                </div>

                                <div className="sm:col-span-2 flex justify-end">
                                  <Button
                                    variant="destructive"
                                    size="icon"
                                    onClick={() => eliminarOperacionPrimusGFS(index)}
                                    disabled={datosPrimusGFS.operaciones.length === 1}
                                    className="hover:bg-red-600 transition-colors"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          ))}

                          <Button
                            onClick={agregarOperacionPrimusGFS}
                            className="w-full bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 hover:border-blue-300 transition-all hover:shadow-md"
                          >
                            <Plus className="mr-2 h-4 w-4" /> Agregar Operación
                          </Button>
                        </div>
                      </div>
                    </FancyCard>
                  </AnimatedTabsContent>

                  {/* Resto del código continúa aquí... */}
                  {/* Pestaña de GLOBALG.A.P. */}
                  <AnimatedTabsContent value="globalgap" activeTab={pestanaActiva}>
                    <FancyCard variant="glass" className="animate-fade-in">
                      <h3 className="text-xl font-bold mb-6 gradient-text-pink flex items-center gap-2">
                        <Award className="h-5 w-5 text-purple-500" />
                        Configuración GLOBALG.A.P.
                      </h3>

                      <div className="space-y-8">
                        <div className="space-y-4">
                          <h4 className="font-semibold text-lg text-purple-700 flex items-center gap-2">
                            <CheckSquare className="h-4 w-4" />
                            Opción de certificación
                          </h4>
                          <div className="bg-gradient-to-r from-purple-50 to-white p-5 rounded-xl shadow-sm border border-purple-100">
                            <RadioGroup
                              value={datosGlobalGAP.opcionCertificacion}
                              onValueChange={actualizarOpcionCertificacionGlobalGAP}
                              className="space-y-3"
                            >
                              <div className="flex items-center space-x-2 p-3 rounded-lg hover:bg-purple-50 transition-colors">
                                <RadioGroupItem
                                  value="opcion1_individual"
                                  id="opcion1_individual"
                                  className="text-purple-600"
                                />
                                <Label htmlFor="opcion1_individual" className="cursor-pointer font-medium">
                                  Opción 1 - Productor Individual
                                </Label>
                              </div>
                              <div className="flex items-center space-x-2 p-3 rounded-lg hover:bg-purple-50 transition-colors">
                                <RadioGroupItem
                                  value="opcion1_multisitio_sgc"
                                  id="opcion1_multisitio_sgc"
                                  className="text-purple-600"
                                />
                                <Label htmlFor="opcion1_multisitio_sgc" className="cursor-pointer font-medium">
                                  Opción 1 - Productor Individual multisitio con SGC
                                </Label>
                              </div>
                              <div className="flex items-center space-x-2 p-3 rounded-lg hover:bg-purple-50 transition-colors">
                                <RadioGroupItem
                                  value="opcion1_multisitio_sin_sgc"
                                  id="opcion1_multisitio_sin_sgc"
                                  className="text-purple-600"
                                />
                                <Label htmlFor="opcion1_multisitio_sin_sgc" className="cursor-pointer font-medium">
                                  Opción 1 - Productor Individual multisitio sin SGC
                                </Label>
                              </div>
                              <div className="flex items-center space-x-2 p-3 rounded-lg hover:bg-purple-50 transition-colors">
                                <RadioGroupItem value="opcion2_grupo" id="opcion2_grupo" className="text-purple-600" />
                                <Label htmlFor="opcion2_grupo" className="cursor-pointer font-medium">
                                  Opción 2 - Grupo de Productores con SGC
                                </Label>
                              </div>
                              <div className="flex items-center space-x-2 p-3 rounded-lg hover:bg-purple-50 transition-colors">
                                <RadioGroupItem
                                  value="cadena_custodia"
                                  id="cadena_custodia"
                                  className="text-purple-600"
                                />
                                <Label htmlFor="cadena_custodia" className="cursor-pointer font-medium">
                                  Cadena de Custodia (CoC)
                                </Label>
                              </div>
                            </RadioGroup>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <h4 className="font-semibold text-lg text-purple-700 flex items-center gap-2">
                            <CheckSquare className="h-4 w-4" />
                            Alcances de la certificación
                          </h4>
                          <div className="bg-gradient-to-r from-purple-50 to-white p-5 rounded-xl shadow-sm border border-purple-100">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              <div className="flex items-center space-x-2 p-3 rounded-lg hover:bg-purple-50 transition-colors">
                                <Checkbox
                                  id="frutas_vegetales"
                                  checked={datosGlobalGAP.alcances.includes("frutas_vegetales")}
                                  onCheckedChange={() => actualizarAlcancesGlobalGAP("frutas_vegetales")}
                                  className="data-[state=checked]:bg-purple-600"
                                />
                                <Label htmlFor="frutas_vegetales" className="cursor-pointer font-medium">
                                  IFA - Frutas y vegetales
                                </Label>
                              </div>
                              <div className="flex items-center space-x-2 p-3 rounded-lg hover:bg-purple-50 transition-colors">
                                <Checkbox
                                  id="flores_ornamentales"
                                  checked={datosGlobalGAP.alcances.includes("flores_ornamentales")}
                                  onCheckedChange={() => actualizarAlcancesGlobalGAP("flores_ornamentales")}
                                  className="data-[state=checked]:bg-purple-600"
                                />
                                <Label htmlFor="flores_ornamentales" className="cursor-pointer font-medium">
                                  IFA - Flores y ornamentales
                                </Label>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <h4 className="font-semibold text-lg text-purple-700 flex items-center gap-2">
                            <CheckSquare className="h-4 w-4" />
                            Add-ons
                          </h4>
                          <div className="bg-gradient-to-r from-purple-50 to-white p-5 rounded-xl shadow-sm border border-purple-100">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              <div className="flex items-center space-x-2 p-3 rounded-lg hover:bg-purple-50 transition-colors">
                                <Checkbox
                                  id="grasp"
                                  checked={datosGlobalGAP.addons.includes("grasp")}
                                  onCheckedChange={() => actualizarAddonsGlobalGAP("grasp")}
                                  className="data-[state=checked]:bg-purple-600"
                                />
                                <Label htmlFor="grasp" className="cursor-pointer font-medium">
                                  Add-on GRASP
                                </Label>
                              </div>
                              <div className="flex items-center space-x-2 p-3 rounded-lg hover:bg-purple-50 transition-colors">
                                <Checkbox
                                  id="fsma_psr"
                                  checked={datosGlobalGAP.addons.includes("fsma_psr")}
                                  onCheckedChange={() => actualizarAddonsGlobalGAP("fsma_psr")}
                                  className="data-[state=checked]:bg-purple-600"
                                />
                                <Label htmlFor="fsma_psr" className="cursor-pointer font-medium">
                                  Add-on FSMA PSR
                                </Label>
                              </div>
                              <div className="flex items-center space-x-2 p-3 rounded-lg hover:bg-purple-50 transition-colors">
                                <Checkbox
                                  id="spring"
                                  checked={datosGlobalGAP.addons.includes("spring")}
                                  onCheckedChange={() => actualizarAddonsGlobalGAP("spring")}
                                  className="data-[state=checked]:bg-purple-600"
                                />
                                <Label htmlFor="spring" className="cursor-pointer font-medium">
                                  Add-on SPRING
                                </Label>
                              </div>
                              <div className="flex items-center space-x-2 p-3 rounded-lg hover:bg-purple-50 transition-colors">
                                <Checkbox
                                  id="tr4_biosecurity"
                                  checked={datosGlobalGAP.addons.includes("tr4_biosecurity")}
                                  onCheckedChange={() => actualizarAddonsGlobalGAP("tr4_biosecurity")}
                                  className="data-[state=checked]:bg-purple-600"
                                />
                                <Label htmlFor="tr4_biosecurity" className="cursor-pointer font-medium">
                                  TR4 Biosecurity
                                </Label>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <h4 className="font-semibold text-lg text-purple-700 flex items-center gap-2">
                            <CheckSquare className="h-4 w-4" />
                            Sitios e Instalaciones
                          </h4>
                          {datosGlobalGAP.sitios.map((sitio, index) => (
                            <div
                              key={index}
                              className="bg-gradient-to-r from-purple-50 to-white p-5 rounded-xl shadow-sm border border-purple-100 hover-lift"
                            >
                              <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-end">
                                <div className="sm:col-span-3">
                                  <Label htmlFor={`sitio-tipo-${index}`} className="text-gray-700 font-medium">
                                    Tipo de Sitio
                                  </Label>
                                  <Select
                                    value={sitio.tipo}
                                    onValueChange={(valor) => actualizarSitioGlobalGAP(index, "tipo", valor)}
                                  >
                                    <SelectTrigger id={`sitio-tipo-${index}`} className="bg-white border-purple-200">
                                      <SelectValue placeholder="Seleccione tipo" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="granja">Granja</SelectItem>
                                      <SelectItem value="invernadero">Invernadero</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>

                                <div className="sm:col-span-2">
                                  <Label htmlFor={`sitio-cantidad-${index}`} className="text-gray-700 font-medium">
                                    Cantidad
                                  </Label>
                                  <Input
                                    id={`sitio-cantidad-${index}`}
                                    type="number"
                                    min="1"
                                    value={sitio.cantidad}
                                    onChange={(e) =>
                                      actualizarSitioGlobalGAP(index, "cantidad", Number.parseInt(e.target.value) || 1)
                                    }
                                    className="bg-white border-purple-200"
                                  />
                                </div>

                                <div className="sm:col-span-2">
                                  <Label htmlFor={`sitio-hectareas-${index}`} className="text-gray-700 font-medium">
                                    Hectáreas
                                  </Label>
                                  <Input
                                    id={`sitio-hectareas-${index}`}
                                    type="number"
                                    min="0.1"
                                    step="0.1"
                                    value={sitio.hectareas}
                                    onChange={(e) =>
                                      actualizarSitioGlobalGAP(
                                        index,
                                        "hectareas",
                                        Number.parseFloat(e.target.value) || 1,
                                      )
                                    }
                                    className="bg-white border-purple-200"
                                  />
                                </div>

                                <div className="sm:col-span-3">
                                  <Label htmlFor={`sitio-tarifa-${index}`} className="text-gray-700 font-medium">
                                    Tarifa (USD)
                                  </Label>
                                  <Input
                                    id={`sitio-tarifa-${index}`}
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={sitio.tarifa}
                                    onChange={(e) =>
                                      actualizarSitioGlobalGAP(index, "tarifa", Number.parseFloat(e.target.value) || 0)
                                    }
                                    className="bg-white border-purple-200"
                                  />
                                </div>

                                <div className="sm:col-span-2 flex justify-end">
                                  <Button
                                    variant="destructive"
                                    size="icon"
                                    onClick={() => eliminarSitioGlobalGAP(index)}
                                    disabled={datosGlobalGAP.sitios.length === 1}
                                    className="hover:bg-red-600 transition-colors"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          ))}

                          <Button
                            onClick={agregarSitioGlobalGAP}
                            className="w-full bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 hover:border-purple-300 transition-all hover:shadow-md"
                          >
                            <Plus className="mr-2 h-4 w-4" /> Agregar Sitio
                          </Button>
                        </div>
                      </div>
                    </FancyCard>
                  </AnimatedTabsContent>

                  {/* Pestaña de Configuración */}
                  <AnimatedTabsContent value="configuracion" activeTab={pestanaActiva}>
                    <FancyCard variant="glass" className="animate-fade-in">
                      <h3 className="text-xl font-bold mb-6 gradient-text flex items-center gap-2">
                        <Settings className="h-5 w-5 text-gray-500" />
                        Configuración de Cotización
                      </h3>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="bg-gradient-to-r from-gray-50 to-white p-5 rounded-xl shadow-sm border border-gray-200 hover-lift">
                          <Label htmlFor="moneda" className="text-gray-700 block mb-3 font-medium">
                            Moneda
                          </Label>
                          <Select value={moneda} onValueChange={setMoneda}>
                            <SelectTrigger id="moneda" className="bg-white border-gray-200">
                              <SelectValue placeholder="Seleccione moneda" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="USD">USD - Dólar Americano</SelectItem>
                              <SelectItem value="MXN">MXN - Peso Mexicano</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        {moneda === "MXN" && (
                          <div className="bg-gradient-to-r from-gray-50 to-white p-5 rounded-xl shadow-sm border border-gray-200 hover-lift">
                            <Label htmlFor="tipo-cambio" className="text-gray-700 block mb-3 font-medium">
                              Tipo de Cambio (USD a MXN)
                            </Label>
                            <div className="relative">
                              <Input
                                id="tipo-cambio"
                                type="number"
                                min="1"
                                step="0.01"
                                value={tipoCambio}
                                onChange={(e) => setTipoCambio(Number.parseFloat(e.target.value) || 17.5)}
                                className="bg-white border-gray-200"
                                disabled={isLoadingExchangeRate}
                              />
                              {isLoadingExchangeRate && (
                                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-blue-500"></div>
                                </div>
                              )}
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                              {isLoadingExchangeRate
                                ? "Obteniendo tipo de cambio actual..."
                                : "Tipo de cambio actualizado automáticamente"}
                            </p>
                          </div>
                        )}

                        <div className="bg-gradient-to-r from-gray-50 to-white p-5 rounded-xl shadow-sm border border-gray-200 hover-lift flex items-center space-x-3">
                          <Checkbox
                            id="incluir-iva"
                            checked={incluirIVA}
                            onCheckedChange={(checked) => setIncluirIVA(checked as boolean)}
                            className="data-[state=checked]:bg-green-600"
                          />
                          <Label htmlFor="incluir-iva" className="cursor-pointer font-medium">
                            Incluir IVA
                          </Label>
                        </div>

                        {incluirIVA && (
                          <div className="bg-gradient-to-r from-gray-50 to-white p-5 rounded-xl shadow-sm border border-gray-200 hover-lift">
                            <Label htmlFor="tasa-iva" className="text-gray-700 block mb-3 font-medium">
                              Tasa de IVA (%)
                            </Label>
                            <Input
                              id="tasa-iva"
                              type="number"
                              min="0"
                              max="100"
                              value={tasaIVA}
                              onChange={(e) => setTasaIVA(Number.parseFloat(e.target.value) || 16)}
                              className="bg-white border-gray-200"
                            />
                          </div>
                        )}
                      </div>
                    </FancyCard>
                  </AnimatedTabsContent>

                  {/* Pestaña de Resumen */}
                  <AnimatedTabsContent value="resumen" activeTab={pestanaActiva}>
                    <FancyCard variant="glass" className="animate-fade-in">
                      <h3 className="text-xl font-bold mb-6 gradient-text flex items-center gap-2">
                        <DollarSign className="h-5 w-5 text-green-500" />
                        Resumen de Costos
                      </h3>

                      {/* Sección de código de descuento */}
                      <div className="mb-8 bg-gradient-to-r from-amber-50 to-white p-5 rounded-xl shadow-sm border border-amber-200">
                        <h4 className="font-semibold text-lg text-amber-700 flex items-center gap-2 mb-4">
                          <Percent className="h-5 w-5" />
                          Código de Descuento
                        </h4>
                        <DiscountCodeInput onApplyDiscount={handleApplyDiscount} />
                      </div>

                      <div className="overflow-x-auto">
                        <Table className="w-full">
                          <TableHeader>
                            <TableRow className="bg-gradient-to-r from-gray-100 to-gray-50">
                              <TableHead className="font-semibold text-gray-700">Concepto</TableHead>
                              <TableHead className="text-right font-semibold text-gray-700">Monto</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {esquemas.includes("primusgfs") && (
                              <>
                                <TableRow className="bg-gradient-to-r from-blue-50 to-blue-100/30 hover:bg-blue-50">
                                  <TableCell className="font-medium text-blue-700">PrimusGFS v3.2</TableCell>
                                  <TableCell className="text-right"></TableCell>
                                </TableRow>
                                <TableRow className="hover:bg-blue-50/30">
                                  <TableCell className="pl-6">Subtotal Certificaciones</TableCell>
                                  <TableCell className="text-right font-medium">
                                    {formatoMoneda(subtotalPrimusGFS)}
                                  </TableCell>
                                </TableRow>
                                <TableRow className="hover:bg-blue-50/30">
                                  <TableCell className="pl-6">Fees de Azzule</TableCell>
                                  <TableCell className="text-right font-medium">
                                    {formatoMoneda(feesPrimusGFS)}
                                  </TableCell>
                                </TableRow>
                              </>
                            )}

                            {esquemas.includes("globalgap") && (
                              <>
                                <TableRow className="bg-gradient-to-r from-purple-50 to-purple-100/30 hover:bg-purple-50">
                                  <TableCell className="font-medium text-purple-700">GLOBALG.A.P.</TableCell>
                                  <TableCell className="text-right"></TableCell>
                                </TableRow>
                                <TableRow className="hover:bg-purple-50/30">
                                  <TableCell className="pl-6">Subtotal Certificaciones</TableCell>
                                  <TableCell className="text-right font-medium">
                                    {formatoMoneda(subtotalGlobalGAP)}
                                  </TableCell>
                                </TableRow>
                                <TableRow className="hover:bg-purple-50/30">
                                  <TableCell className="pl-6">Fees adicionales</TableCell>
                                  <TableCell className="text-right font-medium">
                                    {formatoMoneda(feesGlobalGAP)}
                                  </TableCell>
                                </TableRow>
                              </>
                            )}

                            <TableRow className="bg-gradient-to-r from-gray-100 to-gray-50">
                              <TableCell className="font-medium">Total sin IVA</TableCell>
                              <TableCell className="text-right font-medium">{formatoMoneda(totalSinIVA)}</TableCell>
                            </TableRow>

                            {discountPercentage > 0 && (
                              <TableRow className="bg-gradient-to-r from-amber-50 to-amber-100/30">
                                <TableCell className="font-medium text-amber-700">
                                  Descuento ({discountPercentage}%)
                                </TableCell>
                                <TableCell className="text-right font-medium text-amber-700">
                                  -{formatoMoneda(montoDescuento)}
                                </TableCell>
                              </TableRow>
                            )}

                            {incluirIVA && (
                              <TableRow>
                                <TableCell>IVA ({tasaIVA}%)</TableCell>
                                <TableCell className="text-right">{formatoMoneda(iva)}</TableCell>
                              </TableRow>
                            )}

                            <TableRow className="bg-gradient-to-r from-green-50 to-green-100/30">
                              <TableCell className="font-bold text-green-800 text-lg">Total</TableCell>
                              <TableCell className="text-right font-bold text-green-800 text-lg">
                                {formatoMoneda(total)}
                              </TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </div>

                      {esquemas.includes("primusgfs") && (
                        <div className="mt-6 bg-gradient-to-r from-blue-50 to-white p-5 rounded-xl border border-blue-200 shadow-sm">
                          <h4 className="font-semibold mb-3 text-blue-700">Desglose de Fees de Azzule:</h4>
                          <ul className="space-y-2">
                            <li className="flex items-center gap-2">
                              <CheckCircle className="h-4 w-4 text-blue-500" />${feesAzzule.registroOrganizacion} USD
                              por registrar una organización
                            </li>
                            <li className="flex items-center gap-2">
                              <CheckCircle className="h-4 w-4 text-blue-500" />${feesAzzule.registroAuditoria} USD por
                              registro de auditoría por operación
                            </li>
                            <li className="flex items-center gap-2">
                              <CheckCircle className="h-4 w-4 text-blue-500" />${feesAzzule.certificacionCampo} USD por
                              certificación de operación de campo
                            </li>
                            <li className="flex items-center gap-2">
                              <CheckCircle className="h-4 w-4 text-blue-500" />${feesAzzule.certificacionInstalacion}{" "}
                              USD por certificación de operación de instalación
                            </li>
                          </ul>
                        </div>
                      )}
                    </FancyCard>
                  </AnimatedTabsContent>
                  <AnimatedTabsContent value="pdf" activeTab={pestanaActiva}>
                    <CotizacionPDF
                      datosGenerales={datosGenerales}
                      operaciones={datosPrimusGFS.operaciones}
                      feesAzzule={feesPrimusGFS}
                      emisionCertificado={1138.33}
                      moneda={moneda}
                      tipoCambio={tipoCambio}
                      incluirIVA={incluirIVA}
                      tasaIVA={tasaIVA}
                      discountPercentage={discountPercentage}
                    />
                  </AnimatedTabsContent>
                </Tabs>
              </div>
            </CardContent>

            <CardFooter className="flex flex-col sm:flex-row justify-between gap-4 p-6 md:p-8 bg-gradient-to-r from-gray-50 to-gray-100">
              <Button
                variant="outline"
                onClick={imprimirCotizacion}
                className="w-full sm:w-auto bg-white hover:bg-gray-50 transition-colors neo-brutalism"
              >
                <Printer className="mr-2 h-4 w-4" /> Imprimir
              </Button>
              {renderBotonPrincipal()}
              {saveSuccess && (
                <div className="mt-2 text-sm text-green-600 bg-green-50 p-2 rounded-md">
                  ¡Cotización guardada con éxito!
                </div>
              )}
              {saveError && <div className="mt-2 text-sm text-red-600 bg-red-50 p-2 rounded-md">{saveError}</div>}
            </CardFooter>
          </Card>
        </div>
      </div>
      {/* Modal de documentos */}
      {showDocumentModal && generatedDocuments && (
        <DocumentModal
          isOpen={showDocumentModal}
          onClose={() => setShowDocumentModal(false)}
          documents={generatedDocuments}
          datosGenerales={datosGenerales}
          esquemas={esquemas}
          datosPrimusGFS={datosPrimusGFS}
          datosGlobalGAP={datosGlobalGAP}
        />
      )}
    </>
  )
}
