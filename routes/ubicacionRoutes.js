import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  obtenerUbicaciones,
  obtenerUbicacionPorId,
  crearUbicacion,
  actualizarUbicacion,
  eliminarUbicacion,
} from "../controllers/ubicacionController.js";

const router = express.Router();

// ✅ Obtener todas las ubicaciones
router.get("/", protect, obtenerUbicaciones);

// ✅ Obtener una ubicación por ID
router.get("/:id", protect, obtenerUbicacionPorId);

// ✅ Crear una nueva ubicación
router.post("/", protect, crearUbicacion);

// ✅ Actualizar una ubicación existente
router.put("/:id", protect, actualizarUbicacion);

// ✅ Eliminar una ubicación
router.delete("/:id", protect, eliminarUbicacion);

export default router;
