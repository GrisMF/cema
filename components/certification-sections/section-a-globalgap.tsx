"use client"
import React from "react"
import { SectionBase } from "./section-base"
import { EditableField, EditableCheckbox } from "./editable-fields"

interface SectionAProps {
  datosGenerales?: any
  datosGlobalGAP?: any
  esquemas?: string[]
  editableFields: Record<string, string>
  updateEditableField: (fieldName: string, value: string) => void
  editableCheckboxes: Record<string, boolean>
  updateEditableCheckbox: (fieldName: string, checked: boolean) => void
}

export function SectionAGlobalGAP({
  datosGenerales,
  datosGlobalGAP,
  esquemas,
  editableFields,
  updateEditableField,
  editableCheckboxes,
  updateEditableCheckbox,
}: SectionAProps) {
  if (!esquemas?.includes("globalgap") && !editableCheckboxes["norma_globalgap"]) {
    return null
  }

  // Función para renderizar una fila de mes para cada producto
  const renderMonthRow = (productIndex: number) => {
    const months = ["ENE", "FEB", "MAR", "ABR", "MAY", "JUN", "JUL", "AGO", "SEP", "OCT", "NOV", "DIC"]
    return (
      <tr>
        <td style={{ padding: "5px", border: "1px solid #ccc" }}>
          <EditableField
            fieldName={`producto_${productIndex}_nombre`}
            placeholder={`Producto ${productIndex}`}
            value={editableFields[`producto_${productIndex}_nombre`] || ""}
            onChange={updateEditableField}
          />
        </td>
        {months.map((month, idx) => (
          <td key={idx} style={{ padding: "5px", border: "1px solid #ccc", textAlign: "center" }}>
            <EditableCheckbox
              fieldName={`producto_${productIndex}_mes_${idx}`}
              checked={editableCheckboxes[`producto_${productIndex}_mes_${idx}`]}
              onChange={updateEditableCheckbox}
              style={{ margin: "0 auto" }}
            />
          </td>
        ))}
      </tr>
    )
  }

  return (
    <SectionBase title="SECCIÓN A: GLOBALG.A.P.">
      {/* Sección para certificación de transferencia */}
      <div style={{ marginBottom: "15px" }}>
        <p style={{ fontWeight: "bold", marginBottom: "10px" }}>
          Para aquellas empresas que apliquen para certificación de transferencia RESPONDA LAS SIGUIENTES PREGUNTAS:
        </p>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <tbody>
            <tr>
              <td style={{ width: "40%", padding: "5px", border: "1px solid #ccc" }}>
                Número de certificado (GGN, CoC, ID PrimusGFS):
              </td>
              <td style={{ width: "60%", padding: "5px", border: "1px solid #ccc" }}>
                <EditableField
                  fieldName="numero_certificado"
                  placeholder="Número de certificado"
                  value={editableFields["numero_certificado"] || ""}
                  onChange={updateEditableField}
                />
              </td>
            </tr>
            <tr>
              <td style={{ padding: "5px", border: "1px solid #ccc" }}>Norma:</td>
              <td style={{ padding: "5px", border: "1px solid #ccc" }}>
                <EditableField
                  fieldName="norma_transferencia"
                  placeholder="Norma"
                  value={editableFields["norma_transferencia"] || ""}
                  onChange={updateEditableField}
                />
              </td>
            </tr>
            <tr>
              <td style={{ padding: "5px", border: "1px solid #ccc" }}>Fecha de validez:</td>
              <td style={{ padding: "5px", border: "1px solid #ccc" }}>
                <EditableField
                  fieldName="fecha_validez"
                  placeholder="Fecha de validez"
                  value={editableFields["fecha_validez"] || ""}
                  onChange={updateEditableField}
                />
              </td>
            </tr>
            <tr>
              <td style={{ padding: "5px", border: "1px solid #ccc" }}>Organismo de certificación:</td>
              <td style={{ padding: "5px", border: "1px solid #ccc" }}>
                <EditableField
                  fieldName="organismo_certificacion"
                  placeholder="Organismo de certificación"
                  value={editableFields["organismo_certificacion"] || ""}
                  onChange={updateEditableField}
                />
              </td>
            </tr>
            <tr>
              <td style={{ padding: "5px", border: "1px solid #ccc" }}>¿Están activos sus certificados?:</td>
              <td style={{ padding: "5px", border: "1px solid #ccc" }}>
                <div style={{ display: "flex", gap: "20px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                    <EditableCheckbox
                      fieldName="certificados_activos_si"
                      checked={editableCheckboxes["certificados_activos_si"]}
                      onChange={updateEditableCheckbox}
                    />
                    <span>Sí</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                    <EditableCheckbox
                      fieldName="certificados_activos_no"
                      checked={editableCheckboxes["certificados_activos_no"]}
                      onChange={updateEditableCheckbox}
                    />
                    <span>No</span>
                  </div>
                </div>
              </td>
            </tr>
            <tr>
              <td style={{ padding: "5px", border: "1px solid #ccc" }}>
                Detalle el número de no conformidades menores y mayores detectadas en la última auditoría:
              </td>
              <td style={{ padding: "5px", border: "1px solid #ccc" }}>
                NC mayores:
                <EditableField
                  fieldName="nc_mayores"
                  placeholder=""
                  style={{ width: "50px", marginRight: "10px" }}
                  value={editableFields["nc_mayores"] || ""}
                  onChange={updateEditableField}
                />
                NC menores:
                <EditableField
                  fieldName="nc_menores"
                  placeholder=""
                  style={{ width: "50px" }}
                  value={editableFields["nc_menores"] || ""}
                  onChange={updateEditableField}
                />
              </td>
            </tr>
            <tr>
              <td style={{ padding: "5px", border: "1px solid #ccc" }}>En caso afirmativo, proporcione detalles:</td>
              <td style={{ padding: "5px", border: "1px solid #ccc" }}>
                <EditableField
                  fieldName="detalles_nc"
                  placeholder="Proporcione detalles"
                  value={editableFields["detalles_nc"] || ""}
                  onChange={updateEditableField}
                  multiline={true}
                  rows={3}
                />
              </td>
            </tr>
          </tbody>
        </table>
        <p style={{ fontSize: "9pt", fontStyle: "italic", marginTop: "5px" }}>
          Nota: Si no proporciona dicha información, no podremos realizar la transferencia. Considere que CEMA
          comprobará a validez de la información con su organismo de certificación actual.
        </p>
      </div>

      {/* Continuación detalles de la empresa */}
      <div style={{ marginBottom: "15px" }}>
        <p style={{ fontWeight: "bold", marginBottom: "10px", textAlign: "center" }}>
          CONTINUACIÓN DETALLES DE LA EMPRESA:
        </p>

        {/* Sección 4: Productos a certificar */}
        <p style={{ fontWeight: "bold", marginBottom: "10px" }}>
          4. Por favor indique los productos a certificar con el nombre científico y el país (es) destino por producto
          (utilice la nomenclatura ISO):
        </p>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <tbody>
            <tr>
              <td style={{ width: "25%", padding: "5px", border: "1px solid #ccc" }}>Producto / nombre científico</td>
              <td style={{ width: "25%", padding: "5px", border: "1px solid #ccc" }}>País (es)</td>
              <td style={{ width: "25%", padding: "5px", border: "1px solid #ccc" }}>Producto / nombre científico</td>
              <td style={{ width: "25%", padding: "5px", border: "1px solid #ccc" }}>País (es)</td>
            </tr>
            {[...Array(5)].map((_, i) => (
              <tr key={i}>
                <td style={{ padding: "5px", border: "1px solid #ccc" }}>
                  <EditableField
                    fieldName={`producto_${i + 1}`}
                    placeholder={`${i + 1}.`}
                    value={editableFields[`producto_${i + 1}`] || ""}
                    onChange={updateEditableField}
                  />
                </td>
                <td style={{ padding: "5px", border: "1px solid #ccc" }}>
                  <EditableField
                    fieldName={`pais_producto_${i + 1}`}
                    placeholder="País(es)"
                    value={editableFields[`pais_producto_${i + 1}`] || ""}
                    onChange={updateEditableField}
                  />
                </td>
                <td style={{ padding: "5px", border: "1px solid #ccc" }}>
                  <EditableField
                    fieldName={`producto_${i + 6}`}
                    placeholder={`${i + 6}.`}
                    value={editableFields[`producto_${i + 6}`] || ""}
                    onChange={updateEditableField}
                  />
                </td>
                <td style={{ padding: "5px", border: "1px solid #ccc" }}>
                  <EditableField
                    fieldName={`pais_producto_${i + 6}`}
                    placeholder="País(es)"
                    value={editableFields[`pais_producto_${i + 6}`] || ""}
                    onChange={updateEditableField}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Sección 5: Meses de cosecha/producción */}
      <div style={{ marginBottom: "15px" }}>
        <p style={{ fontWeight: "bold", marginBottom: "10px" }}>
          5. Por favor, marque los meses de cosecha/producción para cada producto a certificar:
        </p>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={{ padding: "5px", border: "1px solid #ccc", backgroundColor: "#f0f0f0" }}>Productos</th>
              <th style={{ padding: "5px", border: "1px solid #ccc", backgroundColor: "#f0f0f0" }}>ENE</th>
              <th style={{ padding: "5px", border: "1px solid #ccc", backgroundColor: "#f0f0f0" }}>FEB</th>
              <th style={{ padding: "5px", border: "1px solid #ccc", backgroundColor: "#f0f0f0" }}>MAR</th>
              <th style={{ padding: "5px", border: "1px solid #ccc", backgroundColor: "#f0f0f0" }}>ABR</th>
              <th style={{ padding: "5px", border: "1px solid #ccc", backgroundColor: "#f0f0f0" }}>MAY</th>
              <th style={{ padding: "5px", border: "1px solid #ccc", backgroundColor: "#f0f0f0" }}>JUN</th>
              <th style={{ padding: "5px", border: "1px solid #ccc", backgroundColor: "#f0f0f0" }}>JUL</th>
              <th style={{ padding: "5px", border: "1px solid #ccc", backgroundColor: "#f0f0f0" }}>AGO</th>
              <th style={{ padding: "5px", border: "1px solid #ccc", backgroundColor: "#f0f0f0" }}>SEP</th>
              <th style={{ padding: "5px", border: "1px solid #ccc", backgroundColor: "#f0f0f0" }}>OCT</th>
              <th style={{ padding: "5px", border: "1px solid #ccc", backgroundColor: "#f0f0f0" }}>NOV</th>
              <th style={{ padding: "5px", border: "1px solid #ccc", backgroundColor: "#f0f0f0" }}>DIC</th>
            </tr>
          </thead>
          <tbody>{[...Array(10)].map((_, i) => renderMonthRow(i + 1))}</tbody>
        </table>
      </div>

      {/* Sección 6: Subcontratistas */}
      <div style={{ marginBottom: "15px" }}>
        <p style={{ fontWeight: "bold", marginBottom: "10px" }}>
          6. Subcontratistas ¿alguna de sus actividades de producción/procesamiento/manipulación son realizadas por
          subcontratistas? En caso afirmativo, por favor indíquelo a continuación:
        </p>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={{ padding: "5px", border: "1px solid #ccc", backgroundColor: "#f0f0f0" }}>Subcontratista</th>
              <th style={{ padding: "5px", border: "1px solid #ccc", backgroundColor: "#f0f0f0" }}>Dirección y país</th>
              <th style={{ padding: "5px", border: "1px solid #ccc", backgroundColor: "#f0f0f0" }}>
                Actividad / Proceso
              </th>
              <th style={{ padding: "5px", border: "1px solid #ccc", backgroundColor: "#f0f0f0" }}>
                Certificado (GLOBALG.A.P., ISO, etc.)
              </th>
            </tr>
          </thead>
          <tbody>
            {[...Array(5)].map((_, i) => (
              <tr key={i}>
                <td style={{ padding: "5px", border: "1px solid #ccc" }}>
                  <EditableField
                    fieldName={`subcontratista_${i + 1}`}
                    placeholder={`${i + 1}.-`}
                    value={editableFields[`subcontratista_${i + 1}`] || ""}
                    onChange={updateEditableField}
                  />
                </td>
                <td style={{ padding: "5px", border: "1px solid #ccc" }}>
                  <EditableField
                    fieldName={`direccion_subcontratista_${i + 1}`}
                    placeholder="Dirección y país"
                    value={editableFields[`direccion_subcontratista_${i + 1}`] || ""}
                    onChange={updateEditableField}
                  />
                </td>
                <td style={{ padding: "5px", border: "1px solid #ccc" }}>
                  <EditableField
                    fieldName={`actividad_subcontratista_${i + 1}`}
                    placeholder="Actividad / Proceso"
                    value={editableFields[`actividad_subcontratista_${i + 1}`] || ""}
                    onChange={updateEditableField}
                  />
                </td>
                <td style={{ padding: "5px", border: "1px solid #ccc" }}>
                  <EditableField
                    fieldName={`certificado_subcontratista_${i + 1}`}
                    placeholder="Certificado"
                    value={editableFields[`certificado_subcontratista_${i + 1}`] || ""}
                    onChange={updateEditableField}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Sección 7: Fechas restringidas */}
      <div style={{ marginBottom: "15px" }}>
        <p style={{ fontWeight: "bold", marginBottom: "10px" }}>
          7. Por favor indique la información referente a fechas restringidas:
        </p>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <tbody>
            <tr>
              <td style={{ width: "50%", padding: "5px", border: "1px solid #ccc" }}>
                Fechas restringidas: es un periodo de tiempo (una semana) en que no podrá recibir una auditoria de tipo
                no anunciada, debido a ciertas razones, por ejemplo: temporada baja de operaciones, razones comerciales
                válidas, etc.
              </td>
              <td style={{ width: "50%", padding: "5px", border: "1px solid #ccc" }}>
                <EditableField
                  fieldName="fechas_restringidas"
                  placeholder="Fechas restringidas"
                  value={editableFields["fechas_restringidas"] || ""}
                  onChange={updateEditableField}
                  multiline={true}
                  rows={3}
                />
              </td>
            </tr>
            <tr>
              <td style={{ padding: "5px", border: "1px solid #ccc" }}>Proporcione detalles de la razón:</td>
              <td style={{ padding: "5px", border: "1px solid #ccc" }}>
                <EditableField
                  fieldName="razon_fechas_restringidas"
                  placeholder="Detalles de la razón"
                  value={editableFields["razon_fechas_restringidas"] || ""}
                  onChange={updateEditableField}
                  multiline={true}
                  rows={3}
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Sección 1: Opción de certificación */}
      <div style={{ marginBottom: "15px" }}>
        <p style={{ fontWeight: "bold", marginBottom: "10px" }}>
          1. Por favor seleccione la opción de certificación que le será proporcionado:
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "5px", width: "48%" }}>
            <EditableCheckbox
              fieldName="opcion1_individual"
              defaultChecked={datosGlobalGAP?.opcionCertificacion === "opcion1_individual"}
              checked={editableCheckboxes["opcion1_individual"]}
              onChange={updateEditableCheckbox}
            />
            <span>IFA Opción 1 – Productor Individual</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "5px", width: "48%" }}>
            <EditableCheckbox
              fieldName="opcion1_multisitio_sgc"
              defaultChecked={datosGlobalGAP?.opcionCertificacion === "opcion1_multisitio_sgc"}
              checked={editableCheckboxes["opcion1_multisitio_sgc"]}
              onChange={updateEditableCheckbox}
            />
            <span>IFA Opción 1 – Productor Individual multisitio con SGC</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "5px", width: "48%" }}>
            <EditableCheckbox
              fieldName="opcion1_multisitio_sin_sgc"
              defaultChecked={datosGlobalGAP?.opcionCertificacion === "opcion1_multisitio_sin_sgc"}
              checked={editableCheckboxes["opcion1_multisitio_sin_sgc"]}
              onChange={updateEditableCheckbox}
            />
            <span>IFA Opción 1 – Productor Individual multisitio sin SGC</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "5px", width: "48%" }}>
            <EditableCheckbox
              fieldName="opcion2_grupo"
              defaultChecked={datosGlobalGAP?.opcionCertificacion === "opcion2_grupo"}
              checked={editableCheckboxes["opcion2_grupo"]}
              onChange={updateEditableCheckbox}
            />
            <span>IFA Opción 2 – Grupo de Productores con SGC</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "5px", width: "48%" }}>
            <EditableCheckbox
              fieldName="cadena_custodia"
              defaultChecked={datosGlobalGAP?.opcionCertificacion === "cadena_custodia"}
              checked={editableCheckboxes["cadena_custodia"]}
              onChange={updateEditableCheckbox}
            />
            <span>Cadena de Custodia (CoC) – v6.1</span>
          </div>
        </div>
      </div>

      {/* Sección 2: Alcance y versión */}
      <div style={{ marginBottom: "15px" }}>
        <p style={{ fontWeight: "bold", marginBottom: "10px" }}>
          2. Por favor seleccione el alcance y la versión de certificación:
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "5px", width: "48%" }}>
            <EditableCheckbox
              fieldName="frutas_vegetales"
              defaultChecked={datosGlobalGAP?.alcances?.includes("frutas_vegetales")}
              checked={editableCheckboxes["frutas_vegetales"]}
              onChange={updateEditableCheckbox}
            />
            <span>IFA – Frutas y vegetales</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "5px", width: "48%" }}>
            <EditableCheckbox
              fieldName="flores_ornamentales"
              defaultChecked={datosGlobalGAP?.alcances?.includes("flores_ornamentales")}
              checked={editableCheckboxes["flores_ornamentales"]}
              onChange={updateEditableCheckbox}
            />
            <span>IFA – Flores y ornamentales</span>
          </div>
        </div>
      </div>

      {/* Sección 3: Alcances de certificación */}
      <div style={{ marginBottom: "15px" }}>
        <p style={{ fontWeight: "bold", marginBottom: "10px" }}>
          3. Por favor seleccione los alcances de la certificación que será evaluado:
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "5px", width: "48%" }}>
            <EditableCheckbox
              fieldName="grasp"
              defaultChecked={datosGlobalGAP?.addons?.includes("grasp")}
              checked={editableCheckboxes["grasp"]}
              onChange={updateEditableCheckbox}
            />
            <span>Add-on GRASP</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "5px", width: "48%" }}>
            <EditableCheckbox
              fieldName="fsma_psr"
              defaultChecked={datosGlobalGAP?.addons?.includes("fsma_psr")}
              checked={editableCheckboxes["fsma_psr"]}
              onChange={updateEditableCheckbox}
            />
            <span>Add-on FSMA PSR</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "5px", width: "48%" }}>
            <EditableCheckbox
              fieldName="spring"
              defaultChecked={datosGlobalGAP?.addons?.includes("spring")}
              checked={editableCheckboxes["spring"]}
              onChange={updateEditableCheckbox}
            />
            <span>Add-on SPRING</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "5px", width: "48%" }}>
            <EditableCheckbox
              fieldName="ah_dll_grow"
              checked={editableCheckboxes["ah_dll_grow"]}
              onChange={updateEditableCheckbox}
            />
            <span>AH-DLL GROW Add-on</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "5px", width: "48%" }}>
            <EditableCheckbox
              fieldName="tr4_biosecurity"
              defaultChecked={datosGlobalGAP?.addons?.includes("tr4_biosecurity")}
              checked={editableCheckboxes["tr4_biosecurity"]}
              onChange={updateEditableCheckbox}
            />
            <span>TR4 Biosecurity</span>
          </div>
        </div>
      </div>

      {/* Evaluación de sitio */}
      <div style={{ marginBottom: "15px" }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "5px", width: "48%" }}>
            <EditableCheckbox
              fieldName="evaluacion_sitios"
              checked={editableCheckboxes["evaluacion_sitios"]}
              onChange={updateEditableCheckbox}
            />
            <span>Evaluación de sitio(s) de campo:</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "5px", width: "48%" }}>
            <EditableCheckbox
              fieldName="incluye_empaque_propio"
              checked={editableCheckboxes["incluye_empaque_propio"]}
              onChange={updateEditableCheckbox}
            />
            <span>Incluye empaque de manipulación de producto propio:</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "5px", width: "48%" }}>
            <EditableCheckbox
              fieldName="incluye_cosecha"
              checked={editableCheckboxes["incluye_cosecha"]}
              onChange={updateEditableCheckbox}
            />
            <span>Incluye cosecha de producto:</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "5px", width: "48%" }}>
            <EditableCheckbox
              fieldName="incluye_empacado_campo"
              checked={editableCheckboxes["incluye_empacado_campo"]}
              onChange={updateEditableCheckbox}
            />
            <span>Incluye empacado de producto en campo:</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "5px", width: "48%" }}>
            <EditableCheckbox
              fieldName="excluye_cosecha"
              checked={editableCheckboxes["excluye_cosecha"]}
              onChange={updateEditableCheckbox}
            />
            <span>Excluye cosecha de producto:</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "5px", width: "48%" }}>
            <EditableCheckbox
              fieldName="incluye_empaque_rentado"
              checked={editableCheckboxes["incluye_empaque_rentado"]}
              onChange={updateEditableCheckbox}
            />
            <span>Incluye empaque de manipulación de producto rentado:</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "5px", width: "48%" }}>
            <EditableCheckbox
              fieldName="excluye_manipulacion"
              checked={editableCheckboxes["excluye_manipulacion"]}
              onChange={updateEditableCheckbox}
            />
            <span>Excluye manipulación de producto:</span>
          </div>
        </div>
        <p style={{ fontSize: "9pt", fontStyle: "italic", marginTop: "5px" }}>
          Durante el registro, si se desea excluir la cosecha del producto, el productor deberá tener un contrato con el
          comprador que establezca que el cosechador / comprador hará lo establecido en el Reglamento General "Reglas
          para Cultivos" punto 2.4, inciso (iii), (v) y (vi).
        </p>
      </div>

      {/* Sección 4: Reglas de acceso a datos */}
      <div style={{ marginBottom: "15px" }}>
        <p style={{ fontWeight: "bold", marginBottom: "10px" }}>
          4. De acuerdo a los requisitos del documento de las Reglas de Acceso a Datos, (que se localiza en
          www.globalgap.org/es/documents) por favor seleccione la opción deseada:
        </p>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <tbody>
            <tr>
              <td style={{ width: "70%", padding: "5px", border: "1px solid #ccc" }}>
                El productor se compromete a permitir el acceso a la dirección de su empresa por parte del grupo
              </td>
              <td style={{ width: "30%", padding: "5px", border: "1px solid #ccc" }}>
                <div style={{ display: "flex", gap: "20px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                    <EditableCheckbox
                      fieldName="permite_acceso_si"
                      checked={editableCheckboxes["permite_acceso_si"]}
                      onChange={updateEditableCheckbox}
                    />
                    <span>Sí</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                    <EditableCheckbox
                      fieldName="permite_acceso_no"
                      checked={editableCheckboxes["permite_acceso_no"]}
                      onChange={updateEditableCheckbox}
                    />
                    <span>No</span>
                  </div>
                </div>
              </td>
            </tr>
            <tr>
              <td style={{ padding: "5px", border: "1px solid #ccc" }}>
                El productor no permite el acceso a la dirección de su empresa para el grupo público de acceso
              </td>
              <td style={{ padding: "5px", border: "1px solid #ccc" }}>
                <div style={{ display: "flex", gap: "20px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                    <EditableCheckbox
                      fieldName="no_permite_acceso_si"
                      checked={editableCheckboxes["no_permite_acceso_si"]}
                      onChange={updateEditableCheckbox}
                    />
                    <span>Sí</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                    <EditableCheckbox
                      fieldName="no_permite_acceso_no"
                      checked={editableCheckboxes["no_permite_acceso_no"]}
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

      {/* Sección 5: Sitios de campo */}
      <div style={{ marginBottom: "15px" }}>
        <p style={{ fontWeight: "bold", marginBottom: "10px" }}>
          5. Por favor llene la información sobre los sitios de campo (granja o invernaderos) si aplica:
        </p>
        <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "10px" }}>
          <tbody>
            {[...Array(4)].map((_, index) => (
              <React.Fragment key={index}>
                <tr>
                  <td
                    style={{
                      width: "40%",
                      padding: "5px",
                      border: "1px solid #ccc",
                      backgroundColor: "#f0f0f0",
                    }}
                  >
                    Nombre de la granja/ Invernadero ({index + 1}):
                  </td>
                  <td style={{ width: "60%", padding: "5px", border: "1px solid #ccc" }}>
                    <EditableField
                      fieldName={`sitio_${index + 1}_nombre`}
                      placeholder={`Nombre del sitio ${index + 1}`}
                      value={
                        datosGlobalGAP?.sitios?.[index]?.tipo === "granja"
                          ? `Granja ${index + 1}`
                          : datosGlobalGAP?.sitios?.[index]?.tipo === "invernadero"
                            ? `Invernadero ${index + 1}`
                            : editableFields[`sitio_${index + 1}_nombre`] || ""
                      }
                      onChange={updateEditableField}
                    />
                  </td>
                </tr>
                <tr>
                  <td style={{ padding: "5px", border: "1px solid #ccc", backgroundColor: "#f0f0f0" }}>
                    Producto(s) y superficie por producto:
                  </td>
                  <td style={{ padding: "5px", border: "1px solid #ccc" }}>
                    <EditableField
                      fieldName={`sitio_${index + 1}_superficie`}
                      placeholder="Producto(s) y superficie"
                      value={
                        datosGlobalGAP?.sitios?.[index]?.hectareas
                          ? `${datosGlobalGAP?.sitios?.[index]?.hectareas} hectáreas`
                          : editableFields[`sitio_${index + 1}_superficie`] || ""
                      }
                      onChange={updateEditableField}
                    />
                  </td>
                </tr>
                <tr>
                  <td style={{ padding: "5px", border: "1px solid #ccc", backgroundColor: "#f0f0f0" }}>
                    Dirección del sitio:
                  </td>
                  <td style={{ padding: "5px", border: "1px solid #ccc" }}>
                    <EditableField
                      fieldName={`sitio_${index + 1}_direccion`}
                      placeholder="Dirección del sitio"
                      value={editableFields[`sitio_${index + 1}_direccion`] || ""}
                      onChange={updateEditableField}
                    />
                  </td>
                </tr>
                <tr>
                  <td style={{ padding: "5px", border: "1px solid #ccc", backgroundColor: "#f0f0f0" }}>
                    Coordenadas GPS del sitio:
                  </td>
                  <td style={{ padding: "5px", border: "1px solid #ccc" }}>
                    <EditableField
                      fieldName={`sitio_${index + 1}_coordenadas`}
                      placeholder="Coordenadas GPS"
                      value={editableFields[`sitio_${index + 1}_coordenadas`] || ""}
                      onChange={updateEditableField}
                    />
                  </td>
                </tr>
                <tr>
                  <td style={{ padding: "5px", border: "1px solid #ccc", backgroundColor: "#f0f0f0" }}>
                    Distancia del sitio principal en km. y tiempo del trayecto:
                  </td>
                  <td style={{ padding: "5px", border: "1px solid #ccc" }}>
                    <EditableField
                      fieldName={`sitio_${index + 1}_distancia`}
                      placeholder="Distancia y tiempo"
                      value={editableFields[`sitio_${index + 1}_distancia`] || ""}
                      onChange={updateEditableField}
                    />
                  </td>
                </tr>
                <tr>
                  <td style={{ padding: "5px", border: "1px solid #ccc", backgroundColor: "#f0f0f0" }}>
                    Si los cultivos están bajo invernadero, macrotúnel u otro, por favor detalle cuales y la superficie
                    en hectáreas:
                  </td>
                  <td style={{ padding: "5px", border: "1px solid #ccc" }}>
                    <EditableField
                      fieldName={`sitio_${index + 1}_invernadero`}
                      placeholder="Detalles de invernadero"
                      value={
                        datosGlobalGAP?.sitios?.[index]?.tipo === "invernadero"
                          ? `${datosGlobalGAP?.sitios?.[index]?.hectareas} hectáreas`
                          : editableFields[`sitio_${index + 1}_invernadero`] || ""
                      }
                      onChange={updateEditableField}
                    />
                  </td>
                </tr>
                <tr>
                  <td style={{ padding: "5px", border: "1px solid #ccc", backgroundColor: "#f0f0f0" }}>
                    ¿La finca es familiar? (Si/No):
                  </td>
                  <td style={{ padding: "5px", border: "1px solid #ccc" }}>
                    <EditableField
                      fieldName={`sitio_${index + 1}_finca_familiar`}
                      placeholder="Si/No"
                      value={editableFields[`sitio_${index + 1}_finca_familiar`] || ""}
                      onChange={updateEditableField}
                    />
                  </td>
                </tr>
                <tr>
                  <td style={{ padding: "5px", border: "1px solid #ccc", backgroundColor: "#f0f0f0" }}>
                    No. de trabajadores fijos y eventuales:
                  </td>
                  <td style={{ padding: "5px", border: "1px solid #ccc" }}>
                    <EditableField
                      fieldName={`sitio_${index + 1}_trabajadores`}
                      placeholder="Número de trabajadores"
                      value={editableFields[`sitio_${index + 1}_trabajadores`] || ""}
                      onChange={updateEditableField}
                    />
                  </td>
                </tr>
                <tr>
                  <td style={{ padding: "5px", border: "1px solid #ccc", backgroundColor: "#f0f0f0" }}>
                    Si se va a certificar en versión SPRING; Cantidad de agua usada en m³/año por cada producto a
                    certificar:
                  </td>
                  <td style={{ padding: "5px", border: "1px solid #ccc" }}>
                    <EditableField
                      fieldName={`sitio_${index + 1}_agua_usada`}
                      placeholder="Cantidad de agua"
                      value={editableFields[`sitio_${index + 1}_agua_usada`] || ""}
                      onChange={updateEditableField}
                    />
                  </td>
                </tr>
                {index < 3 && (
                  <tr>
                    <td colSpan={2} style={{ height: "20px" }}></td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
        <p style={{ fontSize: "9pt", fontStyle: "italic" }}>
          Nota: En caso de tener más de 4 sitios de producción, por favor llenar el documento que corresponde al
          FOR-SGI-02 Anexo de la solicitud de certificación.
        </p>
        <p style={{ fontSize: "9pt", fontStyle: "italic" }}>
          Nota: Para Opción 2 – Grupo de Productores, por favor llenar el documento correspondiente al FOR-SGI03 Anexo
          de la solicitud de certificación.
        </p>
      </div>

      {/* Sección 6: Información adicional */}
      <div style={{ marginBottom: "15px" }}>
        <p style={{ fontWeight: "bold", marginBottom: "10px" }}>6. Por favor llene la siguiente información:</p>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <tbody>
            <tr>
              <td style={{ width: "70%", padding: "5px", border: "1px solid #ccc" }}>
                Aparte de los ranchos/fincas que se incluyen en la certificación, ¿tienen más ranchos/fincas de los
                mismos cultivos que no se van a certificar?:
              </td>
              <td style={{ width: "30%", padding: "5px", border: "1px solid #ccc" }}>
                <div style={{ display: "flex", gap: "20px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                    <EditableCheckbox
                      fieldName="mas_ranchos_si"
                      checked={editableCheckboxes["mas_ranchos_si"]}
                      onChange={updateEditableCheckbox}
                    />
                    <span>Sí</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                    <EditableCheckbox
                      fieldName="mas_ranchos_no"
                      checked={editableCheckboxes["mas_ranchos_no"]}
                      onChange={updateEditableCheckbox}
                    />
                    <span>No</span>
                  </div>
                </div>
              </td>
            </tr>
            <tr>
              <td style={{ padding: "5px", border: "1px solid #ccc" }}>En caso de sí, diga cuales por favor:</td>
              <td style={{ padding: "5px", border: "1px solid #ccc" }}>
                <EditableField
                  fieldName="cuales_ranchos"
                  placeholder="Indique cuáles"
                  value={editableFields["cuales_ranchos"] || ""}
                  onChange={updateEditableField}
                  multiline={true}
                  rows={2}
                />
              </td>
            </tr>
            <tr>
              <td style={{ padding: "5px", border: "1px solid #ccc" }}>
                ¿Todos los sitios de producción donde el producto o los productos incluidos en el alcance de la
                certificación GLOBALG.A.P. son propios de la entidad legal?
              </td>
              <td style={{ padding: "5px", border: "1px solid #ccc" }}>
                <div style={{ display: "flex", gap: "20px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                    <EditableCheckbox
                      fieldName="sitios_propios_si"
                      checked={editableCheckboxes["sitios_propios_si"]}
                      onChange={updateEditableCheckbox}
                    />
                    <span>Sí</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                    <EditableCheckbox
                      fieldName="sitios_propios_no"
                      checked={editableCheckboxes["sitios_propios_no"]}
                      onChange={updateEditableCheckbox}
                    />
                    <span>No</span>
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        <p style={{ fontSize: "9pt", fontStyle: "italic", marginTop: "5px" }}>
          Para los sitios de producción que no pertenezcan a la entidad legal, deberá de existir un contrato de
          arrendamiento que incluya lo estipulado en el Reglamento General Parte I – Requisitos generales de la versión
          vigente para el alcance solicitado punto 4.2 "Registro", inciso j), numeral (ii).
        </p>
      </div>

      {/* Sección 7: Instalaciones - Unidades de empaque/manipulación */}
      <div style={{ marginBottom: "15px" }}>
        <p style={{ fontWeight: "bold", marginBottom: "10px" }}>
          7. Por favor llene la información sobre instalaciones (unidad de empaque, cuarto frío, cadena de custodia) si
          aplica:
        </p>

        {/* Unidades de empaque/manipulación */}
        {[...Array(4)].map((_, index) => (
          <div key={index} style={{ marginBottom: "20px" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <tbody>
                <tr>
                  <td style={{ width: "40%", padding: "5px", border: "1px solid #ccc", backgroundColor: "#f0f0f0" }}>
                    Nombre de la unidad ({index + 1}):
                  </td>
                  <td style={{ width: "60%", padding: "5px", border: "1px solid #ccc" }}>
                    <EditableField
                      fieldName={`unidad_${index + 1}_nombre`}
                      placeholder={`Nombre de la unidad ${index + 1}`}
                      value={editableFields[`unidad_${index + 1}_nombre`] || ""}
                      onChange={updateEditableField}
                    />
                  </td>
                </tr>
                <tr>
                  <td style={{ padding: "5px", border: "1px solid #ccc", backgroundColor: "#f0f0f0" }}>Producto(s):</td>
                  <td style={{ padding: "5px", border: "1px solid #ccc" }}>
                    <EditableField
                      fieldName={`unidad_${index + 1}_productos`}
                      placeholder="Producto(s)"
                      value={editableFields[`unidad_${index + 1}_productos`] || ""}
                      onChange={updateEditableField}
                    />
                  </td>
                </tr>
                <tr>
                  <td style={{ padding: "5px", border: "1px solid #ccc", backgroundColor: "#f0f0f0" }}>
                    Dirección del empaque:
                  </td>
                  <td style={{ padding: "5px", border: "1px solid #ccc" }}>
                    <EditableField
                      fieldName={`unidad_${index + 1}_direccion`}
                      placeholder="Dirección del empaque"
                      value={editableFields[`unidad_${index + 1}_direccion`] || ""}
                      onChange={updateEditableField}
                    />
                  </td>
                </tr>
                <tr>
                  <td style={{ padding: "5px", border: "1px solid #ccc", backgroundColor: "#f0f0f0" }}>
                    Coordenadas GPS de la unidad:
                  </td>
                  <td style={{ padding: "5px", border: "1px solid #ccc" }}>
                    <EditableField
                      fieldName={`unidad_${index + 1}_coordenadas`}
                      placeholder="Coordenadas GPS"
                      value={editableFields[`unidad_${index + 1}_coordenadas`] || ""}
                      onChange={updateEditableField}
                    />
                  </td>
                </tr>
                <tr>
                  <td style={{ padding: "5px", border: "1px solid #ccc", backgroundColor: "#f0f0f0" }}>
                    Distancia del sitio principal en km. y tiempo del trayecto:
                  </td>
                  <td style={{ padding: "5px", border: "1px solid #ccc" }}>
                    <EditableField
                      fieldName={`unidad_${index + 1}_distancia`}
                      placeholder="Distancia y tiempo"
                      value={editableFields[`unidad_${index + 1}_distancia`] || ""}
                      onChange={updateEditableField}
                    />
                  </td>
                </tr>
                <tr>
                  <td style={{ padding: "5px", border: "1px solid #ccc", backgroundColor: "#f0f0f0" }}>
                    Número de trabajadores fijos y eventuales:
                  </td>
                  <td style={{ padding: "5px", border: "1px solid #ccc" }}>
                    <EditableField
                      fieldName={`unidad_${index + 1}_trabajadores`}
                      placeholder="Número de trabajadores"
                      value={editableFields[`unidad_${index + 1}_trabajadores`] || ""}
                      onChange={updateEditableField}
                      style={{ width: "48%", marginRight: "4%" }}
                    />
                    <span style={{ fontWeight: "bold", marginRight: "2%" }}>Horario de operación:</span>
                    <EditableField
                      fieldName={`unidad_${index + 1}_horario`}
                      placeholder="Horario"
                      value={editableFields[`unidad_${index + 1}_horario`] || ""}
                      onChange={updateEditableField}
                      style={{ width: "44%" }}
                    />
                  </td>
                </tr>
                <tr>
                  <td style={{ padding: "5px", border: "1px solid #ccc", backgroundColor: "#f0f0f0" }}>
                    ¿Compra producto certificado GLOBALG.A.P. a otro(s) productores?
                  </td>
                  <td style={{ padding: "5px", border: "1px solid #ccc" }}>
                    <div style={{ display: "flex", gap: "20px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                        <EditableCheckbox
                          fieldName={`unidad_${index + 1}_compra_certificado_si`}
                          checked={editableCheckboxes[`unidad_${index + 1}_compra_certificado_si`]}
                          onChange={updateEditableCheckbox}
                        />
                        <span>Sí</span>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                        <EditableCheckbox
                          fieldName={`unidad_${index + 1}_compra_certificado_no`}
                          checked={editableCheckboxes[`unidad_${index + 1}_compra_certificado_no`]}
                          onChange={updateEditableCheckbox}
                        />
                        <span>No</span>
                      </div>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td style={{ padding: "5px", border: "1px solid #ccc", backgroundColor: "#f0f0f0" }}>
                    ¿Compra producto no certificado GLOBALG.A.P. a otro(s) productores?
                  </td>
                  <td style={{ padding: "5px", border: "1px solid #ccc" }}>
                    <div style={{ display: "flex", gap: "20px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                        <EditableCheckbox
                          fieldName={`unidad_${index + 1}_compra_no_certificado_si`}
                          checked={editableCheckboxes[`unidad_${index + 1}_compra_no_certificado_si`]}
                          onChange={updateEditableCheckbox}
                        />
                        <span>Sí</span>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                        <EditableCheckbox
                          fieldName={`unidad_${index + 1}_compra_no_certificado_no`}
                          checked={editableCheckboxes[`unidad_${index + 1}_compra_no_certificado_no`]}
                          onChange={updateEditableCheckbox}
                        />
                        <span>No</span>
                      </div>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
            {index < 3 && <div style={{ height: "15px" }}></div>}
          </div>
        ))}

        <p style={{ fontSize: "9pt", fontStyle: "italic", marginTop: "10px" }}>
          Nota: En caso de tener más de 4 centros de manipulación, por favor llenar el documento que corresponde al
          FOR-SGI-02 Anexo de la solicitud de certificación.
        </p>
      </div>
    </SectionBase>
  )
}
