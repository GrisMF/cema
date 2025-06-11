"use client"

interface ClauseFirstProps {
  editableFields?: Record<string, string>
  updateEditableField?: (fieldName: string, value: string) => void
}

export function ClauseFirst({ editableFields = {}, updateEditableField = () => {} }: ClauseFirstProps) {
  return (
    <div style={{ marginBottom: "15px" }}>
      <p style={{ fontWeight: "bold", margin: "0 0 5px 0" }}>PRIMERO OBJETIVO PRINCIPAL:</p>
      <p style={{ textAlign: "justify", margin: "0" }}>
        Las partes acuerdan y consienten que el propósito principal de este convenio es establecer las bases, términos y
        condiciones mediante los cuales el ORGANISMO DE CERTIFICACIÓN deberá ejecutar la(s) auditoría(s) a la(s)
        operación(es) de producción de acuerdo al Esquema PrimusGFS, con el fin de determinar el nivel de cumplimiento
        del proceso de producción objeto de la auditoría, en relación con el Esquema PrimusGFS y, en su caso, obtener un
        documento de certificación.
      </p>
    </div>
  )
}
