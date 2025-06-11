"use client"
import { SectionBase } from "./section-base"
import { EditableField, EditableCheckbox } from "./editable-fields"

interface SectionDProps {
  editableFields: Record<string, string>
  updateEditableField: (fieldName: string, value: string) => void
  editableCheckboxes: Record<string, boolean>
  updateEditableCheckbox: (fieldName: string, checked: boolean) => void
}

export function SectionDIso9001({
  editableFields,
  updateEditableField,
  editableCheckboxes,
  updateEditableCheckbox,
}: SectionDProps) {
  return (
    <SectionBase title="SECCIÓN D: ISO 9001:2015">
      {/* Sección 1: Alcance del sistema de gestión */}
      <div style={{ marginBottom: "15px" }}>
        <p style={{ fontWeight: "bold", marginBottom: "10px" }}>
          1. Por favor describa el alcance propuesto para su sistema de gestión de calidad:
        </p>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <tbody>
            <tr>
              <td style={{ width: "30%", padding: "5px", border: "1px solid #ccc" }}>Alcance del SGC:</td>
              <td style={{ width: "70%", padding: "5px", border: "1px solid #ccc" }}>
                <EditableField
                  fieldName="alcance_sgc"
                  placeholder="Describa el alcance del sistema de gestión de calidad"
                  value={editableFields["alcance_sgc"]}
                  onChange={updateEditableField}
                  multiline
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Sección 2: Exclusiones */}
      <div style={{ marginBottom: "15px" }}>
        <p style={{ fontWeight: "bold", marginBottom: "10px" }}>
          2. ¿Existen requisitos de la norma ISO 9001:2015 que no sean aplicables a su organización?
        </p>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <tbody>
            <tr>
              <td style={{ width: "30%", padding: "5px", border: "1px solid #ccc" }}>
                ¿Existen exclusiones aplicables?
              </td>
              <td style={{ width: "70%", padding: "5px", border: "1px solid #ccc" }}>
                <div style={{ display: "flex", gap: "20px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                    <EditableCheckbox
                      fieldName="exclusiones_si"
                      checked={editableCheckboxes["exclusiones_si"]}
                      onChange={updateEditableCheckbox}
                    />
                    <span>Sí</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                    <EditableCheckbox
                      fieldName="exclusiones_no"
                      checked={editableCheckboxes["exclusiones_no"]}
                      onChange={updateEditableCheckbox}
                    />
                    <span>No</span>
                  </div>
                </div>
              </td>
            </tr>
            {editableCheckboxes["exclusiones_si"] && (
              <tr>
                <td style={{ padding: "5px", border: "1px solid #ccc" }}>
                  Si respondió "Sí", por favor especifique qué requisitos no son aplicables y justifique:
                </td>
                <td style={{ padding: "5px", border: "1px solid #ccc" }}>
                  <EditableField
                    fieldName="exclusiones_detalle"
                    placeholder="Detalle las exclusiones y su justificación"
                    value={editableFields["exclusiones_detalle"]}
                    onChange={updateEditableField}
                    multiline
                  />
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Sección 3: Información del sistema */}
      <div style={{ marginBottom: "15px" }}>
        <p style={{ fontWeight: "bold", marginBottom: "10px" }}>
          3. Por favor proporcione la siguiente información sobre su sistema de gestión de calidad:
        </p>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <tbody>
            <tr>
              <td style={{ width: "50%", padding: "5px", border: "1px solid #ccc" }}>
                ¿Cuenta con un sistema de gestión de calidad implementado?
              </td>
              <td style={{ width: "50%", padding: "5px", border: "1px solid #ccc" }}>
                <div style={{ display: "flex", gap: "20px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                    <EditableCheckbox
                      fieldName="sgc_implementado_si"
                      checked={editableCheckboxes["sgc_implementado_si"]}
                      onChange={updateEditableCheckbox}
                    />
                    <span>Sí</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                    <EditableCheckbox
                      fieldName="sgc_implementado_no"
                      checked={editableCheckboxes["sgc_implementado_no"]}
                      onChange={updateEditableCheckbox}
                    />
                    <span>No</span>
                  </div>
                </div>
              </td>
            </tr>
            <tr>
              <td style={{ padding: "5px", border: "1px solid #ccc" }}>
                ¿Desde cuándo está implementado su sistema de gestión de calidad?
              </td>
              <td style={{ padding: "5px", border: "1px solid #ccc" }}>
                <EditableField
                  fieldName="fecha_implementacion_sgc"
                  placeholder="Fecha de implementación"
                  value={editableFields["fecha_implementacion_sgc"]}
                  onChange={updateEditableField}
                />
              </td>
            </tr>
            <tr>
              <td style={{ padding: "5px", border: "1px solid #ccc" }}>
                ¿Ha realizado auditorías internas de su sistema de gestión de calidad?
              </td>
              <td style={{ padding: "5px", border: "1px solid #ccc" }}>
                <div style={{ display: "flex", gap: "20px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                    <EditableCheckbox
                      fieldName="auditorias_internas_sgc_si"
                      checked={editableCheckboxes["auditorias_internas_sgc_si"]}
                      onChange={updateEditableCheckbox}
                    />
                    <span>Sí</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                    <EditableCheckbox
                      fieldName="auditorias_internas_sgc_no"
                      checked={editableCheckboxes["auditorias_internas_sgc_no"]}
                      onChange={updateEditableCheckbox}
                    />
                    <span>No</span>
                  </div>
                </div>
              </td>
            </tr>
            <tr>
              <td style={{ padding: "5px", border: "1px solid #ccc" }}>
                ¿Ha realizado revisiones por la dirección de su sistema de gestión de calidad?
              </td>
              <td style={{ padding: "5px", border: "1px solid #ccc" }}>
                <div style={{ display: "flex", gap: "20px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                    <EditableCheckbox
                      fieldName="revision_direccion_sgc_si"
                      checked={editableCheckboxes["revision_direccion_sgc_si"]}
                      onChange={updateEditableCheckbox}
                    />
                    <span>Sí</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                    <EditableCheckbox
                      fieldName="revision_direccion_sgc_no"
                      checked={editableCheckboxes["revision_direccion_sgc_no"]}
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

      {/* Sección 4: Procesos */}
      <div style={{ marginBottom: "15px" }}>
        <p style={{ fontWeight: "bold", marginBottom: "10px" }}>
          4. Por favor indique los procesos principales de su sistema de gestión de calidad:
        </p>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={{ padding: "5px", border: "1px solid #ccc", backgroundColor: "#f0f0f0" }}>Proceso</th>
              <th style={{ padding: "5px", border: "1px solid #ccc", backgroundColor: "#f0f0f0" }}>
                Descripción breve
              </th>
              <th style={{ padding: "5px", border: "1px solid #ccc", backgroundColor: "#f0f0f0" }}>
                Responsable del proceso
              </th>
            </tr>
          </thead>
          <tbody>
            {[...Array(5)].map((_, i) => (
              <tr key={i}>
                <td style={{ padding: "5px", border: "1px solid #ccc" }}>
                  <EditableField
                    fieldName={`proceso_${i + 1}_nombre`}
                    placeholder="Nombre del proceso"
                    value={editableFields[`proceso_${i + 1}_nombre`]}
                    onChange={updateEditableField}
                  />
                </td>
                <td style={{ padding: "5px", border: "1px solid #ccc" }}>
                  <EditableField
                    fieldName={`proceso_${i + 1}_descripcion`}
                    placeholder="Descripción breve"
                    value={editableFields[`proceso_${i + 1}_descripcion`]}
                    onChange={updateEditableField}
                  />
                </td>
                <td style={{ padding: "5px", border: "1px solid #ccc" }}>
                  <EditableField
                    fieldName={`proceso_${i + 1}_responsable`}
                    placeholder="Responsable"
                    value={editableFields[`proceso_${i + 1}_responsable`]}
                    onChange={updateEditableField}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </SectionBase>
  )
}
