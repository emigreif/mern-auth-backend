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

// 📌 Obtener todos los calendarios con filtros opcionales (obra o actividad)
router.get("/", protect, listarCalendarios);

// 📌 Generar calendario automáticamente con las fechas de la obra
router.post("/generar", protect, generarCalendarioDesdeObra);

// 📌 Obtener el calendario de una obra específica
router.get("/:obraId", protect, obtenerCalendario);

// 📌 Actualizar el calendario manualmente
router.put("/:obraId", protect, actualizarCalendario);

// 📌 Eliminar el calendario de una obra
router.delete("/:obraId", protect, eliminarCalendario);

export default router;
