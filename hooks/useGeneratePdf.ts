import { useCallback } from "react";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";  
import { CEMA_LOGO } from "@/app/src/utils/cemaLogo";

/**
 * Hook que genera un PDF con texto real usando jsPDF v2 + plugin html
 * Se carga únicamente en el cliente para evitar “document is not defined”
 */
export const useGeneratePdf = () => {
  return async (root: HTMLElement, fileName: string, title: string) => {
    const { jsPDF } = await import("jspdf");     // opcional: import dinámico

    const pdf        = new jsPDF({ unit: "pt", format: "a4", orientation: "portrait" });
    const pageWidth  = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin     = 40;

    root.style.width    = `${pageWidth - margin * 2}px`;
    root.style.maxWidth = "none";

    await pdf.html(root, {
      margin: [margin, margin, margin, margin],
      x: margin,
      y: margin,
      width: pageWidth - margin * 2,
      html2canvas: { scale: 0.9 },
      autoPaging: "text",

      /** ⬇️ Aquí añadimos header & footer */
      callback: (doc) => {
        const total = doc.getNumberOfPages();
        for (let p = 1; p <= total; p++) {
          doc.setPage(p);
          addHeader(doc, pageWidth, title);
          addFooter(doc, p, total, pageWidth, pageHeight);
        }
        doc.save(fileName);
      },
    });
  };
};

/* helpers actualizados — usan la anchura real de la página en pt */
const addHeader = (doc: jsPDF, pw: number, title: string) => {
  const marginX = 40;
  const logoW   = 60;  // ~20 mm
  const logoH   = 18;  // mantiene proporción

  doc.addImage(CEMA_LOGO, "PNG", marginX, 15, logoW, logoH);

  doc
    .setFont("Segoe UI", "normal")
    .setFontSize(11)
    .setTextColor(0, 83, 155)
    .text(title, pw - marginX, 28, { align: "right" });

  doc.setDrawColor(0, 83, 155)
     .setLineWidth(0.4)
     .line(marginX, 40, pw - marginX, 40);
};


const addFooter = (doc: any, page: number, total: number, pw: number, ph: number) => {
  const y = ph - 40;                             // 40 pt desde el borde inferior
  doc.setDrawColor(0, 83, 155).line(40, y, pw - 40, y);

  doc.setFontSize(8)
     .setTextColor(0, 83, 155)
     .text("CEMA International Compliance Services S.A. de C.V.", pw / 2, y + 10, { align: "center" })
     .text("www.cemacertificacion.com",              pw / 2, y + 18, { align: "center" });

  doc.setTextColor(127, 140, 141)
     .text(`Página ${page} de ${total}`, pw - 40, y + 10, { align: "right" });
};
