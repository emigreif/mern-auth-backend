// backend/controllers/comprasController.js
import { CompraBase, CompraAluminio, CompraVidrios, CompraAccesorios } from "../models/Compra.js";
import nodemailer from "nodemailer";
import { generarOrdenCompraPDF } from "../utils/pdfService.js";
import { sendEmailWithAttachment } from "../utils/emailService.js";

function getModel(tipo) {
  switch (tipo) {
    case "aluminio": return CompraAluminio;
    case "vidrios": return CompraVidrios;
    case "accesorios": return CompraAccesorios;
    default: return null;
  }
}

// Listar
export const listarCompras = async (req, res) => {
  try {
    const { tipo } = req.params;
    // Si tipo = "todas", se buscan todas. Sino, filtrar por tipo.
    let filter = { user: req.user.id };
    if (tipo !== "todas") {
      filter.tipo = tipo;
    }
    // Populate
    const compras = await CompraBase.find(filter)
      .populate("proveedor", "nombre emails") 
      .populate("obra", "nombre codigoObra")
      .sort({ createdAt: -1 });
    res.json(compras);
  } catch (error) {
    res.status(500).json({ message: "Error al listar compras", error: error.message });
  }
};

// Obtener
export const obtenerCompra = async (req, res) => {
  try {
    const { tipo, id } = req.params;
    // si quisieras forzar el discriminador, podrías: .findOne({ _id, tipo })
    const compra = await CompraBase.findOne({ _id: id, user: req.user.id })
      .populate("proveedor", "nombre emails")
      .populate("obra", "nombre codigoObra");
    if (!compra) return res.status(404).json({ message: "Compra no encontrada" });
    res.json(compra);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener compra", error: error.message });
  }
};

// Crear
export const crearCompra = async (req, res) => {
  try {
    const { tipo } = req.params;
    const Model = getModel(tipo);
    if (!Model) return res.status(400).json({ message: "Tipo de compra inválido" });

    const newData = { ...req.body, user: req.user.id, tipo };
    const compra = new Model(newData);
    await compra.save();

    // Generar PDF
    const pdfBuffer = await generarOrdenCompraPDF(compra, tipo);
    // Enviar correo
    // subject: "OC #<numeroOC> - Obra: <obra> - <RazónSocial> - <Tipo>"
    const subject = `OC #${compra.numeroOC} - ${req.user.razonSocial || "MiEmpresa"} - ${tipo.toUpperCase()}`;
    const text = `Estimado proveedor,\nAdjuntamos la orden de compra #${compra.numeroOC}...`;
    const to = "proveedor@correo.com"; // Podrías usar compra.proveedor.emails[0]

    const mailRes = await sendEmailWithAttachment(to, subject, text, pdfBuffer);

    res.status(201).json(compra);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: "Error al crear compra", error: error.message });
  }
};

// Actualizar
export const actualizarCompra = async (req, res) => {
  try {
    const { tipo, id } = req.params;
    const compra = await CompraBase.findOneAndUpdate(
      { _id: id, user: req.user.id },
      req.body,
      { new: true }
    );
    if (!compra) return res.status(404).json({ message: "Compra no encontrada" });
    res.json(compra);
  } catch (error) {
    res.status(400).json({ message: "Error al actualizar compra", error: error.message });
  }
};

// Eliminar (anular)
export const eliminarCompra = async (req, res) => {
  try {
    const { tipo, id } = req.params;
    const compra = await CompraBase.findOne({ _id: id, user: req.user.id });
    if (!compra) return res.status(404).json({ message: "Compra no encontrada" });

    // En lugar de borrar, marcamos estado = "anulado" y enviamos correo de anulación
    compra.estado = "anulado";
    await compra.save();

    // Enviar correo
    // subject: "Anulación OC #..."
    // etc.
    res.json({ message: "Compra anulada correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al anular compra", error: error.message });
  }
};

// Ingreso de material
export const ingresoMaterial = async (req, res) => {
  try {
    const { id } = req.params; // ID de la compra
    const { numeroRemito, items } = req.body; // items: [{ itemId, cantidadIngresada }, ...]

    const compra = await CompraBase.findOne({ _id: id, user: req.user.id });
    if (!compra) return res.status(404).json({ message: "Compra no encontrada" });

    // Guardar el remito
    compra.remitos.push({
      numeroRemito,
      fechaIngreso: new Date(),
      items,
    });

    // Actualizar cantidades ingresadas
    if (compra.tipo === "aluminio") {
      items.forEach(({ itemId, cantidadIngresada }) => {
        const item = compra.pedido.find((p) => p._id.toString() === itemId);
        if (item) {
          item.cantidadIngresada += cantidadIngresada;
        }
      });
    } else if (compra.tipo === "vidrios") {
      items.forEach(({ itemId, cantidadIngresada }) => {
        const v = compra.vidrios.find((p) => p._id.toString() === itemId);
        if (v) {
          v.cantidadIngresada += cantidadIngresada;
        }
      });
    } else if (compra.tipo === "accesorios") {
      items.forEach(({ itemId, cantidadIngresada }) => {
        const a = compra.accesorios.find((p) => p._id.toString() === itemId);
        if (a) {
          a.cantidadIngresada += cantidadIngresada;
        }
      });
    }

    // Verificar si ya se ingresó todo => estado = "completado"
    // (opcional)
    // Por ejemplo, en Aluminio => si cada item.cantidadIngresada >= item.cantidad => completado
    let completado = false; // tu lógica
    // ...
    // compra.estado = completado ? "completado" : compra.estado;

    await compra.save();
    res.json({ message: "Ingreso de material registrado" });
  } catch (error) {
    res.status(500).json({ message: "Error al ingresar material", error: error.message });
  }
};
