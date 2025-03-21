import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  obtenerMediciones,
  obtenerMedicionPorId,
  crearMedicion,
  actualizarMedicion,
  eliminarMedicion,
  generarReporteMediciones
} from "../controllers/medicionController.js";

const router = express.Router();

// ✅ Obtener todas las mediciones
router.get("/", protect, obtenerMediciones);

// ✅ Obtener una medición por ID
router.get("/:id", protect, obtenerMedicionPorId);

// ✅ Crear una nueva medición (basada en asociación de tipologías y ubicaciones)
router.post("/", protect, crearMedicion);

// ✅ Actualizar una medición existente
router.put("/:id", protect, actualizarMedicion);

// ✅ Eliminar una medición
router.delete("/:id", protect, eliminarMedicion);

// ✅ Generar un reporte de mediciones con diferencias
router.get("/reporte", protect, generarReporteMediciones);

export default router;
