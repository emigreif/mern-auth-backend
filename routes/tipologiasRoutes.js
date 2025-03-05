// backend/routes/tipologiaRoutes.js
import express from 'express';
import { crearTipologia, listarTipologias, actualizarTipologia, eliminarTipologia, importarTipologias } from '../controllers/tipologiaController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', protect, listarTipologias);
router.post('/', protect, crearTipologia);
router.put('/:id', protect, actualizarTipologia);
router.delete('/:id', protect, eliminarTipologia);

// Ruta para importar tipologías desde Excel
router.post('/import', protect, importarTipologias);

export default router;
