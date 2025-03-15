// backend/routes/proveedorRoutes.js
import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  listarProveedores,
  obtenerProveedor,
  crearProveedor,
  actualizarProveedor,
  eliminarProveedor
} from "../controllers/proveedorController.js";

const router = express.Router();

/**
 * /api/proveedores => GET (listar), POST (crear)
 * /api/proveedores/:id => GET, PUT, DELETE
 */

router.get("/", protect, listarProveedores);
router.post("/", protect, crearProveedor);

router.get("/:id", protect, obtenerProveedor);
router.put("/:id", protect, actualizarProveedor);
router.delete("/:id", protect, eliminarProveedor);

export default router;
