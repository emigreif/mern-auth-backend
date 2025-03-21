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

// 📌 Rutas protegidas para las mediciones
router.get("/", protect, obtenerMediciones); // Obtener todas las mediciones
router.get("/:id", protect, obtenerMedicionPorId); // Obtener una medición por ID
router.post("/", protect, crearMedicion); // Crear una nueva medición
router.put("/:id", protect, actualizarMedicion); // Actualizar una medición por ID
router.delete("/:id", protect, eliminarMedicion); // Eliminar una medición por ID

// 📌 Generar reporte de mediciones
router.get("/reporte", protect, generarReporteMediciones);

export default router;
