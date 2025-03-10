// backend/routes/ComprasRoutes.js
import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  listarCompras,
  obtenerCompra,
  crearCompra,
  actualizarCompra,
  eliminarCompra,
  enviarOrdenCompra
} from "../controllers/comprasController.js";

const router = express.Router();

/**
 * Recuerda que en tu controller usas req.params.tipo (aluminio, vidrios, accesorios).
 * Por eso las rutas deben incluir ":tipo".
 */

// CRUD endpoints
router.route("/:tipo")
  .get(protect, listarCompras)
  .post(protect, crearCompra);

router.route("/:tipo/:id")
  .get(protect, obtenerCompra)
  .put(protect, actualizarCompra)
  .delete(protect, eliminarCompra);

// Nuevo endpoint para enviar la orden de compra
router.post("/:tipo/:id/enviar", protect, enviarOrdenCompra);

export default router;
