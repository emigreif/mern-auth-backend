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

/**
 * /api/mediciones => GET (listar), POST (crear)
 * /api/mediciones/:id => GET, PUT, DELETE
 * /api/mediciones/masivo => POST (crear masivo)
 * /api/mediciones/reporte/obra/:obraId => GET
 */

router.get("/", protect, listarMediciones);
router.post("/", protect, crearMedicion);

router.get("/:id", protect, obtenerMedicion);
router.put("/:id", protect, actualizarMedicion);
router.delete("/:id", protect, eliminarMedicion);

// Masivo
router.post("/masivo", protect, crearMedicionesMasivas);

// Reporte
router.get("/reporte/obra/:obraId", protect, reporteMedicionesPorObra);

export default router;
