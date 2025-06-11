"use client"

interface ClauseEighthProps {
  editableFields?: Record<string, string>
  updateEditableField?: (fieldName: string, value: string) => void
}

export function ClauseEighth({ editableFields = {}, updateEditableField = () => {} }: ClauseEighthProps) {
  return (
    <div style={{ marginBottom: "15px" }}>
      <p style={{ fontWeight: "bold", margin: "0 0 5px 0" }}>OCTAVO LEY, JURISDICCIÓN Y ARBITRAJE:</p>
      <p style={{ textAlign: "justify", margin: "0" }}>
        Este acuerdo está sujeto a la ley vigente de la República de México.
      </p>
    </div>
  )
}
