"use client"

interface ClauseFourthProps {
  editableFields?: Record<string, string>
  updateEditableField?: (fieldName: string, value: string) => void
}

export function ClauseFourth({ editableFields = {}, updateEditableField = () => {} }: ClauseFourthProps) {
  return (
    <div style={{ marginBottom: "15px" }}>
      <p style={{ fontWeight: "bold", margin: "0 0 5px 0" }}>CUARTO CONSIDERACIÓN DE PAGO:</p>
      <p style={{ textAlign: "justify", margin: "0" }}>
        El CLIENTE está obligado a pagar en función de consideración de pago al ORGANISMO DE CERTIFICACIÓN las
        cantidades citadas por los servicios. El ORGANISMO DE CERTIFICACIÓN sólo entregará los resultados
        correspondientes hasta que la totalidad de las cantidades están debidamente pagadas. Pueden aplicar gastos de
        viaje, los cuales serán facturados al CLIENTE.
      </p>
    </div>
  )
}
