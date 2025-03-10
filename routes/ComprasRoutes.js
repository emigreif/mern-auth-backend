// backend/routes/ComprasRoutes.js
import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  listarCompras,
  obtenerCompra,
  crearCompra,
  actualizarCompra,
  eliminarCompra
} from "../controllers/comprasController.js";

const router = express.Router();

/**
 * Tus controladores de compras usan req.params.tipo para seleccionar
 * el modelo (aluminio, vidrios, accesorios).
 * Por eso necesitas ":tipo" en la ruta.
 */
router.route("/:tipo")
  .get(protect, listarCompras)
  .post(protect, crearCompra);

router.route("/:tipo/:id")
  .get(protect, obtenerCompra)
  .put(protect, actualizarCompra)
  .delete(protect, eliminarCompra);

export default router;
