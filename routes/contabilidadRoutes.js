// backend/routes/contabilidadRoutes.js
import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  crearMovimiento,
  listarMovimientos,
  obtenerMovimiento,
  actualizarMovimiento,
  eliminarMovimiento
} from "../controllers/contabilidadController.js";

const router = express.Router();

/**
 * /api/contabilidad => POST (crear), GET (listar)
 * /api/contabilidad/:id => GET (obtener), PUT (actualizar), DELETE (eliminar)
 */

router.route("/")
  .post(protect, crearMovimiento)
  .get(protect, listarMovimientos);

router.route("/:id")
  .get(protect, obtenerMovimiento)
  .put(protect, actualizarMovimiento)
  .delete(protect, eliminarMovimiento);

export default router;
