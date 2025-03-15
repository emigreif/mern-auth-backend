// backend/routes/userRoutes.js
import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  getUserProfile,
  updateUserProfile,
  seleccionarPerfil
} from "../controllers/userController.js";

const router = express.Router();

/**
 * /api/user/profile => GET (obtener), PUT (actualizar)
 * /api/user/seleccionar-perfil => POST (body: { userId, perfilId })
 */

router.get("/profile", protect, getUserProfile);
router.put("/profile", protect, updateUserProfile);
router.post("/seleccionar-perfil", protect, seleccionarPerfil);

export default router;
