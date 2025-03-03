// backend/routes/ClienteRoutes.js
import express from 'express';
import Cliente from '../models/Cliente.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();    

// Obtener todos los Clientes del usuario logueado
router.get('/', protect, async (req, res) => {
  try {
    // Filtrar por user: req.user.id
    const clientes = await Cliente.find({ user: req.user.id });
    res.json(clientes);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener Clientes', error });
  }
});

// Obtener un Cliente por ID, asegurando que sea del usuario
router.get('/:id', protect, async (req, res) => {
  try {
    const cliente = await Cliente.findOne({ _id: req.params.id, user: req.user.id });
    if (!cliente) return res.status(404).json({ message: 'Cliente no encontrado' });
    res.json(cliente);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el Cliente', error });
  }
});

// Crear un nuevo Cliente, asignándole el user
router.post('/', protect, async (req, res) => {
  try {
    // user: req.user.id
    const cliente = new Cliente({ ...req.body, user: req.user.id });
    const nuevoCliente = await cliente.save();
    res.status(201).json(nuevoCliente);
  } catch (error) {
    res.status(400).json({ message: 'Error al crear el Cliente', error });
  }
});

// Actualizar un Cliente (solo si pertenece al user)
router.put('/:id', protect, async (req, res) => {
  try {
    const clienteActualizado = await Cliente.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      { new: true }
    );
    if (!clienteActualizado) return res.status(404).json({ message: 'Cliente no encontrado' });
    res.json(clienteActualizado);
  } catch (error) {
    res.status(400).json({ message: 'Error al actualizar el Cliente', error });
  }
});

// Eliminar un Cliente (solo si pertenece al user)
router.delete('/:id', protect, async (req, res) => {
  try {
    const clienteEliminado = await Cliente.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!clienteEliminado) return res.status(404).json({ message: 'Cliente no encontrado' });
    res.json({ message: 'Cliente eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar el Cliente', error });
  }
});

export default router;
