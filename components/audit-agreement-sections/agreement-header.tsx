"use client"

interface AgreementHeaderProps {
  datosGenerales?: any
  editableFields?: Record<string, string>
  updateEditableField?: (fieldName: string, value: string) => void
}

export function AgreementHeader({
  datosGenerales = {},
  editableFields = {},
  updateEditableField = () => {},
}: AgreementHeaderProps) {
  const getFieldValue = (fieldName: string, defaultValue = "") => {
    return editableFields[fieldName] !== undefined ? editableFields[fieldName] : defaultValue
  }

  return (
    <div style={{ marginBottom: "20px", letterSpacing: "0.2px", lineHeight: "1.6" }}>
      <div style={{ marginBottom: "20px" }}>
        <p style={{ margin: "0 0 2px 0" }}>Documento Confidencial Azzule Rev. 1</p>
        <p style={{ margin: "0 0 20px 0" }}>PGFS-ND-004s Página 1 de 4 3 Oct, 2017</p>
      </div>
      <div style={{ marginBottom: "20px" }}>
        <p style={{ margin: "0 0 2px 0", fontWeight: "bold" }}>
          ACUERDO DE AUDITORÍA Y SUB-LICENCIA SUSCRITO ENTRE LA EMPRESA
        </p>
        <p style={{ margin: "0 0 2px 0", fontWeight: "bold" }}>
          DENOMINADA CEMA INTERNATIONAL COMPLIANCE SERVICES S.A. DE C.V. COMO AUDITOR Y SUB-
        </p>
        <p style={{ margin: "0 0 2px 0", fontWeight: "bold" }}>LICENCIANTE, REPRESENTADA EN ESTE ACTO POR</p>
        <p style={{ margin: "0 0 2px 0", fontWeight: "bold" }}>JOSE LUIS JURADO ZURITA (EN ADELANTE REFERIDO COMO</p>
        <p style={{ margin: "0 0 2px 0", fontWeight: "bold" }}>"ORGANISMO DE CERTIFICACIÓN") Y LA COMPAÑÍA LLAMADA</p>
        <p style={{ margin: "0 0 2px 0", fontWeight: "bold" }}>
          {datosGenerales?.nombreEmpresa || (
            <input
              type="text"
              value={getFieldValue("nombreEmpresa")}
              onChange={(e) => updateEditableField("nombreEmpresa", e.target.value)}
              placeholder="Nombre de la empresa"
              style={{
                width: "250px",
                border: "1px solid #ddd",
                padding: "2px 4px",
                fontSize: "inherit",
                fontFamily: "inherit",
              }}
            />
          )}
          , REPRESENTADA EN ESTE ACTO POR
        </p>
        <p style={{ margin: "0 0 2px 0", fontWeight: "bold" }}>
          {datosGenerales?.representanteLegal || (
            <input
              type="text"
              value={getFieldValue("representanteLegal")}
              onChange={(e) => updateEditableField("representanteLegal", e.target.value)}
              placeholder="Nombre del representante legal"
              style={{
                width: "250px",
                border: "1px solid #ddd",
                padding: "2px 4px",
                fontSize: "inherit",
                fontFamily: "inherit",
              }}
            />
          )}{" "}
          EN ADELANTE REFERIDO COMO EL
        </p>
        <p style={{ margin: "0 0 2px 0", fontWeight: "bold" }}>
          "CLIENTE", DE ACUERDO CON LAS SIGUIENTES CONSIDERACIONES Y
        </p>
        <p style={{ margin: "0 0 20px 0", fontWeight: "bold" }}>CLÁUSULAS:</p>
      </div>
      <p style={{ textAlign: "center", fontWeight: "bold", margin: "20px 0" }}>C L A U S U L A S:</p>
    </div>
  )
}
