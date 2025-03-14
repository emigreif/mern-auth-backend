// backend/utils/pdfService.js
import PDFDocument from "pdfkit";

export async function generarOrdenCompraPDF(compra, tipo) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument();
    const buffers = [];
    doc.on("data", (chunk) => buffers.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(buffers)));

    doc.fontSize(20).text(`Orden de Compra #${compra.numeroOC}`, { align: "center" });
    doc.moveDown();

    // Ejemplo: Imprimir obra, proveedor, etc.
    doc.fontSize(14).text(`Proveedor: ${compra.proveedor}`);
    doc.text(`Obra: ${compra.obra}`);
    doc.text(`Fecha: ${new Date(compra.createdAt).toLocaleDateString()}`);
    doc.moveDown();

    doc.text(`Tipo de compra: ${tipo}`);
    // Imprimir ítems
    if (tipo === "aluminio") {
      doc.text(`Perfiles:`);
      compra.pedido.forEach((p, idx) => {
        doc.text(`${idx+1}. ${p.codigo} - ${p.descripcion} (Largo: ${p.largo}, Cantidad: ${p.cantidad})`);
      });
    }
    // etc.

    doc.end();
  });
}
