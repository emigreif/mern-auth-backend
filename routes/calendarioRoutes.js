// backend/routes/calendarioRoutes.js
import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  listarCalendarios,
  generarCalendarioDesdeObra,
  obtenerCalendario,
  actualizarCalendario,
  eliminarCalendario
} from "../controllers/calendarioController.js";

const router = express.Router();

/**
 * /api/calendario => GET (listar con filtros)
 * /api/calendario/generar => POST (body: { obraId })
 * /api/calendario/:obraId => GET (obtener), PUT (actualizar), DELETE (eliminar)
 */

router.get("/", protect, listarCalendarios);
router.post("/generar", protect, generarCalendarioDesdeObra);

router.get("/:obraId", protect, obtenerCalendario);
router.put("/:obraId", protect, actualizarCalendario);
router.delete("/:obraId", protect, eliminarCalendario);

export default router;
