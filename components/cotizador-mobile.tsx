"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { motion, AnimatePresence } from "framer-motion"
import {
  Building,
  User,
  Mail,
  Phone,
  MapPin,
  CreditCard,
  ChevronRight,
  ChevronLeft,
  Plus,
  Trash2,
  FileText,
  CheckSquare,
  Award,
  DollarSign,
  Check,
  X,
  Settings,
} from "lucide-react"
import { tarifasPrimusGFS, tarifasGlobalGAP, feesAzzule, feesGlobalGAP as tarifasFeesGlobalGAP } from "@/lib/tarifas"

// Tipos
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

type Operacion = {
  tipo: string
  cantidad: number
  tarifa: number
  hectareas?: number
}

type DatosPrimusGFS = {
  operaciones: Operacion[]
}

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

type CotizadorMobileProps = {
  onGenerarPDF: () => void
  datosGenerales: DatosGenerales
  setDatosGenerales: (datos: DatosGenerales) => void
  datosPrimusGFS: DatosPrimusGFS
  setDatosPrimusGFS: (datos: DatosPrimusGFS) => void
  datosGlobalGAP: DatosGlobalGAP
  setDatosGlobalGAP: (datos: DatosGlobalGAP) => void
  esquemas: string[]
  setEsquemas: (esquemas: string[]) => void
  moneda: string
  setMoneda: (moneda: string) => void
  tipoCambio: number
  setTipoCambio: (tipoCambio: number) => void
  incluirIVA: boolean
  setIncluirIVA: (incluirIVA: boolean) => void
  tasaIVA: number
  setTasaIVA: (tasaIVA: number) => void
}

export function CotizadorMobile({
  onGenerarPDF,
  datosGenerales,
  setDatosGenerales,
  datosPrimusGFS,
  setDatosPrimusGFS,
  datosGlobalGAP,
  setDatosGlobalGAP,
  esquemas,
  setEsquemas,
  moneda,
  setMoneda,
  tipoCambio,
  setTipoCambio,
  incluirIVA,
  setIncluirIVA,
  tasaIVA,
  setTasaIVA,
}: CotizadorMobileProps) {
  // Definir los pasos del stepper
  const steps = [
    { id: "esquemas", label: "Esquemas", icon: <Award className="h-5 w-5" /> },
    { id: "general", label: "Empresa", icon: <Building className="h-5 w-5" /> },
    ...(esquemas.includes("primusgfs")
      ? [{ id: "primusgfs", label: "PrimusGFS", icon: <CheckSquare className="h-5 w-5" /> }]
      : []),
    ...(esquemas.includes("globalgap")
      ? [{ id: "globalgap", label: "GLOBALG.A.P.", icon: <Award className="h-5 w-5" /> }]
      : []),
    { id: "configuracion", label: "Ajustes", icon: <Settings className="h-5 w-5" /> },
    { id: "resumen", label: "Resumen", icon: <DollarSign className="h-5 w-5" /> },
  ]

  // Estado para el paso actual
  const [currentStep, setCurrentStep] = useState("esquemas")
  const [showSummary, setShowSummary] = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)
  const [isLoadingExchangeRate, setIsLoadingExchangeRate] = useState(false)

  // Actualizar los pasos cuando cambien los esquemas
  useEffect(() => {
    // Si el paso actual ya no existe en los pasos actualizados, ir al primer paso
    if (!steps.some((step) => step.id === currentStep)) {
      setCurrentStep("esquemas")
    }
  }, [esquemas])

  // Scroll al inicio cuando cambia el paso
  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTo(0, 0)
    }
  }, [currentStep])

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
      nuevasOperaciones[index] = {
        ...nuevasOperaciones[index],
        tipo: valor,
        tarifa: tarifasPrimusGFS[valor],
      }
    } else if (campo === "tarifa") {
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
    } else if (campo === "hectareas") {
      nuevosSitios[index] = {
        ...nuevosSitios[index],
        hectareas: Number.parseFloat(valor) || 1,
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
  const iva = incluirIVA ? totalSinIVA * (tasaIVA / 100) : 0
  const total = totalSinIVA + iva

  // Conversión de moneda
  const convertirMoneda = (valor: number) => {
    return moneda === "MXN" ? valor * tipoCambio : valor
  }

  // Formatear montos según la moneda
  const formatMonto = (monto: number) => {
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: moneda,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(convertirMoneda(monto))
  }

  // Función para ir al siguiente paso
  const irSiguientePaso = () => {
    const currentIndex = steps.findIndex((step) => step.id === currentStep)
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1].id)
    }
  }

  // Función para ir al paso anterior
  const irPasoAnterior = () => {
    const currentIndex = steps.findIndex((step) => step.id === currentStep)
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1].id)
    }
  }

  // Función para obtener nombre legible del tipo de operación
  const getNombreTipoOperacion = (tipo: string) => {
    const nombres: Record<string, string> = {
      granja: "Granjas",
      invernadero: "Invernaderos",
      cuadrilla_cosecha: "Cuadrillas de Cosecha",
      empaque: "Unidades de Empaque",
      cuarto_frio: "Cuartos Fríos",
      procesadora: "Procesadoras",
      centro_distribucion: "Centros de Distribución",
    }
    return nombres[tipo] || tipo
  }

  // Modificar la función generarPDF en el componente CotizadorMobile
  const generarPDF = () => {
    // En lugar de cambiar solo la pestaña activa, necesitamos navegar a la página de PDF
    window.location.href =
      "/cotizador/pdf?" +
      new URLSearchParams({
        esquemas: JSON.stringify(esquemas),
        datosGenerales: JSON.stringify(datosGenerales),
        datosPrimusGFS: JSON.stringify(datosPrimusGFS),
        datosGlobalGAP: JSON.stringify(datosGlobalGAP),
        moneda: moneda,
        tipoCambio: tipoCambio.toString(),
        incluirIVA: incluirIVA.toString(),
        tasaIVA: tasaIVA.toString(),
      }).toString()
  }

  // Renderizar el contenido según el paso actual
  const renderContenidoPaso = () => {
    switch (currentStep) {
      case "esquemas":
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-blue-700 mb-6">Seleccione los esquemas de certificación</h3>
            <div
              className={`flex items-center gap-3 p-4 rounded-xl transition-all cursor-pointer ${
                esquemas.includes("primusgfs")
                  ? "bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200"
                  : "bg-white/70 border border-gray-100"
              }`}
              onClick={() => manejarCambioEsquemas("primusgfs")}
            >
              <div
                className={`w-14 h-14 rounded-lg flex items-center justify-center ${
                  esquemas.includes("primusgfs") ? "bg-blue-600 text-white" : "bg-blue-100 text-blue-600"
                }`}
              >
                <CheckSquare className="h-7 w-7" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-lg">PrimusGFS v3.2</h4>
                <p className="text-sm text-gray-500">Estándar reconocido por GFSI</p>
              </div>
              <div className="flex items-center justify-center w-8 h-8">
                {esquemas.includes("primusgfs") ? (
                  <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                    <Check className="h-4 w-4 text-white" />
                  </div>
                ) : (
                  <div className="w-6 h-6 border-2 border-gray-300 rounded-full"></div>
                )}
              </div>
            </div>

            <div
              className={`flex items-center gap-4 p-6 rounded-xl transition-all cursor-pointer ${
                esquemas.includes("globalgap")
                  ? "bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200"
                  : "bg-white/70 border border-gray-100"
              }`}
              onClick={() => manejarCambioEsquemas("globalgap")}
            >
              <div
                className={`w-14 h-14 rounded-lg flex items-center justify-center ${
                  esquemas.includes("globalgap") ? "bg-purple-600 text-white" : "bg-purple-100 text-purple-600"
                }`}
              >
                <Award className="h-7 w-7" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-lg">GLOBALG.A.P.</h4>
                <p className="text-sm text-gray-500">Estándar global de buenas prácticas</p>
              </div>
              <div className="flex items-center justify-center w-8 h-8">
                {esquemas.includes("globalgap") ? (
                  <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center">
                    <Check className="h-4 w-4 text-white" />
                  </div>
                ) : (
                  <div className="w-6 h-6 border-2 border-gray-300 rounded-full"></div>
                )}
              </div>
            </div>
          </div>
        )

      case "general":
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-blue-700 mb-6">Información de la Empresa</h3>
            <div className="space-y-6">
              <div className="space-y-3">
                <Label htmlFor="nombreEmpresa-mobile" className="text-gray-700 flex items-center gap-2 text-base">
                  <Building className="h-5 w-5 text-blue-500" />
                  Nombre del productor o empresa
                </Label>
                <Input
                  id="nombreEmpresa-mobile"
                  value={datosGenerales.nombreEmpresa}
                  onChange={(e) => actualizarDatosGenerales("nombreEmpresa", e.target.value)}
                  className="bg-white/80 focus:bg-white transition-colors border-blue-100 focus:border-blue-300 h-12 text-base"
                />
              </div>

              <div className="space-y-3">
                <Label htmlFor="representanteLegal-mobile" className="text-gray-700 flex items-center gap-2 text-base">
                  <User className="h-5 w-5 text-blue-500" />
                  Nombre del representante legal
                </Label>
                <Input
                  id="representanteLegal-mobile"
                  value={datosGenerales.representanteLegal}
                  onChange={(e) => actualizarDatosGenerales("representanteLegal", e.target.value)}
                  className="bg-white/80 focus:bg-white transition-colors border-blue-100 focus:border-blue-300 h-12 text-base"
                />
              </div>

              <div className="space-y-3">
                <Label htmlFor="direccionFiscal-mobile" className="text-gray-700 flex items-center gap-2 text-base">
                  <MapPin className="h-5 w-5 text-blue-500" />
                  Dirección fiscal
                </Label>
                <Input
                  id="direccionFiscal-mobile"
                  value={datosGenerales.direccionFiscal}
                  onChange={(e) => actualizarDatosGenerales("direccionFiscal", e.target.value)}
                  className="bg-white/80 focus:bg-white transition-colors border-blue-100 focus:border-blue-300 h-12 text-base"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-3">
                  <Label htmlFor="pais-mobile" className="text-gray-700 text-base">
                    País
                  </Label>
                  <Input
                    id="pais-mobile"
                    value={datosGenerales.pais}
                    onChange={(e) => actualizarDatosGenerales("pais", e.target.value)}
                    className="bg-white/80 focus:bg-white transition-colors border-blue-100 focus:border-blue-300 h-12 text-base"
                  />
                </div>
                <div className="space-y-3">
                  <Label htmlFor="codigoPostal-mobile" className="text-gray-700 text-base">
                    C.P.
                  </Label>
                  <Input
                    id="codigoPostal-mobile"
                    value={datosGenerales.codigoPostal}
                    onChange={(e) => actualizarDatosGenerales("codigoPostal", e.target.value)}
                    className="bg-white/80 focus:bg-white transition-colors border-blue-100 focus:border-blue-300 h-12 text-base"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <Label htmlFor="rfc-mobile" className="text-gray-700 flex items-center gap-2 text-base">
                  <CreditCard className="h-5 w-5 text-blue-500" />
                  RFC/RUT/CIF-NIF
                </Label>
                <Input
                  id="rfc-mobile"
                  value={datosGenerales.rfc}
                  onChange={(e) => actualizarDatosGenerales("rfc", e.target.value)}
                  className="bg-white/80 focus:bg-white transition-colors border-blue-100 focus:border-blue-300 h-12 text-base"
                />
              </div>

              <div className="space-y-3">
                <Label htmlFor="correo-mobile" className="text-gray-700 flex items-center gap-2 text-base">
                  <Mail className="h-5 w-5 text-blue-500" />
                  Correo electrónico
                </Label>
                <Input
                  id="correo-mobile"
                  type="email"
                  value={datosGenerales.correo}
                  onChange={(e) => actualizarDatosGenerales("correo", e.target.value)}
                  className="bg-white/80 focus:bg-white transition-colors border-blue-100 focus:border-blue-300 h-12 text-base"
                />
              </div>

              <div className="space-y-3">
                <Label htmlFor="telefono-mobile" className="text-gray-700 flex items-center gap-2 text-base">
                  <Phone className="h-5 w-5 text-blue-500" />
                  Teléfono
                </Label>
                <Input
                  id="telefono-mobile"
                  value={datosGenerales.telefono}
                  onChange={(e) => actualizarDatosGenerales("telefono", e.target.value)}
                  className="bg-white/80 focus:bg-white transition-colors border-blue-100 focus:border-blue-300 h-12 text-base"
                />
              </div>

              <div className="space-y-3">
                <Label htmlFor="personaContacto-mobile" className="text-gray-700 flex items-center gap-2 text-base">
                  <User className="h-5 w-5 text-blue-500" />
                  Persona de contacto
                </Label>
                <Input
                  id="personaContacto-mobile"
                  value={datosGenerales.personaContacto}
                  onChange={(e) => actualizarDatosGenerales("personaContacto", e.target.value)}
                  className="bg-white/80 focus:bg-white transition-colors border-blue-100 focus:border-blue-300 h-12 text-base"
                />
              </div>
            </div>
          </div>
        )

      case "primusgfs":
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-blue-700 mb-6">Configuración PrimusGFS</h3>
            <div className="space-y-6">
              {datosPrimusGFS.operaciones.map((op, index) => (
                <div
                  key={index}
                  className="bg-gradient-to-r from-blue-50 to-white p-4 rounded-xl shadow-sm border border-blue-100"
                >
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium text-blue-700">Operación {index + 1}</h4>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => eliminarOperacionPrimusGFS(index)}
                        disabled={datosPrimusGFS.operaciones.length === 1}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1 h-auto"
                      >
                        <Trash2 className="h-5 w-5" />
                      </Button>
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor={`tipo-mobile-${index}`} className="text-gray-700 font-medium text-base">
                        Tipo de Operación
                      </Label>
                      <Select
                        value={op.tipo}
                        onValueChange={(valor) => actualizarOperacionPrimusGFS(index, "tipo", valor)}
                      >
                        <SelectTrigger id={`tipo-mobile-${index}`} className="bg-white border-blue-200 h-12 text-base">
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

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <Label htmlFor={`cantidad-mobile-${index}`} className="text-gray-700 font-medium text-base">
                          Cantidad
                        </Label>
                        <Input
                          id={`cantidad-mobile-${index}`}
                          type="number"
                          min="1"
                          value={op.cantidad}
                          onChange={(e) =>
                            actualizarOperacionPrimusGFS(index, "cantidad", Number.parseInt(e.target.value) || 1)
                          }
                          className="bg-white border-blue-200 h-12 text-base"
                        />
                      </div>

                      <div className="space-y-3">
                        <Label htmlFor={`tarifa-mobile-${index}`} className="text-gray-700 font-medium text-base">
                          Tarifa (USD)
                        </Label>
                        <Input
                          id={`tarifa-mobile-${index}`}
                          type="number"
                          min="0"
                          step="0.01"
                          value={op.tarifa}
                          onChange={(e) =>
                            actualizarOperacionPrimusGFS(index, "tarifa", Number.parseFloat(e.target.value) || 0)
                          }
                          className="bg-white border-blue-200 h-12 text-base"
                          readOnly
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              <Button
                onClick={agregarOperacionPrimusGFS}
                className="w-full bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 hover:border-blue-300 transition-all hover:shadow-md h-14 text-base font-medium"
              >
                <Plus className="mr-2 h-5 w-5" /> Agregar Operación
              </Button>
            </div>
          </div>
        )

      case "globalgap":
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-purple-700 mb-6">Configuración GLOBALG.A.P.</h3>

            <div className="space-y-6">
              <div className="bg-gradient-to-r from-purple-50 to-white p-4 rounded-xl shadow-sm border border-purple-100">
                <h4 className="font-semibold text-purple-700 mb-3 text-lg">Opción de certificación</h4>
                <RadioGroup
                  value={datosGlobalGAP.opcionCertificacion}
                  onValueChange={actualizarOpcionCertificacionGlobalGAP}
                  className="space-y-2"
                >
                  <div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-purple-50 transition-colors">
                    <RadioGroupItem
                      value="opcion1_individual"
                      id="opcion1_individual-mobile"
                      className="text-purple-600 h-5 w-5"
                    />
                    <Label htmlFor="opcion1_individual-mobile" className="cursor-pointer font-medium text-base">
                      Opción 1 - Productor Individual
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-purple-50 transition-colors">
                    <RadioGroupItem
                      value="opcion1_multisitio_sgc"
                      id="opcion1_multisitio_sgc-mobile"
                      className="text-purple-600 h-5 w-5"
                    />
                    <Label htmlFor="opcion1_multisitio_sgc-mobile" className="cursor-pointer font-medium text-base">
                      Opción 1 - Multisitio con SGC
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-purple-50 transition-colors">
                    <RadioGroupItem
                      value="opcion1_multisitio_sin_sgc"
                      id="opcion1_multisitio_sin_sgc-mobile"
                      className="text-purple-600 h-5 w-5"
                    />
                    <Label htmlFor="opcion1_multisitio_sin_sgc-mobile" className="cursor-pointer font-medium text-base">
                      Opción 1 - Multisitio sin SGC
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-purple-50 transition-colors">
                    <RadioGroupItem
                      value="opcion2_grupo"
                      id="opcion2_grupo-mobile"
                      className="text-purple-600 h-5 w-5"
                    />
                    <Label htmlFor="opcion2_grupo-mobile" className="cursor-pointer font-medium text-base">
                      Opción 2 - Grupo de Productores
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="bg-gradient-to-r from-purple-50 to-white p-5 rounded-xl shadow-sm border border-purple-100">
                <h4 className="font-semibold text-purple-700 mb-4 text-lg">Alcances</h4>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-purple-50 transition-colors">
                    <Checkbox
                      id="frutas_vegetales-mobile"
                      checked={datosGlobalGAP.alcances.includes("frutas_vegetales")}
                      onCheckedChange={() => actualizarAlcancesGlobalGAP("frutas_vegetales")}
                      className="data-[state=checked]:bg-purple-600 h-5 w-5"
                    />
                    <Label htmlFor="frutas_vegetales-mobile" className="cursor-pointer font-medium text-base">
                      IFA - Frutas y vegetales
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-purple-50 transition-colors">
                    <Checkbox
                      id="flores_ornamentales-mobile"
                      checked={datosGlobalGAP.alcances.includes("flores_ornamentales")}
                      onCheckedChange={() => actualizarAlcancesGlobalGAP("flores_ornamentales")}
                      className="data-[state=checked]:bg-purple-600 h-5 w-5"
                    />
                    <Label htmlFor="flores_ornamentales-mobile" className="cursor-pointer font-medium text-base">
                      IFA - Flores y ornamentales
                    </Label>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-purple-50 to-white p-5 rounded-xl shadow-sm border border-purple-100">
                <h4 className="font-semibold text-purple-700 mb-4 text-lg">Add-ons</h4>
                <div className="grid grid-cols-1 gap-3">
                  <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-purple-50 transition-colors">
                    <Checkbox
                      id="grasp-mobile"
                      checked={datosGlobalGAP.addons.includes("grasp")}
                      onCheckedChange={() => actualizarAddonsGlobalGAP("grasp")}
                      className="data-[state=checked]:bg-purple-600 h-5 w-5"
                    />
                    <Label htmlFor="grasp-mobile" className="cursor-pointer font-medium text-base">
                      Add-on GRASP
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-purple-50 transition-colors">
                    <Checkbox
                      id="fsma_psr-mobile"
                      checked={datosGlobalGAP.addons.includes("fsma_psr")}
                      onCheckedChange={() => actualizarAddonsGlobalGAP("fsma_psr")}
                      className="data-[state=checked]:bg-purple-600 h-5 w-5"
                    />
                    <Label htmlFor="fsma_psr-mobile" className="cursor-pointer font-medium text-base">
                      Add-on FSMA PSR
                    </Label>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold text-purple-700 text-lg">Sitios e Instalaciones</h4>
                {datosGlobalGAP.sitios.map((sitio, index) => (
                  <div
                    key={index}
                    className="bg-gradient-to-r from-purple-50 to-white p-5 rounded-xl shadow-sm border border-purple-100"
                  >
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <h4 className="font-medium text-purple-700">Sitio {index + 1}</h4>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => eliminarSitioGlobalGAP(index)}
                          disabled={datosGlobalGAP.sitios.length === 1}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1 h-auto"
                        >
                          <Trash2 className="h-5 w-5" />
                        </Button>
                      </div>

                      <div className="space-y-3">
                        <Label htmlFor={`sitio-tipo-mobile-${index}`} className="text-gray-700 font-medium text-base">
                          Tipo de Sitio
                        </Label>
                        <Select
                          value={sitio.tipo}
                          onValueChange={(valor) => actualizarSitioGlobalGAP(index, "tipo", valor)}
                        >
                          <SelectTrigger
                            id={`sitio-tipo-mobile-${index}`}
                            className="bg-white border-purple-200 h-12 text-base"
                          >
                            <SelectValue placeholder="Seleccione tipo" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="granja">Granja</SelectItem>
                            <SelectItem value="invernadero">Invernadero</SelectItem>
                            <SelectItem value="empaque">Unidad de Empaque</SelectItem>
                            <SelectItem value="cuarto_frio">Cuarto Frío</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-3">
                          <Label
                            htmlFor={`sitio-cantidad-mobile-${index}`}
                            className="text-gray-700 font-medium text-base"
                          >
                            Cantidad
                          </Label>
                          <Input
                            id={`sitio-cantidad-mobile-${index}`}
                            type="number"
                            min="1"
                            value={sitio.cantidad}
                            onChange={(e) =>
                              actualizarSitioGlobalGAP(index, "cantidad", Number.parseInt(e.target.value) || 1)
                            }
                            className="bg-white border-purple-200 h-12 text-base"
                          />
                        </div>

                        <div className="space-y-3">
                          <Label
                            htmlFor={`sitio-hectareas-mobile-${index}`}
                            className="text-gray-700 font-medium text-base"
                          >
                            Hectáreas
                          </Label>
                          <Input
                            id={`sitio-hectareas-mobile-${index}`}
                            type="number"
                            min="0.1"
                            step="0.1"
                            value={sitio.hectareas}
                            onChange={(e) =>
                              actualizarSitioGlobalGAP(index, "hectareas", Number.parseFloat(e.target.value) || 1)
                            }
                            className="bg-white border-purple-200 h-12 text-base"
                          />
                        </div>

                        <div className="space-y-3">
                          <Label
                            htmlFor={`sitio-tarifa-mobile-${index}`}
                            className="text-gray-700 font-medium text-base"
                          >
                            Tarifa (USD)
                          </Label>
                          <Input
                            id={`sitio-tarifa-mobile-${index}`}
                            type="number"
                            min="0"
                            step="0.01"
                            value={sitio.tarifa}
                            className="bg-white border-purple-200 h-12 text-base"
                            readOnly
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                <Button
                  onClick={agregarSitioGlobalGAP}
                  className="w-full bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 hover:border-purple-300 transition-all hover:shadow-md h-14 text-base font-medium"
                >
                  <Plus className="mr-2 h-5 w-5" /> Agregar Sitio
                </Button>
              </div>
            </div>
          </div>
        )

      case "configuracion":
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-gray-700 mb-6">Configuración de Cotización</h3>
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-gray-50 to-white p-5 rounded-xl shadow-sm border border-gray-200">
                <Label htmlFor="moneda-mobile" className="text-gray-700 block mb-3 font-medium text-base">
                  Moneda
                </Label>
                <Select value={moneda} onValueChange={setMoneda}>
                  <SelectTrigger id="moneda-mobile" className="bg-white border-gray-200 h-12 text-base">
                    <SelectValue placeholder="Seleccione moneda" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">USD - Dólar Americano</SelectItem>
                    <SelectItem value="MXN">MXN - Peso Mexicano</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {moneda === "MXN" && (
                <div className="bg-gradient-to-r from-gray-50 to-white p-5 rounded-xl shadow-sm border border-gray-200">
                  <Label htmlFor="tipo-cambio-mobile" className="text-gray-700 block mb-3 font-medium text-base">
                    Tipo de Cambio (USD a MXN)
                  </Label>
                  <div className="relative">
                    <Input
                      id="tipo-cambio-mobile"
                      type="number"
                      min="1"
                      step="0.01"
                      value={tipoCambio}
                      onChange={(e) => setTipoCambio(Number.parseFloat(e.target.value) || 17.5)}
                      className="bg-white border-gray-200 h-12 text-base"
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

              <div className="bg-gradient-to-r from-gray-50 to-white p-5 rounded-xl shadow-sm border border-gray-200 flex items-center space-x-3">
                <Checkbox
                  id="incluir-iva-mobile"
                  checked={incluirIVA}
                  onCheckedChange={(checked) => setIncluirIVA(checked as boolean)}
                  className="data-[state=checked]:bg-green-600 h-5 w-5"
                />
                <Label htmlFor="incluir-iva-mobile" className="cursor-pointer font-medium text-base">
                  Incluir IVA
                </Label>
              </div>

              {incluirIVA && (
                <div className="bg-gradient-to-r from-gray-50 to-white p-5 rounded-xl shadow-sm border border-gray-200">
                  <Label htmlFor="tasa-iva-mobile" className="text-gray-700 block mb-3 font-medium text-base">
                    Tasa de IVA (%)
                  </Label>
                  <Input
                    id="tasa-iva-mobile"
                    type="number"
                    min="0"
                    max="100"
                    value={tasaIVA}
                    onChange={(e) => setTasaIVA(Number.parseFloat(e.target.value) || 16)}
                    className="bg-white border-gray-200 h-12 text-base"
                  />
                </div>
              )}
            </div>
          </div>
        )

      case "resumen":
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-green-700 mb-6">Resumen de Cotización</h3>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-4 bg-green-50 border-b border-gray-200">
                <h4 className="font-semibold text-green-800 text-lg">Detalles de la Cotización</h4>
              </div>
              <div className="p-4 space-y-4">
                {esquemas.includes("primusgfs") && (
                  <>
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="font-medium text-blue-700 text-base">PrimusGFS v3.2</span>
                      <span></span>
                    </div>
                    <div className="flex justify-between items-center py-2 pl-4">
                      <span className="text-gray-600">Subtotal Certificaciones</span>
                      <span className="font-medium">{formatMonto(subtotalPrimusGFS)}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 pl-4">
                      <span className="text-gray-600">Fees de Azzule</span>
                      <span className="font-medium">{formatMonto(feesPrimusGFS)}</span>
                    </div>
                  </>
                )}

                {esquemas.includes("globalgap") && (
                  <>
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="font-medium text-purple-700 text-base">GLOBALG.A.P.</span>
                      <span></span>
                    </div>
                    <div className="flex justify-between items-center py-2 pl-4">
                      <span className="text-gray-600">Subtotal Certificaciones</span>
                      <span className="font-medium">{formatMonto(subtotalGlobalGAP)}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 pl-4">
                      <span className="text-gray-600">Fees adicionales</span>
                      <span className="font-medium">{formatMonto(feesGlobalGAP)}</span>
                    </div>
                  </>
                )}

                <div className="flex justify-between items-center py-2 border-t border-gray-200">
                  <span className="font-medium text-base">Total sin IVA</span>
                  <span className="font-medium">{formatMonto(totalSinIVA)}</span>
                </div>

                {incluirIVA && (
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-600">IVA ({tasaIVA}%)</span>
                    <span>{formatMonto(iva)}</span>
                  </div>
                )}

                <div className="flex justify-between items-center py-3 border-t border-gray-200 text-lg">
                  <span className="font-bold text-green-800">Total</span>
                  <span className="font-bold text-green-800">{formatMonto(total)}</span>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <Button
                onClick={generarPDF}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-4 rounded-lg shadow-md transition-colors text-lg font-medium"
              >
                <FileText className="mr-2 h-6 w-6" /> Generar PDF
              </Button>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  // Renderizar el indicador de progreso
  const renderProgressIndicator = () => {
    const currentIndex = steps.findIndex((step) => step.id === currentStep)
    const progress = ((currentIndex + 1) / steps.length) * 100

    return (
      <div className="w-full bg-gray-200 rounded-full h-2">
        <motion.div
          className="bg-blue-600 h-2 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>
    )
  }

  // Renderizar el encabezado del paso actual
  const renderStepHeader = () => {
    const currentIndex = steps.findIndex((step) => step.id === currentStep)

    return (
      <div className="flex items-center justify-between py-4">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center">
            {steps[currentIndex].icon}
          </div>
          <div className="ml-3">
            <div className="font-medium text-blue-600">{`Paso ${currentIndex + 1} de ${steps.length}`}</div>
            <div className="text-sm text-gray-500">{steps[currentIndex].label}</div>
          </div>
        </div>
        <div>
          {showSummary && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowSummary(false)}
              className="flex items-center gap-1"
            >
              <X className="h-4 w-4" /> Cerrar
            </Button>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen bg-gray-50 pt-16">
      {/* Barra de progreso fija en la parte superior */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm mt-10">
        {renderProgressIndicator()}
        <div className="container px-2 mx-auto">{renderStepHeader()}</div>
      </div>

      {/* Contenido principal con padding para evitar que se oculte bajo la barra de progreso */}
      <div className="pt-20 pb-24 px-2" ref={contentRef}>
        <div className="bg-white rounded-lg shadow-sm p-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              {renderContenidoPaso()}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Panel de resumen flotante */}
      <AnimatePresence>
        {showSummary && (
          <motion.div
            initial={{ opacity: 0, y: 300 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 300 }}
            className="fixed inset-0 bg-black/50 z-40 flex items-end"
            onClick={() => setShowSummary(false)}
          >
            <motion.div
              className="bg-white w-full rounded-t-xl p-4 max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-bold">Resumen de cotización</h3>
                <Button variant="ghost" size="sm" onClick={() => setShowSummary(false)}>
                  <X className="h-5 w-5" />
                </Button>
              </div>

              <div className="space-y-3">
                {esquemas.includes("primusgfs") && (
                  <>
                    <div className="flex justify-between items-center py-1">
                      <span className="font-medium text-blue-700">PrimusGFS</span>
                      <span className="font-medium">{formatMonto(subtotalPrimusGFS + feesPrimusGFS)}</span>
                    </div>
                  </>
                )}

                {esquemas.includes("globalgap") && (
                  <>
                    <div className="flex justify-between items-center py-1">
                      <span className="font-medium text-purple-700">GLOBALG.A.P.</span>
                      <span className="font-medium">{formatMonto(subtotalGlobalGAP + feesGlobalGAP)}</span>
                    </div>
                  </>
                )}

                {incluirIVA && (
                  <div className="flex justify-between items-center py-1">
                    <span className="text-gray-600">IVA ({tasaIVA}%)</span>
                    <span>{formatMonto(iva)}</span>
                  </div>
                )}

                <div className="flex justify-between items-center py-2 border-t border-gray-200">
                  <span className="font-bold text-lg">Total</span>
                  <span className="font-bold text-lg">{formatMonto(total)}</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Barra de navegación fija en la parte inferior */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-3 z-40">
        <div className="flex justify-between items-center">
          <Button
            variant="outline"
            onClick={irPasoAnterior}
            disabled={currentStep === "esquemas"}
            className="h-12 px-3"
          >
            <ChevronLeft className="mr-1 h-5 w-5" /> Anterior
          </Button>

          <Button
            variant="outline"
            onClick={() => setShowSummary(!showSummary)}
            className="h-12 px-3 border-blue-200 text-blue-700"
          >
            <DollarSign className="mr-1 h-5 w-5" /> {formatMonto(total)}
          </Button>

          {currentStep === "resumen" ? (
            <Button onClick={generarPDF} className="bg-green-600 hover:bg-green-700 text-white h-12 px-3">
              <FileText className="mr-1 h-5 w-5" /> PDF
            </Button>
          ) : (
            <Button onClick={irSiguientePaso} className="bg-blue-600 hover:bg-blue-700 text-white h-12 px-3">
              Siguiente <ChevronRight className="ml-1 h-5 w-5" />
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
