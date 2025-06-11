"use client"

interface ClauseNinthProps {
  editableFields?: Record<string, string>
  updateEditableField?: (fieldName: string, value: string) => void
}

export function ClauseNinth({ editableFields = {}, updateEditableField = () => {} }: ClauseNinthProps) {
  return (
    <div style={{ marginBottom: "15px" }}>
      <p style={{ fontWeight: "bold", margin: "0 0 5px 0" }}>NOVENO RESPONSABILIDADES:</p>
      <p style={{ textAlign: "justify", margin: "0" }}>
        El CLIENTE está de acuerdo y reconoce expresamente que las auditorías y visitas ejecutadas de conformidad con
        este acuerdo, son exclusivamente ejecutadas por el ORGANISMO DE CERTIFICACIÓN, por lo tanto, cualquier conflicto
        o incumplimiento relacionado con él, debe ser tratado con el ORGANISMO DE CERTIFICACIÓN.
      </p>
    </div>
  )
}
