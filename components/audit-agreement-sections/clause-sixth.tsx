"use client"

interface ClauseSixthProps {
  editableFields?: Record<string, string>
  updateEditableField?: (fieldName: string, value: string) => void
}

export function ClauseSixth({ editableFields = {}, updateEditableField = () => {} }: ClauseSixthProps) {
  return (
    <div style={{ marginBottom: "15px" }}>
      <p style={{ fontWeight: "bold", margin: "0 0 5px 0" }}>SEXTO VIGENCIA Y TÉRMINO ANTICIPADO:</p>
      <p style={{ textAlign: "justify", margin: "0" }}>
        Este contrato de licencia tendrá validez indefinida. Si una de las partes incumpliera cualquiera de los términos
        y condiciones establecidos por este acuerdo, la otra parte deberá informar y conceder un plazo de 10 (diez) días
        naturales contados a partir de la fecha de notificación, para corregir los incumplimientos. Si una vez cumplido
        el plazo el incumplimiento continúa, este acuerdo puede ser terminado anticipadamente sin necesidad de una orden
        judicial. De igual forma las partes están autorizadas para terminar anticipadamente este acuerdo mediante una
        notificación por escrito a la otra parte, con una anticipación de 15 (quince) días laborables. Si este acuerdo
        es terminado por cualquier razón, todas las sub-licencias y certificaciones otorgados después del término del
        acuerdo, por el ORGANISMO DE CERTIFICACIÓN a CLIENTE, no tendrán ninguna validez.
      </p>
    </div>
  )
}
