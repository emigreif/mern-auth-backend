// backend/routes/contabilidadRoutes.js
import express from "express";
import {
  crearMovimiento,
  listarMovimientos,
  obtenerMovimiento,
  actualizarMovimiento,
  eliminarMovimiento,
} from "../controllers/contabilidadController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// POST /api/contabilidad => crear movimiento
// GET /api/contabilidad => listar movimientos (con filtros)
router.route("/")
  .post(protect, crearMovimiento)
  .get(protect, listarMovimientos);

// GET /api/contabilidad/:id => obtener uno
// PUT /api/contabilidad/:id => actualizar
// DELETE /api/contabilidad/:id => eliminar
router.route("/:id")
  .get(protect, obtenerMovimiento)
  .put(protect, actualizarMovimiento)
  .delete(protect, eliminarMovimiento);

export default router;
