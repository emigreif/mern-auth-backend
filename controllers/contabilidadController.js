import MovimientoContable from "../models/movimientoContable.js";
import {
  assertValidId,
  handleMongooseError
} from "../utils/validationHelpers.js";

// Crear nuevo movimiento contable
export const crearMovimiento = async (req, res) => {
  try {
    const nuevo = new MovimientoContable({
      ...req.body,
      user: req.user.id
    });
    const guardado = await nuevo.save();
    return res.status(201).json(guardado);
  } catch (error) {
    handleMongooseError(res, error);
  }
};

// Listar movimientos con filtros
export const listarMovimientos = async (req, res) => {
  try {
    const { tipo, proveedor, cliente, obra, estadoCheque, desde, hasta } = req.query;
    const filtro = { user: req.user.id };

    if (tipo) filtro.tipo = tipo;
    if (proveedor) filtro.idProveedor = proveedor;
    if (cliente) filtro.idCliente = cliente;
    if (obra) filtro["partidasObra.obra"] = obra;
    if (estadoCheque) filtro["datosCheque.estadoCheque"] = estadoCheque;
    if (desde || hasta) {
      filtro.fecha = {};
      if (desde) filtro.fecha.$gte = new Date(desde);
      if (hasta) filtro.fecha.$lte = new Date(hasta);
    }

    const movs = await MovimientoContable.find(filtro)
      .populate("idProveedor", "nombre")
      .populate("idCliente", "nombre")
      .populate("partidasObra.obra", "nombre")
      .sort({ fecha: -1 });

    return res.json(movs);
  } catch (error) {
    handleMongooseError(res, error);
  }
};

// Obtener un movimiento contable
export const obtenerMovimiento = async (req, res) => {
  try {
    const { id } = req.params;
    assertValidId(id, "Movimiento");

    const mov = await MovimientoContable.findOne({
      _id: id,
      user: req.user.id
    })
      .populate("idObra")
      .populate("idProveedor")
      .populate("idCliente");

    if (!mov) {
      return res.status(404).json({ message: "Movimiento no encontrado" });
    }

    return res.json(mov);
  } catch (error) {
    handleMongooseError(res, error);
  }
};

// Actualizar movimiento
export const actualizarMovimiento = async (req, res) => {
  try {
    const { id } = req.params;
    assertValidId(id, "Movimiento");

    const updated = await MovimientoContable.findOneAndUpdate(
      { _id: id, user: req.user.id },
      req.body,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Movimiento no encontrado" });
    }

    return res.json(updated);
  } catch (error) {
    handleMongooseError(res, error);
  }
};

// Eliminar movimiento
export const eliminarMovimiento = async (req, res) => {
  try {
    const { id } = req.params;
    assertValidId(id, "Movimiento");

    const deleted = await MovimientoContable.findOneAndDelete({
      _id: id,
      user: req.user.id
    });

    if (!deleted) {
      return res.status(404).json({ message: "Movimiento no encontrado" });
    }

    return res.json({ message: "Movimiento eliminado correctamente" });
  } catch (error) {
    handleMongooseError(res, error);
  }
};
