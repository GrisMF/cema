"use client"

interface ClauseTenthProps {
  editableFields?: Record<string, string>
  updateEditableField?: (fieldName: string, value: string) => void
}

export function ClauseTenth({ editableFields = {}, updateEditableField = () => {} }: ClauseTenthProps) {
  return (
    <div style={{ marginBottom: "15px" }}>
      <p style={{ fontWeight: "bold", margin: "0 0 5px 0" }}>DÉCIMO CONFIDENCIALIDAD:</p>
      <p style={{ textAlign: "justify", margin: "0" }}>
        Dentro de la validez de este acuerdo el CLIENTE se pondrá en contacto y se familiarizará con la información
        confidencial. Esta información puede incluir, pero no se limita a, información relativa a AZZULE y al ORGANISMO
        DE CERTIFICACIÓN, por lo tanto, el CLIENTE se compromete a mantener dicha información confidencial y no
        divulgarla ni discutirla con personas ajenas a AZZULE o al ORGANISMO DE CERTIFICACIÓN. Así mismo se prohíbe al
        CLIENTE copiar, reproducir, divulgar o publicar la información confidencial que pueda estar en contacto con la
        ejecución de este acuerdo.
      </p>
    </div>
  )
}
