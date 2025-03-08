import Medicion from "../models/Medicion.js";
import { getAll, getById, create, update, remove } from "./BaseController.js";

export const listarMediciones = getAll(Medicion);
export const obtenerMedicion = getById(Medicion);
export const crearMedicion = create(Medicion);
export const actualizarMedicion = update(Medicion);
export const eliminarMedicion = remove(Medicion);
