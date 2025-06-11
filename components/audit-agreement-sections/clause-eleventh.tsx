"use client"

interface ClauseEleventhProps {
  editableFields?: Record<string, string>
  updateEditableField?: (fieldName: string, value: string) => void
}

export function ClauseEleventh({ editableFields = {}, updateEditableField = () => {} }: ClauseEleventhProps) {
  return (
    <div style={{ marginBottom: "15px" }}>
      <p style={{ fontWeight: "bold", margin: "0 0 5px 0" }}>UNDÉCIMO ASIGNACIÓN DE DERECHOS Y OBLIGACIONES:</p>
      <p style={{ textAlign: "justify", margin: "0" }}>
        Ninguna de las partes podrá ceder la totalidad o parte de los derechos y obligaciones concedidos en el presente
        acuerdo sin el consentimiento previo por escrito otorgado por la otra parte.
      </p>
    </div>
  )
}
