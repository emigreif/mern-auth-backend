import express from 'express';
import Obra from '../models/Obra.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Obtener todas las Obras del usuario
router.get('/', protect, async (req, res) => {
  try {
    const obras = await Obra.find({ user: req.user.id });
    res.json(obras);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener Obras', error });
  }
});

// Obtener una Obra por id
router.get('/:id', protect, async (req, res) => {
  try {
    const obra = await Obra.findOne({ _id: req.params.id, user: req.user.id });
    if (!obra) return res.status(404).json({ message: 'Obra no encontrada' });
    res.json(obra);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener Obra', error });
  }
});

// Crear una nueva Obra
router.post('/', protect, async (req, res) => {
  try {
    const obra = new Obra({ ...req.body, user: req.user.id });
    const newObra = await obra.save();
    res.status(201).json(newObra);
  } catch (error) {
    res.status(400).json({ message: 'Error al crear Obra', error });
  }
});

// Actualizar una Obra
router.put('/:id', protect, async (req, res) => {
  try {
    const updatedObra = await Obra.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      { new: true }
    );
    if (!updatedObra) return res.status(404).json({ message: 'Obra no encontrada' });
    res.json(updatedObra);
  } catch (error) {
    res.status(400).json({ message: 'Error al actualizar Obra', error });
  }
});

// Eliminar una Obra
router.delete('/:id', protect, async (req, res) => {
  try {
    const deletedObra = await Obra.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!deletedObra) return res.status(404).json({ message: 'Obra no encontrada' });
    res.json({ message: 'Obra eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar Obra', error });
  }
});

export default router;
