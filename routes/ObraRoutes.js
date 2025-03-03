
import express from 'express';
import Obra from '../models/obra';

const router = express.Router();

// Obtener todas las obras

router.get('/', async (req, res) => {
  try {
    const obras = await Obra.find();
    res.json(obras);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener obras', error });
  }
});

// Obtener una obra por id

router.get('/:id', getObra, (req, res) => {
  res.json(res.obra);
});

// Crear una nueva obra

router.post('/', async (req, res) => {
  const obra = new Obra(req.body);

  try {
    const newObra = await obra.save();
    res.status(201).json(newObra);
  } catch (error) {
    res.status(400).json({ message: 'Error al crear obra', error });
  }
});

// Actualizar una obra

router.put('/:id', getObra, async (req, res) => {
  if (req.body.nombre) res.obra.nombre = req.body.nombre;
  if (req.body.descripcion) res.obra.descripcion = req.body.descripcion;
  if (req.body.anio) res.obra.anio = req.body.anio;

  try {
    const updatedObra = await res.obra.save();
    res.json(updatedObra);
  } catch (error) {
    res.status(400).json({ message: 'Error al actualizar obra', error });
  }
});

// Eliminar una obra

router.delete('/:id', getObra, async (req, res) => {
  try {
    await res.obra.remove();
    res.json({ message: 'Obra eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar obra', error });
  }
});

// Middleware para obtener una obra por id

async function getObra(req, res, next) {
  let obra;

  try {
    obra = await Obra.findById(req.params.id);
    if (!obra) return res.status(404).json({ message: 'Obra no encontrada' });
  } catch (error) {
    return res.status(500).json({ message: 'Error al obtener obra', error });
  }

  res.obra = obra;
  next();
}

export default router;
