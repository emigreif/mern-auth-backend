// backend/routes/userRoutes.js
import express from 'express';
import { getUserProfile, updateUserProfile } from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Obtener el perfil
router.get('/profile', protect, getUserProfile);

// Actualizar perfil (nombre, email, contraseña, etc.)
router.put('/profile', protect, updateUserProfile);

export default router;
