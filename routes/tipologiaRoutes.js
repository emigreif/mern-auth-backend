import express from "express";
import { protect } from "../middleware/authMiddleware.js"; // Middleware de autenticación
import upload from "../middleware/uploadMiddleware.js"; // Middleware para subir archivos

import {
  obtenerTipologias,
  crearTipologia,
  actualizarTipologia,
  eliminarTipologia,
  importarTipologiasDesdeExcel,
  agruparTipologias
} from "../controllers/tipologiaController.js";

const router = express.Router();

// 📌 Obtener todas las tipologías
router.get("/", protect, obtenerTipologias);

// 📌 Crear una nueva tipología
router.post("/", protect, crearTipologia);

// 📌 Actualizar una tipología por ID
router.put("/:id", protect, actualizarTipologia);

// 📌 Eliminar una tipología por ID
router.delete("/:id", protect, eliminarTipologia);

// 📌 Importar tipologías desde Excel
router.post("/importar", protect, upload.single("file"), importarTipologiasDesdeExcel);

// 📌 Agrupar tipologías
router.post("/agrupar", protect, agruparTipologias);

export default router;
