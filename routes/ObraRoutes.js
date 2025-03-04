import express from 'express';
import Obra from '../models/Obra.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Obtener todas las Obras del usuario autenticado
router.get('/', protect, async (req, res) => {
  try {
    const obras = await Obra.find({ user: req.user.id });
    res.json(obras);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener obras', error: error.message });
  }
});

// Obtener una Obra por ID (solo si pertenece al usuario autenticado)
router.get('/:id', protect, async (req, res) => {
  try {
    const obra = await Obra.findOne({ _id: req.params.id, user: req.user.id });
    if (!obra) return res.status(404).json({ message: 'Obra no encontrada' });
    res.json(obra);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener obra', error: error.message });
  }
});

// Crear una nueva Obra
router.post('/', protect, async (req, res) => {
  try {
    // Se asume que en req.body se envían los campos:
    // nombre, cliente, direccion, contacto, mapa (opcional), fechaEntrega,
    // importeConFactura, importeSinFactura, importeTotal, indiceActualizacionSaldo,
    // perfilesPresupuesto, vidriosPresupuesto, accesoriosPresupuesto, y estado (opcional)
    const obra = new Obra({ ...req.body, user: req.user.id });
    const newObra = await obra.save();
    res.status(201).json(newObra);
  } catch (error) {
    res.status(400).json({ message: 'Error al crear obra', error: error.message });
  }
});

// Actualizar una Obra (solo si pertenece al usuario autenticado)
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
    res.status(400).json({ message: 'Error al actualizar obra', error: error.message });
  }
});

// Eliminar una Obra (solo si pertenece al usuario autenticado)
router.delete('/:id', protect, async (req, res) => {
  try {
    const deletedObra = await Obra.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!deletedObra) return res.status(404).json({ message: 'Obra no encontrada' });
    res.json({ message: 'Obra eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar obra', error: error.message });
  }
});

export default router;
