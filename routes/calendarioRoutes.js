// backend/routes/calendarioRoutes.js
import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  listarCalendarios,
  generarCalendarioDesdeObra,
  obtenerCalendario,
  actualizarCalendario,
  eliminarCalendario
} from "../controllers/calendarioController.js";

const router = express.Router();

// Obtener todos los calendarios (con filtros opcionales)
router.get("/", protect, listarCalendarios);

// Generar calendario automáticamente
router.post("/generar", protect, generarCalendarioDesdeObra);

// Obtener, actualizar y eliminar por obraId
router.get("/:obraId", protect, obtenerCalendario);
router.put("/:obraId", protect, actualizarCalendario);
router.delete("/:obraId", protect, eliminarCalendario);

export default router;
