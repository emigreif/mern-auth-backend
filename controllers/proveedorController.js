// controllers/presupuestoController.js
import Presupuesto from "../models/Cresupuesto.js";
import { getById, create, update, remove } from "./baseController.js";

export const obtenerPresupuesto = getById(Presupuesto);
export const crearPresupuesto = create(Presupuesto);
export const actualizarPresupuesto = update(Presupuesto);
export const eliminarPresupuesto = remove(Presupuesto);

export const listarPresupuestos = async (req, res) => {
  try {
    const data = await Presupuesto.find({ user: req.user.id }).populate(
      "cliente",
      "nombre apellido"
    );
    res.json(data);
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener presupuestos",
      error: error.message
    });
  }
};
