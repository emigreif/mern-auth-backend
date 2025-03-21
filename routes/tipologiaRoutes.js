// backend/routes/tipologiaRoutes.js
import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  obtenerTipologias,
  obtenerTipologiaPorId,
  crearTipologia,
  actualizarTipologia,
  eliminarTipologia,
  importarTipologiasDesdeExcel,
  agruparTipologias
} from "../controllers/tipologiaController.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

// ✅ Obtener todas las tipologías
router.get("/", protect, obtenerTipologias);

// ✅ Obtener una tipología por ID
router.get("/:id", protect, obtenerTipologiaPorId);

// ✅ Crear nueva tipología
router.post("/", protect, crearTipologia);

// ✅ Actualizar una tipología existente
router.put("/:id", protect, actualizarTipologia);

// ✅ Eliminar una tipología
router.delete("/:id", protect, eliminarTipologia);

// ✅ Importar tipologías desde Excel
router.post("/importar", protect, upload.single("file"), importarTipologiasDesdeExcel);

// ✅ Agrupar tipologías
router.post("/agrupar", protect, agruparTipologias);

export default router;
