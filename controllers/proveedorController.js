import Proveedor from "../models/Proveedor.js";
import { getAll, getById, create, update, remove } from "./BaseController.js";

export const listarProveedores = getAll(Proveedor);
export const obtenerProveedor = getById(Proveedor);
export const crearProveedor = create(Proveedor);
export const actualizarProveedor = update(Proveedor);
export const eliminarProveedor = remove(Proveedor);
