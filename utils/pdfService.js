import PDFDocument from "pdfkit";
import fs from "fs-extra";

export const generarOrdenCompraPDF = async (ordenCompra) => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument();
    const buffers = [];

    doc.on("data", (chunk) => buffers.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(buffers)));

    doc.fontSize(20).text("Orden de Compra", { align: "center" });
    doc.moveDown();

    doc.fontSize(14).text(`Orden ID: ${ordenCompra._id}`);
    doc.text(`Proveedor: ${ordenCompra.proveedor}`);
    doc.text(`Fecha: ${new Date(ordenCompra.fecha).toLocaleDateString()}`);
    doc.moveDown();

    doc.fontSize(16).text("Productos:", { underline: true });
    ordenCompra.productos.forEach((producto, index) => {
      doc.fontSize(12).text(
        `${index + 1}. ${producto.nombre} - Cantidad: ${producto.cantidad} - Precio: $${producto.precio}`
      );
    });

    doc.moveDown();
    doc.fontSize(14).text(`Total: $${ordenCompra.total}`, { bold: true });

    doc.end();
  });
};
