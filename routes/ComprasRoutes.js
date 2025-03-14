// backend/routes/ComprasRoutes.js
import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  listarCompras,
  obtenerCompra,
  crearCompra,
  actualizarCompra,
  eliminarCompra,
  ingresoMaterial
} from "../controllers/comprasController.js";

const router = express.Router();

// GET /api/compras/:tipo (o "todas")
router.get("/:tipo", protect, listarCompras);
// POST /api/compras/:tipo
router.post("/:tipo", protect, crearCompra);

// GET /api/compras/:tipo/:id
router.get("/:tipo/:id", protect, obtenerCompra);
// PUT /api/compras/:tipo/:id
router.put("/:tipo/:id", protect, actualizarCompra);
// DELETE /api/compras/:tipo/:id => anula la compra
router.delete("/:tipo/:id", protect, eliminarCompra);

// POST /api/compras/ingreso/:id => ingreso de material
router.post("/ingreso/:id", protect, ingresoMaterial);

export default router;
