// backend/routes/medicionRoutes.js
import express from 'express';
import { crearMedicion, listarMediciones, actualizarMedicion, eliminarMedicion } from '../controllers/medicionController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', protect, listarMediciones);
router.post('/', protect, crearMedicion);
router.put('/:id', protect, actualizarMedicion);
router.delete('/:id', protect, eliminarMedicion);

export default router;
