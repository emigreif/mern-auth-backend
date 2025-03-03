import express from 'express';
import { crearMovimiento, listarMovimientos } from '../controllers/contabilidadController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, crearMovimiento);
router.get('/', protect, listarMovimientos);

export default router;
