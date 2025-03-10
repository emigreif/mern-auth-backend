// backend/routes/panolRoutes.js
import express from "express";
import {
  obtenerPanol,
  agregarHerramienta,
  eliminarHerramienta,
  agregarPerfil,
  eliminarPerfil,
  agregarAccesorio,
  eliminarAccesorio,
  agregarVidrio,
  eliminarVidrio,
} from "../controllers/panolController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Obtener el stock de Pañol
router.get("/", protect, obtenerPanol);

// CRUD Herramientas
router.post("/herramientas", protect, agregarHerramienta);
router.delete("/herramientas/:id", protect, eliminarHerramienta);

// CRUD Perfiles
router.post("/perfiles", protect, agregarPerfil);
router.delete("/perfiles/:id", protect, eliminarPerfil);

// CRUD Accesorios
router.post("/accesorios", protect, agregarAccesorio);
router.delete("/accesorios/:id", protect, eliminarAccesorio);

// CRUD Vidrios
router.post("/vidrios", protect, agregarVidrio);
router.delete("/vidrios/:id", protect, eliminarVidrio);

export default router;
