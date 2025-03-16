// backend/controllers/clienteController.js
import Cliente from "../models/cliente.js";
import { getAll, getById, create, update, remove } from "./BaseController.js";

/**
 * Controladores basados en BaseController (getAll, getById, create, update, remove).
 * Pero podemos agregar validaciones extras en create y update.
 */

// Listar todos
export const listarClientes = getAll(Cliente);

// Obtener uno
export const obtenerCliente = getById(Cliente);

// Crear
export const crearCliente = async (req, res) => {
  try {
    // Agregamos user: req.user.id
    const newItem = new Cliente({ ...req.body, user: req.user.id });
    const savedItem = await newItem.save(); // validación pre('save')
    res.status(201).json(savedItem);
  } catch (error) {
    // Captura error de validación si no pasa el pre('save')
    res.status(400).json({ message: error.message || "Error al crear cliente" });
  }
};

// Actualizar
export const actualizarCliente = async (req, res) => {
  try {
    const { id } = req.params;
    // Buscamos y actualizamos
    let cliente = await Cliente.findOne({ _id: id, user: req.user.id });
    if (!cliente) {
      return res.status(404).json({ message: "Cliente no encontrado" });
    }
    // Actualizamos campos
    cliente.nombre = req.body.nombre ?? cliente.nombre;
    cliente.apellido = req.body.apellido ?? cliente.apellido;
    cliente.email = req.body.email ?? cliente.email;
    cliente.telefono = req.body.telefono ?? cliente.telefono;
    // direccion
    if (req.body.direccion) {
      cliente.direccion.calle = req.body.direccion.calle ?? cliente.direccion.calle;
      cliente.direccion.ciudad = req.body.direccion.ciudad ?? cliente.direccion.ciudad;
    }
    // condicionFiscal
    if (req.body.condicionFiscal) {
      cliente.condicionFiscal = req.body.condicionFiscal;
    }
    // razonSocial, cuit
    if (req.body.razonSocial !== undefined) {
      cliente.razonSocial = req.body.razonSocial;
    }
    if (req.body.cuit !== undefined) {
      cliente.cuit = req.body.cuit;
    }

    await cliente.save(); // validación pre('save')
    res.json(cliente);
  } catch (error) {
    res.status(400).json({ message: error.message || "Error al actualizar cliente" });
  }
};

// Eliminar
export const eliminarCliente = remove(Cliente);
