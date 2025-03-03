
import express from 'express';
import Obra from '../models/Obra.js';

const router = express.Router();

// Obtener todas las Obras

router.get('/', async (req, res) => {
  try {
    const Obras = await Obra.find();
    res.json(Obras);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener Obras', error });
  }
});

// Obtener una Obra por id

router.get('/:id', getObra, (req, res) => {
  res.json(res.Obra);
});

// Crear una nueva Obra

router.post('/', async (req, res) => {
  const Obra = new Obra(req.body);

  try {
    const newObra = await Obra.save();
    res.status(201).json(newObra);
  } catch (error) {
    res.status(400).json({ message: 'Error al crear Obra', error });
  }
});

// Actualizar una Obra

router.put('/:id', getObra, async (req, res) => {
  if (req.body.nombre) res.Obra.nombre = req.body.nombre;
  if (req.body.descripcion) res.Obra.descripcion = req.body.descripcion;
  if (req.body.anio) res.Obra.anio = req.body.anio;

  try {
    const updatedObra = await res.Obra.save();
    res.json(updatedObra);
  } catch (error) {
    res.status(400).json({ message: 'Error al actualizar Obra', error });
  }
});

// Eliminar una Obra

router.delete('/:id', getObra, async (req, res) => {
  try {
    await res.Obra.remove();
    res.json({ message: 'Obra eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar Obra', error });
  }
});

// Middleware para obtener una Obra por id

async function getObra(req, res, next) {
  let Obra;

  try {
    Obra = await Obra.findById(req.params.id);
    if (!Obra) return res.status(404).json({ message: 'Obra no encontrada' });
  } catch (error) {
    return res.status(500).json({ message: 'Error al obtener Obra', error });
  }

  res.Obra = Obra;
  next();
}

export default router;
