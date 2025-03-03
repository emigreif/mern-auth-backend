// backend/routes/contabilidadRoutes.js
import express from 'express';
import { crearMovimiento, listarMovimientos } from '../controllers/contabilidadController.js';
const router = express.Router();

router.post('/', crearMovimiento);
router.get('/', listarMovimientos);
// router.get('/balance', balanceGeneral); // Podrías crear una función adicional
// ...

export default router;
