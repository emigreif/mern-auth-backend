// backend/routes/presupuestoRoutes.js
import express from "express";
import {
  crearPresupuesto,
  listarPresupuestos,
  obtenerPresupuesto,
  actualizarPresupuesto,
  eliminarPresupuesto,
} from "../controllers/presupuestoController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, listarPresupuestos);
router.post("/", protect, crearPresupuesto);
router.get("/:id", protect, obtenerPresupuesto);
router.put("/:id", protect, actualizarPresupuesto);
router.delete("/:id", protect, eliminarPresupuesto);

export default router;
