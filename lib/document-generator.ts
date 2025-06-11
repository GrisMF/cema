// Función para generar el Contrato de Servicios de Certificación
export function generateServiceContract(data: any) {
  // Formatear la fecha actual en formato DD/MM/YYYY
  const today = new Date()
  const formattedDate = `${today.getDate().toString().padStart(2, "0")}/${(today.getMonth() + 1).toString().padStart(2, "0")}/${today.getFullYear()}`

  // Crear el contenido del documento
  const content = `
    www.cemacertificacion.com  
 
    Contrato de Servicios de Certificación 
    Código de registro: FOR-SGI-04 
    Numero de revisión y edición:  00/00 
    Fecha de emisión: 10/10/2024 
    
    Página 1 
    
    
    
    
    
    
    
    
    
    
    DECLARACIONES 
    
    
    
    I. "CEMA ICS" declara por conducto de su representante: 
    
    a) Ser  una  persona  moral  constituida  de  conformidad  con  las  leyes  mexicanas,  tener  como Registro  Federal  de 
    Contribuyentes CCM210205FV0 tener su domicilio en calle Florencia 3127, colonia Lomas de Providencia, C.P. 44647, 
    Guadalajara, Jalisco. 
    b) Que acredita la constitución de su sociedad con el testimonio de la escritura pública No. 17218 fechada el 05 de 
    febrero de 2021 otorgada ante la fe del Licenciado FABIAN TOMMASI MÉNDEZ corredor público No. 57 de la plaza 
    del estado de Jalisco. 
    c) Que su  representante  legal  acredita  sus  facultades  por  medio  de la escritura pública  No.  17218  de  fecha  05  de 
    febrero del 2021 otorgada ante la fe del Licenciado FABIAN TOMMASI MÉNDEZ público No. 57 de la plaza del estado 
    de Jalisco. 
    d) Que  cuenta  con  la  acreditación  vigente  emitida  por  la Entidad  Mexicana  de  Acreditación y  las  respectivas 
    aprobaciones  otorgadas  por  las  entidades  correspondientes  para  operar  como  organismo  de  certificación  de 
    producto en los términos de la Ley de Infraestructura de la Calidad. 
    
    II. "El Cliente" declara por conducto de su representante/por su propio derecho:  
    
    a) Tener lo siguiente  
    Representante legal 
    ${data.datosGenerales.representanteLegal || ""}
    Nombre de la empresa 
    ${data.datosGenerales.nombreEmpresa || ""}
    Domicilio legal 
    ${data.datosGenerales.direccionFiscal || ""}, ${data.datosGenerales.pais || ""}
    Registro de la entidad  
    (RFC, NIT, RUT, etc.) 
    ${data.datosGenerales.rfc || ""}
    
    b) Tener plena capacidad legal para obligarse en los términos de este instrumento legal. 
    c) Que conoce los servicios profesionales y la forma en que los presta "CEMA ICS" y que requiere de dichos servicios. 
    d) Que el hecho de pagar las tarifas correspondientes o firmar este contrato, no garantiza obtener una decisión de la 
    certificación positiva por parte de "CEMA ICS". 
    
    III. Las Partes declaran ("CEMA ICS" y "El Cliente"):  
    
    a) Que para el caso de controversia o interpretación de este contrato se someterán a la legislación aplicable de los 
    Estados Unidos Mexicanos y a la jurisdicción y competencia de los Tribunales del Primer Partido Judicial ubicados 
    en Guadalajara, Jalisco, renunciando expresamente al fuero que pudiera corresponderles por razón de su domicilio 
    actual o futuro. 
    b) Que  para  todos  los  efectos  legales  a  que  haya  lugar, "Las Partes" están  de contrato en  otorgarle  completa 
    vinculación y plena validez la firma del presente contrato.  
    c) Que  a  la  firma  del  presente contrato no  ha  habido  error,  dolo,  violencia,  mala  fe  o  cualquier  otro  vicio  del 
    consentimiento que lo pudiere invalidar, así que, en beneficio recíproco, renuncian a los derechos que pudieran 
    otorgarles los artículos 1882, 2228, 2230 y demás relativos del Código Civil Federal. 
    Contrato  de  Servicios  de  Certificación  que  celebran,  por  una  parte,  CEMA  INTERNATIONAL  COMPLIANCE 
    SERVICES, S.A DE C.V., quien en lo sucesivo y para los efectos de este contrato se le denominará "CEMA ICS" 
    y, por la otra parte, ${data.datosGenerales.nombreEmpresa || ""}, en lo sucesivo referido como "El Cliente", y en su conjunto como 
    las "Partes", al amparo de las siguientes declaraciones y cláusulas. 
  `

  return content
}

// Función para generar el Acuerdo de Auditoría y Sub-Licencia
export function generateAuditAgreement(data: any) {
  // Formatear la fecha actual en formato DD/MM/YYYY
  const today = new Date()
  const formattedDate = `${today.getDate().toString().padStart(2, "0")}/${(today.getMonth() + 1).toString().padStart(2, "0")}/${today.getFullYear()}`

  // Crear el contenido del documento
  const content = `
Documento Confidencial Azzule Rev. 1 
PGFS-ND-004s Página 1 de 4 3 Oct, 2017 
 
 
ACUERDO DE AUDITORÍA Y SUB-LICENCIA SUSCRITO ENTRE LA EMPRESA 
DENOMINADA 
CEMA INTERNATIONAL COMPLIANCE SERVICES S.A. DE C.V. 
COMO AUDITOR Y SUB- 
 
LICENCIANTE, REPRESENTADA EN ESTE ACTO POR 
JOSE LUIS JURADO ZURITA 
(EN ADELANTE REFERIDO COMO 
 
"ORGANISMO   DE   CERTIFICACIÓN")   Y   LA   COMPAÑÍA   LLAMADA 
${data.datosGenerales.nombreEmpresa || ""},  REPRESENTADA  EN  ESTE  ACTO  POR 
${data.datosGenerales.representanteLegal || ""} EN ADELANTE REFERIDO COMO EL 
"CLIENTE",    DE    ACUERDO    CON    LAS    SIGUIENTES    CONSIDERACIONES    Y 
CLÁUSULAS: 
C L A U S U L A S: 
 
PRIMERO OBJETIVO PRINCIPAL: Las   partes   acuerdan   y   consienten   que el 
propósito principal de este convenio es establecer las bases, términos y condiciones 
mediante  los  cuales  el ORGANISMO  DE  CERTIFICACIÓN deberá  ejecutar  la(s) 
auditoría(s)   a   la(s)   operación(es)   de   producción   de   acuerdo   al Esquema 
PrimusGFS,  con  el  fin  de determinar  el  nivel  de  cumplimiento  del  proceso  de 
producción objeto de la auditoría, en relación con el Esquema PrimusGFS y, en su 
caso, obtener un documento de certificación. 
 
SEGUNDO ANTES DE LA AUDITORÍA: El CLIENTE deberá proporcionar al 
ORGANISMO DE CERTIFICACIÓN la siguiente información, con el fin de definir el 
alcance de la auditoría y la certificación a emitir por el ORGANISMO DE 
CERTIFICACIÓN en favor del CLIENTE: 
a. Indicar el tipo de operación(es) sujeta(s) a auditorías de Buenas Prácticas 
Agrícolas,  de  Manufactura  o  HACCP,  para  determinar  qué  módulos  del 
Esquema PrimusGFS serán aplicables. 
b. La  descripción  y  el  número  de  áreas  de  producción  y/u  operaciones  que 
serán auditadas por organización. La solicitud presentada por el CLIENTE 
deberá detallar los diferentes sitios y operaciones a certificar. 
 
TERCERO PROCESOS DE AUDITORÍA Y CERTIFICACIÓN EJECUTADOS POR 
EL  ORGANISMO  DE  CERTIFICACIÓN: Las  inspecciones  a  la(s)  operación(es)  del 
CLIENTE,   se   llevarán   a   cabo   únicamente   por   un   auditor   autorizado   del 
ORGANISMO DE CERTIFICACIÓN, cumpliendo con el Esquema PrimusGFS y sus 
Regulaciones Generales. 
 
Las auditorías se llevarán a cabo siguiendo una programación previamente acordada 
por  las  partes,  teniendo  siempre  en  cuenta  la  disponibilidad  del ORGANISMO  DE 
CERTIFICACIÓN para prestar el servicio. 
 
Una  vez  concluida  la  auditoría,  el ORGANISMO  DE  CERTIFICACIÓN deberá 
entregar  al CLIENTE la  copia  de  los resultados  finales  referentes  a  la  auditoría, 
dentro de un plazo no mayor de 15 días naturales después de su término. Si se han 

Documento Confidencial Azzule Rev. 1 
PGFS-ND-004s Página 2 de 4 3 Oct, 2017 
 
 
de requerir transferencias de información, éstas deben indicarse previamente al CB 
(organismo  de  certificación por  sus  siglas  en  inglés:  Certification  Body)  por  el 
CLIENTE a través de un acuerdo de liberación de información. 
 
Cuando se logra la certificación, de acuerdo con los criterios, términos y condiciones 
que se especifican en la sección 12 de las Regulaciones Generales PrimusGFS, El 
ORGANISMO  DE  CERTIFICACIÓN emitirá  un  documento  certificado  al CLIENTE 
para  cada  operación  aprobada,  con  un  año  de  validez  a  partir  del  inicio  de  la 
ejecución de las actividades de inspección y certificación. 
 
El CLIENTE dispondrá de un plazo no mayor de 30 días naturales a partir del día de 
la  auditoría,  para  enviar  las  acciones  correctivas  mediante  el  uso  de  la  página  web 
www.primusgfs.com. Si  dentro  de  dicho  periodo  las  acciones  correctivas  no  son 
recibidas  por  el ORGANISMO  DE  CERTIFICACIÓN,  el  proceso  de  auditoría  se 
considera  cerrado  y  sin  posibilidades  de  modificar  el  nivel  de  cumplimiento  del 
CLIENTE 
 
CUARTO CONSIDERACIÓN  DE  PAGO: El CLIENTE está  obligado  a  pagar  en 
función   de   consideración   de   pago   al ORGANISMO   DE   CERTIFICACIÓN las 
cantidades  citadas  por  los  servicios.  El ORGANISMO  DE  CERTIFICACIÓN sólo 
entregará  los  resultados  correspondientes  hasta  que  la  totalidad  de  las  cantidades 
están  debidamente  pagadas.  Pueden aplicar  gastos  de  viaje,  los  cuales  serán 
facturados al CLIENTE. 
 
QUINTO SUB-LICENCIA PARA EL USO DE LA MARCA: AZZULE tiene el 
derecho  de  autorizar  el  uso  de  la  marca  registrada PrimusGFS,  sólo  cuando  el 
CLIENTE haya   obtenido   la   certificación   conforme   al Esquema   PrimusGFS, 
mediante  una  autorización  por  escrito  otorgada  por AZZULE.  En  este  respecto,  el 
uso  de  la  marca  y  el  logotipo  deberá  cumplir  con  las  directrices  establecidas  por 
AZZULE y  sólo  puede  ser  utilizado  en  los  productos  resultantes  del  proceso de 
producción  debidamente  certificado  de  acuerdo  con  el Esquema  PrimusGFS.  El 
CLIENTE no tiene derecho a otorgar sub-licencias a terceros para el uso de la marca 
PrimusGFS y su logotipo. 
 
En el caso de que el CLIENTE, sus empleados o agentes, usen incorrectamente la 
marca  o  el  logotipo  de PrimusGFS (contraviniendo  lo  establecido  por AZZULE), 
adicional a la facultad de terminar anticipadamente este acuerdo sin la necesidad de 
una   orden    judicial   y    sin    ninguna    causa    imputable   al ORGANISMO    DE 
CERTIFICACIÓN,   el CLIENTE se   hace   responsable   de   reparar   los   daños   y 
perjuicios, como se requiere por escrito por el ORGANISMO DE CERTIFICACIÓN o 
por AZZULE dentro  de  una  plazo  que  no  exceda  a  15  (quince)  días  naturales 
contados a  partir  de  dicha notificación. De  igual  forma  los  documentos de 

Documento Confidencial Azzule Rev. 1 
PGFS-ND-004s Página 3 de 4 3 Oct, 2017 
 
 
certificación otorgados al CLIENTE como resultado de la auditoría serán 
considerados como revocados de manera definitiva. 
SEXTO  VIGENCIA  Y  TÉRMINO  ANTICIPADO: Este  contrato  de  licencia  tendrá 
validez  indefinida.  Si  una  de  las  partes  incumpliera  cualquiera  de  los  términos  y 
condiciones establecidos por este acuerdo, la otra parte deberá informar y conceder 
un  plazo  de  10  (diez)  días  naturales  contados  a  partir  de  la  fecha  de  notificación, 
para  corregir  los  incumplimientos.  Si  una  vez  cumplido  el  plazo  el  incumplimiento 
continúa,  este  acuerdo  puede  ser  terminado  anticipadamente  sin  necesidad  de  una 
orden   judicial.   De   igual   forma   las   partes   están   autorizadas   para   terminar 
anticipadamente  este  acuerdo  mediante  una  notificación  por  escrito  a  la  otra  parte, 
con  una  anticipación  de  15  (quince)  días  laborables.  Si  este  acuerdo  es  terminado 
por  cualquier  razón,  todas  las  sub-licencias y  certificaciones  otorgados  después  del 
término  del  acuerdo,  por  el ORGANISMO  DE  CERTIFICACIÓN a CLIENTE,  no 
tendrán ninguna validez. 
 
SÉPTIMO PENALIDAD  CONVENCIONAL:  Si  este  acuerdo  se  termina  por  cualquier 
causa  imputable  al CLIENTE,  es  responsabilidad  de  este  último,  sin  necesidad  de 
una   orden   judicial,   pagar   a   favor   del ORGANISMO   DE   CERTIFICACIÓN,   lo 
siguiente: 
a. La  cantidad  total  de  honorarios  y  gastos  incurridos  por  el ORGANISMO 
DE CERTIFICACIÓN por prestación de los servicios, así como pagar, en 
su caso, los intereses vencidos. El pago deberá ser ejecutado en una sola 
exhibición  el  mismo  día  en  que  el ORGANISMO  DE  CERTIFICACIÓN 
informa de la terminación anticipada del contrato al CLIENTE. 
b. El ORGANISMO   DE   CERTIFICACIÓN tiene   derecho a   solicitar   el 
cumplimiento,  ya  sea  por  la  vía  legal  o  por  acuerdo  extrajudicial.  El 
ORGANISMO   DE   CERTIFICACIÓN podrá   escoger   el   pago   de   la 
penalidad  establecida,  pero  una  vez  ejercida  alguna  de  las  opciones,  la 
otra no tendrá efectos legales. 
OCTAVO LEY, JURISDICCIÓN  Y  ARBITRAJE: Este  acuerdo  está  sujeto  a  la  ley 
vigente de la República de México. 
NOVENO RESPONSABILIDADES: El CLIENTE está   de   acuerdo   y   reconoce 
expresamente  que  las  auditorías  y  visitas  ejecutadas  de  conformidad  con  este 
acuerdo, son exclusivamente ejecutadas por el ORGANISMO DE CERTIFICACIÓN, 
por lo tanto, cualquier conflicto o incumplimiento relacionado con él, debe ser tratado 
con el ORGANISMO DE CERTIFICACIÓN. 
DÉCIMO  CONFIDENCIALIDAD: Dentro  de  la  validez  de  este  acuerdo  el CLIENTE 
se  pondrá  en  contacto  y  se  familiarizará  con  la  información  confidencial.  Esta 
información  puede  incluir,  pero  no  se  limita  a,  información  relativa  a AZZULE y  al 
ORGANISMO  DE  CERTIFICACIÓN,  por  lo  tanto,  el CLIENTE se  compromete  a 
mantener  dicha  información  confidencial  y  no  divulgarla  ni  discutirla  con  personas 
ajenas a AZZULE o al ORGANISMO DE CERTIFICACIÓN. Así mismo se prohíbe al 

Documento Confidencial Azzule Rev. 1 
PGFS-ND-004s Página 4 de 4 3 Oct, 2017 
 
 
 
 
 
 
CLIENTE copiar,  reproducir,  divulgar  o  publicar  la  información  confidencial  que 
pueda estar en contacto con la ejecución de este acuerdo. 
UNDÉCIMO ASIGNACIÓN DE DERECHOS Y OBLIGACIONES: Ninguna de las 
partes podrá ceder la totalidad o parte de los derechos y obligaciones concedidos en 
el  presente  acuerdo  sin  el  consentimiento  previo  por  escrito  otorgado  por  la  otra 
parte. 
DUODÉCIMO  MODIFICACIONES: Este  acuerdo  constituye  el  completo  acuerdo 
entre  las  partes  con  respecto a  la materia  objeto,  y  reemplaza  y  sustituye cualquier 
otro acuerdo o contrato, ya sea escrito u oral. Ninguna modificación o ampliación del 
acuerdo será vinculante a menos que esté escrita y firmada por ambas partes, para 
sus efectos legales. 
DECIMOTERCERO CLÁUSULAS NO VINCULANTES: En caso de que una o 
más   cláusulas   e   este   acuerdo   parezca(n)   ser   no   vinculante(s),   las   restantes 
disposiciones  de  este  acuerdo  continuarán  siendo  efectivas.  Las  partes  deberán 
entrar  en  negociaciones  para  reemplazar  las  cláusulas  no  vinculantes  con  otras 
cláusulas que sean vinculantes, de manera tal que las nuevas cláusulas difieran tan 
poco como sea posible de las cláusulas no vinculantes, tomando en cuenta el objeto 
y propósito de este acuerdo. 
DECIMOCUARTO En  esta  cláusula  las  partes  acuerdan  y  reconocen  que  en  este 
convenio   no  hay   error,  fraude  o  ninguna   de   las   partes   sufren   consideración 
desproporcionada,  y  declaran  que  han  entendido  todos  los  términos  y  condiciones 
de este acuerdo y expresan su conformidad con todos los considerandos y cláusulas 
aquí establecidas. 
 
 
EN FE DE LO CUAL, ambas partes han ejecutado este acuerdo el día ${today.getDate().toString().padStart(2, "0")} de ${today.toLocaleString("es-ES", { month: "long" })}    
del año ${today.getFullYear()}.
 
 
 
 
 
ORGANISMO DE CERTIFICACIÓN                                    EL CLIENTE 
 
 
Representado por:                                             Representado por: 
JOSE LUIS JURADO ZURITA                                       ${data.datosGenerales.representanteLegal || ""}
`

  return content
}

// Función para generar la Solicitud de Certificación
export function generateCertificationRequest(data: any) {
  const content = `
    INSTRUCCIONES PARA COMPLETAR EL DOCUMENTO:
    Por favor, asegúrese de que al completar este formulario ha descargado el documento y lo ha
    guardado en local antes de rellenarlo. Este PDF interactivo ha de abrirse y completarse usando
    Adobe Reader/Acrobat antes de enviarlo a CEMA.
    1. Detalles de la empresa:
    Nombre del productor o empresa: ${data.datosGenerales.nombreEmpresa || ""}
    Nombre del representante legal: ${data.datosGenerales.representanteLegal || ""}
    Dirección fiscal: ${data.datosGenerales.direccionFiscal || ""}
    País: ${data.datosGenerales.pais || ""}
    C.P.: ${data.datosGenerales.codigoPostal || ""}
    RFC/RUT/CIF-NIF: ${data.datosGenerales.rfc || ""}
    Correo electrónico: ${data.datosGenerales.correo || ""}
    Teléfono: ${data.datosGenerales.telefono || ""}
    Persona de contacto: ${data.datosGenerales.personaContacto || ""}
    Celular: ${data.datosGenerales.celular || ""}
    Cargo o función: ${data.datosGenerales.cargo || ""}
    Página web: ${data.datosGenerales.paginaWeb || ""}
    Redes sociales: ${data.datosGenerales.redesSociales || ""}
  `

  return content
}

// Función para generar todos los documentos
export function generateAllDocuments(data: any) {
  return {
    serviceContract: generateServiceContract(data),
    auditAgreement: generateAuditAgreement(data),
    certificationRequest: generateCertificationRequest(data),
  }
}

// Función para convertir texto a PDF (simulada)
export function convertToPdf(content: string, filename: string) {
  // En un entorno real, aquí se utilizaría una biblioteca como jsPDF o pdfmake
  // Para este ejemplo, simplemente descargamos el texto como un archivo .txt
  const blob = new Blob([content], { type: "text/plain" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = `${filename}.txt`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
