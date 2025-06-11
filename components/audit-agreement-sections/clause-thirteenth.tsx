"use client"

interface ClauseThirteenthProps {
  editableFields?: Record<string, string>
  updateEditableField?: (fieldName: string, value: string) => void
}

export function ClauseThirteenth({ editableFields = {}, updateEditableField = () => {} }: ClauseThirteenthProps) {
  return (
    <div style={{ marginBottom: "15px" }}>
      <p style={{ fontWeight: "bold", margin: "0 0 5px 0" }}>DECIMOTERCERO CLÁUSULAS NO VINCULANTES:</p>
      <p style={{ textAlign: "justify", margin: "0" }}>
        En caso de que una o más cláusulas e este acuerdo parezca(n) ser no vinculante(s), las restantes disposiciones
        de este acuerdo continuarán siendo efectivas. Las partes deberán entrar en negociaciones para reemplazar las
        cláusulas no vinculantes con otras cláusulas que sean vinculantes, de manera tal que las nuevas cláusulas
        difieran tan poco como sea posible de las cláusulas no vinculantes, tomando en cuenta el objeto y propósito de
        este acuerdo.
      </p>
    </div>
  )
}
