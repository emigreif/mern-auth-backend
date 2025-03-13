// backend/controllers/contabilidadController.js
import MovimientoContable from "../models/MovimientoContable.js";

/**
 * Crear un nuevo movimiento contable
 */
export const crearMovimiento = async (req, res) => {
  try {
    // Asignar user
    const nuevo = new MovimientoContable({
      ...req.body,
      user: req.user.id,
    });
    const guardado = await nuevo.save();
    return res.status(201).json(guardado);
  } catch (error) {
    console.error("Error creando movimiento:", error);
    return res.status(500).json({ message: "Error al crear movimiento" });
  }
};

/**
 * Listar movimientos (con filtros opcionales):
 * - tipo (PAGO_EMITIDO, PAGO_RECIBIDO, etc.)
 * - metodoPago (efectivo, cheque, etc.)
 * - fechaDesde / fechaHasta
 * - obra
 * - proveedor
 * - cliente
 */
export const listarMovimientos = async (req, res) => {
  try {
    const {
      tipo,
      metodoPago,
      fechaDesde,
      fechaHasta,
      obra,
      proveedor,
      cliente,
    } = req.query;

    // Filtrar por user
    const filtro = { user: req.user.id };

    if (tipo) filtro.tipo = tipo;
    if (metodoPago) filtro.metodoPago = metodoPago;
    if (obra) filtro.obra = obra;
    if (proveedor) filtro.proveedor = proveedor;
    if (cliente) filtro.cliente = cliente;

    // Filtrar por fecha
    if (fechaDesde || fechaHasta) {
      filtro.fecha = {};
      if (fechaDesde) {
        filtro.fecha.$gte = new Date(fechaDesde);
      }
      if (fechaHasta) {
        filtro.fecha.$lte = new Date(fechaHasta);
      }
    }

    // Populate para obra, proveedor, cliente
    const movs = await MovimientoContable.find(filtro)
      .populate("obra", "nombre codigoObra") // solo campos de la obra que quieras
      .populate("proveedor", "nombre rubro")
      .populate("cliente", "nombre apellido")
      .sort({ fecha: -1 });

    return res.json(movs);
  } catch (error) {
    console.error("Error listando movimientos:", error);
    return res.status(500).json({ message: "Error al listar" });
  }
};

/**
 * Obtener un movimiento por ID
 */
export const obtenerMovimiento = async (req, res) => {
  try {
    const mov = await MovimientoContable.findOne({
      _id: req.params.id,
      user: req.user.id,
    })
      .populate("obra", "nombre codigoObra")
      .populate("proveedor", "nombre rubro")
      .populate("cliente", "nombre apellido");
    if (!mov) {
      return res.status(404).json({ message: "Movimiento no encontrado" });
    }
    return res.json(mov);
  } catch (error) {
    console.error("Error obteniendo movimiento:", error);
    return res.status(500).json({ message: "Error al obtener movimiento" });
  }
};

/**
 * Actualizar un movimiento
 */
export const actualizarMovimiento = async (req, res) => {
  try {
    const updated = await MovimientoContable.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      { new: true }
    );
    if (!updated) {
      return res.status(404).json({ message: "Movimiento no encontrado" });
    }
    return res.json(updated);
  } catch (error) {
    console.error("Error actualizando movimiento:", error);
    return res.status(500).json({ message: "Error al actualizar movimiento" });
  }
};

/**
 * Eliminar un movimiento
 */
export const eliminarMovimiento = async (req, res) => {
  try {
    const deleted = await MovimientoContable.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });
    if (!deleted) {
      return res.status(404).json({ message: "Movimiento no encontrado" });
    }
    return res.json({ message: "Movimiento eliminado" });
  } catch (error) {
    console.error("Error eliminando movimiento:", error);
    return res.status(500).json({ message: "Error al eliminar movimiento" });
  }
};
