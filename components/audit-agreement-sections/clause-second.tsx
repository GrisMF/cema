"use client"

interface ClauseSecondProps {
  editableFields?: Record<string, string>
  updateEditableField?: (fieldName: string, value: string) => void
}

export function ClauseSecond({ editableFields = {}, updateEditableField = () => {} }: ClauseSecondProps) {
  return (
    <div style={{ marginBottom: "15px" }}>
      <p style={{ fontWeight: "bold", margin: "0 0 5px 0" }}>SEGUNDO ANTES DE LA AUDITORÍA:</p>
      <p style={{ textAlign: "justify", margin: "0 0 5px 0" }}>
        El CLIENTE deberá proporcionar al ORGANISMO DE CERTIFICACIÓN la siguiente información, con el fin de definir el
        alcance de la auditoría y la certificación a emitir por el ORGANISMO DE CERTIFICACIÓN en favor del CLIENTE:
      </p>
      <p style={{ textAlign: "justify", margin: "0 0 5px 0", paddingLeft: "20px" }}>
        a. Indicar el tipo de operación(es) sujeta(s) a auditorías de Buenas Prácticas Agrícolas, de Manufactura o
        HACCP, para determinar qué módulos del Esquema PrimusGFS serán aplicables.
      </p>
      <p style={{ textAlign: "justify", margin: "0", paddingLeft: "20px" }}>
        b. La descripción y el número de áreas de producción y/u operaciones que serán auditadas por organización. La
        solicitud presentada por el CLIENTE deberá detallar los diferentes sitios y operaciones a certificar.
      </p>
    </div>
  )
}
