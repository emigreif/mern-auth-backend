// backend/utils/pdfService.js
import PDFDocument from "pdfkit";

/**
 * Genera un PDF en memoria, y retorna:
 *  - pdfBuffer (Buffer con el contenido del PDF)
 *  - filename (nombre sugerido para el archivo)
 *
 * Usa los campos:
 *   user.razonSocial,
 *   numeroPedido,
 *   referenciaInterna,
 *   tipoCompra
 */
export const generarOrdenCompraPDF = async (compra) => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument();
    const buffers = [];

    // Construir nombre de archivo
    const userRazSoc = compra.user?.razonSocial ?? "SinRazonSocial";
    const numeroPedido = compra.numeroPedido ?? "NoPedido";
    const referencia = compra.referenciaInterna ?? "NoRef";
    const tipo = compra.tipoCompra ?? "Desconocido";
    const filename = `${userRazSoc}_${numeroPedido}_${referencia}_${tipo}.pdf`;

    doc.on("data", (chunk) => buffers.push(chunk));
    doc.on("end", () => {
      const pdfBuffer = Buffer.concat(buffers);
      resolve({ pdfBuffer, filename });
    });
    doc.on("error", (err) => reject(err));

    // Contenido del PDF (ejemplo)
    doc.fontSize(20).text("Orden de Compra", { align: "center" });
    doc.moveDown();

    doc.fontSize(14).text(`Número de Pedido: ${numeroPedido}`);
    doc.text(`Proveedor: ${compra.proveedor?._id || "N/A"}`);
    doc.text(`Referencia Interna: ${referencia}`);
    doc.text(`Tipo de Compra: ${tipo}`);
    doc.moveDown();

    doc.fontSize(16).text("Detalle:", { underline: true });
    // Ejemplo: si es aluminio => compra.pedido, si es vidrios => compra.vidrios, etc.
    if (compra.tipoCompra === "aluminio" && compra.pedido) {
      compra.pedido.forEach((item, i) => {
        doc.fontSize(12).text(
          `${i + 1}. ${item.descripcion} (Cód: ${item.codigo}) - Cant: ${item.cantidad}`
        );
      });
    } else if (compra.tipoCompra === "vidrios" && compra.vidrios) {
      compra.vidrios.forEach((item, i) => {
        doc.fontSize(12).text(
          `${i + 1}. ${item.descripcion} - ${item.ancho}x${item.alto} - Cant: ${item.cantidad}`
        );
      });
    } else if (compra.tipoCompra === "accesorios" && compra.accesorios) {
      compra.accesorios.forEach((item, i) => {
        doc.fontSize(12).text(
          `${i + 1}. ${item.descripcion} (Cód: ${item.codigo}) - Cant: ${item.cantidad}`
        );
      });
    } else {
      doc.fontSize(12).text("No hay detalle de productos.");
    }

    doc.end();
  });
};
