"use client"

interface ClauseThirdProps {
  editableFields?: Record<string, string>
  updateEditableField?: (fieldName: string, value: string) => void
}

export function ClauseThird({ editableFields = {}, updateEditableField = () => {} }: ClauseThirdProps) {
  return (
    <div style={{ marginBottom: "15px" }}>
      <p style={{ fontWeight: "bold", margin: "0 0 5px 0" }}>
        TERCERO PROCESOS DE AUDITORÍA Y CERTIFICACIÓN EJECUTADOS POR EL ORGANISMO DE CERTIFICACIÓN:
      </p>
      <p style={{ textAlign: "justify", margin: "0 0 5px 0" }}>
        Las inspecciones a la(s) operación(es) del CLIENTE, se llevarán a cabo únicamente por un auditor autorizado del
        ORGANISMO DE CERTIFICACIÓN, cumpliendo con el Esquema PrimusGFS y sus Regulaciones Generales.
      </p>
      <p style={{ textAlign: "justify", margin: "0 0 5px 0" }}>
        Las auditorías se llevarán a cabo siguiendo una programación previamente acordada por las partes, teniendo
        siempre en cuenta la disponibilidad del ORGANISMO DE CERTIFICACIÓN para prestar el servicio.
      </p>
      <p style={{ textAlign: "justify", margin: "0 0 5px 0" }}>
        Una vez concluida la auditoría, el ORGANISMO DE CERTIFICACIÓN deberá entregar al CLIENTE la copia de los
        resultados finales referentes a la auditoría, dentro de un plazo no mayor de 15 días naturales después de su
        término. Si se han de requerir transferencias de información, éstas deben indicarse previamente al CB (organismo
        de certificación por sus siglas en inglés: Certification Body) por el CLIENTE a través de un acuerdo de
        liberación de información.
      </p>
      <p style={{ textAlign: "justify", margin: "0 0 5px 0" }}>
        Cuando se logra la certificación, de acuerdo con los criterios, términos y condiciones que se especifican en la
        sección 12 de las Regulaciones Generales PrimusGFS, El ORGANISMO DE CERTIFICACIÓN emitirá un documento
        certificado al CLIENTE para cada operación aprobada, con un año de validez a partir del inicio de la ejecución
        de las actividades de inspección y certificación.
      </p>
      <p style={{ textAlign: "justify", margin: "0" }}>
        El CLIENTE dispondrá de un plazo no mayor de 30 días naturales a partir del día de la auditoría, para enviar las
        acciones correctivas mediante el uso de la página web www.primusgfs.com. Si dentro de dicho periodo las acciones
        correctivas no son recibidas por el ORGANISMO DE CERTIFICACIÓN, el proceso de auditoría se considera cerrado y
        sin posibilidades de modificar el nivel de cumplimiento del CLIENTE
      </p>
    </div>
  )
}
