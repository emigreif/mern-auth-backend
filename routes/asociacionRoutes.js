// backend/routes/asociacionRoutes.js
import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  asignarTipologiasAUbicacion,
  eliminarTipologiaDeUbicacion
} from "../controllers/asociacionController.js";

const router = express.Router();

/**
 * /api/asociacion/asignar => POST (body: { ubicacionId, tipologiaIds[] })
 * /api/asociacion/:ubicacionId/:tipologiaId => DELETE
 */

router.post("/asignar", protect, asignarTipologiasAUbicacion);
router.delete("/:ubicacionId/:tipologiaId", protect, eliminarTipologiaDeUbicacion);

export default router;
