import {
  CompraBase,
  CompraAluminio,
  CompraVidrios,
  CompraAccesorios
} from "../models/compra.js";
import { generarOrdenCompraPDF } from "../utils/pdfService.js";
import { sendEmailWithAttachment } from "../utils/emailService.js";
import {
  assertValidId,
  handleMongooseError
} from "../utils/validationHelpers.js";

// Obtener modelo por tipo
function getModel(tipo) {
  switch (tipo) {
    case "aluminio":
      return CompraAluminio;
    case "vidrios":
      return CompraVidrios;
    case "accesorios":
      return CompraAccesorios;
    default:
      return null;
  }
}

// Listar compras
export const listarCompras = async (req, res) => {
  try {
    const { tipo } = req.params;
    let filter = { user: req.user.id };

    if (tipo !== "todas") {
      filter.tipo = tipo;
    }

    const compras = await CompraBase.find(filter)
      .populate("proveedor", "nombre emails")
      .populate("obra", "nombre codigoObra")
      .sort({ createdAt: -1 });

    res.json(compras);
  } catch (error) {
    handleMongooseError(res, error);
  }
};

// Obtener compra
export const obtenerCompra = async (req, res) => {
  try {
    const { tipo, id } = req.params;
    assertValidId(id, "Compra");

    const compra = await CompraBase.findOne({ _id: id, user: req.user.id })
      .populate("proveedor", "nombre emails")
      .populate("obra", "nombre codigoObra");

    if (!compra) {
      return res.status(404).json({ message: "Compra no encontrada" });
    }

    res.json(compra);
  } catch (error) {
    handleMongooseError(res, error);
  }
};

// Crear compra
export const crearCompra = async (req, res) => {
  try {
    const { tipo } = req.params;
    const Model = getModel(tipo);

    if (!Model) {
      return res.status(400).json({ message: "Tipo de compra inválido" });
    }

    const newData = { ...req.body, user: req.user.id, tipo };
    const compra = new Model(newData);
    await compra.save();

    const pdfBuffer = await generarOrdenCompraPDF(compra, tipo);
    const subject = `OC #${compra.numeroOC} - ${req.user.razonSocial || "MiEmpresa"} - ${tipo.toUpperCase()}`;
    const text = `Estimado proveedor,\nAdjuntamos la orden de compra #${compra.numeroOC}...`;
    const to = "proveedor@correo.com"; // Considerar usar compra.proveedor.emails[0]

    await sendEmailWithAttachment(to, subject, text, pdfBuffer);

    res.status(201).json(compra);
  } catch (error) {
    console.error(error);
    handleMongooseError(res, error);
  }
};

// Actualizar compra
export const actualizarCompra = async (req, res) => {
  try {
    const { tipo, id } = req.params;
    assertValidId(id, "Compra");

    const compra = await CompraBase.findOneAndUpdate(
      { _id: id, user: req.user.id },
      req.body,
      { new: true }
    );

    if (!compra) {
      return res.status(404).json({ message: "Compra no encontrada" });
    }

    res.json(compra);
  } catch (error) {
    handleMongooseError(res, error);
  }
};

// Anular compra
export const eliminarCompra = async (req, res) => {
  try {
    const { tipo, id } = req.params;
    assertValidId(id, "Compra");

    const compra = await CompraBase.findOne({ _id: id, user: req.user.id });
    if (!compra) {
      return res.status(404).json({ message: "Compra no encontrada" });
    }

    compra.estado = "anulado";
    await compra.save();

    res.json({ message: "Compra anulada correctamente" });
  } catch (error) {
    handleMongooseError(res, error);
  }
};

// Ingreso de material
export const ingresoMaterial = async (req, res) => {
  try {
    const { id } = req.params;
    assertValidId(id, "Compra");

    const { numeroRemito, items } = req.body;

    const compra = await CompraBase.findOne({ _id: id, user: req.user.id });
    if (!compra) {
      return res.status(404).json({ message: "Compra no encontrada" });
    }

    compra.remitos.push({
      numeroRemito,
      fechaIngreso: new Date(),
      items
    });

    if (compra.tipo === "aluminio") {
      items.forEach(({ itemId, cantidadIngresada }) => {
        const item = compra.pedido.find((p) => p._id.toString() === itemId);
        if (item) item.cantidadIngresada += cantidadIngresada;
      });
    } else if (compra.tipo === "vidrios") {
      items.forEach(({ itemId, cantidadIngresada }) => {
        const v = compra.vidrios.find((p) => p._id.toString() === itemId);
        if (v) v.cantidadIngresada += cantidadIngresada;
      });
    } else if (compra.tipo === "accesorios") {
      items.forEach(({ itemId, cantidadIngresada }) => {
        const a = compra.accesorios.find((p) => p._id.toString() === itemId);
        if (a) a.cantidadIngresada += cantidadIngresada;
      });
    }

    await compra.save();
    res.json({ message: "Ingreso de material registrado" });
  } catch (error) {
    handleMongooseError(res, error);
  }
};
