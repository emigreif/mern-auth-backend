// backend/controllers/contabilidadController.js
import MovimientoContable from "../models/MovimientoContable.js";
import { create } from "./BaseController.js";

export const crearMovimiento = create(MovimientoContable);

export const listarMovimientos = async (req, res) => {
  try {
    const movs = await MovimientoContable.find({ user: req.user.id })
      .populate("idObra")
      .populate("idProveedor")
      .populate("idCliente")
      .sort({ fecha: -1 });
    return res.json(movs);
  } catch (error) {
    console.error("Error listando movimientos:", error);
    return res.status(500).json({ message: "Error al listar" });
  }
};
