// backend/routes/ubicacionRoutes.js
import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  listarUbicaciones,
  obtenerUbicacion,
  crearUbicacion,
  actualizarUbicacion,
  eliminarUbicacion,
  generarUbicaciones
} from "../controllers/ubicacionController.js";

const router = express.Router();

/**
 * /api/ubicaciones => GET (listar), POST (crear)
 * /api/ubicaciones/:id => GET, PUT, DELETE
 * /api/ubicaciones/generar => POST (crear en masa)
 */

router.get("/", protect, listarUbicaciones);
router.post("/", protect, crearUbicacion);

router.get("/:id", protect, obtenerUbicacion);
router.put("/:id", protect, actualizarUbicacion);
router.delete("/:id", protect, eliminarUbicacion);

router.post("/generar", protect, generarUbicaciones);

export default router;
