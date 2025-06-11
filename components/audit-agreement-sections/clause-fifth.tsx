"use client"

interface ClauseFifthProps {
  editableFields?: Record<string, string>
  updateEditableField?: (fieldName: string, value: string) => void
}

export function ClauseFifth({ editableFields = {}, updateEditableField = () => {} }: ClauseFifthProps) {
  return (
    <div style={{ marginBottom: "15px" }}>
      <p style={{ fontWeight: "bold", margin: "0 0 5px 0" }}>QUINTO SUB-LICENCIA PARA EL USO DE LA MARCA:</p>
      <p style={{ textAlign: "justify", margin: "0 0 5px 0" }}>
        AZZULE tiene el derecho de autorizar el uso de la marca registrada PrimusGFS, sólo cuando el CLIENTE haya
        obtenido la certificación conforme al Esquema PrimusGFS, mediante una autorización por escrito otorgada por
        AZZULE. En este respecto, el uso de la marca y el logotipo deberá cumplir con las directrices establecidas por
        AZZULE y sólo puede ser utilizado en los productos resultantes del proceso de producción debidamente certificado
        de acuerdo con el Esquema PrimusGFS. El CLIENTE no tiene derecho a otorgar sub-licencias a terceros para el uso
        de la marca PrimusGFS y su logotipo.
      </p>
      <p style={{ textAlign: "justify", margin: "0" }}>
        En el caso de que el CLIENTE, sus empleados o agentes, usen incorrectamente la marca o el logotipo de PrimusGFS
        (contraviniendo lo establecido por AZZULE), adicional a la facultad de terminar anticipadamente este acuerdo sin
        la necesidad de una orden judicial y sin ninguna causa imputable al ORGANISMO DE CERTIFICACIÓN, el CLIENTE se
        hace responsable de reparar los daños y perjuicios, como se requiere por escrito por el ORGANISMO DE
        CERTIFICACIÓN o por AZZULE dentro de una plazo que no exceda a 15 (quince) días naturales contados a partir de
        dicha notificación. De igual forma los documentos de certificación otorgados al CLIENTE como resultado de la
        auditoría serán considerados como revocados de manera definitiva.
      </p>
    </div>
  )
}
