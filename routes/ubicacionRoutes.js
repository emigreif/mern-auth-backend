// backend/routes/ubicacionRoutes.js
import express from 'express';
import { crearUbicacion, listarUbicaciones, actualizarUbicacion, eliminarUbicacion } from '../controllers/ubicacionController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', protect, listarUbicaciones);
router.post('/', protect, crearUbicacion);
router.put('/:id', protect, actualizarUbicacion);
router.delete('/:id', protect, eliminarUbicacion);

export default router;
