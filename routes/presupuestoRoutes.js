// backend/routes/presupuestoRoutes.js
import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  crearPresupuesto,
  listarPresupuestos,
  obtenerPresupuesto,
  actualizarPresupuesto,
  eliminarPresupuesto
} from "../controllers/presupuestoController.js";

const router = express.Router();

/**
 * /api/presupuestos => GET (listar), POST (crear)
 * /api/presupuestos/:id => GET, PUT, DELETE
 */

router.get("/", protect, listarPresupuestos);
router.post("/", protect, crearPresupuesto);

router.get("/:id", protect, obtenerPresupuesto);
router.put("/:id", protect, actualizarPresupuesto);
router.delete("/:id", protect, eliminarPresupuesto);

export default router;
