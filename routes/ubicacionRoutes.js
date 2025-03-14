// backend/routes/ubicacionRoutes.js
import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  listarUbicaciones,
  obtenerUbicacion,
  crearUbicacion,
  actualizarUbicacion,
  eliminarUbicacion,
  generarUbicaciones
} from "../controllers/ubicacionController.js";

const router = express.Router();

router.get("/", protect, listarUbicaciones);
router.get("/:id", protect, obtenerUbicacion);
router.post("/", protect, crearUbicacion);
router.put("/:id", protect, actualizarUbicacion);
router.delete("/:id", protect, eliminarUbicacion);

// Generar masivamente
router.post("/generar", protect, generarUbicaciones);

export default router;
