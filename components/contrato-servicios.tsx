"use client"

interface ContratoServiciosProps {
  isOpen: boolean
  onClose: () => void
  datosGenerales?: any
  esquemas?: string[]
  datosPrimusGFS?: any
  datosGlobalGAP?: any
  editableFields?: Record<string, string>
  updateEditableField?: (fieldName: string, value: string) => void
}

export function ContratoServicios({
  isOpen,
  onClose,
  datosGenerales = {},
  esquemas = [],
  datosPrimusGFS = null,
  datosGlobalGAP = null,
  editableFields = {},
  updateEditableField = () => {},
}: ContratoServiciosProps) {
  const getFieldValue = (fieldName: string, defaultValue = "") => {
    return editableFields[fieldName] !== undefined ? editableFields[fieldName] : defaultValue
  }

  const today = new Date()
  const day = today.getDate().toString().padStart(2, "0")
  const month = today.toLocaleString("es-ES", { month: "long" })
  const year = today.getFullYear()

  // Determinar los alcances basados en los esquemas seleccionados
  const determinarAlcances = () => {
    const alcances = []
    if (esquemas?.includes("primusgfs")) {
      if (datosPrimusGFS?.operacionGranja) alcances.push("Granja")
      if (datosPrimusGFS?.operacionInvernadero) alcances.push("Invernadero")
      if (datosPrimusGFS?.operacionCuadrilla) alcances.push("Cuadrilla de cosecha")
      if (datosPrimusGFS?.operacionEmpaque) alcances.push("Empaque")
      if (datosPrimusGFS?.operacionCuartoFrio) alcances.push("Cuarto frío")
      if (datosPrimusGFS?.operacionProcesadora) alcances.push("Procesadora")
      if (datosPrimusGFS?.operacionAlmacen) alcances.push("Centro de almacenamiento y distribución")
    }
    if (esquemas?.includes("globalgap")) {
      alcances.push("Frutas y Vegetales")
    }
    return alcances.join(" y ")
  }

  // Determinar los productos basados en los datos
  const determinarProductos = () => {
    let productos = []
    if (datosPrimusGFS?.productos) {
      productos = [...productos, ...datosPrimusGFS.productos]
    }
    if (datosGlobalGAP?.productos) {
      productos = [...productos, ...datosGlobalGAP.productos]
    }
    return productos.join(", ")
  }

  return (
    <div
      className="contract-document"
      style={{
        fontFamily: "Times New Roman, serif",
        fontSize: "11pt",
        lineHeight: 1.3,
        letterSpacing: "0.2px",
        width: "100%",
        maxWidth: "210mm",
        margin: "0 auto",
        padding: "0",
        boxSizing: "border-box",
        textAlign: "left",
      }}
    >
      {/* Encabezado */}
      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <p style={{ margin: "0 0 5px 0" }}>www.cemacertificacion.com</p>
        <h2 style={{ margin: "0 0 5px 0", fontWeight: "bold" }}>Contrato de Servicios de Certificación</h2>
        <p style={{ margin: "0 0 5px 0" }}>Código de registro: FOR-SGI-04</p>
        <p style={{ margin: "0 0 5px 0" }}>Numero de revisión y edición: 00/00</p>
        <p style={{ margin: "0 0 5px 0" }}>Fecha de emisión: 10/10/2024</p>
        <p style={{ margin: "0 0 5px 0" }}>Página 1</p>
      </div>

      {/* Introducción */}
      <div style={{ marginBottom: "20px" }}>
        <p style={{ textAlign: "justify" }}>
          Contrato de Servicios de Certificación que celebran, por una parte, CEMA INTERNATIONAL COMPLIANCE SERVICES,
          S.A DE C.V., quien en lo sucesivo y para los efectos de este contrato se le denominará "CEMA ICS" y, por la
          otra parte, {datosGenerales?.nombreEmpresa || getFieldValue("nombreEmpresa", "_____________________")}, en lo
          sucesivo referido como "El Cliente", y en su conjunto como las "Partes", al amparo de las siguientes
          declaraciones y cláusulas.
        </p>
      </div>

      {/* Declaraciones */}
      <div style={{ marginBottom: "20px" }}>
        <h3 style={{ fontWeight: "bold", textAlign: "center", margin: "0 0 10px 0" }}>DECLARACIONES</h3>
        <p style={{ fontWeight: "bold", margin: "10px 0 5px 0" }}>
          I. "CEMA ICS" declara por conducto de su representante:
        </p>
        <p style={{ margin: "0 0 5px 0", textAlign: "justify" }}>
          a) Ser una persona moral constituida de conformidad con las leyes mexicanas, tener como Registro Federal de
          Contribuyentes CCM210205FV0 tener su domicilio en calle Florencia 3127, colonia Lomas de Providencia, C.P.
          44647, Guadalajara, Jalisco.
        </p>
        <p style={{ margin: "0 0 5px 0", textAlign: "justify" }}>
          b) Que acredita la constitución de su sociedad con el testimonio de la escritura pública No. 17218 fechada el
          05 de febrero de 2021 otorgada ante la fe del Licenciado FABIAN TOMMASI MÉNDEZ corredor público No. 57 de la
          plaza del estado de Jalisco.
        </p>
        <p style={{ margin: "0 0 5px 0", textAlign: "justify" }}>
          c) Que su representante legal acredita sus facultades por medio de la escritura pública No. 17218 de fecha 05
          de febrero del 2021 otorgada ante la fe del Licenciado FABIAN TOMMASI MÉNDEZ público No. 57 de la plaza del
          estado de Jalisco.
        </p>
        <p style={{ margin: "0 0 5px 0", textAlign: "justify" }}>
          d) Que cuenta con la acreditación vigente emitida por la Entidad Mexicana de Acreditación y las respectivas
          aprobaciones otorgadas por las entidades correspondientes para operar como organismo de certificación de
          producto en los términos de la Ley de Infraestructura de la Calidad.
        </p>

        <p style={{ fontWeight: "bold", margin: "10px 0 5px 0" }}>
          II. "El Cliente" declara por conducto de su representante/por su propio derecho:
        </p>
        <p style={{ margin: "0 0 5px 0" }}>a) Tener lo siguiente</p>
        <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "10px" }}>
          <tbody>
            <tr>
              <td style={{ width: "40%", padding: "5px", border: "1px solid #ccc" }}>Representante legal</td>
              <td style={{ width: "60%", padding: "5px", border: "1px solid #ccc" }}>
                {datosGenerales?.representanteLegal || (
                  <input
                    type="text"
                    value={getFieldValue("representanteLegal")}
                    onChange={(e) => updateEditableField("representanteLegal", e.target.value)}
                    placeholder="Nombre del representante legal"
                    style={{
                      width: "100%",
                      border: "1px solid #ddd",
                      padding: "2px 4px",
                      fontSize: "inherit",
                      fontFamily: "inherit",
                    }}
                  />
                )}
              </td>
            </tr>
            <tr>
              <td style={{ padding: "5px", border: "1px solid #ccc" }}>Nombre de la empresa</td>
              <td style={{ padding: "5px", border: "1px solid #ccc" }}>
                {datosGenerales?.nombreEmpresa || (
                  <input
                    type="text"
                    value={getFieldValue("nombreEmpresa")}
                    onChange={(e) => updateEditableField("nombreEmpresa", e.target.value)}
                    placeholder="Nombre de la empresa"
                    style={{
                      width: "100%",
                      border: "1px solid #ddd",
                      padding: "2px 4px",
                      fontSize: "inherit",
                      fontFamily: "inherit",
                    }}
                  />
                )}
              </td>
            </tr>
            <tr>
              <td style={{ padding: "5px", border: "1px solid #ccc" }}>Domicilio legal</td>
              <td style={{ padding: "5px", border: "1px solid #ccc" }}>
                {datosGenerales?.direccionFiscal || (
                  <input
                    type="text"
                    value={getFieldValue("direccionFiscal")}
                    onChange={(e) => updateEditableField("direccionFiscal", e.target.value)}
                    placeholder="Domicilio legal"
                    style={{
                      width: "100%",
                      border: "1px solid #ddd",
                      padding: "2px 4px",
                      fontSize: "inherit",
                      fontFamily: "inherit",
                    }}
                  />
                )}
              </td>
            </tr>
            <tr>
              <td style={{ padding: "5px", border: "1px solid #ccc" }}>
                Registro de la entidad
                <br />
                (RFC, NIT, RUT, etc.)
              </td>
              <td style={{ padding: "5px", border: "1px solid #ccc" }}>
                {datosGenerales?.rfc || (
                  <input
                    type="text"
                    value={getFieldValue("rfc")}
                    onChange={(e) => updateEditableField("rfc", e.target.value)}
                    placeholder="RFC/RUT/CIF-NIF"
                    style={{
                      width: "100%",
                      border: "1px solid #ddd",
                      padding: "2px 4px",
                      fontSize: "inherit",
                      fontFamily: "inherit",
                    }}
                  />
                )}
              </td>
            </tr>
          </tbody>
        </table>

        <p style={{ margin: "0 0 5px 0", textAlign: "justify" }}>
          b) Tener plena capacidad legal para obligarse en los términos de este instrumento legal.
        </p>
        <p style={{ margin: "0 0 5px 0", textAlign: "justify" }}>
          c) Que conoce los servicios profesionales y la forma en que los presta "CEMA ICS" y que requiere de dichos
          servicios.
        </p>
        <p style={{ margin: "0 0 5px 0", textAlign: "justify" }}>
          d) Que el hecho de pagar las tarifas correspondientes o firmar este contrato, no garantiza obtener una
          decisión de la certificación positiva por parte de "CEMA ICS".
        </p>

        <p style={{ fontWeight: "bold", margin: "10px 0 5px 0" }}>
          III. Las Partes declaran ("CEMA ICS" y "El Cliente"):
        </p>
        <p style={{ margin: "0 0 5px 0", textAlign: "justify" }}>
          a) Que para el caso de controversia o interpretación de este contrato se someterán a la legislación aplicable
          de los Estados Unidos Mexicanos y a la jurisdicción y competencia de los Tribunales del Primer Partido
          Judicial ubicados en Guadalajara, Jalisco, renunciando expresamente al fuero que pudiera corresponderles por
          razón de su domicilio actual o futuro.
        </p>
        <p style={{ margin: "0 0 5px 0", textAlign: "justify" }}>
          b) Que para todos los efectos legales a que haya lugar, "Las Partes" están de contrato en otorgarle completa
          vinculación y plena validez la firma del presente contrato.
        </p>
        <p style={{ margin: "0 0 5px 0", textAlign: "justify" }}>
          c) Que a la firma del presente contrato no ha habido error, dolo, violencia, mala fe o cualquier otro vicio
          del consentimiento que lo pudiere invalidar, así que, en beneficio recíproco, renuncian a los derechos que
          pudieran otorgarles los artículos 1882, 2228, 2230 y demás relativos del Código Civil Federal.
        </p>
        <p style={{ margin: "0 0 5px 0", textAlign: "justify" }}>
          d) Que es su deseo celebrar el presente contrato, obligándose en sus términos y condiciones, estableciendo
          para tal efecto las siguientes:
        </p>
      </div>

      {/* Cláusulas */}
      <div style={{ marginBottom: "20px" }}>
        <h3 style={{ fontWeight: "bold", textAlign: "center", margin: "0 0 10px 0" }}>CLÁUSULAS</h3>

        <p style={{ fontWeight: "bold", margin: "10px 0 5px 0" }}>PRIMERA. - OBJETO:</p>
        <p style={{ margin: "0 0 5px 0" }}>a) El objeto del presente contrato es la certificación siguiente:</p>
        <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "10px" }}>
          <tbody>
            <tr>
              <td style={{ width: "30%", padding: "5px", border: "1px solid #ccc" }}>Certificación solicitada</td>
              <td style={{ width: "70%", padding: "5px", border: "1px solid #ccc" }}>
                {esquemas?.includes("primusgfs")
                  ? "PrimusGFS v3.2"
                  : esquemas?.includes("globalgap")
                    ? "GLOBALG.A.P. IFA v6"
                    : getFieldValue("certificacionSolicitada", "")}
              </td>
            </tr>
            <tr>
              <td style={{ padding: "5px", border: "1px solid #ccc" }}>Alcances solicitados</td>
              <td style={{ padding: "5px", border: "1px solid #ccc" }}>{determinarAlcances()}</td>
            </tr>
            <tr>
              <td style={{ padding: "5px", border: "1px solid #ccc" }}>Productos</td>
              <td style={{ padding: "5px", border: "1px solid #ccc" }}>{determinarProductos()}</td>
            </tr>
            <tr>
              <td style={{ padding: "5px", border: "1px solid #ccc" }}>Ubicaciones</td>
              <td style={{ padding: "5px", border: "1px solid #ccc" }}>
                {datosGenerales?.direccion || (
                  <input
                    type="text"
                    value={getFieldValue("ubicaciones")}
                    onChange={(e) => updateEditableField("ubicaciones", e.target.value)}
                    placeholder="Ubicaciones"
                    style={{
                      width: "100%",
                      border: "1px solid #ddd",
                      padding: "2px 4px",
                      fontSize: "inherit",
                      fontFamily: "inherit",
                    }}
                  />
                )}
              </td>
            </tr>
          </tbody>
        </table>

        {/* Resto de cláusulas */}
        <p style={{ fontWeight: "bold", margin: "10px 0 5px 0" }}>SEGUNDA. - HONORARIOS:</p>
        <p style={{ margin: "0 0 5px 0", textAlign: "justify" }}>
          Los honorarios que de común contrato pactan las Partes, a favor de "CEMA ICS" por sus servicios profesionales
          y a cargo de "El Cliente" son las dispuestas en la propuesta de certificación firmada.
        </p>

        <p style={{ fontWeight: "bold", margin: "10px 0 5px 0" }}>TERCERA. -SERVICIOS:</p>
        <p style={{ margin: "0 0 5px 0", textAlign: "justify" }}>
          "El Cliente" tiene derecho a recibir a su entera satisfacción el o los servicios acordados bajo este
          instrumento, con la documentación correspondiente que le deberá proporcionar "CEMA ICS", por el servicio
          contratado. "CEMA ICS" Tendrá como responsabilidad lo siguiente:
        </p>
        <ul style={{ margin: "0 0 5px 20px", padding: 0, textAlign: "justify" }}>
          <li style={{ margin: "0 0 5px 0" }}>
            Llevar a cabo la auditoría para evaluar el nivel de cumplimiento y efectividad de los Programas Reconocidos
            de Certificación aplicable a la solicitud del servicio.
          </li>
          <li style={{ margin: "0 0 5px 0" }}>
            Las auditorías se realizan para obtener a través de muestreo la información de los Programas Reconocidos de
            Certificación aplicable, que son válidos conforme a la norma aplicable, criterios de auditoria tales como
            políticas y procedimientos definidos por "El Cliente" y cualquier requerimiento adicional solicitado por sus
            clientes; así como el cumplimiento de los requisitos legales y regulatorios aplicables a su sistema.
          </li>
          <li style={{ margin: "0 0 5px 0" }}>
            Las diferentes auditorías desarrolladas por "CEMA ICS" para "El Cliente" dependen de los Programas
            Reconocidos de Certificación aplicable.
          </li>
          <li style={{ margin: "0 0 5px 0" }}>
            Los tiempos de auditoría se mantienen con el cumplimiento de los Programas Reconocidos de Certificación
            aplicable.
          </li>
          <li style={{ margin: "0 0 5px 0" }}>
            El cálculo del tiempo de días auditor se realiza de contrato con la información proporcionada por "El
            Cliente", que se documenta en la "solicitud de certificación"; durante el proceso de auditoría el auditor
            validará esta información para mantener el cumplimiento con los requisitos internacionales y en caso de
            diferencias, el auditor deberá informar a "El Cliente" y al Coordinador de auditorías de "CEMA ICS" para
            hacer los ajustes necesarios en horarios y tarifas de la auditoria.
          </li>
          <li style={{ margin: "0 0 5px 0" }}>
            Informar a "El Cliente" de cualquier cambio en los requisitos de certificación, con el fin de mantenerse al
            día y en cumplimiento.
          </li>
          <li style={{ margin: "0 0 5px 0" }}>
            "CEMA ICS" se reserva el derecho de realizar auditorías especiales únicamente en caso de ser necesario
            previo contrato con "El Cliente", para validar la continuidad y el cumplimiento de los requisitos de la
            norma aplicable. Cualquier auditoria especial será informado con anticipación a "El Cliente".
          </li>
          <li style={{ margin: "0 0 5px 0" }}>
            "CEMA ICS" se reserva el derecho de seleccionar a "El Cliente" para realizar auditorías de vigilancia no
            anunciadas, de contrato con el programa de vigilancia que "CEMA ICS" determine.
          </li>
          <li style={{ margin: "0 0 5px 0" }}>
            "CEMA ICS" notificará a "El Cliente" cuando sus operaciones, instalaciones, procesos o cultivos sean
            elegidas para realizar la auditoria de vigilancia no anunciada 48 horas antes del día del evento.
          </li>
        </ul>

        {/* Resto de cláusulas omitidas por brevedad */}
        {/* ... */}

        {/* Firmas */}
        <div style={{ marginTop: "30px" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <tbody>
              <tr>
                <td style={{ width: "50%", padding: "5px", textAlign: "center" }}>
                  {datosGenerales?.nombreEmpresa || getFieldValue("nombreEmpresa", "Cliente: _____________________")}
                </td>
                <td style={{ width: "50%", padding: "5px", textAlign: "center" }}>
                  CEMA INTERNATIONAL COMPLIANCE SERVICES SA DE CV
                </td>
              </tr>
              <tr>
              
                <td style={{ padding: "30px", textAlign: "center" }}></td>
              </tr>
              <tr>
                <td style={{ padding: "5px", textAlign: "center" }}>
                  Nombre:{" "}
                  {datosGenerales?.representanteLegal || getFieldValue("representanteLegal", "_____________________")}
                </td>
                <td style={{ padding: "5px", textAlign: "center" }}>Nombre: JOSE LUIS JURADO ZURITA</td>
              </tr>
              <tr>
                <td style={{ padding: "5px", textAlign: "center" }}>Puesto: REPRESENTANTE LEGAL</td>
                <td style={{ padding: "5px", textAlign: "center" }}>Puesto: DIRECTOR GENERAL</td>
              </tr>
            </tbody>
          </table>
          <p style={{ textAlign: "center", marginTop: "20px" }}>
            Fecha de aprobación por el cliente: {day} de {month} de {year}
          </p>
        </div>
      </div>
    </div>
  )
}
