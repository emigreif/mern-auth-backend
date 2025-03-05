// backend/routes/panolRoutes.js
import express from 'express';
import Panol from '../models/Panol.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Obtener el documento Panol del usuario (o crearlo si no existe)
router.get('/', protect, async (req, res) => {
  try {
    let panol = await Panol.findOne({ user: req.user.id });
    if (!panol) {
      panol = new Panol({ user: req.user.id });
      await panol.save();
    }
    res.json(panol);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener Panol', error: error.message });
  }
});

// --- Herramientas ---
// Agregar nueva herramienta
router.post('/herramientas', protect, async (req, res) => {
  try {
    let panol = await Panol.findOne({ user: req.user.id });
    if (!panol) panol = new Panol({ user: req.user.id });
    panol.herramientas.push(req.body);
    await panol.save();
    res.status(201).json(panol.herramientas[panol.herramientas.length - 1]);
  } catch (error) {
    res.status(400).json({ message: 'Error al agregar herramienta', error: error.message });
  }
});

// Eliminar herramienta por ID
router.delete('/herramientas/:id', protect, async (req, res) => {
  try {
    let panol = await Panol.findOne({ user: req.user.id });
    if (!panol) return res.status(404).json({ message: 'Panol no encontrado' });
    panol.herramientas = panol.herramientas.filter(h => h._id.toString() !== req.params.id);
    await panol.save();
    res.json({ message: 'Herramienta eliminada' });
  } catch (error) {
    res.status(400).json({ message: 'Error al eliminar herramienta', error: error.message });
  }
});

// --- Perfiles ---
// Agregar nuevo perfil
router.post('/perfiles', protect, async (req, res) => {
  try {
    let panol = await Panol.findOne({ user: req.user.id });
    if (!panol) panol = new Panol({ user: req.user.id });
    panol.perfiles.push(req.body);
    await panol.save();
    res.status(201).json(panol.perfiles[panol.perfiles.length - 1]);
  } catch (error) {
    res.status(400).json({ message: 'Error al agregar perfil', error: error.message });
  }
});

// Eliminar perfil por ID
router.delete('/perfiles/:id', protect, async (req, res) => {
  try {
    let panol = await Panol.findOne({ user: req.user.id });
    if (!panol) return res.status(404).json({ message: 'Panol no encontrado' });
    panol.perfiles = panol.perfiles.filter(p => p._id.toString() !== req.params.id);
    await panol.save();
    res.json({ message: 'Perfil eliminado' });
  } catch (error) {
    res.status(400).json({ message: 'Error al eliminar perfil', error: error.message });
  }
});

// --- Accesorios ---
// Agregar nuevo accesorio
router.post('/accesorios', protect, async (req, res) => {
  try {
    let panol = await Panol.findOne({ user: req.user.id });
    if (!panol) panol = new Panol({ user: req.user.id });
    panol.accesorios.push(req.body);
    await panol.save();
    res.status(201).json(panol.accesorios[panol.accesorios.length - 1]);
  } catch (error) {
    res.status(400).json({ message: 'Error al agregar accesorio', error: error.message });
  }
});

// Eliminar accesorio por ID
router.delete('/accesorios/:id', protect, async (req, res) => {
  try {
    let panol = await Panol.findOne({ user: req.user.id });
    if (!panol) return res.status(404).json({ message: 'Panol no encontrado' });
    panol.accesorios = panol.accesorios.filter(a => a._id.toString() !== req.params.id);
    await panol.save();
    res.json({ message: 'Accesorio eliminado' });
  } catch (error) {
    res.status(400).json({ message: 'Error al eliminar accesorio', error: error.message });
  }
});

// --- Vidrios ---
// Agregar nuevo vidrio
router.post('/vidrios', protect, async (req, res) => {
  try {
    let panol = await Panol.findOne({ user: req.user.id });
    if (!panol) panol = new Panol({ user: req.user.id });
    panol.vidrios.push(req.body);
    await panol.save();
    res.status(201).json(panol.vidrios[panol.vidrios.length - 1]);
  } catch (error) {
    res.status(400).json({ message: 'Error al agregar vidrio', error: error.message });
  }
});

// Eliminar vidrio por ID
router.delete('/vidrios/:id', protect, async (req, res) => {
  try {
    let panol = await Panol.findOne({ user: req.user.id });
    if (!panol) return res.status(404).json({ message: 'Panol no encontrado' });
    panol.vidrios = panol.vidrios.filter(v => v._id.toString() !== req.params.id);
    await panol.save();
    res.json({ message: 'Vidrio eliminado' });
  } catch (error) {
    res.status(400).json({ message: 'Error al eliminar vidrio', error: error.message });
  }
});

// --- Generar Documentos ---
// Remito de salida (simulado)
router.post('/remito', protect, async (req, res) => {
  // Aquí implementarías la lógica para generar un remito (por ejemplo, PDF)
  res.json({ message: 'Remito de salida generado (simulado)' });
});

// Ficha de ingreso (simulado)
router.post('/ingreso', protect, async (req, res) => {
  // Aquí implementarías la lógica para generar una ficha de ingreso
  res.json({ message: 'Ficha de ingreso generada (simulado)' });
});

export default router;
