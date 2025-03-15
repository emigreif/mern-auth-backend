// controllers/clienteController.js
import Cliente from "../models/cliente.js";
import { getAll, getById, create, update, remove } from "./baseController.js";

export const listarClientes = getAll(Cliente);
export const obtenerCliente = getById(Cliente);
export const crearCliente = create(Cliente);
export const actualizarCliente = update(Cliente);
export const eliminarCliente = remove(Cliente);
