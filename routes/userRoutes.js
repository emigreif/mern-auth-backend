// backend/routes/userRoutes.js
import express from 'express';
import {
  getUserProfile,
  updateUserProfile,
  seleccionarPerfil
} from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);

// Seleccionar perfil activo
router.post('/seleccionar-perfil', protect, seleccionarPerfil);

export default router;
