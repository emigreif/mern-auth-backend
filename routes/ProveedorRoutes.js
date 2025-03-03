import express from 'express';
import Proveedores from './proveedores.js';

const router = express.Router();   

// Obtener todos los proveedores

router.get('/', async (req, res) => {
  try {
    const proveedores = await Proveedores.find();
    res.json(proveedores);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener proveedores', error });
  }
});

// Obtener un proveedor por ID

router.get('/:id', getProveedor, (req, res) => {
  res.json(res.proveedor);
});

// Crear un nuevo proveedor

router.post('/', async (req, res) => {
  const proveedor = new Proveedores(req.body);
  try {
    const nuevoProveedor = await proveedor.save();
    res.status(201).json(nuevoProveedor);
  } catch (error) {
    res.status(400).json({ message: 'Error al crear el proveedor', error });
  }
});

// Actualizar un proveedor

router.put('/:id', getProveedor, async (req, res) => {
  if (req.body.nombre) res.proveedor.nombre = req.body.nombre;
  if (req.body.direccion) res.proveedor.direccion = req.body.direccion;
  if (req.body.telefono) res.proveedor.telefono = req.body.telefono;

  try {
    const proveedorActualizado = await res.proveedor.save();
    res.json(proveedorActualizado);
  } catch (error) {
    res.status(400).json({ message: 'Error al actualizar el proveedor', error });
  }
});

// Eliminar un proveedor

router.delete('/:id', getProveedor, async (req, res) => {
  try {
    await res.proveedor.remove();
    res.json({ message: 'Proveedor eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar el proveedor', error });
  }
});
async function getProveedor(req, res, next) {
    try {
    const proveedor = await cliemte.findById(req.params.id);
    if (!proveedor) return res.status(404).json({ message: 'proveedor no encontrado' });
    res.proveedor = proveedor;
    next();
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el proveedor', error });
  }};


export default router;
