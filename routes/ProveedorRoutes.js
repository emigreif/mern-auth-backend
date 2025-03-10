// backend/routes/proveedorRoutes.js
import express from "express";
import {
  listarProveedores,
  obtenerProveedor,
  crearProveedor,
  actualizarProveedor,
  eliminarProveedor,
} from "../controllers/proveedorController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, listarProveedores);
router.post("/", protect, crearProveedor);
router.get("/:id", protect, obtenerProveedor);
router.put("/:id", protect, actualizarProveedor);
router.delete("/:id", protect, eliminarProveedor);

export default router;
