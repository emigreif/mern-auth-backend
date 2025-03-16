// backend/routes/ClienteRoutes.js
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

router.route("/")
  .get(protect, listarClientes)   // GET /api/clientes
  .post(protect, crearCliente);   // POST /api/clientes

router.route("/:id")
  .get(protect, obtenerCliente)   // GET /api/clientes/:id
  .put(protect, actualizarCliente)// PUT /api/clientes/:id
  .delete(protect, eliminarCliente);// DELETE /api/clientes/:id

export default router;
