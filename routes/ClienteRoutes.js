import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  listarClientes,
  obtenerCliente,
  crearCliente,
  actualizarCliente,
  eliminarCliente,
} from "../controllers/clienteController.js";

const router = express.Router();

router.get("/", protect, listarClientes);
router.get("/:id", protect, obtenerCliente);
router.post("/", protect, crearCliente);
router.put("/:id", protect, actualizarCliente);
router.delete("/:id", protect, eliminarCliente);

export default router;
