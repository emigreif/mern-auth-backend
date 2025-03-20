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
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// 📌 Obtener todo el pañol del usuario
router.get("/", authMiddleware, obtenerPanol);

// 📌 Herramientas
router.post("/herramientas", authMiddleware, agregarHerramienta); // Crear
router.put("/herramientas/:id", authMiddleware, modificarHerramienta); // Modificar
router.delete("/herramientas/:id", authMiddleware, eliminarHerramienta); // Eliminar
router.post("/herramientas/:id/movimiento", authMiddleware, registrarMovimientoHerramienta); // Registrar movimiento

// 📌 Perfiles
router.post("/perfiles", authMiddleware, agregarPerfil); // Crear
router.put("/perfiles/:id", authMiddleware, modificarPerfil); // Modificar
router.delete("/perfiles/:id", authMiddleware, eliminarPerfil); // Eliminar

// 📌 Vidrios
router.post("/vidrios", authMiddleware, agregarVidrio); // Crear
router.put("/vidrios/:id", authMiddleware, modificarVidrio); // Modificar
router.delete("/vidrios/:id", authMiddleware, eliminarVidrio); // Eliminar

// 📌 Accesorios
router.post("/accesorios", authMiddleware, agregarAccesorio); // Crear
router.put("/accesorios/:id", authMiddleware, modificarAccesorio); // Modificar
router.delete("/accesorios/:id", authMiddleware, eliminarAccesorio); // Eliminar

export default router;
