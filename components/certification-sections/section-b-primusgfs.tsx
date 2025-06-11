"use client"
import { SectionBase } from "./section-base"
import { EditableField, EditableCheckbox } from "./editable-fields"

interface SectionBProps {
  datosGenerales?: any
  datosPrimusGFS?: any
  esquemas?: string[]
  editableFields: Record<string, string>
  updateEditableField: (fieldName: string, value: string) => void
  editableCheckboxes: Record<string, boolean>
  updateEditableCheckbox: (fieldName: string, checked: boolean) => void
}

export function SectionBPrimusGFS({
  datosGenerales,
  datosPrimusGFS,
  esquemas,
  editableFields,
  updateEditableField,
  editableCheckboxes,
  updateEditableCheckbox,
}: SectionBProps) {
  if (!esquemas?.includes("primusgfs")) {
    return null
  }

  return (
    <SectionBase title="SECCIÓN B: PrimusGFS">
      {/* Sección 1: Operaciones a evaluar */}
      <div style={{ marginBottom: "15px" }}>
        <p style={{ fontWeight: "bold", marginBottom: "10px" }}>
          1. Por favor seleccione la(s) Operación(es) que se estarán evaluando:
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "5px", width: "48%" }}>
            <EditableCheckbox
              fieldName="operacion_granja"
              checked={
                editableCheckboxes["operacion_granja"] ||
                datosPrimusGFS?.operaciones?.some((op: any) => op.tipo === "granja")
              }
              onChange={updateEditableCheckbox}
            />
            <span>Operación de Granja</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "5px", width: "48%" }}>
            <EditableCheckbox
              fieldName="operacion_cuarto_frio"
              checked={
                editableCheckboxes["operacion_cuarto_frio"] ||
                datosPrimusGFS?.operaciones?.some((op: any) => op.tipo === "cuarto_frio")
              }
              onChange={updateEditableCheckbox}
            />
            <span>Operación de Cuarto frío</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "5px", width: "48%" }}>
            <EditableCheckbox
              fieldName="operacion_invernadero"
              checked={
                editableCheckboxes["operacion_invernadero"] ||
                datosPrimusGFS?.operaciones?.some((op: any) => op.tipo === "invernadero")
              }
              onChange={updateEditableCheckbox}
            />
            <span>Operación de Invernadero</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "5px", width: "48%" }}>
            <EditableCheckbox
              fieldName="operacion_empaque"
              checked={
                editableCheckboxes["operacion_empaque"] ||
                datosPrimusGFS?.operaciones?.some((op: any) => op.tipo === "empaque")
              }
              onChange={updateEditableCheckbox}
            />
            <span>Operación de Empaque</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "5px", width: "48%" }}>
            <EditableCheckbox
              fieldName="operacion_cuadrilla_cosecha"
              checked={
                editableCheckboxes["operacion_cuadrilla_cosecha"] ||
                datosPrimusGFS?.operaciones?.some((op: any) => op.tipo === "cuadrilla_cosecha")
              }
              onChange={updateEditableCheckbox}
            />
            <span>Operación de Cuadrilla de cosecha</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "5px", width: "48%" }}>
            <EditableCheckbox
              fieldName="operacion_procesadora"
              checked={
                editableCheckboxes["operacion_procesadora"] ||
                datosPrimusGFS?.operaciones?.some((op: any) => op.tipo === "procesadora")
              }
              onChange={updateEditableCheckbox}
            />
            <span>Operación de Procesadora</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "5px", width: "100%" }}>
            <EditableCheckbox
              fieldName="operacion_centro_distribucion"
              checked={
                editableCheckboxes["operacion_centro_distribucion"] ||
                datosPrimusGFS?.operaciones?.some((op: any) => op.tipo === "centro_distribucion")
              }
              onChange={updateEditableCheckbox}
            />
            <span>Operación de Centro de almacenamiento y distribución</span>
          </div>
        </div>
      </div>

      {/* Sección 2: Módulos a evaluar */}
      <div style={{ marginBottom: "15px" }}>
        <p style={{ fontWeight: "bold", marginBottom: "10px" }}>
          2. Por favor seleccione los Módulo(s) que se estarán evaluando:
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "5px", width: "48%" }}>
            <EditableCheckbox
              fieldName="modulo_saia"
              defaultChecked={true}
              checked={editableCheckboxes["modulo_saia"] !== false}
              onChange={updateEditableCheckbox}
            />
            <span>Módulo SAIA</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "5px", width: "48%" }}>
            <EditableCheckbox
              fieldName="modulo_haccp"
              checked={editableCheckboxes["modulo_haccp"]}
              onChange={updateEditableCheckbox}
            />
            <span>Módulo HACCP</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "5px", width: "48%" }}>
            <EditableCheckbox
              fieldName="modulo_bpa_granja"
              checked={editableCheckboxes["modulo_bpa_granja"]}
              onChange={updateEditableCheckbox}
            />
            <span>Módulo BPA - Granja</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "5px", width: "48%" }}>
            <EditableCheckbox
              fieldName="modulo_controles_preventivos"
              checked={editableCheckboxes["modulo_controles_preventivos"]}
              onChange={updateEditableCheckbox}
            />
            <span>Módulo Controles Preventivos</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "5px", width: "48%" }}>
            <EditableCheckbox
              fieldName="modulo_bpa_invernadero"
              checked={editableCheckboxes["modulo_bpa_invernadero"]}
              onChange={updateEditableCheckbox}
            />
            <span>Módulo BPA - Invernadero</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "5px", width: "48%" }}>
            <EditableCheckbox
              fieldName="modulo_granos_legumbres"
              checked={editableCheckboxes["modulo_granos_legumbres"]}
              onChange={updateEditableCheckbox}
            />
            <span>Módulo Granos y Legumbres</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "5px", width: "48%" }}>
            <EditableCheckbox
              fieldName="modulo_bpa_cuadrilla_cosecha"
              checked={editableCheckboxes["modulo_bpa_cuadrilla_cosecha"]}
              onChange={updateEditableCheckbox}
            />
            <span>Módulo BPA - Cuadrilla de Cosecha</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "5px", width: "48%" }}>
            <EditableCheckbox
              fieldName="modulo_manejo_plagas"
              checked={editableCheckboxes["modulo_manejo_plagas"]}
              onChange={updateEditableCheckbox}
            />
            <span>Módulo Manejo Integrado de Plagas</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "5px", width: "48%" }}>
            <EditableCheckbox
              fieldName="modulo_bpm_centro_distribucion"
              checked={editableCheckboxes["modulo_bpm_centro_distribucion"]}
              onChange={updateEditableCheckbox}
            />
            <span>Módulo BPM - Centro de almacenamiento y distribución</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "5px", width: "48%" }}>
            <EditableCheckbox
              fieldName="modulo_bpm_cuarto_frio"
              checked={editableCheckboxes["modulo_bpm_cuarto_frio"]}
              onChange={updateEditableCheckbox}
            />
            <span>Módulo BPM - Cuarto frío</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "5px", width: "48%" }}>
            <EditableCheckbox
              fieldName="modulo_bpm_empaque"
              checked={editableCheckboxes["modulo_bpm_empaque"]}
              onChange={updateEditableCheckbox}
            />
            <span>Módulo BPM - Empaque</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "5px", width: "48%" }}>
            <EditableCheckbox
              fieldName="modulo_bpm_procesadora"
              checked={editableCheckboxes["modulo_bpm_procesadora"]}
              onChange={updateEditableCheckbox}
            />
            <span>Módulo BPM - Procesadora</span>
          </div>
        </div>
      </div>

      {/* Sección 3: Información para registro en plataforma */}
      <div style={{ marginBottom: "15px" }}>
        <p style={{ fontWeight: "bold", marginBottom: "10px" }}>
          3. Por favor complete la siguiente información para el registro de contactos en la plataforma de PrimusGFS:
        </p>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <tbody>
            <tr>
              <td style={{ width: "25%", padding: "5px", border: "1px solid #ccc" }}>1. Nombre:</td>
              <td style={{ width: "25%", padding: "5px", border: "1px solid #ccc" }}>
                {datosGenerales?.personaContacto || (
                  <EditableField
                    fieldName="contacto_1_nombre"
                    placeholder="Nombre"
                    value={editableFields["contacto_1_nombre"]}
                    onChange={updateEditableField}
                  />
                )}
              </td>
              <td style={{ width: "25%", padding: "5px", border: "1px solid #ccc" }}>Cargo o función:</td>
              <td style={{ width: "25%", padding: "5px", border: "1px solid #ccc" }}>
                {datosGenerales?.cargo || (
                  <EditableField
                    fieldName="contacto_1_cargo"
                    placeholder="Cargo"
                    value={editableFields["contacto_1_cargo"]}
                    onChange={updateEditableField}
                  />
                )}
              </td>
            </tr>
            <tr>
              <td style={{ padding: "5px", border: "1px solid #ccc" }}>Correo electrónico:</td>
              <td style={{ padding: "5px", border: "1px solid #ccc" }}>
                {datosGenerales?.correo || (
                  <EditableField
                    fieldName="contacto_1_correo"
                    placeholder="Correo"
                    value={editableFields["contacto_1_correo"]}
                    onChange={updateEditableField}
                  />
                )}
              </td>
              <td style={{ padding: "5px", border: "1px solid #ccc" }}>Teléfono:</td>
              <td style={{ padding: "5px", border: "1px solid #ccc" }}>
                {datosGenerales?.telefono || (
                  <EditableField
                    fieldName="contacto_1_telefono"
                    placeholder="Teléfono"
                    value={editableFields["contacto_1_telefono"]}
                    onChange={updateEditableField}
                  />
                )}
              </td>
            </tr>
            <tr>
              <td style={{ padding: "5px", border: "1px solid #ccc" }}>2. Nombre</td>
              <td style={{ padding: "5px", border: "1px solid #ccc" }}>
                <EditableField
                  fieldName="contacto_2_nombre"
                  placeholder="Nombre"
                  value={editableFields["contacto_2_nombre"]}
                  onChange={updateEditableField}
                />
              </td>
              <td style={{ padding: "5px", border: "1px solid #ccc" }}>Cargo o función:</td>
              <td style={{ padding: "5px", border: "1px solid #ccc" }}>
                <EditableField
                  fieldName="contacto_2_cargo"
                  placeholder="Cargo"
                  value={editableFields["contacto_2_cargo"]}
                  onChange={updateEditableField}
                />
              </td>
            </tr>
            <tr>
              <td style={{ padding: "5px", border: "1px solid #ccc" }}>Correo electrónico:</td>
              <td style={{ padding: "5px", border: "1px solid #ccc" }}>
                <EditableField
                  fieldName="contacto_2_correo"
                  placeholder="Correo"
                  value={editableFields["contacto_2_correo"]}
                  onChange={updateEditableField}
                />
              </td>
              <td style={{ padding: "5px", border: "1px solid #ccc" }}>Teléfono:</td>
              <td style={{ padding: "5px", border: "1px solid #ccc" }}>
                <EditableField
                  fieldName="contacto_2_telefono"
                  placeholder="Teléfono"
                  value={editableFields["contacto_2_telefono"]}
                  onChange={updateEditableField}
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Sección 3: Alcance GFSI */}
      <div style={{ marginBottom: "15px" }}>
        <p style={{ fontWeight: "bold", marginBottom: "10px" }}>
          3. Por favor complete la siguiente información para el registro del alcance GFSI:
        </p>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <tbody>
            <tr>
              <td style={{ padding: "5px", border: "1px solid #ccc" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                  <EditableCheckbox
                    fieldName="alcance_gfsi_bi"
                    checked={editableCheckboxes["alcance_gfsi_bi"]}
                    onChange={updateEditableCheckbox}
                  />
                  <span>
                    BI: Cultivo de plantas (distintas de cereales y legumbres) | Granja; Invernadero; Cuadrilla de
                    cosecha
                  </span>
                </div>
              </td>
              <td style={{ padding: "5px", border: "1px solid #ccc" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                  <EditableCheckbox
                    fieldName="alcance_gfsi_biii"
                    checked={editableCheckboxes["alcance_gfsi_biii"]}
                    onChange={updateEditableCheckbox}
                  />
                  <span>
                    BIII: Manejo de productos vegetales antes del proceso | Cuarto de frío; Almacén en frío; Empaque
                  </span>
                </div>
              </td>
            </tr>
            <tr>
              <td style={{ padding: "5px", border: "1px solid #ccc" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                  <EditableCheckbox
                    fieldName="alcance_gfsi_bii"
                    checked={editableCheckboxes["alcance_gfsi_bii"]}
                    onChange={updateEditableCheckbox}
                  />
                  <span>BII: Cultivo de cereales y legumbres | Granja; Invernadero; Cuadrilla de cosecha</span>
                </div>
              </td>
              <td style={{ padding: "5px", border: "1px solid #ccc" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                  <EditableCheckbox
                    fieldName="alcance_gfsi_cii"
                    checked={editableCheckboxes["alcance_gfsi_cii"]}
                    onChange={updateEditableCheckbox}
                  />
                  <span>CII: Procesamiento de productos vegetales perecederos | Procesadora</span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        <p style={{ fontSize: "9pt", fontStyle: "italic", marginTop: "5px" }}>
          Nota: En caso de que su alcance GFSI no se encuentre en la tabla anterior, favor de comunicarse con CEMA.
        </p>
      </div>

      {/* Sección 4: Sitios de campo */}
      <div style={{ marginBottom: "15px" }}>
        <p style={{ fontWeight: "bold", marginBottom: "10px" }}>
          4. Por favor llene la información sobre los sitios de campo (granja o invernaderos) si aplica:
        </p>

        {[1, 2, 3, 4, 5].map((num) => (
          <div key={num} style={{ marginBottom: "15px", border: "1px solid #ddd", padding: "10px" }}>
            <p style={{ fontWeight: "bold", marginBottom: "10px" }}>Nombre de la granja/ Invernadero ({num}):</p>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <tbody>
                <tr>
                  <td style={{ width: "50%", padding: "5px", border: "1px solid #ccc" }}>
                    Nombre de la granja/ Invernadero ({num}):
                  </td>
                  <td style={{ width: "50%", padding: "5px", border: "1px solid #ccc" }}>
                    <EditableField
                      fieldName={`granja_${num}_nombre`}
                      placeholder="Nombre de la granja/invernadero"
                      value={editableFields[`granja_${num}_nombre`]}
                      onChange={updateEditableField}
                    />
                  </td>
                </tr>
                <tr>
                  <td style={{ padding: "5px", border: "1px solid #ccc" }}>Producto(s) y superficie por producto:</td>
                  <td style={{ padding: "5px", border: "1px solid #ccc" }}>
                    <EditableField
                      fieldName={`granja_${num}_productos`}
                      placeholder="Productos y superficie"
                      value={editableFields[`granja_${num}_productos`]}
                      onChange={updateEditableField}
                      multiline
                    />
                  </td>
                </tr>
                <tr>
                  <td style={{ padding: "5px", border: "1px solid #ccc" }}>Dirección del sitio:</td>
                  <td style={{ padding: "5px", border: "1px solid #ccc" }}>
                    <EditableField
                      fieldName={`granja_${num}_direccion`}
                      placeholder="Dirección"
                      value={editableFields[`granja_${num}_direccion`]}
                      onChange={updateEditableField}
                    />
                  </td>
                </tr>
                <tr>
                  <td style={{ padding: "5px", border: "1px solid #ccc" }}>Coordenadas GPS del sitio:</td>
                  <td style={{ padding: "5px", border: "1px solid #ccc" }}>
                    <EditableField
                      fieldName={`granja_${num}_gps`}
                      placeholder="Coordenadas GPS"
                      value={editableFields[`granja_${num}_gps`]}
                      onChange={updateEditableField}
                    />
                  </td>
                </tr>
                <tr>
                  <td style={{ padding: "5px", border: "1px solid #ccc" }}>
                    Distancia del sitio principal en km. y tiempo del trayecto:
                  </td>
                  <td style={{ padding: "5px", border: "1px solid #ccc" }}>
                    <EditableField
                      fieldName={`granja_${num}_distancia`}
                      placeholder="Distancia y tiempo"
                      value={editableFields[`granja_${num}_distancia`]}
                      onChange={updateEditableField}
                    />
                  </td>
                </tr>
                <tr>
                  <td style={{ padding: "5px", border: "1px solid #ccc" }}>
                    Si los cultivos están bajo invernadero, macrotúnel u otro, por favor detalle cuales y la superficie
                    en hectáreas:
                  </td>
                  <td style={{ padding: "5px", border: "1px solid #ccc" }}>
                    <EditableField
                      fieldName={`granja_${num}_invernadero`}
                      placeholder="Detalles de invernadero"
                      value={editableFields[`granja_${num}_invernadero`]}
                      onChange={updateEditableField}
                      multiline
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        ))}

        <p style={{ fontSize: "9pt", fontStyle: "italic", marginTop: "5px" }}>
          Nota: En caso de tener más de 5 operaciones de Granja/Invernadero, por favor llenar el documento que
          corresponde al FOR-SGI-02 Anexo de la solicitud de certificación.
        </p>
      </div>

      {/* Sección 5: Cuadrillas de cosecha */}
      <div style={{ marginBottom: "15px" }}>
        <p style={{ fontWeight: "bold", marginBottom: "10px" }}>
          5. Por favor llene la información sobre la cuadrilla de cosecha, si aplica:
        </p>

        {[1, 2, 3].map((num) => (
          <div key={num} style={{ marginBottom: "15px", border: "1px solid #ddd", padding: "10px" }}>
            <p style={{ fontWeight: "bold", marginBottom: "10px" }}>Numero o Nombre de Cuadrilla ({num}):</p>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <tbody>
                <tr>
                  <td style={{ width: "50%", padding: "5px", border: "1px solid #ccc" }}>
                    Numero o Nombre de Cuadrilla ({num}):
                  </td>
                  <td style={{ width: "50%", padding: "5px", border: "1px solid #ccc" }}>
                    <EditableField
                      fieldName={`cuadrilla_${num}_nombre`}
                      placeholder="Número o nombre de cuadrilla"
                      value={editableFields[`cuadrilla_${num}_nombre`]}
                      onChange={updateEditableField}
                    />
                  </td>
                </tr>
                <tr>
                  <td style={{ padding: "5px", border: "1px solid #ccc" }}>Numero de trabajadores:</td>
                  <td style={{ padding: "5px", border: "1px solid #ccc" }}>
                    <EditableField
                      fieldName={`cuadrilla_${num}_trabajadores`}
                      placeholder="Número de trabajadores"
                      value={editableFields[`cuadrilla_${num}_trabajadores`]}
                      onChange={updateEditableField}
                    />
                  </td>
                </tr>
                <tr>
                  <td style={{ padding: "5px", border: "1px solid #ccc" }}>Nombre de la Compañía de Cuadrilla:</td>
                  <td style={{ padding: "5px", border: "1px solid #ccc" }}>
                    <EditableField
                      fieldName={`cuadrilla_${num}_compania`}
                      placeholder="Nombre de la compañía"
                      value={editableFields[`cuadrilla_${num}_compania`]}
                      onChange={updateEditableField}
                    />
                  </td>
                </tr>
                <tr>
                  <td style={{ padding: "5px", border: "1px solid #ccc" }}>Dirección:</td>
                  <td style={{ padding: "5px", border: "1px solid #ccc" }}>
                    <EditableField
                      fieldName={`cuadrilla_${num}_direccion`}
                      placeholder="Dirección"
                      value={editableFields[`cuadrilla_${num}_direccion`]}
                      onChange={updateEditableField}
                    />
                  </td>
                </tr>
                <tr>
                  <td style={{ padding: "5px", border: "1px solid #ccc" }}>Coordenadas GPS del sitio:</td>
                  <td style={{ padding: "5px", border: "1px solid #ccc" }}>
                    <EditableField
                      fieldName={`cuadrilla_${num}_gps`}
                      placeholder="Coordenadas GPS"
                      value={editableFields[`cuadrilla_${num}_gps`]}
                      onChange={updateEditableField}
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        ))}

        <p style={{ fontSize: "9pt", fontStyle: "italic", marginTop: "5px" }}>
          Nota: En caso de tener más de 3 operaciones de Cuadrilla de Cosecha, por favor llenar el documento que
          corresponde al FOR-SGI-02 Anexo de la solicitud de certificación.
        </p>
      </div>

      {/* Sección 6: Instalaciones */}
      <div style={{ marginBottom: "15px" }}>
        <p style={{ fontWeight: "bold", marginBottom: "10px" }}>
          6. Por favor llene la información sobre instalaciones (unidad de empaque, procesadora, cuarto frío, centro de
          almacenamiento y distribución) si aplica:
        </p>

        {[1, 2, 3].map((num) => (
          <div key={num} style={{ marginBottom: "15px", border: "1px solid #ddd", padding: "10px" }}>
            <p style={{ fontWeight: "bold", marginBottom: "10px" }}>Nombre de la unidad ({num}):</p>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <tbody>
                <tr>
                  <td style={{ width: "50%", padding: "5px", border: "1px solid #ccc" }}>
                    Nombre de la unidad ({num}):
                  </td>
                  <td style={{ width: "50%", padding: "5px", border: "1px solid #ccc" }}>
                    <EditableField
                      fieldName={`unidad_${num}_nombre`}
                      placeholder="Nombre de la unidad"
                      value={editableFields[`unidad_${num}_nombre`]}
                      onChange={updateEditableField}
                    />
                  </td>
                </tr>
                <tr>
                  <td style={{ padding: "5px", border: "1px solid #ccc" }}>Producto(s):</td>
                  <td style={{ padding: "5px", border: "1px solid #ccc" }}>
                    <EditableField
                      fieldName={`unidad_${num}_productos`}
                      placeholder="Productos"
                      value={editableFields[`unidad_${num}_productos`]}
                      onChange={updateEditableField}
                    />
                  </td>
                </tr>
                <tr>
                  <td style={{ padding: "5px", border: "1px solid #ccc" }}>Dirección del empaque:</td>
                  <td style={{ padding: "5px", border: "1px solid #ccc" }}>
                    <EditableField
                      fieldName={`unidad_${num}_direccion`}
                      placeholder="Dirección"
                      value={editableFields[`unidad_${num}_direccion`]}
                      onChange={updateEditableField}
                    />
                  </td>
                </tr>
                <tr>
                  <td style={{ padding: "5px", border: "1px solid #ccc" }}>Coordenadas GPS de la unidad:</td>
                  <td style={{ padding: "5px", border: "1px solid #ccc" }}>
                    <EditableField
                      fieldName={`unidad_${num}_gps`}
                      placeholder="Coordenadas GPS"
                      value={editableFields[`unidad_${num}_gps`]}
                      onChange={updateEditableField}
                    />
                  </td>
                </tr>
                <tr>
                  <td style={{ padding: "5px", border: "1px solid #ccc" }}>
                    Distancia del sitio principal en km. y tiempo del trayecto:
                  </td>
                  <td style={{ padding: "5px", border: "1px solid #ccc" }}>
                    <EditableField
                      fieldName={`unidad_${num}_distancia`}
                      placeholder="Distancia y tiempo"
                      value={editableFields[`unidad_${num}_distancia`]}
                      onChange={updateEditableField}
                    />
                  </td>
                </tr>
                <tr>
                  <td style={{ padding: "5px", border: "1px solid #ccc" }}>
                    Número de trabajadores fijos y eventuales:
                  </td>
                  <td style={{ padding: "5px", border: "1px solid #ccc" }}>
                    <EditableField
                      fieldName={`unidad_${num}_trabajadores`}
                      placeholder="Número de trabajadores"
                      value={editableFields[`unidad_${num}_trabajadores`]}
                      onChange={updateEditableField}
                    />
                  </td>
                </tr>
                <tr>
                  <td style={{ padding: "5px", border: "1px solid #ccc" }}>Horario de operación:</td>
                  <td style={{ padding: "5px", border: "1px solid #ccc" }}>
                    <EditableField
                      fieldName={`unidad_${num}_horario`}
                      placeholder="Horario de operación"
                      value={editableFields[`unidad_${num}_horario`]}
                      onChange={updateEditableField}
                    />
                  </td>
                </tr>
                <tr>
                  <td style={{ padding: "5px", border: "1px solid #ccc" }}>Área (m2) de construcción:</td>
                  <td style={{ padding: "5px", border: "1px solid #ccc" }}>
                    <EditableField
                      fieldName={`unidad_${num}_area_construccion`}
                      placeholder="Área de construcción"
                      value={editableFields[`unidad_${num}_area_construccion`]}
                      onChange={updateEditableField}
                    />
                  </td>
                </tr>
                <tr>
                  <td style={{ padding: "5px", border: "1px solid #ccc" }}>Área (m2) de refrigeración:</td>
                  <td style={{ padding: "5px", border: "1px solid #ccc" }}>
                    <EditableField
                      fieldName={`unidad_${num}_area_refrigeracion`}
                      placeholder="Área de refrigeración"
                      value={editableFields[`unidad_${num}_area_refrigeracion`]}
                      onChange={updateEditableField}
                    />
                  </td>
                </tr>
                <tr>
                  <td style={{ padding: "5px", border: "1px solid #ccc" }}>Número de líneas de producción:</td>
                  <td style={{ padding: "5px", border: "1px solid #ccc" }}>
                    <EditableField
                      fieldName={`unidad_${num}_lineas_produccion`}
                      placeholder="Número de líneas"
                      value={editableFields[`unidad_${num}_lineas_produccion`]}
                      onChange={updateEditableField}
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        ))}

        <p style={{ fontSize: "9pt", fontStyle: "italic", marginTop: "5px" }}>
          Nota: En caso de tener más de 3 operaciones de unidad de manipulación/almacenamiento, por favor llenar el
          documento que corresponde al FOR-SGI-02 Anexo de la solicitud de certificación.
        </p>
      </div>

      {/* Sección 7: Distribuidor */}
      <div style={{ marginBottom: "15px" }}>
        <p style={{ fontWeight: "bold", marginBottom: "10px" }}>7. Por favor conteste la siguiente información:</p>
        <div style={{ marginBottom: "10px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span>¿Desea agregar a un distribuidor dentro de la aplicación PrimusGFS?</span>
            <div style={{ display: "flex", gap: "20px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                <EditableCheckbox
                  fieldName="distribuidor_si"
                  checked={editableCheckboxes["distribuidor_si"]}
                  onChange={updateEditableCheckbox}
                />
                <span>Sí</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                <EditableCheckbox
                  fieldName="distribuidor_no"
                  checked={editableCheckboxes["distribuidor_no"]}
                  onChange={updateEditableCheckbox}
                />
                <span>No</span>
              </div>
            </div>
          </div>
        </div>

        <p style={{ fontWeight: "bold", marginBottom: "10px" }}>
          En caso de marcar "Sí", llenar la siguiente información
        </p>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <tbody>
            <tr>
              <td style={{ width: "50%", padding: "5px", border: "1px solid #ccc" }}>
                Nombre completo de la persona de contacto del distribuidor:
              </td>
              <td style={{ width: "50%", padding: "5px", border: "1px solid #ccc" }}>
                <EditableField
                  fieldName="distribuidor_contacto"
                  placeholder="Nombre del contacto"
                  value={editableFields["distribuidor_contacto"]}
                  onChange={updateEditableField}
                />
              </td>
            </tr>
            <tr>
              <td style={{ padding: "5px", border: "1px solid #ccc" }}>Correo electrónico:</td>
              <td style={{ padding: "5px", border: "1px solid #ccc" }}>
                <EditableField
                  fieldName="distribuidor_correo"
                  placeholder="Correo electrónico"
                  value={editableFields["distribuidor_correo"]}
                  onChange={updateEditableField}
                />
              </td>
            </tr>
            <tr>
              <td style={{ padding: "5px", border: "1px solid #ccc" }}>Número de teléfono:</td>
              <td style={{ padding: "5px", border: "1px solid #ccc" }}>
                <EditableField
                  fieldName="distribuidor_telefono"
                  placeholder="Teléfono"
                  value={editableFields["distribuidor_telefono"]}
                  onChange={updateEditableField}
                />
              </td>
            </tr>
            <tr>
              <td style={{ padding: "5px", border: "1px solid #ccc" }}>Dirección:</td>
              <td style={{ padding: "5px", border: "1px solid #ccc" }}>
                <EditableField
                  fieldName="distribuidor_direccion"
                  placeholder="Dirección"
                  value={editableFields["distribuidor_direccion"]}
                  onChange={updateEditableField}
                />
              </td>
            </tr>
            <tr>
              <td style={{ padding: "5px", border: "1px solid #ccc" }}>Código postal:</td>
              <td style={{ padding: "5px", border: "1px solid #ccc" }}>
                <EditableField
                  fieldName="distribuidor_cp"
                  placeholder="Código postal"
                  value={editableFields["distribuidor_cp"]}
                  onChange={updateEditableField}
                />
              </td>
            </tr>
            <tr>
              <td style={{ padding: "5px", border: "1px solid #ccc" }}>País:</td>
              <td style={{ padding: "5px", border: "1px solid #ccc" }}>
                <EditableField
                  fieldName="distribuidor_pais"
                  placeholder="País"
                  value={editableFields["distribuidor_pais"]}
                  onChange={updateEditableField}
                />
              </td>
            </tr>
            <tr>
              <td style={{ padding: "5px", border: "1px solid #ccc" }}>Estado:</td>
              <td style={{ padding: "5px", border: "1px solid #ccc" }}>
                <EditableField
                  fieldName="distribuidor_estado"
                  placeholder="Estado"
                  value={editableFields["distribuidor_estado"]}
                  onChange={updateEditableField}
                />
              </td>
            </tr>
            <tr>
              <td style={{ padding: "5px", border: "1px solid #ccc" }}>Ciudad:</td>
              <td style={{ padding: "5px", border: "1px solid #ccc" }}>
                <EditableField
                  fieldName="distribuidor_ciudad"
                  placeholder="Ciudad"
                  value={editableFields["distribuidor_ciudad"]}
                  onChange={updateEditableField}
                />
              </td>
            </tr>
          </tbody>
        </table>

        <p style={{ fontSize: "9pt", fontStyle: "italic", marginTop: "5px" }}>
          NOTA: En caso de que SI desee agregar un distribuidor tenga en cuenta aparecerá en el reporte final de
          auditoría y en los documentos generados por la plataforma.
        </p>
      </div>
    </SectionBase>
  )
}
