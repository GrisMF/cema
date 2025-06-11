interface DeclarationsClientProps {
  datosGenerales: any
  editableFields: Record<string, string>
  updateEditableField: (fieldName: string, value: string) => void
}

export function DeclarationsClient({ datosGenerales, editableFields, updateEditableField }: DeclarationsClientProps) {
  const getFieldValue = (fieldName: string, defaultValue = "") => {
    return editableFields[fieldName] !== undefined ? editableFields[fieldName] : defaultValue
  }

  return (
    <div style={{ marginBottom: "20px" }}>
      <div style={{ marginBottom: "15px" }}>
        <p style={{ fontWeight: "bold", marginBottom: "5px" }}>
          II. "El Cliente" declara por conducto de su representante/por su propio derecho:
        </p>

        <div style={{ marginLeft: "20px" }}>
          <p style={{ marginBottom: "8px" }}>
            <strong>a)</strong> Tener lo siguiente
          </p>

          <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "10px", marginLeft: "20px" }}>
            <tbody>
              <tr>
                <td style={{ padding: "5px", fontWeight: "bold", width: "30%" }}>Representante legal</td>
                <td style={{ padding: "5px" }}>
                  {datosGenerales?.representanteLegal ||
                    getFieldValue("representanteLegal") ||
                    "MARIO YOJAANAM HERNANDEZ CRUZ"}
                </td>
              </tr>
              <tr>
                <td style={{ padding: "5px", fontWeight: "bold" }}>Nombre de la empresa</td>
                <td style={{ padding: "5px" }}>
                  {datosGenerales?.nombreEmpresa || getFieldValue("nombreEmpresa") || "HORTALIZAS SHANGHAI"}
                </td>
              </tr>
              <tr>
                <td style={{ padding: "5px", fontWeight: "bold" }}>Domicilio legal</td>
                <td style={{ padding: "5px" }}>
                  {datosGenerales?.direccionFiscal ||
                    getFieldValue("direccionFiscal") ||
                    "RANCHO SAN IGNACIO S/N MPIO TECAMACHALCO, PUEBLA MEX"}
                </td>
              </tr>
              <tr>
                <td style={{ padding: "5px", fontWeight: "bold" }}>Registro de la entidad (RFC, NIT, RUT, etc.)</td>
                <td style={{ padding: "5px" }}>{datosGenerales?.rfc || getFieldValue("rfc") || "HSH220617GUA"}</td>
              </tr>
            </tbody>
          </table>

          <p style={{ marginBottom: "8px", textAlign: "justify" }}>
            <strong>b)</strong> Tener plena capacidad legal para obligarse en los términos de este instrumento legal.
          </p>

          <p style={{ marginBottom: "8px", textAlign: "justify" }}>
            <strong>c)</strong> Que conoce los servicios profesionales y la forma en que los presta "CEMA ICS" y que
            requiere de dichos servicios.
          </p>

          <p style={{ marginBottom: "8px", textAlign: "justify" }}>
            <strong>d)</strong> Que el hecho de pagar las tarifas correspondientes o firmar este contrato, no garantiza
            obtener una decisión de la certificación positiva por parte de "CEMA ICS".
          </p>
        </div>
      </div>
    </div>
  )
}
