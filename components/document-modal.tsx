"use client"

import { useState, useEffect, useRef } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { FileText, Download, Printer, Trash2 } from "lucide-react"
import { useGeneratePdf } from "@/hooks/useGeneratePdf/"

import { jsPDF } from "jspdf"

import html2canvas from "html2canvas"

if (typeof window !== "undefined") {
  ;(window as any).html2canvas = html2canvas
}

import { fillSolicitudPdf } from "@/lib/utils/fillSolicitudPdf"
import { CertificationRequestDocument } from "./documents/certification-request-document"
import { AuditAgreementDocument } from "./documents/audit-agreement-document"
import { ServiceContractDocument } from "./documents/service-contract-document"
import { SolicitudCertificacionCompleta } from "./documents/solicitud-certificacion-completa"

interface DocumentModalProps {
  isOpen: boolean
  onClose: () => void
  documents: {
    serviceContract: string
    auditAgreement: string
    certificationRequest: string
  }
  datosGenerales?: any
  esquemas?: string[]
  datosPrimusGFS?: any
  datosGlobalGAP?: any
}

export function DocumentModal({
  isOpen,
  onClose,
  documents,
  datosGenerales = {},
  esquemas = [],
  datosPrimusGFS = null,
  datosGlobalGAP = null,
}: DocumentModalProps) {

  const generatePdf = useGeneratePdf();

  const [activeTab, setActiveTab] = useState("serviceContract")
  const documentRef = useRef<HTMLDivElement>(null)
  const [formData, setFormData] = useState({
    // Datos de la empresa
    nombreEmpresa: "",
    representanteLegal: "",
    direccionFiscal: "",
    pais: "",
    codigoPostal: "",
    rfc: "",
    correoElectronico: "",
    telefono: "",
    personaContacto: "",
    celular: "",
    cargoFuncion: "",
    paginaWeb: "",
    redesSociales: "",

    // Normas
    globalGAP: false,
    iso22000: false,
    primusGFS: false,
    fssc22000: false,
    iso9001: false,

    // Tipo de evaluación
    certificacionInicial: false,
    recertificacion: false,
    ampliacionAlcance: false,
    certificacionTransferencia: false,

    // Transferencia
    numeroCertificado: "",
    normaTransferencia: "",
    fechaValidez: "",
    organismoAnterior: "",
    certificadosActivos: "",
    ncMayores: "",
    ncMenores: "",
    detallesNC: "",

    // Productos a certificar (10 filas)
    productos: Array(10).fill({ nombre: "", pais: "" }),

    // Meses de cosecha (10 filas, cada una con los 12 meses)
    mesesCosecha: Array(10).fill({
      producto: "",
      ene: false,
      feb: false,
      mar: false,
      abr: false,
      may: false,
      jun: false,
      jul: false,
      ago: false,
      sep: false,
      oct: false,
      nov: false,
      dic: false,
    }),

    // Subcontratistas (5 filas de ejemplo)
    subcontratistas: Array(5).fill({
      nombre: "",
      direccion: "",
      actividad: "",
      certificado: "",
    }),

    // Fechas restringidas
    fechasRestringidas: "",
    detallesFechas: "",

    // GLOBALG.A.P.
    opcionCertificacion: "",
    alcanceVersion: "",
    accesoEmpresa: "",
    granjas: Array(3).fill({
      nombre: "",
      productos: "",
      direccion: "",
      coordenadas: "",
      distancia: "",
      familiar: "",
      trabajadores: "",
      agua: "",
      invernadero: "",
    }),

    // PrimusGFS
    operaciones: {
      granja: false,
      invernadero: false,
      cuadrilla: false,
      cuartoFrio: false,
      empaque: false,
      procesadora: false,
      almacen: false,
    },
    modulos: {
      saia: false,
      bpaGranja: false,
      bpaInvernadero: false,
      bpaCuadrilla: false,
      bpmAlmacen: false,
      bpmCuartoFrio: false,
      bpmEmpaque: false,
      bpmProcesadora: false,
      haccp: false,
      controles: false,
      granos: false,
      plagas: false,
    },
    alcanceGFSI: "",
    contactosPrimus: Array(3).fill({
      nombre: "",
      cargo: "",
      correo: "",
      telefono: "",
    }),

    // FSSC 22000 / ISO 22000:2018
    instalacionFSSC: {
      nombre: "",
      direccion: "",
      coordenadas: "",
      antiguedad: "",
      años: "",
      construccion: "",
      area: "",
      lineas: "",
      empleados: "",
      temporales: "",
      total: "",
      turnos: "",
    },
    alcanceFSSC: {
      propuesto: "",
      exclusiones: "",
      justificacion: "",
      otroSitio: "",
    },
    productoFSSC: {
      planesHACCP: "",
      pcc: "",
      materias: "",
      alergenos: "",
      embalajes: "",
      coenvasadores: "",
      conservacion: "",
      subcontratados: "",
      almacenamientoTransporte: "",
      automatizado: "",
      procesos: "",
      excluidos: "",
      tratados: "",
    },

    // ISO 9001:2015
    instalacionISO: {
      nombre: "",
      direccion: "",
      coordenadas: "",
      antiguedad: "",
      años: "",
      construccion: "",
      area: "",
      lineas: "",
      empleados: "",
      temporales: "",
      total: "",
      turnos: "",
    },
    alcanceISO: {
      propuesto: "",
      exclusiones: "",
      justificacion: "",
      otroSitio: "",
    },
    productoISO: {
      planesHACCP: "",
      pcc: "",
      materias: "",
      alergenos: "",
      embalajes: "",
      coenvasadores: "",
      conservacion: "",
      subcontratados: "",
      almacenamientoTransporte: "",
      automatizado: "",
      procesos: "",
      excluidos: "",
      tratados: "",
    },

    // Revisión
    revision: {
      pregunta0_si: false,
      pregunta0_no: false,
      comentario0: "",
      pregunta1_si: false,
      pregunta1_no: false,
      comentario1: "",
      pregunta2_si: false,
      pregunta2_no: false,
      comentario2: "",
      pregunta3_si: false,
      pregunta3_no: false,
      comentario3: "",
      pregunta4_si: false,
      pregunta4_no: false,
      comentario4: "",
      auditorAsignado: "",
      fechaAsignada: "",
      revisor: "",
      fechaRevision: "",
    },
  })

  const didInit = useRef(false)

  useEffect(() => {
    if (didInit.current) return
    setFormData((prev) => ({
      ...prev,
      nombreEmpresa: datosGenerales.nombreEmpresa ?? prev.nombreEmpresa,
      representanteLegal: datosGenerales.representanteLegal ?? prev.representanteLegal,
      direccionFiscal: datosGenerales.direccionFiscal ?? prev.direccionFiscal,
      pais: datosGenerales.pais ?? prev.pais,
      codigoPostal: datosGenerales.codigoPostal ?? prev.codigoPostal,
      rfc: datosGenerales.rfc ?? prev.rfc,
      correoElectronico: datosGenerales.correoElectronico ?? prev.correoElectronico,
      telefono: datosGenerales.telefono ?? prev.telefono,
      personaContacto: datosGenerales.personaContacto ?? prev.personaContacto,
      celular: datosGenerales.celular ?? prev.celular,
      cargoFuncion: datosGenerales.cargoFuncion ?? prev.cargoFuncion,
      paginaWeb: datosGenerales.paginaWeb ?? prev.paginaWeb,
      redesSociales: datosGenerales.redesSociales ?? prev.redesSociales,
    }))
    didInit.current = true
  }, [datosGenerales, setFormData])

  const [editableFields, setEditableFields] = useState<Record<string, string>>({})
  const [editableCheckboxes, setEditableCheckboxes] = useState<Record<string, boolean>>({})
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false)

  const updateEditableField = (fieldName: string, value: string) => {
    setEditableFields((prev) => ({
      ...prev,
      [fieldName]: value,
    }))
  }

  const updateEditableCheckbox = (fieldName: string, checked: boolean) => {
    setEditableCheckboxes((prev) => ({
      ...prev,
      [fieldName]: checked,
    }))
  }

  const loadImageAsBase64 = async (imagePath: string): Promise<string> => {
    try {
      const response = await fetch(imagePath)
      const blob = await response.blob()
      return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result as string)
        reader.onerror = reject
        reader.readAsDataURL(blob)
      })
    } catch (error) {
      console.warn(`No se pudo cargar la imagen: ${imagePath}`)
      return ""
    }
  }

  const handlePrint = () => {
    const printWindow = window.open("", "_blank")
    if (printWindow && documentRef.current) {
      const content = documentRef.current.innerHTML
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Documento para Impresión</title>
            <style>
              @page { 
                size: A4; 
                margin: 15mm; 
              }
              body { 
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
                line-height: 1.4; 
                color: #2c3e50; 
                margin: 0; 
                padding: 0; 
                font-size: 11pt; 
                background: white;
                max-width: 100%;
                overflow-wrap: break-word;
              }
              .cema-header {
                border-bottom: 2px solid #00539B;
                padding-bottom: 10px;
                margin-bottom: 20px;
              }
              table { 
                width: 100%; 
                border-collapse: collapse; 
                margin-bottom: 15px; 
                font-size: 10pt;
                table-layout: fixed;
              }
              td, th { 
                border: 1px solid #bdc3c7; 
                padding: 6px; 
                vertical-align: top;
                word-wrap: break-word;
                overflow-wrap: break-word;
              }
              th { 
                background-color: #ecf0f1; 
                font-weight: 600;
                color: #2c3e50;
              }
              .section-title {
                background: linear-gradient(135deg, #00539B 0%, #0066CC 100%);
                color: white;
                padding: 12px;
                margin: 20px 0 15px 0;
                border-radius: 4px;
                font-weight: 600;
                text-align: center;
              }
              .cema-footer {
                border-top: 1px solid #00539B;
                padding-top: 10px;
                margin-top: 20px;
                text-align: center;
                font-size: 9pt;
                color: #7f8c8d;
              }
              @media print { 
                body { font-size: 10pt; } 
                .no-print { display: none; } 
                .section-title { 
                  background: #00539B !important; 
                  -webkit-print-color-adjust: exact !important;
                  print-color-adjust: exact !important;
                }
              }
            </style>
          </head>
          <body>
            <div class="document-container">${content}</div>
          </body>
        </html>
      `)
      printWindow.document.close()
      printWindow.focus()
      setTimeout(() => {
        printWindow.print()
      }, 1000)
    }
  }

  const PDF_CSS = `
  .pdf-optimized { font-family: 'Times New Roman', serif; line-height:1.3; }
  .pdf-optimized table { border-collapse:collapse; width:100%; font-size:11pt; }
  .pdf-optimized th, .pdf-optimized td { border:1px solid #bdc3c7; padding:6pt; }
  .pdf-optimized h1 { font-family: 'Segoe UI', sans-serif; font-size:11pt; }
  .pdf-optimized h2 { font-family: 'Segoe UI', sans-serif; font-size:10pt; }
  /* overrides Tailwind */
  .pdf-optimized .text-4xl { font-size:22pt !important; }
`;
  // Implementación mejorada para generar PDF con texto real, no imágenes
  function buildFileName(
  activeTab: string,
  datosGenerales?: { nombreEmpresa?: string }
) {
  let filename = "CEMA_";
  if (activeTab === "serviceContract") filename += "Contrato_Servicios";
  else if (activeTab === "auditAgreement") filename += "Acuerdo_Auditoria";
  else if (activeTab === "certificationRequest") filename += "Solicitud_Certificacion";
  else if (activeTab === "solicitudForm") filename += "Formulario_Completo";

  if (datosGenerales?.nombreEmpresa) {
    const empresa = datosGenerales.nombreEmpresa
      .replace(/[^\w\s]/g, "")
      .replace(/\s+/g, "_")
      .substring(0, 20);
    filename += `_${empresa}`;
  }
  filename += `_${new Date().toISOString().slice(0, 10).replace(/-/g, "")}.pdf`;
  return `${filename}.pdf`;
}

  function getDocumentTitle(activeTab: string): string {
    if (activeTab === "serviceContract") return "Contrato de Servicios de Certificación";
    if (activeTab === "auditAgreement") return "Acuerdo de Auditoría";
    if (activeTab === "certificationRequest") return "Solicitud de Certificación";
    if (activeTab === "solicitudForm") return "Formulario Completo";
    return "Documento";
  }

// 2️⃣ handleDownload actualizado
const handleDownload = async () => {
  if (!documentRef.current) return;

  // Nodo activo
  const activeContent = documentRef.current.querySelector(
    '[data-state="active"]'
  ) as HTMLElement | null;
  if (!activeContent) return alert("No hay documento activo");

  // Clonar y limpiar
  const clone = activeContent.cloneNode(true) as HTMLElement;
  clone.querySelectorAll(".no-print, button, [data-pdf-ignore]").forEach((el) =>
    el.remove()
  );

  // Estilos embebidos → viajarán con el wrapper
  const style = document.createElement("style");
  style.textContent = PDF_CSS;           // <-- tu bloque css optimizado

  const wrapper = document.createElement("div");
  wrapper.className = "pdf-optimized";
  wrapper.append(style, clone);

  setIsGeneratingPDF(true);
  try {
    await generatePdf(
      wrapper,
      buildFileName(activeTab, datosGenerales),
      getDocumentTitle(activeTab)
    );
  } catch (err) {
    console.error(err);
    alert("Ocurrió un error al generar el PDF.");
  } finally {
    setIsGeneratingPDF(false);
  }
};


  // Función auxiliar para dividir el contenido en secciones manejables
  const splitContentIntoSections = (container: HTMLElement): HTMLElement[] => {
    const sections: HTMLElement[] = []
    const children = Array.from(container.children)

    // Estimamos que cada sección debe tener aproximadamente 800px de altura
    // para caber en una página A4 con márgenes
    const maxSectionHeight = 800
    let currentSection = document.createElement("div")
    let currentHeight = 0

    children.forEach((child) => {
      const clone = child.cloneNode(true) as HTMLElement
      const childHeight = child.getBoundingClientRect().height

      // Si añadir este elemento excedería la altura máxima, creamos una nueva sección
      if (currentHeight + childHeight > maxSectionHeight && currentHeight > 0) {
        sections.push(currentSection)
        currentSection = document.createElement("div")
        currentHeight = 0
      }

      currentSection.appendChild(clone)
      currentHeight += childHeight
    })

    // Añadir la última sección si contiene elementos
    if (currentSection.children.length > 0) {
      sections.push(currentSection)
    }

    return sections
  }

  const handleClearFields = () => {
    if (window.confirm("¿Está seguro que desea limpiar todos los campos editables?")) {
      setEditableFields({})
      setEditableCheckboxes({})
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-5xl max-h-[95vh] flex flex-col p-0">
        <DialogHeader className="p-4 border-b bg-gradient-to-r from-[#00539B] to-[#0066CC] text-white">
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Documentos para Ordenar - CEMA Certification
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
          <div className="px-4 pt-4">
            <TabsList className="grid grid-cols-4 mb-4">
              <TabsTrigger
                value="serviceContract"
                className="data-[state=active]:bg-[#00539B] data-[state=active]:text-white"
              >
                Contrato de Servicios
              </TabsTrigger>
              <TabsTrigger
                value="auditAgreement"
                className="data-[state=active]:bg-[#00539B] data-[state=active]:text-white"
              >
                Acuerdo de Auditoría
              </TabsTrigger>
              
              <TabsTrigger
                value="solicitudForm"
                className="data-[state=active]:bg-[#00539B] data-[state=active]:text-white"
              >
                Solicitud de Certificación
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="flex-1 px-4 overflow-hidden">
            <div className="h-[calc(75vh-120px)] overflow-y-auto border rounded-md p-6 bg-white shadow-inner">
              <div
                ref={documentRef}
                style={{
                  width: "100%",
                  maxWidth: "210mm",
                  margin: "0 auto",
                  backgroundColor: "white",
                  padding: "20px",
                  boxSizing: "border-box",
                }}
              >
                <TabsContent value="serviceContract" className="m-0 data-[state=active]:block">
                  <ServiceContractDocument
                    datosGenerales={datosGenerales}
                    esquemas={esquemas}
                    datosPrimusGFS={datosPrimusGFS}
                    datosGlobalGAP={datosGlobalGAP}
                    editableFields={editableFields}
                    updateEditableField={updateEditableField}
                  />
                </TabsContent>

                <TabsContent value="auditAgreement" className="m-0 data-[state=active]:block">
                  {esquemas?.includes("primusgfs") ? (
                    <AuditAgreementDocument
                      datosGenerales={datosGenerales}
                      esquemas={esquemas}
                      editableFields={editableFields}
                      updateEditableField={updateEditableField}
                    />
                  ) : (
                    <div className="text-center p-8 bg-gray-50 rounded-lg">
                      <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                      <p className="text-lg text-gray-500">
                        El Acuerdo de Auditoría solo está disponible para cotizaciones de PrimusGFS.
                      </p>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="certificationRequest" className="m-0 data-[state=active]:block">
                  <CertificationRequestDocument
                    datosGenerales={datosGenerales}
                    esquemas={esquemas}
                    datosPrimusGFS={datosPrimusGFS}
                    datosGlobalGAP={datosGlobalGAP}
                    editableFields={editableFields}
                    updateEditableField={updateEditableField}
                    editableCheckboxes={editableCheckboxes}
                    updateEditableCheckbox={updateEditableCheckbox}
                  />
                </TabsContent>

                <TabsContent value="solicitudForm" className="m-0 data-[state=active]:block">
                  <SolicitudCertificacionCompleta
                    datosGenerales={datosGenerales}
                    formData={formData}
                    setFormData={setFormData}
                    editableFields={editableFields}
                    updateEditableField={updateEditableField}
                    editableCheckboxes={editableCheckboxes}
                    updateEditableCheckbox={updateEditableCheckbox}
                  />
                </TabsContent>
              </div>
            </div>
          </div>

          <div className="p-4 border-t bg-gradient-to-r from-gray-50 to-gray-100 flex justify-between items-center">
            <Button
              variant="outline"
              onClick={handleClearFields}
              className="flex items-center gap-2 hover:bg-red-50 hover:border-red-300"
            >
              <Trash2 className="h-4 w-4" />
              Limpiar Campos
            </Button>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={handlePrint}
                className="flex items-center gap-2 hover:bg-blue-50 hover:border-blue-300"
              >
                <Printer className="h-4 w-4" />
                Imprimir
              </Button>
              <Button
                onClick={handleDownload}
                className="flex items-center gap-2 bg-gradient-to-r from-[#00539B] to-[#0066CC] hover:from-[#003b6f] hover:to-[#004d99] text-white shadow-lg"
                disabled={isGeneratingPDF}
              >
                {isGeneratingPDF ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                    Generando PDF...
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4" />
                    Descargar PDF
                  </>
                )}
              </Button>
              {activeTab === "solicitudForm" && (
                <Button
                  onClick={async () => {
                    const pdfBytes = await fillSolicitudPdf(formData, "/documents/solicitud-certification.pdf")
                    const blob = new Blob([pdfBytes], { type: "application/pdf" })
                    const url = URL.createObjectURL(blob)
                    window.open(url, "_blank")
                    setTimeout(() => URL.revokeObjectURL(url), 10000)
                  }}
                  className="flex items-center gap-2 bg-gradient-to-r from-[#00539B] to-[#0066CC] hover:from-[#003b6f] hover:to-[#004d99] text-white shadow-lg"
                >
                  <FileText className="h-4 w-4" />
                  Completar solicitud
                </Button>
              )}
            </div>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
