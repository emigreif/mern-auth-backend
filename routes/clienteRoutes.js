// backend/routes/clienteroutes.js
import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  listarClientes,
  obtenerCliente,
  crearCliente,
  actualizarCliente,
  eliminarCliente
} from "../controllers/clienteController.js";

const router = express.Router();

/**
 * /api/clientes => GET, POST
 * /api/clientes/:id => GET, PUT, DELETE
 */

router.route("/")
  .get(protect, listarClientes)
  .post(protect, crearCliente);

router.route("/:id")
  .get(protect, obtenerCliente)
  .put(protect, actualizarCliente)
  .delete(protect, eliminarCliente);

export default router;
