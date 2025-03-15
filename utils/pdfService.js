// backend/utils/pdfService.js
import PDFDocument from "pdfkit";

/**
 * Genera un PDF de la Orden de Compra
 * @param {Object} compra - Documento de compra (con tipo, númeroOC, etc.)
 * @param {String} tipo   - "aluminio", "vidrios" o "accesorios"
 * @returns {Promise<Buffer>} - Buffer con el contenido del PDF
 */
export async function generarOrdenCompraPDF(compra, tipo) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument();
    const buffers = [];

    doc.on("data", (chunk) => buffers.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(buffers)));
    doc.on("error", (err) => reject(err));

    // Título
    doc.fontSize(20).text(`Orden de Compra #${compra.numeroOC}`, { align: "center" });
    doc.moveDown();

    // Info principal
    doc.fontSize(14).text(`Tipo de compra: ${tipo.toUpperCase()}`);
    doc.text(`Estado: ${compra.estado || "pendiente"}`);
    doc.text(`Fecha creación: ${new Date(compra.createdAt).toLocaleDateString()}`);
    doc.moveDown();

    if (compra.obra) {
      doc.text(`Obra: ${compra.obra.nombre || "N/D"}`);
      doc.text(`Código Obra: ${compra.obra.codigoObra || "N/D"}`);
      doc.moveDown();
    }

    if (compra.proveedor) {
      doc.text(`Proveedor: ${compra.proveedor.nombre || "N/D"}`);
      doc.moveDown();
    }

    // Ítems
    doc.fontSize(16).text("Ítems:", { underline: true });
    doc.moveDown(0.5);

    if (tipo === "aluminio" && Array.isArray(compra.pedido)) {
      compra.pedido.forEach((item, idx) => {
        doc.fontSize(12).text(
          `${idx + 1}. Código: ${item.codigo}, Descripción: ${item.descripcion}, Largo: ${item.largo}, Cantidad: ${item.cantidad}`
        );
      });
    } else if (tipo === "vidrios" && Array.isArray(compra.vidrios)) {
      compra.vidrios.forEach((item, idx) => {
        doc.fontSize(12).text(
          `${idx + 1}. Código: ${item.codigo}, Desc: ${item.descripcion}, ${item.ancho}x${item.alto}, Cant: ${item.cantidad}`
        );
      });
    } else if (tipo === "accesorios" && Array.isArray(compra.accesorios)) {
      compra.accesorios.forEach((item, idx) => {
        doc.fontSize(12).text(
          `${idx + 1}. Código: ${item.codigo}, Desc: ${item.descripcion}, Color: ${item.color}, Cant: ${item.cantidad}`
        );
      });
    } else {
      doc.text("No se encontró listado de ítems para este tipo de compra.");
    }

    doc.end();
  });
}
