import Ubicacion from "../models/Ubicacion.js";
import { getAll, getById, create, update, remove } from "./BaseController.js";

export const listarUbicaciones = getAll(Ubicacion);
export const obtenerUbicacion = getById(Ubicacion);
export const crearUbicacion = create(Ubicacion);
export const actualizarUbicacion = update(Ubicacion);
export const eliminarUbicacion = remove(Ubicacion);
