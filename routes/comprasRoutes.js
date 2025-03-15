// backend/routes/comprasRoutes.js
import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  listarCompras,
  crearCompra,
  obtenerCompra,
  actualizarCompra,
  eliminarCompra,
  ingresoMaterial
} from "../controllers/comprasController.js";

const router = express.Router();

/**
 * /api/compras/:tipo => GET (listar) o POST (crear)
 * /api/compras/:tipo/:id => GET (obtener), PUT (actualizar), DELETE (anular)
 * /api/compras/ingreso/:id => POST (ingreso de material)
 */

router.get("/:tipo", protect, listarCompras);
router.post("/:tipo", protect, crearCompra);

router.get("/:tipo/:id", protect, obtenerCompra);
router.put("/:tipo/:id", protect, actualizarCompra);
router.delete("/:tipo/:id", protect, eliminarCompra);

router.post("/ingreso/:id", protect, ingresoMaterial);

export default router;
