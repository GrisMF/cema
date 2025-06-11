"use client"

interface ClauseTwelfthProps {
  editableFields?: Record<string, string>
  updateEditableField?: (fieldName: string, value: string) => void
}

export function ClauseTwelfth({ editableFields = {}, updateEditableField = () => {} }: ClauseTwelfthProps) {
  return (
    <div style={{ marginBottom: "15px" }}>
      <p style={{ fontWeight: "bold", margin: "0 0 5px 0" }}>DUODÉCIMO MODIFICACIONES:</p>
      <p style={{ textAlign: "justify", margin: "0" }}>
        Este acuerdo constituye el completo acuerdo entre las partes con respecto a la materia objeto, y reemplaza y
        sustituye cualquier otro acuerdo o contrato, ya sea escrito u oral. Ninguna modificación o ampliación del
        acuerdo será vinculante a menos que esté escrita y firmada por ambas partes, para sus efectos legales.
      </p>
    </div>
  )
}
