import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  obtenerAsociaciones,
  obtenerAsociacionPorId,
  crearAsociacion,
  actualizarAsociacion,
  eliminarAsociacion,
} from "../controllers/asociacionController.js";

const router = express.Router();

// ✅ Obtener todas las asociaciones de tipologías y ubicaciones
router.get("/", protect, obtenerAsociaciones);

// ✅ Obtener una asociación por ID
router.get("/:id", protect, obtenerAsociacionPorId);

// ✅ Crear una nueva asociación
router.post("/", protect, crearAsociacion);

// ✅ Actualizar una asociación existente
router.put("/:id", protect, actualizarAsociacion);

// ✅ Eliminar una asociación
router.delete("/:id", protect, eliminarAsociacion);

export default router;
