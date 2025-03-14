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

// etc. obtenerProveedor, actualizarProveedor, eliminarProveedor

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
