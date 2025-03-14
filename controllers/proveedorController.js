// backend/controllers/proveedorController.js
import Proveedor from "../models/Proveedor.js";
import MovimientoContable from "../models/MovimientoContable.js";

export const crearProveedor = async (req, res) => {
  try {
    const nuevo = new Proveedor({
      ...req.body,
      user: req.user.id
    });
    const guardado = await nuevo.save();
    res.status(201).json(guardado);
  } catch (error) {
    console.error("Error al crear proveedor:", error);
    res.status(500).json({ message: "Error al crear proveedor", error: error.message });
  }
};

export const listarProveedores = async (req, res) => {
  try {
    const proveedores = await Proveedor.find({ user: req.user.id });
    const proveedoresConSaldo = [];

    for (let prov of proveedores) {
      const saldo = await calcularSaldoProveedor(req.user.id, prov._id);
      proveedoresConSaldo.push({
        ...prov.toObject(),
        saldo
      });
    }

    res.json(proveedoresConSaldo);
  } catch (error) {
    console.error("Error al listar proveedores:", error);
    res.status(500).json({ message: "Error al listar proveedores", error: error.message });
  }
};
// Obtener un proveedor por ID
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
    res.status(500).json({ message: "Error al obtener proveedor" });
  }
};

// **Actualizar** un proveedor por ID
export const actualizarProveedor = async (req, res) => {
  try {
    const { id } = req.params;
    const proveedorActualizado = await Proveedor.findOneAndUpdate(
      { _id: id, user: req.user.id },
      req.body,
      { new: true }
    );
    if (!proveedorActualizado) {
      return res.status(404).json({ message: "Proveedor no encontrado" });
    }
    res.json(proveedorActualizado);
  } catch (error) {
    console.error("Error al actualizar proveedor:", error);
    res.status(500).json({ message: "Error al actualizar proveedor" });
  }
};

// Eliminar un proveedor
export const eliminarProveedor = async (req, res) => {
  try {
    const { id } = req.params;
    const proveedorEliminado = await Proveedor.findOneAndDelete({ _id: id, user: req.user.id });
    if (!proveedorEliminado) {
      return res.status(404).json({ message: "Proveedor no encontrado" });
    }
    res.json({ message: "Proveedor eliminado correctamente" });
  } catch (error) {
    console.error("Error al eliminar proveedor:", error);
    res.status(500).json({ message: "Error al eliminar proveedor" });
  }
};

/**
 * Ejemplo de cálculo de saldo: 
 *   - sum(FacturasRecibidas) -> Aumenta la deuda
 *   - sum(PagosEmitidos) -> Disminuye la deuda
 *   - CHEQUE_EMITIDO, EFECTIVO_EMITIDO, TRANSFERENCIA_EMITIDA => se considera "PagoEmitido"
 */
async function calcularSaldoProveedor(userId, proveedorId) {
  const movimientos = await MovimientoContable.find({
    user: userId,
    idProveedor: proveedorId
  });

  let saldo = 0;
  for (const mov of movimientos) {
    if (mov.tipo === "FACTURA_RECIBIDA") {
      saldo += mov.monto;
    } else if (
      mov.tipo === "PAGO_EMITIDO" ||
      mov.tipo === "CHEQUE_EMITIDO" ||
      mov.tipo === "EFECTIVO_EMITIDO" ||
      mov.tipo === "TRANSFERENCIA_EMITIDA"
    ) {
      saldo -= mov.monto;
    }
  }
  return saldo;
}
