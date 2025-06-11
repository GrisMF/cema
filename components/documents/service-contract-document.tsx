"use client"
import { ContratoServicios } from "../contrato-servicios"

interface ServiceContractDocumentProps {
  datosGenerales?: any
  esquemas?: string[]
  datosPrimusGFS?: any
  datosGlobalGAP?: any
  editableFields?: Record<string, string>
  updateEditableField?: (fieldName: string, value: string) => void
}

export function ServiceContractDocument({
  datosGenerales = {},
  esquemas = [],
  datosPrimusGFS = null,
  datosGlobalGAP = null,
  editableFields = {},
  updateEditableField = () => {},
}: ServiceContractDocumentProps) {
  return (
    <ContratoServicios
      isOpen={true}
      onClose={() => {}}
      datosGenerales={datosGenerales}
      esquemas={esquemas}
      datosPrimusGFS={datosPrimusGFS}
      datosGlobalGAP={datosGlobalGAP}
      editableFields={editableFields}
      updateEditableField={updateEditableField}
    />
  )
}
