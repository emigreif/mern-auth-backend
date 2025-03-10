// backend/routes/authRoutes.js
import express from 'express';
import {
  register,
  login,
  logout,
  forgotPassword,
  resetPassword
} from '../controllers/authController.js';

const router = express.Router();

// Registro y Login (públicos)
router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);

// Recuperación de contraseña
router.post('/forgot-password', forgotPassword);

// Corrección de la ruta para resetear contraseña
router.post('/reset-password', resetPassword);

export default router;
