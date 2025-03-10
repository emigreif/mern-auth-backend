// backend/controllers/comprasController.js
import { CompraAluminio, CompraVidrios, CompraAccesorios } from "../models/Compra.js";
import { getAll, getById, create, update, remove } from "./BaseController.js";
import { generarOrdenCompraPDF } from "../utils/pdfService.js";
import { sendEmailWithAttachment } from "../utils/emailService.js";

// Función auxiliar para seleccionar el modelo según el tipo de compra
const getModel = (tipo) => {
  switch (tipo) {
    case "aluminio": return CompraAluminio;
    case "vidrios": return CompraVidrios;
    case "accesorios": return CompraAccesorios;
    default: return null;
  }
};

// CRUD básico (apoyado en BaseController)
export const listarCompras = (req, res) => {
  const Model = getModel(req.params.tipo);
  if (!Model) return res.status(400).json({ message: "Tipo de compra inválido" });
  return getAll(Model)(req, res);
};

export const obtenerCompra = (req, res) => {
  const Model = getModel(req.params.tipo);
  if (!Model) return res.status(400).json({ message: "Tipo de compra inválido" });
  return getById(Model)(req, res);
};

export const crearCompra = (req, res) => {
  const Model = getModel(req.params.tipo);
  if (!Model) return res.status(400).json({ message: "Tipo de compra inválido" });
  return create(Model)(req, res);
};

export const actualizarCompra = (req, res) => {
  const Model = getModel(req.params.tipo);
  if (!Model) return res.status(400).json({ message: "Tipo de compra inválido" });
  return update(Model)(req, res);
};

export const eliminarCompra = (req, res) => {
  const Model = getModel(req.params.tipo);
  if (!Model) return res.status(400).json({ message: "Tipo de compra inválido" });
  return remove(Model)(req, res);
};

// Nuevo: Enviar orden de compra por correo (PDF)
export const enviarOrdenCompra = async (req, res) => {
  try {
    const Model = getModel(req.params.tipo);
    if (!Model) {
      return res.status(400).json({ message: "Tipo de compra inválido" });
    }

    // Buscar la compra asegurando que pertenece al usuario
    const compra = await Model.findOne({ _id: req.params.id, user: req.user.id })
      .populate("user")      // Para acceder a user.razonSocial
      .populate("proveedor"); // Para acceder a proveedor.emails (u otro campo)

    if (!compra) {
      return res.status(404).json({ message: "Compra no encontrada" });
    }

    // Generar PDF en memoria
    const { pdfBuffer, filename } = await generarOrdenCompraPDF(compra);

    // Construir asunto del correo (usa los campos del modelo)
    const subject = `Orden de Compra: ${compra.user.razonSocial} - ${compra.numeroPedido} - ${compra.tipoCompra}`;
    const text = "Adjuntamos la orden de compra en formato PDF.";

    // Obtener el email del proveedor (ejemplo: primer email del array)
    let proveedorEmail = "proveedor@example.com";
    if (compra.proveedor && compra.proveedor.emails && compra.proveedor.emails.length > 0) {
      proveedorEmail = compra.proveedor.emails[0];
    }

    // Enviar correo
    const emailResult = await sendEmailWithAttachment({
      to: proveedorEmail,
      subject,
      text,
      pdfBuffer,
      pdfFilename: filename
    });

    if (!emailResult.success) {
      return res.status(500).json({ message: "Error al enviar el correo" });
    }

    res.json({ message: "Correo enviado correctamente" });
  } catch (error) {
    console.error("Error en enviarOrdenCompra:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};
