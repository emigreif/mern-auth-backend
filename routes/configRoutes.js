// backend/routes/configRoutes.js
import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  obtenerConfiguracion,
  actualizarConfiguracion
} from "../controllers/configController.js";

const router = express.Router();

/**
 * /api/configuracion => GET (obtener), PUT (actualizar)
 */

router.route("/")
  .get(protect, obtenerConfiguracion)
  .put(protect, actualizarConfiguracion);

export default router;
