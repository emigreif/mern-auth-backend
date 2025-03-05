// backend/routes/asociacionRoutes.js
import express from 'express';
import { asociarTipologias } from '../controllers/asociacionController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, asociarTipologias);

export default router;
