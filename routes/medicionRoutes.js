// backend/routes/medicionRoutes.js
import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  listarMediciones,
  obtenerMedicion,
  crearMedicion,
  actualizarMedicion,
  eliminarMedicion,
  crearMedicionesMasivas,
  reporteMedicionesPorObra
} from "../controllers/medicionController.js";

const router = express.Router();

router.get("/", protect, listarMediciones);
router.get("/:id", protect, obtenerMedicion);
router.post("/", protect, crearMedicion);
router.put("/:id", protect, actualizarMedicion);
router.delete("/:id", protect, eliminarMedicion);

// Masivo
router.post("/masivo", protect, crearMedicionesMasivas);

// Reporte
router.get("/reporte/obra/:obraId", protect, reporteMedicionesPorObra);

export default router;
