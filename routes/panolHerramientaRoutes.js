import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  obtenerHerramientas,
  crearHerramienta,
  actualizarHerramienta,
  eliminarHerramienta,
  registrarMovimiento,
  asignarHerramienta
} from "../controllers/panolHerramientaController.js";

const router = express.Router();

// 📌 Todas las rutas protegidas
router.use(protect);

// GET todas las herramientas del usuario
router.get("/", obtenerHerramientas);

// POST crear nueva herramienta
router.post("/", crearHerramienta);

// PUT actualizar herramienta
router.put("/:id", actualizarHerramienta);

// DELETE eliminar herramienta
router.delete("/:id", eliminarHerramienta);

// POST registrar movimiento
router.post("/:id/movimiento", registrarMovimiento);

// POST asignar a obra
router.post("/asignar", asignarHerramienta);

export default router;
