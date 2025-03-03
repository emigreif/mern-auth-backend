import express from 'express';
import Proveedor from '../models/Proveedor.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();   

// Obtener todos los proveedores del usuario
router.get('/', protect, async (req, res) => {
  try {
    const proveedores = await Proveedor.find({ user: req.user.id });
    res.json(proveedores);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener proveedores', error });
  }
});

// Obtener un proveedor por ID
router.get('/:id', protect, async (req, res) => {
  try {
    const proveedor = await Proveedor.findOne({ _id: req.params.id, user: req.user.id });
    if (!proveedor) return res.status(404).json({ message: 'proveedor no encontrado' });
    res.json(proveedor);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el proveedor', error });
  }
});

// Crear un nuevo proveedor
router.post('/', protect, async (req, res) => {
  try {
    const proveedor = new Proveedor({ ...req.body, user: req.user.id });
    const nuevoProveedor = await proveedor.save();
    res.status(201).json(nuevoProveedor);
  } catch (error) {
    res.status(400).json({ message: 'Error al crear el proveedor', error });
  }
});

// Actualizar un proveedor
router.put('/:id', protect, async (req, res) => {
  try {
    const proveedorActualizado = await Proveedor.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      { new: true }
    );
    if (!proveedorActualizado) return res.status(404).json({ message: 'Proveedor no encontrado' });
    res.json(proveedorActualizado);
  } catch (error) {
    res.status(400).json({ message: 'Error al actualizar el proveedor', error });
  }
});

// Eliminar un proveedor
router.delete('/:id', protect, async (req, res) => {
  try {
    const eliminado = await Proveedor.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!eliminado) return res.status(404).json({ message: 'Proveedor no encontrado' });
    res.json({ message: 'Proveedor eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar el proveedor', error });
  }
});

export default router;
