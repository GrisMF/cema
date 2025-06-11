"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Printer, Download, ArrowLeft } from "lucide-react"
import { jsPDF } from "jspdf"
import html2canvas from "html2canvas"

type Operacion = {
  tipo: string
  cantidad: number
  tarifa: number
  hectareas?: number
}

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

type DatosGlobalGAP = {
  opcionCertificacion: string
  alcances: string[]
  addons: string[]
  sitios: Operacion[]
}

type CotizacionPDFProps = {
  datosGenerales: DatosGenerales
  operaciones: Operacion[]
  feesAzzule: number
  emisionCertificado: number
  moneda: string
  tipoCambio: number
  incluirIVA: boolean
  tasaIVA: number
  esquemas?: string[]
  datosGlobalGAP?: DatosGlobalGAP
  feesGlobalGAP?: number
  discountPercentage?: number
  onBack?: () => void
}

export function CotizacionPDF({
  datosGenerales,
  operaciones,
  feesAzzule: initialFeesAzzule,
  emisionCertificado: initialEmisionCertificado,
  moneda,
  tipoCambio,
  incluirIVA,
  tasaIVA,
  esquemas = ["primusgfs"],
  datosGlobalGAP,
  feesGlobalGAP = 0,
  discountPercentage = 0,
  onBack,
}: CotizacionPDFProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [cotizacionNumber, setCotizacionNumber] = useState("")
  const pdfContentRef = useRef<HTMLDivElement>(null)
  const [currentDate, setCurrentDate] = useState<string>("")

  // Detectar si es dispositivo móvil
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  // Generar número de cotización y fecha actual
  useEffect(() => {
    const randomNumber = Math.floor(Math.random() * 10000)
      .toString()
      .padStart(4, "0")
    setCotizacionNumber(`CEMAPGFS${new Date().getFullYear().toString().substring(2)}${randomNumber}`)

    // Formatear la fecha actual en formato DD/MMM/YYYY
    const now = new Date()
    const day = now.getDate().toString().padStart(2, "0")
    const monthNames = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"]
    const month = monthNames[now.getMonth()]
    const year = now.getFullYear()
    setCurrentDate(`${day}/${month}/${year}`)
  }, [])

  // Función para obtener el nombre legible del tipo de operación
  const getNombreTipoOperacion = (tipo: string) => {
    const nombres: Record<string, string> = {
      granja: "Granja",
      invernadero: "Invernadero",
      cuadrilla_cosecha: "Cuadrilla",
      empaque: "Empaque",
      cuarto_frio: "Cuarto Frío",
      procesadora: "Procesadora",
      centro_distribucion: "Centro de Distribución",
    }
    return nombres[tipo] || tipo
  }

  // Cálculos para PrimusGFS
  const subtotalPrimusGFS = esquemas.includes("primusgfs")
    ? operaciones.reduce((total, op) => total + op.tarifa * op.cantidad, 0)
    : 0

  // Cálculos para GLOBALG.A.P.
  const subtotalGlobalGAP =
    esquemas.includes("globalgap") && datosGlobalGAP
      ? datosGlobalGAP.sitios.reduce(
          (total, sitio) => total + sitio.tarifa * sitio.cantidad * (sitio.hectareas || 1),
          0,
        ) +
        datosGlobalGAP.addons.length * 200 // Valor ejemplo para addons
      : 0

  const subtotalGeneral = subtotalPrimusGFS + subtotalGlobalGAP

  // Calcular Fees Azzule
  const calcularFeesAzzule = () => {
    if (!esquemas.includes("primusgfs")) return 0

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
    if (!esquemas.includes("primusgfs")) return 0

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

  const feesAzzule = calcularFeesAzzule()
  const emisionCertificadoCalculado = calcularEmisionCertificado()

  const feesTotal = feesAzzule + feesGlobalGAP
  const totalSinIVA = subtotalGeneral + feesTotal + emisionCertificadoCalculado

  // Aplicar descuento si hay un código de descuento válido
  const montoDescuento = discountPercentage > 0 ? totalSinIVA * (discountPercentage / 100) : 0
  const totalConDescuento = totalSinIVA - montoDescuento

  const iva = incluirIVA ? totalConDescuento * (tasaIVA / 100) : 0
  const total = totalConDescuento + iva

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

  // Función avanzada para generar el PDF por secciones
  const generarPDF = async () => {
    setIsGenerating(true)
    try {
      // Crear un nuevo documento PDF con tamaño carta
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "letter", // Cambiar a tamaño carta
        compress: true,
      })

      // Cargar fuente personalizada (Arial)
      pdf.setFont("helvetica", "normal")

      // Obtener dimensiones de la página
      const pageWidth = pdf.internal.pageSize.getWidth()
      const pageHeight = pdf.internal.pageSize.getHeight()
      const margin = 0 // Sin márgenes

      // Función para renderizar secciones individuales
      const renderSection = async (sectionId) => {
        const section = document.getElementById(sectionId)
        if (!section) return null

        // Special handling for cover page to ensure exact dimensions
        if (sectionId === "pdf-cover") {
          const canvas = await html2canvas(section, {
            scale: 2,
            logging: false,
            useCORS: true,
            allowTaint: true,
            backgroundColor: "#ffffff",
            width: 816, // 216mm in pixels at 96 DPI
            height: 1056, // 279mm in pixels at 96 DPI
          })

          return {
            dataUrl: canvas.toDataURL("image/png"),
            width: canvas.width,
            height: canvas.height,
          }
        }

        // Normal handling for other pages
        const canvas = await html2canvas(section, {
          scale: 2,
          logging: false,
          useCORS: true,
          allowTaint: true,
          backgroundColor: "#ffffff",
        })

        return {
          dataUrl: canvas.toDataURL("image/png"),
          width: canvas.width,
          height: canvas.height,
        }
      }

      // Obtener todas las secciones
      const sections = [
        await renderSection("pdf-cover"),
        await renderSection("pdf-page-1"),
        await renderSection("pdf-page-2"),
        await renderSection("pdf-page-3"),
        await renderSection("pdf-page-4"),
        await renderSection("pdf-page-5"),
        await renderSection("pdf-page-6"),
        await renderSection("pdf-page-7"),
        await renderSection("pdf-page-8"),
      ].filter(Boolean)

      // Variables para controlar la posición
      let pageNumber = 1

      // Añadir cada sección al PDF (una sección por página)
      for (let i = 0; i < sections.length; i++) {
        const section = sections[i]

        // Si no es la primera página, añadir una nueva
        if (i > 0) {
          pdf.addPage()
        }

        const imgWidth = pageWidth - margin * 2
        const imgHeight = (section.height * imgWidth) / section.width

        // Añadir la sección centrada en la página
        pdf.addImage(section.dataUrl, "PNG", margin, margin, imgWidth, imgHeight)

        // Añadir número de página en el pie de página (excepto en la portada)
        if (i > 0) {
          pdf.setFontSize(8)
          pdf.setTextColor(0, 83, 155) // Color azul corporativo CEMA
          pdf.text(`www.cemacertificacion.com`, pageWidth / 2, pageHeight - 5, { align: "center" })
        }

        pageNumber++
      }

      // Guardar el PDF
      pdf.save(`Cotizacion_${datosGenerales.nombreEmpresa || "CEMA"}.pdf`)
    } catch (error) {
      console.error("Error al generar PDF:", error)
      alert("Hubo un error al generar el PDF. Por favor, inténtelo de nuevo.")
    } finally {
      setIsGenerating(false)
    }
  }

  // Función para imprimir
  const imprimir = () => {
    window.print()
  }

  // Crear descripción de servicios para la primera página
  const crearDescripcionServicios = () => {
    let descripcion = "Certificación PRIMUS GFS v3.2 ("

    // Agrupar operaciones por tipo
    const operacionesPorTipo = operaciones.reduce((acc, op) => {
      if (!acc[op.tipo]) {
        acc[op.tipo] = { cantidad: 0, tarifa: op.tarifa }
      }
      acc[op.tipo].cantidad += op.cantidad
      return acc
    }, {})

    // Crear texto descriptivo
    const partes = []
    for (const tipo in operacionesPorTipo) {
      const { cantidad, tarifa } = operacionesPorTipo[tipo]
      partes.push(`${cantidad} ${getNombreTipoOperacion(tipo)}${cantidad > 1 ? "s" : ""} ${formatoMoneda(tarifa)} c/u`)
    }

    descripcion += partes.join(" + ") + ")"
    return descripcion
  }

  return (
    <div className="relative">
      {/* Botones de acción */}
      <div className="flex justify-between mb-4 md:mb-6 print:hidden mt-2 md:mt-4">
        {onBack && (
          <Button variant="outline" onClick={onBack} className="flex items-center gap-1 md:gap-2 text-sm md:text-base">
            <ArrowLeft className="h-3 w-3 md:h-4 md:w-4" /> Volver
          </Button>
        )}
        <div className="flex gap-1 md:gap-2 ml-auto">
          <Button
            variant="outline"
            onClick={imprimir}
            className="flex items-center gap-1 md:gap-2 text-sm md:text-base"
          >
            <Printer className="h-3 w-3 md:h-4 md:w-4" /> Imprimir
          </Button>
          <Button
            onClick={generarPDF}
            disabled={isGenerating}
            className="bg-[#00539B] hover:bg-[#003b6f] text-white flex items-center gap-1 md:gap-2 text-sm md:text-base"
          >
            {isGenerating ? (
              <>
                <div className="animate-spin rounded-full h-3 w-3 md:h-4 md:w-4 border-t-2 border-b-2 border-white"></div>
                Generando...
              </>
            ) : (
              <>
                <Download className="h-3 w-3 md:h-4 md:w-4" /> Descargar PDF
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Contenido del PDF */}
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 mx-auto pdf-container max-w-4xl">
        {/* Portada - Nueva página con la imagen de fresas */}
        <div
          id="pdf-cover"
          className="relative w-full overflow-hidden p-0 m-0"
          style={{
            width: "216mm",
            height: "279mm",
            display: "flex",
            flexDirection: "column",
            maxHeight: "279mm",
            boxSizing: "border-box",
          }}
        >
          {/* Contenedor de la imagen que ocupa 3/4 de la altura */}
          <div className="relative w-full" style={{ height: "75%", overflow: "hidden" }}>
            <img
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/CEMAimg.png-qHUmnOxF6V90bl54yjNdSaFT3GS67n.jpeg"
              alt="Fresas frescas"
              className="w-full h-full object-cover"
              style={{ display: "block" }}
            />

            {/* Logo en la esquina superior izquierda de la página */}
            <div className="absolute top-4 left-4 z-20">
              <img
                src="/images/cema-logo.png"
                alt="CEMA - Organismo de Certificación"
                style={{ width: "6.56cm", height: "2.96cm", objectFit: "contain" }}
              />
            </div>
          </div>

          {/* Barra verde que ocupa 1/4 de la página */}
          <div
            style={{
              backgroundColor: "#78B832",
              height: "25%",
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: 0,
              padding: 0,
              flexGrow: 1,
            }}
          >
            <h1 className="text-4xl font-bold text-white">PROPUESTA DE CERTIFICACIÓN</h1>
          </div>
        </div>

        {/* Página 1 - Tabla de servicios y datos del cliente */}
        <div
          id="pdf-page-1"
          className="p-0 pdf-section"
          style={{
            fontFamily: "Arial, sans-serif",
            width: "21.59cm",
            height: "27.94cm",
            margin: "0 auto",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Banner de uvas */}
          <div className="relative overflow-hidden" style={{ width: "21.59cm", height: "4.38cm" }}>
            <img
              src="/images/grape-banner.png"
              alt="Uvas"
              className="w-full h-full object-cover"
              style={{ objectPosition: "center" }}
            />
          </div>

          {/* Datos generales header */}
          <div className="flex justify-between items-center px-4 py-2 mb-4 mt-4">
            <div className="text-[#0078D7] font-bold">DATOS GENERALES</div>
            <div className="text-[#0078D7] font-bold">{currentDate}</div>
          </div>

          {/* Datos generales table */}
          <div
            className="px-2 py-1"
            style={{
              maxWidth: "21.59cm",
              margin: "0 auto",
              position: "relative",
              minHeight: "calc(27.94cm - 4.38cm)",
              fontFamily: "Arial, sans-serif",
            }}
          >
            <table
              className="w-full border-collapse mb-2"
              style={{ width: "100%", borderSpacing: "0 1px", borderCollapse: "separate" }}
            >
              <tbody>
                <tr style={{ marginBottom: "1px" }}>
                  <td className="bg-[#78B832] text-white font-bold p-1 w-28" style={{ border: "0.5px solid white" }}>
                    RAZÓN SOCIAL:
                  </td>
                  <td className="bg-[#D9D9D9] text-[#0070C0] p-1" style={{ border: "0.5px solid white" }}>
                    {datosGenerales.nombreEmpresa}
                  </td>
                </tr>
                <tr style={{ marginBottom: "1px" }}>
                  <td className="bg-[#78B832] text-white font-bold p-1" style={{ border: "0.5px solid white" }}>
                    DIRECCIÓN:
                  </td>
                  <td className="bg-[#D9D9D9] text-[#0070C0] p-1" style={{ border: "0.5px solid white" }}>
                    {datosGenerales.direccionFiscal}
                  </td>
                </tr>
                <tr style={{ marginBottom: "1px" }}>
                  <td className="bg-[#78B832] text-white font-bold p-1" style={{ border: "0.5px solid white" }}>
                    RFC/NIT/RUT/CIF:
                  </td>
                  <td className="bg-[#D9D9D9] text-[#0070C0] p-1" style={{ border: "0.5px solid white" }}>
                    {datosGenerales.rfc}
                  </td>
                </tr>
                <tr style={{ marginBottom: "1px" }}>
                  <td className="bg-[#78B832] text-white font-bold p-1" style={{ border: "0.5px solid white" }}>
                    TELÉFONO:
                  </td>
                  <td className="bg-[#D9D9D9] text-[#0070C0] p-1" style={{ border: "0.5px solid white" }}>
                    {datosGenerales.telefono}
                  </td>
                </tr>
                <tr style={{ marginBottom: "1px" }}>
                  <td className="bg-[#78B832] text-white font-bold p-1" style={{ border: "0.5px solid white" }}>
                    CONTACTO:
                  </td>
                  <td className="bg-[#D9D9D9] text-[#0070C0] p-1" style={{ border: "0.5px solid white" }}>
                    {datosGenerales.personaContacto}
                  </td>
                </tr>
                <tr style={{ marginBottom: "1px" }}>
                  <td className="bg-[#78B832] text-white font-bold p-1" style={{ border: "0.5px solid white" }}>
                    EMAIL:
                  </td>
                  <td className="bg-[#D9D9D9] text-[#0070C0] p-1" style={{ border: "0.5px solid white" }}>
                    {datosGenerales.correo}
                  </td>
                </tr>
              </tbody>
            </table>

            {/* Tabla de servicios */}
            <table className="w-full border-collapse mb-2" style={{ width: "100%" }}>
              <thead>
                <tr>
                  <th className="bg-[#78B832] text-white font-bold p-1 text-left w-12">ITEM</th>
                  <th className="bg-[#78B832] text-white font-bold p-1 text-left">SERVICIO</th>
                  <th className="bg-[#78B832] text-white font-bold p-1 text-right w-32">MONTO</th>
                </tr>
              </thead>
              <tbody>
                <tr className="bg-white">
                  <td className="border border-gray-300 p-1 text-[#0078D7] align-top">01</td>
                  <td className="border border-gray-300 p-1 text-[#0078D7] align-top">{crearDescripcionServicios()}</td>
                  <td className="border border-gray-300 p-1 text-right align-top">
                    {formatoMoneda(subtotalPrimusGFS)}
                  </td>
                </tr>
                <tr className="bg-[#F0F7FF]">
                  <td className="border border-gray-300 p-1 text-[#0078D7] align-top">02</td>
                  <td className="border border-gray-300 p-1 text-[#0078D7] align-top">Fees del programa</td>
                  <td className="border border-gray-300 p-1 text-right align-top">{formatoMoneda(feesAzzule)}</td>
                </tr>
                <tr className="bg-white">
                  <td className="border border-gray-300 p-1 text-[#0078D7] align-top">03</td>
                  <td className="border border-gray-300 p-1 text-[#0078D7] align-top">Emisión del certificado</td>
                  <td className="border border-gray-300 p-1 text-right align-top">
                    {formatoMoneda(emisionCertificadoCalculado)}
                  </td>
                </tr>
                <tr className="bg-[#F0F7FF]">
                  <td className="border border-gray-300 p-1 text-[#0078D7] align-top">04</td>
                  <td className="border border-gray-300 p-1 text-right font-bold align-top">Total</td>
                  <td className="border border-gray-300 p-1 text-right align-top bg-white">
                    {formatoMoneda(totalSinIVA)}
                    <div className="font-normal text-xs">+ IVA</div>
                  </td>
                </tr>
              </tbody>
            </table>

            {/* Tabla de tiempo asignado y firma - EXACTAMENTE COMO EN LA IMAGEN */}
            <div className="flex mb-2">
              <div className="w-full flex">
                <div className="w-1/2">
                  <div className="bg-[#78B832] text-white p-2 text-center">
                    <div className="font-medium text-sm">Tiempo asignado a la auditoría en días</div>
                  </div>
                  <div className="bg-[#F1F8E9] h-10 border-b border-white"></div>
                  <div className="bg-[#F1F8E9] h-24"></div>
                </div>
                <div className="w-1/2">
                  <div className="bg-[#F1F8E9] h-20"></div>
                  <div className="bg-[#F1F8E9] h-20"></div>
                  <div className="bg-[#78B832] text-white p-1 text-center">
                    <div className="font-medium text-xs">NOMBRE, SELLO, FIRMA Y FECHA DE ACEPTACIÓN</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Nota */}
            <div className="text-xs text-red-600 italic mb-3">
              Nota: Por favor, únicamente necesitamos esta página firmada, y escaneada, no es necesario imprimir o
              escanear las demás.
            </div>

            {/* Footer */}
            <div
              className="flex justify-between items-center text-xs bg-[#0078D7] text-white p-1"
              style={{
                width: "21cm", // Reducido de 21.59cm a 21cm
                margin: 0,
                position: "absolute",
                bottom: 0,
                left: "-2px", // Movido ligeramente a la izquierda
              }}
            >
              <div className="font-bold">CEMA International Compliance Services S.A. de C.V.</div>
              <div>www.cemacertificacion.com</div>
            </div>
          </div>
        </div>

        {/* Página 2 - Beneficios de la certificación */}
        <div id="pdf-page-2" className="p-6 pdf-section" style={{ fontFamily: "Arial, sans-serif" }}>
          <div className="relative overflow-hidden mb-6" style={{ width: "21.59cm", height: "4.38cm" }}>
            <img
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-phXxh2VDk9L4NlMO3Eduh9O1vCku9u.png"
              alt="Bloques de madera"
              className="w-full h-full object-cover"
              style={{ objectPosition: "center" }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#00539B]/70 to-[#00539B]/30 flex items-center justify-center"></div>
          </div>

          <h2 className="text-2xl font-bold mb-6 text-center text-[#00539B]">BENEFICIOS DE LA CERTIFICACIÓN</h2>

          <h2 className="text-xl font-bold mb-6 text-[#00539B]">
            La certificación provee numerosos beneficios a nuestros clientes:
          </h2>

          <ul className="list-disc pl-6 space-y-4">
            <li>
              <span className="font-bold">Mayor confianza de clientes y consumidores:</span> Obteniendo la certificación
              demostrará a los clientes, consumidores y proveedores su compromiso para una producción alimentaria segura
              y sostenible, mejora continua, Calidad en los servicios o productos que ofrece. El programa es demandado
              por distribuidores de todo el mundo, pudiéndole ayudar a introducir su producto o servicio en nuevos
              mercados.
            </li>
            <li>
              <span className="font-bold">Garantía del servicio:</span> Como organismo de certificación, CEMA
              International Compliance Services le ofrece más que un certificado. Contamos con el conocimiento,
              experiencia y presencia local y global para apoyarle y guiarle a lo largo de todo el proceso de
              certificación, ayudándole a cumplir con los retos y maximizar los beneficios de la certificación.
            </li>
            <li>
              <span className="font-bold">Reconocimiento Global:</span> Nuestros certificados son aceptados y
              reconocidos en todo el mundo. La certificación puede ayudar a los productores de alimentos, productos o
              servicios a vender sus productos o servicios en todo el mundo. Les permite llegar a clientes, mercados,
              proveedores y minoristas de todo el mundo que requieren la certificación.
            </li>
            <li>
              <span className="font-bold">Asegura el cumplimiento normativo:</span> La norma lleva a la reducción de la
              exposición a los riesgos de reputación ya que también en el proceso se evalúan requisitos de normas
              locales asociadas al estándar de certificación.
            </li>
            <li>
              <span className="font-bold">Reducción de costos y estandarización de procesos:</span> El estándar también
              mejora el rendimiento empresarial a largo plazo gracias a la eficiencia y optimización de procesos por
              medio de un sistema de gestión.
            </li>
          </ul>

          <div className="text-center mt-12 text-sm text-[#00539B] font-medium">www.cemacertificacion.com</div>

          <div className="text-center font-bold mt-2">CEMA International Compliance Services S.A. de C.V.</div>
        </div>

        {/* Página 3 - Términos y condiciones */}
        <div id="pdf-page-3" className="p-6 pdf-section" style={{ fontFamily: "Arial, sans-serif" }}>
          {/* Reemplazar el div del logo con este banner */}
          <div className="relative overflow-hidden mb-6" style={{ width: "21.59cm", height: "4.38cm" }}>
            <img
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-75viyZr2uoDBirnhyAe8obE0iDbjdR.png"
              alt="Mazorca de maíz"
              className="w-full h-full object-cover"
              style={{ objectPosition: "center" }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#00539B]/70 to-[#00539B]/30 flex items-center justify-center"></div>
          </div>

          <h2 className="text-2xl font-bold mb-6 text-center text-[#00539B]">TÉRMINOS Y CONDICIONES</h2>

          <ul className="list-disc pl-6 space-y-4">
            <li>
              La cotización del presente servicio incluye la auditoría anunciada en sitio, las auditorías de vigilancia
              o no anunciadas serán cobradas en un 100% del monto aquí presentado.
            </li>
            <li>
              La realización del pago es del 100% a la orden del servicio en caso de no recibir el pago 2 días antes de
              sus auditoria, CEMA INTERNATIONAL COMPLIANCE SERVICES, se reserva el derecho de programarla nuevamente.
            </li>
            <li>
              Cualquier cancelación o reprogramación de auditorías por parte del cliente, dentro de las 48 horas previas
              a la fecha programada ya confirmada tendrá una cuota de US$250.00 más TAX.
            </li>
            <li>Al 3er. cambio de fecha en su auditoria se realizará un cargo de US$250.00 más TAX.</li>
            <li>
              Para cancelaciones o reprogramaciones en sitio, el costo total de la auditoria deberá ser cubierto al
              100%.
            </li>
            <li>
              En caso de reprogramaciones o cancelaciones deberá ser cubierto el 100% de los gastos incurridos por el
              auditor y Organismo de Certificación.
            </li>
            <li>
              Esta cotización está sujeta a cambios de acuerdo con lo que determine el auditor al momento de realizar la
              auditoria en sitio.
            </li>
            <li>
              Los viáticos del auditor no están incluidos en esta cotización y serán cobrados al costo. En caso de estar
              incluidos, favor de considerar que los viáticos son un costo aproximado y que pueden variar en caso de
              existir diferencial, deberán ser cubiertos aproximado y que pueden variar en caso de existir diferencial,
              deberán ser cubiertos en su totalidad.
            </li>
            <li>En caso de no obtener la certificación, las cuotas de certificación no son reembolsables.</li>
            <li>
              Únicamente se podrá emitir su factura durante el mes en el que realizó su pago, así como cualquier cambio
              y/o modificación de esta.
            </li>
            <li>
              Esta cotización tiene vigencia de 30 días, pasados estos, deberá solicitar una nueva cotización del
              servicio.
            </li>
          </ul>

          <div className="text-center mt-12 text-sm text-[#00539B] font-medium">www.cemacertificacion.com</div>

          <div className="text-center font-bold mt-2">CEMA International Compliance Services S.A. de C.V.</div>
        </div>

        {/* Página 4 - Datos de pago MXN */}
        <div id="pdf-page-4" className="p-6 pdf-section" style={{ fontFamily: "Arial, sans-serif" }}>
          <div className="relative overflow-hidden mb-6" style={{ width: "21.59cm", height: "4.38cm" }}>
            <img
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-YJRa9WNra5MJiOOLbUV4lnaY9dWgpp.png"
              alt="Tarjeta de pago"
              className="w-full h-full object-cover"
              style={{ objectPosition: "center" }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#00539B]/70 to-[#00539B]/30 flex items-center justify-center"></div>
          </div>

          <h2 className="text-xl font-bold mb-6 text-center text-[#00539B]">DATOS DE PAGOS DE SERVICIOS</h2>

          <div className="bg-gray-100 p-6 rounded-lg mb-8">
            <div className="space-y-3">
              <div className="flex">
                <div className="font-bold w-64">Nombre del titular de la cuenta:</div>
                <div>CEMA INTERNATIONAL COMPLIANCE SERVICES SA DE CV</div>
              </div>
              <div className="flex">
                <div className="font-bold w-64">Número de cuenta CLABE:</div>
                <div>002320701910980970</div>
              </div>
              <div className="flex">
                <div className="font-bold w-64">Cuenta de Cheques Moneda Nacional:</div>
                <div>8208040387</div>
              </div>
              <div className="flex">
                <div className="font-bold w-64">Banco:</div>
                <div>Citibanamex</div>
              </div>
              <div className="flex">
                <div className="font-bold w-64">Sucursal:</div>
                <div>274 PROVIDENCIA JAL</div>
              </div>
              <div className="flex">
                <div className="font-bold w-64">Referencia:</div>
                <div>{cotizacionNumber}</div>
              </div>
            </div>
          </div>

          <div className="text-center font-bold mb-6">CEMA International Compliance Services S.A. de C.V.</div>

          <div className="bg-gray-100 p-6 rounded-lg mb-8">
            <div className="space-y-3">
              <div className="flex">
                <div className="font-bold w-64">Nombre del titular de la cuenta:</div>
                <div>CEMA INTERNATIONAL COMPLIANCE SERVICES SA DE CV</div>
              </div>
              <div className="flex">
                <div className="font-bold w-64">Número de cuenta:</div>
                <div>0116687962</div>
              </div>
              <div className="flex">
                <div className="font-bold w-64">Número de cuenta CLABE:</div>
                <div>012320001166879622</div>
              </div>
              <div className="flex">
                <div className="font-bold w-64">Banco:</div>
                <div>BBVA Bancomer</div>
              </div>
              <div className="flex">
                <div className="font-bold w-64">CÓDIGO SWIFT BBVA en Guadalajara:</div>
                <div>BCMRMXMMGUA</div>
              </div>
              <div className="flex">
                <div className="font-bold w-64">Sucursal:</div>
                <div>1748 CENTRO PYME GUADALAJARA CENTRO</div>
              </div>
              <div className="flex">
                <div className="font-bold w-64">Referencia:</div>
                <div>{cotizacionNumber}</div>
              </div>
            </div>
          </div>

          <div className="text-center mt-6">
            <p>Por favor, anexe los pagos de servicios a los siguientes correos:</p>
            <p className="font-medium">contacto@cemacertificacion.com</p>
            <p className="font-medium">carlos.perez@cemacertificacion.com</p>
          </div>

          <div className="text-center mt-12 text-sm text-[#00539B] font-medium">www.cemacertificacion.com</div>
        </div>

        {/* Página 5 - Datos de pago internacionales */}
        <div id="pdf-page-5" className="p-6 pdf-section" style={{ fontFamily: "Arial, sans-serif" }}>
          <div className="relative overflow-hidden mb-6" style={{ width: "21.59cm", height: "4.38cm" }}>
            <img
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-YJRa9WNra5MJiOOLbUV4lnaY9dWgpp.png"
              alt="Tarjeta de pago"
              className="w-full h-full object-cover"
              style={{ objectPosition: "center" }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#00539B]/70 to-[#00539B]/30 flex items-center justify-center"></div>
          </div>

          <h2 className="text-xl font-bold mb-6 text-center text-[#00539B]">DATOS DE PAGOS DE SERVICIOS</h2>

          <div className="mb-6">
            <h3 className="font-bold mb-2">International Wire Details/Detalles de transferencias internacionales.</h3>
            <p className="mb-4">
              Para enviar correctamente una transferencia: Envíe sólo dólares estadounidenses a este banco.
            </p>
          </div>

          <div className="bg-gray-100 p-6 rounded-lg mb-8">
            <h4 className="font-bold mb-2">Receiving Bank</h4>
            <div className="space-y-2 mb-6">
              <div className="flex">
                <div className="font-bold w-48">SWIFT/BIC Code:</div>
                <div>CHFGUS44021</div>
              </div>
              <div className="flex">
                <div className="font-bold w-48">ABA Routing Number:</div>
                <div>091311229</div>
              </div>
              <div className="flex">
                <div className="font-bold w-48">Bank Name:</div>
                <div>Choice Financial Group</div>
              </div>
              <div className="flex">
                <div className="font-bold w-48">Bank Address:</div>
                <div>4501 23rd Avenue S Fargo, ND 58104 USA</div>
              </div>
            </div>

            <h4 className="font-bold mb-2">Beneficiary</h4>
            <div className="space-y-2">
              <div className="flex">
                <div className="font-bold w-48">IBAN/Account Number:</div>
                <div>202554224977</div>
              </div>
              <div className="flex">
                <div className="font-bold w-48">Beneficiary Name:</div>
                <div>CEMA CERTIFICATION GROUP LLC</div>
              </div>
              <div className="flex">
                <div className="font-bold w-48">Beneficiary Address:</div>
                <div>2 South Biscayne Boulevard Ste 3200, 5315, Miami, FL 33131, USA</div>
              </div>
            </div>
          </div>

          <div className="text-center font-bold mb-6">CEMA International Compliance Services S.A. de C.V.</div>

          <div className="text-center mt-6">
            <p>Por favor, anexe los pagos de servicios a los siguientes correos:</p>
            <p className="font-medium">contacto@cemacertificacion.com</p>
            <p className="font-medium">carlos.perez@cemacertificacion.com</p>
          </div>

          <div className="text-center mt-12 text-sm text-[#00539B] font-medium">www.cemacertificacion.com</div>
        </div>

        {/* Página 6 - Información adicional de pagos */}
        <div id="pdf-page-6" className="p-6 pdf-section" style={{ fontFamily: "Arial, sans-serif" }}>
          <div className="relative overflow-hidden mb-6" style={{ width: "21.59cm", height: "4.38cm" }}>
            <img
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-YJRa9WNra5MJiOOLbUV4lnaY9dWgpp.png"
              alt="Tarjeta de pago"
              className="w-full h-full object-cover"
              style={{ objectPosition: "center" }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#00539B]/70 to-[#00539B]/30 flex items-center justify-center"></div>
          </div>

          <h2 className="text-xl font-bold mb-6 text-center text-[#00539B]">INFORMACIÓN ADICIONAL DE PAGOS</h2>

          <div className="bg-gray-100 p-6 rounded-lg mb-8">
            <h4 className="font-bold mb-4">Consideraciones importantes:</h4>
            <ul className="list-disc pl-6 space-y-3">
              <li>Todos los pagos deben incluir el número de referencia proporcionado.</li>
              <li>
                Las transferencias internacionales pueden tener cargos adicionales por parte de bancos intermediarios.
              </li>
              <li>El tiempo de acreditación puede variar según el método de pago utilizado.</li>
              <li>Para cualquier duda sobre pagos, contacte a nuestro departamento de finanzas.</li>
            </ul>
          </div>

          <div className="bg-gray-100 p-6 rounded-lg mb-8">
            <h4 className="font-bold mb-4">Métodos de pago aceptados:</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 bg-[#78B832] rounded-full flex items-center justify-center text-white font-bold text-xs">
                  ✓
                </div>
                <div>Transferencia bancaria nacional e internacional</div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 bg-[#78B832] rounded-full flex items-center justify-center text-white font-bold text-xs">
                  ✓
                </div>
                <div>Depósito en cuenta</div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 bg-[#78B832] rounded-full flex items-center justify-center text-white font-bold text-xs">
                  ✓
                </div>
                <div>Pago con cheque (sujeto a verificación)</div>
              </div>
            </div>
          </div>

          <div className="text-center mt-6">
            <p>Por favor, anexe los comprobantes de pago a los siguientes correos:</p>
            <p className="font-medium">contacto@cemacertificacion.com</p>
            <p className="font-medium">carlos.perez@cemacertificacion.com</p>
          </div>

          <div className="text-center mt-12 text-sm text-[#00539B] font-medium">www.cemacertificacion.com</div>
        </div>

        {/* Página 7 - Página con imagen de fondo de uvas */}
        <div
          id="pdf-page-7"
          className="p-0 pdf-section relative"
          style={{
            fontFamily: "Arial, sans-serif",
            width: "21cm",
            height: "29.7cm",
            margin: "0 auto",
            padding: "0",
            overflow: "hidden",
            position: "relative",
          }}
        >
          {/* Imagen de fondo a página completa */}
          <div className="absolute inset-0 w-full h-full">
            <img
              src="/images/uvas-fondo.png"
              alt="Fondo de uvas"
              className="w-full h-full"
              style={{
                width: "21cm",
                height: "29.7cm",
                objectFit: "cover",
                objectPosition: "center",
              }}
            />
          </div>

          {/* Contenido superpuesto */}
          <div className="relative z-10 flex flex-col items-center justify-between h-full p-6">
            <div className="absolute top-4 left-2">
              <img
                src="/images/cema-logo-white.png"
                alt="CEMA - Organismo de Certificación"
                style={{
                  width: "6.02cm",
                  height: "2.87cm",
                  filter: "drop-shadow(0px 0px 3px rgba(0,0,0,0.5))",
                }}
              />
            </div>

            {/* Información de contacto en la esquina inferior izquierda */}
            <div className="absolute bottom-8 left-8 text-white">
              <div className="mb-4">
                <h3 className="text-white font-bold mb-2">CONTÁCTANOS:</h3>
                <div className="flex items-center mb-1">
                  <img
                    src="/images/email-icon.png"
                    alt="Email"
                    className="mr-2"
                    style={{
                      width: "0.53cm",
                      height: "0.67cm",
                      filter: "brightness(0) invert(1)",
                    }}
                  />
                  <a href="mailto:contacto@cemacertificacion.com" className="text-[#00539B] hover:underline">
                    contacto@cemacertificacion.com
                  </a>
                </div>
                <div className="flex items-center">
                  <img
                    src="/images/globe-icon.png"
                    alt="Web"
                    className="mr-2"
                    style={{
                      width: "0.53cm",
                      height: "0.67cm",
                      filter: "brightness(0) invert(1)",
                    }}
                  />
                  <a
                    href="https://www.cemacertificacion.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#00539B] font-bold underline hover:underline"
                  >
                    www.cemacertificacion.com
                  </a>
                </div>
              </div>
            </div>

            {/* Síguenos en la esquina inferior derecha */}
            <div className="absolute bottom-8 right-8 text-white">
              <h3 className="text-white font-bold mb-2">SÍGUENOS:</h3>
              <div className="flex gap-2">
                <a href="#" className="text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="white">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>
                <a href="#" className="text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="white">
                    <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
                  </svg>
                </a>
                <a href="#" className="text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="white">
                    <path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z" />
                  </svg>
                </a>
              </div>
            </div>

            <div className="flex flex-col items-center justify-center flex-grow">
              <div className="bg-white/80 p-6 rounded-lg text-center">
                <h2 className="text-2xl font-bold text-[#00539B] mb-4">CERTIFICACIÓN DE CALIDAD</h2>
                <p className="text-lg">Garantizamos la calidad e inocuidad de sus productos</p>
              </div>
            </div>

        
          </div>
        </div>

        {/* Página 8 - Contacto */}
        <div id="pdf-page-8" className="p-6 pdf-section" style={{ fontFamily: "Arial, sans-serif" }}>
          <div className="flex justify-center mb-6">
            <img src="/images/cema-logo.png" alt="CEMA - Organismo de Certificación" className="h-16" />
          </div>

          <div className="h-[400px] flex flex-col items-center justify-center">
            <h2 className="text-2xl font-bold mb-8 text-center text-[#00539B]">CONTÁCTANOS</h2>

            <p className="text-xl mb-4 text-center">contacto@cemacertificacion.com</p>
            <p className="text-xl mb-8 text-center">www.cemacertificacion.com</p>

            <h3 className="text-xl font-bold mb-4 text-center text-[#00539B]">SÍGUENOS:</h3>

            <div className="flex gap-6 justify-center">
              <div className="w-12 h-12 bg-[#3b5998] rounded-full flex items-center justify-center text-white font-bold">
                f
              </div>
              <div className="w-12 h-12 bg-[#1DA1F2] rounded-full flex items-center justify-center text-white font-bold">
                t
              </div>
              <div className="w-12 h-12 bg-[#E1306C] rounded-full flex items-center justify-center text-white font-bold">
                i
              </div>
            </div>
          </div>

          <div className="text-center mt-12 text-sm text-[#00539B] font-medium">www.cemacertificacion.com</div>
        </div>
      </div>
    </div>
  )
}
