// backend/routes/PanolRoutes.js (ejemplo)
import express from 'express';
import Panol from '../models/Panol.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Obtener el pañol del usuario
router.get('/', protect, async (req, res) => {
  try {
    // Si tu modelo Panol está diseñado para haber solo un "panol" por usuario:
    const panol = await Panol.findOne({ user: req.user.id });
    // Si no existe, podrías devolver un objeto vacío o crear uno nuevo
    if (!panol) {
      return res.json({ herramientas: [], perfiles: [], accesorios: [] });
    }
    res.json(panol);
  } catch (error) {
    console.error("Error obteniendo panol:", error);
    res.status(500).json({ message: "Error al obtener panol" });
  }
});

export default router;
