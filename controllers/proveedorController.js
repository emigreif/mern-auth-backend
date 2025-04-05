import Proveedor from "../models/proveedor.js";
import MovimientoContable from "../models/movimientoContable.js";
import { handleMongooseError } from "../utils/validationHelpers.js";

/**
 * 📌 Crear nuevo proveedor
 */
export const crearProveedor = async (req, res) => {
  try {
    const nuevo = new Proveedor({ ...req.body, user: req.user.id });
    const guardado = await nuevo.save();
    res.status(201).json(guardado);
  } catch (error) {
    console.error("Error al crear proveedor:", error);
    handleMongooseError(res, error);
  }
};

/**
 * 📌 Listar proveedores con cálculo de saldo
 */
export const listarProveedores = async (req, res) => {
  try {
    const proveedores = await Proveedor.find({ user: req.user.id });
    const proveedoresConSaldo = await Promise.all(
      proveedores.map(async (prov) => {
        const saldo = await calcularSaldoProveedor(req.user.id, prov._id);
        return { ...prov.toObject(), saldo };
      })
    );

    res.json(proveedoresConSaldo);
  } catch (error) {
    console.error("Error al listar proveedores:", error);
    handleMongooseError(res, error);
  }
};

/**
 * 📌 Obtener proveedor por ID
 */
export const obtenerProveedor = async (req, res) => {
  try {
    const { id } = req.params;
    const proveedor = await Proveedor.findOne({ _id: id, user: req.user.id });
    if (!proveedor) {
      return res.status(404).json({ message: "Proveedor no encontrado" });
    }
    res.json(proveedor);
  } catch (error) {
    console.error("Error al obtener proveedor:", error);
    handleMongooseError(res, error);
  }
};

/**
 * 📌 Actualizar proveedor
 */
export const actualizarProveedor = async (req, res) => {
  try {
    const { id } = req.params;
    const actualizado = await Proveedor.findOneAndUpdate(
      { _id: id, user: req.user.id },
      req.body,
      { new: true }
    );

    if (!actualizado) {
      return res.status(404).json({ message: "Proveedor no encontrado" });
    }

    res.json(actualizado);
  } catch (error) {
    console.error("Error al actualizar proveedor:", error);
    handleMongooseError(res, error);
  }
};

/**
 * 📌 Eliminar proveedor
 */
export const eliminarProveedor = async (req, res) => {
  try {
    const { id } = req.params;
    const eliminado = await Proveedor.findOneAndDelete({ _id: id, user: req.user.id });

    if (!eliminado) {
      return res.status(404).json({ message: "Proveedor no encontrado" });
    }

    res.json({ message: "Proveedor eliminado correctamente" });
  } catch (error) {
    console.error("Error al eliminar proveedor:", error);
    handleMongooseError(res, error);
  }
};

/**
 * 🔢 Calcular saldo del proveedor (facturas menos pagos)
 */
async function calcularSaldoProveedor(userId, proveedorId) {
  const movimientos = await MovimientoContable.find({
    user: userId,
    idProveedor: proveedorId
  });

  return movimientos.reduce((saldo, mov) => {
    if (mov.tipo === "FACTURA_RECIBIDA") {
      return saldo + mov.monto;
    } else if (
      ["PAGO_EMITIDO", "CHEQUE_EMITIDO", "EFECTIVO_EMITIDO", "TRANSFERENCIA_EMITIDA"].includes(mov.tipo)
    ) {
      return saldo - mov.monto;
    }
    return saldo;
  }, 0);
}
