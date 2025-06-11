"use client"

interface ClauseFourteenthProps {
  editableFields?: Record<string, string>
  updateEditableField?: (fieldName: string, value: string) => void
}

export function ClauseFourteenth({ editableFields = {}, updateEditableField = () => {} }: ClauseFourteenthProps) {
  return (
    <div style={{ marginBottom: "15px" }}>
      <p style={{ fontWeight: "bold", margin: "0 0 5px 0" }}>DECIMOCUARTO</p>
      <p style={{ textAlign: "justify", margin: "0" }}>
        En esta cláusula las partes acuerdan y reconocen que en este convenio no hay error, fraude o ninguna de las
        partes sufren consideración desproporcionada, y declaran que han entendido todos los términos y condiciones de
        este acuerdo y expresan su conformidad con todos los considerandos y cláusulas aquí establecidas.
      </p>
    </div>
  )
}
