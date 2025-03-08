import Obra from "../models/Obra.js";
import { getAll, getById, create, update, remove } from "./BaseController.js";

export const listarObras = getAll(Obra);
export const obtenerObra = getById(Obra);
export const crearObra = create(Obra);
export const actualizarObra = update(Obra);
export const eliminarObra = remove(Obra);
