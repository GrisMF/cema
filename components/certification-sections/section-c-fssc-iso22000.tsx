"use client"
import { SectionBase } from "./section-base"
import { EditableField, EditableCheckbox } from "./editable-fields"

interface SectionCProps {
  editableFields: Record<string, string>
  updateEditableField: (fieldName: string, value: string) => void
  editableCheckboxes: Record<string, boolean>
  updateEditableCheckbox: (fieldName: string, checked: boolean) => void
}

export function SectionCFsscIso22000({
  editableFields,
  updateEditableField,
  editableCheckboxes,
  updateEditableCheckbox,
}: SectionCProps) {
  return (
    <SectionBase title="SECCIÓN C: FSSC 22000 / ISO 22000:2018">
      {/* Sección 1: Categoría de la cadena alimentaria */}
      <div style={{ marginBottom: "15px" }}>
        <p style={{ fontWeight: "bold", marginBottom: "10px" }}>
          1. Por favor seleccione la categoría de la cadena alimentaria que aplica a su organización:
        </p>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <tbody>
            <tr>
              <td style={{ padding: "5px", border: "1px solid #ccc" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                  <EditableCheckbox
                    fieldName="categoria_a"
                    checked={editableCheckboxes["categoria_a"]}
                    onChange={updateEditableCheckbox}
                  />
                  <span>A - Producción primaria animal (no aplicable para FSSC 22000)</span>
                </div>
              </td>
              <td style={{ padding: "5px", border: "1px solid #ccc" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                  <EditableCheckbox
                    fieldName="categoria_b"
                    checked={editableCheckboxes["categoria_b"]}
                    onChange={updateEditableCheckbox}
                  />
                  <span>B - Producción primaria vegetal</span>
                </div>
              </td>
            </tr>
            <tr>
              <td style={{ padding: "5px", border: "1px solid #ccc" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                  <EditableCheckbox
                    fieldName="categoria_c"
                    checked={editableCheckboxes["categoria_c"]}
                    onChange={updateEditableCheckbox}
                  />
                  <span>C - Elaboración de productos alimenticios</span>
                </div>
              </td>
              <td style={{ padding: "5px", border: "1px solid #ccc" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                  <EditableCheckbox
                    fieldName="categoria_d"
                    checked={editableCheckboxes["categoria_d"]}
                    onChange={updateEditableCheckbox}
                  />
                  <span>D - Producción de alimentos para animales</span>
                </div>
              </td>
            </tr>
            <tr>
              <td style={{ padding: "5px", border: "1px solid #ccc" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                  <EditableCheckbox
                    fieldName="categoria_e"
                    checked={editableCheckboxes["categoria_e"]}
                    onChange={updateEditableCheckbox}
                  />
                  <span>E - Catering</span>
                </div>
              </td>
              <td style={{ padding: "5px", border: "1px solid #ccc" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                  <EditableCheckbox
                    fieldName="categoria_f"
                    checked={editableCheckboxes["categoria_f"]}
                    onChange={updateEditableCheckbox}
                  />
                  <span>F - Distribución</span>
                </div>
              </td>
            </tr>
            <tr>
              <td style={{ padding: "5px", border: "1px solid #ccc" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                  <EditableCheckbox
                    fieldName="categoria_g"
                    checked={editableCheckboxes["categoria_g"]}
                    onChange={updateEditableCheckbox}
                  />
                  <span>G - Prestación de servicios de transporte y almacenamiento</span>
                </div>
              </td>
              <td style={{ padding: "5px", border: "1px solid #ccc" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                  <EditableCheckbox
                    fieldName="categoria_h"
                    checked={editableCheckboxes["categoria_h"]}
                    onChange={updateEditableCheckbox}
                  />
                  <span>H - Servicios</span>
                </div>
              </td>
            </tr>
            <tr>
              <td style={{ padding: "5px", border: "1px solid #ccc" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                  <EditableCheckbox
                    fieldName="categoria_i"
                    checked={editableCheckboxes["categoria_i"]}
                    onChange={updateEditableCheckbox}
                  />
                  <span>I - Producción de envases y embalajes para alimentos</span>
                </div>
              </td>
              <td style={{ padding: "5px", border: "1px solid #ccc" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                  <EditableCheckbox
                    fieldName="categoria_k"
                    checked={editableCheckboxes["categoria_k"]}
                    onChange={updateEditableCheckbox}
                  />
                  <span>K - Producción de equipos</span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Sección 2: Subcategoría */}
      <div style={{ marginBottom: "15px" }}>
        <p style={{ fontWeight: "bold", marginBottom: "10px" }}>
          2. Por favor especifique la subcategoría correspondiente a su operación:
        </p>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <tbody>
            <tr>
              <td style={{ width: "30%", padding: "5px", border: "1px solid #ccc" }}>Subcategoría:</td>
              <td style={{ width: "70%", padding: "5px", border: "1px solid #ccc" }}>
                <EditableField
                  fieldName="subcategoria"
                  placeholder="Especifique la subcategoría"
                  value={editableFields["subcategoria"]}
                  onChange={updateEditableField}
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Sección 3: Información del sistema */}
      <div style={{ marginBottom: "15px" }}>
        <p style={{ fontWeight: "bold", marginBottom: "10px" }}>
          3. Por favor proporcione la siguiente información sobre su sistema de gestión:
        </p>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <tbody>
            <tr>
              <td style={{ width: "50%", padding: "5px", border: "1px solid #ccc" }}>
                ¿Cuenta con un sistema de gestión de inocuidad alimentaria implementado?
              </td>
              <td style={{ width: "50%", padding: "5px", border: "1px solid #ccc" }}>
                <div style={{ display: "flex", gap: "20px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                    <EditableCheckbox
                      fieldName="sgia_implementado_si"
                      checked={editableCheckboxes["sgia_implementado_si"]}
                      onChange={updateEditableCheckbox}
                    />
                    <span>Sí</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                    <EditableCheckbox
                      fieldName="sgia_implementado_no"
                      checked={editableCheckboxes["sgia_implementado_no"]}
                      onChange={updateEditableCheckbox}
                    />
                    <span>No</span>
                  </div>
                </div>
              </td>
            </tr>
            <tr>
              <td style={{ padding: "5px", border: "1px solid #ccc" }}>
                ¿Desde cuándo está implementado su sistema de gestión?
              </td>
              <td style={{ padding: "5px", border: "1px solid #ccc" }}>
                <EditableField
                  fieldName="fecha_implementacion"
                  placeholder="Fecha de implementación"
                  value={editableFields["fecha_implementacion"]}
                  onChange={updateEditableField}
                />
              </td>
            </tr>
            <tr>
              <td style={{ padding: "5px", border: "1px solid #ccc" }}>
                ¿Cuenta con un equipo de inocuidad alimentaria establecido?
              </td>
              <td style={{ padding: "5px", border: "1px solid #ccc" }}>
                <div style={{ display: "flex", gap: "20px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                    <EditableCheckbox
                      fieldName="equipo_inocuidad_si"
                      checked={editableCheckboxes["equipo_inocuidad_si"]}
                      onChange={updateEditableCheckbox}
                    />
                    <span>Sí</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                    <EditableCheckbox
                      fieldName="equipo_inocuidad_no"
                      checked={editableCheckboxes["equipo_inocuidad_no"]}
                      onChange={updateEditableCheckbox}
                    />
                    <span>No</span>
                  </div>
                </div>
              </td>
            </tr>
            <tr>
              <td style={{ padding: "5px", border: "1px solid #ccc" }}>
                ¿Ha realizado auditorías internas de su sistema de gestión?
              </td>
              <td style={{ padding: "5px", border: "1px solid #ccc" }}>
                <div style={{ display: "flex", gap: "20px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                    <EditableCheckbox
                      fieldName="auditorias_internas_si"
                      checked={editableCheckboxes["auditorias_internas_si"]}
                      onChange={updateEditableCheckbox}
                    />
                    <span>Sí</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                    <EditableCheckbox
                      fieldName="auditorias_internas_no"
                      checked={editableCheckboxes["auditorias_internas_no"]}
                      onChange={updateEditableCheckbox}
                    />
                    <span>No</span>
                  </div>
                </div>
              </td>
            </tr>
            <tr>
              <td style={{ padding: "5px", border: "1px solid #ccc" }}>
                ¿Ha realizado revisiones por la dirección de su sistema de gestión?
              </td>
              <td style={{ padding: "5px", border: "1px solid #ccc" }}>
                <div style={{ display: "flex", gap: "20px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                    <EditableCheckbox
                      fieldName="revision_direccion_si"
                      checked={editableCheckboxes["revision_direccion_si"]}
                      onChange={updateEditableCheckbox}
                    />
                    <span>Sí</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                    <EditableCheckbox
                      fieldName="revision_direccion_no"
                      checked={editableCheckboxes["revision_direccion_no"]}
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

      {/* Sección 4: Programas de prerrequisitos */}
      <div style={{ marginBottom: "15px" }}>
        <p style={{ fontWeight: "bold", marginBottom: "10px" }}>
          4. Por favor indique los programas de prerrequisitos implementados:
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "5px", width: "48%" }}>
            <EditableCheckbox
              fieldName="ppr_construccion"
              checked={editableCheckboxes["ppr_construccion"]}
              onChange={updateEditableCheckbox}
            />
            <span>Construcción y distribución de edificios</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "5px", width: "48%" }}>
            <EditableCheckbox
              fieldName="ppr_suministros"
              checked={editableCheckboxes["ppr_suministros"]}
              onChange={updateEditableCheckbox}
            />
            <span>Suministros de aire, agua, energía</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "5px", width: "48%" }}>
            <EditableCheckbox
              fieldName="ppr_residuos"
              checked={editableCheckboxes["ppr_residuos"]}
              onChange={updateEditableCheckbox}
            />
            <span>Gestión de residuos</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "5px", width: "48%" }}>
            <EditableCheckbox
              fieldName="ppr_limpieza"
              checked={editableCheckboxes["ppr_limpieza"]}
              onChange={updateEditableCheckbox}
            />
            <span>Limpieza y desinfección</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "5px", width: "48%" }}>
            <EditableCheckbox
              fieldName="ppr_plagas"
              checked={editableCheckboxes["ppr_plagas"]}
              onChange={updateEditableCheckbox}
            />
            <span>Control de plagas</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "5px", width: "48%" }}>
            <EditableCheckbox
              fieldName="ppr_higiene"
              checked={editableCheckboxes["ppr_higiene"]}
              onChange={updateEditableCheckbox}
            />
            <span>Higiene del personal</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "5px", width: "48%" }}>
            <EditableCheckbox
              fieldName="ppr_reproceso"
              checked={editableCheckboxes["ppr_reproceso"]}
              onChange={updateEditableCheckbox}
            />
            <span>Reproceso</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "5px", width: "48%" }}>
            <EditableCheckbox
              fieldName="ppr_retirada"
              checked={editableCheckboxes["ppr_retirada"]}
              onChange={updateEditableCheckbox}
            />
            <span>Retirada de productos</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "5px", width: "48%" }}>
            <EditableCheckbox
              fieldName="ppr_almacenamiento"
              checked={editableCheckboxes["ppr_almacenamiento"]}
              onChange={updateEditableCheckbox}
            />
            <span>Almacenamiento</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "5px", width: "48%" }}>
            <EditableCheckbox
              fieldName="ppr_informacion"
              checked={editableCheckboxes["ppr_informacion"]}
              onChange={updateEditableCheckbox}
            />
            <span>Información del producto</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "5px", width: "48%" }}>
            <EditableCheckbox
              fieldName="ppr_otros"
              checked={editableCheckboxes["ppr_otros"]}
              onChange={updateEditableCheckbox}
            />
            <span>Otros (especifique):</span>
            {editableCheckboxes["ppr_otros"] && (
              <EditableField
                fieldName="ppr_otros_detalle"
                placeholder="Especifique"
                value={editableFields["ppr_otros_detalle"]}
                onChange={updateEditableField}
                style={{ width: "60%" }}
              />
            )}
          </div>
        </div>
      </div>
    </SectionBase>
  )
}
