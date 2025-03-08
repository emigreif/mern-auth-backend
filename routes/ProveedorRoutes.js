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

// 📌 Obtener todos los proveedores del usuario autenticado
router.get("/", protect, listarProveedores);

// 📌 Obtener un proveedor específico por ID
router.get("/:id", protect, obtenerProveedor);

// 📌 Crear un nuevo proveedor
router.post("/", protect, crearProveedor);

// 📌 Actualizar un proveedor por ID
router.put("/:id", protect, actualizarProveedor);

// 📌 Eliminar un proveedor por ID
router.delete("/:id", protect, eliminarProveedor);

export default router;
