import Cliente from "../models/cliente.js";
import { getAll, getById, remove } from "./baseController.js";
import {
  assertValidId,
  handleMongooseError
} from "../utils/validationHelpers.js";

// Listar todos
export const listarClientes = getAll(Cliente);

// Obtener uno
export const obtenerCliente = getById(Cliente);

// Crear cliente (personalizado)
export const crearCliente = async (req, res) => {
  try {
    const newItem = new Cliente({ ...req.body, user: req.user.id });
    const savedItem = await newItem.save();
    res.status(201).json(savedItem);
  } catch (error) {
    handleMongooseError(res, error);
  }
};

// Actualizar cliente (personalizado)
export const actualizarCliente = async (req, res) => {
  try {
    const { id } = req.params;
    assertValidId(id, "Cliente");

    let cliente = await Cliente.findOne({ _id: id, user: req.user.id });
    if (!cliente) {
      return res.status(404).json({ message: "Cliente no encontrado" });
    }

    // Actualización segura y condicional
    cliente.nombre = req.body.nombre ?? cliente.nombre;
    cliente.apellido = req.body.apellido ?? cliente.apellido;
    cliente.email = req.body.email ?? cliente.email;
    cliente.telefono = req.body.telefono ?? cliente.telefono;

    if (req.body.direccion) {
      cliente.direccion.calle = req.body.direccion.calle ?? cliente.direccion.calle;
      cliente.direccion.ciudad = req.body.direccion.ciudad ?? cliente.direccion.ciudad;
    }

    if (req.body.condicionFiscal) {
      cliente.condicionFiscal = req.body.condicionFiscal;
    }

    if (req.body.razonSocial !== undefined) {
      cliente.razonSocial = req.body.razonSocial;
    }

    if (req.body.cuit !== undefined) {
      cliente.cuit = req.body.cuit;
    }

    await cliente.save();
    res.json(cliente);
  } catch (error) {
    handleMongooseError(res, error);
  }
};

// Eliminar cliente
export const eliminarCliente = remove(Cliente);
