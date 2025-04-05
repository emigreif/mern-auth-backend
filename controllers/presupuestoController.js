import Presupuesto from "../models/presupuesto.js";
import { getById, create, update, remove } from "./baseController.js";
import { handleMongooseError } from "../utils/validationHelpers.js";

/**
 * 📌 Listar todos los presupuestos del usuario autenticado
 */
export const listarPresupuestos = async (req, res) => {
  try {
    const data = await Presupuesto.find({ user: req.user.id }).populate("cliente", "nombre apellido");
    res.json(data);
  } catch (error) {
    console.error("Error al obtener presupuestos:", error);
    handleMongooseError(res, error);
  }
};

/**
 * 📌 Obtener un presupuesto por ID (con baseController)
 */
export const obtenerPresupuesto = getById(Presupuesto);

/**
 * 📌 Crear un presupuesto nuevo (con baseController)
 */
export const crearPresupuesto = create(Presupuesto);

/**
 * 📌 Actualizar un presupuesto (con baseController)
 */
export const actualizarPresupuesto = update(Presupuesto);

/**
 * 📌 Eliminar un presupuesto (con baseController)
 */
export const eliminarPresupuesto = remove(Presupuesto);
