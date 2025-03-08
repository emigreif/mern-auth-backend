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

router.route("/")
  .get(protect, listarCompras)
  .post(protect, crearCompra);

router.route("/:id")
  .get(protect, obtenerCompra)
  .put(protect, actualizarCompra)
  .delete(protect, eliminarCompra);

export default router;
