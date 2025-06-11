"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Download, Building } from "lucide-react"

interface SolicitudCertificacionFormProps {
  datosGenerales: any
  esquemas: string[]
  datosPrimusGFS?: any
  datosGlobalGAP?: any
}

export function SolicitudCertificacionForm({
  datosGenerales,
  esquemas,
  datosPrimusGFS,
  datosGlobalGAP,
}: SolicitudCertificacionFormProps) {
  const [formData, setFormData] = useState({
    // Datos de la empresa (pre-llenados)
    nombreEmpresa: datosGenerales?.nombreEmpresa || "",
    representanteLegal: datosGenerales?.representanteLegal || "",
    direccionFiscal: datosGenerales?.direccionFiscal || "",
    pais: datosGenerales?.pais || "",
    codigoPostal: datosGenerales?.codigoPostal || "",
    rfc: datosGenerales?.rfc || "",
    correo: datosGenerales?.correo || "",
    telefono: datosGenerales?.telefono || "",
    personaContacto: datosGenerales?.personaContacto || "",
    celular: datosGenerales?.celular || "",
    cargo: datosGenerales?.cargo || "",
    paginaWeb: datosGenerales?.paginaWeb || "",
    redesSociales: datosGenerales?.redesSociales || "",

    // Normas seleccionadas (pre-marcadas)
    normas: {
      globalgap: esquemas?.includes("globalgap") || false,
      primusgfs: esquemas?.includes("primusgfs") || false,
      iso22000: false,
      fssc22000: false,
      iso9001: false,
    },

    // Tipo de evaluación
    tipoEvaluacion: {
      inicial: true,
      recertificacion: false,
      ampliacion: false,
      transferencia: false,
    },

    // Productos a certificar
    productos: Array(10)
      .fill(null)
      .map(() => ({
        nombre: "",
        nombreCientifico: "",
        paises: "",
      })),

    // Meses de cosecha/producción
    mesesCosecha: Array(10)
      .fill(null)
      .map(() => ({
        producto: "",
        meses: {
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
        },
      })),

    // Subcontratistas
    subcontratistas: Array(5)
      .fill(null)
      .map(() => ({
        nombre: "",
        direccion: "",
        actividad: "",
        certificado: "",
      })),

    // Fechas restringidas
    fechasRestringidas: "",
    detallesFechasRestringidas: "",
  })

  const updateFormData = (section: string, field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }))
  }

  const updateArrayData = (arrayName: string, index: number, field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [arrayName]: prev[arrayName].map((item, i) => (i === index ? { ...item, [field]: value } : item)),
    }))
  }

  const generatePDF = () => {
    // Aquí se implementaría la generación del PDF con los datos del formulario
    // Por ahora, abrimos el PDF estático
    window.open("/documents/solicitud-certificacion.pdf", "_blank")
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Encabezado */}
      <Card className="border-[#00539B] border-2">
        <CardHeader className="bg-gradient-to-r from-[#00539B] to-[#0066CC] text-white">
          <CardTitle className="text-2xl flex items-center gap-2">
            <FileText className="h-6 w-6" />
            Solicitud de Certificación
          </CardTitle>
          <p className="text-blue-100">Código de registro: FOR-SGI-01 | Revisión: 03/03 | Fecha: 25/02/2025</p>
        </CardHeader>
        <CardContent className="p-6">
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-amber-800 mb-2">INSTRUCCIONES PARA COMPLETAR EL DOCUMENTO:</h3>
            <p className="text-sm text-amber-700">
              Por favor, asegúrese de que al completar este formulario ha descargado el documento y lo ha guardado en
              local antes de rellenarlo. Este PDF interactivo ha de abrirse y completarse usando Adobe Reader/Acrobat
              antes de enviarlo a CEMA.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Sección 1: Detalles de la empresa */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl text-[#00539B] flex items-center gap-2">
            <Building className="h-5 w-5" />
            1. Detalles de la empresa
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="nombreEmpresa">Nombre del productor o empresa:</Label>
              <Input
                id="nombreEmpresa"
                value={formData.nombreEmpresa}
                onChange={(e) => setFormData((prev) => ({ ...prev, nombreEmpresa: e.target.value }))}
                className="bg-blue-50"
              />
            </div>
            <div>
              <Label htmlFor="representanteLegal">Nombre del representante legal:</Label>
              <Input
                id="representanteLegal"
                value={formData.representanteLegal}
                onChange={(e) => setFormData((prev) => ({ ...prev, representanteLegal: e.target.value }))}
                className="bg-blue-50"
              />
            </div>
            <div>
              <Label htmlFor="direccionFiscal">Dirección fiscal:</Label>
              <Input
                id="direccionFiscal"
                value={formData.direccionFiscal}
                onChange={(e) => setFormData((prev) => ({ ...prev, direccionFiscal: e.target.value }))}
                className="bg-blue-50"
              />
            </div>
            <div>
              <Label htmlFor="pais">País:</Label>
              <Input
                id="pais"
                value={formData.pais}
                onChange={(e) => setFormData((prev) => ({ ...prev, pais: e.target.value }))}
                className="bg-blue-50"
              />
            </div>
            <div>
              <Label htmlFor="codigoPostal">C.P.:</Label>
              <Input
                id="codigoPostal"
                value={formData.codigoPostal}
                onChange={(e) => setFormData((prev) => ({ ...prev, codigoPostal: e.target.value }))}
                className="bg-blue-50"
              />
            </div>
            <div>
              <Label htmlFor="rfc">RFC/RUT/CIF-NIF:</Label>
              <Input
                id="rfc"
                value={formData.rfc}
                onChange={(e) => setFormData((prev) => ({ ...prev, rfc: e.target.value }))}
                className="bg-blue-50"
              />
            </div>
            <div>
              <Label htmlFor="correo">Correo electrónico:</Label>
              <Input
                id="correo"
                type="email"
                value={formData.correo}
                onChange={(e) => setFormData((prev) => ({ ...prev, correo: e.target.value }))}
                className="bg-blue-50"
              />
            </div>
            <div>
              <Label htmlFor="telefono">Teléfono:</Label>
              <Input
                id="telefono"
                value={formData.telefono}
                onChange={(e) => setFormData((prev) => ({ ...prev, telefono: e.target.value }))}
                className="bg-blue-50"
              />
            </div>
            <div>
              <Label htmlFor="personaContacto">Persona de contacto:</Label>
              <Input
                id="personaContacto"
                value={formData.personaContacto}
                onChange={(e) => setFormData((prev) => ({ ...prev, personaContacto: e.target.value }))}
                className="bg-blue-50"
              />
            </div>
            <div>
              <Label htmlFor="celular">Celular:</Label>
              <Input
                id="celular"
                value={formData.celular}
                onChange={(e) => setFormData((prev) => ({ ...prev, celular: e.target.value }))}
                className="bg-blue-50"
              />
            </div>
            <div>
              <Label htmlFor="cargo">Cargo o función:</Label>
              <Input
                id="cargo"
                value={formData.cargo}
                onChange={(e) => setFormData((prev) => ({ ...prev, cargo: e.target.value }))}
                className="bg-blue-50"
              />
            </div>
            <div>
              <Label htmlFor="paginaWeb">Página web:</Label>
              <Input
                id="paginaWeb"
                value={formData.paginaWeb}
                onChange={(e) => setFormData((prev) => ({ ...prev, paginaWeb: e.target.value }))}
                className="bg-blue-50"
              />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="redesSociales">Redes sociales:</Label>
              <Input
                id="redesSociales"
                value={formData.redesSociales}
                onChange={(e) => setFormData((prev) => ({ ...prev, redesSociales: e.target.value }))}
                className="bg-blue-50"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sección 2: Normas */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl text-[#00539B]">
            2. Por favor seleccione las normas en las que se desea evaluar
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="globalgap"
                checked={formData.normas.globalgap}
                onCheckedChange={(checked) => updateFormData("normas", "globalgap", checked)}
              />
              <Label htmlFor="globalgap">GLOBALG.A.P.</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="iso22000"
                checked={formData.normas.iso22000}
                onCheckedChange={(checked) => updateFormData("normas", "iso22000", checked)}
              />
              <Label htmlFor="iso22000">ISO 22000:2018</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="primusgfs"
                checked={formData.normas.primusgfs}
                onCheckedChange={(checked) => updateFormData("normas", "primusgfs", checked)}
              />
              <Label htmlFor="primusgfs">PrimusGFS</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="fssc22000"
                checked={formData.normas.fssc22000}
                onCheckedChange={(checked) => updateFormData("normas", "fssc22000", checked)}
              />
              <Label htmlFor="fssc22000">FSSC 22000 food safety system certification</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="iso9001"
                checked={formData.normas.iso9001}
                onCheckedChange={(checked) => updateFormData("normas", "iso9001", checked)}
              />
              <Label htmlFor="iso9001">ISO 9001:2015</Label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sección 3: Tipo de evaluación */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl text-[#00539B]">3. Tipo de evaluación</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="inicial"
                checked={formData.tipoEvaluacion.inicial}
                onCheckedChange={(checked) => updateFormData("tipoEvaluacion", "inicial", checked)}
              />
              <Label htmlFor="inicial">Certificación Inicial</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="recertificacion"
                checked={formData.tipoEvaluacion.recertificacion}
                onCheckedChange={(checked) => updateFormData("tipoEvaluacion", "recertificacion", checked)}
              />
              <Label htmlFor="recertificacion">Re-certificación</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="ampliacion"
                checked={formData.tipoEvaluacion.ampliacion}
                onCheckedChange={(checked) => updateFormData("tipoEvaluacion", "ampliacion", checked)}
              />
              <Label htmlFor="ampliacion">Ampliación del alcance</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="transferencia"
                checked={formData.tipoEvaluacion.transferencia}
                onCheckedChange={(checked) => updateFormData("tipoEvaluacion", "transferencia", checked)}
              />
              <Label htmlFor="transferencia">Certificación de transferencia</Label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Botones de acción */}
      <div className="flex justify-center gap-4">
        <Button
          onClick={generatePDF}
          className="bg-gradient-to-r from-[#00539B] to-[#0066CC] hover:from-[#003b6f] hover:to-[#004d99] text-white px-8 py-3"
        >
          <Download className="mr-2 h-5 w-5" />
          Descargar Solicitud PDF
        </Button>
      </div>

      {/* Footer corporativo */}
      <div className="text-center text-sm text-gray-600 border-t pt-4">
        <p className="font-semibold text-[#00539B]">CEMA International Compliance Services S.A. de C.V.</p>
        <p>Florencia 3127, Lomas de Providencia, Guadalajara, Jalisco, México, C.P. 44647</p>
        <p>www.cemacertificacion.com</p>
      </div>
    </div>
  )
}
