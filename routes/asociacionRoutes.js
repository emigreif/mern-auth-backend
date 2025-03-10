// backend/routes/asociacionRoutes.js
import express from "express";
import {
  asociarMedidasAVanos,
  obtenerAsignaciones,
  eliminarAsignacion,
} from "../controllers/asociacionController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// POST y GET en la raíz "/"
router.post("/", protect, asociarMedidasAVanos);
router.get("/", protect, obtenerAsignaciones);

/**
 * Según tu controlador `eliminarAsignacion`, se usan `ubicacionId` y `vanoId` en `req.params`.
 * Por lo tanto, la ruta debe incluir ambos parámetros. 
 * Ajustamos a "/:ubicacionId/:vanoId".
 */
router.delete("/:ubicacionId/:vanoId", protect, eliminarAsignacion);

export default router;
