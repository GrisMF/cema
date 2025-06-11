"use client"

import { useState,useEffect,useRef } from "react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"


interface SolicitudCertificacionCompletaProps {

  datosGenerales?: any
  esquemas?: string[]
  datosPrimusGFS?: any
  datosGlobalGAP?: any
  formData: any
  setFormData: React.Dispatch<React.SetStateAction<any>>
  editableFields?: Record<string, string>
  updateEditableField?: (field: string, value: string) => void
  editableCheckboxes?: Record<string, boolean>
  updateEditableCheckbox?: (field: string, checked: boolean) => void
}

export function SolicitudCertificacionCompleta({
  datosGenerales = {},
  esquemas = [],
  datosPrimusGFS = null,
  datosGlobalGAP = null,
  editableFields = {},
  formData,
  setFormData,
  updateEditableField = () => {},
  editableCheckboxes = {},
  updateEditableCheckbox = () => {},
}: SolicitudCertificacionCompletaProps) {

  
  const didInit = useRef(false)
  // inyecta datosGenerales en formData sólo la primera vez
  useEffect(() => {
    
    if (didInit.current) return
     console.log("datosGenerales en el modal:", datosGenerales)
    setFormData(prev => ({
      ...prev,
      // inyecta sólo los datos generales
      nombreEmpresa:      datosGenerales.nombreEmpresa     ?? prev.nombreEmpresa,
      representanteLegal: datosGenerales.representanteLegal?? prev.representanteLegal,
      direccionFiscal:    datosGenerales.direccionFiscal   ?? prev.direccionFiscal,
      pais:               datosGenerales.pais              ?? prev.pais,
      codigoPostal:       datosGenerales.codigoPostal      ?? prev.codigoPostal,
      rfc:                datosGenerales.rfc               ?? prev.rfc,
      correoElectronico:  datosGenerales.correo             ?? prev.correoElectronico,
      telefono:           datosGenerales.telefono          ?? prev.telefono,
      personaContacto:    datosGenerales.personaContacto   ?? prev.personaContacto,
      celular:            datosGenerales.celular           ?? prev.celular,
      cargoFuncion:       datosGenerales.cargo             ?? prev.cargoFuncion,
      paginaWeb:          datosGenerales.paginaWeb         ?? prev.paginaWeb,
      redesSociales:      datosGenerales.redesSociales     ?? prev.redesSociales,
      
      // …no toques el resto de las secciones…
    }))
    
    didInit.current = true
  }, [datosGenerales, setFormData])

  const updateField = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const updateNestedField = (section: string, field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [section]: { ...prev[section], [field]: value },
    }))
  }

  const updateArrayField = (arrayName: string, index: number, field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [arrayName]: prev[arrayName].map((item: any, i: number) => (i === index ? { ...item, [field]: value } : item)),
    }))
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white">
      {/* Encabezado */}
      <div className="text-center mb-8 border-b-2 border-[#00539B] pb-4">
        <img src="/images/cema-logo.png" alt="CEMA Logo" className="h-16 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-[#00539B] mb-2">Solicitud de Certificación</h1>
        <div className="text-sm text-gray-600">
          <p>Código de registro: FOR-SGI-01</p>
          <p>Número de revisión y edición: 03/03</p>
          <p>Fecha de emisión: 25/02/2025</p>
        </div>
      </div>

      {/* Instrucciones */}
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
        <h3 className="font-bold text-yellow-800 mb-2">INSTRUCCIONES PARA COMPLETAR EL DOCUMENTO:</h3>
        <p className="text-sm text-yellow-700">
          Por favor, asegúrese de que al completar este formulario ha descargado el documento y lo ha guardado en local
          antes de rellenarlo. Este PDF interactivo ha de abrirse y completarse usando Adobe Reader/Acrobat antes de
          enviarlo a CEMA.
        </p>
      </div>

      {/* 1. Detalles de la empresa */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-[#00539B] mb-4 bg-gradient-to-r from-[#00539B] to-[#0066CC] text-white p-3 rounded">
          1. Detalles de la empresa:
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="nombreEmpresa">Nombre del productor o empresa:</Label>
            <Input
              id="nombreEmpresa"
              value={formData.nombreEmpresa}
              onChange={(e) => updateField("nombreEmpresa", e.target.value)}
              className="bg-blue-50"
            />
          </div>

          <div>
            <Label htmlFor="representanteLegal">Nombre del representante legal:</Label>
            <Input
              id="representanteLegal"
              value={formData.representanteLegal}
              onChange={(e) => updateField("representanteLegal", e.target.value)}
              className="bg-blue-50"
            />
          </div>

          <div className="md:col-span-2">
            <Label htmlFor="direccionFiscal">Dirección fiscal:</Label>
            <Input
              id="direccionFiscal"
              value={formData.direccionFiscal}
              onChange={(e) => updateField("direccionFiscal", e.target.value)}
              className="bg-blue-50"
            />
          </div>

          <div>
            <Label htmlFor="pais">País:</Label>
            <Input
              id="pais"
              value={formData.pais}
              onChange={(e) => updateField("pais", e.target.value)}
              className="bg-blue-50"
            />
          </div>

          <div>
            <Label htmlFor="codigoPostal">C.P.:</Label>
            <Input
              id="codigoPostal"
              value={formData.codigoPostal}
              onChange={(e) => updateField("codigoPostal", e.target.value)}
              className="bg-blue-50"
            />
          </div>

          <div>
            <Label htmlFor="rfc">RFC/RUT/CIF-NIF:</Label>
            <Input
              id="rfc"
              value={formData.rfc}
              onChange={(e) => updateField("rfc", e.target.value)}
              className="bg-blue-50"
            />
          </div>

          <div>
            <Label htmlFor="correoElectronico">Correo electrónico:</Label>
            <Input
              id="correoElectronico"
              type="email"
              value={formData.correoElectronico}
              onChange={(e) => updateField("correoElectronico", e.target.value)}
              className="bg-blue-50"
            />
          </div>

          <div>
            <Label htmlFor="telefono">Teléfono:</Label>
            <Input
              id="telefono"
              value={formData.telefono}
              onChange={(e) => updateField("telefono", e.target.value)}
              className="bg-blue-50"
            />
          </div>

          <div>
            <Label htmlFor="personaContacto">Persona de contacto:</Label>
            <Input
              id="personaContacto"
              value={formData.personaContacto}
              onChange={(e) => updateField("personaContacto", e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="celular">Celular:</Label>
            <Input id="celular" value={formData.celular} onChange={(e) => updateField("celular", e.target.value)} />
          </div>

          <div>
            <Label htmlFor="cargoFuncion">Cargo o función:</Label>
            <Input
              id="cargoFuncion"
              value={formData.cargoFuncion}
              onChange={(e) => updateField("cargoFuncion", e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="paginaWeb">Página web:</Label>
            <Input
              id="paginaWeb"
              value={formData.paginaWeb}
              onChange={(e) => updateField("paginaWeb", e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="redesSociales">Redes sociales:</Label>
            <Input
              id="redesSociales"
              value={formData.redesSociales}
              onChange={(e) => updateField("redesSociales", e.target.value)}
            />
          </div>
        </div>
      </div>

    

      {/* Footer */}
      <div className="border-t-2 border-[#00539B] pt-4 mt-8 text-center">
        <div className="text-sm text-gray-600">
          <p className="font-semibold text-[#00539B]">CEMA International Compliance Services S.A. de C.V.</p>
          <p>Florencia 3127, Lomas de Providencia, Guadalajara, Jalisco, México, C.P. 44647</p>
          <p>Tel: 33-3640-1558 | Email: jesus.nieves@cemacertificacion.com</p>
          <p>www.cemacertificacion.com</p>
        </div>
      </div>
    </div>
  )
}
