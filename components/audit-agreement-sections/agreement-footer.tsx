"use client"

interface AgreementFooterProps {
  datosGenerales?: any
  editableFields?: Record<string, string>
  updateEditableField?: (fieldName: string, value: string) => void
}

export function AgreementFooter({
  datosGenerales = {},
  editableFields = {},
  updateEditableField = () => {},
}: AgreementFooterProps) {
  const getFieldValue = (fieldName: string, defaultValue = "") => {
    return editableFields[fieldName] !== undefined ? editableFields[fieldName] : defaultValue
  }

  return (
    <div style={{ marginTop: "30px" }}>
      <p style={{ textAlign: "justify", margin: "0 0 30px 0" }}>
        EN FE DE LO CUAL, ambas partes han ejecutado este acuerdo el día de{" "}
        <input
          type="text"
          value={getFieldValue("diaFirma", "")}
          onChange={(e) => updateEditableField("diaFirma", e.target.value)}
          placeholder="día"
          style={{
            width: "50px",
            border: "1px solid #ddd",
            padding: "2px 4px",
            fontSize: "inherit",
            fontFamily: "inherit",
            textAlign: "center",
          }}
        />{" "}
        del año 2025.
      </p>

      <div style={{ display: "flex", justifyContent: "space-between", margin: "50px 0 20px 0" }}>
        <div style={{ width: "45%", textAlign: "center" }}>
          <p style={{ fontWeight: "bold", margin: "0 0 5px 0" }}>EL ORGANISMO DE CERTIFICACIÓN</p>
          <p style={{ margin: "0 0 30px 0" }}>Representado por:</p>
          <p style={{ fontWeight: "bold", margin: "30px 0 0 0" }}>JOSE LUIS JURADO ZURITA</p>
        </div>
        <div style={{ width: "45%", textAlign: "center" }}>
          <p style={{ fontWeight: "bold", margin: "0 0 5px 0" }}>EL CLIENTE</p>
          <p style={{ margin: "0 0 30px 0" }}>Representado por:</p>
          <p style={{ fontWeight: "bold", margin: "30px 0 0 0" }}>
            {datosGenerales?.representanteLegal || getFieldValue("representanteLegal", "____________________")}
          </p>
        </div>
      </div>
    </div>
  )
}
