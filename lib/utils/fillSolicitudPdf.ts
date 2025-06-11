import { PDFDocument } from "pdf-lib";

// Mapeo de campos del formulario a los campos del PDF
const fieldMapping: Record<string, string> = {
  nombreEmpresa: "Texto1",
  representanteLegal: "Texto2",
  direccionFiscal: "Texto3",
  pais: "Texto4",
  codigoPostal: "Texto7",
  rfc: "Texto20",
  correoElectronico: "Texto19",
  telefono: "Texto6",
  personaContacto: "Texto10",
  celular: "Texto5",
  cargoFuncion: "Texto9",
  paginaWeb: "Texto8",
  redesSociales: "Texto12",
  // Ejemplo para productos
  "productos[0].nombre": "Texto21",
  "productos[0].pais": "Texto26",
  "productos[1].nombre": "Texto18",
  "productos[1].pais": "Texto17",
  "productos[2].nombre": "Texto20",
  "productos[2].pais": "Texto19",
  "productos[3].nombre": "Texto21",
  "productos[3].pais": "Texto22",
  "productos[4].nombre": "Texto23",
  "productos[4].pais": "Texto34",
  "productos[5].nombre": "Texto25",
  "productos[5].pais": "Texto26",
  "productos[6].nombre": "Texto27",
  "productos[6].pais": "Texto28",
  "productos[7].nombre": "Texto29",
  "productos[7].pais": "Texto30",
  "productos[8].nombre": "Texto31",
  "productos[8].pais": "Texto32",
  "productos[9].nombre": "Texto33",
  "productos[9].pais": "Texto34",

};

const fieldMappingCheckbox: Record<string, string> = {
  globalGAP:          "Casilla de verificación2",
  iso22000:           "Casilla de verificación1",
  primusGFS:          "Casilla de verificación3",
  fssc22000:          "Casilla de verificación4",
  iso9001:            "Casilla de verificación5",

  // … si tienes más checkboxes, aquí los agregas
};


export async function fillSolicitudPdf(formData: any, pdfUrl: string) {
  // 1. Descarga el PDF base
  const existingPdfBytes = await fetch(pdfUrl).then(res => res.arrayBuffer());

  // 2. Carga el PDF
  const pdfDoc = await PDFDocument.load(existingPdfBytes);

  // 3. Obtén el formulario del PDF
  const form = pdfDoc.getForm();
  console.log("⚙️ fillSolicitudPdf. formData =", formData);
  console.log("⚙️ fillSolicitudPdf. fieldMapping =", fieldMapping);
  const allFields = form.getFields().map((f) => f.getName());
  console.log("📑 Campos reales en el PDF:", allFields);

  // 4. Rellena los campos
  Object.entries(fieldMapping).forEach(([formKey, pdfFieldName]) => {
  let value: any = "";

  if (formKey.includes("[")) {
    // Es un campo de array, por ejemplo productos[0].nombre
    const match = formKey.match(/(\w+)\[(\d+)\]\.(\w+)/);
    if (match) {
      const [, arrayName, idx, prop] = match;
      value = formData[arrayName]?.[parseInt(idx)]?.[prop] ?? "";
    }
  } else {
    value = formData[formKey];
  }

  try {
    if (typeof value === "boolean") {
      // Es un checkbox
      const checkbox = form.getCheckBox(pdfFieldName);
      if (value) {
        checkbox.check();
      } else {
        checkbox.uncheck();
      }
    } else {
      // Es un campo de texto
      form.getTextField(pdfFieldName).setText(value || "");
    }
  } catch (e) {
    // Si el campo no existe, ignóralo
  }
});


  // 5. Guarda el PDF modificado
  const pdfBytes = await pdfDoc.save();
  return pdfBytes;
}

