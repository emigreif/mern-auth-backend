// routes/ubicacionRoutes.js
import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  obtenerUbicaciones,
  obtenerUbicacionPorId,
  crearUbicacion,
  actualizarUbicacion,
  eliminarUbicacion,
  eliminarUbicacionesPorPiso,
  editarUbicacionesPorPiso,
   generarUbicaciones
} from "../controllers/ubicacionController.js";

const router = express.Router();

// Todas las rutas protegidas
router.get("/", protect, obtenerUbicaciones);
router.get("/:id", protect, obtenerUbicacionPorId);
router.post("/", protect, crearUbicacion);
router.put("/:id", protect, actualizarUbicacion);
router.delete("/:id", protect, eliminarUbicacion);
router.post("/generar", protect, generarUbicaciones);
router.delete("/eliminar-por-piso", protect, eliminarUbicacionesPorPiso);
router.put("/editar-piso", protect, editarUbicacionesPorPiso);

export default router;
