// backend/controllers/contabilidadController.js
import MovimientoContable from '../models/MovimientoContable.js';

export const crearMovimiento = async (req, res) => {
  try {
    const mov = new MovimientoContable({ ...req.body, user: req.user.id });
    const guardado = await mov.save();
    return res.status(201).json(guardado);
  } catch (error) {
    console.error("Error creando movimiento:", error);
    return res.status(500).json({ message: "Error al crear movimiento" });
  }
};

export const listarMovimientos = async (req, res) => {
  try {
    const movs = await MovimientoContable.find({ user: req.user.id })
      .populate('idObra')
      .populate('idProveedor')
      .populate('idCliente')
      .sort({ fecha: -1 });
    return res.json(movs);
  } catch (error) {
    console.error("Error listando movimientos:", error);
    return res.status(500).json({ message: "Error al listar" });
  }
};
