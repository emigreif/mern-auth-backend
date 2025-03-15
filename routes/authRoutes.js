// backend/routes/authRoutes.js
import express from "express";
import {
  register,
  login,
  logout,
  forgotPassword,
  resetPassword
} from "../controllers/authController.js";

const router = express.Router();

/**
 * /api/auth/register => POST (registro de usuario)
 * /api/auth/login => POST (login primer usuario)
 * /api/auth/logout => POST (logout)
 * /api/auth/forgot-password => POST (enviar email para reset)
 * /api/auth/reset-password => POST (resetear contraseña)
 */

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

export default router;
