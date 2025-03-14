// backend/routes/asociacionRoutes.js
import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  asignarTipologiasAUbicacion,
  eliminarTipologiaDeUbicacion
} from "../controllers/asociacionController.js";

const router = express.Router();

// POST => asignar tipologías
router.post("/asignar", protect, asignarTipologiasAUbicacion);

// DELETE => quitar tipología (ubicacionId, tipologiaId)
router.delete("/:ubicacionId/:tipologiaId", protect, eliminarTipologiaDeUbicacion);

export default router;
