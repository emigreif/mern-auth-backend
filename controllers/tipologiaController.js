// backend/controllers/proveedorController.js
import Proveedor from "../models/Proveedor.js";
import MovimientoContable from "../models/MovimientoContable.js";

// Ejemplo: al listar Proveedores, calculamos su saldo
export const listarProveedores = async (req, res) => {
  try {
    // 1. Buscamos todos los proveedores del user
    const proveedores = await Proveedor.find({ user: req.user.id });

    // 2. Para cada uno, calculamos el saldo
    const proveedoresConSaldo = [];
    for (let prov of proveedores) {
      const saldo = await calcularSaldoProveedor(req.user.id, prov._id);
      proveedoresConSaldo.push({
        ...prov.toObject(),
        saldo
      });
    }

    return res.json(proveedoresConSaldo);
  } catch (error) {
    console.error("Error al listar proveedores:", error);
    return res.status(500).json({ message: "Error al listar proveedores" });
  }
};

// Función auxiliar
async function calcularSaldoProveedor(userId, proveedorId) {
  // Buscamos todos los movimientos contables de ese user y proveedor
  const movimientos = await MovimientoContable.find({
    user: userId,
    idProveedor: proveedorId
  });

  let saldo = 0;
  for (const mov of movimientos) {
    if (mov.tipo === "FACTURA_RECIBIDA") {
      saldo += mov.monto;  // Aumenta la deuda
    } else if (mov.tipo === "PAGO_EMITIDO") {
      saldo -= mov.monto;  // Disminuye la deuda
    }
  }
  return saldo;
}
