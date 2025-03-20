import express from "express";
import {
  obtenerPanol,
  agregarHerramienta,
  modificarHerramienta,
  eliminarHerramienta,
  registrarMovimientoHerramienta,
  agregarPerfil,
  modificarPerfil,
  eliminarPerfil,
  agregarVidrio,
  modificarVidrio,
  eliminarVidrio,
  agregarAccesorio,
  modificarAccesorio,
  eliminarAccesorio
} from "../controllers/panolController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// 📌 Obtener todo el pañol del usuario
router.get("/", protect, obtenerPanol);

// 📌 Herramientas
router.post("/herramientas", protect, agregarHerramienta); // Crear
router.put("/herramientas/:id", protect, modificarHerramienta); // Modificar
router.delete("/herramientas/:id", protect, eliminarHerramienta); // Eliminar
router.post("/herramientas/:id/movimiento", protect, registrarMovimientoHerramienta); // Registrar movimiento

// 📌 Perfiles
router.post("/perfiles", protect, agregarPerfil); // Crear
router.put("/perfiles/:id", protect, modificarPerfil); // Modificar
router.delete("/perfiles/:id", protect, eliminarPerfil); // Eliminar

// 📌 Vidrios
router.post("/vidrios", protect, agregarVidrio); // Crear
router.put("/vidrios/:id", protect, modificarVidrio); // Modificar
router.delete("/vidrios/:id", protect, eliminarVidrio); // Eliminar

// 📌 Accesorios
router.post("/accesorios", protect, agregarAccesorio); // Crear
router.put("/accesorios/:id", protect, modificarAccesorio); // Modificar
router.delete("/accesorios/:id", protect, eliminarAccesorio); // Eliminar

export default router;
