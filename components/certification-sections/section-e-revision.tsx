"use client"
import { SectionBase } from "./section-base"
import { EditableField, EditableCheckbox } from "./editable-fields"

interface SectionEProps {
  editableFields: Record<string, string>
  updateEditableField: (fieldName: string, value: string) => void
  editableCheckboxes: Record<string, boolean>
  updateEditableCheckbox: (fieldName: string, checked: boolean) => void
}

export function SectionERevision({
  editableFields,
  updateEditableField,
  editableCheckboxes,
  updateEditableCheckbox,
}: SectionEProps) {
  return (
    <SectionBase
      title="SECCIÓN E: Revisión de la solicitud de certificación"
      subtitle="(Exclusivo para el personal del OC)"
    >
      {/* Sección 1: Revisión de la solicitud */}
      <div style={{ marginBottom: "15px" }}>
        <p style={{ fontWeight: "bold", marginBottom: "10px" }}>1. Revisión de la solicitud:</p>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <tbody>
            <tr>
              <td style={{ width: "70%", padding: "5px", border: "1px solid #ccc" }}>
                ¿La información proporcionada en la solicitud es suficiente para proceder con el proceso de
                certificación?
              </td>
              <td style={{ width: "30%", padding: "5px", border: "1px solid #ccc" }}>
                <div style={{ display: "flex", gap: "20px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                    <EditableCheckbox
                      fieldName="informacion_suficiente_si"
                      checked={editableCheckboxes["informacion_suficiente_si"]}
                      onChange={updateEditableCheckbox}
                    />
                    <span>Sí</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                    <EditableCheckbox
                      fieldName="informacion_suficiente_no"
                      checked={editableCheckboxes["informacion_suficiente_no"]}
                      onChange={updateEditableCheckbox}
                    />
                    <span>No</span>
                  </div>
                </div>
              </td>
            </tr>
            <tr>
              <td style={{ padding: "5px", border: "1px solid #ccc" }}>
                ¿El OC tiene la capacidad para realizar las actividades de certificación solicitadas?
              </td>
              <td style={{ padding: "5px", border: "1px solid #ccc" }}>
                <div style={{ display: "flex", gap: "20px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                    <EditableCheckbox
                      fieldName="oc_capacidad_si"
                      checked={editableCheckboxes["oc_capacidad_si"]}
                      onChange={updateEditableCheckbox}
                    />
                    <span>Sí</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                    <EditableCheckbox
                      fieldName="oc_capacidad_no"
                      checked={editableCheckboxes["oc_capacidad_no"]}
                      onChange={updateEditableCheckbox}
                    />
                    <span>No</span>
                  </div>
                </div>
              </td>
            </tr>
            <tr>
              <td style={{ padding: "5px", border: "1px solid #ccc" }}>
                ¿Se han resuelto las diferencias de entendimiento entre el OC y el solicitante?
              </td>
              <td style={{ padding: "5px", border: "1px solid #ccc" }}>
                <div style={{ display: "flex", gap: "20px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                    <EditableCheckbox
                      fieldName="diferencias_resueltas_si"
                      checked={editableCheckboxes["diferencias_resueltas_si"]}
                      onChange={updateEditableCheckbox}
                    />
                    <span>Sí</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                    <EditableCheckbox
                      fieldName="diferencias_resueltas_no"
                      checked={editableCheckboxes["diferencias_resueltas_no"]}
                      onChange={updateEditableCheckbox}
                    />
                    <span>No</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                    <EditableCheckbox
                      fieldName="diferencias_resueltas_na"
                      checked={editableCheckboxes["diferencias_resueltas_na"]}
                      onChange={updateEditableCheckbox}
                    />
                    <span>N/A</span>
                  </div>
                </div>
              </td>
            </tr>
            <tr>
              <td style={{ padding: "5px", border: "1px solid #ccc" }}>
                ¿Se ha definido el alcance de la certificación solicitada?
              </td>
              <td style={{ padding: "5px", border: "1px solid #ccc" }}>
                <div style={{ display: "flex", gap: "20px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                    <EditableCheckbox
                      fieldName="alcance_definido_si"
                      checked={editableCheckboxes["alcance_definido_si"]}
                      onChange={updateEditableCheckbox}
                    />
                    <span>Sí</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                    <EditableCheckbox
                      fieldName="alcance_definido_no"
                      checked={editableCheckboxes["alcance_definido_no"]}
                      onChange={updateEditableCheckbox}
                    />
                    <span>No</span>
                  </div>
                </div>
              </td>
            </tr>
            <tr>
              <td style={{ padding: "5px", border: "1px solid #ccc" }}>
                ¿Se dispone de los medios y la competencia necesaria para realizar las actividades de certificación?
              </td>
              <td style={{ padding: "5px", border: "1px solid #ccc" }}>
                <div style={{ display: "flex", gap: "20px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                    <EditableCheckbox
                      fieldName="medios_competencia_si"
                      checked={editableCheckboxes["medios_competencia_si"]}
                      onChange={updateEditableCheckbox}
                    />
                    <span>Sí</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                    <EditableCheckbox
                      fieldName="medios_competencia_no"
                      checked={editableCheckboxes["medios_competencia_no"]}
                      onChange={updateEditableCheckbox}
                    />
                    <span>No</span>
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Sección 2: Observaciones */}
      <div style={{ marginBottom: "15px" }}>
        <p style={{ fontWeight: "bold", marginBottom: "10px" }}>2. Observaciones:</p>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <tbody>
            <tr>
              <td style={{ padding: "5px", border: "1px solid #ccc" }}>
                <EditableField
                  fieldName="observaciones_revision"
                  placeholder="Ingrese las observaciones relevantes sobre la revisión de la solicitud"
                  value={editableFields["observaciones_revision"]}
                  onChange={updateEditableField}
                  multiline
                  style={{ minHeight: "100px" }}
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Sección 3: Resultado de la revisión */}
      <div style={{ marginBottom: "15px" }}>
        <p style={{ fontWeight: "bold", marginBottom: "10px" }}>3. Resultado de la revisión:</p>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <tbody>
            <tr>
              <td style={{ width: "70%", padding: "5px", border: "1px solid #ccc" }}>
                ¿Se acepta la solicitud de certificación?
              </td>
              <td style={{ width: "30%", padding: "5px", border: "1px solid #ccc" }}>
                <div style={{ display: "flex", gap: "20px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                    <EditableCheckbox
                      fieldName="solicitud_aceptada_si"
                      checked={editableCheckboxes["solicitud_aceptada_si"]}
                      onChange={updateEditableCheckbox}
                    />
                    <span>Sí</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                    <EditableCheckbox
                      fieldName="solicitud_aceptada_no"
                      checked={editableCheckboxes["solicitud_aceptada_no"]}
                      onChange={updateEditableCheckbox}
                    />
                    <span>No</span>
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Sección 4: Firmas */}
      <div style={{ marginBottom: "15px" }}>
        <p style={{ fontWeight: "bold", marginBottom: "10px" }}>4. Firmas:</p>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <tbody>
            <tr>
              <td style={{ width: "50%", padding: "5px", border: "1px solid #ccc" }}>
                <p style={{ marginBottom: "5px" }}>Revisado por:</p>
                <EditableField
                  fieldName="revisado_por"
                  placeholder="Nombre y cargo"
                  value={editableFields["revisado_por"]}
                  onChange={updateEditableField}
                />
                <p style={{ marginTop: "20px", marginBottom: "5px" }}>Firma:</p>
                <div
                  style={{
                    height: "40px",
                    border: "1px dashed #ccc",
                    marginBottom: "5px",
                  }}
                ></div>
                <p style={{ marginBottom: "5px" }}>Fecha:</p>
                <EditableField
                  fieldName="fecha_revision"
                  placeholder="DD/MM/AAAA"
                  value={editableFields["fecha_revision"]}
                  onChange={updateEditableField}
                />
              </td>
              <td style={{ width: "50%", padding: "5px", border: "1px solid #ccc" }}>
                <p style={{ marginBottom: "5px" }}>Aprobado por:</p>
                <EditableField
                  fieldName="aprobado_por"
                  placeholder="Nombre y cargo"
                  value={editableFields["aprobado_por"]}
                  onChange={updateEditableField}
                />
                <p style={{ marginTop: "20px", marginBottom: "5px" }}>Firma:</p>
                <div
                  style={{
                    height: "40px",
                    border: "1px dashed #ccc",
                    marginBottom: "5px",
                  }}
                ></div>
                <p style={{ marginBottom: "5px" }}>Fecha:</p>
                <EditableField
                  fieldName="fecha_aprobacion"
                  placeholder="DD/MM/AAAA"
                  value={editableFields["fecha_aprobacion"]}
                  onChange={updateEditableField}
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div style={{ textAlign: "center", margin: "30px 0" }}>
        <p style={{ fontSize: "9pt", margin: "0" }}>Cema International Compliance Services S.A. de C.V.</p>
        <p style={{ fontSize: "9pt", margin: "0" }}>
          33-3640-1558 jesus.nieves@cemacertificacion.com www.cemacertificacion.com
        </p>
      </div>
    </SectionBase>
  )
}
