"use client"

interface ClauseSeventhProps {
  editableFields?: Record<string, string>
  updateEditableField?: (fieldName: string, value: string) => void
}

export function ClauseSeventh({ editableFields = {}, updateEditableField = () => {} }: ClauseSeventhProps) {
  return (
    <div style={{ marginBottom: "15px" }}>
      <p style={{ fontWeight: "bold", margin: "0 0 5px 0" }}>SÉPTIMO PENALIDAD CONVENCIONAL:</p>
      <p style={{ textAlign: "justify", margin: "0 0 5px 0" }}>
        Si este acuerdo se termina por cualquier causa imputable al CLIENTE, es responsabilidad de este último, sin
        necesidad de una orden judicial, pagar a favor del ORGANISMO DE CERTIFICACIÓN, lo siguiente:
      </p>
      <p style={{ textAlign: "justify", margin: "0 0 5px 0", paddingLeft: "20px" }}>
        a. La cantidad total de honorarios y gastos incurridos por el ORGANISMO DE CERTIFICACIÓN por prestación de los
        servicios, así como pagar, en su caso, los intereses vencidos. El pago deberá ser ejecutado en una sola
        exhibición el mismo día en que el ORGANISMO DE CERTIFICACIÓN informa de la terminación anticipada del contrato
        al CLIENTE.
      </p>
      <p style={{ textAlign: "justify", margin: "0", paddingLeft: "20px" }}>
        b. El ORGANISMO DE CERTIFICACIÓN tiene derecho a solicitar el cumplimiento, ya sea por la vía legal o por
        acuerdo extrajudicial. El ORGANISMO DE CERTIFICACIÓN podrá escoger el pago de la penalidad establecida, pero una
        vez ejercida alguna de las opciones, la otra no tendrá efectos legales.
      </p>
    </div>
  )
}
