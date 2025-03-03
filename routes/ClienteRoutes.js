
import express from 'express';
import cliente from '../models/Cliente.js';

const router = express.Router();    

// Obtener todos los clientes

router.get('/', async (req, res) => {
  try {
    const clientes = await cliente.find();
    res.json(clientes);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener clientes', error });
  }
});

// Obtener un cliente por ID

router.get('/:id', getCliente, async (req, res) => {
  res.json(res.cliente);
});

// Crear un nuevo cliente

router.post('/', async (req, res) => {
  const cliente = new n(req.body);
  try {
    const nuevoCliente = await cliente.save();
    res.status(201).json(nuevoCliente);
  } catch (error) {
    res.status(400).json({ message: 'Error al crear el cliente', error });
  }
});

// Actualizar un cliente

router.put('/:id', getCliente, async (req, res) => {
  if (req.body.nombre) res.cliente.nombre = req.body.nombre;
  if (req.body.apellido) res.cliente.apellido = req.body.apellido;
  if (req.body.telefono) res.cliente.telefono = req.body.telefono;

  try {
    const clienteActualizado = await res.cliente.save();
    res.json(clienteActualizado);
  } catch (error) {
    res.status(400).json({ message: 'Error al actualizar el cliente', error });
  }
});

// Eliminar un cliente

router.delete('/:id', getCliente, async (req, res) => {
  try {
    await res.cliente.remove();
    res.json({ message: 'Cliente eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar el cliente', error });
  }
});

async function getCliente(req, res, next) {
    try {
    const cliente = await n.findById(req.params.id);
    if (!cliente) return res.status(404).json({ message: 'Cliente no encontrado' });
    res.cliente = cliente;
    next();
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el cliente', error });
  }};

  export default router;
  