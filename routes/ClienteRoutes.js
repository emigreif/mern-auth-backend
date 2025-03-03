
import express from 'express';
import Cliente from '../models/Cliente.js';

const router = express.Router();    

// Obtener todos los Clientes

router.get('/', async (req, res) => {
  try {
    const Clientes = await Cliente.find();
    res.json(Clientes);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener Clientes', error });
  }
});

// Obtener un Cliente por ID

router.get('/:id', getCliente, async (req, res) => {
  res.json(res.Cliente);
});

// Crear un nuevo Cliente

router.post('/', async (req, res) => {
  const Cliente = new n(req.body);
  try {
    const nuevoCliente = await Cliente.save();
    res.status(201).json(nuevoCliente);
  } catch (error) {
    res.status(400).json({ message: 'Error al crear el Cliente', error });
  }
});

// Actualizar un Cliente

router.put('/:id', getCliente, async (req, res) => {
  if (req.body.nombre) res.Cliente.nombre = req.body.nombre;
  if (req.body.apellido) res.Cliente.apellido = req.body.apellido;
  if (req.body.telefono) res.Cliente.telefono = req.body.telefono;

  try {
    const ClienteActualizado = await res.Cliente.save();
    res.json(ClienteActualizado);
  } catch (error) {
    res.status(400).json({ message: 'Error al actualizar el Cliente', error });
  }
});

// Eliminar un Cliente

router.delete('/:id', getCliente, async (req, res) => {
  try {
    await res.Cliente.remove();
    res.json({ message: 'Cliente eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar el Cliente', error });
  }
});

async function getCliente(req, res, next) {
    try {
    const Cliente = await n.findById(req.params.id);
    if (!Cliente) return res.status(404).json({ message: 'Cliente no encontrado' });
    res.Cliente = Cliente;
    next();
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el Cliente', error });
  }};

  export default router;
  