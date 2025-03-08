import Presupuesto from "../models/Presupuesto.js";
import { getAll, getById, create, update, remove } from "./BaseController.js";

export const listarPresupuestos = getAll(Presupuesto);
export const obtenerPresupuesto = getById(Presupuesto);
export const crearPresupuesto = create(Presupuesto);
export const actualizarPresupuesto = update(Presupuesto);
export const eliminarPresupuesto = remove(Presupuesto);
