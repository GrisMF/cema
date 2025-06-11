"use client"
import { EditableField, EditableCheckbox } from "../certification-sections/editable-fields"
import { SectionAGlobalGAP } from "../certification-sections/section-a-globalgap"
import { SectionBPrimusGFS } from "../certification-sections/section-b-primusgfs"
import { SectionCFsscIso22000 } from "../certification-sections/section-c-fssc-iso22000"
import { SectionDIso9001 } from "../certification-sections/section-d-iso9001"
import { SectionERevision } from "../certification-sections/section-e-revision"

interface CertificationRequestDocumentProps {
  datosGenerales?: any
  esquemas?: string[]
  datosPrimusGFS?: any
  datosGlobalGAP?: any
  editableFields: Record<string, string>
  updateEditableField: (fieldName: string, value: string) => void
  editableCheckboxes: Record<string, boolean>
  updateEditableCheckbox: (fieldName: string, checked: boolean) => void
}

export function CertificationRequestDocument({
  datosGenerales = {},
  esquemas = [],
  datosPrimusGFS = null,
  datosGlobalGAP = null,
  editableFields,
  updateEditableField,
  editableCheckboxes,
  updateEditableCheckbox,
}: CertificationRequestDocumentProps) {
  return (
    <div
      style={{
        width: "100%",
        fontFamily: "Times New Roman, serif",
        fontSize: "11pt",
        lineHeight: "1.3",
        letterSpacing: "0.3px",
        padding: "20px",
        margin: "0",
        color: "#2c3e50",
        backgroundColor: "white",
      }}
    >
      {/* Encabezado corporativo CEMA */}
      <div
        className="cema-header"
        style={{
          borderBottom: "3px solid #00539B",
          paddingBottom: "15px",
          marginBottom: "25px",
          textAlign: "center",
        }}
      >
        <div
          style={{
            background: "linear-gradient(135deg, #00539B 0%, #0066CC 100%)",
            color: "white",
            padding: "15px",
            borderRadius: "8px",
            marginBottom: "15px",
          }}
        >
          <h1
            style={{
              fontSize: "18pt",
              fontWeight: "700",
              margin: "0",
              textShadow: "0 1px 2px rgba(0,0,0,0.1)",
            }}
          >
            SOLICITUD DE CERTIFICACIÓN
          </h1>
          <p style={{ fontSize: "12pt", margin: "5px 0 0 0", opacity: "0.9" }}>
            CEMA International Compliance Services
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: "15px",
            fontSize: "10pt",
            color: "#7f8c8d",
          }}
        >
          <div>
            <strong>Código:</strong> FOR-SGI-01
          </div>
          <div>
            <strong>Revisión:</strong> 03/03
          </div>
          <div>
            <strong>Fecha:</strong> 25/02/2025
          </div>
        </div>
      </div>

      {/* Instrucciones con diseño mejorado */}
      <div
        style={{
          border: "2px solid #3498db",
          borderRadius: "8px",
          padding: "20px",
          marginBottom: "25px",
          backgroundColor: "#f8f9fa",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: "15px",
            color: "#00539B",
          }}
        >
          <div
            style={{
              width: "6px",
              height: "30px",
              backgroundColor: "#00539B",
              marginRight: "15px",
              borderRadius: "3px",
            }}
          ></div>
          <h3
            style={{
              fontWeight: "600",
              margin: "0",
              fontSize: "12pt",
            }}
          >
            INSTRUCCIONES PARA COMPLETAR EL DOCUMENTO
          </h3>
        </div>
        <p
          style={{
            textAlign: "justify",
            fontSize: "10pt",
            margin: "0",
            lineHeight: "1.6",
            color: "#34495e",
          }}
        >
          Por favor, asegúrese de que al completar este formulario ha descargado el documento y lo ha guardado en local
          antes de rellenarlo. Este PDF interactivo ha de abrirse y completarse usando Adobe Reader/Acrobat antes de
          enviarlo a CEMA.
        </p>
      </div>

      {/* Sección 1: Detalles de la empresa con estilo mejorado */}
      <div style={{ marginBottom: "25px" }}>
        <div
          className="section-header"
          style={{
            background: "linear-gradient(135deg, #00539B 0%, #0066CC 100%)",
            color: "white",
            padding: "12px 20px",
            borderRadius: "6px",
            marginBottom: "15px",
            fontWeight: "600",
            fontSize: "12pt",
          }}
        >
          1. DETALLES DE LA EMPRESA
        </div>

        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            borderRadius: "8px",
            overflow: "hidden",
          }}
        >
          <tbody>
            {[
              { label: "Nombre del productor o empresa", field: "nombreEmpresa", value: datosGenerales?.nombreEmpresa },
              {
                label: "Nombre del representante legal",
                field: "representanteLegal",
                value: datosGenerales?.representanteLegal,
              },
              { label: "Dirección fiscal", field: "direccionFiscal", value: datosGenerales?.direccionFiscal },
              { label: "País", field: "pais", value: datosGenerales?.pais, extra: true },
              { label: "RFC/RUT/CIF-NIF", field: "rfc", value: datosGenerales?.rfc },
              { label: "Correo electrónico", field: "correo", value: datosGenerales?.correo },
              { label: "Teléfono", field: "telefono", value: datosGenerales?.telefono },
              { label: "Persona de contacto", field: "personaContacto", value: datosGenerales?.personaContacto },
              { label: "Celular", field: "celular", value: datosGenerales?.celular },
              { label: "Cargo o función", field: "cargo", value: datosGenerales?.cargo },
              { label: "Página web", field: "paginaWeb", value: datosGenerales?.paginaWeb },
              { label: "Redes sociales", field: "redesSociales", value: datosGenerales?.redesSociales },
            ].map((item, index) => (
              <tr key={item.field} style={{ backgroundColor: index % 2 === 0 ? "#ffffff" : "#f8f9fa" }}>
                <td
                  style={{
                    width: "35%",
                    padding: "12px 15px",
                    border: "1px solid #bdc3c7",
                    fontWeight: "600",
                    color: "#2c3e50",
                    backgroundColor: "#ecf0f1",
                  }}
                >
                  {item.label}:
                </td>
                <td
                  style={{
                    width: "65%",
                    padding: "12px 15px",
                    border: "1px solid #bdc3c7",
                    color: "#34495e",
                  }}
                >
                  {item.value || (
                    <EditableField
                      fieldName={item.field}
                      placeholder={item.label}
                      value={editableFields[item.field] || ""}
                      onChange={updateEditableField}
                      style={{
                        border: "1px solid #ddd",
                        padding: "6px 10px",
                        borderRadius: "4px",
                        width: "100%",
                      }}
                    />
                  )}
                  {item.extra && (
                    <>
                      <span style={{ margin: "0 15px", color: "#7f8c8d" }}>C.P.:</span>
                      {datosGenerales?.codigoPostal || (
                        <EditableField
                          fieldName="codigoPostal"
                          placeholder="Código Postal"
                          style={{
                            width: "120px",
                            border: "1px solid #ddd",
                            padding: "6px 10px",
                            borderRadius: "4px",
                          }}
                          value={editableFields["codigoPostal"] || ""}
                          onChange={updateEditableField}
                        />
                      )}
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Sección 2: Normas a evaluar con diseño mejorado */}
      <div style={{ marginBottom: "25px" }}>
        <div
          className="section-header"
          style={{
            background: "linear-gradient(135deg, #00539B 0%, #0066CC 100%)",
            color: "white",
            padding: "12px 20px",
            borderRadius: "6px",
            marginBottom: "15px",
            fontWeight: "600",
            fontSize: "12pt",
          }}
        >
          2. NORMAS A EVALUAR (seleccione las aplicables)
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "15px",
            padding: "20px",
            backgroundColor: "#f8f9fa",
            borderRadius: "8px",
            border: "1px solid #e9ecef",
          }}
        >
          {[
            { field: "norma_globalgap", label: "GLOBALG.A.P.", checked: esquemas?.includes("globalgap") },
            { field: "norma_iso22000", label: "ISO 22000:2018" },
            { field: "norma_primusgfs", label: "PrimusGFS", checked: esquemas?.includes("primusgfs") },
            { field: "norma_fssc22000", label: "FSSC 22000 food safety system certification" },
            { field: "norma_iso9001", label: "ISO 9001:2015" },
          ].map((item) => (
            <div
              key={item.field}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "10px",
                backgroundColor: "white",
                borderRadius: "6px",
                border: "1px solid #dee2e6",
              }}
            >
              <EditableCheckbox
                fieldName={item.field}
                defaultChecked={item.checked}
                checked={editableCheckboxes[item.field]}
                onChange={updateEditableCheckbox}
                style={{ transform: "scale(1.2)" }}
              />
              <span style={{ fontWeight: "500", color: "#2c3e50" }}>{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Sección 3: Tipo de evaluación con diseño mejorado */}
      <div style={{ marginBottom: "25px" }}>
        <div
          className="section-header"
          style={{
            background: "linear-gradient(135deg, #00539B 0%, #0066CC 100%)",
            color: "white",
            padding: "12px 20px",
            borderRadius: "6px",
            marginBottom: "15px",
            fontWeight: "600",
            fontSize: "12pt",
          }}
        >
          3. TIPO DE EVALUACIÓN
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "15px",
            padding: "20px",
            backgroundColor: "#f8f9fa",
            borderRadius: "8px",
            border: "1px solid #e9ecef",
          }}
        >
          {[
            { field: "evaluacion_inicial", label: "Certificación Inicial", checked: true },
            { field: "evaluacion_recertificacion", label: "Re-certificación" },
            { field: "evaluacion_ampliacion", label: "Ampliación del alcance" },
            { field: "evaluacion_transferencia", label: "Certificación de transferencia" },
          ].map((item) => (
            <div
              key={item.field}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "10px",
                backgroundColor: "white",
                borderRadius: "6px",
                border: "1px solid #dee2e6",
              }}
            >
              <EditableCheckbox
                fieldName={item.field}
                defaultChecked={item.checked}
                checked={editableCheckboxes[item.field]}
                onChange={updateEditableCheckbox}
                style={{ transform: "scale(1.2)" }}
              />
              <span style={{ fontWeight: "500", color: "#2c3e50" }}>{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Pie de página CEMA mejorado */}
      <div
        className="cema-footer"
        style={{
          borderTop: "2px solid #00539B",
          paddingTop: "15px",
          marginTop: "30px",
          textAlign: "center",
          backgroundColor: "#f8f9fa",
          padding: "20px",
          borderRadius: "8px",
        }}
      >
        <div
          style={{
            color: "#00539B",
            fontWeight: "600",
            fontSize: "11pt",
            marginBottom: "5px",
          }}
        >
          CEMA International Compliance Services S.A. de C.V.
        </div>
        <div
          style={{
            fontSize: "9pt",
            color: "#7f8c8d",
            lineHeight: "1.4",
          }}
        >
          Florencia 3127, Lomas de Providencia, Guadalajara, Jalisco, México, C.P. 44647
          <br />
          <strong>Tel:</strong> 33-3640-1558 | <strong>Email:</strong> contacto@cemacertificacion.com |{" "}
          <strong>Web:</strong> www.cemacertificacion.com
        </div>
      </div>

      {/* Secciones específicas con separadores visuales */}
      <div style={{ marginTop: "40px" }}>
        <SectionAGlobalGAP
          datosGenerales={datosGenerales}
          datosGlobalGAP={datosGlobalGAP}
          esquemas={esquemas}
          editableFields={editableFields}
          updateEditableField={updateEditableField}
          editableCheckboxes={editableCheckboxes}
          updateEditableCheckbox={updateEditableCheckbox}
        />

        <SectionBPrimusGFS
          datosGenerales={datosGenerales}
          datosPrimusGFS={datosPrimusGFS}
          esquemas={esquemas}
          editableFields={editableFields}
          updateEditableField={updateEditableField}
          editableCheckboxes={editableCheckboxes}
          updateEditableCheckbox={updateEditableCheckbox}
        />

        <SectionCFsscIso22000
          editableFields={editableFields}
          updateEditableField={updateEditableField}
          editableCheckboxes={editableCheckboxes}
          updateEditableCheckbox={updateEditableCheckbox}
        />

        <SectionDIso9001
          editableFields={editableFields}
          updateEditableField={updateEditableField}
          editableCheckboxes={editableCheckboxes}
          updateEditableCheckbox={updateEditableCheckbox}
        />

        <SectionERevision
          editableFields={editableFields}
          updateEditableField={updateEditableField}
          editableCheckboxes={editableCheckboxes}
          updateEditableCheckbox={updateEditableCheckbox}
        />
      </div>
    </div>
  )
}
