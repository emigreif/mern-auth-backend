// backend/controllers/contabilidadController.js
import MovimientoContable from "../models/MovimientoContable.js";

/**
 * Crear un nuevo movimiento contable (factura/pago/cobro).
 */
export const crearMovimiento = async (req, res) => {
  try {
    // Se asume que req.body contiene todos los campos
    // { tipo, monto, esConFactura, fecha, fechaAcreditacion, descripcion, idProveedor, idCliente,
    //   partidasObra, subIndiceFactura, datosCheque, datosTransferencia, ... }
    const nuevo = new MovimientoContable({
      ...req.body,
      user: req.user.id
    });
    const guardado = await nuevo.save();
    return res.status(201).json(guardado);
  } catch (error) {
    console.error("Error creando movimiento:", error);
    return res.status(500).json({ message: "Error al crear movimiento", error: error.message });
  }
};
export const listarMovimientos = async (req, res) => {
  try {
    const { 
      tipo, 
      proveedor, 
      cliente, 
      obra, 
      estadoCheque, 
      desde, 
      hasta 
    } = req.query;

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
    return res.status(500).json({ message: "Error al listar", error: error.message });
  }
};
