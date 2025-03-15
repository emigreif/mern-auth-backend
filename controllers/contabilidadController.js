// controllers/contabilidadController.js
import MovimientoContable from "../models/movimientoContable.js";

/**
 * Crear un nuevo movimiento contable (factura/pago/cobro).
 */
export const crearMovimiento = async (req, res) => {
  try {
    const nuevo = new MovimientoContable({
      ...req.body,
      user: req.user.id
    });
    const guardado = await nuevo.save();
    return res.status(201).json(guardado);
  } catch (error) {
    console.error("Error creando movimiento:", error);
    return res
      .status(500)
      .json({ message: "Error al crear movimiento", error: error.message });
  }
};

export const listarMovimientos = async (req, res) => {
  try {
    const { tipo, proveedor, cliente, obra, estadoCheque, desde, hasta } =
      req.query;

    const filtro = { user: req.user.id };

    if (tipo) filtro.tipo = tipo;
    if (proveedor) filtro.idProveedor = proveedor;
    if (cliente) filtro.idCliente = cliente;
    if (obra) {
      filtro["partidasObra.obra"] = obra;
    }
    if (estadoCheque) {
      filtro["datosCheque.estadoCheque"] = estadoCheque;
    }
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
    console.error("Error listando movimientos:", error);
    return res
      .status(500)
      .json({ message: "Error al listar", error: error.message });
  }
};

export const obtenerMovimiento = async (req, res) => {
  try {
    const { id } = req.params;
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
    console.error("Error obteniendo movimiento:", error);
    return res
      .status(500)
      .json({ message: "Error al obtener movimiento", error: error.message });
  }
};

export const actualizarMovimiento = async (req, res) => {
  try {
    const { id } = req.params;
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
    console.error("Error actualizando movimiento:", error);
    return res
      .status(500)
      .json({ message: "Error al actualizar movimiento", error: error.message });
  }
};

export const eliminarMovimiento = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await MovimientoContable.findOneAndDelete({
      _id: id,
      user: req.user.id
    });
    if (!deleted) {
      return res.status(404).json({ message: "Movimiento no encontrado" });
    }
    return res.json({ message: "Movimiento eliminado correctamente" });
  } catch (error) {
    console.error("Error eliminando movimiento:", error);
    return res
      .status(500)
      .json({ message: "Error al eliminar movimiento", error: error.message });
  }
};
