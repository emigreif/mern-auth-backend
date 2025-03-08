import Cliente from "../models/Cliente.js";
import { getAll, getById, create, update, remove } from "./BaseController.js";

export const listarClientes = getAll(Cliente);
export const obtenerCliente = getById(Cliente);
export const crearCliente = create(Cliente);
export const actualizarCliente = update(Cliente);
export const eliminarCliente = remove(Cliente);
