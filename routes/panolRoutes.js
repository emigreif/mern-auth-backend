// backend/routes/panolRoutes.js
import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  obtenerPanol,
  agregarHerramienta,
  eliminarHerramienta,
  agregarPerfil,      // se llama "agregarPerfil" en controller, pero se trata de "perfiles" de aluminio
  eliminarPerfil,
  agregarAccesorio,
  eliminarAccesorio,
  agregarVidrio,
  eliminarVidrio
} from "../controllers/panolController.js";

const router = express.Router();

/**
 * /api/panol => GET (obtener stock)
 * /api/panol/herramientas => POST (agregar)
 * /api/panol/herramientas/:id => DELETE
 * /api/panol/perfiles => POST
 * /api/panol/perfiles/:id => DELETE
 * /api/panol/accesorios => POST
 * /api/panol/accesorios/:id => DELETE
 * /api/panol/vidrios => POST
 * /api/panol/vidrios/:id => DELETE
 */

router.get("/", protect, obtenerPanol);

// Herramientas
router.post("/herramientas", protect, agregarHerramienta);
router.delete("/herramientas/:id", protect, eliminarHerramienta);

// Perfiles
router.post("/perfiles", protect, agregarPerfil);
router.delete("/perfiles/:id", protect, eliminarPerfil);

// Accesorios
router.post("/accesorios", protect, agregarAccesorio);
router.delete("/accesorios/:id", protect, eliminarAccesorio);

// Vidrios
router.post("/vidrios", protect, agregarVidrio);
router.delete("/vidrios/:id", protect, eliminarVidrio);

export default router;
