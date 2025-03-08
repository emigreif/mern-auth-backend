
import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  listarObras,
  obtenerObra,
  crearObra,
  actualizarObra,
  eliminarObra
} from "../controllers/obraController.js";

const router = express.Router();

router.route("/")
  .get(protect, listarObras)
  .post(protect, crearObra);

router.route("/:id")
  .get(protect, obtenerObra)
  .put(protect, actualizarObra)
  .delete(protect, eliminarObra);

export default router;
