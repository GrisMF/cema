interface ContractHeaderProps {
  editableFields: Record<string, string>
  updateEditableField: (fieldName: string, value: string) => void
}

export function ContractHeader({ editableFields, updateEditableField }: ContractHeaderProps) {
  const today = new Date()
  const day = today.getDate().toString().padStart(2, "0")
  const month = today.getMonth() + 1
  const year = today.getFullYear()

  return (
    <div style={{ marginBottom: "20px" }}>
      <div style={{ textAlign: "right", marginBottom: "10px", fontSize: "10pt" }}>
        <p style={{ margin: "0" }}>www.cemacertificacion.com</p>
      </div>

      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <h2 style={{ fontSize: "14pt", fontWeight: "bold", margin: "0 0 10px 0" }}>
          Contrato de Servicios de Certificación
        </h2>
        <p style={{ fontSize: "10pt", margin: "2px 0" }}>Código de registro: FOR-SGI-04</p>
        <p style={{ fontSize: "10pt", margin: "2px 0" }}>Numero de revisión y edición: 00/00</p>
        <p style={{ fontSize: "10pt", margin: "2px 0" }}>Fecha de emisión: 10/10/2024</p>
        <p style={{ fontSize: "10pt", margin: "2px 0" }}>Página 1</p>
      </div>

      <div style={{ textAlign: "center", marginBottom: "20px", fontSize: "11pt" }}>
        <p style={{ margin: "5px 0", textAlign: "justify" }}>
          Contrato de Servicios de Certificación que celebran, por una parte,{" "}
          <strong>CEMA INTERNATIONAL COMPLIANCE SERVICES, S.A DE C.V.</strong>, quien en lo sucesivo y para los efectos
          de este contrato se le denominará
          <strong>"CEMA ICS"</strong> y, por la otra parte,{" "}
          <strong>{editableFields.nombreEmpresa || "_____________________"}</strong>, en lo sucesivo referido como{" "}
          <strong>"El Cliente"</strong>, y en su conjunto como las <strong>"Partes"</strong>, al amparo de las
          siguientes declaraciones y cláusulas.
        </p>
      </div>
    </div>
  )
}
