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
  asignarPerfilesDesdeExcel,
  asignarVidriosManual,
  asignarPerfilesManual,
  modificarAccesorio,
  asignarVidriosDesdeExcel,
  asignarAccesoriosManual,importMateriales,
  asignarAccesoriosDesdeExcel,
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
router.post("/perfiles/asignar-manual", protect, asignarPerfilesManual);
router.post("/perfiles/asignar-excel", protect, asignarPerfilesDesdeExcel);
router.post("/:tipo/import", protect, importMateriales);
// 📌 Vidrios
router.post("/vidrios", protect, agregarVidrio); // Crear
router.put("/vidrios/:id", protect, modificarVidrio); // Modificar
router.delete("/vidrios/:id", protect, eliminarVidrio); // Eliminar
// 📐 Asignar vidrios (manual y excel)
router.post("/vidrios/asignar-manual", protect, asignarVidriosManual);
router.post("/vidrios/asignar-excel", protect, asignarVidriosDesdeExcel);

// 📌 Accesorios
router.post("/accesorios", protect, agregarAccesorio); // Crear
router.put("/accesorios/:id", protect, modificarAccesorio); // Modificar
router.delete("/accesorios/:id", protect, eliminarAccesorio); // Eliminar
// 📦 Asignar accesorios a obra
router.post("/accesorios/asignar-manual", protect, asignarAccesoriosManual);
router.post("/accesorios/asignar-excel", protect, asignarAccesoriosDesdeExcel);


export default router;
