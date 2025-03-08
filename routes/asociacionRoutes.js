import express from "express";
import {
  asociarMedidasAVanos,
  obtenerAsignaciones,
  eliminarAsignacion,
} from "../controllers/asociacionController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// 📌 Asociar medidas a vanos
router.post("/", protect, asociarMedidasAVanos);

// 📌 Obtener todas las asignaciones del usuario
router.get("/", protect, obtenerAsignaciones);

// 📌 Eliminar una asignación específica por ID
router.delete("/:id", protect, eliminarAsignacion);

export default router;
