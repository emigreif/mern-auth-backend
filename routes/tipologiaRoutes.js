// backend/routes/tipologiaRoutes.js
import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  listarTipologias,
  obtenerTipologia,
  crearTipologia,
  actualizarTipologia,
  eliminarTipologia,
  agruparTipologias,
  importarTipologias
} from "../controllers/tipologiaController.js";
import multer from "multer";

const upload = multer(); // Para recibir archivos en memoria

const router = express.Router();

router.get("/", protect, listarTipologias);
router.get("/:id", protect, obtenerTipologia);
router.post("/", protect, crearTipologia);
router.put("/:id", protect, actualizarTipologia);
router.delete("/:id", protect, eliminarTipologia);

// Rutas extra
router.post("/importar", protect, upload.single("archivoExcel"), importarTipologias);
router.post("/agrupar", protect, agruparTipologias);

export default router;
