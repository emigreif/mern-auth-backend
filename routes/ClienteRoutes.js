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

router.route("/")
  .get(protect, listarClientes)
  .post(protect, crearCliente);

router.route("/:id")
  .get(protect, obtenerCliente)
  .put(protect, actualizarCliente)
  .delete(protect, eliminarCliente);

export default router;
